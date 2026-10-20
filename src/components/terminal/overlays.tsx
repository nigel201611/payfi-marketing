'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle, Loader2, RotateCcw, ShieldAlert, X, XCircle } from 'lucide-react';
import { ActionButton, Eyebrow, StatusDot, TerminalCard } from '@/components/terminal/ui';
import { formatCurrency, demoConfig, type Order } from '@/constants/terminal';
import { useI18n } from '@/i18n/locale-provider';

export function ApprovalOverlay({
  order,
  limit,
  onApprove,
  onReject,
}: {
  order: Order;
  limit: number;
  onApprove: () => void;
  onReject: () => void;
}) {
  const { t, locale } = useI18n();
  const copy = t.approval;
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const approve = dialog?.querySelector<HTMLButtonElement>('[data-primary-action]');
    approve?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !dialog) return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="bg-background/80 absolute inset-0 z-40 flex items-center justify-center p-4 backdrop-blur-md sm:p-8">
      <div ref={dialogRef} className="max-h-full w-full max-w-[560px] overflow-y-auto">
        <TerminalCard className="bg-card border-amber-400/25 p-6 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.85)] sm:p-8">
          <div role="dialog" aria-modal="true" aria-labelledby="approval-title">
            <div className="flex items-center justify-between">
              <Eyebrow className="text-amber-500 dark:text-amber-300">{copy.eyebrow}</Eyebrow>
              <span className="flex items-center gap-1.5 rounded-full bg-amber-400/10 px-2.5 py-1 text-[0.6rem] font-semibold text-amber-600 dark:text-amber-300">
                <AlertTriangle className="size-3" aria-hidden="true" />
                {copy.limit}
              </span>
            </div>

            <h2
              id="approval-title"
              className="font-display text-foreground mt-4 text-[1.8rem] leading-tight font-extrabold tracking-[-0.04em] sm:text-[2.2rem]"
            >
              {copy.title}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{copy.description}</p>

            <div className="border-border bg-background/40 mt-6 rounded-2xl border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-muted-foreground text-[0.62rem] tracking-[0.1em] uppercase">
                    {copy.asset}
                  </p>
                  <p className="text-foreground mt-1 text-sm font-medium">
                    {t.assets[order.asset.id].name}
                  </p>
                </div>
                <p className="font-display text-foreground text-2xl font-bold">
                  {formatCurrency(order.amount, locale)}
                </p>
              </div>
              <dl className="border-border mt-4 grid grid-cols-2 gap-3 border-t pt-4">
                <div>
                  <dt className="text-muted-foreground text-[0.6rem] uppercase">{copy.quantity}</dt>
                  <dd className="text-foreground/80 mt-1 text-xs">{order.quantity}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-[0.6rem] uppercase">{copy.payee}</dt>
                  <dd className="text-foreground/80 mt-1 text-xs">{copy.payeeValue}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-[0.6rem] uppercase">{copy.account}</dt>
                  <dd className="text-foreground/80 mt-1 font-mono text-xs">{copy.accountValue}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-[0.6rem] uppercase">{copy.limit}</dt>
                  <dd className="text-foreground/80 mt-1 font-mono text-xs">
                    {formatCurrency(limit, locale)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <ActionButton variant="outline" size="lg" onClick={onReject} className="flex-1">
                <X className="size-4" aria-hidden="true" />
                {copy.reject}
              </ActionButton>
              <ActionButton
                size="lg"
                onClick={onApprove}
                className="flex-[1.5]"
                data-primary-action
                autoFocus
              >
                <ShieldAlert className="size-4" aria-hidden="true" />
                {copy.approve}
              </ActionButton>
            </div>

            <p className="text-muted-foreground/70 mt-4 flex items-center gap-2 text-[0.65rem]">
              <StatusDot pulse />
              {copy.blocked}
            </p>
          </div>
        </TerminalCard>
      </div>
    </div>
  );
}

export function PaymentOverlay({ order }: { order: Order }) {
  const { t, locale } = useI18n();
  const copy = t.payment;
  const isAuto = order.scenario === 'small';

  return (
    <div className="bg-background/80 absolute inset-0 z-40 flex items-center justify-center p-4 backdrop-blur-md sm:p-8">
      <div className="max-h-full w-full max-w-[520px] overflow-y-auto">
        <TerminalCard className="border-brand/20 bg-card p-6 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.85)] sm:p-8">
          <div role="dialog" aria-modal="true" aria-labelledby="payment-title">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <div className="mt-4 flex items-center gap-3">
              <span className="border-brand/25 bg-brand/10 text-accent-text grid size-10 place-items-center rounded-full border">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              </span>
              <h2
                id="payment-title"
                className="font-display text-foreground text-2xl leading-tight font-extrabold tracking-[-0.04em]"
              >
                {isAuto ? copy.autoTitle : copy.title}
              </h2>
            </div>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              {isAuto ? copy.smallNote : copy.largeNote}
            </p>

            <div className="border-border bg-background/40 mt-6 rounded-2xl border p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-foreground text-sm font-medium">
                    {t.assets[order.asset.id].name}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {order.quantity} × {formatCurrency(order.asset.price, locale)}
                  </p>
                </div>
                <p className="font-display text-foreground text-2xl font-bold">
                  {formatCurrency(order.amount, locale)}
                </p>
              </div>
              <div className="border-border mt-4 border-t pt-4">
                <div className="bg-foreground/[0.05] h-1 overflow-hidden rounded-full">
                  <span className="via-brand block h-full w-1/2 animate-[sweep_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent to-transparent" />
                </div>
              </div>
            </div>

            <ActionButton size="lg" className="mt-6 w-full" disabled>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              {copy.waiting}
            </ActionButton>

            <p className="text-muted-foreground/70 mt-4 flex items-center gap-2 text-[0.65rem]">
              <StatusDot pulse />
              {t.approval.payeeValue} · {t.approval.accountValue} · {demoConfig.txId}
            </p>
          </div>
        </TerminalCard>
      </div>
    </div>
  );
}

export function RejectedOverlay({ onReset }: { onReset: () => void }) {
  const { t } = useI18n();
  const copy = t.approval;

  return (
    <div className="bg-background/80 absolute inset-0 z-40 flex items-center justify-center p-4 backdrop-blur-md sm:p-8">
      <div className="w-full max-w-[480px]">
        <TerminalCard className="bg-card border-red-400/20 p-6 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.85)] sm:p-8">
          <div role="dialog" aria-modal="true" aria-labelledby="rejected-title">
            <span className="grid size-11 place-items-center rounded-xl border border-red-400/20 bg-red-400/[0.06] text-red-500 dark:text-red-300">
              <XCircle className="size-5" aria-hidden="true" />
            </span>
            <h2
              id="rejected-title"
              className="font-display text-foreground mt-5 text-2xl font-extrabold tracking-[-0.04em]"
            >
              {copy.rejectedTitle}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {copy.rejectedBody}
            </p>
            <button
              type="button"
              onClick={onReset}
              autoFocus
              className="border-border bg-card/60 text-foreground/80 hover:bg-card hover:text-foreground mt-6 inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              {copy.reset}
            </button>
          </div>
        </TerminalCard>
      </div>
    </div>
  );
}
