import { describe, expect, it } from 'vitest';
import { defaultIntent } from '@/constants/terminal';
import {
  analyzeBriefLocally,
  applyBriefAnalysis,
  matchIntentCategories,
  validateBriefAnalysis,
} from '@/lib/intent-parser';

describe('matchIntentCategories', () => {
  it('matches English product briefs', () => {
    expect(matchIntentCategories('Buy low-risk money market funds')).toEqual({
      energy: false,
      moneyMarket: true,
      bonds: false,
    });
    expect(matchIntentCategories('Invest in 30-day U.S. Treasury certificates')).toEqual({
      energy: false,
      moneyMarket: false,
      bonds: true,
    });
    expect(matchIntentCategories('Buy new energy revenue rights')).toEqual({
      energy: true,
      moneyMarket: false,
      bonds: false,
    });
  });

  it('matches Chinese product briefs', () => {
    expect(matchIntentCategories('买入低风险货币基金')).toEqual({
      energy: false,
      moneyMarket: true,
      bonds: false,
    });
    expect(matchIntentCategories('买入 30 天美国国债凭证')).toMatchObject({ bonds: true });
    expect(matchIntentCategories('买入新能源电站收益权')).toMatchObject({ energy: true });
  });

  it('selects every mentioned category', () => {
    expect(matchIntentCategories('Split between money market funds and treasury bonds')).toEqual({
      energy: false,
      moneyMarket: true,
      bonds: true,
    });
  });

  it('returns null when no product is mentioned', () => {
    expect(matchIntentCategories('hello there')).toBeNull();
  });

  it('extracts amount, risk and settlement for the deterministic fallback', () => {
    expect(
      analyzeBriefLocally('Buy low-risk money market funds with a $50,000 budget, T+1.'),
    ).toMatchObject({
      maxBudget: 50_000,
      singleLimit: null,
      risk: 'low',
      settlement: 'T+1',
      categories: { energy: false, moneyMarket: true, bonds: false },
    });
  });

  it('validates LLM output and clamps the single limit to the budget', () => {
    const fallback = analyzeBriefLocally('Buy U.S. Treasury bonds');
    expect(
      validateBriefAnalysis(
        {
          categories: { energy: false, moneyMarket: false, bonds: true },
          maxBudget: 16_000,
          singleLimit: 20_000,
          risk: 'medium',
          settlement: 'T+0',
          summary: 'Treasury purchase',
        },
        fallback,
      ),
    ).toMatchObject({
      maxBudget: 16_000,
      singleLimit: 16_000,
      risk: 'medium',
      settlement: 'T+0',
      summary: 'Treasury purchase',
    });
  });

  it('applies analysis to the intent and keeps limits valid', () => {
    const next = applyBriefAnalysis(defaultIntent, {
      categories: { energy: false, moneyMarket: false, bonds: true },
      maxBudget: 6_000,
      singleLimit: null,
      risk: null,
      settlement: null,
      summary: null,
    });

    expect(next.categories.bonds).toBe(true);
    expect(next.maxBudget).toBe('6,000');
    expect(next.singleLimit).toBe('6,000');
  });
});
