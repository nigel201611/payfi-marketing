'use client';

import type { ReactNode } from 'react';
import { ArrowRight, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import SpotlightCard from '@/components/react-bits/SpotlightCard';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { useI18n } from '@/i18n/locale-provider';
import { cn } from '@/lib/utils';

function CardLabel({ children }: { children: ReactNode }) {
  return (
    <span className="border-ink/[0.08] text-ink/45 inline-flex items-center gap-1.5 rounded-full border bg-white px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.14em] uppercase">
      <span className="bg-brand-strong size-1 rounded-full" />
      {children}
    </span>
  );
}

function ApprovalsVisual() {
  const { t } = useI18n();
  const copy = t.howItWorks.visuals.approvals;

  return (
    <div
      aria-hidden="true"
      className="border-ink/[0.07] relative mt-7 overflow-hidden rounded-2xl border bg-[linear-gradient(135deg,#e8fbf2_0%,#f7fffb_48%,#e9f5ff_100%)] p-4 sm:p-5"
    >
      <div className="bg-brand/20 absolute -top-10 -right-10 size-40 rounded-full blur-3xl" />
      <div className="relative">
        <div className="mb-3 flex items-center justify-between px-1">
          <span className="text-ink/35 text-[0.6rem] font-semibold tracking-[0.15em] uppercase">
            {copy.inbox}
          </span>
          <span className="text-ink/35 flex items-center gap-1.5 text-[0.58rem] font-medium">
            <span className="bg-brand-strong size-1.5 rounded-full" />
            {copy.live}
          </span>
        </div>

        <div className="border-ink/[0.06] rounded-2xl border bg-white p-4 shadow-[0_20px_45px_-30px_rgba(4,17,12,0.5)]">
          <div className="flex items-start gap-3">
            <span className="from-brand-soft to-brand text-ink grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br text-xs font-bold">
              H
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-ink text-[0.8rem] font-semibold">{copy.request}</p>
              <p className="text-ink/45 mt-1 text-[0.65rem]">{copy.meta}</p>
              <div className="mt-3 flex gap-2">
                <span className="border-ink/10 text-ink/50 rounded-lg border px-3 py-1.5 text-[0.62rem] font-semibold">
                  {copy.decline}
                </span>
                <span className="bg-ink rounded-lg px-3 py-1.5 text-[0.62rem] font-semibold text-white">
                  {copy.approve}
                </span>
                <span className="text-ink/35 ml-auto flex items-center gap-1 text-[0.58rem]">
                  <ShieldCheck className="text-brand-ink size-3" />
                  {copy.passkey}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-ink/[0.05] mt-2.5 ml-6 flex items-center gap-3 rounded-xl border bg-white/70 px-4 py-2.5 backdrop-blur">
          <span className="bg-brand/15 text-brand-ink grid size-6 place-items-center rounded-full">
            <Check className="size-3.5" />
          </span>
          <div className="flex-1">
            <p className="text-ink/70 text-[0.68rem] font-medium">{copy.settledTitle}</p>
            <p className="text-ink/35 text-[0.58rem]">{copy.settledMeta}</p>
          </div>
          <span className="bg-brand/10 text-brand-ink rounded-full px-2 py-0.5 text-[0.55rem] font-semibold">
            {copy.settledStatus}
          </span>
        </div>
      </div>
    </div>
  );
}

const recommendationTones = [
  'from-brand-soft/70 to-brand/35',
  'from-brand/20 to-brand-soft/40',
  'from-ink/10 to-brand-soft/50',
];
const recommendationLabels = ['A', 'B', 'C'];

function RecommendationsVisual() {
  const { t } = useI18n();
  const copy = t.howItWorks.visuals.recommendations;

  return (
    <div
      aria-hidden="true"
      className="border-ink/[0.07] mt-7 rounded-2xl border bg-[linear-gradient(135deg,#eef7ff_0%,#ffffff_50%,#e9fbf3_100%)] p-4"
    >
      <div className="border-ink/[0.06] rounded-xl border bg-white p-4 shadow-[0_16px_34px_-30px_rgba(4,17,12,0.5)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="from-brand-soft to-brand text-ink grid size-7 place-items-center rounded-full bg-gradient-to-br text-[0.6rem] font-bold">
              M
            </span>
            <div>
              <p className="text-ink text-[0.72rem] font-semibold">{copy.agent}</p>
              <p className="text-ink/40 text-[0.56rem]">{copy.agentMeta}</p>
            </div>
          </div>
          <span className="bg-brand/10 text-brand-ink rounded-full px-2 py-0.5 text-[0.55rem] font-semibold">
            {copy.pill}
          </span>
        </div>

        <p className="text-ink/60 mt-3 text-[0.68rem] leading-relaxed">{copy.message}</p>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {copy.products.map((product, index) => (
            <div key={product.name} className="border-ink/[0.06] rounded-lg border p-1.5">
              <div
                className={`flex h-14 items-end justify-between rounded-md bg-gradient-to-br ${recommendationTones[index]} p-1.5`}
              >
                <span className="text-ink rounded bg-white/80 px-1 text-[0.5rem] font-bold">
                  {recommendationLabels[index]}
                </span>
              </div>
              <p className="text-ink/70 mt-1.5 truncate text-[0.56rem] font-medium">
                {product.name}
              </p>
              <p className="text-ink/35 font-mono text-[0.55rem]">{product.price}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {copy.chips.map((chip) => (
            <span
              key={chip}
              className="bg-ink/[0.04] text-ink/45 rounded-md px-2 py-1 text-[0.52rem]"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const ledgerRows = [
  { merchant: 'Triplo', credential: '·· 9081', amount: '$180.00', key: 'approved' as const },
  { merchant: 'Cartsy', credential: '·· 1842', amount: '$17.99', key: 'settled' as const },
  { merchant: 'Vercel', credential: '·· 7741', amount: '$24.00', key: 'settled' as const },
  { merchant: 'Figma', credential: '·· 5520', amount: '$15.00', key: 'settled' as const },
];

function LedgerVisual() {
  const { t } = useI18n();
  const copy = t.howItWorks.visuals.history;

  return (
    <div
      aria-hidden="true"
      className="border-ink/[0.07] mt-7 overflow-hidden rounded-2xl border bg-white"
    >
      <div className="border-ink/[0.06] flex items-center justify-between border-b px-4 py-3">
        <span className="text-ink/35 text-[0.6rem] font-semibold tracking-[0.15em] uppercase">
          {copy.title}
        </span>
        <span className="text-ink/30 font-mono text-[0.55rem]">{copy.month}</span>
      </div>
      <div className="text-ink/30 grid grid-cols-[1fr_auto_auto] gap-x-3 px-4 py-2 text-[0.52rem] font-medium tracking-[0.1em] uppercase">
        <span>{copy.columns[0]}</span>
        <span className="text-right">{copy.columns[1]}</span>
        <span className="w-[62px] text-right">{copy.columns[2]}</span>
      </div>
      {ledgerRows.map((row, index) => (
        <div
          key={row.merchant}
          className={cn(
            'grid grid-cols-[1fr_auto_auto] items-center gap-x-3 px-4 py-2.5',
            index !== ledgerRows.length - 1 && 'border-ink/[0.05] border-b',
          )}
        >
          <div className="min-w-0">
            <p className="text-ink/75 text-[0.68rem] font-medium">{row.merchant}</p>
            <p className="text-ink/30 font-mono text-[0.55rem]">
              {copy.oneTime} · {row.credential}
            </p>
          </div>
          <span className="text-ink/55 font-mono text-[0.63rem]">{row.amount}</span>
          <span className="flex justify-end">
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[0.52rem] font-semibold',
                row.key === 'approved' ? 'bg-brand/12 text-brand-ink' : 'bg-ink/[0.05] text-ink/40',
              )}
            >
              {copy.statuses[row.key]}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

const insightBars = [
  { height: '78%', active: true },
  { height: '52%', active: false },
  { height: '64%', active: false },
  { height: '35%', active: false },
];

function InsightsVisual() {
  const { t } = useI18n();
  const copy = t.howItWorks.visuals.insights;

  return (
    <div
      aria-hidden="true"
      className="border-ink/[0.07] mt-7 grid gap-3 rounded-2xl border bg-[linear-gradient(140deg,#f4fbf7,#ffffff_55%,#eef7ff)] p-4 sm:grid-cols-[1.05fr_0.95fr]"
    >
      <div className="border-ink/[0.06] rounded-xl border bg-white p-4">
        <div className="flex items-center justify-between">
          <span className="text-ink/35 text-[0.6rem] font-semibold tracking-[0.15em] uppercase">
            {copy.title}
          </span>
          <span className="text-brand-ink text-[0.55rem] font-medium">{copy.change}</span>
        </div>
        <div className="mt-4 flex h-[92px] items-end gap-3 px-1">
          {insightBars.map((bar, index) => (
            <div key={copy.categories[index]} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-full w-full items-end">
                <div
                  className={cn(
                    'w-full rounded-t-md',
                    bar.active
                      ? 'from-brand-strong to-brand-soft bg-gradient-to-t'
                      : 'bg-ink/[0.09]',
                  )}
                  style={{ height: bar.height }}
                />
              </div>
              <span className="text-ink/35 text-[0.52rem]">{copy.categories[index]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-ink/[0.06] flex flex-col justify-between rounded-xl border bg-white p-4">
        <div>
          <div className="text-ink/35 flex items-center gap-1.5 text-[0.58rem] font-semibold tracking-[0.13em] uppercase">
            <Sparkles className="text-brand-ink size-3" />
            {copy.shared}
          </div>
          <p className="text-ink/60 mt-2 text-[0.7rem] leading-relaxed">
            {copy.messageBefore}
            <span className="text-brand-ink font-semibold">{copy.messageHighlight}</span>
            {copy.messageAfter}
          </p>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="bg-brand/10 text-brand-ink rounded-md px-2 py-1 text-[0.52rem] font-medium">
            {copy.chips[0]}
          </span>
          <span className="bg-ink/[0.04] text-ink/40 rounded-md px-2 py-1 text-[0.52rem]">
            {copy.chips[1]}
          </span>
        </div>
      </div>
    </div>
  );
}

const visuals = [ApprovalsVisual, LedgerVisual, InsightsVisual, RecommendationsVisual] as const;
const spans = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7'] as const;

export function HowItWorksSection() {
  const { t } = useI18n();
  const copy = t.howItWorks;

  return (
    <section
      id="how-it-works"
      className="bg-muted text-foreground relative overflow-hidden py-24 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_55%)] opacity-40"
      />
      <div
        aria-hidden="true"
        className="bg-brand/10 pointer-events-none absolute top-20 -right-32 size-[420px] rounded-full blur-[110px]"
      />

      <Container className="relative">
        <Reveal>
          <SectionHeading
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
          />
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          {copy.cards.map((card, index) => {
            const Visual = visuals[index];
            return (
              <Reveal key={card.title} delay={index * 0.08} className={cn('min-w-0', spans[index])}>
                <SpotlightCard
                  theme="light"
                  spotlightColor="#00dd95"
                  intensity={0.18}
                  borderGlow={0.55}
                  className="flex h-full flex-col transition-transform duration-500 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between gap-4">
                    <CardLabel>{card.label}</CardLabel>
                    <span className="text-ink/20 font-mono text-[0.6rem]">0{index + 1}</span>
                  </div>
                  <h3 className="font-display text-ink mt-5 text-xl font-bold tracking-[-0.03em] sm:text-[1.35rem]">
                    {card.title}
                  </h3>
                  <p className="text-ink/55 mt-2.5 max-w-lg text-sm leading-relaxed">
                    {card.description}
                  </p>
                  <div className="mt-auto">
                    <Visual />
                  </div>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-10 flex justify-center">
            <a
              href="#control"
              className="group border-ink/10 text-ink/70 hover:border-ink/20 hover:text-ink inline-flex items-center gap-2 rounded-full border bg-white px-5 py-2.5 text-sm font-semibold shadow-sm transition-all"
            >
              {copy.seeControl}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
