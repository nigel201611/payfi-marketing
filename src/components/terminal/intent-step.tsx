'use client';

import { useState } from 'react';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import {
  ActionButton,
  Eyebrow,
  FieldLabel,
  TerminalCard,
  TextField,
} from '@/components/terminal/ui';
import type { IntentPatch } from '@/components/terminal/types';
import type { IntentValues, Scenario } from '@/constants/terminal';
import { useI18n } from '@/i18n/locale-provider';
import { cn } from '@/lib/utils';

type IntentStepProps = {
  intent: IntentValues;
  phase: 'form' | 'funding';
  error: string | null;
  onChange: (patch: IntentPatch) => void;
  onConfirm: () => void;
  onSimulate: (scenario: Scenario) => void;
  onAbandon: () => void;
};

const categoryKeys = ['energy', 'moneyMarket', 'bonds'] as const;

export function IntentStep({
  intent,
  phase,
  error,
  onChange,
  onConfirm,
  onSimulate,
  onAbandon,
}: IntentStepProps) {
  const { t } = useI18n();
  const copy = t.intent;

  return (
    <div className="py-8 lg:py-12">
      <Eyebrow>{copy.eyebrow}</Eyebrow>
      <h2 className="font-display text-foreground mt-4 text-[clamp(2rem,3.4vw,3rem)] leading-[1.02] font-extrabold tracking-[-0.045em]">
        {copy.title}
      </h2>

      {phase === 'form' ? (
        <TerminalCard className="mt-8 p-5 sm:p-7">
          <div className="space-y-7">
            <fieldset>
              <legend className="text-foreground/60 text-[0.72rem] font-medium">
                {copy.categoriesLabel}
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {categoryKeys.map((key) => {
                  const selected = intent.categories[key];
                  return (
                    <label
                      key={key}
                      className={cn(
                        'flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm transition-all',
                        selected
                          ? 'border-brand/40 bg-brand/10 text-foreground'
                          : 'border-border bg-background/40 text-muted-foreground hover:border-border hover:text-foreground',
                      )}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={selected}
                        onChange={(event) =>
                          onChange({
                            categories: { ...intent.categories, [key]: event.target.checked },
                          })
                        }
                      />
                      <span
                        className={cn(
                          'grid size-4 place-items-center rounded-[3px] border transition-colors',
                          selected
                            ? 'border-brand bg-brand text-ink'
                            : 'border-muted-foreground/40 bg-transparent',
                        )}
                        aria-hidden="true"
                      >
                        {selected ? <Check className="size-3" /> : null}
                      </span>
                      {copy.categories[key]}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
              <div className="flex items-center gap-2">
                <FieldLabel htmlFor="min-apy" className="mt-1.5">
                  {copy.minApyLabel}
                </FieldLabel>
                <div className="relative">
                  <input
                    id="min-apy"
                    type="text"
                    inputMode="decimal"
                    value={intent.minApy}
                    onChange={(event) => onChange({ minApy: event.target.value })}
                    className="border-border bg-background/60 text-foreground focus:border-brand/60 focus:ring-brand/20 h-9 w-[72px] rounded-lg border pr-6 pl-2.5 font-mono text-sm transition-colors outline-none focus:ring-2"
                  />
                  <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-xs">
                    %
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <fieldset>
                  <legend className="text-foreground/60 text-[0.72rem] font-medium">
                    {copy.settlementLabel}
                  </legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {copy.settlementOptions.map((label, index) => {
                      const value = (['T+0', 'T+1', 'T+2'] as const)[index];
                      return (
                        <label
                          key={value}
                          className={cn(
                            'cursor-pointer rounded-full border px-3 py-1.5 text-[0.7rem] transition-colors',
                            intent.settlement === value
                              ? 'border-brand/40 bg-brand/10 text-accent-text'
                              : 'border-border text-muted-foreground hover:text-foreground',
                          )}
                        >
                          <input
                            type="radio"
                            name="settlement"
                            value={value}
                            className="sr-only"
                            checked={intent.settlement === value}
                            onChange={() => onChange({ settlement: value })}
                          />
                          {label}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="text-foreground/60 text-[0.72rem] font-medium">
                    {copy.riskLabel}
                  </legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {copy.riskOptions.map((label, index) => {
                      const value = (['low', 'medium', 'high'] as const)[index];
                      return (
                        <label
                          key={value}
                          className={cn(
                            'cursor-pointer rounded-full border px-3 py-1.5 text-[0.7rem] transition-colors',
                            intent.risk === value
                              ? 'border-brand/40 bg-brand/10 text-accent-text'
                              : 'border-border text-muted-foreground hover:text-foreground',
                          )}
                        >
                          <input
                            type="radio"
                            name="risk"
                            value={value}
                            className="sr-only"
                            checked={intent.risk === value}
                            onChange={() => onChange({ risk: value })}
                          />
                          {label}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </div>
            </div>

            <div>
              <p className="text-foreground/60 text-[0.72rem] font-medium">{copy.limitsTitle}</p>
              <div className="mt-2 grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="single-limit">{copy.singleLimitLabel}</FieldLabel>
                  <TextField
                    id="single-limit"
                    type="text"
                    inputMode="numeric"
                    value={intent.singleLimit}
                    onChange={(event) => onChange({ singleLimit: event.target.value })}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="max-budget">{copy.maxBudgetLabel}</FieldLabel>
                  <TextField
                    id="max-budget"
                    type="text"
                    inputMode="numeric"
                    value={intent.maxBudget}
                    onChange={(event) => onChange({ maxBudget: event.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="custody-wallet">{copy.custodyLabel}</FieldLabel>
              <div className="relative mt-1.5">
                <select
                  id="custody-wallet"
                  value={intent.wallet}
                  onChange={(event) => onChange({ wallet: event.target.value as 'a' | 'b' })}
                  className="border-border bg-background/60 text-foreground focus:border-brand/60 focus:ring-brand/20 h-11 w-full appearance-none rounded-xl border px-3.5 pr-9 text-sm transition-colors outline-none focus:ring-2"
                >
                  {copy.wallets.map((wallet) => (
                    <option key={wallet.value} value={wallet.value}>
                      {wallet.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
                  aria-hidden="true"
                />
              </div>
            </div>

            {error ? (
              <p
                role="alert"
                className="rounded-xl border border-red-400/25 bg-red-400/[0.06] px-3.5 py-2.5 text-xs text-red-500 dark:text-red-300"
              >
                {error}
              </p>
            ) : null}

            <div className="flex justify-end">
              <ActionButton size="lg" onClick={onConfirm}>
                {copy.confirm}
              </ActionButton>
            </div>
          </div>
        </TerminalCard>
      ) : (
        <FundingPanel onSimulate={onSimulate} onAbandon={onAbandon} />
      )}
    </div>
  );
}

function FundingPanel({
  onSimulate,
  onAbandon,
}: {
  onSimulate: (scenario: Scenario) => void;
  onAbandon: () => void;
}) {
  const { t } = useI18n();
  const copy = t.intent.funding;
  const [busy, setBusy] = useState<Scenario | null>(null);

  function simulate(scenario: Scenario) {
    if (busy) return;
    setBusy(scenario);
    onSimulate(scenario);
  }

  return (
    <TerminalCard className="relative mt-8 overflow-hidden p-5 sm:p-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(0,221,149,0.12),transparent_70%)]"
      />
      <div className="relative">
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <h3 className="font-display text-foreground mt-3 text-xl font-bold tracking-[-0.03em] sm:text-2xl">
          {copy.title}
        </h3>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            { label: copy.routing, value: '021000089' },
            { label: copy.account, value: '7788123456' },
          ].map((field) => (
            <div
              key={field.label}
              className="border-border bg-background/50 rounded-xl border px-4 py-3.5"
            >
              <p className="text-muted-foreground text-[0.62rem] tracking-[0.12em] uppercase">
                {field.label}
              </p>
              <p className="text-foreground mt-1.5 font-mono text-lg tracking-wide">
                {field.value}
              </p>
            </div>
          ))}
        </div>

        <p className="text-muted-foreground mt-4 flex items-center gap-2 text-xs">
          <span className="bg-brand size-1.5 animate-pulse rounded-full" aria-hidden="true" />
          {copy.waiting}
        </p>

        <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
          <ActionButton
            size="lg"
            onClick={() => simulate('large')}
            disabled={busy !== null}
            className="w-full"
          >
            {busy === 'large' ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            {copy.simulateLarge}
          </ActionButton>
          <ActionButton
            size="lg"
            variant="outline"
            onClick={() => simulate('small')}
            disabled={busy !== null}
            className="w-full"
          >
            {busy === 'small' ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            {copy.simulateSmall}
          </ActionButton>
        </div>

        <button
          type="button"
          onClick={onAbandon}
          disabled={busy !== null}
          className="text-muted-foreground hover:text-foreground mt-4 text-xs underline-offset-4 transition-colors hover:underline disabled:opacity-50"
        >
          {copy.abandon}
        </button>

        <p className="border-border bg-background/40 text-muted-foreground mt-6 rounded-xl border px-4 py-3 text-[0.7rem] leading-relaxed">
          {copy.note}
        </p>
      </div>
    </TerminalCard>
  );
}
