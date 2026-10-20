import type { McpToolInputs, SettlementToolName } from '@/lib/mcp/types';

export type SettlementContext = {
  orderId: string;
  assetId: string;
  amount: number;
  rwaAmount: number;
  payeeAccount: string;
  walletAddress: string;
};

export type SettlementPlanStep =
  | { tool: 'execute_crb_payment'; input: McpToolInputs['execute_crb_payment'] }
  | { tool: 'verify_crb_settlement'; input: { order_id: string; crb_tx_id: string } }
  | { tool: 'execute_onchain_settlement'; input: McpToolInputs['execute_onchain_settlement'] };

export type SettlementPlanSource = 'llm' | 'deterministic';

export type SettlementPlan = {
  source: SettlementPlanSource;
  steps: SettlementPlanStep[];
  rationale?: string;
};

export type AgentEvent =
  | { type: 'plan_ready'; source: SettlementPlanSource; toolCount: number }
  | { type: 'tool_start'; tool: SettlementToolName }
  | { type: 'tool_result'; tool: SettlementToolName; ok: boolean }
  | { type: 'clearing' }
  | { type: 'paid'; txId: string }
  | { type: 'settlement_started' }
  | { type: 'settled'; txHash: string }
  | { type: 'failed'; tool?: SettlementToolName; error: string };
