import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { CONFIG } from './config';

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

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Dedicated Cloud & Render Health Check Endpoints
const healthPayload = {
  status: 'online',
  platform: 'MediSutra Longitudinal Personal Health Intelligence Platform',
  version: '1.0.0',
  environment: CONFIG.ENV
};
app.get('/health', (req, res) => res.json({ ...healthPayload, timestamp: new Date().toISOString() }));
app.get('/api/health', (req, res) => res.json({ ...healthPayload, timestamp: new Date().toISOString() }));
app.get('/api/v1/health', (req, res) => res.json({ ...healthPayload, timestamp: new Date().toISOString() }));

// API v1 Routes
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

// Locate frontend production build if present (for single-service Render deployments)
const possibleFrontendPaths = [
  path.resolve(__dirname, '../../frontend/dist'),
  path.resolve(__dirname, '../frontend/dist'),
  path.resolve(process.cwd(), 'frontend/dist'),
  path.resolve(process.cwd(), '../frontend/dist')
];
const frontendDistPath = possibleFrontendPaths.find(p => fs.existsSync(p));

if (frontendDistPath) {
  console.log(`[MediSutra] Serving static production frontend from: ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api/') || req.originalUrl === '/api') {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  // Root fallback if frontend not built alongside backend
  app.get('/', (req, res) => {
    res.json({
      ...healthPayload,
      timestamp: new Date().toISOString()
    });
  });
}

// Global 404 for unhandled API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.url} does not exist.` }
  });
});

// Central Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Server Error]:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred.'
    }
  });
});

app.listen(CONFIG.PORT, () => {
  console.log(`=======================================================`);
  console.log(` MediSutra Core API Gateway running on port ${CONFIG.PORT}`);
  console.log(` Base URL: http://localhost:${CONFIG.PORT}/api/v1`);
  console.log(` Environment: ${CONFIG.ENV}`);
  console.log(`=======================================================`);
});

export default app;
