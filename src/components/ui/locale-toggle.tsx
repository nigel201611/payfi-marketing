'use client';

import { LanguageIcon } from '@/components/ui/language-icon';
import { useI18n } from '@/i18n/locale-provider';
import { cn } from '@/lib/utils';

export function LocaleToggle({ className }: { className?: string }) {
  const { t, locale, toggleLocale } = useI18n();

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={t.common.language.switch}
      title={t.common.language.switch}
      className={cn(
        'border-border bg-card/50 text-foreground/70 hover:text-foreground hover:bg-card inline-flex h-10 items-center gap-1.5 rounded-full border px-3 text-[0.72rem] font-semibold transition-colors',
        className,
      )}
    >
      <LanguageIcon locale={locale === 'en' ? 'zh' : 'en'} />
      {t.common.language.display}
    </button>
  );
}
