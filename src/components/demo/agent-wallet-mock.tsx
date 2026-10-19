'use client';

import { ArrowDownLeft, ArrowUpRight, Check, Clock3, ShieldCheck, Sparkles } from 'lucide-react';
import { useI18n } from '@/i18n/locale-provider';
import { cn } from '@/lib/utils';

const activityAmounts = ['-$17.99', '-$24.00', '-$180.00'];

export function AgentWalletMock({ className }: { className?: string }) {
  const { t } = useI18n();
  const copy = t.walletMock;

  return (
    <figure
      className={cn('relative mx-auto w-full max-w-[560px]', className)}
      role="img"
      aria-label={copy.figureLabel}
    >
      <div
        aria-hidden="true"
        className="absolute -inset-8 -z-10 rounded-[48px] bg-[radial-gradient(60%_60%_at_70%_20%,rgba(0,221,149,0.22),transparent_70%),radial-gradient(50%_50%_at_20%_80%,rgba(0,171,115,0.14),transparent_70%)] blur-2xl"
      />

      <div
        aria-hidden="true"
        className="relative overflow-hidden rounded-[26px] border border-white/[0.1] bg-[linear-gradient(160deg,rgba(19,24,21,0.97)_0%,rgba(8,11,9,0.99)_58%,rgba(11,15,13,0.98)_100%)] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]"
      >
        <div className="flex h-11 items-center justify-between border-b border-white/[0.06] px-4">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/10" />
            <span className="size-2 rounded-full bg-white/[0.07]" />
          </div>
          <div className="flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 font-mono text-[0.6rem] text-white/45">
            <ShieldCheck className="text-brand/70 size-2.5" />
            wallet.ex.io
          </div>
          <div className="border-brand/20 bg-brand/[0.08] text-brand flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.58rem] font-semibold tracking-[0.1em] uppercase">
            <span className="bg-brand size-1 rounded-full" />
            {copy.agentMode}
          </div>
        </div>

        <div className="grid gap-3 p-3.5 sm:grid-cols-[1.12fr_1fr] sm:p-4">
          <div className="space-y-3">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[0.63rem] font-medium tracking-[0.14em] text-white/40 uppercase">
                    {copy.totalBalance}
                  </p>
                  <p className="font-display mt-2 text-[1.9rem] leading-none font-bold tracking-tight text-white">
                    $128,420<span className="text-white/35">.00</span>
                  </p>
                </div>
                <span className="bg-brand/10 text-brand flex items-center gap-1 rounded-full px-2 py-1 text-[0.62rem] font-semibold">
                  <ArrowUpRight className="size-3" />
                  2.4%
                </span>
              </div>

              <div className="mt-4">
                <svg viewBox="0 0 300 82" className="h-[76px] w-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="wallet-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 66 C 18 62 26 58 42 55 C 58 52 66 60 82 54 C 98 48 106 36 122 38 C 138 40 146 47 162 43 C 178 39 186 25 202 24 C 218 23 226 32 242 27 C 258 22 270 12 300 8"
                    fill="none"
                    stroke="var(--color-brand)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0 66 C 18 62 26 58 42 55 C 58 52 66 60 82 54 C 98 48 106 36 122 38 C 138 40 146 47 162 43 C 178 39 186 25 202 24 C 218 23 226 32 242 27 C 258 22 270 12 300 8 L 300 82 L 0 82 Z"
                    fill="url(#wallet-area)"
                  />
                  <circle cx="300" cy="8" r="3" fill="var(--color-brand-soft)" />
                  <circle cx="300" cy="8" r="7" fill="var(--color-brand)" opacity="0.18" />
                </svg>
                <div className="mt-1 flex justify-between text-[0.55rem] font-medium text-white/30">
                  {copy.dates.map((date) => (
                    <span key={date}>{date}</span>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { label: 'USDC', value: '42%', tone: 'bg-brand' },
                  { label: 'USD', value: '33%', tone: 'bg-brand-soft' },
                  { label: 'AED', value: '25%', tone: 'bg-sky' },
                ].map((asset) => (
                  <div
                    key={asset.label}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-2.5 py-2"
                  >
                    <div className="flex items-center gap-1.5 text-[0.58rem] font-medium text-white/45">
                      <span className={`size-1.5 rounded-full ${asset.tone}`} />
                      {asset.label}
                    </div>
                    <p className="mt-1 text-[0.78rem] font-semibold text-white/85">{asset.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5 sm:block">
              <div className="flex items-center justify-between">
                <p className="text-[0.63rem] font-medium tracking-[0.14em] text-white/40 uppercase">
                  {copy.spendingThisMonth}
                </p>
                <p className="font-mono text-[0.6rem] text-white/35">$1,124.50</p>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="from-brand-soft via-brand to-brand h-full w-[68%] rounded-full bg-gradient-to-r" />
              </div>
              <div className="mt-2 flex justify-between text-[0.58rem] text-white/35">
                <span>{copy.budgetUsed}</span>
                <span>{copy.budgetLeft}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex-1 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
              <div className="flex items-center justify-between">
                <p className="text-[0.63rem] font-medium tracking-[0.14em] text-white/40 uppercase">
                  {copy.spendRequests}
                </p>
                <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[0.55rem] font-semibold text-amber-300">
                  {copy.pendingCount}
                </span>
              </div>

              <div className="border-brand/20 bg-brand/[0.05] mt-3 rounded-xl border p-3">
                <div className="flex items-start gap-2.5">
                  <span className="from-brand-soft to-brand text-ink grid size-7 shrink-0 place-items-center rounded-full bg-gradient-to-br text-[0.6rem] font-bold">
                    H
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.72rem] leading-snug font-semibold text-white/90">
                      {copy.wantsToSpend}
                    </p>
                    <p className="mt-0.5 text-[0.6rem] leading-snug text-white/40">
                      {copy.requestMeta}
                    </p>
                  </div>
                  <p className="font-display text-[0.82rem] font-bold text-white">$180</p>
                </div>
                <div className="mt-3 flex gap-1.5">
                  <span className="flex-1 rounded-md border border-white/10 py-1.5 text-center text-[0.58rem] font-semibold text-white/55">
                    {copy.decline}
                  </span>
                  <span className="bg-brand text-ink flex-1 rounded-md py-1.5 text-center text-[0.58rem] font-bold">
                    {copy.approve}
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                {copy.activities.map((activity, index) => {
                  const pending = index === copy.activities.length - 1;
                  return (
                    <div key={activity.name} className="flex items-center gap-2.5">
                      <span
                        className={`grid size-6 shrink-0 place-items-center rounded-full ${
                          pending ? 'bg-amber-400/10 text-amber-300' : 'text-brand bg-white/[0.05]'
                        }`}
                      >
                        {pending ? <Clock3 className="size-3" /> : <Check className="size-3" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[0.66rem] font-medium text-white/80">
                          {activity.name}
                        </p>
                        <p className="truncate text-[0.55rem] text-white/30">{activity.meta}</p>
                      </div>
                      <span className="font-mono text-[0.6rem] text-white/55">
                        {activityAmounts[index]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="from-surface-2 to-ink hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br p-3.5 sm:block">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-brand/15 text-brand grid size-6 place-items-center rounded-full">
                    <Sparkles className="size-3" />
                  </span>
                  <p className="text-[0.66rem] font-semibold text-white/85">{copy.agentInsight}</p>
                </div>
                <span className="text-[0.5rem] tracking-[0.12em] text-white/25 uppercase">
                  {copy.live}
                </span>
              </div>
              <p className="mt-2 text-[0.6rem] leading-relaxed text-white/45">
                {copy.insightBefore}
                <span className="text-brand">{copy.insightHighlight}</span>
                {copy.insightAfter}
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-[0.55rem] text-white/30">
                <ArrowDownLeft className="text-brand/70 size-2.5" />
                {copy.shared}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5 text-[0.56rem] text-white/30">
          <span className="flex items-center gap-1.5">
            <span className="bg-brand/70 size-1.5 rounded-full" />
            {copy.passkeySession}
          </span>
          <span className="font-mono">{copy.card}</span>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="bg-surface/95 motion-safe:animate-float absolute top-24 -right-4 hidden w-[194px] rounded-2xl border border-white/10 p-3 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur md:block"
      >
        <div className="flex items-center gap-2">
          <span className="bg-brand/15 text-brand grid size-7 place-items-center rounded-full">
            <Check className="size-3.5" />
          </span>
          <div>
            <p className="text-[0.64rem] font-semibold text-white/90">{copy.spendApproved}</p>
            <p className="text-[0.54rem] text-white/40">Triplo · $180.00</p>
          </div>
        </div>
        <div className="mt-2.5 rounded-lg bg-white/[0.04] px-2 py-1.5 font-mono text-[0.54rem] text-white/45">
          {copy.oneTimeCard}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="bg-surface/95 motion-safe:animate-float-slow absolute -bottom-6 -left-3 hidden items-center gap-2 rounded-full border border-white/10 px-3 py-2 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.8)] backdrop-blur sm:flex"
      >
        <span className="bg-brand/15 text-brand grid size-5 place-items-center rounded-full">
          <ShieldCheck className="size-3" />
        </span>
        <span className="text-[0.6rem] font-medium text-white/70">{copy.neverSees}</span>
      </div>
    </figure>
  );
}
