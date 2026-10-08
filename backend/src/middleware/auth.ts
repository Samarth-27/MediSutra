import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config';

export interface AuthenticatedUser {
  userId: string;
  patientId?: string;
  doctorId?: string;
  email: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Access token missing or invalid.' }
    });
  }

  try {
    const decoded = jwt.verify(token, CONFIG.JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Token is invalid or expired.' }
    });
  }
};

export const requireRole = (allowedRoles: Array<'PATIENT' | 'DOCTOR' | 'ADMIN'>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient role permissions for this endpoint.' }
      });
    }
    next();
  };
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, CONFIG.JWT_SECRET) as AuthenticatedUser;
      req.user = decoded;
    } catch {
      // Ignore invalid token in optional auth
    }
  }
  next();
};

