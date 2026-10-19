import { chromium } from '@playwright/test';

const baseURL = process.env.QA_URL ?? 'http://localhost:3005';

const browser = await chromium.launch({ channel: 'chrome' });

async function scrollToSection(page, selector, offset = 0) {
  await page.evaluate(
    ({ selector, offset }) => {
      const element = document.querySelector(selector);
      if (!element) return;
      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, Math.max(0, top - 72 + offset));
    },
    { selector, offset },
  );
  await page.waitForTimeout(700);
}

for (const [name, viewport] of [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844 }],
]) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });

  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += Math.round(viewport.height * 0.65)) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(250);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);

  await page.screenshot({ path: `/tmp/exio-${name}-full.png`, fullPage: true });

  const shots = [
    ['hero', '#top', 0],
    ['how-it-works', '#how-it-works', 0],
    ['how-cards', '#how-it-works', 480],
    ['control', '#control', 0],
    ['developers', '#developers', 0],
    ['developers-matrix', '#developers', 640],
    ['waitlist', '#waitlist', 0],
    ['waitlist-cta', '#waitlist', 620],
  ];

  for (const [label, selector, offset] of shots) {
    await scrollToSection(page, selector, offset);
    await page.screenshot({ path: `/tmp/exio-${name}-${label}.png` });
  }

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `/tmp/exio-${name}-footer.png` });

  // Interactions
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  if (name === 'desktop') {
    await page.getByRole('button', { name: 'Join waitlist' }).first().click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/tmp/exio-desktop-dialog.png' });
    await page.getByLabel('Work email').fill('not-an-email');
    await page.getByRole('button', { name: /Join the private beta/i }).click();
    await page.waitForTimeout(300);
    const errorVisible = await page.getByRole('alert').isVisible();
    await page.getByLabel('Work email').fill('noor@ex.io');
    await page.getByRole('button', { name: /Join the private beta/i }).click();
    await page.waitForTimeout(1200);
    const success = await page.getByText('You’re on the list.').isVisible();
    await page.screenshot({ path: '/tmp/exio-desktop-dialog-success.png' });
    await page.keyboard.press('Escape');

    await scrollToSection(page, '#control');
    await page.getByRole('button', { name: /Approve with passkey/i }).click();
    await page.waitForTimeout(600);
    const approved = await page.getByText('Approved by you').isVisible();
    await page.screenshot({ path: '/tmp/exio-desktop-approved.png' });
    await page.getByRole('button', { name: /Reset demo/i }).click();

    console.log(name, 'interactions', { errorVisible, success, approved });
  } else {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/tmp/exio-mobile-sheet.png' });
  }

  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  console.log(name, JSON.stringify({ height, overflow, errors }, null, 2));
  await page.close();
}

await browser.close();
