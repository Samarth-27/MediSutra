import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { CONFIG } from '../config';

// ===================================================================
// 1. HTTP Security Headers (Helmet)
// ===================================================================
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'", ...CONFIG.CORS_ORIGINS, "https://api.github.com", "ws:", "wss:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: CONFIG.IS_PRODUCTION ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: false, // Allows cross-origin assets for healthcare dashboards
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' }, // Prevents clickjacking
  hidePoweredBy: true, // Strips 'X-Powered-By: Express' signature
  hsts: CONFIG.IS_PRODUCTION ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
  ieNoOpen: true,
  noSniff: true, // Prevents MIME-type sniffing
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
});

// ===================================================================
// 2. Strict CORS Configuration
// ===================================================================
export const corsPolicy = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/$/, '');

    // In development mode, allow localhost and LAN IP origins
    if (!CONFIG.IS_PRODUCTION) {
      if (
        normalizedOrigin.startsWith('http://localhost:') ||
        normalizedOrigin.startsWith('http://127.0.0.1:') ||
        normalizedOrigin.startsWith('http://192.168.') ||
        CONFIG.CORS_ORIGINS.includes(normalizedOrigin)
      ) {
        return callback(null, true);
      }
    }

    // In production, strictly match trusted whitelist
    if (CONFIG.CORS_ORIGINS.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    // Render deployment URL matching (e.g. *.onrender.com)
    if (normalizedOrigin.endsWith('.onrender.com')) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked: Origin '${origin}' is not authorized.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-role',
    'x-requested-with',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours preflight cache
});

// ===================================================================
// 3. Adaptive Rate Limiting
// ===================================================================

// General API Rate Limiter
export const apiRateLimiter = rateLimit({
  windowMs: CONFIG.RATE_LIMIT_WINDOW_MS,
  max: CONFIG.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP address. Please retry after a few minutes.'
    }
  }
});

// Strict Rate Limiter for Authentication Endpoints (Brute-Force & Credential Stuffing Defense)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: CONFIG.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts from this IP address. Account access temporarily throttled.'
    }
  }
});

// Dedicated Rate Limiter for Heavy AI & Clinical Inference Queries
export const aiRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: CONFIG.AI_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'AI_RATE_LIMIT_EXCEEDED',
      message: 'High AI compute load. Please wait before submitting additional clinical queries.'
    }
  }
});

// ===================================================================
// 4. Input Sanitization & Anti-XSS / Anti-Prototype Pollution Middleware
// ===================================================================

const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/gi,
  /on\w+\s*=\s*["'][^"']*["']/gi,
  /on\w+\s*=\s*[^>\s]+/gi,
  /<iframe\b[^>]*>/gi,
  /<object\b[^>]*>/gi,
  /<embed\b[^>]*>/gi
];

function sanitizeString(str: string): string {
  let cleaned = str;
  for (const pattern of DANGEROUS_PATTERNS) {
    cleaned = cleaned.replace(pattern, '');
  }
  return cleaned;
}

export function sanitizePayload(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizePayload(item));
  }

  if (typeof obj === 'object') {
    const sanitizedObj: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      // Prototype pollution defense
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      sanitizedObj[key] = sanitizePayload(obj[key]);
    }
    return sanitizedObj;
  }

  return obj;
}

export const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizePayload(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizePayload(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizePayload(req.params);
  }
  next();
};
