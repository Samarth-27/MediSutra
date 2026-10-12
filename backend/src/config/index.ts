import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = ENV === 'production';

// Strict validation of cryptographic secret in production
let jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  if (IS_PRODUCTION) {
    console.warn('[SECURITY WARNING]: JWT_SECRET was not supplied in production environment. Generating ephemeral cryptographic 256-bit key.');
    jwtSecret = crypto.randomBytes(32).toString('hex');
  } else {
    jwtSecret = 'medisutra-dev-jwt-secret-key-2026-secure';
  }
}

// Parse allowed CORS origins
const rawCorsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000,http://127.0.0.1:3000';
const parsedCorsOrigins = rawCorsOrigin
  .split(',')
  .map(origin => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

export const CONFIG = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  JWT_SECRET: jwtSecret,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  ENV,
  IS_PRODUCTION,
  CORS_ORIGINS: parsedCorsOrigins,
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) : 15 * 60 * 1000,
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : 300,
  AUTH_RATE_LIMIT_MAX: process.env.AUTH_RATE_LIMIT_MAX ? parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) : 20,
  AI_RATE_LIMIT_MAX: process.env.AI_RATE_LIMIT_MAX ? parseInt(process.env.AI_RATE_LIMIT_MAX, 10) : 60,
  STORAGE_DIR: process.env.STORAGE_DIR || './storage/vault',
};
