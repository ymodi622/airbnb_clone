'use strict';
const mongoose = require('mongoose');
const config = require('../config/env');

let cachedPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose
      .connect(config.mongoUri)
      .then((conn) => {
        console.log(`[db] MongoDB connected: ${conn.connection.host}`);
        return conn;
      })
      .catch((err) => {
        cachedPromise = null;
        console.error(`[db] MongoDB connection error: ${err.message}`);
        throw err;
      });
  }

  return cachedPromise;
}

module.exports = connectDB;

