'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const pool = require('../db/pool');
const config = require('../config/env');

const BCRYPT_ROUNDS = 12;

const registerBodySchema = z.object({
  email: z.string().email('Invalid email address.').toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(72, 'Password must be at most 72 characters.'),
});

const loginBodySchema = z.object({
  email: z.string().email('Invalid email address.').toLowerCase(),
  password: z.string().min(1, 'Password is required.'),
});

/** Sets the JWT as a secure httpOnly cookie and returns the token */
function setAuthCookie(res, userId, email) {
  const token = jwt.sign({ sub: userId, email }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  const isProduction = config.nodeEnv === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes in ms
  });

  return token;
}

/**
 * POST /api/auth/register
 * Creates a new user. Does NOT set a cookie — caller must then POST /api/auth/login.
 */
async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    // Check for existing user
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if (existing.length > 0) {
      const err = new Error('An account with that email already exists.');
      err.statusCode = 409;
      return next(err);
    }

    const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    await pool.query(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, password_hash]
    );

    res.status(201).json({ message: 'Account created. Please log in.' });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Verifies credentials, sets JWT cookie on success.
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query(
      'SELECT id, email, password_hash FROM users WHERE email = ?',
      [email]
    );

    // Use constant-time comparison to avoid timing attacks
    const user = users[0] || null;
    const hash = user ? user.password_hash : '$2b$12$invalidhashpaddingtoconstanttime';

    const match = await bcrypt.compare(password, hash);

    if (!user || !match) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      return next(err);
    }

    const token = setAuthCookie(res, user.id, user.email);

    res.json({
      message: 'Logged in successfully.',
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/logout
 * Clears the auth cookie.
 */
function logout(req, res) {
  const isProduction = config.nodeEnv === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });
  res.json({ message: 'Logged out.' });
}

/**
 * GET /api/auth/me
 * Returns the current user from a valid cookie. 401 if none/invalid.
 */
async function me(req, res, next) {
  try {
    // req.user is set by requireAuth middleware
    const [users] = await pool.query(
      'SELECT id, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      const err = new Error('User not found.');
      err.statusCode = 401;
      return next(err);
    }

    res.json({ user: users[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  logout,
  me,
  registerBodySchema,
  loginBodySchema,
};
