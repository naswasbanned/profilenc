/**
 * Rate limiters.
 *
 * Every limiter is keyed through `clientIp` (see ./clientIp.js) rather than
 * `req.ip`, because Express sits behind nginx behind cloudflared behind the
 * Cloudflare edge and would otherwise see a single proxy address for everyone.
 * The extracted address is then passed through `ipKeyGenerator` so IPv6 clients
 * are bucketed by subnet instead of by individual address, which stops a single
 * user from rotating through their /64.
 *
 * `trust proxy` is intentionally left off in index.js: nothing here depends on
 * `req.ip` being rewritten, and leaving it off keeps `req.ip` unspoofable for
 * any other consumer.
 *
 * Rejections are logged so the limits can be tuned against real traffic.
 */

import { ipKeyGenerator, rateLimit } from 'express-rate-limit';
import { clientIp } from './clientIp.js';

const MINUTE = 60 * 1000;

/** Bucket by client address, IPv6-subnet aware. */
const byClient = (req) => ipKeyGenerator(clientIp(req));

function rejectionHandler(label) {
  return (req, res, _next, options) => {
    console.warn(
      `[rate-limit] ${label} blocked ${clientIp(req)} on ${req.method} ${req.originalUrl}`
    );
    res.status(options.statusCode).json({ error: options.message });
  };
}

function limiter({ label, windowMs, limit, message, keyGenerator = byClient, ...rest }) {
  return rateLimit({
    windowMs,
    limit,
    message,
    keyGenerator,
    handler: rejectionHandler(label),
    standardHeaders: true,
    legacyHeaders: false,
    // We never read req.ip for keys, so the library's warning about a missing
    // `trust proxy` setting when X-Forwarded-For is present is just noise.
    validate: { xForwardedForHeader: false },
    ...rest,
  });
}

/** Outer bound for the whole API. Generous: this is an abuse ceiling. */
export const apiLimiter = limiter({
  label: 'api',
  windowMs: 15 * MINUTE,
  limit: 600,
  message: 'Too many requests. Please slow down and try again shortly.',
});

/**
 * Failed logins per client address. Successful logins are not counted, so a
 * household behind one NAT address cannot lock itself out by logging in.
 */
export const loginIpLimiter = limiter({
  label: 'login-ip',
  windowMs: 15 * MINUTE,
  limit: 20,
  skipSuccessfulRequests: true,
  message: 'Too many failed login attempts. Please try again in a few minutes.',
});

/**
 * Failed logins per account, so spreading an attack across many addresses still
 * runs into a wall on the targeted account.
 */
export const loginAccountLimiter = limiter({
  label: 'login-account',
  windowMs: 15 * MINUTE,
  limit: 5,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    const identifier = req.body?.login || req.body?.username;
    if (typeof identifier === 'string' && identifier.trim()) {
      return `account:${identifier.toLowerCase().trim()}`;
    }
    // No identifier supplied: fall back to the address so the bucket still works.
    return byClient(req);
  },
  message: 'Too many failed login attempts for this account. Please try again in a few minutes.',
});

export const registerLimiter = limiter({
  label: 'register',
  windowMs: 60 * MINUTE,
  limit: 5,
  message: 'Too many accounts created from this network. Please try again later.',
});

export const usernameCheckLimiter = limiter({
  label: 'username-check',
  windowMs: MINUTE,
  limit: 30,
  message: 'Too many username checks. Please slow down.',
});

export const passwordChangeLimiter = limiter({
  label: 'password-change',
  windowMs: 60 * MINUTE,
  limit: 10,
  message: 'Too many password change attempts. Please try again later.',
});

export const suggestionLimiter = limiter({
  label: 'suggestions',
  windowMs: 60 * MINUTE,
  limit: 5,
  message: 'You have sent several suggestions already. Please try again later.',
});

/** Keyed per account, since this route sits behind auth. */
export const imageUploadLimiter = limiter({
  label: 'image-upload',
  windowMs: 60 * MINUTE,
  limit: 40,
  keyGenerator: (req) => (req.user?.id ? `user:${req.user.id}` : byClient(req)),
  message: 'Upload limit reached for this hour. Please try again later.',
});
