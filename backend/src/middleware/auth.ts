import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config';

export const UserRole = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  ADMIN: 'ADMIN',
  HOSPITAL_ADMIN: 'HOSPITAL_ADMIN'
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface AuthenticatedUser {
  userId: string;
  patientId?: string;
  doctorId?: string;
  doctorName?: string;
  hospitalId?: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Strict JWT Verification Middleware
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required. Missing Bearer token.' }
    });
  }

  try {
    const decoded = jwt.verify(token, CONFIG.JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err: any) {
    const isExpired = err?.name === 'TokenExpiredError';
    return res.status(403).json({
      success: false,
      error: {
        code: isExpired ? 'TOKEN_EXPIRED' : 'FORBIDDEN',
        message: isExpired ? 'Session expired. Please log in again.' : 'Invalid authentication token.'
      }
    });
  }
};

import { db } from '../database/store';

/**
 * Role-Based Access Control (RBAC) Guard
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        try {
          req.user = jwt.verify(token, CONFIG.JWT_SECRET) as AuthenticatedUser;
        } catch {
          return res.status(401).json({
            success: false,
            error: { code: 'TOKEN_INVALID', message: 'Invalid or expired authentication token.' }
          });
        }
      }
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required for privileged operations.' }
      });
    }

    const effectiveRole = req.user.role;
    const hasRole = allowedRoles.includes(effectiveRole);

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN_PRIVILEGE',
          message: `Access Denied: Requires one of [${allowedRoles.join(', ')}] role privileges.`
        }
      });
    }

    next();
  };
};

/**
 * Require Clinical Healthcare Practitioner or Hospital Admin
 */
export const requireClinicalStaff = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, CONFIG.JWT_SECRET) as AuthenticatedUser;
        req.user = decoded;
      } catch {
        return res.status(401).json({
          success: false,
          error: {
            code: 'TOKEN_INVALID',
            message: 'Invalid or expired session token.'
          }
        });
      }
    }
  }

  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_REQUIRED',
        message: 'Authentication token is required to access clinical operations.'
      }
    });
  }

  const userRole = req.user.role;
  const isAuthorized = 
    userRole === UserRole.DOCTOR || 
    userRole === UserRole.ADMIN || 
    userRole === UserRole.HOSPITAL_ADMIN;

  if (!isAuthorized) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'CLINICAL_PRIVILEGE_REQUIRED',
        message: 'This action is restricted to licensed clinical practitioners and hospital administrators.'
      }
    });
  }

  next();
};

/**
 * Protect against IDOR (Insecure Direct Object Reference)
 * Ensures citizen patients can ONLY read/write their own records,
 * while allowing authorized clinical staff access.
 */
export const requirePatientOrClinicalStaff = (paramKey = 'patientId') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const targetPatientId = req.params[paramKey] || req.body?.[paramKey] || req.query?.[paramKey];

    if (!req.user) {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, CONFIG.JWT_SECRET) as AuthenticatedUser;
          req.user = decoded;
        } catch {
          return res.status(401).json({
            success: false,
            error: {
              code: 'TOKEN_INVALID',
              message: 'Invalid or expired authorization token.'
            }
          });
        }
      }
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_REQUIRED',
          message: 'Authentication required to access patient records.'
        }
      });
    }

    const user = req.user;
    const isClinical = 
      user.role === UserRole.DOCTOR || 
      user.role === UserRole.ADMIN || 
      user.role === UserRole.HOSPITAL_ADMIN;

    if (isClinical) {
      return next();
    }

    if (user.role === UserRole.PATIENT && targetPatientId) {
      const isMatch = 
        user.patientId === targetPatientId || 
        user.userId === targetPatientId || 
        user.patientId?.toLowerCase() === targetPatientId.toLowerCase() ||
        db.patients.some(p => p.id === user.patientId && p.healthId.toLowerCase() === targetPatientId.toLowerCase());

      if (!isMatch) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN_TENANT_ACCESS',
            message: `Cross-tenant access violation: You cannot access or modify records of patient '${targetPatientId}'.`
          }
        });
      }
    }

    next();
  };
};

/**
 * Optional Authentication (parses token if present, proceeds if absent)
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, CONFIG.JWT_SECRET) as AuthenticatedUser;
      req.user = decoded;
    } catch {
      // Ignore token decode errors in optional auth
    }
  }
  next();
};

/**
 * Require Doctor-Patient Assignment Isolation
 * Guarantees that licensed physicians can ONLY inspect & manage patients explicitly
 * assigned under their care roster, preventing unauthorized medical snooping.
 */
export const requireDoctorPatientAssignment = (paramKey = 'id') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const targetPatientId = req.params[paramKey] || req.body?.[paramKey] || req.query?.[paramKey];

    if (!req.user) {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        try {
          req.user = jwt.verify(token, CONFIG.JWT_SECRET) as AuthenticatedUser;
        } catch {
          return res.status(401).json({
            success: false,
            error: { code: 'TOKEN_INVALID', message: 'Invalid or expired authorization token.' }
          });
        }
      }
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTHENTICATION_REQUIRED', message: 'Authentication required.' }
      });
    }

    const user = req.user;

    // Platform ADMIN has overarching audit privileges
    if (user.role === UserRole.ADMIN) {
      return next();
    }

    // Resolve target patient record
    const patient = db.patients.find(p => 
      p.id === targetPatientId || 
      p.healthId.toLowerCase() === targetPatientId?.toLowerCase()
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: { code: 'PATIENT_NOT_FOUND', message: `Patient '${targetPatientId}' not found.` }
      });
    }

    // Citizen access: Patients may only access their own record
    if (user.role === UserRole.PATIENT) {
      const isSelf = 
        user.patientId === patient.id || 
        user.userId === patient.userId ||
        db.patients.some(p => p.id === user.patientId && p.id === patient.id);

      if (!isSelf) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN_TENANT_ACCESS',
            message: 'Cross-tenant access violation: Citizens may only access their own health records.'
          }
        });
      }
      return next();
    }

    // Doctor access: Strict roster check
    if (user.role === UserRole.DOCTOR) {
      const docId = user.doctorId;
      const docName = user.doctorName?.toLowerCase();

      const isAssigned = 
        (docId && (patient.assignedDoctorId === docId || patient.assignedDoctorIds?.includes(docId))) ||
        (docName && patient.assignedDoctorName?.toLowerCase() === docName) ||
        (docName && db.healthEvents.some(e => e.patientId === patient.id && e.attendingDoctor?.toLowerCase() === docName));

      if (!isAssigned) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN_DOCTOR_PATIENT_ACCESS',
            message: `Access Denied: Patient '${patient.fullName}' (${patient.healthId}) is not assigned under your clinical roster. You cannot inspect or modify unassigned patient records.`
          }
        });
      }

      return next();
    }

    // Hospital Admin access: Facility boundary check
    if (user.role === UserRole.HOSPITAL_ADMIN) {
      const hospId = user.hospitalId;
      if (hospId && patient.assignedHospitalId && patient.assignedHospitalId !== hospId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN_HOSPITAL_ACCESS',
            message: 'Access Denied: Patient is not affiliated with your hospital facility.'
          }
        });
      }
      return next();
    }

    next();
  };
};
