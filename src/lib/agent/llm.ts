import type { SettlementContext } from '@/lib/agent/types';
import { CRB_TX_PLACEHOLDER } from '@/lib/agent/policy';

export type LlmPlanResponse = { content: unknown } | { error: string };

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

/**
 * Optional server-side planner. Without AGENT_LLM_API_KEY the deterministic
 * policy is used, so the demo never depends on a model being reachable.
 */
export async function requestLlmSettlementPlan(
  context: SettlementContext,
  fetchImpl: typeof fetch = fetch,
): Promise<LlmPlanResponse> {
  const apiKey = process.env.AGENT_LLM_API_KEY;
  if (!apiKey) return { error: 'LLM planner not configured' };

  const baseUrl = (process.env.AGENT_LLM_BASE_URL ?? 'https://api.deepseek.com/v1').replace(
    /\/$/,
    '',
  );
  const model = process.env.AGENT_LLM_MODEL ?? 'deepseek-chat';
  const timeoutMs = Number(process.env.AGENT_LLM_TIMEOUT_MS ?? 4_000);

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

  try {
    const response = await fetchImpl(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        response_format: { type: 'json_object' },
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) return { error: `LLM HTTP ${response.status}` };

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) return { error: 'LLM returned no content' };

    const parsed = extractJson(content);
    return parsed ? { content: parsed } : { error: 'LLM returned invalid JSON' };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { error: 'LLM planner timed out' };
    }
    return { error: error instanceof Error ? error.message : 'LLM request failed' };
  }
}
