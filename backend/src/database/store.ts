import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  createdAt: string;
}

export interface Patient {
  id: string;
  userId: string;
  healthId: string; // e.g. MED-00010001
  fullName: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  allergies: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  baselineHistory: Record<string, any>;
  riskLevel?: 'LOW' | 'MODERATE' | 'HIGH';
  lastEncounterDate?: string;
  createdAt: string;
}

export interface HospitalFacility {
  id: string;
  name: string;
  shortName: string;
  facilityCode: string; // e.g. HIP-DEL-001
  city: string;
  state: string;
  tier: 'Apex National' | 'Super Speciality' | 'Tertiary Care' | 'Reference Lab' | 'Diagnostic Center';
  accreditation: string[]; // ['NABH', 'NABL', 'JCI']
  emergencyPhone: string;
  departments: string[];
  activeDoctors: {
    id: string;
    name: string;
    qualification: string;
    specialization: string;
    licenseNumber: string;
  }[];
}

export interface DocumentRecord {
  id: string;
  patientId: string;
  documentType: string;
  category: 'Metabolic' | 'Blood' | 'Renal' | 'Hepatic' | 'Imaging' | 'Prescription' | 'General';
  labFacility: string;
  issuingHospital?: string;
  originalFilename: string;
  fileSize: number;
  mimeType: string;
  sha256Hash: string;
  reportDate: string;
  uploadDate: string;
  processingStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
  extractionConfidence: number;
  pageCount: number;
  abnormalCount: number;
  keyFindingsSummary: string;
}

export interface HealthEvent {
  id: string;
  patientId: string;
  conditionId?: string;
  eventType: 'LAB_RESULT' | 'DIAGNOSIS' | 'PRESCRIPTION' | 'PROCEDURE' | 'CONSULTATION';
  eventDate: string;
  title: string;
  summary: string;
  bodySystem: string;
  severity: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
  sourceDocumentId?: string;
  sourcePageNumber?: number;
  hospitalFacility?: string;
  attendingDoctor?: string;
}

export interface LabResult {
  id: string;
  patientId: string;
  healthEventId: string;
  parameterName: string;
  parameterCode: string; // HBA1C, GLU_FAST, VIT_D, WBC, TSH, CREATININE, etc.
  numericValue: number;
  rawUnit: string;
  normalizedValue: number;
  normalizedUnit: string;
  referenceMin: number;
  referenceMax: number;
  flag: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
  observedDate: string;
  sourceDocumentId: string;
  sourcePageNumber: number;
}

export interface PatientCondition {
  id: string;
  patientId: string;
  conditionCode: string;
  conditionName: string;
  bodySystem: string;
  currentStatus: 'RECORDED' | 'SUSPECTED' | 'DIAGNOSED' | 'UNDER_TREATMENT' | 'MONITORING' | 'IMPROVING' | 'STABLE' | 'RESOLVED' | 'UNKNOWN';
  severity: 'MILD' | 'MODERATE' | 'SEVERE';
  firstDocumentedDate: string;
  diagnosedDate?: string;
  resolvedDate?: string;
  treatmentSummary?: string;
  resolvingReportId?: string;
  notes?: string;
  diagnosingFacility?: string;
  diagnosingDoctor?: string;
}

export interface ConditionStage {
  id: string;
  conditionId: string;
  stageType: 'FIRST_DOCUMENTED' | 'DIAGNOSIS' | 'BASELINE_TESTS' | 'TREATMENT_INITIATION' | 'FOLLOW_UP_MONITORING' | 'LATEST_DOCUMENTED_STATE';
  stageDate: string;
  label: string;
  description: string;
  sourceDocumentId?: string;
}

export interface CheckpointRecord {
  id: string;
  conditionId: string;
  code: string; // M2, M4, M6
  targetDate: string;
  status: 'SATISFIED' | 'NO_RECORD' | 'UPCOMING';
  satisfiedDate?: string;
  matchedDocumentId?: string;
  evaluationNotes: string;
}

export interface DoctorClinicalNote {
  id: string;
  patientId: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  content: string;
  assessmentType: 'ROUTINE_REVIEW' | 'CONDITION_STATUS_UPDATE' | 'PRESCRIPTION_ADVICE';
}

// In-Memory Data Store with Multi-Year History for Nationwide Multi-Hospital Network
class DataStore {
  users: User[] = [];
  patients: Patient[] = [];
  documents: DocumentRecord[] = [];
  healthEvents: HealthEvent[] = [];
  labResults: LabResult[] = [];
  conditions: PatientCondition[] = [];
  conditionStages: ConditionStage[] = [];
  checkpoints: CheckpointRecord[] = [];
  clinicalNotes: DoctorClinicalNote[] = [];
  hospitals: HospitalFacility[] = [];

  constructor() {
    this.seedHospitals();
    this.seedDemoPatients();
  }

  private seedHospitals() {
    this.hospitals = [
      {
        id: 'hosp-apollo-01',
        name: 'Apollo Hospitals & Heart Institute',
        shortName: 'Apollo Hospitals',
        facilityCode: 'HIP-IN-DEL-001',
        city: 'New Delhi',
        state: 'Delhi',
        tier: 'Super Speciality',
        accreditation: ['NABH', 'JCI', 'ABDM Tier-1'],
        emergencyPhone: '+91-11-26925858',
        departments: ['Cardiology', 'Internal Medicine', 'Endocrinology', 'Gastroenterology', 'Pathology'],
        activeDoctors: [
          {
            id: 'doc-apollo-101',
            name: 'Dr. Priya Nair',
            qualification: 'MBBS, MD',
            specialization: 'Internal Medicine & Diabetology',
            licenseNumber: 'MCI-2012-44120'
          },
          {
            id: 'doc-apollo-102',
            name: 'Dr. Rajiv Malhotra',
            qualification: 'MD, DM',
            specialization: 'Cardiology',
            licenseNumber: 'MCI-2008-31998'
          }
        ]
      },
      {
        id: 'hosp-fortis-02',
        name: 'Fortis Memorial Research Institute',
        shortName: 'Fortis Healthcare',
        facilityCode: 'HIP-IN-GUR-002',
        city: 'Gurgaon',
        state: 'Haryana',
        tier: 'Super Speciality',
        accreditation: ['NABH', 'JCI'],
        emergencyPhone: '+91-124-4962200',
        departments: ['Cardiology', 'Metabolic Medicine', 'Pulmonology', 'Oncology', 'Diagnostic Imaging'],
        activeDoctors: [
          {
            id: 'doc-fortis-201',
            name: 'Dr. Sunita Rao',
            qualification: 'MBBS, MD, DM',
            specialization: 'Cardiology & Preventive Health',
            licenseNumber: 'MCI-2010-88421'
          },
          {
            id: 'doc-fortis-202',
            name: 'Dr. Vikramaditya Sen',
            qualification: 'MS, DNB',
            specialization: 'Orthopaedics & Joint Care',
            licenseNumber: 'MCI-2015-11029'
          }
        ]
      },
      {
        id: 'hosp-max-03',
        name: 'Max Super Speciality Hospital',
        shortName: 'Max Healthcare',
        facilityCode: 'HIP-IN-DEL-003',
        city: 'Saket, New Delhi',
        state: 'Delhi',
        tier: 'Super Speciality',
        accreditation: ['NABH', 'NABL'],
        emergencyPhone: '+91-11-26515050',
        departments: ['Endocrinology', 'Nephrology', 'Pulmonology', 'Critical Care', 'Bio-Chemistry'],
        activeDoctors: [
          {
            id: 'doc-max-301',
            name: 'Dr. Alok Sen',
            qualification: 'MBBS, MD, Fellow Diabetology',
            specialization: 'Endocrinology & Diabetology',
            licenseNumber: 'MCI-2009-77215'
          },
          {
            id: 'doc-max-302',
            name: 'Dr. Meenakshi Sundaram',
            qualification: 'MD, FCCP',
            specialization: 'Pulmonology & Sleep Medicine',
            licenseNumber: 'MCI-2014-99231'
          }
        ]
      },
      {
        id: 'hosp-aiims-04',
        name: 'All India Institute of Medical Sciences (AIIMS)',
        shortName: 'AIIMS New Delhi',
        facilityCode: 'HIP-IN-DEL-004',
        city: 'Ansari Nagar, New Delhi',
        state: 'Delhi',
        tier: 'Apex National',
        accreditation: ['Apex Institute of National Importance', 'NABH'],
        emergencyPhone: '+91-11-26588500',
        departments: ['Endocrinology', 'Nephrology', 'Cardio-Thoracic', 'Allergy & Immunology', 'Apex Central Lab'],
        activeDoctors: [
          {
            id: 'doc-aiims-401',
            name: 'Prof. Rajesh K. Verma',
            qualification: 'MBBS, MD, DM, FAMS',
            specialization: 'Endocrinology & Metabolism',
            licenseNumber: 'MCI-2001-12004'
          },
          {
            id: 'doc-aiims-402',
            name: 'Dr. Ananya Mukherjee',
            qualification: 'MD, DM',
            specialization: 'Nephrology & Renal Transplant',
            licenseNumber: 'MCI-2016-55412'
          }
        ]
      },
      {
        id: 'hosp-drlal-05',
        name: 'Dr. Lal PathLabs National Reference Laboratory',
        shortName: 'Dr. Lal PathLabs',
        facilityCode: 'HIP-IN-DEL-005',
        city: 'Rohini, Delhi',
        state: 'Delhi',
        tier: 'Reference Lab',
        accreditation: ['NABL', 'CAP Accredited'],
        emergencyPhone: '+91-11-39885050',
        departments: ['Clinical Biochemistry', 'Hematology', 'Molecular Diagnostics', 'Microbiology', 'Histopathology'],
        activeDoctors: [
          {
            id: 'doc-lal-501',
            name: 'Dr. Sneha Kulkarni',
            qualification: 'MD (Pathology)',
            specialization: 'Clinical Biochemistry & Molecular Pathology',
            licenseNumber: 'MCI-2011-33109'
          },
          {
            id: 'doc-lal-502',
            name: 'Dr. Tarun Seth',
            qualification: 'MD, FRCPath',
            specialization: 'Hematology & Hemoglobinopathies',
            licenseNumber: 'MCI-2013-66240'
          }
        ]
      },
      {
        id: 'hosp-metro-06',
        name: 'Metropolis Healthcare Central Diagnostic Laboratory',
        shortName: 'Metropolis Healthcare',
        facilityCode: 'HIP-IN-MUM-006',
        city: 'Mumbai',
        state: 'Maharashtra',
        tier: 'Diagnostic Center',
        accreditation: ['NABL', 'CAP Accredited'],
        emergencyPhone: '+91-22-66505555',
        departments: ['Immunology', 'Biochemistry', 'Serology', 'Cytogenetics', 'Thyroid Specialized Lab'],
        activeDoctors: [
          {
            id: 'doc-metro-601',
            name: 'Dr. Farah Merchant',
            qualification: 'MBBS, MD',
            specialization: 'Endocrine Pathology & Biochemistry',
            licenseNumber: 'MMC-2012-78190'
          }
        ]
      }
    ];
  }

  private seedDemoPatients() {
    const salt = bcrypt.genSaltSync(10);
    const demoPasswordHash = bcrypt.hashSync('demo1234', salt);

    // ==========================================
    // PATIENT 1: RAHUL SHARMA (MED-00010001)
    // ==========================================
    const demoUser: User = {
      id: 'usr-demo-001',
      email: 'rahul.sharma@medisutra.in',
      passwordHash: demoPasswordHash,
      role: 'PATIENT',
      createdAt: '2023-01-01T00:00:00Z'
    };
    this.users.push(demoUser);

    const demoPatient: Patient = {
      id: 'pat-demo-001',
      userId: demoUser.id,
      healthId: 'MED-00010001',
      fullName: 'Rahul Sharma',
      dob: '1988-04-15',
      gender: 'Male',
      bloodGroup: 'B+',
      allergies: ['Penicillin'],
      emergencyContact: {
        name: 'Pooja Sharma',
        phone: '+91-9876543210',
        relationship: 'Spouse'
      },
      baselineHistory: {
        familialRisks: ['Maternal Type 2 Diabetes', 'Paternal Hypertension'],
        pastSurgical: 'Appendectomy (2015)',
        habits: 'Sedentary desk job, non-smoker'
      },
      riskLevel: 'MODERATE',
      lastEncounterDate: '2026-07-15',
      createdAt: '2023-01-01T00:00:00Z'
    };
    this.patients.push(demoPatient);

    // PATIENT 2: PRIYA PATEL (MED-00010002) - Multi-patient roster demonstration
    const priyaUser: User = {
      id: 'usr-demo-002',
      email: 'priya.patel@medisutra.in',
      passwordHash: demoPasswordHash,
      role: 'PATIENT',
      createdAt: '2023-06-01T00:00:00Z'
    };
    this.users.push(priyaUser);

    const priyaPatient: Patient = {
      id: 'pat-demo-002',
      userId: priyaUser.id,
      healthId: 'MED-00010002',
      fullName: 'Priya Patel',
      dob: '1979-11-20',
      gender: 'Female',
      bloodGroup: 'O+',
      allergies: ['Sulfa Drugs'],
      emergencyContact: {
        name: 'Vikram Patel',
        phone: '+91-9822334455',
        relationship: 'Brother'
      },
      baselineHistory: {
        familialRisks: ['Thyroid Disorders'],
        habits: 'Moderate physical activity'
      },
      riskLevel: 'LOW',
      lastEncounterDate: '2026-08-01',
      createdAt: '2023-06-01T00:00:00Z'
    };
    this.patients.push(priyaPatient);

    // Priya Patel's Conditions
    const priyaThyroid: PatientCondition = {
      id: 'cond-priya-001',
      patientId: priyaPatient.id,
      conditionCode: 'HYPOTHYROID',
      conditionName: 'Primary Hypothyroidism',
      bodySystem: 'Thyroid',
      currentStatus: 'UNDER_TREATMENT',
      severity: 'MILD',
      firstDocumentedDate: '2023-10-15',
      diagnosedDate: '2023-10-15',
      treatmentSummary: 'Levothyroxine 50 mcg once daily before breakfast.',
      notes: 'TSH stabilized to 2.4 µIU/mL under 50mcg replacement.'
    };
    const priyaAnemia: PatientCondition = {
      id: 'cond-priya-002',
      patientId: priyaPatient.id,
      conditionCode: 'ANEMIA_IRON',
      conditionName: 'Iron Deficiency Microcytic Anemia',
      bodySystem: 'Blood',
      currentStatus: 'RESOLVED',
      severity: 'MODERATE',
      firstDocumentedDate: '2023-11-05',
      diagnosedDate: '2023-11-05',
      resolvedDate: '2024-04-10',
      treatmentSummary: 'Ferrous ascorbate 100mg elemental iron daily for 3 months with Vitamin C.',
      resolvingReportId: 'doc-priya-002',
      notes: 'Hemoglobin normalized from 9.8 g/dL to 13.1 g/dL; serum ferritin restored.'
    };
    this.conditions.push(priyaThyroid, priyaAnemia);

    // Priya Patel's Reports
    this.documents.push(
      {
        id: 'doc-priya-001',
        patientId: priyaPatient.id,
        documentType: 'Thyroid Profile (Total T3, T4, TSH)',
        category: 'Thyroid' as any,
        labFacility: 'Metropolis Healthcare, Mumbai',
        originalFilename: 'Thyroid_Profile_Oct2023.pdf',
        fileSize: 890000,
        mimeType: 'application/pdf',
        sha256Hash: '11a22b33c44d55e66f77889900aabbccddeeff0011223344556677889900aabb',
        reportDate: '2023-10-15',
        uploadDate: '2023-10-16T10:00:00Z',
        processingStatus: 'COMPLETED',
        extractionConfidence: 0.99,
        pageCount: 1,
        abnormalCount: 1,
        keyFindingsSummary: 'TSH elevated at 8.9 µIU/mL (Ref: 0.4 - 4.2). Diagnosed with primary hypothyroidism.'
      },
      {
        id: 'doc-priya-002',
        patientId: priyaPatient.id,
        documentType: 'Complete Blood Count & Ferritin Follow-up',
        category: 'Blood',
        labFacility: 'Metropolis Healthcare, Mumbai',
        originalFilename: 'CBC_Ferritin_Apr2024.pdf',
        fileSize: 940000,
        mimeType: 'application/pdf',
        sha256Hash: '22b33c44d55e66f77889900aabbccddeeff0011223344556677889900aabb11a',
        reportDate: '2024-04-10',
        uploadDate: '2024-04-11T11:30:00Z',
        processingStatus: 'COMPLETED',
        extractionConfidence: 0.98,
        pageCount: 1,
        abnormalCount: 0,
        keyFindingsSummary: 'Hemoglobin normalized to 13.1 g/dL. Iron deficiency anemia marked Resolved.'
      }
    );

    // ==========================================
    // RAHUL SHARMA'S LIFETIME CONDITIONS HISTORY
    // ==========================================
    // 1. Active: Type 2 Diabetes Mellitus (Diagnosed Jan 2025)
    const t2dCond: PatientCondition = {
      id: 'cond-diabetes-001',
      patientId: demoPatient.id,
      conditionCode: 'T2D',
      conditionName: 'Type 2 Diabetes Mellitus',
      bodySystem: 'Metabolic',
      currentStatus: 'UNDER_TREATMENT',
      severity: 'MODERATE',
      firstDocumentedDate: '2025-01-10',
      diagnosedDate: '2025-01-22',
      treatmentSummary: 'Metformin 500mg BID, low glycemic dietary protocol, 45 mins daily walking.',
      notes: 'Initial glycemic spike (HbA1c 8.7%). Longitudinal trajectory demonstrates consistent downward improvement: 8.2% (M2) -> 7.8% (M6) -> 6.9% (Latest).'
    };

    // 2. Active / Monitoring: Mild Dyslipidemia (Diagnosed Jan 2025)
    const lipidCond: PatientCondition = {
      id: 'cond-lipid-004',
      patientId: demoPatient.id,
      conditionCode: 'DYSLIPID',
      conditionName: 'Mild Dyslipidemia (Elevated Triglycerides)',
      bodySystem: 'Metabolic',
      currentStatus: 'MONITORING',
      severity: 'MILD',
      firstDocumentedDate: '2025-01-22',
      diagnosedDate: '2025-01-22',
      treatmentSummary: 'Lifestyle modification, dietary omega-3 fatty acids, reduction of refined carbs.',
      notes: 'Triglycerides recorded at 210 mg/dL in Jan 2025; improved to 165 mg/dL in latest metabolic panel.'
    };

    // 3. Documented Resolved: Vitamin D Deficiency (2024-03-12 to 2024-09-20)
    const vitDCond: PatientCondition = {
      id: 'cond-vitd-002',
      patientId: demoPatient.id,
      conditionCode: 'VIT_D_DEF',
      conditionName: 'Severe Vitamin D Deficiency',
      bodySystem: 'Metabolic',
      currentStatus: 'RESOLVED',
      severity: 'SEVERE',
      firstDocumentedDate: '2024-03-12',
      diagnosedDate: '2024-03-12',
      resolvedDate: '2024-09-20',
      treatmentSummary: 'Cholecalciferol 60,000 IU weekly for 8 weeks followed by monthly maintenance.',
      resolvingReportId: 'doc-004',
      notes: 'Baseline 25-OH Vitamin D was 14 ng/mL (severely deficient). Normalized to 38 ng/mL documented in Sep 2024 follow-up.'
    };

    // 4. Documented Resolved: Acute Viral Fever / Respiratory Infection (Aug 2024)
    const viralCond: PatientCondition = {
      id: 'cond-viral-003',
      patientId: demoPatient.id,
      conditionCode: 'VIRAL_INF',
      conditionName: 'Acute Viral Fever & Bronchitis',
      bodySystem: 'Blood',
      currentStatus: 'RESOLVED',
      severity: 'MODERATE',
      firstDocumentedDate: '2024-08-15',
      diagnosedDate: '2024-08-15',
      resolvedDate: '2024-08-25',
      treatmentSummary: 'Paracetamol 650mg, hydration, steam inhalation, symptomatic cough suppressant.',
      resolvingReportId: 'doc-003',
      notes: 'WBC elevated to 11,200 /µL with febrile symptoms. Completely resolved in 10 days with normal recovery.'
    };

    // 5. Documented Resolved: Acute Gastroenteritis & Dehydration (Jul 2023)
    const gastroCond: PatientCondition = {
      id: 'cond-gastro-005',
      patientId: demoPatient.id,
      conditionCode: 'GASTRO_INF',
      conditionName: 'Acute Gastroenteritis & Dehydration',
      bodySystem: 'Metabolic',
      currentStatus: 'RESOLVED',
      severity: 'MODERATE',
      firstDocumentedDate: '2023-07-14',
      diagnosedDate: '2023-07-14',
      resolvedDate: '2023-07-22',
      treatmentSummary: 'Oral rehydration salts (ORS), ciprofloxacin 500mg, probiotics for 5 days.',
      resolvingReportId: 'doc-000-a',
      notes: 'Bacterial enteritis resolved with antibiotic course and electrolyte stabilization.'
    };

    this.conditions.push(t2dCond, lipidCond, vitDCond, viralCond, gastroCond);

    // ==========================================
    // RAHUL SHARMA'S MULTI-YEAR REPORTS VAULT (2023 - 2026)
    // ==========================================
    this.documents.push(
      // --- 2023 REPORTS ---
      {
        id: 'doc-000-a',
        patientId: demoPatient.id,
        documentType: 'Stool & Serum Electrolyte Examination',
        category: 'Metabolic',
        labFacility: 'Apollo Diagnostics, New Delhi',
        originalFilename: 'Electrolytes_Gastro_Jul2023.pdf',
        fileSize: 840000,
        mimeType: 'application/pdf',
        sha256Hash: '98a123f00123456789abcdef1234567890abcdef1234567890abcdef12345678',
        reportDate: '2023-07-14',
        uploadDate: '2023-07-15T11:00:00Z',
        processingStatus: 'COMPLETED',
        extractionConfidence: 0.97,
        pageCount: 1,
        abnormalCount: 1,
        keyFindingsSummary: 'Serum Sodium 132 mEq/L (Mild hyponatremia), Potassium normal. Gastroenteritis resolved.'
      },
      {
        id: 'doc-000-b',
        patientId: demoPatient.id,
        documentType: 'Annual Pre-Employment Physical & Hemogram',
        category: 'Blood',
        labFacility: 'Dr. Lal PathLabs, Delhi NCR',
        originalFilename: 'Annual_Hemogram_Nov2023.pdf',
        fileSize: 1120000,
        mimeType: 'application/pdf',
        sha256Hash: '87b234a11234567890abcdef1234567890abcdef1234567890abcdef12345678',
        reportDate: '2023-11-20',
        uploadDate: '2023-11-21T09:15:00Z',
        processingStatus: 'COMPLETED',
        extractionConfidence: 0.99,
        pageCount: 2,
        abnormalCount: 0,
        keyFindingsSummary: 'Normal baseline hemogram. Hemoglobin 14.8 g/dL, Platelets 260,000 /µL, BP 120/80 mmHg.'
      },

      // --- 2024 REPORTS ---
      {
        id: 'doc-001',
        patientId: demoPatient.id,
        documentType: 'Routine Health Check & Vitamin D Panel',
        category: 'Metabolic',
        labFacility: 'Metropolis Healthcare, Delhi',
        originalFilename: 'HealthCheck_VitD_March2024.pdf',
        fileSize: 1048576,
        mimeType: 'application/pdf',
        sha256Hash: 'a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef',
        reportDate: '2024-03-12',
        uploadDate: '2024-03-13T10:00:00Z',
        processingStatus: 'COMPLETED',
        extractionConfidence: 0.98,
        pageCount: 2,
        abnormalCount: 1,
        keyFindingsSummary: 'Severe Vitamin D deficiency detected (14 ng/mL, ref 30-100). Oral supplementation initiated.'
      },
      {
        id: 'doc-002',
        patientId: demoPatient.id,
        documentType: 'Clinical Prescription - Cholecalciferol',
        category: 'Prescription',
        labFacility: 'Max Super Speciality Hospital, Delhi',
        originalFilename: 'Prescription_VitD_Apr2024.pdf',
        fileSize: 640000,
        mimeType: 'application/pdf',
        sha256Hash: 'f1e2d3c4b5a678901234567890abcdef1234567890abcdef1234567890abcdef',
        reportDate: '2024-04-01',
        uploadDate: '2024-04-02T12:00:00Z',
        processingStatus: 'COMPLETED',
        extractionConfidence: 0.96,
        pageCount: 1,
        abnormalCount: 0,
        keyFindingsSummary: 'Cholecalciferol 60,000 IU orally once weekly for 8 weeks.'
      },
      {
        id: 'doc-003',
        patientId: demoPatient.id,
        documentType: 'Complete Blood Count (CBC) - Febrile Episode',
        category: 'Blood',
        labFacility: 'Dr. Lal PathLabs, Delhi NCR',
        originalFilename: 'CBC_ViralInfection_Aug2024.pdf',
        fileSize: 920000,
        mimeType: 'application/pdf',
        sha256Hash: 'e2d3c4b5a678901234567890abcdef1234567890abcdef1234567890abcdefa1',
        reportDate: '2024-08-15',
        uploadDate: '2024-08-16T14:30:00Z',
        processingStatus: 'COMPLETED',
        extractionConfidence: 0.99,
        pageCount: 1,
        abnormalCount: 1,
        keyFindingsSummary: 'Leukocytosis (WBC 11,200 /µL) secondary to acute viral fever. Hemoglobin stable at 14.2 g/dL.'
      },
      {
        id: 'doc-004',
        patientId: demoPatient.id,
        documentType: 'Vitamin D Follow-up Panel',
        category: 'Metabolic',
        labFacility: 'Metropolis Healthcare, Delhi',
        originalFilename: 'VitD_Followup_Sep2024.pdf',
        fileSize: 852100,
        mimeType: 'application/pdf',
        sha256Hash: 'b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdefa1',
        reportDate: '2024-09-20',
        uploadDate: '2024-09-21T09:30:00Z',
        processingStatus: 'COMPLETED',
        extractionConfidence: 0.99,
        pageCount: 1,
        abnormalCount: 0,
        keyFindingsSummary: 'Vitamin D 25-OH normalized to 38 ng/mL (Reference: 30-100 ng/mL). Condition documented as Resolved.'
      },

      // --- 2025 REPORTS ---
      {
        id: 'doc-005',
        patientId: demoPatient.id,
        documentType: 'Executive Comprehensive Health Check',
        category: 'Metabolic',
        labFacility: 'Apollo Diagnostics, New Delhi',
        originalFilename: 'Executive_HealthCheck_Jan2025.pdf',
        fileSize: 2150000,
        mimeType: 'application/pdf',
        sha256Hash: '56a78b90c123456789abcdef1234567890abcdef1234567890abcdef12345678',
        reportDate: '2025-01-10',
        uploadDate: '2025-01-11T10:00:00Z',
        processingStatus: 'COMPLETED',
        extractionConfidence: 0.98,
        pageCount: 3,
        abnormalCount: 2,
        keyFindingsSummary: 'Fasting Plasma Glucose 165 mg/dL (High). Triglycerides 210 mg/dL (High). Confirmatory HbA1c recommended.'
      },
      {
        id: 'doc-006',
        patientId: demoPatient.id,
        documentType: 'Confirmatory Diabetes Diagnostic Panel',
        category: 'Metabolic',
        labFacility: 'Dr. Lal PathLabs, Delhi NCR',
        originalFilename: 'Diabetes_Diagnosis_Jan2025.pdf',
        fileSize: 1420500,
        mimeType: 'application/pdf',
        sha256Hash: 'c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdefa1b2',
        reportDate: '2025-01-22',
        uploadDate: '2025-01-23T11:00:00Z',
        processingStatus: 'COMPLETED',
        extractionConfidence: 0.99,
        pageCount: 2,
        abnormalCount: 2,
        keyFindingsSummary: 'HbA1c confirmed at 8.7% (Target < 5.7%). Fasting Blood Sugar 172 mg/dL. Type 2 Diabetes diagnosed.'
      },
      {
        id: 'doc-007',
        patientId: demoPatient.id,
        documentType: 'Clinical Prescription - Diabetes Therapy',
        category: 'Prescription',
        labFacility: 'Dr. Alok Sen Clinic, Max Healthcare',
        originalFilename: 'Prescription_Metformin_Feb2025.pdf',
        fileSize: 580000,
        mimeType: 'application/pdf',
        sha256Hash: '78b90c1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        reportDate: '2025-02-01',
        uploadDate: '2025-02-02T09:00:00Z',
        processingStatus: 'COMPLETED',
        extractionConfidence: 0.97,
        pageCount: 1,
        abnormalCount: 0,
        keyFindingsSummary: 'Tab Metformin 500mg BID with meals. Target 3-month HbA1c < 7.5%.'
      },
      {
        id: 'doc-008',
        patientId: demoPatient.id,
        documentType: 'M2 Diabetes Follow-up Panel',
        category: 'Metabolic',
        labFacility: 'Dr. Lal PathLabs, Delhi NCR',
        originalFilename: 'Diabetes_M2_March2025.pdf',
        fileSize: 1102000,
        mimeType: 'application/pdf',
        sha256Hash: 'd4e5f678901234567890abcdef1234567890abcdef1234567890abcdefa1b2c3',
        reportDate: '2025-03-20',
        uploadDate: '2025-03-21T14:20:00Z',
        processingStatus: 'COMPLETED',
        extractionConfidence: 0.97,
        pageCount: 2,
        abnormalCount: 1,
        keyFindingsSummary: 'HbA1c decreased to 8.2% (from 8.7%). Fasting Glucose dropped to 152 mg/dL. Positive therapeutic response.'
      },
      {
        id: 'doc-009',
        patientId: demoPatient.id,
        documentType: 'M6 Diabetes Follow-up Panel',
        category: 'Metabolic',
        labFacility: 'Dr. Lal PathLabs, Delhi NCR',
        originalFilename: 'Diabetes_M6_July2025.pdf',
        fileSize: 1250000,
        mimeType: 'application/pdf',
        sha256Hash: 'e5f678901234567890abcdef1234567890abcdef1234567890abcdefa1b2c3d4',
        reportDate: '2025-07-28',
        uploadDate: '2025-07-29T16:00:00Z',
        processingStatus: 'COMPLETED',
        extractionConfidence: 0.98,
        pageCount: 2,
        abnormalCount: 1,
        keyFindingsSummary: 'HbA1c improved to 7.8%. Fasting Glucose 144 mg/dL. Renal profile within normal limits.'
      },

      // --- 2026 REPORTS ---
      {
        id: 'doc-010',
        patientId: demoPatient.id,
        documentType: 'Annual Comprehensive Metabolic & Renal Panel',
        category: 'Renal',
        labFacility: 'Apollo Diagnostics, New Delhi',
        originalFilename: 'Annual_Review_Jan2026.pdf',
        fileSize: 1540000,
        mimeType: 'application/pdf',
        sha256Hash: '45a67b890c1234567890abcdef1234567890abcdef1234567890abcdef123456',
        reportDate: '2026-01-14',
        uploadDate: '2026-01-15T11:00:00Z',
        processingStatus: 'COMPLETED',
        extractionConfidence: 0.99,
        pageCount: 2,
        abnormalCount: 1,
        keyFindingsSummary: 'HbA1c reached 7.2%. Serum Creatinine 0.9 mg/dL (Normal). eGFR > 90 mL/min/1.73m2.'
      },
      {
        id: 'doc-011',
        patientId: demoPatient.id,
        documentType: 'Semi-Annual Glycemic Review',
        category: 'Metabolic',
        labFacility: 'Dr. Lal PathLabs, Delhi NCR',
        originalFilename: 'Diabetes_Followup_July2026.pdf',
        fileSize: 1680000,
        mimeType: 'application/pdf',
        sha256Hash: 'f678901234567890abcdef1234567890abcdef1234567890abcdefa1b2c3d4e5',
        reportDate: '2026-07-12',
        uploadDate: '2026-07-13T10:15:00Z',
        processingStatus: 'COMPLETED',
        extractionConfidence: 0.99,
        pageCount: 2,
        abnormalCount: 0,
        keyFindingsSummary: 'HbA1c recorded at 6.9% (< 7.0% ADA Clinical Target). Fasting Glucose 138 mg/dL. Glycemic stability confirmed.'
      },
      {
        id: 'doc-012',
        patientId: demoPatient.id,
        documentType: 'Ultrasound Whole Abdomen',
        category: 'Imaging',
        labFacility: 'Mahajan Imaging Center, New Delhi',
        originalFilename: 'Ultrasound_Abdomen_Aug2026.pdf',
        fileSize: 2450000,
        mimeType: 'application/pdf',
        sha256Hash: '34b56c78901234567890abcdef1234567890abcdef1234567890abcdef123456',
        reportDate: '2026-08-10',
        uploadDate: '2026-08-11T16:45:00Z',
        processingStatus: 'COMPLETED',
        extractionConfidence: 0.98,
        pageCount: 2,
        abnormalCount: 0,
        keyFindingsSummary: 'Normal liver parenchymal echotexture (no fatty liver). Kidneys, spleen, gallbladder unremarkable.'
      }
    );

    // ==========================================
    // LAB RESULTS ACROSS 2023 - 2026
    // ==========================================
    const labs: LabResult[] = [
      // 2024 Vitamin D
      {
        id: 'lab-01',
        patientId: demoPatient.id,
        healthEventId: 'evt-01',
        parameterName: 'Vitamin D 25-OH',
        parameterCode: 'VIT_D',
        numericValue: 14.0,
        rawUnit: 'ng/mL',
        normalizedValue: 14.0,
        normalizedUnit: 'ng/mL',
        referenceMin: 30.0,
        referenceMax: 100.0,
        flag: 'LOW',
        observedDate: '2024-03-12',
        sourceDocumentId: 'doc-001',
        sourcePageNumber: 2
      },
      {
        id: 'lab-02',
        patientId: demoPatient.id,
        healthEventId: 'evt-02',
        parameterName: 'Vitamin D 25-OH',
        parameterCode: 'VIT_D',
        numericValue: 38.0,
        rawUnit: 'ng/mL',
        normalizedValue: 38.0,
        normalizedUnit: 'ng/mL',
        referenceMin: 30.0,
        referenceMax: 100.0,
        flag: 'NORMAL',
        observedDate: '2024-09-20',
        sourceDocumentId: 'doc-004',
        sourcePageNumber: 1
      },
      // 2024 WBC Viral
      {
        id: 'lab-02b',
        patientId: demoPatient.id,
        healthEventId: 'evt-02b',
        parameterName: 'Total Leukocyte Count (WBC)',
        parameterCode: 'WBC',
        numericValue: 11200,
        rawUnit: '/µL',
        normalizedValue: 11200,
        normalizedUnit: '/µL',
        referenceMin: 4000,
        referenceMax: 10000,
        flag: 'HIGH',
        observedDate: '2024-08-15',
        sourceDocumentId: 'doc-003',
        sourcePageNumber: 1
      },
      // 2025 - 2026 HbA1c Progression
      {
        id: 'lab-03',
        patientId: demoPatient.id,
        healthEventId: 'evt-03',
        parameterName: 'HbA1c (Glycated Hemoglobin)',
        parameterCode: 'HBA1C',
        numericValue: 8.7,
        rawUnit: '%',
        normalizedValue: 8.7,
        normalizedUnit: '%',
        referenceMin: 4.0,
        referenceMax: 5.6,
        flag: 'HIGH',
        observedDate: '2025-01-22',
        sourceDocumentId: 'doc-006',
        sourcePageNumber: 1
      },
      {
        id: 'lab-04',
        patientId: demoPatient.id,
        healthEventId: 'evt-04',
        parameterName: 'HbA1c (Glycated Hemoglobin)',
        parameterCode: 'HBA1C',
        numericValue: 8.2,
        rawUnit: '%',
        normalizedValue: 8.2,
        normalizedUnit: '%',
        referenceMin: 4.0,
        referenceMax: 5.6,
        flag: 'HIGH',
        observedDate: '2025-03-20',
        sourceDocumentId: 'doc-008',
        sourcePageNumber: 2
      },
      {
        id: 'lab-05',
        patientId: demoPatient.id,
        healthEventId: 'evt-05',
        parameterName: 'HbA1c (Glycated Hemoglobin)',
        parameterCode: 'HBA1C',
        numericValue: 7.8,
        rawUnit: '%',
        normalizedValue: 7.8,
        normalizedUnit: '%',
        referenceMin: 4.0,
        referenceMax: 5.6,
        flag: 'HIGH',
        observedDate: '2025-07-28',
        sourceDocumentId: 'doc-009',
        sourcePageNumber: 1
      },
      {
        id: 'lab-06',
        patientId: demoPatient.id,
        healthEventId: 'evt-06',
        parameterName: 'HbA1c (Glycated Hemoglobin)',
        parameterCode: 'HBA1C',
        numericValue: 7.2,
        rawUnit: '%',
        normalizedValue: 7.2,
        normalizedUnit: '%',
        referenceMin: 4.0,
        referenceMax: 5.6,
        flag: 'HIGH',
        observedDate: '2026-01-14',
        sourceDocumentId: 'doc-010',
        sourcePageNumber: 1
      },
      {
        id: 'lab-07',
        patientId: demoPatient.id,
        healthEventId: 'evt-07',
        parameterName: 'HbA1c (Glycated Hemoglobin)',
        parameterCode: 'HBA1C',
        numericValue: 6.9,
        rawUnit: '%',
        normalizedValue: 6.9,
        normalizedUnit: '%',
        referenceMin: 4.0,
        referenceMax: 5.6,
        flag: 'NORMAL',
        observedDate: '2026-07-12',
        sourceDocumentId: 'doc-011',
        sourcePageNumber: 1
      },
      // Fasting Blood Sugar
      {
        id: 'lab-08',
        patientId: demoPatient.id,
        healthEventId: 'evt-03',
        parameterName: 'Fasting Plasma Glucose',
        parameterCode: 'GLU_FAST',
        numericValue: 172.0,
        rawUnit: 'mg/dL',
        normalizedValue: 172.0,
        normalizedUnit: 'mg/dL',
        referenceMin: 70.0,
        referenceMax: 99.0,
        flag: 'HIGH',
        observedDate: '2025-01-22',
        sourceDocumentId: 'doc-006',
        sourcePageNumber: 1
      },
      {
        id: 'lab-09',
        patientId: demoPatient.id,
        healthEventId: 'evt-04',
        parameterName: 'Fasting Plasma Glucose',
        parameterCode: 'GLU_FAST',
        numericValue: 152.0,
        rawUnit: 'mg/dL',
        normalizedValue: 152.0,
        normalizedUnit: 'mg/dL',
        referenceMin: 70.0,
        referenceMax: 99.0,
        flag: 'HIGH',
        observedDate: '2025-03-20',
        sourceDocumentId: 'doc-008',
        sourcePageNumber: 1
      },
      {
        id: 'lab-10',
        patientId: demoPatient.id,
        healthEventId: 'evt-05',
        parameterName: 'Fasting Plasma Glucose',
        parameterCode: 'GLU_FAST',
        numericValue: 144.0,
        rawUnit: 'mg/dL',
        normalizedValue: 144.0,
        normalizedUnit: 'mg/dL',
        referenceMin: 70.0,
        referenceMax: 99.0,
        flag: 'HIGH',
        observedDate: '2025-07-28',
        sourceDocumentId: 'doc-009',
        sourcePageNumber: 1
      },
      {
        id: 'lab-11',
        patientId: demoPatient.id,
        healthEventId: 'evt-07',
        parameterName: 'Fasting Plasma Glucose',
        parameterCode: 'GLU_FAST',
        numericValue: 138.0,
        rawUnit: 'mg/dL',
        normalizedValue: 138.0,
        normalizedUnit: 'mg/dL',
        referenceMin: 70.0,
        referenceMax: 99.0,
        flag: 'HIGH',
        observedDate: '2026-07-12',
        sourceDocumentId: 'doc-011',
        sourcePageNumber: 1
      },
      // Creatinine (Renal)
      {
        id: 'lab-12',
        patientId: demoPatient.id,
        healthEventId: 'evt-06',
        parameterName: 'Serum Creatinine',
        parameterCode: 'CREATININE',
        numericValue: 0.9,
        rawUnit: 'mg/dL',
        normalizedValue: 0.9,
        normalizedUnit: 'mg/dL',
        referenceMin: 0.7,
        referenceMax: 1.3,
        flag: 'NORMAL',
        observedDate: '2026-01-14',
        sourceDocumentId: 'doc-010',
        sourcePageNumber: 1
      }
    ];
    this.labResults.push(...labs);

    // ==========================================
    // TIMELINE EVENTS ACROSS 2023 - 2026
    // ==========================================
    this.healthEvents.push(
      {
        id: 'evt-00',
        patientId: demoPatient.id,
        conditionId: gastroCond.id,
        eventType: 'DIAGNOSIS',
        eventDate: '2023-07-14',
        title: 'Acute Gastroenteritis Episode',
        summary: 'Presented with dehydration and gastrointestinal distress following travel. Stabilized with fluids and antibiotics.',
        bodySystem: 'Metabolic',
        severity: 'NORMAL',
        sourceDocumentId: 'doc-000-a',
        sourcePageNumber: 1
      },
      {
        id: 'evt-01',
        patientId: demoPatient.id,
        conditionId: vitDCond.id,
        eventType: 'LAB_RESULT',
        eventDate: '2024-03-12',
        title: 'Severe Vitamin D Deficiency Identified',
        summary: 'Recorded 14 ng/mL (Deficient, reference 30-100 ng/mL). Cholecalciferol 60k IU weekly prescribed.',
        bodySystem: 'Metabolic',
        severity: 'LOW',
        sourceDocumentId: 'doc-001',
        sourcePageNumber: 2
      },
      {
        id: 'evt-02b',
        patientId: demoPatient.id,
        conditionId: viralCond.id,
        eventType: 'LAB_RESULT',
        eventDate: '2024-08-15',
        title: 'Acute Viral Fever - Leukocytosis',
        summary: 'WBC elevated to 11,200 /µL during febrile illness. Managed symptomatically; resolved in 10 days.',
        bodySystem: 'Blood',
        severity: 'HIGH',
        sourceDocumentId: 'doc-003',
        sourcePageNumber: 1
      },
      {
        id: 'evt-02',
        patientId: demoPatient.id,
        conditionId: vitDCond.id,
        eventType: 'LAB_RESULT',
        eventDate: '2024-09-20',
        title: 'Vitamin D Level Normalized',
        summary: 'Follow-up lab shows 38 ng/mL (Normal). Condition documented as Resolved.',
        bodySystem: 'Metabolic',
        severity: 'NORMAL',
        sourceDocumentId: 'doc-004',
        sourcePageNumber: 1
      },
      {
        id: 'evt-03',
        patientId: demoPatient.id,
        conditionId: t2dCond.id,
        eventType: 'DIAGNOSIS',
        eventDate: '2025-01-22',
        title: 'Type 2 Diabetes Mellitus Diagnosed',
        summary: 'HbA1c recorded at 8.7% and Fasting Blood Sugar at 172 mg/dL. Metformin 500mg BID commenced.',
        bodySystem: 'Metabolic',
        severity: 'HIGH',
        sourceDocumentId: 'doc-006',
        sourcePageNumber: 1
      },
      {
        id: 'evt-04',
        patientId: demoPatient.id,
        conditionId: t2dCond.id,
        eventType: 'LAB_RESULT',
        eventDate: '2025-03-20',
        title: 'M2 Follow-up Lab Evaluation',
        summary: 'HbA1c decreased from 8.7% to 8.2%. Fasting Plasma Glucose dropped to 152 mg/dL.',
        bodySystem: 'Metabolic',
        severity: 'HIGH',
        sourceDocumentId: 'doc-008',
        sourcePageNumber: 2
      },
      {
        id: 'evt-05',
        patientId: demoPatient.id,
        conditionId: t2dCond.id,
        eventType: 'LAB_RESULT',
        eventDate: '2025-07-28',
        title: 'M6 Semi-Annual Checkup',
        summary: 'HbA1c improved to 7.8%. Fasting Blood Sugar 144 mg/dL.',
        bodySystem: 'Metabolic',
        severity: 'HIGH',
        sourceDocumentId: 'doc-009',
        sourcePageNumber: 1
      },
      {
        id: 'evt-06',
        patientId: demoPatient.id,
        conditionId: t2dCond.id,
        eventType: 'LAB_RESULT',
        eventDate: '2026-01-14',
        title: 'Annual Metabolic & Renal Review',
        summary: 'HbA1c reached 7.2%. Creatinine normal at 0.9 mg/dL.',
        bodySystem: 'Renal',
        severity: 'NORMAL',
        sourceDocumentId: 'doc-010',
        sourcePageNumber: 1
      },
      {
        id: 'evt-07',
        patientId: demoPatient.id,
        conditionId: t2dCond.id,
        eventType: 'LAB_RESULT',
        eventDate: '2026-07-12',
        title: 'Latest Glycemic Status Review',
        summary: 'Recorded HbA1c reached 6.9% (< 7.0% target). Fasting Blood Sugar 138 mg/dL.',
        bodySystem: 'Metabolic',
        severity: 'NORMAL',
        sourceDocumentId: 'doc-011',
        sourcePageNumber: 1
      },
      {
        id: 'evt-08',
        patientId: demoPatient.id,
        eventType: 'PROCEDURE',
        eventDate: '2026-08-10',
        title: 'Ultrasound Whole Abdomen (Normal)',
        summary: 'Liver parenchymal echotexture normal. No fatty liver, gallstones, or renal calculi detected.',
        bodySystem: 'Imaging',
        severity: 'NORMAL',
        sourceDocumentId: 'doc-012',
        sourcePageNumber: 1
      }
    );

    // Seed Doctor Clinical Notes
    this.clinicalNotes.push(
      {
        id: 'note-01',
        patientId: demoPatient.id,
        doctorName: 'Dr. Alok Sen, MD',
        doctorSpecialization: 'Internal Medicine & Diabetology',
        date: '2025-01-25',
        content: 'Patient presented with newly diagnosed Type 2 Diabetes (HbA1c 8.7%). Initiated on Metformin 500mg BID. Recommended glycemic monitoring at M2, M4, and M6 intervals with diet modification.',
        assessmentType: 'ROUTINE_REVIEW'
      },
      {
        id: 'note-02',
        patientId: demoPatient.id,
        doctorName: 'Dr. Alok Sen, MD',
        doctorSpecialization: 'Internal Medicine & Diabetology',
        date: '2025-08-02',
        content: 'Review of Month 6 report shows significant glycemic decline (HbA1c down to 7.8%). Note: M4 report is missing from personal platform. Patient confirms compliance with Metformin and daily walking.',
        assessmentType: 'CONDITION_STATUS_UPDATE'
      },
      {
        id: 'note-03',
        patientId: demoPatient.id,
        doctorName: 'Dr. Alok Sen, MD',
        doctorSpecialization: 'Internal Medicine & Diabetology',
        date: '2026-07-15',
        content: 'Outstanding longitudinal progress. Recorded HbA1c at 6.9% (< 7.0% ADA target) with stable renal function (Creatinine 0.9 mg/dL) and normal liver ultrasound. Patient maintained on current therapy.',
        assessmentType: 'ROUTINE_REVIEW'
      }
    );

    // Seed Checkpoints
    this.checkpoints.push(
      {
        id: 'chk-m2',
        conditionId: t2dCond.id,
        code: 'M2 (Month 2)',
        targetDate: '2025-03-22',
        status: 'SATISFIED',
        satisfiedDate: '2025-03-20',
        matchedDocumentId: 'doc-008',
        evaluationNotes: 'Available (Recorded on 2025-03-20 in Follow-up Metabolic Panel)'
      },
      {
        id: 'chk-m4',
        conditionId: t2dCond.id,
        code: 'M4 (Month 4)',
        targetDate: '2025-05-22',
        status: 'NO_RECORD',
        evaluationNotes: 'No corresponding record was found in this system.'
      },
      {
        id: 'chk-m6',
        conditionId: t2dCond.id,
        code: 'M6 (Month 6)',
        targetDate: '2025-07-22',
        status: 'SATISFIED',
        satisfiedDate: '2025-07-28',
        matchedDocumentId: 'doc-009',
        evaluationNotes: 'Available (Recorded on 2025-07-28 in Semi-Annual Glycemic Review)'
      },
      {
        id: 'chk-latest',
        conditionId: t2dCond.id,
        code: 'Latest Review',
        targetDate: '2026-07-15',
        status: 'SATISFIED',
        satisfiedDate: '2026-07-12',
        matchedDocumentId: 'doc-011',
        evaluationNotes: 'Available (Recorded on 2026-07-12 in Annual Follow-up Report)'
      }
    );

    // Disease stages
    this.conditionStages.push(
      {
        id: 'stg-01',
        conditionId: t2dCond.id,
        stageType: 'FIRST_DOCUMENTED',
        stageDate: '2025-01-10',
        label: 'Initial Elevated Glucose Detection',
        description: 'Annual Executive Health Check revealed elevated fasting blood sugar (165 mg/dL).',
        sourceDocumentId: 'doc-005'
      },
      {
        id: 'stg-02',
        conditionId: t2dCond.id,
        stageType: 'DIAGNOSIS',
        stageDate: '2025-01-22',
        label: 'Confirmatory Clinical Diagnosis',
        description: 'Diagnostic HbA1c test confirmed 8.7%. Formal diagnosis of Type 2 Diabetes recorded.',
        sourceDocumentId: 'doc-006'
      },
      {
        id: 'stg-03',
        conditionId: t2dCond.id,
        stageType: 'TREATMENT_INITIATION',
        stageDate: '2025-02-01',
        label: 'Pharmacotherapy Initiated',
        description: 'Initiated on Metformin 500mg twice daily with meal times.',
        sourceDocumentId: 'doc-007'
      },
      {
        id: 'stg-04',
        conditionId: t2dCond.id,
        stageType: 'FOLLOW_UP_MONITORING',
        stageDate: '2025-03-20',
        label: 'Month 2 Follow-Up Check',
        description: 'Recorded HbA1c declined to 8.2%; fasting glucose dropped to 152 mg/dL.',
        sourceDocumentId: 'doc-008'
      },
      {
        id: 'stg-05',
        conditionId: t2dCond.id,
        stageType: 'FOLLOW_UP_MONITORING',
        stageDate: '2025-07-28',
        label: 'Month 6 Review',
        description: 'HbA1c lowered to 7.8%; fasting glucose 144 mg/dL.',
        sourceDocumentId: 'doc-009'
      },
      {
        id: 'stg-06',
        conditionId: t2dCond.id,
        stageType: 'LATEST_DOCUMENTED_STATE',
        stageDate: '2026-07-12',
        label: 'Latest Documented Status',
        description: 'HbA1c reached 6.9%; glucose 138 mg/dL. Glycemic stability maintained.',
        sourceDocumentId: 'doc-011'
      }
    );

    // ==========================================
    // PATIENT 3: AMIT VERMA (MED-00010003) - Cross-Hospital History (Fortis + Max + Apollo)
    // ==========================================
    const amitUser: User = {
      id: 'usr-demo-003',
      email: 'amit.verma@medisutra.in',
      passwordHash: demoPasswordHash,
      role: 'PATIENT',
      createdAt: '2023-09-01T00:00:00Z'
    };
    this.users.push(amitUser);

    const amitPatient: Patient = {
      id: 'pat-demo-003',
      userId: amitUser.id,
      healthId: 'MED-00010003',
      fullName: 'Amit Verma',
      dob: '1974-06-18',
      gender: 'Male',
      bloodGroup: 'A+',
      allergies: ['Aspirin', 'NSAIDs'],
      emergencyContact: {
        name: 'Sunita Verma',
        phone: '+91-9811223344',
        relationship: 'Spouse'
      },
      baselineHistory: {
        familialRisks: ['Paternal Chronic Kidney Disease', 'Essential Hypertension'],
        habits: 'Smoker (cessation 2022), sedentary'
      },
      riskLevel: 'HIGH',
      lastEncounterDate: '2026-06-25',
      createdAt: '2023-09-01T00:00:00Z'
    };
    this.patients.push(amitPatient);

    const amitHtn: PatientCondition = {
      id: 'cond-amit-001',
      patientId: amitPatient.id,
      conditionCode: 'I10',
      conditionName: 'Essential Hypertension (Stage 2)',
      bodySystem: 'Cardiovascular',
      currentStatus: 'UNDER_TREATMENT',
      severity: 'SEVERE',
      firstDocumentedDate: '2024-02-10',
      diagnosedDate: '2024-02-10',
      treatmentSummary: 'Telmisartan 40mg + Amlodipine 5mg OD, strict low sodium intake (< 2g/day).',
      notes: 'Initial BP recorded at 168/104 mmHg at Fortis Gurgaon. Stabilized to 128/82 mmHg with dual anti-hypertensive regimen.',
      diagnosingFacility: 'Fortis Memorial Research Institute',
      diagnosingDoctor: 'Dr. Sunita Rao'
    };

    const amitCkd: PatientCondition = {
      id: 'cond-amit-002',
      patientId: amitPatient.id,
      conditionCode: 'N18.2',
      conditionName: 'Chronic Kidney Disease (Stage 2)',
      bodySystem: 'Renal',
      currentStatus: 'MONITORING',
      severity: 'MODERATE',
      firstDocumentedDate: '2024-08-15',
      diagnosedDate: '2024-08-15',
      treatmentSummary: 'ACEi/ARB renal protective therapy, nephrology review every 6 months, hydration guidance.',
      notes: 'Serum Creatinine 1.4 mg/dL, eGFR 68 mL/min/1.73m2. Microalbuminuria tracked at Max Saket.',
      diagnosingFacility: 'Max Super Speciality Hospital',
      diagnosingDoctor: 'Dr. Ananya Mukherjee'
    };

    const amitBronchitis: PatientCondition = {
      id: 'cond-amit-003',
      patientId: amitPatient.id,
      conditionCode: 'J20.9',
      conditionName: 'Acute Bronchitis & Wheezing',
      bodySystem: 'Respiratory',
      currentStatus: 'RESOLVED',
      severity: 'MODERATE',
      firstDocumentedDate: '2023-10-10',
      diagnosedDate: '2023-10-10',
      resolvedDate: '2023-10-22',
      treatmentSummary: 'Inhaled Budesonide/Formoterol for 7 days, symptomatic steam and Azithromycin course.',
      resolvingReportId: 'doc-amit-001',
      notes: 'Diagnosed and resolved at Apollo Hospitals New Delhi. Lungs clear on follow-up auscultation.',
      diagnosingFacility: 'Apollo Hospitals & Heart Institute',
      diagnosingDoctor: 'Dr. Priya Nair'
    };

    this.conditions.push(amitHtn, amitCkd, amitBronchitis);

    // Amit Verma's Cross-Hospital Reports
    this.documents.push(
      {
        id: 'doc-amit-001',
        patientId: amitPatient.id,
        documentType: 'Chest X-Ray & Spirometry Report',
        category: 'Imaging',
        labFacility: 'Apollo Hospitals & Heart Institute',
        issuingHospital: 'Apollo Hospitals & Heart Institute',
        originalFilename: 'Apollo_ChestXRay_Oct2023.pdf',
        fileSize: 1450000,
        mimeType: 'application/pdf',
        sha256Hash: 'a7c8d9e01234567890abcdef1234567890abcdef1234567890abcdef12345678',
        reportDate: '2023-10-22',
        uploadDate: '2023-10-23T10:00:00Z',
        processingStatus: 'COMPLETED',
        extractionConfidence: 0.99,
        pageCount: 2,
        abnormalCount: 0,
        keyFindingsSummary: 'Normal chest radiograph, resolution of peribronchial cuffing. Bronchitis confirmed resolved.'
      },
      {
        id: 'doc-amit-002',
        patientId: amitPatient.id,
        documentType: '24-Hour Ambulatory Blood Pressure & Echo',
        category: 'Cardiovascular' as any,
        labFacility: 'Fortis Memorial Research Institute',
        issuingHospital: 'Fortis Memorial Research Institute',
        originalFilename: 'Fortis_AmbulatoryBP_Feb2024.pdf',
        fileSize: 1820000,
        mimeType: 'application/pdf',
        sha256Hash: 'b8d9e0f11234567890abcdef1234567890abcdef1234567890abcdef12345678',
        reportDate: '2024-02-10',
        uploadDate: '2024-02-11T12:00:00Z',
        processingStatus: 'COMPLETED',
        extractionConfidence: 0.98,
        pageCount: 3,
        abnormalCount: 1,
        keyFindingsSummary: 'Mean Daytime BP 158/98 mmHg. Mild LV diastolic dysfunction. Stage 2 HTN diagnosed.'
      },
      {
        id: 'doc-amit-003',
        patientId: amitPatient.id,
        documentType: 'Renal Function & Estimated GFR Panel',
        category: 'Renal',
        labFacility: 'Max Super Speciality Hospital',
        issuingHospital: 'Max Super Speciality Hospital',
        originalFilename: 'Max_RenalPanel_Aug2024.pdf',
        fileSize: 1210000,
        mimeType: 'application/pdf',
        sha256Hash: 'c9e0f1a21234567890abcdef1234567890abcdef1234567890abcdef12345678',
        reportDate: '2024-08-15',
        uploadDate: '2024-08-16T14:30:00Z',
        processingStatus: 'COMPLETED',
        extractionConfidence: 0.99,
        pageCount: 2,
        abnormalCount: 1,
        keyFindingsSummary: 'Serum Creatinine 1.4 mg/dL (High), eGFR 68 mL/min (CKD Stage 2), BUN 24 mg/dL.'
      }
    );

    // ==========================================
    // PATIENT 4: SUNITA ROY (MED-00010004) - Cross-Hospital History (AIIMS + Dr. Lal)
    // ==========================================
    const sunitaUser: User = {
      id: 'usr-demo-004',
      email: 'sunita.roy@medisutra.in',
      passwordHash: demoPasswordHash,
      role: 'PATIENT',
      createdAt: '2024-01-01T00:00:00Z'
    };
    this.users.push(sunitaUser);

    const sunitaPatient: Patient = {
      id: 'pat-demo-004',
      userId: sunitaUser.id,
      healthId: 'MED-00010004',
      fullName: 'Sunita Roy',
      dob: '1997-03-12',
      gender: 'Female',
      bloodGroup: 'AB+',
      allergies: ['Dust Mites', 'Pollen', 'Sulfa'],
      emergencyContact: {
        name: 'Arjun Roy',
        phone: '+91-9988776655',
        relationship: 'Brother'
      },
      baselineHistory: {
        familialRisks: ['Maternal Bronchial Asthma', 'Atopic Dermatitis'],
        habits: 'Non-smoker, yoga practitioner'
      },
      riskLevel: 'MODERATE',
      lastEncounterDate: '2026-05-19',
      createdAt: '2024-01-01T00:00:00Z'
    };
    this.patients.push(sunitaPatient);

    const sunitaAsthma: PatientCondition = {
      id: 'cond-sunita-001',
      patientId: sunitaPatient.id,
      conditionCode: 'J45.40',
      conditionName: 'Moderate Persistent Bronchial Asthma',
      bodySystem: 'Respiratory',
      currentStatus: 'UNDER_TREATMENT',
      severity: 'MODERATE',
      firstDocumentedDate: '2024-01-20',
      diagnosedDate: '2024-01-20',
      treatmentSummary: 'Fluticasone/Salmeterol 250/50 mcg DPI BID + Levocetirizine 5mg HS.',
      notes: 'Diagnosed at AIIMS Dept of Pulmonary Medicine. Peak Expiratory Flow improved to 85% predicted.',
      diagnosingFacility: 'AIIMS New Delhi',
      diagnosingDoctor: 'Prof. Rajesh K. Verma'
    };

    const sunitaSinusitis: PatientCondition = {
      id: 'cond-sunita-002',
      patientId: sunitaPatient.id,
      conditionCode: 'J01.90',
      conditionName: 'Acute Bacterial Rhinosinusitis',
      bodySystem: 'Respiratory',
      currentStatus: 'RESOLVED',
      severity: 'MILD',
      firstDocumentedDate: '2024-11-05',
      diagnosedDate: '2024-11-05',
      resolvedDate: '2024-11-18',
      treatmentSummary: 'Amoxicillin-Clavulanate 625mg TID for 7 days + Saline nasal irrigation.',
      resolvingReportId: 'doc-sunita-002',
      notes: 'Presented with facial pressure and purulent discharge. Full clinical recovery documented at Max Healthcare.',
      diagnosingFacility: 'Max Super Speciality Hospital',
      diagnosingDoctor: 'Dr. Meenakshi Sundaram'
    };

    this.conditions.push(sunitaAsthma, sunitaSinusitis);

    this.documents.push(
      {
        id: 'doc-sunita-001',
        patientId: sunitaPatient.id,
        documentType: 'Pulmonary Function Test & Fractional exhaled Nitric Oxide (FeNO)',
        category: 'Respiratory' as any,
        labFacility: 'AIIMS New Delhi',
        issuingHospital: 'AIIMS New Delhi',
        originalFilename: 'AIIMS_PFT_FeNO_Jan2024.pdf',
        fileSize: 1390000,
        mimeType: 'application/pdf',
        sha256Hash: 'd0e1f2a31234567890abcdef1234567890abcdef1234567890abcdef12345678',
        reportDate: '2024-01-20',
        uploadDate: '2024-01-21T10:00:00Z',
        processingStatus: 'COMPLETED',
        extractionConfidence: 0.99,
        pageCount: 3,
        abnormalCount: 1,
        keyFindingsSummary: 'FeNO elevated at 48 ppb indicating eosinophilic airway inflammation. FEV1/FVC 71% with 16% bronchodilator reversibility.'
      },
      {
        id: 'doc-sunita-002',
        patientId: sunitaPatient.id,
        documentType: 'Total Serum IgE & Allergen Profiling',
        category: 'Blood',
        labFacility: 'Dr. Lal PathLabs, Delhi NCR',
        issuingHospital: 'Dr. Lal PathLabs, Delhi NCR',
        originalFilename: 'DrLal_IgE_Allergy_Nov2024.pdf',
        fileSize: 1150000,
        mimeType: 'application/pdf',
        sha256Hash: 'e1f2a3b41234567890abcdef1234567890abcdef1234567890abcdef12345678',
        reportDate: '2024-11-18',
        uploadDate: '2024-11-19T11:15:00Z',
        processingStatus: 'COMPLETED',
        extractionConfidence: 0.98,
        pageCount: 2,
        abnormalCount: 1,
        keyFindingsSummary: 'Serum IgE elevated at 340 kU/L. High reactivity to Dermatophagoides pteronyssinus (Dust mites). Acute sinusitis resolved.'
      }
    );
  }

  // ==========================================
  // CROSS-HOSPITAL & HUMAN REPORT CENTER HELPERS
  // ==========================================

  // 1. Cross-Hospital Encounter / Disease Ingestion
  addHospitalDiagnosisEncounter(params: {
    patientId: string;
    hospitalId: string;
    hospitalName: string;
    doctorName: string;
    doctorLicense?: string;
    department?: string;
    conditionName: string;
    conditionCode: string;
    bodySystem: string;
    severity: 'MILD' | 'MODERATE' | 'SEVERE';
    status: 'SUSPECTED' | 'DIAGNOSED' | 'UNDER_TREATMENT' | 'MONITORING' | 'RESOLVED';
    clinicalNotes: string;
    treatmentSummary?: string;
    encounterDate?: string;
  }) {
    const encDate = params.encounterDate || new Date().toISOString().split('T')[0];
    const conditionId = `cond-${Date.now().toString().slice(-6)}`;
    
    // Add Condition with Hospital Provenance
    const newCondition: PatientCondition = {
      id: conditionId,
      patientId: params.patientId,
      conditionCode: params.conditionCode,
      conditionName: params.conditionName,
      bodySystem: params.bodySystem,
      currentStatus: params.status,
      severity: params.severity,
      firstDocumentedDate: encDate,
      diagnosedDate: encDate,
      treatmentSummary: params.treatmentSummary || 'Outpatient clinical regimen prescribed.',
      notes: `${params.clinicalNotes} (Attending: ${params.doctorName}, ${params.hospitalName})`,
      diagnosingFacility: params.hospitalName,
      diagnosingDoctor: params.doctorName
    };
    this.conditions.unshift(newCondition);

    // Add Health Event with Hospital Facility Stamp
    const eventId = `evt-${Date.now().toString().slice(-6)}`;
    const newEvent: HealthEvent = {
      id: eventId,
      patientId: params.patientId,
      conditionId: newCondition.id,
      eventType: 'DIAGNOSIS',
      eventDate: encDate,
      title: `${params.conditionName} Diagnosed at ${params.hospitalName}`,
      summary: `Clinical encounter conducted by ${params.doctorName} (${params.department || 'Outpatient Dept'}). ${params.clinicalNotes}`,
      bodySystem: params.bodySystem,
      severity: params.severity === 'SEVERE' ? 'HIGH' : 'NORMAL',
      hospitalFacility: params.hospitalName,
      attendingDoctor: params.doctorName
    };
    this.healthEvents.unshift(newEvent);

    // Add Condition Stage
    const stageId = `stg-${Date.now().toString().slice(-6)}`;
    this.conditionStages.unshift({
      id: stageId,
      conditionId: newCondition.id,
      stageType: 'DIAGNOSIS',
      stageDate: encDate,
      label: `Clinical Diagnosis at ${params.hospitalName}`,
      description: `Formal diagnosis confirmed by ${params.doctorName}. Regimen: ${params.treatmentSummary || 'Clinical guidance provided.'}`
    });

    // Add Doctor Clinical Note
    const noteId = `note-${Date.now().toString().slice(-6)}`;
    this.clinicalNotes.unshift({
      id: noteId,
      patientId: params.patientId,
      doctorName: params.doctorName,
      doctorSpecialization: params.department || 'Internal Medicine',
      date: encDate,
      content: `[Hospital Encounter: ${params.hospitalName}] Diagnosed '${params.conditionName}' (${params.conditionCode}). Notes: ${params.clinicalNotes}. Rx: ${params.treatmentSummary || 'None'}.`,
      assessmentType: 'ROUTINE_REVIEW'
    });

    // Update patient last encounter
    const patient = this.patients.find(p => p.id === params.patientId);
    if (patient) {
      patient.lastEncounterDate = encDate;
    }

    return { condition: newCondition, event: newEvent };
  }

  // 2. Cross-Hospital Diagnostic Report Ingestion
  addHospitalDiagnosticReport(params: {
    patientId: string;
    hospitalId: string;
    hospitalName: string;
    documentType: string;
    category: 'Metabolic' | 'Blood' | 'Renal' | 'Hepatic' | 'Imaging' | 'Prescription' | 'General';
    reportDate?: string;
    originalFilename?: string;
    keyFindingsSummary: string;
    linkedConditionId?: string;
    markConditionResolved?: boolean;
    extractedLabs?: Array<{
      parameterName: string;
      parameterCode: string;
      numericValue: number;
      rawUnit: string;
      referenceMin: number;
      referenceMax: number;
      flag: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
    }>;
  }) {
    const repDate = params.reportDate || new Date().toISOString().split('T')[0];
    const docId = `doc-${Date.now().toString().slice(-6)}`;
    const filename = params.originalFilename || `${params.documentType.replace(/\s+/g, '_')}_${repDate}.pdf`;
    const abnormalCount = (params.extractedLabs || []).filter(l => l.flag !== 'NORMAL').length;

    // Create Document Record with Hospital Stamp
    const newDoc: DocumentRecord = {
      id: docId,
      patientId: params.patientId,
      documentType: params.documentType,
      category: params.category,
      labFacility: params.hospitalName,
      issuingHospital: params.hospitalName,
      originalFilename: filename,
      fileSize: Math.floor(800000 + Math.random() * 900000),
      mimeType: 'application/pdf',
      sha256Hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      reportDate: repDate,
      uploadDate: new Date().toISOString(),
      processingStatus: 'COMPLETED',
      extractionConfidence: 0.99,
      pageCount: 2,
      abnormalCount,
      keyFindingsSummary: params.keyFindingsSummary
    };
    this.documents.unshift(newDoc);

    // Create Health Event
    const eventId = `evt-${Date.now().toString().slice(-6)}`;
    const newEvent: HealthEvent = {
      id: eventId,
      patientId: params.patientId,
      conditionId: params.linkedConditionId,
      eventType: 'LAB_RESULT',
      eventDate: repDate,
      title: `${params.documentType} Issued by ${params.hospitalName}`,
      summary: `Diagnostic evaluation completed at ${params.hospitalName}. Findings: ${params.keyFindingsSummary}`,
      bodySystem: params.category,
      severity: abnormalCount > 0 ? 'HIGH' : 'NORMAL',
      sourceDocumentId: docId,
      sourcePageNumber: 1,
      hospitalFacility: params.hospitalName
    };
    this.healthEvents.unshift(newEvent);

    // Create Lab Results
    if (params.extractedLabs && params.extractedLabs.length > 0) {
      params.extractedLabs.forEach((lab, idx) => {
        const labId = `lab-${Date.now().toString().slice(-6)}-${idx}`;
        this.labResults.unshift({
          id: labId,
          patientId: params.patientId,
          healthEventId: eventId,
          parameterName: lab.parameterName,
          parameterCode: lab.parameterCode,
          numericValue: lab.numericValue,
          rawUnit: lab.rawUnit,
          normalizedValue: lab.numericValue,
          normalizedUnit: lab.rawUnit,
          referenceMin: lab.referenceMin,
          referenceMax: lab.referenceMax,
          flag: lab.flag,
          observedDate: repDate,
          sourceDocumentId: docId,
          sourcePageNumber: 1
        });
      });
    }

    // If condition marked resolved
    if (params.linkedConditionId && params.markConditionResolved) {
      const condition = this.conditions.find(c => c.id === params.linkedConditionId);
      if (condition) {
        condition.currentStatus = 'RESOLVED';
        condition.resolvedDate = repDate;
        condition.resolvingReportId = docId;
        condition.notes = `${condition.notes || ''} [Resolved by report issued at ${params.hospitalName} on ${repDate}]`.trim();
      }
    }

    // Update patient last encounter
    const patient = this.patients.find(p => p.id === params.patientId);
    if (patient) {
      patient.lastEncounterDate = repDate;
    }

    return { document: newDoc, event: newEvent };
  }

  // 3. Register New Citizen in Central Human Report Center
  registerCitizen(params: {
    fullName: string;
    dob: string;
    gender: string;
    bloodGroup: string;
    allergies?: string[];
    emergencyContact?: { name: string; phone: string; relationship: string };
    baselineHistory?: Record<string, any>;
    registeringHospital?: string;
  }) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('demo1234', salt);
    const userId = `usr-reg-${Date.now().toString().slice(-6)}`;
    const patientId = `pat-reg-${Date.now().toString().slice(-6)}`;
    const seqNum = (this.patients.length + 1).toString().padStart(4, '0');
    const healthId = `MED-0001${seqNum}`;

    const newUser: User = {
      id: userId,
      email: `${params.fullName.toLowerCase().replace(/\s+/g, '.')}.${Date.now().toString().slice(-4)}@medisutra.in`,
      passwordHash,
      role: 'PATIENT',
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);

    const newPatient: Patient = {
      id: patientId,
      userId,
      healthId,
      fullName: params.fullName,
      dob: params.dob,
      gender: params.gender,
      bloodGroup: params.bloodGroup,
      allergies: params.allergies || [],
      emergencyContact: params.emergencyContact || {
        name: 'Primary Contact',
        phone: '+91-9876500000',
        relationship: 'Family'
      },
      baselineHistory: params.baselineHistory || {
        registeredAt: params.registeringHospital || 'Apollo Hospitals',
        notes: 'Enrolled via Central Human Report Center Reception.'
      },
      riskLevel: 'LOW',
      lastEncounterDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    this.patients.unshift(newPatient);

    return newPatient;
  }

  // 4. Create Doctor ID & Credential for Hospital
  createHospitalDoctor(hospitalId: string, doctorData: {
    name: string;
    qualification: string;
    specialization: string;
    department?: string;
    licenseNumber: string;
    password?: string;
  }) {
    const q = (hospitalId || '').toLowerCase().trim();
    const hospital = this.hospitals.find(h => 
      h.id.toLowerCase() === q || 
      h.facilityCode.toLowerCase() === q || 
      h.shortName.toLowerCase().includes(q) ||
      q.includes(h.shortName.toLowerCase()) ||
      h.name.toLowerCase().includes(q)
    );
    if (!hospital) {
      throw new Error(`Hospital facility '${hospitalId}' is not registered in the network.`);
    }

    const doctorId = `doc-${hospital.shortName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString().slice(-4)}`;
    const newDoc = {
      id: doctorId,
      name: doctorData.name,
      qualification: doctorData.qualification || 'MBBS, MD',
      specialization: doctorData.specialization || 'General Medicine',
      licenseNumber: doctorData.licenseNumber
    };

    if (!hospital.activeDoctors) hospital.activeDoctors = [];
    hospital.activeDoctors.push(newDoc);

    // Also add to user accounts so doctor can login
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(doctorData.password || 'doctor123', salt);
    const docUser: User = {
      id: `usr-${doctorId}`,
      email: `${doctorData.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@${hospital.shortName.toLowerCase().replace(/[^a-z0-9]/g, '')}.medisutra.in`,
      passwordHash,
      role: 'DOCTOR',
      createdAt: new Date().toISOString()
    };
    this.users.push(docUser);

    return {
      doctor: newDoc,
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      loginId: doctorData.licenseNumber,
      accountEmail: docUser.email
    };
  }
}

export const db = new DataStore();
