import { demoConfig } from '@/constants/terminal';
import { sleep } from '@/lib/async';
import type {
  McpCallOptions,
  McpToolInputs,
  McpToolName,
  McpToolOutputs,
  McpToolResult,
  McpTransport,
} from '@/lib/mcp/types';

const defaultLatency: Record<McpToolName, number> = {
  setup_crb_funding: 120,
  check_crb_balance: 80,
  create_trade_order: 100,
  execute_crb_payment: 140,
  reject_payment: 80,
  verify_crb_settlement: 90,
  execute_onchain_settlement: 120,
  confirm_delivery: 80,
};

export function createMockMcpTransport(
  options: { latency?: Partial<Record<McpToolName, number>> } = {},
): McpTransport {
  const latency = { ...defaultLatency, ...options.latency };

  return {
    async callTool<N extends McpToolName>(
      name: N,
      input: McpToolInputs[N],
      callOptions?: McpCallOptions,
    ): Promise<McpToolResult<N>> {
      await sleep(latency[name], callOptions?.signal);

      if (name === 'setup_crb_funding') {
        const output = {
          crb_account_id: 'CRB-ACCT-2026-0842',
          routing_number: demoConfig.routingNumber,
          account_number: demoConfig.accountNumber,
        } satisfies McpToolOutputs['setup_crb_funding'];
        return { ok: true, output } as McpToolResult<N>;
      }

      if (name === 'check_crb_balance') {
        const typed = input as McpToolInputs['check_crb_balance'];
        const output = {
          crb_account_id: typed.crb_account_id,
          available: demoConfig.maxBudget,
          currency: 'USD' as const,
        } satisfies McpToolOutputs['check_crb_balance'];
        return { ok: true, output } as McpToolResult<N>;
      }

      if (name === 'create_trade_order') {
        const typed = input as McpToolInputs['create_trade_order'];
        const output = {
          order_id: demoConfig.orderRef,
          asset_id: typed.asset_id,
          buy_amount: typed.buy_amount,
        } satisfies McpToolOutputs['create_trade_order'];
        return { ok: true, output } as McpToolResult<N>;
      }

      if (name === 'execute_crb_payment') {
        const typed = input as McpToolInputs['execute_crb_payment'];
        const output = {
          order_id: typed.order_id,
          status: 'paid' as const,
          crb_tx_id: demoConfig.crbTxId,
        } satisfies McpToolOutputs['execute_crb_payment'];
        return { ok: true, output } as McpToolResult<N>;
      }

      if (name === 'reject_payment') {
        const typed = input as McpToolInputs['reject_payment'];
        const output = {
          order_id: typed.order_id,
          status: 'cancelled' as const,
        } satisfies McpToolOutputs['reject_payment'];
        return { ok: true, output } as McpToolResult<N>;
      }

      if (name === 'verify_crb_settlement') {
        const typed = input as McpToolInputs['verify_crb_settlement'];
        const output = {
          order_id: typed.order_id,
          status: 'confirmed' as const,
          crb_tx_id: typed.crb_tx_id,
        } satisfies McpToolOutputs['verify_crb_settlement'];
        return { ok: true, output } as McpToolResult<N>;
      }

      if (name === 'execute_onchain_settlement') {
        const typed = input as McpToolInputs['execute_onchain_settlement'];
        const output = {
          address_x: typed.address_x,
          rwa_amount: typed.rwa_amount,
          status: 'settled' as const,
          tx_hash: demoConfig.txId,
        } satisfies McpToolOutputs['execute_onchain_settlement'];
        return { ok: true, output } as McpToolResult<N>;
      }

      const typed = input as McpToolInputs['confirm_delivery'];
      const output = {
        order_id: typed.order_id,
        status: 'archived' as const,
        receipt_hash: typed.receipt_hash,
      } satisfies McpToolOutputs['confirm_delivery'];
      return { ok: true, output } as McpToolResult<N>;
    },
  };
}
