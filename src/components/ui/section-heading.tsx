import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  titleClassName?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  titleClassName,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div
      className={cn(
        'flex flex-col',
        centered ? 'items-center text-center' : 'items-start',
        className,
      )}
    >
      <div className="text-accent-text mb-5 flex items-center gap-2.5 text-[0.7rem] font-semibold tracking-[0.18em] uppercase">
        <span className="bg-accent-text inline-block size-1.5 rounded-full" />
        {eyebrow}
      </div>
      <h2
        className={cn(
          'font-display text-foreground max-w-3xl text-[clamp(2.1rem,4.2vw,3.6rem)] leading-[1.02] font-extrabold',
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:text-lg',
            centered && 'mx-auto',
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
