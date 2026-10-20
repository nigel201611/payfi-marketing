import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/locale-provider';

export function NakaLogo({ className }: { className?: string }) {
  const { t } = useI18n();

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span
        className="bg-brand size-3 shrink-0 rounded-[2px] shadow-[0_0_16px_rgba(0,221,149,0.4)]"
        aria-hidden="true"
      />
      <span className="text-foreground font-mono text-[0.7rem] font-medium tracking-[0.16em] whitespace-nowrap uppercase">
        {t.common.brand}
        <span className="hidden sm:inline">
          {' '}
          <span className="text-muted-foreground/70">/</span> {t.common.product}
        </span>
      </span>
    </div>
  );
}
