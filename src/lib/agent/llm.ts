import type { SettlementContext } from '@/lib/agent/types';
import { CRB_TX_PLACEHOLDER } from '@/lib/agent/policy';

export type LlmPlanResponse = { content: unknown } | { error: string };
export type LlmProtocol = 'chat-completions' | 'responses';
export type LlmProviderId = 'deepseek' | 'kimi' | 'codex' | 'openai' | 'glm';
export type LlmReasoningEffort = 'low' | 'high' | 'max';

type LlmPreset = {
  baseUrl: string;
  model: string;
  protocol: LlmProtocol;
  apiKeyEnv: string;
  reasoningEffort?: LlmReasoningEffort;
};

const LLM_PRESETS: Record<LlmProviderId, LlmPreset> = {
  deepseek: {
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-flash',
    protocol: 'chat-completions',
    apiKeyEnv: 'DEEPSEEK_API_KEY',
  },
  kimi: {
    baseUrl: 'https://api.moonshot.ai/v1',
    model: 'kimi-k3',
    protocol: 'chat-completions',
    apiKeyEnv: 'MOONSHOT_API_KEY',
  },
  codex: {
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-5.1-codex-max',
    protocol: 'responses',
    apiKeyEnv: 'OPENAI_API_KEY',
  },
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-5.1',
    protocol: 'chat-completions',
    apiKeyEnv: 'OPENAI_API_KEY',
  },
  glm: {
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    model: 'glm-5.3',
    protocol: 'chat-completions',
    apiKeyEnv: 'ZHIPU_API_KEY',
    // GLM-5.3 always thinks; `low` keeps the demo planner within its timeout.
    reasoningEffort: 'low',
  },
};

export type ResolvedLlmConfig = {
  provider: LlmProviderId;
  apiKey: string;
  baseUrl: string;
  model: string;
  protocol: LlmProtocol;
  timeoutMs: number;
  reasoningEffort?: LlmReasoningEffort;
};

export function resolveLlmConfig(env: NodeJS.ProcessEnv = process.env): ResolvedLlmConfig | null {
  const rawProvider = (env.AGENT_LLM_PROVIDER ?? 'deepseek').trim().toLowerCase();
  if (!Object.hasOwn(LLM_PRESETS, rawProvider)) return null;
  const provider = rawProvider as LlmProviderId;
  const preset = LLM_PRESETS[provider];

  const apiKey = env.AGENT_LLM_API_KEY || env[preset.apiKeyEnv] || '';
  const baseUrl = env.AGENT_LLM_BASE_URL || preset.baseUrl;
  const model = env.AGENT_LLM_MODEL || preset.model;
  if (!apiKey || !baseUrl || !model) return null;

  const rawProtocol = env.AGENT_LLM_PROTOCOL;
  const protocol: LlmProtocol =
    rawProtocol === 'responses' || rawProtocol === 'chat-completions'
      ? rawProtocol
      : preset.protocol;

  const parsedTimeout = Number(env.AGENT_LLM_TIMEOUT_MS ?? 4_000);
  const timeoutMs = Number.isFinite(parsedTimeout) && parsedTimeout > 0 ? parsedTimeout : 4_000;

  return {
    provider,
    apiKey,
    baseUrl: baseUrl.replace(/\/$/, ''),
    model,
    protocol,
    timeoutMs,
    reasoningEffort: preset.reasoningEffort,
  };
}

function extractJson(text: string): unknown | null {
  const withoutFences = text.replace(/```(?:json)?/gi, '').trim();
  const start = withoutFences.indexOf('{');
  if (start < 0) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < withoutFences.length; index += 1) {
    const char = withoutFences[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === '{') depth += 1;
    else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        try {
          return JSON.parse(withoutFences.slice(start, index + 1));
        } catch {
          return null;
        }
      }
    }
  }

  return null;
}

function readResponsesText(payload: unknown): string | null {
  if (typeof payload !== 'object' || payload === null) return null;
  const record = payload as Record<string, unknown>;
  if (typeof record.output_text === 'string') return record.output_text;

  if (!Array.isArray(record.output)) return null;
  for (const item of record.output) {
    if (typeof item !== 'object' || item === null) continue;
    const content = (item as Record<string, unknown>).content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      if (
        typeof part === 'object' &&
        part !== null &&
        (part as Record<string, unknown>).type === 'output_text' &&
        typeof (part as Record<string, unknown>).text === 'string'
      ) {
        return (part as Record<string, unknown>).text as string;
      }
    }
  }
  return null;
}

async function requestModelJson(
  config: ResolvedLlmConfig,
  system: string,
  user: string,
  fetchImpl: typeof fetch,
): Promise<LlmPlanResponse> {
  try {
    const response =
      config.protocol === 'responses'
        ? await fetchImpl(`${config.baseUrl}/responses`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              authorization: `Bearer ${config.apiKey}`,
            },
            body: JSON.stringify({
              model: config.model,
              store: false,
              instructions: system,
              input: user,
              text: { format: { type: 'json_object' } },
            }),
            signal: AbortSignal.timeout(config.timeoutMs),
          })
        : await fetchImpl(`${config.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              authorization: `Bearer ${config.apiKey}`,
            },
            body: JSON.stringify({
              model: config.model,
              temperature: 0,
              messages: [
                { role: 'system', content: system },
                { role: 'user', content: user },
              ],
              response_format: { type: 'json_object' },
              ...(config.reasoningEffort
                ? {
                    thinking: { type: 'enabled' },
                    reasoning_effort: config.reasoningEffort,
                  }
                : {}),
            }),
            signal: AbortSignal.timeout(config.timeoutMs),
          });

    if (!response.ok) {
      return { error: `${config.provider} HTTP ${response.status}` };
    }

    const payload: unknown = await response.json();
    const content =
      config.protocol === 'responses'
        ? readResponsesText(payload)
        : (payload as { choices?: Array<{ message?: { content?: string } }> }).choices?.[0]?.message
            ?.content;

    if (!content) return { error: `${config.provider} returned no content` };

    const parsed = extractJson(content);
    return parsed ? { content: parsed } : { error: `${config.provider} returned invalid JSON` };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { error: 'LLM request timed out' };
    }
    return { error: error instanceof Error ? error.message : 'LLM request failed' };
  }
}

/**
 * Optional server-side planner. Providers are selected with
 * AGENT_LLM_PROVIDER (deepseek | kimi | codex | openai | glm); a missing
 * key keeps the deterministic policy, so the demo never depends on a model.
 */
export async function requestLlmSettlementPlan(
  context: SettlementContext,
  fetchImpl: typeof fetch = fetch,
): Promise<LlmPlanResponse> {
  const config = resolveLlmConfig();
  if (!config) return { error: 'LLM planner not configured' };

  const system = [
    'You are the settlement planner for a mock agentic RWA payment terminal.',
    'Return JSON only, with this exact shape:',
    '{"rationale":"one short sentence","steps":[',
    '{"tool":"execute_crb_payment","input":{"order_id":"...","payee_crb_acct":"...","amount":0}},',
    `{"tool":"verify_crb_settlement","input":{"order_id":"...","crb_tx_id":"${CRB_TX_PLACEHOLDER}"}},`,
    '{"tool":"execute_onchain_settlement","input":{"address_x":"...","rwa_amount":0}}]}',
    'Keep the exact order, payee, amount, wallet and RWA amount from the context.',
    'Never invent or change a value. No markdown, no extra text.',
  ].join('\n');

  const user = JSON.stringify({ task: 'build_settlement_plan', context });
  return requestModelJson(config, system, user, fetchImpl);
}

/** Analyze the launch brief into product categories and optional limits. */
export async function requestLlmBriefAnalysis(
  brief: string,
  fetchImpl: typeof fetch = fetch,
): Promise<LlmPlanResponse> {
  const config = resolveLlmConfig();
  if (!config) return { error: 'LLM analyst not configured' };

  const system = [
    'You are the intake analyst for a mock agentic RWA payment terminal.',
    'Return JSON only, with this exact shape:',
    '{"categories":{"energy":false,"moneyMarket":false,"bonds":false},',
    '"maxBudget":null,"singleLimit":null,"risk":null,"settlement":null,',
    '"summary":"one short sentence"}',
    'Category meanings: energy = new energy / solar / revenue rights;',
    'moneyMarket = money market funds / MMF; bonds = Treasury / bonds / fixed income.',
    'Use null for any amount, risk or settlement not explicitly stated.',
    'Never invent limits. Select every product category the client mentions.',
    'risk must be low|medium|high or null; settlement must be T+0|T+1|T+2 or null.',
    'Write summary in the same language as the brief. No markdown, no extra text.',
  ].join('\n');

  const user = JSON.stringify({ task: 'analyze_purchase_brief', brief });
  return requestModelJson(config, system, user, fetchImpl);
}
