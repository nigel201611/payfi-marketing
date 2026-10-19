'use client';

import { Gauge, KeyRound, Power } from 'lucide-react';
import { ApprovalDemo } from '@/components/demo/approval-demo';
import { Container } from '@/components/layout/container';
import { Reveal } from '@/components/motion/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { useI18n } from '@/i18n/locale-provider';

const featureIcons = [Gauge, KeyRound, Power];

export function ControlSection() {
  const { t } = useI18n();
  const copy = t.control;

  return (
    <section id="control" className="bg-background relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(65%_50%_at_75%_30%,rgba(0,221,149,0.1),transparent_65%),radial-gradient(50%_40%_at_15%_80%,rgba(0,221,149,0.05),transparent_70%)]" />
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_40%,black_5%,transparent_70%)] opacity-30" />
      </div>

      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 xl:gap-24">
          <div>
            <Reveal>
              <SectionHeading
                eyebrow={copy.eyebrow}
                title={copy.title}
                description={copy.description}
              />
            </Reveal>

            <div className="mt-12 space-y-0">
              {copy.features.map((feature, index) => {
                const Icon = featureIcons[index];
                return (
                  <Reveal key={feature.title} delay={0.08 * index}>
                    <div className="group border-border border-t py-6 first:border-t-0 first:pt-0">
                      <div className="flex items-start gap-4">
                        <span className="border-border bg-card/50 text-accent-text group-hover:border-brand/30 group-hover:bg-brand/[0.07] mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl border transition-colors">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <div>
                          <h3 className="font-display text-foreground text-lg font-bold tracking-[-0.02em]">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={0.1}>
              <p className="text-muted-foreground/70 mt-10 flex items-center gap-2 text-[0.7rem]">
                <span className="bg-accent-text/60 size-1.5 rounded-full" aria-hidden="true" />
                {copy.footerNote}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.12} distance={36}>
            <div className="lg:sticky lg:top-28">
              <div className="mb-4 flex items-center justify-between px-1">
                <span className="text-muted-foreground text-[0.62rem] font-semibold tracking-[0.18em] uppercase">
                  {copy.interactiveDemo}
                </span>
                <span className="text-muted-foreground/70 text-[0.62rem]">{copy.demoHint}</span>
              </div>
              <ApprovalDemo />
              <p className="text-muted-foreground/70 mt-4 px-1 text-[0.65rem] leading-relaxed">
                {copy.demoDisclaimer}
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
