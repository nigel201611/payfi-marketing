import {
  buildDeterministicSettlementPlan,
  isSettlementContext,
  validateSettlementPlan,
} from '@/lib/agent/policy';
import { requestLlmSettlementPlan } from '@/lib/agent/llm';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!isSettlementContext(body)) {
    return Response.json({ error: 'Invalid settlement context' }, { status: 400 });
  }

  const fallback = buildDeterministicSettlementPlan(body);
  const llm = await requestLlmSettlementPlan(body);

  if ('content' in llm) {
    const guarded = validateSettlementPlan(llm.content, body);
    if (guarded) {
      return Response.json({ plan: guarded, warning: null });
    }
    return Response.json({ plan: fallback, warning: 'LLM plan rejected by policy guard' });
  }

  return Response.json({ plan: fallback, warning: llm.error });
}
