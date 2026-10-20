import { createBffMcpTransport } from '@/lib/mcp/bff-transport';
import { createMockMcpTransport } from '@/lib/mcp/mock-transport';
import type { McpTransport } from '@/lib/mcp/types';

/**
 * The Pages static export has no BFF; it uses the in-browser mock transport.
 * Local/Node deployments use the BFF, which can forward to the real backend MCP.
 */
export function createRuntimeMcpTransport(): McpTransport {
  return process.env.NEXT_PUBLIC_BFF_ENABLED === 'true'
    ? createBffMcpTransport()
    : createMockMcpTransport();
}
