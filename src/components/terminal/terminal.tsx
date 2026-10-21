'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AgentMonitor } from '@/components/terminal/agent-monitor';
import { IntentStep } from '@/components/terminal/intent-step';
import { LaunchStep } from '@/components/terminal/launch-step';
import { ApprovalOverlay, PaymentOverlay } from '@/components/terminal/overlays';
import { ReceiptStep } from '@/components/terminal/receipt-step';
import { SettlementStep } from '@/components/terminal/settlement-step';
import { StrategyStep } from '@/components/terminal/strategy-step';
import { TerminalHeader } from '@/components/terminal/terminal-header';
import type {
  IntentPatch,
  IntentPhase,
  LogChannel,
  LogEntry,
  LogKey,
  Overlay,
  ReceiptData,
  Stage,
} from '@/components/terminal/types';
import { WelcomeStep } from '@/components/terminal/welcome-step';
import {
  createOrder,
  defaultIntent,
  demoConfig,
  formatCurrency,
  parseAmount,
  timing,
  validateIntentValues,
  type AssetId,
  type IntentValues,
  type Order,
  type Scenario,
} from '@/constants/terminal';
import { useTheme } from '@/components/providers/theme-provider';
import { useI18n } from '@/i18n/locale-provider';
import { runSettlement } from '@/lib/agent/settlement-runner';
import type { AgentEvent, SettlementContext } from '@/lib/agent/types';
import { applyBriefAnalysis } from '@/lib/intent-parser';
import type { BriefAnalysisResult } from '@/lib/launch-analysis';
import type { McpTransport } from '@/lib/mcp/types';
import { createRuntimeMcpTransport } from '@/lib/mcp/runtime';

export function Terminal() {
  const { t, locale } = useI18n();
  const { theme } = useTheme();
  const [stage, setStage] = useState<Stage>('welcome');
  const [intentPhase, setIntentPhase] = useState<IntentPhase>('form');
  const [intent, setIntent] = useState<IntentValues>(defaultIntent);
  const [intentError, setIntentError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<AssetId | null>(null);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [settled, setSettled] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [lastLaunchBrief, setLastLaunchBrief] = useState('');
  const [retryAvailable, setRetryAvailable] = useState(false);

  const timers = useRef<number[]>([]);
  const runId = useRef(0);
  const logId = useRef(0);
  const seeded = useRef(false);
  const mainRef = useRef<HTMLElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const mcpTransportRef = useRef<McpTransport | null>(null);
  const receiptBusyRef = useRef(false);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const addLog = useCallback(
    (channel: LogChannel, key: LogKey, params?: Record<string, string | number>) => {
      setLogs((previous) => [
        ...previous.slice(-199),
        { id: (logId.current += 1), at: new Date(), channel, key, params },
      ]);
    },
    [],
  );

  const schedule = useCallback((callback: () => void, delay: number) => {
    const token = runId.current;
    const id = window.setTimeout(() => {
      if (token === runId.current) callback();
    }, delay);
    timers.current.push(id);
  }, []);

  const seedLogs = useCallback(() => {
    addLog('SYS', 'sysConnected');
    schedule(() => addLog('SYS', 'sysBalance'), 650);
  }, [addLog, schedule]);

  useEffect(() => {
    return () => {
      clearTimers();
      abortRef.current?.abort();
    };
  }, [clearTimers]);

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    seedLogs();
  }, [seedLogs]);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    const main = mainRef.current;
    if (main) main.scrollTop = 0;
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [stage, intentPhase]);

  const handleStart = () => {
    addLog('AGENT', 'agentLaunched');
    setStage('intent');
  };

  const handleOpenLaunch = () => {
    addLog('AGENT', 'agentIntake');
    setStage('launch');
  };

  const handleLaunchBack = () => {
    setStage('welcome');
  };

  const handleIntentBack = () => {
    runId.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    clearTimers();
    setIntentPhase('form');
    setIntent(defaultIntent);
    setOrder(null);
    setSelectedAssetId(null);
    setOverlay(null);
    setSettled(false);
    setReceipt(null);
    setRetryAvailable(false);
    setStage('launch');
  };

  const handleLaunchSubmit = (brief: string, result: BriefAnalysisResult) => {
    setLastLaunchBrief(brief);
    setIntent((previous) => applyBriefAnalysis(previous, result.analysis));
    setRetryAvailable(false);
    addLog('AGENT', 'agentBrief', { brief: brief.slice(0, 160) });
    addLog('AGENT', 'agentBriefAnalyzed', {
      source: result.source === 'llm' ? 'LLM' : 'policy',
    });
    handleStart();
  };

  const handleLaunchSkip = () => {
    setLastLaunchBrief('');
    setIntent(defaultIntent);
    setRetryAvailable(false);
    handleStart();
  };

  const handleIntentChange = (patch: IntentPatch) => {
    setIntent((previous) => ({ ...previous, ...patch }));
    setIntentError(null);
  };

  const handleConfirmIntent = () => {
    const errorKey = validateIntentValues(intent);
    if (errorKey) {
      setIntentError(t.intent.validation[errorKey]);
      return;
    }

    const single = parseAmount(intent.singleLimit);
    const max = parseAmount(intent.maxBudget);
    setIntentError(null);
    setIntentPhase('funding');
    addLog('MCP', 'mcpSetup');
    addLog('AGENT', 'agentValidated', {
      limit: formatCurrency(single, locale),
      budget: formatCurrency(max, locale),
    });
    schedule(() => addLog('MCP', 'mcpVirtualAccount'), 350);
    schedule(() => addLog('CRB', 'crbVirtualAccount'), 900);
  };

  const beginPayment = (nextOrder: Order) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const token = runId.current;
    const walletAddress = demoConfig.wallets[intent.wallet];

    if (!mcpTransportRef.current) {
      mcpTransportRef.current = createRuntimeMcpTransport();
    }

    const context: SettlementContext = {
      orderId: demoConfig.orderRef,
      assetId: nextOrder.asset.code,
      amount: nextOrder.amount,
      rwaAmount: nextOrder.quantity,
      payeeAccount: demoConfig.payeeAccount,
      walletAddress,
    };

    const onEvent = (event: AgentEvent) => {
      if (token !== runId.current) return;

      switch (event.type) {
        case 'plan_ready':
          addLog('AGENT', 'agentPlan', {
            source: event.source === 'llm' ? 'LLM' : 'policy',
            count: event.toolCount,
          });
          break;
        case 'tool_start':
          if (event.tool === 'execute_crb_payment') addLog('MCP', 'mcpExecutePayment');
          else if (event.tool === 'verify_crb_settlement') addLog('MCP', 'mcpVerifySettlement');
          else addLog('MCP', 'mcpOnchain');
          break;
        case 'clearing':
          addLog('CRB', 'crbClearing');
          break;
        case 'paid':
          addLog('CRB', 'crbPaid', { txId: event.txId });
          break;
        case 'settlement_started':
          addLog('AGENT', 'agentSettling');
          setOverlay(null);
          setStage('settlement');
          setSettled(false);
          break;
        case 'settled':
          setSettled(true);
          addLog('OK', 'delivered', { wallet: walletAddress });
          break;
        case 'failed':
          addLog('WARN', 'mcpError', {
            tool: event.tool ?? 'settlement',
            error: event.error,
          });
          break;
        default:
          break;
      }
    };

    void runSettlement({
      context,
      transport: mcpTransportRef.current,
      onEvent,
      signal: controller.signal,
      delays: {
        clearing: timing.clearing,
        payment: timing.payment,
        settle: timing.settle,
      },
    }).finally(() => {
      if (abortRef.current === controller) abortRef.current = null;
    });
  };

  const runStrategy = (nextOrder: Order) => {
    const single = parseAmount(intent.singleLimit);
    addLog('AGENT', 'agentScanning');
    schedule(() => {
      setSelectedAssetId(nextOrder.asset.id);
      addLog('AGENT', 'agentSelected', { asset: nextOrder.asset.code });
      addLog('MCP', 'mcpCreateOrder', { code: nextOrder.asset.code, qty: nextOrder.quantity });
      if (nextOrder.amount > single) {
        addLog('WARN', 'warnLarge', {
          amount: formatCurrency(nextOrder.amount, locale),
          limit: formatCurrency(single, locale),
        });
      } else {
        addLog('AGENT', 'warnSmall', {
          amount: formatCurrency(nextOrder.amount, locale),
          limit: formatCurrency(single, locale),
        });
      }
    }, timing.evaluate);

    schedule(() => {
      if (nextOrder.amount > single) {
        setOverlay('approval');
        addLog('WARN', 'blocked');
      } else {
        setOverlay('payment');
        addLog('AGENT', 'agentPayment');
        beginPayment(nextOrder);
      }
    }, timing.evaluate + timing.choose);
  };

  const handleSimulate = (scenario: Scenario) => {
    const nextOrder = createOrder(scenario);
    const funds = parseAmount(intent.maxBudget);
    setOrder(nextOrder);
    setSelectedAssetId(null);
    setRetryAvailable(false);
    addLog('WEBHOOK', 'webhookDeposit', { amount: formatCurrency(funds, locale) });
    schedule(() => {
      addLog('SYS', 'sysFunds', { funds: formatCurrency(funds, locale) });
      setStage('strategy');
      schedule(() => runStrategy(nextOrder), 420);
    }, timing.funding);
  };

  const handleAbandon = () => {
    setIntentPhase('form');
  };

  const handleApprove = () => {
    if (!order) return;
    addLog('OK', 'userApproved');
    addLog('AGENT', 'agentPayment');
    setRetryAvailable(false);
    setOverlay('payment');
    beginPayment(order);
  };

  const handleReject = () => {
    addLog('WARN', 'userRejected');
    setOverlay(null);
    setRetryAvailable(true);
  };

  const handleRetryPayment = () => {
    if (!order) return;
    setRetryAvailable(false);
    setOverlay('approval');
  };

  const handleStrategyBack = () => {
    runId.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    clearTimers();
    setOrder(null);
    setSelectedAssetId(null);
    setOverlay(null);
    setRetryAvailable(false);
    setIntentPhase('form');
    setStage('intent');
  };

  const handleConfirmReceipt = async () => {
    if (!order || !settled || receiptBusyRef.current) return;
    receiptBusyRef.current = true;
    const token = runId.current;
    addLog('OK', 'userReceipt');
    addLog('MCP', 'mcpConfirmDelivery');

    if (!mcpTransportRef.current) {
      mcpTransportRef.current = createRuntimeMcpTransport();
    }

    try {
      const result = await mcpTransportRef.current.callTool('confirm_delivery', {
        order_id: demoConfig.orderRef,
        receipt_hash: demoConfig.receiptHash,
      });
      if (token !== runId.current) return;
      if (!result.ok) {
        addLog('WARN', 'mcpError', { tool: 'confirm_delivery', error: result.error });
        return;
      }
      addLog('SYS', 'closed');
      setReceipt({
        order,
        orderRef: demoConfig.orderRef,
        txId: demoConfig.txId,
        receiptHash: demoConfig.receiptHash,
        completedAt: new Date(),
        wallet: intent.wallet,
      });
      setStage('receipt');
    } finally {
      receiptBusyRef.current = false;
    }
  };

  const handleReset = () => {
    runId.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    setLastLaunchBrief('');
    clearTimers();
    setStage('welcome');
    setIntentPhase('form');
    setIntent(defaultIntent);
    setIntentError(null);
    setOrder(null);
    setSelectedAssetId(null);
    setOverlay(null);
    setSettled(false);
    setReceipt(null);
    setRetryAvailable(false);
    setLogs([]);
    seedLogs();
  };

  const availableFunds = Number.isFinite(parseAmount(intent.maxBudget))
    ? parseAmount(intent.maxBudget)
    : demoConfig.maxBudget;
  const singleLimit = Number.isFinite(parseAmount(intent.singleLimit))
    ? parseAmount(intent.singleLimit)
    : demoConfig.singleLimit;

  return (
    <div className="bg-background text-foreground flex min-h-dvh flex-col lg:h-dvh lg:min-h-0 lg:overflow-hidden">
      <a
        href="#terminal-main"
        className="bg-brand text-ink sr-only z-[100] rounded-full px-5 py-3 text-sm font-semibold focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        {t.common.skipToContent}
      </a>

      <TerminalHeader canReset={stage !== 'welcome'} onReset={handleReset} />

      <div className="relative grid flex-1 grid-cols-1 lg:h-[calc(100dvh-72px)] lg:min-h-0 lg:flex-none lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:overflow-hidden">
        <section className="border-border bg-workspace relative flex min-h-0 min-w-0 flex-col overflow-hidden lg:h-full">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {theme === 'light' && stage === 'welcome' ? (
              <>
                <div className="absolute inset-0 bg-[#fbfcfb]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,13,11,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,13,11,0.05)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_50%_0%,black_10%,transparent_78%)] bg-[size:28px_28px]" />
                <div className="absolute -top-24 right-0 size-80 rounded-full bg-[radial-gradient(circle,rgba(0,221,149,0.16),transparent_70%)] blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_8%_0%,rgba(255,255,255,0.9),transparent_55%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(0,221,149,0.03)_100%)]" />
              </>
            ) : theme === 'dark' ? (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(70%_48%_at_18%_0%,rgba(255,255,255,0.035),transparent_68%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_42%)]" />
                <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_0%,black_10%,transparent_70%)] opacity-25" />
              </>
            ) : null}
          </div>

          <main
            id="terminal-main"
            ref={mainRef}
            className="relative z-10 min-h-0 flex-1 overflow-y-auto"
          >
            <div className="mx-auto w-full max-w-[940px] px-5 py-2 sm:px-8 lg:px-12 lg:py-4">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {stage === 'welcome' ? <WelcomeStep onStart={handleOpenLaunch} /> : null}

                  {stage === 'launch' ? (
                    <LaunchStep
                      initialBrief={lastLaunchBrief}
                      onBack={handleLaunchBack}
                      onSubmit={handleLaunchSubmit}
                      onSkip={handleLaunchSkip}
                    />
                  ) : null}

                  {stage === 'intent' ? (
                    <IntentStep
                      intent={intent}
                      phase={intentPhase}
                      error={intentError}
                      onChange={handleIntentChange}
                      onConfirm={handleConfirmIntent}
                      onSimulate={handleSimulate}
                      onAbandon={handleAbandon}
                      onBack={handleIntentBack}
                    />
                  ) : null}

                  {stage === 'strategy' ? (
                    <StrategyStep
                      availableFunds={availableFunds}
                      selectedAssetId={selectedAssetId}
                      retryAvailable={retryAvailable}
                      onRetry={handleRetryPayment}
                      onBack={handleStrategyBack}
                    />
                  ) : null}

                  {stage === 'settlement' && order ? (
                    <SettlementStep
                      order={order}
                      wallet={intent.wallet}
                      settled={settled}
                      onConfirm={handleConfirmReceipt}
                    />
                  ) : null}

                  {stage === 'receipt' && receipt ? (
                    <ReceiptStep receipt={receipt} onReset={handleReset} />
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          <footer className="border-border text-muted-foreground relative z-10 flex shrink-0 items-center gap-2 border-t px-5 py-3 font-mono text-[0.58rem] tracking-[0.05em] sm:px-8 lg:px-12">
            <span className="bg-brand/70 size-1 rounded-full" aria-hidden="true" />
            {t.common.mockFooter}
          </footer>

          <AnimatePresence>
            {overlay === 'approval' && order ? (
              <ApprovalOverlay
                key="approval"
                order={order}
                limit={singleLimit}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ) : null}
            {overlay === 'payment' && order ? <PaymentOverlay key="payment" order={order} /> : null}
          </AnimatePresence>
        </section>

        <AgentMonitor logs={logs} />
      </div>
    </div>
  );
}
