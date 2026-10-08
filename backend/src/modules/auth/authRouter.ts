import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db, User, Patient } from '../../database/store';
import { CONFIG } from '../../config';
import { authenticateToken } from '../../middleware/auth';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', (req: Request, res: Response) => {
  const { email, password, role = 'PATIENT', fullName, dob, gender, bloodGroup } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_INPUT', message: 'Email, password, and full name are required.' }
    });
  }

  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({
      success: false,
      error: { code: 'USER_EXISTS', message: 'An account with this email already exists.' }
    });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);
  const userId = `usr-${uuidv4()}`;

  const newUser: User = {
    id: userId,
    email: email.toLowerCase(),
    passwordHash,
    role: role as 'PATIENT' | 'DOCTOR' | 'ADMIN',
    createdAt: new Date().toISOString()
  };
  db.users.push(newUser);

  let newPatient: Patient | undefined;
  if (newUser.role === 'PATIENT') {
    // Generate sequential unique Health ID e.g. MED-00010002
    const nextSeq = 10000 + db.patients.length + 1;
    const healthId = `MED-000${nextSeq}`;
    
    newPatient = {
      id: `pat-${uuidv4()}`,
      userId: newUser.id,
      healthId,
      fullName,
      dob: dob || '1990-01-01',
      gender: gender || 'Unspecified',
      bloodGroup: bloodGroup || 'O+',
      allergies: [],
      emergencyContact: { name: '', phone: '', relationship: '' },
      baselineHistory: {},
      createdAt: new Date().toISOString()
    };
    db.patients.push(newPatient);
  }

  const token = jwt.sign(
    {
      userId: newUser.id,
      patientId: newPatient?.id,
      email: newUser.email,
      role: newUser.role
    },
    CONFIG.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.status(201).json({
    success: true,
    data: {
      user: { id: newUser.id, email: newUser.email, role: newUser.role },
      patient: newPatient,
      token
    }
  });
});

// POST /api/v1/auth/login
router.post('/login', (req: Request, res: Response) => {
  const { email, password, identifier } = req.body;
  const query = (identifier || email || '').toLowerCase().trim();

  if (!query) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Email or Health ID identifier is required.' }
    });
  }

  // Find by user email or patient health ID
  let user = db.users.find(u => u.email.toLowerCase() === query);
  let patient: Patient | undefined;

  if (!user) {
    patient = db.patients.find(p => 
      p.healthId.toLowerCase() === query || 
      p.id.toLowerCase() === query ||
      p.fullName.toLowerCase().includes(query)
    );
    if (patient) {
      user = db.users.find(u => u.id === patient?.userId) || db.users[0];
    }
  } else if (user) {
    patient = db.patients.find(p => p.userId === user?.id);
  }

  if (!user) {
    return res.status(401).json({
      success: false,
      error: { code: 'AUTHENTICATION_FAILED', message: 'Invalid credentials or health ID.' }
    });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      patientId: patient?.id,
      email: user.email,
      role: user.role
    },
    CONFIG.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    success: true,
    data: {
      user: { id: user.id, email: user.email, role: user.role },
      patient: patient || db.patients[0],
      token
    }
  });
});

// POST /api/v1/auth/citizen/login - Dedicated Citizen DigiLocker Login by UHID / ABHA / Mobile OTP
router.post('/citizen/login', (req: Request, res: Response) => {
  const { identifier, healthId, uhid } = req.body;
  const query = (identifier || healthId || uhid || 'MED-00010001').toLowerCase().trim();

  const patient = db.patients.find(p => 
    p.id.toLowerCase() === query ||
    p.healthId.toLowerCase() === query ||
    p.fullName.toLowerCase().includes(query)
  ) || db.patients[0];

  const token = jwt.sign(
    {
      userId: patient.userId || 'usr-demo-001',
      patientId: patient.id,
      email: `${patient.healthId.toLowerCase()}@medisutra.in`,
      role: 'PATIENT'
    },
    CONFIG.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    success: true,
    data: {
      role: 'CITIZEN',
      patient,
      token,
      message: `Citizen sovereign DigiLocker unlocked for ${patient.fullName} (${patient.healthId}).`
    }
  });
});

// GET /api/v1/auth/me
router.get('/me', authenticateToken, (req: Request, res: Response) => {
  const user = db.users.find(u => u.id === req.user?.userId);
  if (!user) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found.' } });
  }

  const patient = db.patients.find(p => p.userId === user.id);

  return res.json({
    success: true,
    data: {
      user: { id: user.id, email: user.email, role: user.role },
      patient
    }
  });
});

export default router;
