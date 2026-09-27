'use strict';
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from process cwd and explicitly from server/.env
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const DEFAULT_ATLAS_URI = 'mongodb+srv://yashmodi622:YashMongo_026mk@cluster0.vguyv.mongodb.net/airbnb_db';

const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoHost = process.env.MONGO_HOST;
const mongoDb = process.env.MONGO_DB || 'airbnb_db';

let mongoUri = process.env.MONGODB_URI;
if (!mongoUri && mongoUser && mongoPassword && mongoHost) {
  mongoUri = `mongodb+srv://${mongoUser}:${mongoPassword}@${mongoHost}/${mongoDb}`;
}

const isProductionOrVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';
const finalMongoUri = mongoUri || (isProductionOrVercel ? DEFAULT_ATLAS_URI : 'mongodb://localhost:27017/airbnb_db');

module.exports = {
  port: parseInt(process.env.PORT, 10) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUser,
  mongoPassword,
  mongoHost,
  mongoDb,
  mongoUri: finalMongoUri,
  jwt: {
    secret: process.env.JWT_SECRET || 'solstice-sanctuary-jwt-secret-replace-in-production-please',
    expiresIn: '3h',
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};



