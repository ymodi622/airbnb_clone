'use strict';
const mongoose = require('mongoose');
const config = require('../config/env');

async function connectDB() {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`[db] MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`[db] MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;
