import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db, DoctorClinicalNote } from '../../database/store';

const router = Router();

// GET /api/v1/doctor/patients - Patient Roster for Doctors
router.get('/patients', (req: Request, res: Response) => {
  // Aggregate roster with clinical intelligence stats
  const roster = db.patients.map(p => {
    const pConditions = db.conditions.filter(c => c.patientId === p.id);
    const pDocs = db.documents.filter(d => d.patientId === p.id);
    const pActiveConds = pConditions.filter(c => c.currentStatus !== 'RESOLVED');
    const pResolvedConds = pConditions.filter(c => c.currentStatus === 'RESOLVED');

    return {
      id: p.id,
      healthId: p.healthId,
      fullName: p.fullName,
      dob: p.dob,
      gender: p.gender,
      bloodGroup: p.bloodGroup,
      allergies: p.allergies,
      riskLevel: p.riskLevel || 'MODERATE',
      lastEncounterDate: p.lastEncounterDate || '2026-07-15',
      activeConditionsCount: pActiveConds.length,
      resolvedConditionsCount: pResolvedConds.length,
      totalReportsCount: pDocs.length,
      activeConditionsSummary: pActiveConds.map(c => c.conditionName),
      resolvedConditionsSummary: pResolvedConds.map(c => c.conditionName)
    };
  });

  return res.json({
    success: true,
    data: roster
  });
});

// GET /api/v1/doctor/patients/:id/dossier - Complete Longitudinal Clinical Dossier
router.get('/patients/:id/dossier', (req: Request, res: Response) => {
  const { id } = req.params;
  const patient = db.patients.find(p => p.id === id);

  if (!patient) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Patient not found in clinical database.' }
    });
  }

  // 1. All Conditions (Active + Past Resolved Diseases)
  const allConditions = db.conditions.filter(c => c.patientId === patient.id);
  const activeConditions = allConditions.filter(c => c.currentStatus !== 'RESOLVED');
  const pastResolvedDiseases = allConditions.filter(c => c.currentStatus === 'RESOLVED');

  // 2. All Previous Reports Grouped by Year
  const allReports = db.documents
    .filter(d => d.patientId === patient.id)
    .sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime());

  const reportsByYear: Record<string, any[]> = {};
  allReports.forEach(doc => {
    const year = doc.reportDate ? doc.reportDate.split('-')[0] : 'Historical';
    if (!reportsByYear[year]) reportsByYear[year] = [];
    
    // Attach extracted lab values for doctor inspection
    const extractedLabs = db.labResults.filter(l => l.sourceDocumentId === doc.id);
    reportsByYear[year].push({
      ...doc,
      extractedLabs
    });
  });

  // 3. Clinical Timeline
  const events = db.healthEvents
    .filter(e => e.patientId === patient.id)
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());

  // 4. Lab Results Time-Series for Key Parameters
  const keyParameters = ['HBA1C', 'GLU_FAST', 'VIT_D', 'CREATININE', 'WBC'];
  const labTrends: Record<string, any[]> = {};
  keyParameters.forEach(param => {
    labTrends[param] = db.labResults
      .filter(l => l.patientId === patient.id && l.parameterCode === param)
      .sort((a, b) => new Date(a.observedDate).getTime() - new Date(b.observedDate).getTime());
  });

  // 5. Checkpoints
  const checkpoints = db.checkpoints.filter(chk => {
    const cond = db.conditions.find(c => c.id === chk.conditionId);
    return cond?.patientId === patient.id;
  });

  // 6. Doctor Clinical Notes
  const doctorNotes = db.clinicalNotes
    .filter(n => n.patientId === patient.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return res.json({
    success: true,
    data: {
      patient,
      clinicalOverview: {
        activeConditions,
        pastResolvedDiseases,
        totalLifetimeDiseasesCount: allConditions.length,
        totalPreviousReportsCount: allReports.length
      },
      reportsByYear,
      allReports,
      events,
      labTrends,
      checkpoints,
      doctorNotes
    }
  });
});

// PUT /api/v1/doctor/patients/:id/conditions/:condId/status - Update Condition Status
router.put('/patients/:id/conditions/:condId/status', (req: Request, res: Response) => {
  const { id, condId } = req.params;
  const { newStatus, clinicalNote, doctorName = 'Dr. Alok Sen, MD' } = req.body;

  const condition = db.conditions.find(c => c.id === condId && c.patientId === id);
  if (!condition) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Condition not found for this patient.' }
    });
  }

  const oldStatus = condition.currentStatus;
  condition.currentStatus = newStatus;
  if (newStatus === 'RESOLVED') {
    condition.resolvedDate = new Date().toISOString().split('T')[0];
  }

  if (clinicalNote) {
    const newNote: DoctorClinicalNote = {
      id: `note-${uuidv4().slice(0, 8)}`,
      patientId: id,
      doctorName,
      doctorSpecialization: 'Internal Medicine',
      date: new Date().toISOString().split('T')[0],
      content: `Condition '${condition.conditionName}' status updated from ${oldStatus} to ${newStatus}. Note: ${clinicalNote}`,
      assessmentType: 'CONDITION_STATUS_UPDATE'
    };
    db.clinicalNotes.unshift(newNote);
  }

  return res.json({
    success: true,
    data: {
      condition,
      message: `Condition status updated to ${newStatus} with clinical notes recorded.`
    }
  });
});

// POST /api/v1/doctor/patients/:id/notes - Add Clinical Consultation Note
router.post('/patients/:id/notes', (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, assessmentType = 'ROUTINE_REVIEW', doctorName = 'Dr. Alok Sen, MD', doctorSpecialization = 'Internal Medicine' } = req.body;

  if (!content) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_INPUT', message: 'Note content is required.' }
    });
  }

  const newNote: DoctorClinicalNote = {
    id: `note-${uuidv4().slice(0, 8)}`,
    patientId: id,
    doctorName,
    doctorSpecialization,
    date: new Date().toISOString().split('T')[0],
    content,
    assessmentType
  };
  db.clinicalNotes.unshift(newNote);

  return res.status(201).json({
    success: true,
    data: newNote
  });
});

// GET /api/v1/doctor/patients/:id/fhir-export - Export Full Longitudinal HL7 FHIR R4 Bundle
router.get('/patients/:id/fhir-export', (req: Request, res: Response) => {
  const { id } = req.params;
  const patient = db.patients.find(p => p.id === id);

  if (!patient) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Patient not found in clinical database.' }
    });
  }

  try {
    const { FHIRAdapter } = require('./fhirAdapter');
    const fhirBundle = FHIRAdapter.exportPatientBundle(id);
    return res.json({
      success: true,
      data: fhirBundle
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'FHIR_EXPORT_FAILED', message: error.message }
    });
  }
});

// GET /api/v1/doctor/patients/:id/graph - Temporal Clinical Knowledge Graph
router.get('/patients/:id/graph', (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { ClinicalGraphEngine } = require('../ai/clinicalGraph');
    const graph = ClinicalGraphEngine.buildPatientGraph(id);
    return res.json({
      success: true,
      data: graph
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'GRAPH_BUILD_FAILED', message: error.message }
    });
  }
});

// GET /api/v1/doctor/patients/:id/conditions/:condId/trajectory - Deterministic Condition Trajectory
router.get('/patients/:id/conditions/:condId/trajectory', (req: Request, res: Response) => {
  const { id, condId } = req.params;
  try {
    const { ClinicalGraphEngine } = require('../ai/clinicalGraph');
    const trajectory = ClinicalGraphEngine.traceConditionTrajectory(id, condId);
    if (!trajectory) {
      return res.status(404).json({
        success: false,
        error: { code: 'TRAJECTORY_NOT_FOUND', message: 'Condition not found for trajectory tracing.' }
      });
    }
    return res.json({
      success: true,
      data: trajectory
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'TRAJECTORY_FAILED', message: error.message }
    });
  }
});

// GET /api/v1/doctor/patients/:id/resolved-history - Verified Resolved Diseases Summary
router.get('/patients/:id/resolved-history', (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { ClinicalGraphEngine } = require('../ai/clinicalGraph');
    const resolvedSummary = ClinicalGraphEngine.getResolvedDiseasesSummary(id);
    return res.json({
      success: true,
      data: resolvedSummary
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'RESOLVED_HISTORY_FAILED', message: error.message }
    });
  }
});

export default router;
