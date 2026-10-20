'use client';

import Link from 'next/link';
import { RotateCcw } from 'lucide-react';
import { LanguageSwitch } from '@/components/terminal/language-switch';
import { ExioLogo } from '@/components/brand/exio-logo';
import { NakaLogo } from '@/components/terminal/naka-logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTheme } from '@/components/providers/theme-provider';
import { useI18n } from '@/i18n/locale-provider';
import { cn } from '@/lib/utils';

export function TerminalHeader({ canReset, onReset }: { canReset: boolean; onReset: () => void }) {
  const { t } = useI18n();
  const { theme } = useTheme();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b',
        theme === 'light'
          ? 'border-black/[0.06] bg-[#fbfcfb] shadow-[0_1px_2px_rgba(10,13,11,0.03)]'
          : 'border-border bg-background',
      )}
    >
      <div className="grid h-[72px] w-full grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 items-center">
          <div className="mx-auto flex h-full w-full max-w-[940px] items-center gap-3 px-5 sm:px-8 lg:px-12">
            <Link
              href="/"
              aria-label="EX.IO Agentic Payment — home"
              className="flex shrink-0 items-center gap-3"
            >
              <ExioLogo className="text-foreground h-[22px]" />
              <span className="bg-border hidden h-4 w-px sm:block" aria-hidden="true" />
            </Link>
            <div className="hidden items-center gap-3 sm:flex">
              <NakaLogo />
              <span className="bg-border hidden h-4 w-px md:block" aria-hidden="true" />
              <span className="text-muted-foreground hidden font-mono text-[0.62rem] tracking-[0.14em] uppercase md:block">
                {t.common.liveSandbox}
              </span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-end gap-2 pr-5 sm:pr-8 lg:pr-12">
          <ThemeToggle />
          <LanguageSwitch />
          {canReset ? (
            <button
              type="button"
              onClick={onReset}
              className="border-border bg-card/50 text-muted-foreground hover:border-foreground/20 hover:text-foreground hover:bg-card inline-flex h-10 items-center gap-2 rounded-full border px-3 text-xs font-semibold whitespace-nowrap transition-colors"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{t.common.reset}</span>
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
