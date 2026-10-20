'use client';

import { Check, Loader2, PackageCheck, ShieldCheck } from 'lucide-react';
import { ActionButton, Eyebrow, StatusDot, TerminalCard } from '@/components/terminal/ui';
import { formatCurrency, demoConfig, type Order } from '@/constants/terminal';
import { useI18n } from '@/i18n/locale-provider';
import { formatMessage } from '@/i18n/messages';
import { cn } from '@/lib/utils';

export function SettlementStep({
  order,
  wallet,
  settled,
  onConfirm,
}: {
  order: Order;
  wallet: 'a' | 'b';
  settled: boolean;
  onConfirm: () => void;
}) {
  const { t, locale } = useI18n();
  const copy = t.settlement;
  const walletLabel = t.intent.wallets.find((item) => item.value === wallet)?.label ?? '';
  const assetName = t.assets[order.asset.id].name;

  const steps = [
    { key: 'intent' as const, done: true, active: false },
    { key: 'deposit' as const, done: true, active: false },
    { key: 'payout' as const, done: true, active: false },
    { key: 'settled' as const, done: settled, active: !settled },
  ];

  return (
    <div className="py-8 lg:py-12">
      <Eyebrow>{copy.eyebrow}</Eyebrow>
      <h2 className="font-display text-foreground mt-4 text-[clamp(2rem,3.4vw,3rem)] leading-[1.02] font-extrabold tracking-[-0.045em]">
        {copy.title}
      </h2>

      <TerminalCard className="mt-8 p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-muted-foreground text-[0.62rem] tracking-[0.12em] uppercase">
              {copy.timelineTitle}
            </p>
            <p className="font-display text-foreground mt-2 text-lg font-bold tracking-[-0.02em]">
              {assetName}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              {order.quantity} × {formatCurrency(order.asset.price, locale)}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="font-display text-foreground text-2xl font-bold">
              {formatCurrency(order.amount, locale)}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              {t.approval.payeeValue} · {t.approval.accountValue}
            </p>
          </div>
        </div>

        <ol className="border-border mt-6 grid gap-0 border-t pt-5 sm:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.key}
              className="relative flex gap-3 pb-5 last:pb-0 sm:flex-col sm:gap-2 sm:pb-0"
            >
              {index !== steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    'bg-border absolute top-7 left-[11px] h-[calc(100%-1.5rem)] w-px sm:top-[11px] sm:left-6 sm:h-px sm:w-[calc(100%-1.5rem)]',
                    step.done && 'bg-brand/35',
                  )}
                />
              ) : null}
              <span
                className={cn(
                  'relative z-10 grid size-6 shrink-0 place-items-center rounded-full border text-[0.58rem] font-semibold',
                  step.done
                    ? 'border-brand/30 bg-brand/15 text-accent-text'
                    : step.active
                      ? 'border-brand/40 bg-background text-accent-text'
                      : 'border-border bg-background text-muted-foreground/50',
                )}
              >
                {step.done ? (
                  <Check className="size-3" aria-hidden="true" />
                ) : step.active ? (
                  <Loader2 className="size-3 animate-spin" aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </span>
              <div className="pt-0.5">
                <p
                  className={cn(
                    'text-xs font-medium',
                    step.done || step.active ? 'text-foreground/85' : 'text-muted-foreground/50',
                  )}
                >
                  {copy.steps[step.key]}
                </p>
                <p className="text-muted-foreground/60 mt-1 text-[0.6rem]">
                  {step.done ? copy.settledTag : step.active ? copy.pendingTag : ''}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </TerminalCard>

      <TerminalCard
        className={cn(
          'relative mt-4 overflow-hidden p-5 transition-colors sm:p-6',
          settled ? 'border-brand/30 bg-brand/[0.05]' : 'border-border',
        )}
      >
        {!settled ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden"
          >
            <span className="via-brand block h-px w-1/3 animate-[sweep_2.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent to-transparent" />
          </div>
        ) : null}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span
              className={cn(
                'grid size-11 shrink-0 place-items-center rounded-xl border',
                settled
                  ? 'border-brand/25 bg-brand/10 text-accent-text'
                  : 'border-border bg-background/40 text-muted-foreground',
              )}
            >
              {settled ? (
                <PackageCheck className="size-5" aria-hidden="true" />
              ) : (
                <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              )}
            </span>
            <div>
              <p className="font-display text-foreground text-base font-bold">
                {settled
                  ? formatMessage(copy.deliveryTitle, { quantity: order.quantity })
                  : copy.settling}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {formatMessage(copy.deliveryBody, { assetName, wallet: walletLabel })}
              </p>
              {settled ? (
                <p className="text-muted-foreground/70 mt-2 flex items-center gap-1.5 text-[0.62rem]">
                  <ShieldCheck className="text-accent-text size-3" aria-hidden="true" />
                  {demoConfig.txId}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!settled ? <StatusDot pulse /> : null}
            <ActionButton
              size="lg"
              onClick={onConfirm}
              disabled={!settled}
              className="w-full sm:w-auto"
            >
              {settled ? copy.confirm : copy.settling}
            </ActionButton>
          </div>
        </div>
      </TerminalCard>
    </div>
  );
}
