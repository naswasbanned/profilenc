/**
 * Client IP extraction for rate limiting.
 *
 * Request path in production: visitor -> Cloudflare edge -> cloudflared ->
 * nginx -> Express. Express only ever sees the nginx socket address, so a
 * limiter keyed on `req.ip` would put every visitor in one bucket.
 *
 * Resolution order, and why:
 *
 *   1. `CF-Connecting-IP` — set by the Cloudflare edge and not forwardable by
 *      the client. Trustworthy because the tunnel is the only public ingress.
 *
 *   2. The LAST entry of `X-Forwarded-For` — nginx uses
 *      `$proxy_add_x_forwarded_for`, which appends the address of the peer it
 *      actually spoke to. A client can prepend fake entries but cannot control
 *      the one our own nginx adds, so the last entry is the real immediate
 *      client. This covers direct LAN access on the published port, which
 *      bypasses Cloudflare and carries no CF-Connecting-IP.
 *
 *   3. `req.ip` / the socket address, as a last resort.
 *
 * Deliberately NOT using the leftmost X-Forwarded-For entry: that is the one
 * value an attacker can set freely, and keying on it would let a single host
 * evade every limit by rotating a header.
 */

/** Strip an IPv6 zone, brackets, and a trailing :port from a raw address. */
function normalizeAddress(value) {
  if (typeof value !== 'string') return null;

  let address = value.trim();
  if (!address) return null;

  // "[2001:db8::1]:443" -> "2001:db8::1"
  const bracketed = address.match(/^\[(.+)\](?::\d+)?$/);
  if (bracketed) {
    address = bracketed[1];
  } else if (address.includes(':') && !address.slice(address.indexOf(':') + 1).includes(':')) {
    // Exactly one colon means IPv4 with a port, e.g. "203.0.113.5:51234".
    address = address.slice(0, address.indexOf(':'));
  }

  // Drop an IPv6 scope id such as "fe80::1%eth0".
  const zone = address.indexOf('%');
  if (zone !== -1) address = address.slice(0, zone);

  return address || null;
}

/**
 * @param {import('express').Request} req
 * @returns {string} A stable identifier for the calling client.
 */
export function clientIp(req) {
  const cloudflare = normalizeAddress(req.headers?.['cf-connecting-ip']);
  if (cloudflare) return cloudflare;

  const forwarded = req.headers?.['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    const hops = forwarded.split(',');
    // Walk backwards: the trailing entries are the ones our own proxies added.
    for (let i = hops.length - 1; i >= 0; i -= 1) {
      const candidate = normalizeAddress(hops[i]);
      if (candidate) return candidate;
    }
  }

  return normalizeAddress(req.ip) || normalizeAddress(req.socket?.remoteAddress) || 'unknown';
}

export default clientIp;
