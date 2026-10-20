'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { NakaLogo } from '@/components/terminal/naka-logo';
import { LanguageSwitch } from '@/components/terminal/language-switch';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useI18n } from '@/i18n/locale-provider';

export default function NotFound() {
  const { t } = useI18n();
  const copy = t.notFound;

  return (
    <main className="bg-background text-foreground flex min-h-dvh flex-col">
      <header className="border-border flex h-[72px] items-center justify-between border-b px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Naka RWA Agent home">
          <NakaLogo />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitch />
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-[760px] flex-1 flex-col justify-center px-5 py-20 sm:px-8">
        <p className="text-accent-text font-mono text-[0.68rem] font-medium tracking-[0.18em] uppercase">
          {copy.eyebrow}
        </p>
        <h1 className="font-display text-foreground mt-5 text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] font-extrabold tracking-[-0.045em]">
          {copy.title}
        </h1>
        <p className="text-muted-foreground mt-5 max-w-md text-base leading-relaxed">
          {copy.description}
        </p>
        <Link
          href="/"
          className="bg-brand text-ink hover:bg-brand-soft mt-8 inline-flex h-12 w-fit items-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {copy.back}
        </Link>
      </div>
    </main>
  );
}
