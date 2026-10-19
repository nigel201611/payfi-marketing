'use client';

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { ExioLogo } from '@/components/brand/exio-logo';
import { Container } from '@/components/layout/container';
import { useI18n } from '@/i18n/locale-provider';

export function SiteFooter() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background border-border relative overflow-hidden border-t">
      <div
        aria-hidden="true"
        className="via-brand/40 pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
      />
      <Container className="relative z-10 pt-16 pb-10 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link
              href="#top"
              aria-label={`${t.common.exio} ${t.common.agentWallet} — ${t.common.home}`}
            >
              <ExioLogo className="text-foreground h-6" />
            </Link>
            <p className="text-muted-foreground mt-5 max-w-xs text-sm leading-relaxed">
              {t.footer.tagline}
            </p>
            <div className="border-brand/20 bg-brand/[0.06] text-accent-text mt-6 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.7rem] font-medium">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              {t.footer.licensing}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            <h2 className="sr-only">{t.footer.heading}</h2>
            {t.footer.columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-muted-foreground text-[0.7rem] font-semibold tracking-[0.16em] uppercase">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noreferrer noopener' : undefined}
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                      >
                        {link.label}
                        {link.external ? (
                          <span className="sr-only"> ({t.common.opensInNewTab})</span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="text-muted-foreground border-border mt-16 flex flex-col gap-4 border-t pt-7 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} EX.IO. {t.footer.copyright}
          </p>
          <p className="text-muted-foreground/70 max-w-xl text-[0.7rem] leading-relaxed sm:text-right">
            {t.footer.disclaimer}
          </p>
        </div>
      </Container>
    </footer>
  );
}
