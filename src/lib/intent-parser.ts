import { formatInteger, parseAmount, type IntentValues } from '@/constants/terminal';

export type IntentCategories = IntentValues['categories'];
export type IntentRisk = IntentValues['risk'];
export type IntentSettlement = IntentValues['settlement'];

export type BriefAnalysis = {
  categories: IntentCategories | null;
  maxBudget: number | null;
  singleLimit: number | null;
  risk: IntentRisk | null;
  settlement: IntentSettlement | null;
  summary: string | null;
};

const CATEGORY_RULES: Array<{ key: keyof IntentCategories; pattern: RegExp }> = [
  { key: 'energy', pattern: /energy|renewable|solar|revenue rights?|新能源|电站|收益权/i },
  { key: 'moneyMarket', pattern: /money[- ]?market|\bmmf\b|货币基金|货币市场|美元基金/i },
  { key: 'bonds', pattern: /\bbonds?\b|treasur(?:y|ies)|fixed income|国债|债券|美债/i },
];

const RISK_VALUES: IntentRisk[] = ['low', 'medium', 'high'];
const SETTLEMENT_VALUES: IntentSettlement[] = ['T+0', 'T+1', 'T+2'];

export function matchIntentCategories(text: string): IntentCategories | null {
  const matched = new Set<keyof IntentCategories>();

  for (const rule of CATEGORY_RULES) {
    if (rule.pattern.test(text)) matched.add(rule.key);
  }

  if (matched.size === 0) return null;

  return {
    energy: matched.has('energy'),
    moneyMarket: matched.has('moneyMarket'),
    bonds: matched.has('bonds'),
  };
}

function detectAmount(text: string): number | null {
  const matches = text.matchAll(/\$\s*([\d,]+(?:\.\d+)?)\s*(k|万)?|([\d,]+(?:\.\d+)?)\s*(k|万)/gi);
  const values: number[] = [];

  for (const match of matches) {
    const raw = match[1] ?? match[3];
    const unit = (match[2] ?? match[4] ?? '').toLowerCase();
    const value = Number(raw.replace(/,/g, ''));
    if (!Number.isFinite(value) || value <= 0) continue;

    if (unit === 'k') values.push(value * 1_000);
    else if (unit === '万') values.push(value * 10_000);
    else values.push(value);
  }

  return values.length > 0 ? Math.max(...values) : null;
}

function detectRisk(text: string): IntentRisk | null {
  if (/low[- ]?risk|conservative|低风险/i.test(text)) return 'low';
  if (/medium[- ]?risk|balanced|中风险/i.test(text)) return 'medium';
  if (/high[- ]?risk|aggressive|高风险/i.test(text)) return 'high';
  return null;
}

function detectSettlement(text: string): IntentSettlement | null {
  const match = /T\+(0|1|2)/i.exec(text);
  return match ? (`T+${match[1]}` as IntentSettlement) : null;
}

/** Deterministic fallback used in static Pages builds or when the LLM fails. */
export function analyzeBriefLocally(brief: string): BriefAnalysis {
  const amount = detectAmount(brief);

  return {
    categories: matchIntentCategories(brief),
    maxBudget: amount,
    singleLimit: null,
    risk: detectRisk(brief),
    settlement: detectSettlement(brief),
    summary: null,
  };
}

function readAmount(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0 ? Math.round(value) : null;
  }
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[$,]/g, '').trim());
    return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : null;
  }
  return null;
}

function readCategories(value: unknown): IntentCategories | null {
  if (typeof value !== 'object' || value === null) return null;
  const record = value as Record<string, unknown>;
  if (
    typeof record.energy !== 'boolean' ||
    typeof record.moneyMarket !== 'boolean' ||
    typeof record.bonds !== 'boolean'
  ) {
    return null;
  }

  const categories = {
    energy: record.energy,
    moneyMarket: record.moneyMarket,
    bonds: record.bonds,
  };

  return Object.values(categories).some(Boolean) ? categories : null;
}

export function validateBriefAnalysis(
  candidate: unknown,
  fallback: BriefAnalysis,
): BriefAnalysis | null {
  if (typeof candidate !== 'object' || candidate === null) return null;
  const record = candidate as Record<string, unknown>;

  const categories = readCategories(record.categories) ?? fallback.categories;
  const maxBudget = readAmount(record.maxBudget) ?? fallback.maxBudget;
  let singleLimit = readAmount(record.singleLimit) ?? fallback.singleLimit;

  if (singleLimit !== null && maxBudget !== null && singleLimit > maxBudget) {
    singleLimit = maxBudget;
  }

  const risk =
    typeof record.risk === 'string' && RISK_VALUES.includes(record.risk as IntentRisk)
      ? (record.risk as IntentRisk)
      : fallback.risk;
  const settlement =
    typeof record.settlement === 'string' &&
    SETTLEMENT_VALUES.includes(record.settlement as IntentSettlement)
      ? (record.settlement as IntentSettlement)
      : fallback.settlement;
  const summary =
    typeof record.summary === 'string' && record.summary.trim().length > 0
      ? record.summary.trim().slice(0, 240)
      : fallback.summary;

  return { categories, maxBudget, singleLimit, risk, settlement, summary };
}

export function applyBriefAnalysis(intent: IntentValues, analysis: BriefAnalysis): IntentValues {
  const next = { ...intent };

  if (analysis.categories) next.categories = analysis.categories;
  if (analysis.risk) next.risk = analysis.risk;
  if (analysis.settlement) next.settlement = analysis.settlement;
  if (analysis.maxBudget) next.maxBudget = formatInteger(analysis.maxBudget);
  if (analysis.singleLimit) next.singleLimit = formatInteger(analysis.singleLimit);

  const max = parseAmount(next.maxBudget);
  const single = parseAmount(next.singleLimit);

  if (Number.isFinite(max) && Number.isFinite(single) && single > max) {
    next.singleLimit = formatInteger(max);
  } else if (Number.isFinite(single) && !Number.isFinite(max)) {
    next.maxBudget = formatInteger(single);
  }

  return next;
}
