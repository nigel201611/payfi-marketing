'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, Coins, Landmark, Leaf, Loader2 } from 'lucide-react';
import AnimatedContent from '@/components/react-bits/AnimatedContent';
import { ActionButton, FieldLabel, StatusDot, TextField } from '@/components/terminal/ui';
import { VaraPanel } from '@/components/terminal/vara-panel';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
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
  onBack: () => void;
};

const categoryKeys = ['energy', 'moneyMarket', 'bonds'] as const;

const categoryIcons = {
  energy: Leaf,
  moneyMarket: Coins,
  bonds: Landmark,
} as const;

function SectionHeader({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="bg-foreground text-background grid size-5 shrink-0 place-items-center rounded-full text-[0.62rem] font-bold"
        aria-hidden="true"
      >
        {index}
      </span>
      <h3 className="text-foreground text-base font-bold">{title}</h3>
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
  onBack,
}: IntentStepProps) {
  const { t } = useI18n();
  const copy = t.intent;
  const selectedWallet = copy.wallets.find((wallet) => wallet.value === intent.wallet);
  const [walletOpen, setWalletOpen] = useState(false);
  const walletOpenRef = useRef(false);
  const walletWasOpenOnPointerDown = useRef(false);

  useEffect(() => {
    walletOpenRef.current = walletOpen;
  }, [walletOpen]);

  useEffect(() => {
    const handlePointerDown = () => {
      walletWasOpenOnPointerDown.current = walletOpenRef.current;
    };
    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => document.removeEventListener('pointerdown', handlePointerDown, true);
  }, []);

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

      <p className="text-muted-foreground mt-5 text-sm font-medium">{copy.eyebrow}</p>
      <h2 className="font-display text-foreground mt-1.5 text-[1.75rem] leading-9 font-extrabold tracking-[-0.02em] sm:text-[2rem] sm:leading-10">
        {copy.title}
      </h2>

      {phase === 'form' ? (
        <VaraPanel>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.14fr)_minmax(0,0.86fr)]">
            <div className="space-y-8 p-5 sm:p-7 lg:p-8">
              <fieldset>
                <legend className="sr-only">{copy.categoriesLabel}</legend>
                <SectionHeader index="1" title={copy.categoriesTitle} />
                <AnimatedContent
                  trigger="mount"
                  stagger={0.08}
                  distance={14}
                  duration={0.5}
                  blur={4}
                  scale={0.98}
                  className="mt-4 grid gap-2"
                >
                  {categoryKeys.map((key) => {
                    const selected = intent.categories[key];
                    const Icon = categoryIcons[key];

                    return (
                      <label
                        key={key}
                        className={cn(
                          'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors',
                          selected
                            ? 'border-brand/45 bg-brand/[0.06]'
                            : 'border-border bg-background/40 hover:border-foreground/20 hover:bg-foreground/[0.03]',
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
                            'grid size-9 shrink-0 place-items-center rounded-xl border transition-colors',
                            selected
                              ? 'border-brand/25 bg-brand/10 text-accent-text'
                              : 'border-border bg-foreground/[0.03] text-muted-foreground',
                          )}
                          aria-hidden="true"
                        >
                          <Icon className="size-4" />
                        </span>
                        <span className="text-foreground min-w-0 flex-1 truncate text-sm font-semibold">
                          {copy.categories[key]}
                        </span>
                        <span
                          className={cn(
                            'grid size-5 shrink-0 place-items-center rounded-full border transition-colors',
                            selected
                              ? 'border-brand bg-brand text-ink'
                              : 'border-muted-foreground/40',
                          )}
                          aria-hidden="true"
                        >
                          {selected ? <Check className="size-3" /> : null}
                        </span>
                      </label>
                    );
                  })}
                </AnimatedContent>
              </fieldset>

              <fieldset>
                <legend className="sr-only">{copy.preferencesLabel}</legend>
                <SectionHeader index="2" title={copy.preferencesLabel} />
                <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                  <div>
                    <FieldLabel
                      htmlFor="min-apy"
                      className="text-foreground/60 mb-1.5 block text-sm font-semibold"
                    >
                      {copy.minApyLabel}
                    </FieldLabel>
                    <div className="relative">
                      <input
                        id="min-apy"
                        type="text"
                        inputMode="decimal"
                        value={intent.minApy}
                        onChange={(event) => onChange({ minApy: event.target.value })}
                        className="bg-foreground/[0.03] text-foreground focus:ring-brand/30 h-12 w-full rounded-lg pr-8 pl-3.5 font-mono text-sm font-semibold transition-shadow outline-none focus:ring-2"
                      />
                      <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs">
                        %
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-foreground/60 mb-1.5 block text-sm font-semibold">
                      {copy.settlementLabel}
                    </span>
                    <div className="bg-foreground/[0.05] grid h-12 grid-cols-3 gap-1 rounded-full p-1">
                      {copy.settlementOptions.map((label, index) => {
                        const value = (['T+0', 'T+1', 'T+2'] as const)[index];
                        const active = intent.settlement === value;
                        return (
                          <label
                            key={value}
                            className={cn(
                              'flex h-10 cursor-pointer items-center justify-center rounded-full text-sm font-semibold transition-all',
                              active
                                ? 'bg-workspace-card text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.12)]'
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
                  <span className="text-foreground/60 mb-1.5 block text-sm font-semibold">
                    {copy.riskLabel}
                  </span>
                  <div className="bg-foreground/[0.05] grid h-12 grid-cols-3 gap-1 rounded-full p-1">
                    {copy.riskOptions.map((label, index) => {
                      const value = (['low', 'medium', 'high'] as const)[index];
                      const active = intent.risk === value;
                      return (
                        <label
                          key={value}
                          className={cn(
                            'flex h-10 cursor-pointer items-center justify-center rounded-full px-2 text-center text-[0.8rem] font-semibold whitespace-nowrap transition-all sm:text-sm',
                            active
                              ? 'bg-workspace-card text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.12)]'
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
            </div>

            <aside className="border-border bg-foreground/[0.02] border-t p-5 sm:p-7 lg:border-t-0 lg:border-l lg:p-8">
              <section>
                <SectionHeader index="3" title={copy.limitsTitle} />
                <div className="mt-4 space-y-4">
                  <div>
                    <FieldLabel
                      htmlFor="single-limit"
                      className="text-foreground/60 mb-1.5 block text-sm font-semibold"
                    >
                      {copy.singleLimitLabel}
                    </FieldLabel>
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
                        className="bg-foreground/[0.03] focus:ring-brand/30 mt-0 h-12 rounded-lg pl-7 font-mono font-semibold focus:ring-2"
                      />
                    </div>
                  </div>
                  <div>
                    <FieldLabel
                      htmlFor="max-budget"
                      className="text-foreground/60 mb-1.5 block text-sm font-semibold"
                    >
                      {copy.maxBudgetLabel}
                    </FieldLabel>
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
                        className="bg-foreground/[0.03] focus:ring-brand/30 mt-0 h-12 rounded-lg pl-7 font-mono font-semibold focus:ring-2"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="mt-6">
                <FieldLabel
                  htmlFor="custody-wallet"
                  className="text-foreground/60 mb-1.5 block text-sm font-semibold"
                >
                  {copy.custodyLabel}
                </FieldLabel>
                <Select
                  open={walletOpen}
                  onOpenChange={setWalletOpen}
                  value={intent.wallet}
                  onValueChange={(value) => onChange({ wallet: value as 'a' | 'b' })}
                >
                  <SelectTrigger
                    id="custody-wallet"
                    className="bg-foreground/[0.03] focus-visible:ring-brand/30 h-12 rounded-lg border-0 px-3.5 py-1.5 text-left"
                    onClick={(event) => {
                      // Radix reopens on the click that follows its touch dismiss; suppress it.
                      if (!walletWasOpenOnPointerDown.current) return;
                      walletWasOpenOnPointerDown.current = false;
                      event.preventDefault();
                      setWalletOpen(false);
                    }}
                  >
                    <span className="flex min-w-0 flex-col items-start">
                      <span className="text-foreground truncate font-mono text-sm font-semibold">
                        {selectedWallet?.address}
                      </span>
                      <span className="text-muted-foreground truncate text-xs">
                        {selectedWallet?.name}
                      </span>
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {copy.wallets.map((wallet) => (
                      <SelectItem key={wallet.value} value={wallet.value}>
                        <span className="flex min-w-0 flex-col items-start">
                          <span className="text-foreground font-mono text-xs font-semibold">
                            {wallet.address}
                          </span>
                          <span className="text-muted-foreground text-[0.7rem]">{wallet.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </section>

              <div className="border-brand/20 bg-brand/[0.06] mt-6 rounded-lg border px-4 py-3.5">
                <p className="text-accent-text flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.1em] uppercase">
                  <StatusDot />
                  {copy.policyLabel}
                </p>
                <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                  {copy.policyNote}
                </p>
              </div>

              {error ? (
                <p
                  role="alert"
                  className="border-destructive/30 bg-destructive/[0.06] text-destructive mt-4 rounded-lg border px-3.5 py-2.5 text-xs font-semibold"
                >
                  {error}
                </p>
              ) : null}

              <ActionButton
                variant="gradient"
                size="lg"
                onClick={onConfirm}
                className="mt-5 h-12 w-full text-sm font-bold"
              >
                {copy.confirm}
              </ActionButton>
            </aside>
          </div>
        </VaraPanel>
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
    <VaraPanel>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="p-5 sm:p-7 lg:p-8">
          <p className="text-muted-foreground text-sm font-medium">{copy.eyebrow}</p>
          <h3 className="font-display text-foreground mt-1.5 text-xl font-extrabold tracking-[-0.02em] sm:text-2xl">
            {copy.title}
          </h3>
          <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
            {copy.description}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { label: copy.routing, value: demoConfig.routingNumber },
              { label: copy.account, value: demoConfig.accountNumber },
            ].map((field) => (
              <div key={field.label} className="bg-foreground/[0.03] rounded-lg px-4 py-3.5">
                <p className="text-muted-foreground text-xs font-medium">{field.label}</p>
                <p className="text-foreground mt-1 font-mono text-base font-semibold tracking-wide">
                  {field.value}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-brand/[0.06] mt-4 flex items-center gap-2.5 rounded-lg px-4 py-3">
            <span className="bg-brand size-1.5 animate-pulse rounded-full" aria-hidden="true" />
            <p className="text-muted-foreground text-xs">{copy.waiting}</p>
          </div>
        </div>

        <aside className="border-border bg-foreground/[0.02] border-t p-5 sm:p-7 lg:border-t-0 lg:border-l lg:p-8">
          <p className="text-foreground text-sm font-bold">{copy.scenarioLabel}</p>
          <div className="mt-3 grid gap-2.5">
            <ActionButton
              variant="gradient"
              size="lg"
              onClick={() => simulate('large')}
              disabled={busy !== null}
              className="h-12 w-full text-sm font-bold"
            >
              {busy === 'large' ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : null}
              {copy.simulateLarge}
            </ActionButton>
            <ActionButton
              variant="outline"
              size="lg"
              onClick={() => simulate('small')}
              disabled={busy !== null}
              className="h-12 w-full border-[1.5px] text-sm font-semibold"
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

          <p className="bg-foreground/[0.03] text-muted-foreground mt-5 rounded-lg px-4 py-3 text-xs leading-relaxed">
            {copy.note}
          </p>
        </aside>
      </div>
    </VaraPanel>
  );
}
