import { createHttpMcpTransport } from '@/lib/mcp/http-transport';
import { createMockMcpTransport } from '@/lib/mcp/mock-transport';
import type { McpToolInputs } from '@/lib/mcp/types';
import { isBffToolName, isRecord } from '@/lib/mcp/types';

const mcpServerUrl = process.env.MCP_SERVER_URL;
const mcpServerToken = process.env.MCP_SERVER_TOKEN;

const transport = mcpServerUrl
  ? createHttpMcpTransport({ url: mcpServerUrl, token: mcpServerToken })
  : createMockMcpTransport();

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

  const result = await transport.callTool(body.name, body.input as McpToolInputs[typeof body.name]);
  return Response.json(result, { status: result.ok ? 200 : 502 });
}
