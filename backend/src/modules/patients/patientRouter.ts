import { Router, Request, Response } from 'express';
import { db } from '../../database/store';
import { authenticateToken } from '../../middleware/auth';

const router = Router();

// GET /api/v1/patients/me
router.get('/me', authenticateToken, (req: Request, res: Response) => {
  const patientId = req.user?.patientId;
  const patient = db.patients.find(p => p.id === patientId);

  if (!patient) {
    return res.status(404).json({
      success: false,
      error: { code: 'PATIENT_NOT_FOUND', message: 'No patient profile associated with this account.' }
    });
  }

  // Calculate longitudinal aggregates
  const activeConditions = db.conditions.filter(c => c.patientId === patient.id && c.currentStatus !== 'RESOLVED');
  const resolvedConditions = db.conditions.filter(c => c.patientId === patient.id && c.currentStatus === 'RESOLVED');
  const documents = db.documents.filter(d => d.patientId === patient.id);
  const events = db.healthEvents.filter(e => e.patientId === patient.id);

  return res.json({
    success: true,
    data: {
      patient,
      stats: {
        activeConditionsCount: activeConditions.length,
        resolvedConditionsCount: resolvedConditions.length,
        totalDocumentsCount: documents.length,
        totalEventsCount: events.length
      },
      activeConditions: activeConditions.map(c => ({
        id: c.id,
        name: c.conditionName,
        status: c.currentStatus,
        bodySystem: c.bodySystem,
        firstDocumentedDate: c.firstDocumentedDate
      }))
    }
  });
});

// PUT /api/v1/patients/me
router.put('/me', authenticateToken, (req: Request, res: Response) => {
  const patientId = req.user?.patientId;
  const patient = db.patients.find(p => p.id === patientId);

  if (!patient) {
    return res.status(404).json({
      success: false,
      error: { code: 'PATIENT_NOT_FOUND', message: 'No patient profile found.' }
    });
  }

  const { allergies, emergencyContact, bloodGroup } = req.body;
  if (allergies) patient.allergies = allergies;
  if (emergencyContact) patient.emergencyContact = emergencyContact;
  if (bloodGroup) patient.bloodGroup = bloodGroup;

  return res.json({
    success: true,
    data: patient
  });
});

export default router;
