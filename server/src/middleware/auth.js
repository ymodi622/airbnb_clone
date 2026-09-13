'use strict';
const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * requireAuth — verifies the JWT from the httpOnly cookie.
 * Attaches the decoded payload to req.user on success.
 * Returns 401 if missing or invalid.
 */
function requireAuth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    const err = new Error('Authentication required.');
    err.statusCode = 401;
    return next(err);
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    const authErr = new Error('Invalid or expired session. Please log in again.');
    authErr.statusCode = 401;
    next(authErr);
  }
}

/**
 * optionalAuth — like requireAuth but never errors.
 * Attaches req.user if a valid token exists; otherwise req.user = null.
 * Useful for endpoints that change behavior based on auth status
 * (e.g., wishlist status for logged-out users returns false instead of 401).
 */
function optionalAuth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret);
    req.user = { id: payload.sub, email: payload.email };
  } catch {
    req.user = null;
  }
  next();
}

module.exports = { requireAuth, optionalAuth };
