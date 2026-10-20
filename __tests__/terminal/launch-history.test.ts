import { beforeEach, describe, expect, it } from 'vitest';
import {
  LAUNCH_HISTORY_KEY,
  mergeLaunchBrief,
  readLaunchHistory,
  writeLaunchHistory,
} from '@/lib/launch-history';

describe('launch history', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('prepends, dedupes and caps at five entries', () => {
    expect(mergeLaunchBrief('a', [])).toEqual(['a']);
    expect(mergeLaunchBrief('a', ['b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    expect(mergeLaunchBrief('6', ['1', '2', '3', '4', '5'])).toEqual(['6', '1', '2', '3', '4']);
  });

  it('ignores blank briefs', () => {
    expect(mergeLaunchBrief('   ', ['a'])).toEqual(['a']);
  });

  it('reads and writes localStorage safely', () => {
    writeLaunchHistory(['a', 'b', 'c', 'd', 'e', 'f']);
    expect(readLaunchHistory()).toEqual(['a', 'b', 'c', 'd', 'e']);

    window.localStorage.setItem(LAUNCH_HISTORY_KEY, 'not-json');
    expect(readLaunchHistory()).toEqual([]);
  });
});
