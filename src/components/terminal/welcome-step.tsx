'use client';

import { ShieldCheck } from 'lucide-react';
import { AnimatedCta } from '@/components/terminal/animated-cta';
import { Eyebrow } from '@/components/terminal/ui';
import { useI18n } from '@/i18n/locale-provider';

export function WelcomeStep({ onStart }: { onStart: () => void }) {
  const { t } = useI18n();
  const copy = t.welcome;

  return (
    <div className="flex min-h-[calc(100dvh-220px)] flex-col justify-center py-10 lg:py-16">
      <Eyebrow className="animate-hero-in" style={{ animationDelay: '40ms' }}>
        {copy.eyebrow}
      </Eyebrow>

      <h1
        className="font-display text-foreground animate-hero-in mt-7 text-[clamp(2.8rem,5.2vw,5.15rem)] leading-[0.98] font-extrabold tracking-[-0.055em]"
        style={{ animationDelay: '90ms' }}
      >
        <span className="block">{copy.greeting}</span>
        <span className="text-gradient block pb-1">{copy.company}</span>
      </h1>

      <div className="animate-hero-in mt-7 max-w-2xl" style={{ animationDelay: '220ms' }}>
        <p className="text-foreground/80 text-sm font-medium">{copy.legalName}</p>
        <p className="text-muted-foreground mt-1.5 font-mono text-[0.7rem] tracking-[0.08em]">
          {copy.companyIds}
        </p>
        <p className="text-muted-foreground mt-5 max-w-xl text-sm leading-relaxed sm:text-base">
          {copy.description}
        </p>
      </div>

      <div
        className="animate-hero-in mt-8 flex flex-wrap items-center gap-3"
        style={{ animationDelay: '340ms' }}
      >
        <span className="border-brand/25 bg-brand/10 text-accent-text inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          {copy.kyc}
        </span>
        <span className="text-muted-foreground text-xs">{copy.ready}</span>
      </div>

      <div
        className="animate-hero-in mt-9 flex items-center gap-4"
        style={{ animationDelay: '430ms' }}
      >
        <AnimatedCta onClick={onStart}>{copy.cta}</AnimatedCta>
        <span className="text-muted-foreground/70 hidden font-mono text-[0.62rem] tracking-[0.12em] uppercase sm:block">
          {copy.eyebrow}
        </span>
      </div>
    </div>
  );
}
