import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/locale-provider';

export function NakaLogo({ className }: { className?: string }) {
  const { t } = useI18n();

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="text-foreground font-mono text-[0.7rem] font-medium tracking-[0.16em] whitespace-nowrap uppercase">
        {t.common.brand} {t.common.product}
      </span>
    </div>
  );
}
