'use strict';
const config = require('../config/env');

/**
 * Centralized error-handling middleware.
 * Logs the full error server-side only.
 * Never leaks stack traces or raw SQL text to the response body.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  // Full detail stays in SERVER logs only — never sent to client
  console.error('[error]', {
    status: err.statusCode || 500,
    message: err.message,
    path: `${req.method} ${req.path}`,
    stack: err.stack,
  });

  const statusCode = err.statusCode || err.status || 500;

  // In production, never expose internal error detail
  const message =
    config.nodeEnv === 'production'
      ? 'An unexpected error occurred. Please try again later.'
      : err.message || 'Internal server error';

  res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
