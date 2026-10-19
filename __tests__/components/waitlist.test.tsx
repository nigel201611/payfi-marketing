import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WaitlistButton } from '@/components/ui/waitlist';

describe('Waitlist flow', () => {
  it('opens the dialog and rejects an invalid email', async () => {
    const user = userEvent.setup();
    render(<WaitlistButton>Join the waitlist</WaitlistButton>);

    await user.click(screen.getByRole('button', { name: 'Join the waitlist' }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Join the agent wallet waitlist')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Work email'), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /join the private beta/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid work email address.');
  });

  it('submits a valid email and shows the success state', async () => {
    const user = userEvent.setup();
    render(<WaitlistButton>Join the waitlist</WaitlistButton>);

    await user.click(screen.getByRole('button', { name: 'Join the waitlist' }));
    await user.type(await screen.findByLabelText('Work email'), 'noor@ex.io');
    await user.type(screen.getByLabelText(/Company/i), 'EX.IO');
    await user.click(screen.getByRole('button', { name: /join the private beta/i }));

    expect(
      await screen.findByText('You’re on the list.', undefined, { timeout: 2500 }),
    ).toBeInTheDocument();
    expect(screen.getByText('noor@ex.io')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
  });
});
