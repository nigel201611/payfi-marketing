import type {
  McpCallOptions,
  McpToolInputs,
  McpToolName,
  McpToolOutputs,
  McpToolResult,
  McpTransport,
} from '@/lib/mcp/types';

export type HttpMcpTransportOptions = {
  url: string;
  token?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
};

type JsonRpcResponse = {
  result?: {
    structuredContent?: unknown;
    content?: Array<{ type?: string; text?: string }>;
  };
  error?: { code?: number; message?: string };
};

function readToolOutput(payload: JsonRpcResponse): unknown {
  if (payload.result?.structuredContent !== undefined) return payload.result.structuredContent;
  const text = payload.result?.content?.find((item) => item.type === 'text')?.text;
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

/**
 * Minimal MCP Streamable HTTP adapter (JSON-RPC `tools/call`).
 * The backend MCP contract may add session headers or SSE framing; adjust here
 * without touching the agent or the browser runtime.
 */
export function createHttpMcpTransport(options: HttpMcpTransportOptions): McpTransport {
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? 15_000;
  let requestId = 0;

  return {
    async callTool<N extends McpToolName>(
      name: N,
      input: McpToolInputs[N],
      callOptions?: McpCallOptions,
    ): Promise<McpToolResult<N>> {
      const timeout = AbortSignal.timeout(timeoutMs);
      const signal = callOptions?.signal ? AbortSignal.any([callOptions.signal, timeout]) : timeout;

      try {
        const response = await fetchImpl(options.url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            accept: 'application/json, text/event-stream',
            ...(options.token ? { authorization: `Bearer ${options.token}` } : {}),
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: ++requestId,
            method: 'tools/call',
            params: { name, arguments: input },
          }),
          signal,
        });

        if (!response.ok) {
          return { ok: false, error: `MCP HTTP ${response.status}`, code: String(response.status) };
        }

        const payload = (await response.json()) as JsonRpcResponse;
        if (payload.error) {
          return { ok: false, error: payload.error.message ?? 'MCP tool call failed' };
        }

        const output = readToolOutput(payload);
        if (output === undefined) {
          return { ok: false, error: 'MCP tool returned no structured content' };
        }

        return { ok: true, output: output as McpToolOutputs[N] } as McpToolResult<N>;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return { ok: false, error: 'MCP call aborted' };
        }
        return { ok: false, error: error instanceof Error ? error.message : 'MCP request failed' };
      }
    },
  };
}
