export const site = {
  name: 'Naka RWA Agent',
  shortName: 'Naka',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.ex.io',
  description:
    'Agentic payment terminal for tokenized real-world assets — intent authorization, bank-grade fiat funding, agent-driven settlement, and a full audit trail. Mock demo environment.',
} as const;
