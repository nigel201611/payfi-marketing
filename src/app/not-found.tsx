'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { brandButtonClass } from '@/components/ui/brand-button';
import { useI18n } from '@/i18n/locale-provider';

export default function NotFound() {
  const { t } = useI18n();
  const copy = t.notFound;

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_50%_30%,black,transparent_70%)] opacity-30"
      />
      <div
        aria-hidden="true"
        className="bg-brand/[0.07] pointer-events-none absolute top-1/3 left-1/2 -z-10 size-[520px] -translate-x-1/2 rounded-full blur-[120px]"
      />
      <Container className="flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <p className="text-accent-text font-mono text-[0.7rem] font-semibold tracking-[0.2em] uppercase">
          {copy.eyebrow}
        </p>
        <h1 className="font-display text-foreground mt-5 max-w-2xl text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] font-extrabold tracking-[-0.04em]">
          {copy.title}
        </h1>
        <p className="text-muted-foreground mt-5 max-w-md text-base leading-relaxed">
          {copy.description}
        </p>
        <Link href="/" className={brandButtonClass({ size: 'lg', className: 'mt-8' })}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          {copy.back}
        </Link>
      </Container>
    </section>
  );
}
