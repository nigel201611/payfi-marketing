export const codeSamples = [
  {
    id: 'cli',
    label: 'CLI',
    filename: 'terminal',
    language: 'bash',
    code: `# Install and initialise
npx @exio/agent-wallet init

# Pair an agent with a spending policy
exio agents connect hermes --policy standard

# Let it request a purchase
exio spend request \\
  --agent hermes \\
  --merchant triplo.com \\
  --amount 180.00 --currency usd`,
  },
  {
    id: 'mcp',
    label: 'MCP',
    filename: 'mcp.json',
    language: 'json',
    code: `{
  "mcpServers": {
    "exio-wallet": {
      "command": "npx",
      "args": ["@exio/agent-wallet", "mcp"],
      "env": {
        "EXIO_API_KEY": "\${EXIO_API_KEY}"
      }
    }
  }
}`,
  },
  {
    id: 'node',
    label: 'Node',
    filename: 'agent.ts',
    language: 'ts',
    code: `import { AgentWallet } from '@exio/agent-wallet';

const wallet = new AgentWallet({
  apiKey: process.env.EXIO_API_KEY,
});

const request = await wallet.spend.request({
  agent: 'hermes',
  merchant: 'triplo.com',
  amount: 180.0,
  currency: 'usd',
});

await wallet.spend.waitForApproval(request.id);`,
  },
] as const;
