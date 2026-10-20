import type { SettlementContext, SettlementPlan, SettlementPlanStep } from '@/lib/agent/types';
import { isRecord, settlementToolNames } from '@/lib/mcp/types';

export const CRB_TX_PLACEHOLDER = '$crb_tx_id';

export function isSettlementContext(value: unknown): value is SettlementContext {
  if (!isRecord(value)) return false;
  return (
    typeof value.orderId === 'string' &&
    value.orderId.length > 0 &&
    typeof value.assetId === 'string' &&
    value.assetId.length > 0 &&
    typeof value.payeeAccount === 'string' &&
    value.payeeAccount.length > 0 &&
    typeof value.walletAddress === 'string' &&
    value.walletAddress.length > 0 &&
    typeof value.amount === 'number' &&
    Number.isFinite(value.amount) &&
    value.amount > 0 &&
    typeof value.rwaAmount === 'number' &&
    Number.isFinite(value.rwaAmount) &&
    value.rwaAmount > 0
  );
}

export function buildDeterministicSettlementPlan(context: SettlementContext): SettlementPlan {
  return {
    source: 'deterministic',
    steps: [
      {
        tool: 'execute_crb_payment',
        input: {
          order_id: context.orderId,
          payee_crb_acct: context.payeeAccount,
          amount: context.amount,
        },
      },
      {
        tool: 'verify_crb_settlement',
        input: { order_id: context.orderId, crb_tx_id: CRB_TX_PLACEHOLDER },
      },
      {
        tool: 'execute_onchain_settlement',
        input: { address_x: context.walletAddress, rwa_amount: context.rwaAmount },
      },
    ],
  };
}

function readString(input: Record<string, unknown>, key: string): string | null {
  const value = input[key];
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function readNumber(input: Record<string, unknown>, key: string): number | null {
  const value = input[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/**
 * Deterministic guard for LLM output. The model may phrase the plan, but the
 * order, payee, amount and wallet must match the signed user intent exactly.
 */
export function validateSettlementPlan(
  candidate: unknown,
  context: SettlementContext,
): SettlementPlan | null {
  if (!isRecord(candidate) || !Array.isArray(candidate.steps)) return null;
  if (candidate.steps.length !== settlementToolNames.length) return null;

  const expectedOrder = settlementToolNames;
  const steps: SettlementPlanStep[] = [];

  for (const [index, rawStep] of candidate.steps.entries()) {
    if (!isRecord(rawStep) || !isRecord(rawStep.input)) return null;
    const tool = rawStep.tool;
    if (tool !== expectedOrder[index]) return null;

    if (tool === 'execute_crb_payment') {
      const orderId = readString(rawStep.input, 'order_id');
      const payee = readString(rawStep.input, 'payee_crb_acct');
      const amount = readNumber(rawStep.input, 'amount');
      if (
        orderId !== context.orderId ||
        payee !== context.payeeAccount ||
        amount !== context.amount
      ) {
        return null;
      }
      steps.push({
        tool,
        input: { order_id: orderId, payee_crb_acct: payee, amount },
      });
      continue;
    }

    if (tool === 'verify_crb_settlement') {
      const orderId = readString(rawStep.input, 'order_id');
      const crbTxId = readString(rawStep.input, 'crb_tx_id');
      if (orderId !== context.orderId || !crbTxId) return null;
      steps.push({ tool, input: { order_id: orderId, crb_tx_id: crbTxId } });
      continue;
    }

    if (tool !== 'execute_onchain_settlement') return null;
    const address = readString(rawStep.input, 'address_x');
    const rwaAmount = readNumber(rawStep.input, 'rwa_amount');
    if (address !== context.walletAddress || rwaAmount !== context.rwaAmount) return null;
    steps.push({ tool, input: { address_x: address, rwa_amount: rwaAmount } });
  }

  const rationale =
    typeof candidate.rationale === 'string' && candidate.rationale.trim().length > 0
      ? candidate.rationale.trim().slice(0, 280)
      : undefined;

  return {
    source: candidate.source === 'deterministic' ? 'deterministic' : 'llm',
    steps,
    rationale,
  };
}
