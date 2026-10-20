import type {
  McpCallOptions,
  McpToolInputs,
  McpToolName,
  McpToolOutputs,
  McpToolResult,
  McpTransport,
} from '@/lib/mcp/types';

type BffToolResponse = {
  ok?: boolean;
  output?: unknown;
  error?: string;
};

/** Browser-side transport: calls the Next BFF, which owns the real MCP client. */
export function createBffMcpTransport(endpoint = '/api/mcp/tool'): McpTransport {
  return {
    async callTool<N extends McpToolName>(
      name: N,
      input: McpToolInputs[N],
      options?: McpCallOptions,
    ): Promise<McpToolResult<N>> {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name, input }),
          signal: options?.signal,
        });

        if (!response.ok) {
          return { ok: false, error: `MCP BFF ${response.status}`, code: String(response.status) };
        }

        const payload = (await response.json()) as BffToolResponse;
        if (!payload.ok || payload.output === undefined) {
          return { ok: false, error: payload.error ?? 'MCP BFF call failed' };
        }

        return { ok: true, output: payload.output as McpToolOutputs[N] } as McpToolResult<N>;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return { ok: false, error: 'MCP call aborted' };
        }
        return {
          ok: false,
          error: error instanceof Error ? error.message : 'MCP BFF request failed',
        };
      }
    },
  };
}
