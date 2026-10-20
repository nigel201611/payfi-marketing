'use client';

import { useEffect, useRef } from 'react';
import { useI18n } from '@/i18n/locale-provider';
import { formatMessage } from '@/i18n/messages';
import type { LogChannel, LogEntry } from '@/components/terminal/types';
import { cn } from '@/lib/utils';

const channelColor: Record<LogChannel, string> = {
  SYS: 'text-white/45',
  AGENT: 'text-brand',
  MCP: 'text-brand-soft/90',
  CRB: 'text-white/65',
  WEBHOOK: 'text-amber-300',
  WARN: 'text-amber-300',
  OK: 'text-brand',
  API: 'text-white/65',
};

export function AgentMonitor({ logs }: { logs: LogEntry[] }) {
  const { t, locale } = useI18n();
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeFormatter = new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  useEffect(() => {
    const element = scrollRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [logs.length]);

  return (
    <aside className="flex h-[62dvh] min-h-0 shrink-0 flex-col border-t border-white/[0.08] bg-[#050706] text-white shadow-[-30px_0_70px_-50px_rgba(0,221,149,0.18)] lg:h-full lg:border-t-0 lg:border-l lg:border-white/10">
      <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span
            className="bg-brand size-1.5 rounded-full shadow-[0_0_10px_rgba(0,221,149,0.8)]"
            aria-hidden="true"
          />
          <p className="font-mono text-[0.875rem] font-medium tracking-[0.16em] text-white/65 uppercase">
            {t.common.monitor}
          </p>
        </div>
        <span className="font-mono text-[0.72rem] tracking-[0.1em] text-white/35 uppercase">
          {t.common.liveSandbox}
        </span>
      </div>

      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label={t.common.monitor}
        className="terminal-scroll flex-1 overflow-x-hidden overflow-y-auto px-5 py-5 font-mono text-[15.5px] leading-[1.7]"
      >
        {logs.length === 0 ? (
          <p className="text-white/30">{t.common.monitorEmpty}</p>
        ) : (
          logs.map((entry) => (
            <div key={entry.id} className="flex animate-[log-in_0.28s_ease-out_both] gap-3">
              <span className="shrink-0 text-[13px] text-white/35">
                {timeFormatter.format(entry.at)}
              </span>
              <span className={cn('shrink-0 text-sm font-medium', channelColor[entry.channel])}>
                [{entry.channel}]
              </span>
              <span className="min-w-0 break-words text-white/75">
                {formatMessage(t.logs[entry.key], entry.params ?? {})}
              </span>
            </div>
          ))
        )}
        <span
          aria-hidden="true"
          className="bg-brand mt-1 inline-block h-5 w-1.5 align-middle"
          style={{ animation: 'caret 1s steps(1, end) infinite' }}
        />
      </div>

      <div className="shrink-0 border-t border-white/[0.07] px-5 py-3 font-mono text-[0.7rem] tracking-[0.06em] text-white/30">
        {t.common.mockRuntime}
      </div>
    </aside>
  );
}
