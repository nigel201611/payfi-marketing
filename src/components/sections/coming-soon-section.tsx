'use client';

import { ArrowUpRight, Coins, SlidersHorizontal } from 'lucide-react';
import Orb from '@/components/react-bits/Orb';
import { Container } from '@/components/layout/container';
import { Reveal } from '@/components/motion/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { WaitlistStarButton } from '@/components/ui/waitlist';
import { useI18n } from '@/i18n/locale-provider';
import { site } from '@/constants/site';

const cardIcons = [SlidersHorizontal, Coins];

export function ComingSoonSection() {
  const { t } = useI18n();
  const copy = t.comingSoon;
  const cta = copy.cta;

  return (
    <section id="waitlist" className="bg-background relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(55%_40%_at_50%_0%,rgba(0,221,149,0.08),transparent_70%)]" />
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_20%,black_0%,transparent_65%)] opacity-25" />
      </div>

      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
          />
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {copy.cards.map((card, index) => {
            const Icon = cardIcons[index];
            return (
              <Reveal key={card.title} delay={index * 0.08}>
                <article className="group border-border bg-card/50 hover:border-brand/25 relative h-full overflow-hidden rounded-3xl border p-7 transition-colors duration-500 sm:p-9">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_80%_at_100%_0%,rgba(0,221,149,0.07),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="border-border bg-card text-accent-text grid size-11 place-items-center rounded-xl border">
                        <Icon className="size-[18px]" aria-hidden="true" />
                      </span>
                      <span className="border-brand/20 bg-brand/[0.06] text-accent-text rounded-full border px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.14em] uppercase">
                        {card.tag}
                      </span>
                    </div>
                    <h3 className="font-display text-foreground mt-7 text-xl font-bold tracking-[-0.03em] sm:text-2xl">
                      {card.title}
                    </h3>
                    <p className="text-muted-foreground mt-2.5 max-w-md text-sm leading-relaxed">
                      {card.description}
                    </p>
                    <span className="text-muted-foreground/70 mt-6 inline-flex items-center gap-1.5 text-xs font-medium">
                      {copy.cardFootnote}
                      <ArrowUpRight className="text-accent-text/60 size-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1} distance={32}>
          <div className="border-brand/20 from-surface-2 via-ink-soft to-ink relative mt-16 overflow-hidden rounded-[32px] border bg-gradient-to-br text-white sm:mt-20">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(60%_90%_at_100%_50%,rgba(0,221,149,0.16),transparent_60%)]" />
              <div className="bg-grid absolute inset-0 opacity-30" />
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 -right-12 hidden size-[360px] -translate-y-1/2 opacity-55 md:block lg:right-4 lg:size-[420px]"
            >
              <Orb
                colors={['#69ffce', '#00dd95', '#00ab73']}
                backgroundColor="#04110c"
                hoverIntensity={0.3}
                rotateOnHover
                forceHoverState={false}
                speed={0.7}
                glow={0.6}
                intro
              />
            </div>

            <div className="relative max-w-2xl px-6 py-14 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
              <p className="text-brand text-[0.65rem] font-semibold tracking-[0.2em] uppercase">
                {cta.eyebrow}
              </p>
              <h2 className="font-display mt-4 text-[clamp(2.1rem,4.4vw,3.4rem)] leading-[1.02] font-extrabold tracking-[-0.04em] text-white">
                {cta.title}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60">
                {cta.description}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <WaitlistStarButton>{cta.primary}</WaitlistStarButton>
                <a
                  href={site.external.exio}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex h-[3.25rem] items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-6 text-sm font-semibold text-white/75 transition-colors hover:border-white/25 hover:text-white"
                >
                  {cta.secondary}
                  <ArrowUpRight
                    className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
              <p className="mt-5 text-[0.65rem] text-white/25">{cta.note}</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
