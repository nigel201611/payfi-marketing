'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, Clock3, Loader2, Sparkles } from 'lucide-react';
import { VaraPanel } from '@/components/terminal/vara-panel';
import { ActionButton } from '@/components/terminal/ui';
import { useI18n } from '@/i18n/locale-provider';
import { requestBriefAnalysis, type BriefAnalysisResult } from '@/lib/launch-analysis';
import { mergeLaunchBrief, readLaunchHistory, writeLaunchHistory } from '@/lib/launch-history';

type LaunchStepProps = {
  initialBrief?: string;
  onBack: () => void;
  onSubmit: (brief: string, result: BriefAnalysisResult) => void;
  onSkip: () => void;
};

export function LaunchStep({ initialBrief = '', onBack, onSubmit, onSkip }: LaunchStepProps) {
  const { t } = useI18n();
  const copy = t.launch;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [brief, setBrief] = useState(initialBrief);
  const [history, setHistory] = useState<string[]>(() => readLaunchHistory());
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const canSubmit = brief.trim().length > 0 && !analyzing;

  async function submit() {
    const text = brief.trim();
    if (!text || analyzing || abortRef.current) return;

    const next = mergeLaunchBrief(text, history);
    setHistory(next);
    writeLaunchHistory(next);

    const controller = new AbortController();
    abortRef.current = controller;
    setAnalyzing(true);

    try {
      const result = await requestBriefAnalysis(text, controller.signal);
      if (controller.signal.aborted) return;
      onSubmit(text, result);
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setAnalyzing(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      void submit();
    }
  }

  function applyBrief(text: string) {
    setBrief(text);
    textareaRef.current?.focus();
  }

  return (
    <div className="py-8 lg:py-10">
      <button
        type="button"
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {copy.back}
      </button>

      <p className="text-muted-foreground mt-5 text-sm font-medium">{copy.eyebrow}</p>
      <h2 className="font-display text-foreground mt-1.5 text-[1.75rem] leading-9 font-extrabold tracking-[-0.02em] sm:text-[2rem] sm:leading-10">
        {copy.title}
      </h2>
      <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
        {copy.description}
      </p>

      <VaraPanel>
        <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="space-y-5 p-5 sm:p-7 lg:p-8">
            <div className="flex gap-3">
              <span className="bg-brand/10 text-accent-text grid size-8 shrink-0 place-items-center rounded-full">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              <p className="bg-foreground/[0.03] text-foreground/80 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed">
                {copy.greeting}
              </p>
            </div>

            <div className="bg-foreground/[0.03] focus-within:ring-brand/30 rounded-xl px-4 py-3 transition-shadow focus-within:ring-2">
              <label htmlFor="launch-brief" className="sr-only">
                {copy.inputLabel}
              </label>
              <textarea
                id="launch-brief"
                ref={textareaRef}
                autoFocus
                rows={5}
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={copy.placeholder}
                className="text-foreground placeholder:text-muted-foreground/60 w-full resize-none bg-transparent text-sm leading-relaxed outline-none"
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-muted-foreground/70 text-[0.65rem]">{copy.submitHint}</span>
                <ActionButton
                  variant="gradient"
                  onClick={() => void submit()}
                  disabled={!canSubmit}
                  aria-busy={analyzing}
                  className="h-9 px-4 text-xs font-bold"
                >
                  {analyzing ? (
                    <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                  ) : null}
                  {analyzing ? copy.analyzing : copy.start}
                  {!analyzing ? <ArrowRight className="size-3.5" aria-hidden="true" /> : null}
                </ActionButton>
              </div>
            </div>

            <div>
              <p className="text-foreground/60 text-xs font-semibold">{copy.presetsLabel}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {copy.presets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => applyBrief(preset)}
                    className="border-border bg-background/50 hover:border-brand/40 hover:bg-brand/[0.06] rounded-full border px-3 py-1.5 text-left text-xs transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="border-border bg-foreground/[0.02] flex flex-col border-t p-5 sm:p-7 lg:border-t-0 lg:border-l lg:p-8">
            <p className="text-foreground/60 flex items-center gap-2 text-xs font-semibold">
              <Clock3 className="size-3.5" aria-hidden="true" />
              {copy.recentLabel}
            </p>

            {history.length > 0 ? (
              <div className="mt-3 space-y-1.5">
                {history.map((item) => (
                  <button
                    key={item}
                    type="button"
                    title={copy.useRecent}
                    onClick={() => applyBrief(item)}
                    className="border-border bg-background/40 hover:border-brand/35 hover:bg-brand/[0.05] flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors"
                  >
                    <span className="text-foreground/80 min-w-0 flex-1 truncate text-xs">
                      {item}
                    </span>
                    <ArrowRight
                      className="text-muted-foreground size-3.5 shrink-0"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground mt-3 text-xs">{copy.recentEmpty}</p>
            )}

            <div className="border-border mt-6 border-t pt-4 lg:mt-auto">
              <p className="text-muted-foreground/70 text-[0.65rem]">{copy.mock}</p>
              <button
                type="button"
                onClick={onSkip}
                className="text-muted-foreground hover:text-foreground mt-2 text-xs underline-offset-4 transition-colors hover:underline"
              >
                {copy.skip}
              </button>
            </div>
          </aside>
        </div>
      </VaraPanel>
    </div>
  );
}
