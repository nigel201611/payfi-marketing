'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';
import { useI18n } from '@/i18n/locale-provider';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();
  const label = theme === 'dark' ? t.common.theme.switchToLight : t.common.theme.switchToDark;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(
        'border-border bg-card/50 text-foreground/65 hover:text-foreground hover:bg-card grid size-10 shrink-0 place-items-center rounded-full border transition-colors',
        className,
      )}
    >
      {theme === 'dark' ? (
        <Sun className="size-[18px]" aria-hidden="true" />
      ) : (
        <Moon className="size-[18px]" aria-hidden="true" />
      )}
    </button>
  );
}
