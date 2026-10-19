import { expect, test } from '@playwright/test';

test.describe('EX.IO Agent Wallet landing page', () => {
  test('renders the hero, navigation and supported features without horizontal overflow', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Give your agent a wallet you control.',
    );
    await expect(
      page.getByRole('banner').getByRole('link', { name: 'EX.IO Agent Wallet — Home' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Supported features' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Let your agent buy. Keep the last word.' }),
    ).toBeVisible();

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
  });

  test('waitlist dialog validates the email and confirms signup', async ({ page }) => {
    await page.goto('/');

    await page
      .getByRole('button', { name: /join.*waitlist/i })
      .first()
      .click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Join the agent wallet waitlist')).toBeVisible();

    await page.getByLabel('Work email').fill('not-an-email');
    await page.getByRole('button', { name: /Join the private beta/i }).click();
    await expect(page.getByRole('alert')).toContainText('Enter a valid work email address.');

    await page.getByLabel('Work email').fill('noor@ex.io');
    await page.getByLabel(/Company/i).fill('EX.IO');
    await page.getByRole('button', { name: /Join the private beta/i }).click();

    await expect(page.getByText('You’re on the list.')).toBeVisible({ timeout: 3000 });
    await expect(page.getByText('noor@ex.io')).toBeVisible();
  });

  test('approval demo can approve and reset a spend request', async ({ page }) => {
    await page.goto('/');

    const approveButton = page.getByRole('button', { name: /Approve with passkey/i });
    await approveButton.scrollIntoViewIfNeeded();
    await approveButton.click();

    await expect(page.getByText('Approved by you')).toBeVisible();
    await expect(page.getByText('Visa ·· 9081')).toBeVisible();
    await expect(page.getByRole('status').filter({ hasText: 'Approved' })).toContainText(
      'Approved',
    );

    await page.getByRole('button', { name: /Reset demo/i }).click();
    await expect(approveButton).toBeVisible();
  });

  test('code samples switch between surfaces', async ({ page }) => {
    await page.goto('/');

    const tabs = page.getByRole('tablist').filter({ hasText: 'MCP' });
    await tabs.scrollIntoViewIfNeeded();
    await page.getByRole('tab', { name: 'MCP' }).click();
    await expect(page.getByText('"mcpServers"')).toBeVisible();

    await page.getByRole('tab', { name: 'Node' }).click();
    await expect(page.getByText('new AgentWallet')).toBeVisible();
  });

  test('switches between dark and light themes and remembers the choice', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');

    await expect(html).toHaveAttribute('data-theme', 'dark');

    await page.getByRole('button', { name: 'Switch to light theme' }).click();
    await expect(html).toHaveAttribute('data-theme', 'light');

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'light');

    await page.getByRole('button', { name: 'Switch to dark theme' }).click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });

  test('switches between English and Chinese and remembers the choice', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');

    await expect(html).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Give your');

    await page.getByRole('button', { name: 'Switch to Chinese' }).click();
    await expect(html).toHaveAttribute('lang', 'zh-CN');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('由你掌控的钱包');
    await expect(page.getByRole('link', { name: '了解如何运作' })).toBeVisible();

    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('由你掌控的钱包');
    await expect(page.getByRole('button', { name: '切换到英文' })).toBeVisible();
  });

  test('mobile menu opens and navigates to a section', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile-only navigation');

    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();

    const sheet = page.getByRole('dialog');
    await expect(sheet).toBeVisible();
    await sheet.getByRole('link', { name: 'Get started' }).click();

    await expect(page.locator('#developers')).toBeInViewport();
    await expect(
      page.getByRole('heading', { name: 'From prompt to payment in minutes.' }),
    ).toBeVisible();
  });
});
