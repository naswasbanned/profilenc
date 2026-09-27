import { describe, expect, it } from 'vitest';
import { clientIp } from './clientIp.js';

/** Minimal Express-request stand-in. */
function req(headers = {}, ip = '172.18.0.4', remoteAddress = '172.18.0.4') {
  return { headers, ip, socket: { remoteAddress } };
}

describe('clientIp', () => {
  it('prefers CF-Connecting-IP for traffic through the Cloudflare tunnel', () => {
    const request = req({
      'cf-connecting-ip': '203.0.113.7',
      'x-forwarded-for': '203.0.113.7, 172.18.0.3',
    });
    expect(clientIp(request)).toBe('203.0.113.7');
  });

  it('falls back to the last X-Forwarded-For entry for direct LAN access', () => {
    // nginx appends the peer it spoke to, so the last hop is the real client.
    const request = req({ 'x-forwarded-for': '192.168.1.50' });
    expect(clientIp(request)).toBe('192.168.1.50');
  });

  it('ignores spoofed leading X-Forwarded-For entries', () => {
    // A client sending its own XFF can only prepend; nginx appends the truth.
    const request = req({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8, 192.168.1.50' });
    expect(clientIp(request)).toBe('192.168.1.50');
  });

  it('does not let a spoofed header override the Cloudflare header', () => {
    const request = req({
      'cf-connecting-ip': '203.0.113.7',
      'x-forwarded-for': '1.2.3.4',
    });
    expect(clientIp(request)).toBe('203.0.113.7');
  });

  it('falls back to the socket address when no proxy headers are present', () => {
    expect(clientIp(req({}, '10.0.0.9', '10.0.0.9'))).toBe('10.0.0.9');
  });

  it('strips ports from IPv4 and bracketed IPv6 addresses', () => {
    expect(clientIp(req({ 'cf-connecting-ip': '203.0.113.5:51234' }))).toBe('203.0.113.5');
    expect(clientIp(req({ 'cf-connecting-ip': '[2001:db8::1]:443' }))).toBe('2001:db8::1');
  });

  it('keeps bare IPv6 addresses intact', () => {
    expect(clientIp(req({ 'cf-connecting-ip': '2001:db8::dead:beef' }))).toBe('2001:db8::dead:beef');
  });

  it('drops an IPv6 zone identifier', () => {
    expect(clientIp(req({ 'cf-connecting-ip': 'fe80::1%eth0' }))).toBe('fe80::1');
  });

  it('never returns an empty key', () => {
    const request = { headers: {}, ip: undefined, socket: {} };
    expect(clientIp(request)).toBe('unknown');
  });

  it('skips blank header values rather than keying on them', () => {
    expect(clientIp(req({ 'cf-connecting-ip': '   ', 'x-forwarded-for': '198.51.100.2' })))
      .toBe('198.51.100.2');
  });
});
