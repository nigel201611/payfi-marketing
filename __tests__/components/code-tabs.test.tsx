import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CodeTabs } from '@/components/developers/code-tabs';

describe('CodeTabs', () => {
  it('shows the CLI snippet by default and switches to MCP', async () => {
    const user = userEvent.setup();
    render(<CodeTabs />);

    expect(screen.getByText('npx @exio/agent-wallet init')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'MCP' }));

    expect(await screen.findByText(/mcpServers/)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'MCP' })).toHaveAttribute('aria-selected', 'true');
  });

  it('switches to the Node snippet', async () => {
    const user = userEvent.setup();
    render(<CodeTabs />);

    await user.click(screen.getByRole('tab', { name: 'Node' }));

    expect(await screen.findByText(/new AgentWallet/)).toBeInTheDocument();
  });
});
