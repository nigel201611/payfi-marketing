'use client';

import { LanguageIcon } from '@/components/ui/language-icon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useI18n } from '@/i18n/locale-provider';
import { cn } from '@/lib/utils';

export function LanguageSwitch({ className }: { className?: string }) {
  const { t, locale, toggleLocale } = useI18n();
  const target = locale === 'en' ? 'zh' : 'en';
  const hint = `${t.common.currentLanguage} · ${t.common.languageSwitch}`;

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={toggleLocale}
            aria-label={t.common.languageSwitch}
            className={cn(
              'border-border bg-card/50 text-muted-foreground hover:border-foreground/20 hover:text-foreground hover:bg-card inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-3 text-[0.7rem] font-semibold tracking-[0.08em] whitespace-nowrap uppercase transition-colors',
              className,
            )}
          >
            <LanguageIcon locale={target} />
            {t.common.languageDisplay}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={8}>
          {hint}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
