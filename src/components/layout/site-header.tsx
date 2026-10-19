'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { ExioLogo } from '@/components/brand/exio-logo';
import { Container } from '@/components/layout/container';
import { LocaleToggle } from '@/components/ui/locale-toggle';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { WaitlistButton } from '@/components/ui/waitlist';
import { useI18n } from '@/i18n/locale-provider';
import { site } from '@/constants/site';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function SiteHeader() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-border bg-background/80 supports-[backdrop-filter]:bg-background/65 border-b backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <Container className="flex h-[72px] items-center justify-between gap-5">
        <Link
          href="#top"
          aria-label={`${site.name} ${t.common.agentWallet} — ${t.common.home}`}
          className="group flex shrink-0 items-center gap-3"
        >
          <ExioLogo className="text-foreground h-[22px] transition-opacity group-hover:opacity-85" />
          <span className="bg-border hidden h-4 w-px sm:block" aria-hidden="true" />
          <span className="hidden items-center gap-2 sm:flex">
            <span className="text-foreground/75 text-[0.82rem] font-medium tracking-tight whitespace-nowrap">
              {t.common.agentWallet}
            </span>
            <span className="border-brand/25 bg-brand/10 text-accent-text rounded-full border px-2 py-0.5 text-[0.6rem] font-semibold tracking-[0.12em] whitespace-nowrap uppercase">
              {t.common.beta}
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 whitespace-nowrap lg:flex">
          {t.nav.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground/65 hover:text-foreground focus-visible:text-foreground rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={site.external.business}
            target="_blank"
            rel="noreferrer noopener"
            className="text-foreground/65 hover:text-foreground hidden rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors xl:inline-flex"
          >
            {t.nav.forBusinesses}
          </Link>
          <Link
            href={site.external.signIn}
            target="_blank"
            rel="noreferrer noopener"
            className="text-foreground/65 hover:text-foreground hidden rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors md:inline-flex"
          >
            {t.nav.signIn}
          </Link>
          <div className="hidden sm:block">
            <WaitlistButton className="h-10 px-5 text-[0.82rem]">
              {t.nav.joinWaitlist}
            </WaitlistButton>
          </div>
          <ThemeToggle />
          <LocaleToggle />
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label={t.nav.openMenu}
                className="border-border bg-card/50 text-foreground hover:bg-card grid size-10 place-items-center rounded-full border transition-colors lg:hidden"
              >
                <Menu className="size-5" aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              showCloseButton={false}
              className="bg-background text-foreground border-border w-[min(420px,92vw)] p-0"
            >
              <SheetHeader className="border-border flex-row items-center justify-between border-b px-6 py-5">
                <SheetTitle className="flex items-center gap-3">
                  <ExioLogo className="text-foreground h-5" />
                  <span className="border-brand/25 bg-brand/10 text-accent-text rounded-full border px-2 py-0.5 text-[0.6rem] font-semibold tracking-[0.12em] whitespace-nowrap uppercase">
                    {t.common.agentWallet}
                  </span>
                </SheetTitle>
                <SheetClose asChild>
                  <button
                    type="button"
                    aria-label={t.common.close}
                    className="text-foreground/60 hover:text-foreground hover:bg-foreground/5 grid size-9 place-items-center rounded-full transition-colors"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </SheetClose>
              </SheetHeader>

              <nav
                aria-label="Mobile"
                className="flex h-[calc(100dvh-162px)] flex-col gap-1 overflow-y-auto px-4 py-6"
              >
                <p className="text-muted-foreground px-3 pb-2 text-[0.68rem] font-semibold tracking-[0.16em] uppercase">
                  {t.common.explore}
                </p>
                {t.nav.items.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="text-foreground/85 hover:bg-foreground/5 rounded-xl px-3 py-3.5 text-base font-medium transition-colors"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}

                <p className="text-muted-foreground px-3 pt-5 pb-2 text-[0.68rem] font-semibold tracking-[0.16em] uppercase">
                  {t.common.exio}
                </p>
                <SheetClose asChild>
                  <a
                    href={site.external.business}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-foreground/85 hover:bg-foreground/5 flex items-center gap-1.5 rounded-xl px-3 py-3.5 text-base font-medium transition-colors"
                  >
                    {t.nav.forBusinesses}
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </a>
                </SheetClose>
                <SheetClose asChild>
                  <a
                    href={site.external.signIn}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-foreground/85 hover:bg-foreground/5 flex items-center gap-1.5 rounded-xl px-3 py-3.5 text-base font-medium transition-colors"
                  >
                    {t.nav.signIn}
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </a>
                </SheetClose>

                <div className="border-border mt-5 flex items-center gap-2 border-t px-3 pt-5">
                  <ThemeToggle />
                  <LocaleToggle />
                </div>
              </nav>

              <div className="bg-background border-border absolute inset-x-0 bottom-0 border-t px-6 py-4">
                <WaitlistButton className="w-full">{t.nav.joinTheWaitlist}</WaitlistButton>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
