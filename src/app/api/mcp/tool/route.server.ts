import { createHttpMcpTransport } from '@/lib/mcp/http-transport';
import { createMockMcpTransport } from '@/lib/mcp/mock-transport';
import type { McpServerName, McpToolInputs, McpTransport } from '@/lib/mcp/types';
import { isBffToolName, isRecord, mcpToolServer } from '@/lib/mcp/types';

const mockTransport = createMockMcpTransport();

function createServerTransport(server: McpServerName): McpTransport {
  const url = server === 'crb' ? process.env.MCP_CRB_SERVER_URL : process.env.MCP_RWA_SERVER_URL;
  const token =
    server === 'crb' ? process.env.MCP_CRB_SERVER_TOKEN : process.env.MCP_RWA_SERVER_TOKEN;

  return url ? createHttpMcpTransport({ url, token }) : mockTransport;
}

// Each backend can be connected independently; an empty URL keeps that
// server on the in-process mock while the other one is live.
const transports: Record<McpServerName, McpTransport> = {
  crb: createServerTransport('crb'),
  rwa: createServerTransport('rwa'),
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!isRecord(body) || !isBffToolName(body.name) || !isRecord(body.input)) {
    return Response.json({ ok: false, error: 'Unsupported MCP tool' }, { status: 400 });
  }

  const server = mcpToolServer[body.name];
  const result = await transports[server].callTool(
    body.name,
    body.input as McpToolInputs[typeof body.name],
    { signal: request.signal },
  );

  return Response.json({ ...result, server }, { status: result.ok ? 200 : 502 });
}
