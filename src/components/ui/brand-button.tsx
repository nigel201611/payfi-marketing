import { cn } from '@/lib/utils';

export type BrandButtonVariant = 'primary' | 'outline' | 'ghost';
export type BrandButtonSize = 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-55';

const variants: Record<BrandButtonVariant, string> = {
  primary:
    'bg-brand text-ink shadow-[0_16px_40px_-14px_rgba(0,221,149,0.55)] hover:bg-brand-soft hover:shadow-[0_20px_50px_-12px_rgba(105,255,206,0.45)]',
  outline:
    'border border-border bg-card/50 text-foreground/80 hover:border-foreground/20 hover:bg-card hover:text-foreground',
  ghost: 'text-foreground/80 hover:text-foreground',
};

const sizes: Record<BrandButtonSize, string> = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-[3.25rem] px-6 text-[0.95rem]',
};

export function brandButtonClass({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: BrandButtonVariant;
  size?: BrandButtonSize;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}
