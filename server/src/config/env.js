'use strict';
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from process cwd and explicitly from server/.env
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

module.exports = {
  port: parseInt(process.env.PORT, 10) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
    database: process.env.DB_NAME || 'airbnb_db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'solstice-sanctuary-jwt-secret-replace-in-production-please',
    expiresIn: '15m',
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

