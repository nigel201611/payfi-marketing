import { requestLlmBriefAnalysis } from '@/lib/agent/llm';
import { classifyBrief } from '@/lib/brief-guard';
import { analyzeBriefLocally, validateBriefAnalysis } from '@/lib/intent-parser';
import { isRecord } from '@/lib/mcp/types';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!isRecord(body) || typeof body.brief !== 'string') {
    return Response.json({ error: 'Invalid brief' }, { status: 400 });
  }

  const brief = body.brief.trim().slice(0, 500);
  if (!brief) {
    return Response.json({ error: 'Brief is empty' }, { status: 400 });
  }

  // The browser checks the same guard first; keep the BFF protected against direct calls too.
  if (classifyBrief(brief) !== 'valid') {
    return Response.json({ error: 'Brief rejected by policy guard' }, { status: 422 });
  }

  const fallback = analyzeBriefLocally(brief);
  const llm = await requestLlmBriefAnalysis(brief);

  if ('content' in llm) {
    const guarded = validateBriefAnalysis(llm.content, fallback);
    if (guarded) {
      return Response.json({ analysis: guarded, source: 'llm', warning: null });
    }
    return Response.json({
      analysis: fallback,
      source: 'policy',
      warning: 'LLM analysis rejected by guard',
    });
  }

  return Response.json({ analysis: fallback, source: 'policy', warning: llm.error });
}
