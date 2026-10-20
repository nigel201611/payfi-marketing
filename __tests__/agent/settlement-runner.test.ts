import { describe, expect, it } from 'vitest';
import { sleep } from '@/lib/async';
import { buildDeterministicSettlementPlan, validateSettlementPlan } from '@/lib/agent/policy';
import { runSettlement } from '@/lib/agent/settlement-runner';
import type { AgentEvent, SettlementContext } from '@/lib/agent/types';
import type { McpToolName, McpTransport } from '@/lib/mcp/types';

const context: SettlementContext = {
  orderId: 'NKA-ORD-2026-0842',
  assetId: 'RWA-BOND-TREAS-30',
  amount: 16_000,
  rwaAmount: 16,
  payeeAccount: 'CRB •••• 3456',
  walletAddress: '0x3f5e…9aC2',
};

function createFakeTransport(calls: Array<{ name: McpToolName; input: unknown }>): McpTransport {
  return {
    async callTool(name, input) {
      calls.push({ name, input });
      if (name === 'execute_crb_payment') {
        return {
          ok: true,
          output: { order_id: context.orderId, status: 'paid', crb_tx_id: 'CRB-TEST-42' },
        } as never;
      }
      if (name === 'verify_crb_settlement') {
        return {
          ok: true,
          output: {
            order_id: context.orderId,
            status: 'confirmed',
            crb_tx_id: 'CRB-TEST-42',
          },
        } as never;
      }
      return {
        ok: true,
        output: {
          address_x: context.walletAddress,
          rwa_amount: context.rwaAmount,
          status: 'settled',
          tx_hash: '0xabc',
        },
      } as never;
    },
  };
}

describe('settlement agent', () => {
  it('builds the deterministic plan and accepts it through the guard', () => {
    const plan = buildDeterministicSettlementPlan(context);
    expect(plan.steps.map((step) => step.tool)).toEqual([
      'execute_crb_payment',
      'verify_crb_settlement',
      'execute_onchain_settlement',
    ]);
    expect(validateSettlementPlan(plan, context)).toMatchObject({ source: 'deterministic' });
  });

  it('rejects a plan that changes the payee, amount or wallet', () => {
    const plan = buildDeterministicSettlementPlan(context);
    const tampered = structuredClone(plan) as unknown as {
      steps: Array<{ input: Record<string, unknown> }>;
    };
    tampered.steps[0].input.amount = 999_999;
    expect(validateSettlementPlan(tampered, context)).toBeNull();

    const redirected = structuredClone(plan) as unknown as {
      steps: Array<{ input: Record<string, unknown> }>;
    };
    redirected.steps[2].input.address_x = '0xattacker';
    expect(validateSettlementPlan(redirected, context)).toBeNull();
  });

  it('runs MCP calls in order and resolves the CRB transaction id', async () => {
    const calls: Array<{ name: McpToolName; input: unknown }> = [];
    const events: AgentEvent[] = [];

    await runSettlement({
      context,
      transport: createFakeTransport(calls),
      requestPlan: async (input) => buildDeterministicSettlementPlan(input),
      delay: async () => {},
      onEvent: (event) => events.push(event),
    });

    expect(calls.map((call) => call.name)).toEqual([
      'execute_crb_payment',
      'verify_crb_settlement',
      'execute_onchain_settlement',
    ]);
    expect(calls[1].input).toMatchObject({ crb_tx_id: 'CRB-TEST-42' });
    expect(events.map((event) => event.type)).toEqual([
      'plan_ready',
      'tool_start',
      'clearing',
      'tool_result',
      'paid',
      'settlement_started',
      'tool_start',
      'tool_result',
      'tool_start',
      'tool_result',
      'settled',
    ]);
    expect(events.at(-1)).toEqual({ type: 'settled', txHash: '0xabc' });
  });

  it('stops silently when the run is aborted', async () => {
    const controller = new AbortController();
    const events: AgentEvent[] = [];
    controller.abort();

    await runSettlement({
      context,
      transport: createFakeTransport([]),
      signal: controller.signal,
      requestPlan: async (input) => buildDeterministicSettlementPlan(input),
      delay: sleep,
      onEvent: (event) => events.push(event),
    });

    expect(events.some((event) => event.type === 'failed')).toBe(false);
    expect(events.some((event) => event.type === 'settled')).toBe(false);
  });
});
