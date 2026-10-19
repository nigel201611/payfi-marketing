export const site = {
  name: 'EX.IO',
  product: 'Agent Wallet',
  beta: 'Private beta',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ex.io',
  external: {
    business: 'https://www.ex.io/',
    signIn: 'https://www.ex.io/zh/login',
    exio: 'https://www.ex.io',
    trade: 'https://www.ex.io',
  },
} as const;
