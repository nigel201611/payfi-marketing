import { describe, expect, it } from 'vitest';
import { demoConfig } from '@/constants/terminal';
import { createMockMcpTransport } from '@/lib/mcp/mock-transport';

const fast = {
  execute_crb_payment: 0,
  verify_crb_settlement: 0,
  execute_onchain_settlement: 0,
} as const;

describe('mock MCP transport', () => {
  it('runs the settlement tool chain with deterministic outputs', async () => {
    const mcp = createMockMcpTransport({ latency: fast });

    const payment = await mcp.callTool('execute_crb_payment', {
      order_id: demoConfig.orderRef,
      payee_crb_acct: demoConfig.payeeAccount,
      amount: 16_000,
    });
    expect(payment.ok).toBe(true);
    if (!payment.ok) return;
    expect(payment.output.crb_tx_id).toBe(demoConfig.crbTxId);

    const verification = await mcp.callTool('verify_crb_settlement', {
      order_id: demoConfig.orderRef,
      crb_tx_id: payment.output.crb_tx_id,
    });
    expect(verification).toMatchObject({
      ok: true,
      output: { status: 'confirmed', crb_tx_id: demoConfig.crbTxId },
    });

    const settlement = await mcp.callTool('execute_onchain_settlement', {
      address_x: demoConfig.wallets.a,
      rwa_amount: 16,
    });
    expect(settlement).toMatchObject({
      ok: true,
      output: { status: 'settled', tx_hash: demoConfig.txId, rwa_amount: 16 },
    });
  });

  it('aborts an in-flight call', async () => {
    const mcp = createMockMcpTransport({ latency: { execute_crb_payment: 1_000 } });
    const controller = new AbortController();
    const call = mcp.callTool(
      'execute_crb_payment',
      { order_id: demoConfig.orderRef, payee_crb_acct: demoConfig.payeeAccount, amount: 16_000 },
      { signal: controller.signal },
    );

    controller.abort();
    await expect(call).rejects.toMatchObject({ name: 'AbortError' });
  });
});
