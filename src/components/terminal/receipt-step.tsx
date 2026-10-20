'use client';

import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ActionButton, Eyebrow, TerminalCard } from '@/components/terminal/ui';
import { Confetti } from '@/components/terminal/confetti';
import { formatCurrency } from '@/constants/terminal';
import type { ReceiptData } from '@/components/terminal/types';
import { useI18n } from '@/i18n/locale-provider';

export function ReceiptStep({ receipt, onReset }: { receipt: ReceiptData; onReset: () => void }) {
  const { t, locale } = useI18n();
  const copy = t.settlement;
  const assetName = t.assets[receipt.order.asset.id].name;
  const wallet = t.intent.wallets.find((item) => item.value === receipt.wallet);
  const walletLabel = wallet ? `${wallet.address} · ${wallet.name}` : receipt.wallet;
  const completedAt = new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(receipt.completedAt);

  const fields = [
    { label: copy.orderRef, value: receipt.orderRef, mono: true },
    { label: copy.asset, value: assetName },
    { label: copy.quantity, value: String(receipt.order.quantity) },
    { label: copy.amount, value: formatCurrency(receipt.order.amount, locale), mono: true },
    { label: copy.payee, value: t.approval.payeeValue },
    { label: copy.wallet, value: walletLabel },
    { label: copy.txId, value: receipt.txId, mono: true },
    { label: copy.receiptHash, value: receipt.receiptHash, mono: true },
    { label: copy.completedAt, value: completedAt },
  ];

  return (
    <div className="py-8 lg:py-12">
      <div className="relative">
        <Confetti />
        <div className="relative">
          <Eyebrow>{copy.celebration}</Eyebrow>
          <div className="mt-5 flex items-start gap-4">
            <span className="border-brand/25 bg-brand/10 text-accent-text grid size-12 shrink-0 place-items-center rounded-2xl border">
              <CheckCircle2 className="size-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-foreground text-[clamp(2rem,3.4vw,3rem)] leading-[1.02] font-extrabold tracking-[-0.045em]">
                {copy.receiptTitle}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">{copy.receiptSubtitle}</p>
            </div>
          </div>

          <TerminalCard className="mt-8 p-5 sm:p-6">
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.label}>
                  <dt className="text-muted-foreground text-[0.62rem] tracking-[0.1em] uppercase">
                    {field.label}
                  </dt>
                  <dd
                    className={
                      field.mono
                        ? 'text-foreground/85 mt-1 font-mono text-xs'
                        : 'text-foreground/85 mt-1 text-sm'
                    }
                  >
                    {field.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="border-border mt-6 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-muted-foreground flex items-center gap-1.5 text-[0.65rem]">
                <span className="bg-brand size-1.5 rounded-full" aria-hidden="true" />
                {copy.completed}
              </p>
              <ActionButton size="lg" onClick={onReset} className="group">
                {copy.newDemo}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </ActionButton>
            </div>
          </TerminalCard>
        </div>
      </div>
    </div>
  );
}
