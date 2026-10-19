import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApprovalDemo } from '@/components/demo/approval-demo';

describe('ApprovalDemo', () => {
  it('renders a pending spend request with policy checks', () => {
    render(<ApprovalDemo />);

    expect(screen.getByText(/wants to spend/i)).toBeInTheDocument();
    expect(screen.getByText('$180.00')).toBeInTheDocument();
    expect(screen.getByText('Triplo')).toBeInTheDocument();
    expect(screen.getByText('Merchant verified')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /approve with passkey/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /decline/i })).toBeInTheDocument();
  });

  it('approves the request and issues a one-time credential', async () => {
    const user = userEvent.setup();
    render(<ApprovalDemo />);

    await user.click(screen.getByRole('button', { name: /approve with passkey/i }));

    expect(await screen.findByText('Approved by you')).toBeInTheDocument();
    expect(screen.getAllByText(/one-time credential was issued/i).length).toBeGreaterThan(0);
    expect(screen.getByText('Visa ·· 9081')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/approved/i);
  });

  it('declines the request without issuing credentials', async () => {
    const user = userEvent.setup();
    render(<ApprovalDemo />);

    await user.click(screen.getByRole('button', { name: /decline/i }));

    expect(await screen.findByText('Request declined')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/declined/i);
    expect(screen.queryByText(/one-time credential was issued/i)).not.toBeInTheDocument();
  });

  it('resets the demo back to the pending state', async () => {
    const user = userEvent.setup();
    render(<ApprovalDemo />);

    await user.click(screen.getByRole('button', { name: /approve with passkey/i }));
    await screen.findByText('Approved by you');
    await user.click(screen.getByRole('button', { name: /reset demo/i }));

    expect(
      await screen.findByRole('button', { name: /approve with passkey/i }, { timeout: 2500 }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Approved by you')).not.toBeInTheDocument();
  });
});
