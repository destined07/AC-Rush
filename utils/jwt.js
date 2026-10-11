import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'algoforge-jwt-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const USER_COOKIE_NAME = 'auth_token';
export const ADMIN_COOKIE_NAME = 'admin_token';

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000 // 1 day
};

export function signToken(payload, options = {}) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    ...options
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function attachUserFromToken(req, res, next) {
  const token = req.cookies?.[USER_COOKIE_NAME] ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (token) {
    const decoded = verifyToken(token);
    if (decoded && decoded.userId) {
      req.user = {
        id: decoded.userId,
        userId: decoded.userId,
        username: decoded.username,
        email: decoded.email
      };
      res.locals.user = {
        id: decoded.userId,
        username: decoded.username
      };
    } else {
      req.user = null;
      res.locals.user = null;
    }
  } else {
    req.user = null;
    res.locals.user = null;
  }

  // Also check admin token
  const adminToken = req.cookies?.[ADMIN_COOKIE_NAME];
  if (adminToken) {
    const adminDecoded = verifyToken(adminToken);
    if (adminDecoded && adminDecoded.adminId) {
      req.admin = {
        id: adminDecoded.adminId,
        adminId: adminDecoded.adminId,
        username: adminDecoded.username
      };
      res.locals.admin = {
        id: adminDecoded.adminId,
        username: adminDecoded.username
      };
    } else {
      req.admin = null;
      res.locals.admin = null;
    }
  } else {
    req.admin = null;
    res.locals.admin = null;
  }

  next();
}
