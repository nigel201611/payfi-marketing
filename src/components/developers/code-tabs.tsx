'use client';

import { useMemo, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { codeSamples } from '@/constants/code-samples';
import { useI18n } from '@/i18n/locale-provider';
import { formatMessage } from '@/i18n/messages';
import { cn } from '@/lib/utils';

function CodeLines({ code }: { code: string }) {
  const lines = useMemo(() => code.split('\n'), [code]);

  return (
    <div className="flex min-h-[286px]">
      <div
        aria-hidden="true"
        className="border-r border-white/[0.06] px-3 py-5 text-right font-mono text-[0.7rem] leading-[1.85] text-white/20 select-none"
      >
        {lines.map((_, index) => (
          <div key={index}>{String(index + 1).padStart(2, '0')}</div>
        ))}
      </div>
      <pre className="flex-1 overflow-x-auto px-5 py-5 font-mono text-[0.78rem] leading-[1.85]">
        <code>
          {lines.map((line, index) => {
            const isComment = /^\s*(#|\/\/)/.test(line);
            const isProperty = /^\s*"[^"]+"\s*:/.test(line);
            return (
              <div
                key={index}
                className={cn(
                  'whitespace-pre',
                  isComment
                    ? 'text-brand-soft/40'
                    : isProperty
                      ? 'text-brand-soft/80'
                      : 'text-white/80',
                )}
              >
                {line || ' '}
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

export function CodeTabs() {
  const { t } = useI18n();
  const copyText = t.developer.code;
  const [active, setActive] = useState<string>(codeSamples[0].id);
  const [copied, setCopied] = useState(false);
  const activeSample = codeSamples.find((sample) => sample.id === active) ?? codeSamples[0];

  async function copy() {
    try {
      await navigator.clipboard.writeText(activeSample.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Tabs value={active} onValueChange={setActive} className="w-full">
      <div className="bg-ink overflow-hidden rounded-2xl border border-white/[0.08] shadow-[0_32px_80px_-40px_rgba(4,17,12,0.8)]">
        <div className="flex flex-col gap-3 border-b border-white/[0.07] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-white/12" />
              <span className="size-2.5 rounded-full bg-white/8" />
              <span className="size-2.5 rounded-full bg-white/[0.05]" />
            </div>
            <span className="font-mono text-[0.68rem] text-white/35">{activeSample.filename}</span>
          </div>

          <div className="flex items-center gap-2">
            <TabsList className="h-8 gap-0.5 rounded-full border border-white/[0.08] bg-white/[0.03] p-0.5">
              {codeSamples.map((sample) => (
                <TabsTrigger
                  key={sample.id}
                  value={sample.id}
                  className="rounded-full px-3 py-1 text-[0.68rem] font-medium text-white/45 transition-colors data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-none"
                >
                  {sample.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <button
              type="button"
              onClick={copy}
              aria-label={formatMessage(copyText.copySnippet, { label: activeSample.label })}
              className={cn(
                'grid size-8 place-items-center rounded-full text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/80',
                copied && 'text-brand',
              )}
            >
              {copied ? (
                <Check className="size-3.5" aria-hidden="true" />
              ) : (
                <Copy className="size-3.5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {codeSamples.map((sample) => (
          <TabsContent key={sample.id} value={sample.id} className="mt-0">
            <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-2">
              <span className="font-mono text-[0.6rem] text-white/25">{sample.filename}</span>
              <span className="rounded border border-white/[0.07] px-1.5 py-0.5 font-mono text-[0.55rem] tracking-[0.1em] text-white/30 uppercase">
                {sample.language}
              </span>
            </div>
            <CodeLines code={sample.code} />
          </TabsContent>
        ))}

        <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3 text-[0.6rem] text-white/30">
          <span className="flex items-center gap-1.5">
            <span className="bg-brand/70 size-1.5 rounded-full" />
            {copyText.sandbox}
          </span>
          <span className="font-mono">{copyText.version}</span>
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {copied ? copyText.copied : ''}
      </p>
    </Tabs>
  );
}
