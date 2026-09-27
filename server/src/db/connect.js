'use strict';
const mongoose = require('mongoose');
const config = require('../config/env');

let cachedPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (!cachedPromise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    };

    cachedPromise = mongoose
      .connect(config.mongoUri, opts)
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

