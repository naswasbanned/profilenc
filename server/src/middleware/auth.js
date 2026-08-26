import jwt from 'jsonwebtoken';

/**
 * Express middleware — verifies JWT from Authorization header.
 * Attaches decoded payload to req.user.
 * Returns 401 if missing/invalid/expired.
 */
export default function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = header.slice(7);
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
