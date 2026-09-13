'use strict';
const mysql = require('mysql2/promise');
const config = require('../config/env');

const poolConfig = {
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
};

if (process.env.DB_SSL === 'true' || (process.env.NODE_ENV === 'production' && config.db.host !== 'localhost' && config.db.host !== '127.0.0.1')) {
  poolConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const pool = mysql.createPool(poolConfig);

module.exports = pool;

