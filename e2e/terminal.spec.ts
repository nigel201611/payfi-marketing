import { expect, test } from '@playwright/test';

async function openTerminal(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByRole('button', { name: /Launch Agent Terminal/i }).waitFor();
}

async function reachFunding(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: /Launch Agent Terminal/i }).click();
  await page.getByRole('heading', { name: 'Intent authorization & funding' }).waitFor();
  await page.getByRole('button', { name: 'Confirm authorization' }).click();
  await page.getByRole('heading', { name: 'Fund your dedicated virtual account' }).waitFor();
}

test.describe('Naka RWA Agent terminal', () => {
  test('welcome, theme and language toggles persist', async ({ page }) => {
    await openTerminal(page);

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Welcome');
    await expect(page.getByRole('button', { name: /Launch Agent Terminal/i })).toBeVisible();

    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await page.getByRole('button', { name: 'Switch to light theme' }).click();
    await expect(html).toHaveAttribute('data-theme', 'light');
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'light');

    await expect(html).toHaveAttribute('lang', 'en');
    await page.getByRole('button', { name: 'Switch to Chinese' }).click();
    await expect(html).toHaveAttribute('lang', 'zh-CN');
    await expect(page.getByRole('button', { name: '启动 Agent 交易终端' })).toBeVisible();

    await page.reload();
    await expect(html).toHaveAttribute('lang', 'zh-CN');
    await expect(page.getByRole('button', { name: '启动 Agent 交易终端' })).toBeVisible();

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
  });

  test('large payment requires approval, then settles and issues a receipt', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Full flow is covered on desktop');
    test.setTimeout(45_000);
    await openTerminal(page);
    await reachFunding(page);

    await page.getByRole('button', { name: /Simulate deposit — Large payment/i }).click();
    await page
      .getByRole('heading', { name: 'Strategy execution & ordering' })
      .waitFor({ timeout: 6000 });

    const approval = page.getByRole('dialog').filter({ hasText: 'Agent requests a large payment' });
    await approval.waitFor({ timeout: 12_000 });
    await expect(approval.getByText('$16,000.00')).toBeVisible();
    await approval.getByRole('button', { name: 'Approve payment' }).click();

    await page.getByRole('heading', { name: 'Settlement & delivery' }).waitFor({ timeout: 10_000 });
    const confirm = page.getByRole('button', { name: 'Confirm receipt & complete transaction' });
    await expect(confirm).toBeEnabled({ timeout: 12_000 });
    await confirm.click();

    await expect(page.getByRole('heading', { name: 'Delivery receipt' })).toBeVisible();
    await expect(page.getByText('NKA-ORD-2026-0842')).toBeVisible();
    await expect(page.getByText('$16,000.00', { exact: true })).toBeVisible();
  });

  test('small payment is handled automatically and rejected orders can be reset', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Full flow is covered on desktop');
    test.setTimeout(45_000);
    await openTerminal(page);
    await reachFunding(page);

    await page.getByRole('button', { name: /Simulate deposit — Small payment/i }).click();
    await page
      .getByRole('heading', { name: 'Strategy execution & ordering' })
      .waitFor({ timeout: 6000 });

    const payment = page.getByRole('dialog').filter({ hasText: 'Agent is paying automatically' });
    await payment.waitFor({ timeout: 10_000 });
    await page.getByRole('heading', { name: 'Settlement & delivery' }).waitFor({ timeout: 10_000 });
    const confirm = page.getByRole('button', { name: 'Confirm receipt & complete transaction' });
    await expect(confirm).toBeEnabled({ timeout: 12_000 });
    await confirm.click();
    await expect(page.getByRole('heading', { name: 'Delivery receipt' })).toBeVisible();
    await expect(page.getByText('$6,000.00', { exact: true })).toBeVisible();
  });

  test('rejecting a large payment cancels the order and resets the demo', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Full flow is covered on desktop');
    test.setTimeout(30_000);
    await openTerminal(page);
    await reachFunding(page);

    await page.getByRole('button', { name: /Simulate deposit — Large payment/i }).click();
    const approval = page.getByRole('dialog').filter({ hasText: 'Agent requests a large payment' });
    await approval.waitFor({ timeout: 12_000 });
    await approval.getByRole('button', { name: 'Reject', exact: true }).click();

    await expect(page.getByRole('heading', { name: 'Payment rejected' })).toBeVisible();
    await page.getByRole('button', { name: 'Start a new demo' }).click();
    await expect(page.getByRole('button', { name: /Launch Agent Terminal/i })).toBeVisible();
  });

  test('mobile layout keeps the terminal usable', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile-only smoke test');
    await openTerminal(page);
    await expect(page.getByRole('button', { name: /Launch Agent Terminal/i })).toBeVisible();
    await page.getByRole('button', { name: /Launch Agent Terminal/i }).click();
    await expect(
      page.getByRole('heading', { name: 'Intent authorization & funding' }),
    ).toBeVisible();
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
  });
});
