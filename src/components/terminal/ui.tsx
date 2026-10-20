import type {
  ButtonHTMLAttributes,
  CSSProperties,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

export function Eyebrow({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <p
      style={style}
      className={cn(
        'text-accent-text flex items-center gap-2 font-mono text-[0.68rem] font-medium tracking-[0.18em] uppercase',
        className,
      )}
    >
      <span className="bg-accent-text size-1.5 rounded-full" aria-hidden="true" />
      {children}
    </p>
  );
}

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline';
  size?: 'md' | 'lg';
};

export function ActionButton({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ActionButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 disabled:pointer-events-none disabled:opacity-45',
        variant === 'primary'
          ? 'bg-brand text-ink hover:bg-brand-soft shadow-[0_16px_40px_-14px_rgba(0,221,149,0.5)]'
          : 'border-border bg-card/50 text-foreground/80 hover:bg-card hover:text-foreground border',
        size === 'lg' ? 'h-[3.25rem] px-7 text-[0.95rem]' : 'h-11 px-5',
        className,
      )}
      {...props}
    />
  );
}

export function TerminalCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('border-border bg-workspace-card rounded-2xl border', className)}>
      {children}
    </div>
  );
}

export function FieldLabel({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('text-foreground/60 block text-[0.72rem] font-medium tracking-wide', className)}
      {...props}
    />
  );
}

export function TextField({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'border-border bg-background/60 text-foreground placeholder:text-muted-foreground/50 focus:border-brand/60 focus:ring-brand/20 mt-1.5 h-11 w-full rounded-xl border px-3.5 text-sm transition-colors outline-none focus:ring-2',
        className,
      )}
      {...props}
    />
  );
}

export function Tag({
  children,
  tone = 'default',
}: {
  children: ReactNode;
  tone?: 'default' | 'green' | 'amber';
}) {
  return (
    <span
      className={cn(
        'rounded-md px-2 py-1 font-mono text-[0.6rem] tracking-[0.04em] uppercase',
        tone === 'green' && 'bg-brand/10 text-accent-text',
        tone === 'amber' && 'bg-amber-400/10 text-amber-500 dark:text-amber-300',
        tone === 'default' && 'bg-foreground/[0.04] text-muted-foreground',
      )}
    >
      {children}
    </span>
  );
}

export function StatusDot({
  tone = 'green',
  pulse = false,
}: {
  tone?: 'green' | 'amber' | 'red';
  pulse?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative inline-flex size-1.5 shrink-0 rounded-full',
        tone === 'green' && 'bg-brand',
        tone === 'amber' && 'bg-amber-400',
        tone === 'red' && 'bg-red-400',
        pulse && 'animate-pulse',
      )}
    />
  );
}
