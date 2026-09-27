import { describe, expect, it } from 'vitest';
import { isSafeUrl, safeUrl } from './safeUrl.js';

describe('safeUrl', () => {
  it('passes through ordinary web links unchanged', () => {
    expect(safeUrl('https://example.com/page?a=1#b')).toBe('https://example.com/page?a=1#b');
    expect(safeUrl('http://example.com')).toBe('http://example.com');
  });

  it('allows mailto and tel', () => {
    expect(safeUrl('mailto:someone@example.com')).toBe('mailto:someone@example.com');
    expect(safeUrl('tel:+15550100')).toBe('tel:+15550100');
  });

  it('allows relative paths, queries and anchors', () => {
    expect(safeUrl('/dashboard')).toBe('/dashboard');
    expect(safeUrl('#contact')).toBe('#contact');
    expect(safeUrl('?tab=2')).toBe('?tab=2');
  });

  it('allows protocol relative URLs, which resolve to https', () => {
    expect(safeUrl('//example.com/x')).toBe('//example.com/x');
  });

  it('rejects javascript URLs', () => {
    expect(safeUrl('javascript:alert(1)')).toBeNull();
    expect(safeUrl('javascript:alert(document.cookie)')).toBeNull();
  });

  it('rejects javascript URLs regardless of case', () => {
    expect(safeUrl('JavaScript:alert(1)')).toBeNull();
    expect(safeUrl('JAVASCRIPT:alert(1)')).toBeNull();
    expect(safeUrl('jAvAsCrIpT:alert(1)')).toBeNull();
  });

  it('rejects javascript URLs hidden behind whitespace and control characters', () => {
    // Browsers strip these before resolving the scheme, so the parser must too.
    expect(safeUrl('  javascript:alert(1)')).toBeNull();
    expect(safeUrl('java\tscript:alert(1)')).toBeNull();
    expect(safeUrl('java\nscript:alert(1)')).toBeNull();
    expect(safeUrl('java\rscript:alert(1)')).toBeNull();
    expect(safeUrl('\u0000javascript:alert(1)')).toBeNull();
  });

  it('rejects data, vbscript, file and unknown schemes', () => {
    expect(safeUrl('data:text/html,<script>alert(1)</script>')).toBeNull();
    expect(safeUrl('data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=')).toBeNull();
    expect(safeUrl('vbscript:msgbox(1)')).toBeNull();
    expect(safeUrl('file:///etc/passwd')).toBeNull();
    expect(safeUrl('chrome://settings')).toBeNull();
  });

  it('rejects empty, whitespace-only and non-string input', () => {
    expect(safeUrl('')).toBeNull();
    expect(safeUrl('   ')).toBeNull();
    expect(safeUrl(null)).toBeNull();
    expect(safeUrl(undefined)).toBeNull();
    expect(safeUrl(42)).toBeNull();
    expect(safeUrl({ toString: () => 'https://example.com' })).toBeNull();
  });

  it('isSafeUrl mirrors safeUrl as a boolean', () => {
    expect(isSafeUrl('https://example.com')).toBe(true);
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
  });
});
