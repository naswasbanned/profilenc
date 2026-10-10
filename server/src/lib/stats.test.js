import { describe, expect, it } from 'vitest';
import { isBotUserAgent, parseStatEvent, parseDays, MAX_TARGET_LENGTH } from './stats.js';

describe('isBotUserAgent', () => {
  it('flags bots, previewers, scripts and empty agents', () => {
    for (const ua of ['Googlebot/2.1', 'Discordbot/2.0', 'facebookexternalhit/1.1', 'WhatsApp/2.23', 'curl/8.0', 'HeadlessChrome/120', '', undefined]) {
      expect(isBotUserAgent(ua)).toBe(true);
    }
  });
  it('lets real browsers through', () => {
    expect(isBotUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0 Safari/537.36')).toBe(false);
    expect(isBotUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148')).toBe(false);
  });
});

describe('parseStatEvent', () => {
  it('accepts views without a target and clicks with one', () => {
    expect(parseStatEvent({ kind: 'view', target: 'ignored' })).toEqual({ kind: 'view', target: '' });
    expect(parseStatEvent({ kind: 'click', target: ' block:b1|https://x.y ' })).toEqual({ kind: 'click', target: 'block:b1|https://x.y' });
  });
  it('drops unknown kinds, missing or oversized targets and junk', () => {
    expect(parseStatEvent({ kind: 'purchase' })).toBe(null);
    expect(parseStatEvent({ kind: 'click' })).toBe(null);
    expect(parseStatEvent({ kind: 'click', target: 42 })).toBe(null);
    expect(parseStatEvent({ kind: 'click', target: 'x'.repeat(MAX_TARGET_LENGTH + 1) })).toBe(null);
    expect(parseStatEvent(null)).toBe(null);
  });
});

describe('parseDays', () => {
  it('defaults to 30 and clamps to 1..90', () => {
    expect(parseDays(undefined)).toBe(30);
    expect(parseDays('7')).toBe(7);
    expect(parseDays('0')).toBe(1);
    expect(parseDays('500')).toBe(90);
    expect(parseDays('abc')).toBe(30);
  });
});
