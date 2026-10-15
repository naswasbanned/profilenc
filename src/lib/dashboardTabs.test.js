import { describe, expect, it } from 'vitest';
import { resolveDashboardTab, formatUnreadBadge, nextTabId } from './dashboardTabs';

describe('resolveDashboardTab', () => {
  it('opens inbox only for the exact value', () => {
    expect(resolveDashboardTab('inbox')).toBe('inbox');
  });
  it('falls back to stats for missing or invalid values', () => {
    for (const v of [null, undefined, '', 'stats', 'INBOX', 'garbage']) {
      expect(resolveDashboardTab(v)).toBe('stats');
    }
  });
});

describe('formatUnreadBadge', () => {
  it('hides for non-positive or non-numeric values', () => {
    for (const v of [null, undefined, false, 0, -1, NaN, '3']) {
      expect(formatUnreadBadge(v)).toBe('');
    }
  });
  it('shows the count and caps at 99+', () => {
    expect(formatUnreadBadge(1)).toBe('1');
    expect(formatUnreadBadge(99)).toBe('99');
    expect(formatUnreadBadge(100)).toBe('99+');
    expect(formatUnreadBadge(250)).toBe('99+');
  });
});

describe('nextTabId', () => {
  it('moves and wraps with arrows', () => {
    expect(nextTabId('stats', 'ArrowRight')).toBe('inbox');
    expect(nextTabId('inbox', 'ArrowRight')).toBe('stats');
    expect(nextTabId('stats', 'ArrowLeft')).toBe('inbox');
    expect(nextTabId('inbox', 'ArrowLeft')).toBe('stats');
  });
  it('jumps with Home and End', () => {
    expect(nextTabId('inbox', 'Home')).toBe('stats');
    expect(nextTabId('stats', 'End')).toBe('inbox');
  });
  it('ignores other keys and unknown tabs', () => {
    expect(nextTabId('stats', 'Enter')).toBeNull();
    expect(nextTabId('nope', 'ArrowRight')).toBeNull();
  });
});
