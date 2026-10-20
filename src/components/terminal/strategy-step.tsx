'use client';

import { Check, Clock3, Sparkles } from 'lucide-react';
import CountUp from '@/components/react-bits/CountUp';
import { Eyebrow, StatusDot, Tag, TerminalCard } from '@/components/terminal/ui';
import { formatCurrency, rwaAssets, type AssetId } from '@/constants/terminal';
import { useI18n } from '@/i18n/locale-provider';
import { formatMessage } from '@/i18n/messages';
import { cn } from '@/lib/utils';

export function StrategyStep({
  availableFunds,
  selectedAssetId,
}: {
  availableFunds: number;
  selectedAssetId: AssetId | null;
}) {
  const { t, locale } = useI18n();
  const copy = t.strategy;

  return (
    <div className="py-8 lg:py-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <h2 className="font-display text-foreground mt-4 text-[clamp(2rem,3.4vw,3rem)] leading-[1.02] font-extrabold tracking-[-0.045em]">
            {copy.title}
          </h2>
        </div>
        <TerminalCard className="min-w-[220px] px-5 py-4">
          <p className="text-muted-foreground text-[0.62rem] tracking-[0.12em] uppercase">
            {copy.availableFunds}
          </p>
          <p className="font-display text-foreground mt-1 text-2xl font-bold tracking-[-0.03em]">
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
        </TerminalCard>
      </div>

      <div className="text-muted-foreground mt-6 flex items-center gap-2 text-xs">
        <StatusDot pulse={!selectedAssetId} />
        {selectedAssetId ? copy.creatingOrder : copy.scanning}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {rwaAssets.map((asset, index) => {
          const selected = selectedAssetId === asset.id;
          const dimmed = selectedAssetId !== null && !selected;
          const updatedLabel =
            asset.updatedSeconds >= 60
              ? formatMessage(copy.updatedMinutes, {
                  minutes: Math.round(asset.updatedSeconds / 60),
                })
              : formatMessage(copy.updated, { seconds: asset.updatedSeconds });

          return (
            <TerminalCard
              key={asset.id}
              className={cn(
                'relative flex flex-col p-5 transition-all duration-500',
                selected && 'border-brand/50 bg-brand/[0.06] ring-brand/25 ring-1',
                dimmed && 'opacity-40',
              )}
            >
              {selected ? (
                <span className="border-brand/30 bg-brand/10 text-accent-text absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6rem] font-semibold">
                  <Sparkles className="size-3" aria-hidden="true" />
                  {copy.selected}
                </span>
              ) : null}

              <div className="pr-20">
                <p className="text-muted-foreground font-mono text-[0.6rem] tracking-[0.1em] uppercase">
                  RWA · {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="font-display text-foreground mt-2 text-base leading-tight font-bold tracking-[-0.02em]">
                  {t.assets[asset.id].name}
                </h3>
                <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-[0.62rem]">
                  <Clock3 className="size-3" aria-hidden="true" />
                  {updatedLabel}
                </p>
              </div>

              <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
                {t.assets[asset.id].description}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                <Tag tone="green">APY {asset.apy.toFixed(1)}%</Tag>
                <Tag>{copy.riskLabels[asset.risk]}</Tag>
                <Tag>{copy.investorLabels[asset.investor]}</Tag>
                <Tag>{copy.payoutLabels[asset.payout]}</Tag>
                <Tag>{copy.settlementLabel}</Tag>
              </div>

              <div className="border-border mt-4 flex items-end justify-between border-t pt-3">
                <div>
                  <p className="font-display text-foreground text-lg font-bold">
                    {formatCurrency(asset.price, locale)}
                  </p>
                  <p className="text-muted-foreground text-[0.58rem]">{t.common.perUnit}</p>
                </div>
                <span className="text-muted-foreground flex items-center gap-1.5 text-[0.62rem]">
                  {selected ? (
                    <>
                      <Check className="text-accent-text size-3" aria-hidden="true" />
                      {copy.creatingOrder}
                    </>
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
            </TerminalCard>
          );
        })}
      </div>
    </div>
  );
}
