import { Router, Request, Response } from 'express';
import { db } from '../../database/store';

const router = Router();

export interface CareContext {
  id: string;
  patientId: string;
  careContextReference: string;
  display: string;
  programType: 'CHRONIC_CARE' | 'DIAGNOSTIC_EPISODE' | 'ACUTE_ILLNESS' | 'ANNUAL_CHECKUP';
  hipFacilityName: string;
  createdDate: string;
  status: 'ACTIVE' | 'ARCHIVED';
  linkedDocumentIds: string[];
}

export interface ABDMConsentArtifact {
  id: string;
  patientId: string;
  patientAbhaId: string;
  hiuId: string;
  hiuName: string;
  requesterName: string;
  purposeCode: 'CAREST' | 'BTG' | 'PUBHLTH' | 'DSRCH';
  purposeText: 'Care Management & Treatment Plan Review';
  hiTypes: ('DiagnosticReport' | 'Prescription' | 'DischargeSummary' | 'OPConsultation')[];
  dateRange: {
    from: string;
    to: string;
  };
  consentStatus: 'GRANTED' | 'REVOKED' | 'EXPIRED';
  grantedAt: string;
  expiresAt: string;
  dataEraseAt: string;
}

// In-Memory ABDM Store seeded for Rahul Sharma (MED-00010001)
const careContextsStore: CareContext[] = [
  {
    id: 'cc-001',
    patientId: 'pat-demo-001',
    careContextReference: 'CC-2023-GASTRO',
    display: 'Episode: Acute Gastroenteritis & Hydration Panel (Jul 2023)',
    programType: 'ACUTE_ILLNESS',
    hipFacilityName: 'Fortis Hospital, Delhi',
    createdDate: '2023-07-14',
    status: 'ARCHIVED',
    linkedDocumentIds: ['doc-002']
  },
  {
    id: 'cc-002',
    patientId: 'pat-demo-001',
    careContextReference: 'CC-2024-VITD-DEF',
    display: 'Episode: Vitamin D Deficiency & Bone Metabolism (Mar - Sep 2024)',
    programType: 'DIAGNOSTIC_EPISODE',
    hipFacilityName: 'Dr. Lal PathLabs & Apollo Clinic',
    createdDate: '2024-03-12',
    status: 'ARCHIVED',
    linkedDocumentIds: ['doc-001', 'doc-004']
  },
  {
    id: 'cc-003',
    patientId: 'pat-demo-001',
    careContextReference: 'CC-2024-BRONCH',
    display: 'Episode: Acute Viral Bronchitis & Pulmonary Recovery (Aug 2024)',
    programType: 'ACUTE_ILLNESS',
    hipFacilityName: 'Max Healthcare, Delhi',
    createdDate: '2024-08-15',
    status: 'ARCHIVED',
    linkedDocumentIds: ['doc-003']
  },
  {
    id: 'cc-004',
    patientId: 'pat-demo-001',
    careContextReference: 'CC-2025-T2D-METAB',
    display: 'Longitudinal Program: Type 2 Diabetes & Cardiometabolic Management (2025-2026)',
    programType: 'CHRONIC_CARE',
    hipFacilityName: 'Apollo Hospitals & Metropolis Healthcare',
    createdDate: '2025-01-10',
    status: 'ACTIVE',
    linkedDocumentIds: ['doc-005', 'doc-006', 'doc-007', 'doc-008', 'doc-009', 'doc-010', 'doc-011', 'doc-012', 'doc-013', 'doc-014']
  }
];

const consentArtifactsStore: ABDMConsentArtifact[] = [
  {
    id: 'CONSENT-MED-9921',
    patientId: 'pat-demo-001',
    patientAbhaId: '91-8822-1004-9021',
    hiuId: 'HIU-APOLLO-001',
    hiuName: 'Apollo Health City (Internal Medicine Department)',
    requesterName: 'Dr. Alok Sen, MD (Treating Physician)',
    purposeCode: 'CAREST',
    purposeText: 'Care Management & Treatment Plan Review',
    hiTypes: ['DiagnosticReport', 'Prescription', 'OPConsultation'],
    dateRange: {
      from: '2023-01-01',
      to: '2026-12-31'
    },
    consentStatus: 'GRANTED',
    grantedAt: '2026-07-15T10:30:00Z',
    expiresAt: '2027-07-15T10:30:00Z',
    dataEraseAt: '2027-07-20T00:00:00Z'
  }
];

// GET /api/v1/abdm/care-contexts/:patientId
router.get('/care-contexts/:patientId', (req: Request, res: Response) => {
  const { patientId } = req.params;
  const contexts = careContextsStore.filter(c => c.patientId === patientId);

  return res.json({
    success: true,
    data: {
      patientId,
      totalContexts: contexts.length,
      activeContexts: contexts.filter(c => c.status === 'ACTIVE').length,
      contexts
    }
  });
});

// GET /api/v1/abdm/consents/:patientId
router.get('/consents/:patientId', (req: Request, res: Response) => {
  const { patientId } = req.params;
  const consents = consentArtifactsStore.filter(c => c.patientId === patientId);

  return res.json({
    success: true,
    data: {
      patientId,
      totalConsents: consents.length,
      activeConsents: consents.filter(c => c.consentStatus === 'GRANTED').length,
      consents
    }
  });
});

// POST /api/v1/abdm/consents/:consentId/revoke
router.post('/consents/:consentId/revoke', (req: Request, res: Response) => {
  const { consentId } = req.params;
  const artifact = consentArtifactsStore.find(c => c.id === consentId);

  if (!artifact) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Consent artifact not found.' }
    });
  }

  artifact.consentStatus = 'REVOKED';

  return res.json({
    success: true,
    data: {
      consentId,
      consentStatus: 'REVOKED',
      revokedAt: new Date().toISOString(),
      message: 'ABDM Consent successfully revoked by patient. Clinical access terminated.'
    }
  });
});

// GET /api/v1/abdm/meds-stream/:patientId
// Medical Event Data Standard (MEDS) format (Stanford/MIT community EHR standard)
router.get('/meds-stream/:patientId', (req: Request, res: Response) => {
  const { patientId } = req.params;
  const patient = db.patients.find(p => p.id === patientId);

  if (!patient) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Patient not found.' }
    });
  }

  const events: any[] = [];

  // 1. Diagnosis Events
  const conditions = db.conditions.filter(c => c.patientId === patientId);
  conditions.forEach(c => {
    events.push({
      subject_id: patient.healthId,
      time: `${c.firstDocumentedDate}T09:00:00Z`,
      code: `SNOMED//${c.conditionCode}`,
      code_description: c.conditionName,
      event_type: 'CONDITION_ONSET',
      numeric_value: null,
      unit: null
    });

    if (c.resolvedDate) {
      events.push({
        subject_id: patient.healthId,
        time: `${c.resolvedDate}T17:00:00Z`,
        code: `SNOMED//${c.conditionCode}//RESOLVED`,
        code_description: `${c.conditionName} (Resolved)`,
        event_type: 'CONDITION_RESOLUTION',
        numeric_value: null,
        unit: null
      });
    }
  });

  // 2. Quantitative Observation Events (LOINC Coded)
  const labs = db.labResults.filter(l => l.patientId === patientId);
  labs.forEach(l => {
    events.push({
      subject_id: patient.healthId,
      time: `${l.observedDate}T08:00:00Z`,
      code: `LOINC//${l.parameterCode}`,
      code_description: l.parameterName,
      event_type: 'LAB_OBSERVATION',
      numeric_value: l.numericValue,
      unit: l.rawUnit,
      flag: l.flag
    });
  });

  // Sort chronologically
  events.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  return res.json({
    success: true,
    data: {
      standard: 'Medical Event Data Standard (MEDS v0.3)',
      subject_id: patient.healthId,
      total_events: events.length,
      events
    }
  });
});

export default router;
