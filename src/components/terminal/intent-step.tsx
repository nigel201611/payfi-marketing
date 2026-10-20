'use client';

import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import {
  ActionButton,
  Eyebrow,
  FieldLabel,
  StatusDot,
  TerminalCard,
  TextField,
} from '@/components/terminal/ui';
import type { IntentPatch } from '@/components/terminal/types';
import { demoConfig, type IntentValues, type Scenario } from '@/constants/terminal';
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

function SectionHeader({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground/70 font-mono text-[0.62rem] tracking-[0.16em]">
        {index}
      </span>
      <h3 className="text-foreground text-[0.74rem] font-semibold tracking-[0.08em] uppercase">
        {title}
      </h3>
      <span className="bg-border h-px flex-1" aria-hidden="true" />
    </div>
  );
}

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
        <TerminalCard className="mt-8 overflow-hidden">
          <div className="grid lg:grid-cols-[minmax(0,1.14fr)_minmax(0,0.86fr)]">
            <div className="space-y-8 p-5 sm:p-7 lg:p-8">
              <fieldset>
                <legend className="sr-only">{copy.categoriesLabel}</legend>
                <SectionHeader index="01" title={copy.categoriesTitle} />
                <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                  {categoryKeys.map((key) => {
                    const selected = intent.categories[key];
                    return (
                      <label
                        key={key}
                        className={cn(
                          'group flex min-h-[5.75rem] cursor-pointer flex-col justify-between gap-3 rounded-2xl border p-4 transition-all duration-200',
                          selected
                            ? 'border-brand/40 bg-brand/[0.07]'
                            : 'border-border bg-background/40 hover:border-foreground/20 hover:bg-background/60',
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
                        <span className="flex items-center justify-between">
                          <span
                            className={cn(
                              'grid size-7 place-items-center rounded-lg border transition-colors',
                              selected
                                ? 'border-brand bg-brand text-ink'
                                : 'border-border bg-background text-muted-foreground',
                            )}
                            aria-hidden="true"
                          >
                            {selected ? (
                              <Check className="size-3.5" />
                            ) : (
                              <span className="size-1 rounded-full bg-current opacity-50" />
                            )}
                          </span>
                          <span
                            className={cn(
                              'size-1.5 rounded-full transition-colors',
                              selected
                                ? 'bg-brand shadow-[0_0_10px_rgba(0,221,149,0.7)]'
                                : 'bg-border',
                            )}
                            aria-hidden="true"
                          />
                        </span>
                        <span className="text-foreground text-sm leading-snug font-medium">
                          {copy.categories[key]}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset>
                <legend className="sr-only">{copy.preferencesLabel}</legend>
                <SectionHeader index="02" title={copy.preferencesLabel} />
                <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                  <div>
                    <FieldLabel htmlFor="min-apy">{copy.minApyLabel}</FieldLabel>
                    <div className="relative">
                      <input
                        id="min-apy"
                        type="text"
                        inputMode="decimal"
                        value={intent.minApy}
                        onChange={(event) => onChange({ minApy: event.target.value })}
                        className="border-border bg-background/60 text-foreground focus:border-brand/60 focus:ring-brand/20 mt-1.5 h-11 w-full rounded-xl border pr-8 pl-3.5 font-mono text-sm transition-colors outline-none focus:ring-2"
                      />
                      <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs">
                        %
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-foreground/60 block text-[0.72rem] font-medium tracking-wide">
                      {copy.settlementLabel}
                    </span>
                    <div className="border-border bg-background/50 mt-1.5 grid grid-cols-3 gap-1 rounded-xl border p-1">
                      {copy.settlementOptions.map((label, index) => {
                        const value = (['T+0', 'T+1', 'T+2'] as const)[index];
                        const active = intent.settlement === value;
                        return (
                          <label
                            key={value}
                            className={cn(
                              'flex h-9 cursor-pointer items-center justify-center rounded-lg text-[0.72rem] font-medium transition-colors',
                              active
                                ? 'bg-brand/15 text-accent-text'
                                : 'text-muted-foreground hover:text-foreground',
                            )}
                          >
                            <input
                              type="radio"
                              name="settlement"
                              value={value}
                              className="sr-only"
                              checked={active}
                              onChange={() => onChange({ settlement: value })}
                            />
                            {label}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-foreground/60 block text-[0.72rem] font-medium tracking-wide">
                    {copy.riskLabel}
                  </span>
                  <div className="border-border bg-background/50 mt-1.5 grid grid-cols-3 gap-1 rounded-xl border p-1">
                    {copy.riskOptions.map((label, index) => {
                      const value = (['low', 'medium', 'high'] as const)[index];
                      const active = intent.risk === value;
                      return (
                        <label
                          key={value}
                          className={cn(
                            'flex h-9 cursor-pointer items-center justify-center rounded-lg px-2 text-center text-[0.7rem] font-medium transition-colors',
                            active
                              ? 'bg-brand/15 text-accent-text'
                              : 'text-muted-foreground hover:text-foreground',
                          )}
                        >
                          <input
                            type="radio"
                            name="risk"
                            value={value}
                            className="sr-only"
                            checked={active}
                            onChange={() => onChange({ risk: value })}
                          />
                          {label}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </fieldset>

              <div className="border-brand/20 bg-brand/[0.06] rounded-xl border px-4 py-3.5">
                <p className="text-accent-text flex items-center gap-2 text-[0.66rem] font-semibold tracking-[0.12em] uppercase">
                  <StatusDot />
                  {copy.policyLabel}
                </p>
                <p className="text-muted-foreground mt-2 text-[0.72rem] leading-relaxed">
                  {copy.policyNote}
                </p>
              </div>
            </div>

            <aside className="border-border bg-background/30 border-t p-5 sm:p-7 lg:border-t-0 lg:border-l lg:p-8">
              <section>
                <SectionHeader index="03" title={copy.limitsTitle} />
                <div className="mt-4 space-y-4">
                  <div>
                    <FieldLabel htmlFor="single-limit">{copy.singleLimitLabel}</FieldLabel>
                    <div className="relative">
                      <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 z-10 -translate-y-1/2 font-mono text-sm">
                        $
                      </span>
                      <TextField
                        id="single-limit"
                        type="text"
                        inputMode="numeric"
                        value={intent.singleLimit}
                        onChange={(event) => onChange({ singleLimit: event.target.value })}
                        className="pl-7 font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <FieldLabel htmlFor="max-budget">{copy.maxBudgetLabel}</FieldLabel>
                    <div className="relative">
                      <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 z-10 -translate-y-1/2 font-mono text-sm">
                        $
                      </span>
                      <TextField
                        id="max-budget"
                        type="text"
                        inputMode="numeric"
                        value={intent.maxBudget}
                        onChange={(event) => onChange({ maxBudget: event.target.value })}
                        className="pl-7 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <fieldset className="mt-6">
                <legend className="text-foreground/60 block text-[0.72rem] font-medium tracking-wide">
                  {copy.custodyLabel}
                </legend>
                <div className="mt-1.5 grid gap-2">
                  {copy.wallets.map((wallet) => {
                    const active = intent.wallet === wallet.value;
                    return (
                      <label
                        key={wallet.value}
                        className={cn(
                          'flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors',
                          active
                            ? 'border-brand/40 bg-brand/10'
                            : 'border-border bg-background/50 hover:border-foreground/20',
                        )}
                      >
                        <input
                          type="radio"
                          name="custody-wallet"
                          value={wallet.value}
                          className="sr-only"
                          checked={active}
                          onChange={() => onChange({ wallet: wallet.value as 'a' | 'b' })}
                        />
                        <span
                          className={cn(
                            'grid size-4 shrink-0 place-items-center rounded-full border transition-colors',
                            active ? 'border-brand bg-brand' : 'border-muted-foreground/40',
                          )}
                          aria-hidden="true"
                        >
                          {active ? <span className="bg-ink size-1.5 rounded-full" /> : null}
                        </span>
                        <span className="min-w-0">
                          <span className="text-foreground block font-mono text-xs tracking-wide">
                            {wallet.address}
                          </span>
                          <span className="text-muted-foreground mt-0.5 block truncate text-[0.66rem]">
                            {wallet.name}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {error ? (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-red-400/25 bg-red-400/[0.06] px-3.5 py-2.5 text-xs text-red-500 dark:text-red-300"
                >
                  {error}
                </p>
              ) : null}

              <ActionButton size="lg" onClick={onConfirm} className="mt-5 w-full">
                {copy.confirm}
              </ActionButton>
            </aside>
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
    <TerminalCard className="relative mt-8 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(0,221,149,0.1),transparent_70%)]"
      />
      <div className="relative grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="p-5 sm:p-7 lg:p-8">
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <h3 className="font-display text-foreground mt-3 text-xl font-bold tracking-[-0.03em] sm:text-2xl">
            {copy.title}
          </h3>
          <p className="text-muted-foreground mt-2.5 max-w-md text-sm leading-relaxed">
            {copy.description}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { label: copy.routing, value: demoConfig.routingNumber },
              { label: copy.account, value: demoConfig.accountNumber },
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

          <div className="border-border bg-background/40 mt-4 flex items-center gap-2.5 rounded-xl border px-4 py-3">
            <span className="bg-brand size-1.5 animate-pulse rounded-full" aria-hidden="true" />
            <p className="text-muted-foreground text-xs">{copy.waiting}</p>
          </div>
        </div>

        <aside className="border-border bg-background/30 border-t p-5 sm:p-7 lg:border-t-0 lg:border-l lg:p-8">
          <p className="text-foreground text-[0.72rem] font-semibold tracking-[0.08em] uppercase">
            {copy.scenarioLabel}
          </p>
          <div className="mt-3 grid gap-2.5">
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

          <p className="border-border bg-background/40 text-muted-foreground mt-5 rounded-xl border px-4 py-3 text-[0.7rem] leading-relaxed">
            {copy.note}
          </p>
        </aside>
      </div>
    </TerminalCard>
  );
}
