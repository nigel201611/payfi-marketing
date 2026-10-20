import {
  analyzeBriefLocally,
  validateBriefAnalysis,
  type BriefAnalysis,
} from '@/lib/intent-parser';

export type BriefAnalysisSource = 'llm' | 'policy';

export type BriefAnalysisResult = {
  analysis: BriefAnalysis;
  source: BriefAnalysisSource;
};

/** The Pages build has no BFF, so it always uses the deterministic parser. */
export async function requestBriefAnalysis(
  brief: string,
  signal?: AbortSignal,
): Promise<BriefAnalysisResult> {
  const fallback = analyzeBriefLocally(brief);

  if (process.env.NEXT_PUBLIC_BFF_ENABLED !== 'true') {
    return { analysis: fallback, source: 'policy' };
  }

  const timeout = AbortSignal.timeout(8_000);
  const requestSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;

  try {
    const response = await fetch('/api/agent/intake', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ brief }),
      signal: requestSignal,
    });

    if (!response.ok) return { analysis: fallback, source: 'policy' };

    const payload = (await response.json()) as { analysis?: unknown; source?: unknown };
    const analysis = validateBriefAnalysis(payload.analysis, fallback);
    if (!analysis) return { analysis: fallback, source: 'policy' };

    return { analysis, source: payload.source === 'llm' ? 'llm' : 'policy' };
  } catch {
    return { analysis: fallback, source: 'policy' };
  }
}
