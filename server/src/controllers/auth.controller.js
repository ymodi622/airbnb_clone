'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const User = require('../models/User');
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
    const existing = await User.findOne({ email });
    if (existing) {
      const err = new Error('An account with that email already exists.');
      err.statusCode = 409;
      return next(err);
    }

    const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    await User.create({
      email,
      password_hash,
    });

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

    const user = await User.findOne({ email });

    // Use constant-time comparison to avoid timing attacks
    const hash = user ? user.password_hash : '$2b$12$invalidhashpaddingtoconstanttime';
    const match = await bcrypt.compare(password, hash);

    if (!user || !match) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      return next(err);
    }

    const userIdStr = user._id.toString();
    const token = setAuthCookie(res, userIdStr, user.email);

    res.json({
      message: 'Logged in successfully.',
      token,
      user: { id: userIdStr, email: user.email },
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
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully.' });
}

/**
 * GET /api/auth/me
 * Returns current authenticated user profile.
 */
async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('email createdAt');
    if (!user) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      return next(err);
    }
    res.json({ user: { id: user._id.toString(), email: user.email } });
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
