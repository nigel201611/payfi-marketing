import { describe, expect, it } from 'vitest';
import { bffToolNames, isBffToolName, mcpToolNames, mcpToolServer } from '@/lib/mcp/types';

describe('MCP server routing', () => {
  it('routes CRB funding, payment and verification to the CRB server', () => {
    expect(mcpToolServer.setup_crb_funding).toBe('crb');
    expect(mcpToolServer.check_crb_balance).toBe('crb');
    expect(mcpToolServer.execute_crb_payment).toBe('crb');
    expect(mcpToolServer.verify_crb_settlement).toBe('crb');
    expect(mcpToolServer.reject_payment).toBe('crb');
  });

  it('routes order and on-chain delivery tools to the RWA server', () => {
    expect(mcpToolServer.create_trade_order).toBe('rwa');
    expect(mcpToolServer.execute_onchain_settlement).toBe('rwa');
    expect(mcpToolServer.confirm_delivery).toBe('rwa');
  });

  it('maps every tool to a known server', () => {
    for (const name of mcpToolNames) {
      expect(['crb', 'rwa']).toContain(mcpToolServer[name]);
    }
  });

  it('keeps the BFF whitelist limited to settlement and delivery', () => {
    expect([...bffToolNames]).toEqual([
      'execute_crb_payment',
      'verify_crb_settlement',
      'execute_onchain_settlement',
      'confirm_delivery',
    ]);
    expect(isBffToolName('setup_crb_funding')).toBe(false);
    expect(isBffToolName('confirm_delivery')).toBe(true);
  });
});
