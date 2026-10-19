'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Fingerprint,
  KeyRound,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  X,
  XCircle,
} from 'lucide-react';
import { useI18n } from '@/i18n/locale-provider';
import { approvalDemoData } from '@/constants/demo';
import { formatMessage } from '@/i18n/messages';
import { cn } from '@/lib/utils';

type Decision = 'pending' | 'approved' | 'declined';

export function ApprovalDemo() {
  const { t } = useI18n();
  const copy = t.control.approval;
  const [decision, setDecision] = useState<Decision>('pending');

  const request = approvalDemoData;
  const outcomeMessage =
    decision === 'approved'
      ? formatMessage(copy.srApproved, { agent: request.agent })
      : decision === 'declined'
        ? formatMessage(copy.srDeclined, { agent: request.agent })
        : copy.srPending;

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[40px] bg-[radial-gradient(60%_50%_at_60%_10%,rgba(0,221,149,0.16),transparent_70%)] blur-2xl"
      />

      <div className="relative overflow-hidden rounded-[28px] border border-white/[0.1] bg-[linear-gradient(165deg,rgba(19,24,21,0.96),rgba(8,11,9,0.99))] text-white shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="bg-brand/12 text-brand grid size-7 place-items-center rounded-full">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[0.7rem] font-semibold tracking-[0.13em] text-white/50 uppercase">
                {copy.policyEngine}
              </p>
              <p className="text-[0.62rem] text-white/30">{copy.screened}</p>
            </div>
          </div>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.62rem] font-semibold',
              decision === 'pending' && 'bg-amber-400/10 text-amber-300',
              decision === 'approved' && 'bg-brand/12 text-brand',
              decision === 'declined' && 'bg-red-400/10 text-red-300',
            )}
          >
            <span
              className={cn(
                'size-1.5 rounded-full',
                decision === 'pending' && 'bg-amber-300',
                decision === 'approved' && 'bg-brand',
                decision === 'declined' && 'bg-red-400',
              )}
            />
            {decision === 'pending'
              ? copy.awaitingYou
              : decision === 'approved'
                ? copy.approved
                : copy.declined}
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="from-brand-soft via-brand to-brand text-ink grid size-11 place-items-center rounded-full bg-gradient-to-br text-sm font-bold">
              H
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">
                {request.agent}{' '}
                <span className="font-normal text-white/55">{copy.wantsToSpend}</span>
              </p>
              <p className="mt-0.5 text-xs text-white/45">{copy.role}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[0.6rem] font-medium text-white/55">
              <Sparkles className="text-brand/70 size-3" aria-hidden="true" />
              {copy.agent}
            </span>
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-[2.35rem] leading-none font-bold tracking-tight text-white">
                {request.amount}
              </p>
              <p className="mt-2 text-xs text-white/45">{copy.item}</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2">
              <span className="text-ink grid size-7 place-items-center rounded-md bg-white text-[0.7rem] font-extrabold">
                T
              </span>
              <div>
                <p className="text-[0.7rem] leading-tight font-semibold text-white/85">
                  {request.merchant}
                </p>
                <p className="text-[0.58rem] text-white/35">{request.merchantDomain}</p>
              </div>
              <CheckCircle2 className="text-brand size-3.5" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/[0.07] bg-black/15 p-4">
            <p className="text-[0.62rem] font-semibold tracking-[0.14em] text-white/35 uppercase">
              {copy.policyChecks}
            </p>
            <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {copy.checks.map((check) => (
                <li key={check.label} className="flex items-start gap-2">
                  <span className="bg-brand/12 text-brand mt-0.5 grid size-4 shrink-0 place-items-center rounded-full">
                    <Check className="size-2.5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[0.7rem] leading-tight font-medium text-white/75">
                      {check.label}
                    </span>
                    <span className="mt-0.5 block text-[0.6rem] text-white/30">{check.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {decision === 'pending' ? (
              <motion.div
                key="actions"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="mt-5 flex flex-col gap-2 sm:flex-row"
              >
                <button
                  type="button"
                  onClick={() => setDecision('declined')}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.03] text-sm font-semibold text-white/70 transition-colors hover:border-white/25 hover:text-white"
                >
                  <X className="size-4" aria-hidden="true" />
                  {copy.decline}
                </button>
                <button
                  type="button"
                  onClick={() => setDecision('approved')}
                  className="bg-brand text-ink hover:bg-brand-soft inline-flex h-12 flex-[1.4] items-center justify-center gap-2 rounded-full text-sm font-semibold shadow-[0_16px_40px_-14px_rgba(0,221,149,0.55)] transition-colors"
                >
                  <Fingerprint className="size-4" aria-hidden="true" />
                  {copy.approve}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="outcome"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5"
              >
                <div
                  className={cn(
                    'rounded-2xl border p-4',
                    decision === 'approved'
                      ? 'border-brand/25 bg-brand/[0.07]'
                      : 'border-red-400/20 bg-red-400/[0.05]',
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        'grid size-8 shrink-0 place-items-center rounded-full',
                        decision === 'approved'
                          ? 'bg-brand/15 text-brand'
                          : 'bg-red-400/10 text-red-300',
                      )}
                    >
                      {decision === 'approved' ? (
                        <CheckCircle2 className="size-4" aria-hidden="true" />
                      ) : (
                        <XCircle className="size-4" aria-hidden="true" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        {decision === 'approved' ? copy.approvedByYou : copy.requestDeclined}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-white/55">
                        {decision === 'approved'
                          ? formatMessage(copy.credentialIssued, { agent: request.agent })
                          : formatMessage(copy.declinedNotice, { agent: request.agent })}
                      </p>
                      {decision === 'approved' ? (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/20 px-2.5 py-1.5 font-mono text-[0.62rem] text-white/60">
                            <KeyRound className="text-brand size-3" aria-hidden="true" />
                            {request.credential}
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/20 px-2.5 py-1.5 font-mono text-[0.62rem] text-white/60">
                            15:00
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="flex items-center gap-1.5 text-[0.62rem] text-white/30">
                    <ArrowRight className="size-3" aria-hidden="true" />
                    {copy.audit}
                  </p>
                  <button
                    type="button"
                    onClick={() => setDecision('pending')}
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[0.65rem] font-medium text-white/45 transition-colors hover:bg-white/[0.05] hover:text-white/75"
                  >
                    <RotateCcw className="size-3" aria-hidden="true" />
                    {copy.reset}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p role="status" aria-live="polite" className="sr-only">
            {outcomeMessage}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3 text-[0.58rem] text-white/30">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="text-brand/60 size-3" aria-hidden="true" />
            {copy.passkeys}
          </span>
          <span className="font-mono">request_spend_9f2c</span>
        </div>
      </div>
    </div>
  );
}
