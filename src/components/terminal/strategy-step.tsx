'use client';

import { ArrowLeft, Check, Wallet } from 'lucide-react';
import CountUp from '@/components/react-bits/CountUp';
import { ActionButton, Eyebrow, StatusDot, Tag, TerminalCard } from '@/components/terminal/ui';
import { formatCurrency, rwaAssets, type AssetId } from '@/constants/terminal';
import { useI18n } from '@/i18n/locale-provider';
import { cn } from '@/lib/utils';

export function StrategyStep({
  availableFunds,
  selectedAssetId,
  retryAvailable,
  onRetry,
  onBack,
}: {
  availableFunds: number;
  selectedAssetId: AssetId | null;
  retryAvailable: boolean;
  onRetry: () => void;
  onBack: () => void;
}) {
  const { t, locale } = useI18n();
  const copy = t.strategy;

  return (
    <div className="py-8 lg:py-10">
      <button
        type="button"
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {copy.back}
      </button>

      <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <h2 className="font-display text-foreground mt-4 text-[clamp(1.75rem,2.6vw,2.2rem)] leading-[1.1] font-extrabold tracking-[-0.04em] sm:whitespace-nowrap">
            {copy.title}
          </h2>
          <p className="text-muted-foreground mt-2.5 max-w-xl text-sm leading-relaxed">
            {copy.description}
          </p>
        </div>

        <TerminalCard className="relative min-w-[240px] overflow-hidden px-5 py-4 sm:translate-y-1.5">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[radial-gradient(ellipse_at_top,rgba(0,221,149,0.12),transparent_70%)]"
          />
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="bg-brand/10 text-accent-text grid size-6 place-items-center rounded-full">
                <Wallet className="size-3.5" aria-hidden="true" />
              </span>
              <p className="text-muted-foreground text-[0.62rem] tracking-[0.12em] uppercase">
                {copy.availableFunds}
              </p>
            </div>
            <p className="font-display text-foreground mt-2 text-2xl font-bold tracking-[-0.03em]">
              <CountUp
                to={availableFunds}
                prefix="$"
                separator=","
                decimals={2}
                duration={1.1}
                trigger="view"
                easing="easeOut"
              />
            </p>
            <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-[0.62rem]">
              <StatusDot />
              {copy.fundingReady}
            </p>
          </div>
        </TerminalCard>
      </div>

      <div className="text-muted-foreground mt-6 flex items-center gap-2 text-xs">
        <StatusDot pulse={!selectedAssetId} />
        {selectedAssetId ? (retryAvailable ? copy.selected : copy.creatingOrder) : copy.scanning}
      </div>

      <TerminalCard className="mt-4 overflow-hidden">
        <ul>
          {rwaAssets.map((asset, index) => {
            const selected = selectedAssetId === asset.id;
            const dimmed = selectedAssetId !== null && !selected;

            return (
              <li
                key={asset.id}
                className={cn(
                  'border-border relative border-b px-5 py-4 transition-colors last:border-b-0',
                  selected &&
                    "bg-brand/[0.06] before:bg-brand before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:rounded-r-full before:content-['']",
                  dimmed && 'opacity-45',
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-muted-foreground font-mono text-[0.6rem] tracking-[0.1em] uppercase">
                      RWA · {String(index + 1).padStart(2, '0')}
                    </p>
                    <p className="text-foreground mt-1 text-base leading-snug font-semibold">
                      {t.assets[asset.id].name}
                    </p>
                    <p className="text-muted-foreground mt-1 line-clamp-1 text-xs leading-relaxed">
                      {t.assets[asset.id].description}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-display text-foreground text-xl font-bold">
                      {formatCurrency(asset.price, locale)}
                    </p>
                    <p className="text-muted-foreground text-[0.6rem]">{t.common.perUnit}</p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag tone="green">APY {asset.apy.toFixed(1)}%</Tag>
                    <Tag>{copy.riskLabels[asset.risk]}</Tag>
                    <Tag>{copy.payoutLabels[asset.payout]}</Tag>
                  </div>
                  <span className="text-muted-foreground flex items-center gap-2 text-xs">
                    {selected ? (
                      retryAvailable ? (
                        <ActionButton autoFocus onClick={onRetry} className="h-8 px-3 text-xs">
                          {copy.retryPayment}
                        </ActionButton>
                      ) : (
                        <>
                          <Check className="text-accent-text size-3" aria-hidden="true" />
                          {copy.selected}
                        </>
                      )
                    ) : selectedAssetId ? (
                      <span className="opacity-60">—</span>
                    ) : (
                      <>
                        <StatusDot pulse />
                        {copy.evaluating}
                      </>
                    )}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </TerminalCard>
    </div>
  );
}
