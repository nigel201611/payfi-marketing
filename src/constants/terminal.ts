import type { Locale } from '@/i18n/messages';

export type AssetId = 'energy' | 'moneyMarket' | 'treasury' | 'sme' | 'euroMoneyMarket';
export type RiskCode = 'R1' | 'R2';
export type InvestorType = 'professional' | 'retail';
export type PayoutType = 'monthly' | 'daily' | 'maturity' | 'quarterly';
export type Scenario = 'large' | 'small';

export type RwaAsset = {
  id: AssetId;
  code: string;
  price: number;
  apy: number;
  risk: RiskCode;
  investor: InvestorType;
  payout: PayoutType;
  updatedSeconds: number;
};

export const rwaAssets: readonly RwaAsset[] = [
  {
    id: 'energy',
    code: 'RWA-NEW-ENERGY-07',
    price: 600,
    apy: 4.8,
    risk: 'R1',
    investor: 'professional',
    payout: 'monthly',
    updatedSeconds: 12,
  },
  {
    id: 'moneyMarket',
    code: 'RWA-USD-MMF-A1',
    price: 100,
    apy: 3.2,
    risk: 'R1',
    investor: 'retail',
    payout: 'daily',
    updatedSeconds: 8,
  },
  {
    id: 'treasury',
    code: 'RWA-BOND-TREAS-30',
    price: 1000,
    apy: 3.9,
    risk: 'R1',
    investor: 'professional',
    payout: 'maturity',
    updatedSeconds: 21,
  },
  {
    id: 'sme',
    code: 'RWA-SME-POOL-12',
    price: 2500,
    apy: 5.6,
    risk: 'R2',
    investor: 'professional',
    payout: 'quarterly',
    updatedSeconds: 63,
  },
  {
    id: 'euroMoneyMarket',
    code: 'RWA-EUR-MMF-B2',
    price: 100,
    apy: 2.7,
    risk: 'R1',
    investor: 'retail',
    payout: 'daily',
    updatedSeconds: 15,
  },
];

export const demoOrders: Record<Scenario, { assetId: AssetId; quantity: number }> = {
  large: { assetId: 'treasury', quantity: 16 },
  small: { assetId: 'energy', quantity: 10 },
};

export const demoConfig = {
  singleLimit: 10_000,
  maxBudget: 100_000,
  routingNumber: '021000089',
  accountNumber: '7788123456',
  payee: 'EXIO Bank',
  payeeAccount: 'CRB •••• 3456',
  orderRef: 'NKA-ORD-2026-0842',
  txId: '0x8f9a…c41e',
  receiptHash: '0x7b21…9d8a',
  wallets: {
    a: '0x3f5e…9aC2',
    b: '0x71Bb…04dE',
  },
} as const;

export const timing = {
  launch: 900,
  funding: 700,
  evaluate: 1700,
  choose: 1000,
  payment: 1900,
  settle: 5000,
} as const;

export function getAsset(id: AssetId): RwaAsset {
  const asset = rwaAssets.find((item) => item.id === id);
  if (!asset) throw new Error(`Unknown RWA asset: ${id}`);
  return asset;
}

export function getDemoOrder(scenario: Scenario) {
  const asset = getAsset(demoOrders[scenario].assetId);
  const quantity = demoOrders[scenario].quantity;
  return { asset, quantity, amount: asset.price * quantity };
}

export function formatCurrency(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatInteger(amount: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount);
}

export type IntentValues = {
  categories: Record<'energy' | 'moneyMarket' | 'bonds', boolean>;
  minApy: string;
  settlement: 'T+0' | 'T+1' | 'T+2';
  risk: 'low' | 'medium' | 'high';
  singleLimit: string;
  maxBudget: string;
  wallet: 'a' | 'b';
};

export const defaultIntent: IntentValues = {
  categories: { energy: true, moneyMarket: true, bonds: true },
  minApy: '3',
  settlement: 'T+0',
  risk: 'low',
  singleLimit: '10,000',
  maxBudget: '100,000',
  wallet: 'a',
};

export type Order = {
  scenario: Scenario;
  asset: RwaAsset;
  quantity: number;
  amount: number;
};

export function createOrder(scenario: Scenario): Order {
  const { asset, quantity, amount } = getDemoOrder(scenario);
  return { scenario, asset, quantity, amount };
}

export type IntentValidationKey = 'categories' | 'limits' | 'budget';

export function parseAmount(value: string): number {
  return Number(value.replace(/,/g, '').trim());
}

export function validateIntentValues(intent: IntentValues): IntentValidationKey | null {
  if (!Object.values(intent.categories).some(Boolean)) return 'categories';
  const single = parseAmount(intent.singleLimit);
  const max = parseAmount(intent.maxBudget);
  if (!Number.isFinite(single) || single <= 0 || !Number.isFinite(max) || max <= 0) {
    return 'limits';
  }
  if (max < single) return 'budget';
  return null;
}
