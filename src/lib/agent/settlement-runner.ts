import { isAbortError, sleep } from '@/lib/async';
import { buildDeterministicSettlementPlan, validateSettlementPlan } from '@/lib/agent/policy';
import type {
  AgentEvent,
  SettlementContext,
  SettlementPlan,
  SettlementPlanStep,
} from '@/lib/agent/types';
import type { McpTransport } from '@/lib/mcp/types';

const DEFAULT_DELAYS = {
  clearing: 350,
  payment: 1900,
  settle: 5000,
};

type Delay = (ms: number, signal?: AbortSignal) => Promise<void>;
type PlanRequester = (context: SettlementContext, signal?: AbortSignal) => Promise<SettlementPlan>;

export type SettlementRunnerOptions = {
  context: SettlementContext;
  transport: McpTransport;
  onEvent: (event: AgentEvent) => void;
  signal?: AbortSignal;
  requestPlan?: PlanRequester;
  delays?: Partial<typeof DEFAULT_DELAYS>;
  delay?: Delay;
};

async function requestBffPlan(
  context: SettlementContext,
  signal?: AbortSignal,
): Promise<SettlementPlan> {
  if (process.env.NEXT_PUBLIC_BFF_ENABLED !== 'true') {
    return buildDeterministicSettlementPlan(context);
  }

  try {
    const response = await fetch('/api/agent/plan', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(context),
      signal,
    });
    if (!response.ok) return buildDeterministicSettlementPlan(context);

    const payload = (await response.json()) as { plan?: unknown };
    return (
      validateSettlementPlan(payload.plan, context) ?? buildDeterministicSettlementPlan(context)
    );
  } catch (error) {
    if (signal?.aborted || isAbortError(error)) throw error;
    return buildDeterministicSettlementPlan(context);
  }
}

function takeStep<T extends SettlementPlanStep['tool']>(
  plan: SettlementPlan,
  tool: T,
): Extract<SettlementPlanStep, { tool: T }> | null {
  return (plan.steps.find((step) => step.tool === tool) ?? null) as Extract<
    SettlementPlanStep,
    { tool: T }
  > | null;
}

export async function runSettlement({
  context,
  transport,
  onEvent,
  signal,
  requestPlan = requestBffPlan,
  delays: delayOverrides,
  delay = sleep,
}: SettlementRunnerOptions): Promise<void> {
  const delays = { ...DEFAULT_DELAYS, ...delayOverrides };
  let currentTool: SettlementPlanStep['tool'] | undefined;

  try {
    const plan = await requestPlan(context, signal);
    onEvent({ type: 'plan_ready', source: plan.source, toolCount: plan.steps.length });

    const payStep = takeStep(plan, 'execute_crb_payment');
    const verifyStep = takeStep(plan, 'verify_crb_settlement');
    const onchainStep = takeStep(plan, 'execute_onchain_settlement');
    if (!payStep || !verifyStep || !onchainStep) {
      throw new Error('Settlement plan is missing a required MCP tool');
    }

    currentTool = 'execute_crb_payment';
    onEvent({ type: 'tool_start', tool: currentTool });
    const paymentPromise = transport
      .callTool('execute_crb_payment', payStep.input, { signal })
      .catch((error: unknown) => ({
        ok: false as const,
        error: error instanceof Error ? error.message : 'MCP call failed',
      }));
    await delay(delays.clearing, signal);
    onEvent({ type: 'clearing' });

    const remainingPaymentDelay = Math.max(0, delays.payment - delays.clearing);
    const [payment] = await Promise.all([paymentPromise, delay(remainingPaymentDelay, signal)]);
    onEvent({ type: 'tool_result', tool: currentTool, ok: payment.ok });
    if (!payment.ok) throw new Error(payment.error);

    onEvent({ type: 'paid', txId: payment.output.crb_tx_id });
    onEvent({ type: 'settlement_started' });

    currentTool = 'verify_crb_settlement';
    onEvent({ type: 'tool_start', tool: currentTool });
    const verification = await transport.callTool(
      'verify_crb_settlement',
      { order_id: verifyStep.input.order_id, crb_tx_id: payment.output.crb_tx_id },
      { signal },
    );
    onEvent({ type: 'tool_result', tool: currentTool, ok: verification.ok });
    if (!verification.ok) throw new Error(verification.error);

    currentTool = 'execute_onchain_settlement';
    onEvent({ type: 'tool_start', tool: currentTool });
    const [settlement] = await Promise.all([
      transport.callTool('execute_onchain_settlement', onchainStep.input, { signal }),
      delay(delays.settle, signal),
    ]);
    onEvent({ type: 'tool_result', tool: currentTool, ok: settlement.ok });
    if (!settlement.ok) throw new Error(settlement.error);

    onEvent({ type: 'settled', txHash: settlement.output.tx_hash });
  } catch (error) {
    if (signal?.aborted || isAbortError(error)) return;
    onEvent({
      type: 'failed',
      tool: currentTool,
      error: error instanceof Error ? error.message : 'Settlement failed',
    });
  }
}
