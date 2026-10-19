'use client';

import { ArrowDown, Check, Clock3, Minus, Terminal } from 'lucide-react';
import { CodeTabs } from '@/components/developers/code-tabs';
import { Container } from '@/components/layout/container';
import { Reveal } from '@/components/motion/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { WaitlistButton } from '@/components/ui/waitlist';
import { useI18n } from '@/i18n/locale-provider';
import { formatMessage } from '@/i18n/messages';
import { cn } from '@/lib/utils';

function MatrixCell({
  supported,
  supportedLabel,
  notSupportedLabel,
}: {
  supported: boolean;
  supportedLabel: string;
  notSupportedLabel: string;
}) {
  return (
    <div className="flex items-center justify-center">
      {supported ? (
        <>
          <span className="bg-brand/10 text-accent-text grid size-6 place-items-center rounded-full">
            <Check className="size-3.5" aria-hidden="true" />
          </span>
          <span className="sr-only">{supportedLabel}</span>
        </>
      ) : (
        <>
          <span className="bg-foreground/5 text-muted-foreground grid size-6 place-items-center rounded-full">
            <Minus className="size-3.5" aria-hidden="true" />
          </span>
          <span className="sr-only">{notSupportedLabel}</span>
        </>
      )}
    </div>
  );
}

export function DeveloperSection() {
  const { t } = useI18n();
  const copy = t.developer;
  const matrix = copy.matrix;

  return (
    <section id="developers" className="bg-muted relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_30%,transparent_90%)] opacity-30"
      />
      <div
        aria-hidden="true"
        className="bg-brand/[0.05] pointer-events-none absolute top-40 -left-40 size-[460px] rounded-full blur-[120px]"
      />

      <Container className="relative">
        <Reveal>
          <SectionHeading
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
          />
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <div>
            <ol className="space-y-0">
              {copy.steps.map((step, index) => (
                <Reveal key={step.step} delay={index * 0.07}>
                  <li className="relative flex gap-5 pb-8 last:pb-0">
                    {index !== copy.steps.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="bg-border absolute top-11 left-[19px] h-[calc(100%-2.5rem)] w-px"
                      />
                    ) : null}
                    <span className="border-border bg-card text-accent-text relative z-10 grid size-10 shrink-0 place-items-center rounded-full border font-mono text-[0.65rem] font-semibold shadow-sm">
                      {step.step}
                    </span>
                    <div className="pt-1.5">
                      <h3 className="font-display text-foreground text-lg font-bold tracking-[-0.02em]">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground mt-1.5 max-w-sm text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <WaitlistButton variant="outline" className="gap-2">
                  {copy.waitlistCta}
                </WaitlistButton>
                <a
                  href="#supported"
                  className="group text-muted-foreground hover:text-foreground inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors"
                >
                  {copy.viewFeatures}
                  <ArrowDown
                    className="size-4 transition-transform group-hover:translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="border-border bg-card/60 text-muted-foreground mt-8 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-[0.7rem]">
                <Clock3 className="text-accent-text size-3.5" aria-hidden="true" />
                {copy.badgeFirstPayment}
              </div>
            </Reveal>

            <Reveal delay={0.26}>
              <div className="border-border bg-card/60 text-muted-foreground mt-4 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-[0.7rem]">
                <Terminal className="text-accent-text size-3.5" aria-hidden="true" />
                {copy.badgeMcp}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} distance={32}>
            <CodeTabs />
          </Reveal>
        </div>

        <Reveal>
          <div className="border-border mt-20 border-t pt-12">
            <div id="supported" className="scroll-mt-28">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="font-display text-foreground text-xl font-bold tracking-[-0.03em]">
                    {matrix.title}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm">{matrix.subtitle}</p>
                </div>
                <p className="text-muted-foreground/70 text-[0.68rem]">{matrix.caption}</p>
              </div>

              <div className="border-border bg-card mt-6 overflow-hidden rounded-2xl border shadow-[0_20px_50px_-40px_rgba(4,17,12,0.4)]">
                <div className="hidden md:block">
                  <div className="border-border bg-muted/70 grid grid-cols-[1.6fr_repeat(4,1fr)] border-b px-6 py-3">
                    <span className="text-muted-foreground text-[0.62rem] font-semibold tracking-[0.14em] uppercase">
                      {matrix.featureLabel}
                    </span>
                    {matrix.columns.map((column) => (
                      <span
                        key={column}
                        className="text-muted-foreground text-center text-[0.62rem] font-semibold tracking-[0.14em] uppercase"
                      >
                        {column}
                      </span>
                    ))}
                  </div>
                  {matrix.rows.map((row, rowIndex) => (
                    <div
                      key={row.feature}
                      className={cn(
                        'grid grid-cols-[1.6fr_repeat(4,1fr)] items-center px-6 py-4',
                        rowIndex !== matrix.rows.length - 1 && 'border-border border-b',
                      )}
                    >
                      <span className="text-foreground/75 text-sm font-medium">{row.feature}</span>
                      {row.values.map((supported, index) => (
                        <MatrixCell
                          key={`${row.feature}-${matrix.columns[index]}`}
                          supported={supported}
                          supportedLabel={formatMessage(matrix.supportedOn, {
                            column: matrix.columns[index],
                          })}
                          notSupportedLabel={formatMessage(matrix.notSupportedOn, {
                            column: matrix.columns[index],
                          })}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                <div className="divide-border divide-y md:hidden">
                  {matrix.rows.map((row) => (
                    <div key={row.feature} className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground/75 text-sm font-medium">
                          {row.feature}
                        </span>
                        <span className="text-muted-foreground/70 text-[0.6rem]">
                          {row.values.filter(Boolean).length}/{matrix.columns.length}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {matrix.columns.map((column, index) => (
                          <div
                            key={column}
                            className="bg-muted flex items-center justify-between rounded-lg px-2.5 py-2"
                          >
                            <span className="text-muted-foreground text-[0.62rem] font-medium">
                              {column}
                            </span>
                            {row.values[index] ? (
                              <Check
                                className="text-accent-text size-3.5"
                                aria-label={formatMessage(matrix.supportedOn, { column })}
                              />
                            ) : (
                              <Minus
                                className="text-muted-foreground/50 size-3.5"
                                aria-label={formatMessage(matrix.notSupportedOn, { column })}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
