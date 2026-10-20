import { describe, expect, it } from 'vitest';
import {
  createOrder,
  defaultIntent,
  formatCurrency,
  getDemoOrder,
  validateIntentValues,
} from '@/constants/terminal';
import { messages } from '@/i18n/messages';

function shape(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(shape).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${key}:${shape((value as Record<string, unknown>)[key])}`)
      .join(',')}}`;
  }
  return typeof value;
}

describe('Naka RWA terminal demo data', () => {
  it('builds the large-payment order that triggers human approval', () => {
    const order = createOrder('large');
    expect(order.scenario).toBe('large');
    expect(order.asset.id).toBe('treasury');
    expect(order.quantity).toBe(16);
    expect(order.amount).toBe(16_000);
    expect(order.amount).toBeGreaterThan(10_000);
  });

  it('builds the small-payment order that is auto-approved', () => {
    const order = createOrder('small');
    expect(order.asset.id).toBe('energy');
    expect(order.quantity).toBe(10);
    expect(order.amount).toBe(6_000);
    expect(order.amount).toBeLessThan(10_000);
    expect(getDemoOrder('small').amount).toBe(6_000);
  });

  it('formats USD amounts for both locales', () => {
    expect(formatCurrency(16_000, 'en')).toContain('16,000.00');
    expect(formatCurrency(6_000, 'zh')).toContain('6,000.00');
  });

  it('validates intent categories and limits', () => {
    expect(validateIntentValues(defaultIntent)).toBeNull();
    expect(
      validateIntentValues({
        ...defaultIntent,
        categories: { energy: false, moneyMarket: false, bonds: false },
      }),
    ).toBe('categories');
    expect(validateIntentValues({ ...defaultIntent, singleLimit: '0' })).toBe('limits');
    expect(validateIntentValues({ ...defaultIntent, maxBudget: '5,000' })).toBe('budget');
  });

  it('keeps English and Chinese dictionaries structurally in sync', () => {
    expect(shape(messages.zh)).toBe(shape(messages.en));
  });
});
