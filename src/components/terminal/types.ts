import type { IntentValues, Order } from '@/constants/terminal';
import type { Messages } from '@/i18n/messages';

export type LogChannel = 'SYS' | 'AGENT' | 'MCP' | 'CRB' | 'WEBHOOK' | 'WARN' | 'OK' | 'API';
export type LogKey = keyof Messages['logs'];

export type LogEntry = {
  id: number;
  at: Date;
  channel: LogChannel;
  key: LogKey;
  params?: Record<string, string | number>;
};

export type Stage = 'welcome' | 'launch' | 'intent' | 'strategy' | 'settlement' | 'receipt';
export type IntentPhase = 'form' | 'funding';
export type Overlay = 'approval' | 'payment' | null;

export type ReceiptData = {
  order: Order;
  orderRef: string;
  txId: string;
  receiptHash: string;
  completedAt: Date;
  wallet: string;
};

export type IntentPatch = Partial<IntentValues>;
