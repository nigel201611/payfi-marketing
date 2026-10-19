export const site = {
  name: 'EX.IO',
  product: 'Agent Wallet',
  beta: 'Private beta',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ex.io',
  external: {
    business: 'https://www.ex.io/',
    exio: 'https://dev.exiovara.com/en',
    trade: 'https://dev.exiovara.com/en/trade',
  },
} as const;
