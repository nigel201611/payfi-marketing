import { expect, test } from '@playwright/test';

async function openTerminal(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByRole('button', { name: /Launch Agent Terminal/i }).waitFor();
}

async function reachFunding(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: /Launch Agent Terminal/i }).click();
  await page.getByRole('button', { name: 'Skip and use defaults' }).click();
  await page.getByRole('heading', { name: 'Intent authorization & funding' }).waitFor();
  await page.getByRole('button', { name: 'Confirm authorization' }).click();
  await page.getByRole('heading', { name: 'Fund your dedicated virtual account' }).waitFor();
}

test.describe('Naka RWA Agent terminal', () => {
  test('launch brief selects products and keeps recent history', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Desktop-only launch dialog test');

    await openTerminal(page);
    await page.evaluate(() => window.localStorage.removeItem('naka-launch-history'));

    await page.getByRole('button', { name: /Launch Agent Terminal/i }).click();
    await page
      .getByRole('textbox', { name: 'Purchase brief' })
      .fill('Buy 30-day U.S. Treasury bonds with a $16,000 budget');
    await page.getByRole('button', { name: 'Start terminal' }).click();

    await expect(page.getByRole('heading', { name: 'Intent authorization & funding' })).toBeVisible(
      { timeout: 15_000 },
    );
    await expect(page.getByRole('checkbox', { name: 'Bonds' })).toBeChecked();

    await page.goto('/');
    await page.getByRole('button', { name: /Launch Agent Terminal/i }).click();
    await expect(
      page.getByRole('button', { name: /Buy 30-day U.S. Treasury bonds/ }),
    ).toBeVisible();
  });

  test('intent back returns to the brief and launch back returns home', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Desktop-only navigation test');

    await page.goto('/');
    await page.getByRole('button', { name: /Launch Agent Terminal/i }).click();

    const brief = 'Buy $6,000 of new energy revenue rights';
    await page.getByRole('textbox', { name: 'Purchase brief' }).fill(brief);
    await page.getByRole('button', { name: 'Start terminal' }).click();
    await expect(page.getByRole('heading', { name: 'Intent authorization & funding' })).toBeVisible(
      { timeout: 15_000 },
    );

    await page.getByRole('button', { name: 'Back to brief' }).click();
    await expect(page.getByRole('textbox', { name: 'Purchase brief' })).toHaveValue(brief);

    await page.getByRole('button', { name: 'Back to welcome' }).click();
    await expect(page.getByRole('button', { name: /Launch Agent Terminal/i })).toBeVisible();
  });

  test('welcome, theme and language toggles persist', async ({ page }, testInfo) => {
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
    if (testInfo.project.name === 'desktop') {
      await page.getByRole('button', { name: 'Switch to Chinese' }).hover();
      await expect(page.getByText(/Current language: English/)).toBeVisible();
    }
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

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(
      page.getByRole('heading', { name: 'Strategy execution & ordering' }),
    ).toBeVisible();

    const retry = page.getByRole('button', { name: 'Large payment pending approval' });
    await expect(retry).toBeVisible();
    await retry.click();
    await expect(approval).toBeVisible();
    await approval.getByRole('button', { name: 'Reject', exact: true }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await page.getByRole('button', { name: 'Reset demo' }).click();
    await expect(page.getByRole('button', { name: /Launch Agent Terminal/i })).toBeVisible();
  });

  test('mobile layout keeps the terminal usable', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile-only smoke test');
    await openTerminal(page);
    await expect(page.getByRole('button', { name: /Launch Agent Terminal/i })).toBeVisible();
    await page.evaluate(() =>
      window.localStorage.setItem(
        'naka-launch-history',
        JSON.stringify([
          'Buy $16,000 of 30-day U.S. Treasury bonds with low risk, T+0 settlement.',
        ]),
      ),
    );
    await page.getByRole('button', { name: /Launch Agent Terminal/i }).click();
    await page.getByRole('textbox', { name: 'Purchase brief' }).waitFor();

    const launchPanel = await page.evaluate(() => {
      const panel = document.querySelector<HTMLElement>('[style*="--spotlight-card-surface"]');
      return panel ? { scrollWidth: panel.scrollWidth, clientWidth: panel.clientWidth } : null;
    });
    if (!launchPanel) throw new Error('Launch panel is not visible');
    expect(launchPanel.scrollWidth).toBeLessThanOrEqual(launchPanel.clientWidth);

    await page.getByRole('button', { name: 'Skip and use defaults' }).click();
    await expect(
      page.getByRole('heading', { name: 'Intent authorization & funding' }),
    ).toBeVisible();
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);

    const wallet = page.locator('#custody-wallet');
    await wallet.scrollIntoViewIfNeeded();
    const walletBox = await wallet.boundingBox();
    if (!walletBox) throw new Error('Custody wallet trigger is not visible');
    const walletCenter = {
      x: walletBox.x + walletBox.width / 2,
      y: walletBox.y + walletBox.height / 2,
    };
    const walletArrow = {
      x: walletBox.x + walletBox.width - 20,
      y: walletBox.y + walletBox.height / 2,
    };

    await page.touchscreen.tap(walletCenter.x, walletCenter.y);
    await expect(page.getByRole('listbox')).toBeVisible();
    await page.touchscreen.tap(walletCenter.x, walletCenter.y);
    await expect(page.getByRole('listbox')).toHaveCount(0);

    await page.touchscreen.tap(walletArrow.x, walletArrow.y);
    await expect(page.getByRole('listbox')).toBeVisible();
    await page.touchscreen.tap(walletArrow.x, walletArrow.y);
    await expect(page.getByRole('listbox')).toHaveCount(0);

    await page.getByRole('button', { name: 'Confirm authorization' }).click();
    await page.getByRole('button', { name: /Simulate deposit — Large payment/i }).click();
    const approval = page.getByRole('dialog').filter({ hasText: 'Agent requests a large payment' });
    await approval.waitFor({ timeout: 12_000 });

    const approvalOverflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(approvalOverflow.scrollWidth).toBeLessThanOrEqual(approvalOverflow.clientWidth);

    const titleLines = await approval.getByRole('heading').evaluate((heading) => {
      const style = getComputedStyle(heading);
      return heading.getBoundingClientRect().height / parseFloat(style.lineHeight);
    });
    expect(titleLines).toBeLessThan(1.5);

    const buttonHeights = await approval
      .getByRole('button')
      .evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().height));
    expect(buttonHeights).toHaveLength(2);
    expect(buttonHeights.every((height) => height >= 44)).toBe(true);
  });
});
