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

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'exio-theme';
const listeners = new Set<() => void>();
let cachedTheme: Theme | null = null;

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Theme {
  if (typeof document === 'undefined') return 'dark';
  if (cachedTheme === null) {
    cachedTheme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
  }
  return cachedTheme;
}

function getServerSnapshot(): Theme {
  return 'dark';
}

function applyTheme(next: Theme) {
  cachedTheme = next;
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Storage can be unavailable in private browsing; the switch still works for this session.
  }
  emit();
}

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const setTheme = useCallback((next: Theme) => applyTheme(next), []);
  const toggleTheme = useCallback(() => {
    applyTheme(getSnapshot() === 'dark' ? 'light' : 'dark');
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context) return context;

  return {
    theme: 'dark',
    setTheme: () => {},
    toggleTheme: () => {},
  };
}
