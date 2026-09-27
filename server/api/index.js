'use strict';
const app = require('../src/app');
const connectDB = require('../src/db/connect');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('[vercel-api] MongoDB connection failed:', err.message);
    return res.status(500).json({ error: 'Database connection error', message: err.message });
  }
  return app(req, res);
};

