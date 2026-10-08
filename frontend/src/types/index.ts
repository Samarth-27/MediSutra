export interface AuthSession {
  role: 'HOSPITAL_ADMIN' | 'DOCTOR' | 'CITIZEN';
  hospital?: any;
  doctor?: any;
  citizen?: any;
  authenticatedAt: string;
}

export interface Patient {
  healthId: string;
  fullName: string;
  abhaNumber: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  phone?: string;
  address?: string;
}

export interface DiseaseCondition {
  id: string;
  conditionName: string;
  conditionCode?: string;
  bodySystem?: string;
  severity?: 'MILD' | 'MODERATE' | 'SEVERE';
  currentStatus: 'ACTIVE' | 'RESOLVED' | 'UNDER_TREATMENT' | 'MANAGED' | 'DIAGNOSED';
  diagnosedDate: string;
  curedDate?: string;
  curedEvidence?: string;
  notes?: string;
  rx?: string;
  department?: string;
  issuingFacility?: string;
  diagnosedByDoctor?: string;
}

export interface DiagnosticReport {
  id: string;
  docType: string;
  title: string;
  category: 'Metabolic' | 'Blood' | 'Renal' | 'Hepatic' | 'Imaging' | 'General';
  date: string;
  issuingFacility: string;
  verifiedBy?: string;
  findingsSummary?: string;
  parameters?: Array<{
    name: string;
    value: string | number;
    unit: string;
    referenceRange: string;
    status: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
    trend?: 'Up' | 'Down' | 'Stable';
  }>;
  relatedConditionId?: string;
  resolvesCondition?: boolean;
}

export interface ClinicalEncounter {
  id: string;
  encounterType: string;
  chiefComplaint: string;
  diagnosis: string;
  icd10Code?: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE';
  notes: string;
  rx?: string;
  department: string;
  hospitalName: string;
  doctorName: string;
  date: string;
}

export interface Hospital {
  id: string;
  name: string;
  code?: string;
  city?: string;
  state?: string;
  category?: string;
  type?: string;
  accreditation?: string;
  doctorsCount?: number;
  availableBeds?: number;
  opdQueueCount?: number;
}

export interface Doctor {
  id: string;
  name: string;
  qualification?: string;
  specialization?: string;
  department?: string;
  licenseNumber?: string;
  hospitalId?: string;
  hospitalName?: string;
  patientsCount?: number;
  activeEncountersCount?: number;
  status?: string;
}

export interface PatientDossier {
  patient: Patient;
  activeConditions: DiseaseCondition[];
  curedConditions: DiseaseCondition[];
  allReports: DiagnosticReport[];
  encounters?: ClinicalEncounter[];
  metrics?: {
    totalEncounters: number;
    activeConditionsCount: number;
    curedConditionsCount: number;
    diagnosticReportsCount: number;
    lastVisitDate: string;
  };
}

export interface ProjectedComplication {
  condition: string;
  potentialComplication: string;
  organSystem: string;
  riskLevel: 'HIGH' | 'MODERATE' | 'LOW';
  surveillanceTest: string;
  rationale: string;
}

export interface RagMetadata {
  retrievalMethod: string;
  documentsRetrievedCount: number;
  lifetimeConditionsEvaluatedCount: number;
  biomarkersAnalyzedCount: number;
  groundingScore: number;
  guidelinesApplied: string[];
  projectedComplications: ProjectedComplication[];
}

export interface AiDoctorAnalysisResponse {
  answer: string;
  correlatedConditions: DiseaseCondition[];
  correlatedLabs: Array<{
    parameterName: string;
    latestValue: string | number;
    latestUnit: string;
    latestDate: string;
    referenceRange: string;
    latestFlag: string;
    baselineValue: string | number;
    baselineDate: string;
    trend: 'Down' | 'Up' | 'Stable';
  }>;
  citations: Array<{
    documentTitle: string;
    snippet: string;
  }>;
  ragMetadata?: RagMetadata;
}

