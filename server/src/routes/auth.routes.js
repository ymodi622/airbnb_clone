'use strict';
const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const {
  register,
  login,
  logout,
  me,
  registerBodySchema,
  loginBodySchema,
} = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

const router = Router();

// 5 requests per minute per IP on auth mutation routes
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment and try again.' },
});

router.post('/register', authLimiter, validate({ body: registerBodySchema }), register);
router.post('/login',    authLimiter, validate({ body: loginBodySchema }), login);
router.post('/logout',   logout);
router.get('/me',        requireAuth, me);

module.exports = router;
