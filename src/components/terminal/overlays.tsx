'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { AlertTriangle, Loader2, ShieldAlert, X } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';
import { ActionButton, Eyebrow, StatusDot, TerminalCard } from '@/components/terminal/ui';
import { cn } from '@/lib/utils';
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
  const reduce = useReducedMotion();
  const { theme } = useTheme();

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
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? undefined : { opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'fixed inset-0 z-[60] flex overflow-y-auto overscroll-contain bg-black/40 p-3 sm:p-8 lg:absolute lg:z-40',
        theme === 'dark' && 'backdrop-blur-md',
      )}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        ref={dialogRef}
        className="m-auto w-full max-w-[600px]"
      >
        <TerminalCard
          className={cn(
            'bg-card rounded-[20px] p-5 shadow-none sm:p-8',
            theme === 'dark' ? 'border border-white/10' : 'border-0',
          )}
        >
          <div role="dialog" aria-modal="true" aria-labelledby="approval-title">
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Eyebrow className="text-amber-500 dark:text-amber-300">{copy.eyebrow}</Eyebrow>
              <span className="flex items-center gap-1.5 rounded-full bg-amber-400/10 px-2.5 py-1 text-[0.6rem] font-semibold text-amber-600 dark:text-amber-300">
                <AlertTriangle className="size-3" aria-hidden="true" />
                {copy.limit}
              </span>
            </div>

            <h2
              id="approval-title"
              className="font-display text-foreground mt-4 text-[clamp(1.15rem,5.4vw,1.75rem)] leading-tight font-extrabold tracking-[-0.04em] min-[360px]:whitespace-nowrap sm:text-[2rem]"
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

            <div className="mt-6 flex gap-2">
              <ActionButton
                variant="outline"
                size="lg"
                onClick={onReject}
                className="flex-1 px-4 sm:px-7"
              >
                <X className="size-4" aria-hidden="true" />
                {copy.reject}
              </ActionButton>
              <ActionButton
                size="lg"
                onClick={onApprove}
                className="flex-[1.5] px-4 sm:px-7"
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
      </motion.div>
    </motion.div>
  );
}

export function PaymentOverlay({ order }: { order: Order }) {
  const { t, locale } = useI18n();
  const copy = t.payment;
  const isAuto = order.scenario === 'small';
  const reduce = useReducedMotion();
  const { theme } = useTheme();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? undefined : { opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'fixed inset-0 z-[60] flex overflow-y-auto overscroll-contain bg-black/40 p-3 sm:p-8 lg:absolute lg:z-40',
        theme === 'dark' && 'backdrop-blur-md',
      )}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="m-auto w-full max-w-[520px]"
      >
        <TerminalCard className="border-brand/20 bg-card p-5 sm:p-8">
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
      </motion.div>
    </motion.div>
  );
}
