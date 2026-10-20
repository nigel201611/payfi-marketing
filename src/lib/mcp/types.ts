export const mcpToolNames = [
  'setup_crb_funding',
  'check_crb_balance',
  'create_trade_order',
  'execute_crb_payment',
  'reject_payment',
  'verify_crb_settlement',
  'execute_onchain_settlement',
  'confirm_delivery',
] as const;

export type McpToolName = (typeof mcpToolNames)[number];

export type McpServerName = 'crb' | 'rwa';

/** Which backend MCP owns each tool. `reject_payment` is local today but maps to CRB. */
export const mcpToolServer: Record<McpToolName, McpServerName> = {
  setup_crb_funding: 'crb',
  check_crb_balance: 'crb',
  create_trade_order: 'rwa',
  execute_crb_payment: 'crb',
  reject_payment: 'crb',
  verify_crb_settlement: 'crb',
  execute_onchain_settlement: 'rwa',
  confirm_delivery: 'rwa',
};

export const settlementToolNames = [
  'execute_crb_payment',
  'verify_crb_settlement',
  'execute_onchain_settlement',
] as const;

export type SettlementToolName = (typeof settlementToolNames)[number];

/** Tools the demo is allowed to reach through the BFF facade. */
export const bffToolNames = [...settlementToolNames, 'confirm_delivery'] as const;

export type BffToolName = (typeof bffToolNames)[number];

export type McpToolInputs = {
  setup_crb_funding: { intent_desc: string; max_budget: number; address_x: string };
  check_crb_balance: { crb_account_id: string };
  create_trade_order: { asset_id: string; buy_amount: number };
  execute_crb_payment: { order_id: string; payee_crb_acct: string; amount: number };
  reject_payment: { order_id: string };
  verify_crb_settlement: { order_id: string; crb_tx_id: string };
  execute_onchain_settlement: { address_x: string; rwa_amount: number };
  confirm_delivery: { order_id: string; receipt_hash: string };
};

export type McpToolOutputs = {
  setup_crb_funding: { crb_account_id: string; routing_number: string; account_number: string };
  check_crb_balance: { crb_account_id: string; available: number; currency: 'USD' };
  create_trade_order: { order_id: string; asset_id: string; buy_amount: number };
  execute_crb_payment: { order_id: string; status: 'paid'; crb_tx_id: string };
  reject_payment: { order_id: string; status: 'cancelled' };
  verify_crb_settlement: { order_id: string; status: 'confirmed'; crb_tx_id: string };
  execute_onchain_settlement: {
    address_x: string;
    rwa_amount: number;
    status: 'settled';
    tx_hash: string;
  };
  confirm_delivery: { order_id: string; status: 'archived'; receipt_hash: string };
};

export type McpToolResult<N extends McpToolName = McpToolName> =
  { ok: true; output: McpToolOutputs[N] } | { ok: false; error: string; code?: string };

export type McpCallOptions = { signal?: AbortSignal };

export interface McpTransport {
  callTool<N extends McpToolName>(
    name: N,
    input: McpToolInputs[N],
    options?: McpCallOptions,
  ): Promise<McpToolResult<N>>;
}

export function isMcpToolName(value: unknown): value is McpToolName {
  return typeof value === 'string' && (mcpToolNames as readonly string[]).includes(value);
}

export function isSettlementToolName(value: unknown): value is SettlementToolName {
  return typeof value === 'string' && (settlementToolNames as readonly string[]).includes(value);
}

export function isBffToolName(value: unknown): value is BffToolName {
  return typeof value === 'string' && (bffToolNames as readonly string[]).includes(value);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
