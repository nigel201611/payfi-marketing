'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { messages, type Locale, type Messages } from './messages';

const STORAGE_KEY = 'exio-locale';
const listeners = new Set<() => void>();
let cachedLocale: Locale | null = null;

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function readStoredLocale(): Locale {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'zh' ? 'zh' : 'en';
  } catch {
    return 'en';
  }
}

function getSnapshot(): Locale {
  if (typeof window === 'undefined') return 'en';
  if (cachedLocale === null) cachedLocale = readStoredLocale();
  return cachedLocale;
}

function getServerSnapshot(): Locale {
  return 'en';
}

function applyLocale(next: Locale) {
  cachedLocale = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Storage can be unavailable in private browsing; the switch still works for this session.
  }
  emit();
}

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: Messages;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
  }, [locale]);

  const setLocale = useCallback((next: Locale) => applyLocale(next), []);
  const toggleLocale = useCallback(() => {
    applyLocale(getSnapshot() === 'en' ? 'zh' : 'en');
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, toggleLocale, t: messages[locale] }),
    [locale, setLocale, toggleLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (context) return context;

  // Fallback keeps components usable in isolated tests/previews without a provider.
  return {
    locale: 'en',
    setLocale: () => {},
    toggleLocale: () => {},
    t: messages.en,
  };
}
