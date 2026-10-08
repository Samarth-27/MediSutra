import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'medisutra-dev-jwt-secret-key-2026-secure',
  JWT_EXPIRES_IN: '7d',
  ENV: process.env.NODE_ENV || 'development',
  STORAGE_DIR: process.env.STORAGE_DIR || './storage/vault',
};
