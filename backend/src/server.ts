import express from 'express';
import path from 'path';
import fs from 'fs';
import { CONFIG } from './config';
import {
  securityHeaders,
  corsPolicy,
  apiRateLimiter,
  authRateLimiter,
  aiRateLimiter,
  sanitizeRequest
} from './middleware/security';

import authRouter from './modules/auth/authRouter';
import patientRouter from './modules/patients/patientRouter';
import documentRouter from './modules/documents/documentRouter';
import timelineRouter from './modules/timeline/timelineRouter';
import conditionRouter from './modules/conditions/conditionRouter';
import monitoringRouter from './modules/monitoring/monitoringRouter';
import analyticsRouter from './modules/analytics/analyticsRouter';
import aiRouter from './modules/ai/aiRouter';
import doctorRouter from './modules/doctor/doctorRouter';
import abdmRouter from './modules/abdm/abdmRouter';
import hospitalRouter from './modules/hospital/hospitalRouter';

const app = express();

// 1. Trust proxy for reverse proxies (Render, Cloudflare, AWS ALB)
app.set('trust proxy', 1);

// 2. HTTP Security Headers (Helmet, CSP, HSTS, NoSniff, Frameguard)
app.use(securityHeaders);

// 3. Strict CORS Origin Whitelist
app.use(corsPolicy);

// 4. Request Body Parsers with Strict Size Limits (DoS / Payload protection)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Anti-XSS & Prototype Pollution Input Sanitization
app.use(sanitizeRequest);

// 6. Request Logger (Sanitized)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (!CONFIG.IS_PRODUCTION || res.statusCode >= 400) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// 7. Dedicated Cloud & Render Health Check Endpoints (Exempt from rate limiting)
const healthPayload = {
  status: 'online',
  platform: 'MediSutra Longitudinal Personal Health Intelligence Platform',
  version: '1.0.0',
  environment: CONFIG.ENV
};
app.get('/health', (req, res) => res.json({ ...healthPayload, timestamp: new Date().toISOString() }));
app.get('/api/health', (req, res) => res.json({ ...healthPayload, timestamp: new Date().toISOString() }));
app.get('/api/v1/health', (req, res) => res.json({ ...healthPayload, timestamp: new Date().toISOString() }));

// 8. General API Rate Limiting
app.use('/api/', apiRateLimiter);

// 9. Strict Rate Limiting on Authentication Endpoints (Brute-Force & Credential Stuffing Defense)
app.use('/api/v1/auth/login', authRateLimiter);
app.use('/api/v1/auth/register', authRateLimiter);
app.use('/api/v1/auth/citizen/login', authRateLimiter);
app.use('/api/v1/hospitals/login', authRateLimiter);
app.use('/api/v1/hospitals/doctor/login', authRateLimiter);

// 10. Dedicated Rate Limiting on Clinical AI Inference
app.use('/api/v1/ai', aiRateLimiter);

// 11. API v1 Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/patients', patientRouter);
app.use('/api/v1/documents', documentRouter);
app.use('/api/v1/timeline', timelineRouter);
app.use('/api/v1/conditions', conditionRouter);
app.use('/api/v1/monitoring', monitoringRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/doctor', doctorRouter);
app.use('/api/v1/abdm', abdmRouter);
app.use('/api/v1/hospitals', hospitalRouter);

// 12. Locate frontend production build if present (for single-service Render deployments)
const possibleFrontendPaths = [
  path.resolve(__dirname, '../../frontend/dist'),
  path.resolve(__dirname, '../frontend/dist'),
  path.resolve(process.cwd(), 'frontend/dist'),
  path.resolve(process.cwd(), '../frontend/dist')
];
const frontendDistPath = possibleFrontendPaths.find(p => fs.existsSync(p));

if (frontendDistPath) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api/') || req.originalUrl === '/api') {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      ...healthPayload,
      timestamp: new Date().toISOString()
    });
  });
}

// 13. Global 404 for unhandled API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.url} does not exist.` }
  });
});

// 14. Central Production Error Handler (Zero Debug Leaks)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Server Security/Error Event]:', err?.message || err);

  const statusCode = err?.status || err?.statusCode || 500;
  const safeMessage = CONFIG.IS_PRODUCTION && statusCode >= 500
    ? 'An internal server error occurred. Please contact system administration.'
    : (err?.message || 'An unexpected error occurred.');

  res.status(statusCode).json({
    success: false,
    error: {
      code: err?.code || 'INTERNAL_SERVER_ERROR',
      message: safeMessage
    }
  });
});

// 15. Process-level safety against unhandled failures
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection at]:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[Uncaught Exception]:', error);
});

app.listen(CONFIG.PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(` MediSutra Core API Gateway running on port ${CONFIG.PORT}`);
  console.log(` Base URL: http://localhost:${CONFIG.PORT}/api/v1`);
  console.log(` Environment: ${CONFIG.ENV} (Production Mode: ${CONFIG.IS_PRODUCTION})`);
  console.log(` Security: Helmet CSP ON, Rate Limiting ON, CORS ON`);
  console.log(`=======================================================`);
});

export default app;
