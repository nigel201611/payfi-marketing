export const LAUNCH_HISTORY_KEY = 'naka-launch-history';
export const LAUNCH_HISTORY_LIMIT = 5;

export function mergeLaunchBrief(brief: string, history: string[]): string[] {
  const text = brief.trim();
  if (!text) return history.slice(0, LAUNCH_HISTORY_LIMIT);

  return [text, ...history.filter((item) => item !== text)].slice(0, LAUNCH_HISTORY_LIMIT);
}

export function readLaunchHistory(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(LAUNCH_HISTORY_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .slice(0, LAUNCH_HISTORY_LIMIT);
  } catch {
    return [];
  }
}

export function writeLaunchHistory(history: string[]): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(
      LAUNCH_HISTORY_KEY,
      JSON.stringify(history.slice(0, LAUNCH_HISTORY_LIMIT)),
    );
  } catch {
    // Storage can be unavailable in private browsing; the dialog still works.
  }
}
