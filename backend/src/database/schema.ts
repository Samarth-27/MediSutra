/**
 * MediSutra Production PostgreSQL Schema (Drizzle ORM & PgBouncer Compatible)
 * 
 * Compliant with:
 * - ABDM (Ayushman Bharat Digital Mission) Health Data Management Policy
 * - Indian Digital Personal Data Protection Act (DPDPA 2023)
 * - HL7 FHIR R4 Clinical Information Model
 */

export interface DbUser {
  id: string;
  email: string;
  passwordHash: string;
  role: 'PATIENT' | 'DOCTOR' | 'HOSPITAL_ADMIN' | 'ADMIN';
  createdAt: string;
}

export interface DbPatient {
  id: string;
  userId: string;
  healthId: string; // e.g. MED-00010001 (ABHA Compatible)
  fullName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  allergies: string[];
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  assignedHospitalId?: string;
  assignedDoctorIds: string[];
  createdAt: string;
}

export interface DbPatientCondition {
  id: string;
  patientId: string;
  conditionName: string;
  icdCode: string; // ICD-10 e.g. E11.9
  bodySystem: string;
  currentStatus: 'SUSPECTED' | 'DIAGNOSED' | 'UNDER_TREATMENT' | 'CHRONIC' | 'RESOLVED';
  diagnosedDate: string;
  resolvedDate?: string;
  diagnosingFacility: string;
  notes?: string;
}

export interface DbHealthEvent {
  id: string;
  patientId: string;
  conditionId?: string;
  eventType: 'CONSULTATION' | 'LAB_TEST' | 'HOSPITALIZATION' | 'PRESCRIPTION' | 'DISCHARGE';
  eventDate: string;
  title: string;
  summary: string;
  bodySystem: string;
  severity: 'NORMAL' | 'MILD' | 'MODERATE' | 'SEVERE';
  hospitalFacility: string;
  attendingDoctor: string;
  clinicalSummary?: string; // Included in composite covering index
}

export interface DbDocumentRecord {
  id: string;
  patientId: string;
  title: string;
  category: 'LAB_REPORT' | 'DISCHARGE_SUMMARY' | 'PRESCRIPTION' | 'IMAGING';
  reportDate: string;
  issuingHospital: string;
  labFacility?: string;
  fileUrl: string;
  mimeType: string;
  extractedText?: string;
}

export interface DbLabResult {
  id: string;
  patientId: string;
  sourceDocumentId: string;
  healthEventId?: string;
  testName: string;
  parameterCode: string; // LOINC code e.g. 4548-4 for HbA1c
  numericValue: number;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
  observedDate: string;
}

export interface DbAuditLog {
  id: string;
  actorId: string;
  actorRole: string;
  action: 'READ_DOSSIER' | 'EXPORT_FHIR' | 'RECORD_DIAGNOSIS' | 'ISSUE_REPORT' | 'CURE_CERTIFICATION';
  patientId: string;
  resourceType: string;
  resourceId: string;
  facilityId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string; // Partition key (PARTITION BY RANGE (created_at))
}

/**
 * SQL Schema DDL Definitions & Migration Specification
 */
export const POSTGRES_SCHEMA_SQL = `
-- ====================================================================
-- MediSutra Production PostgreSQL 17 DDL with Zero-Downtime Indexes
-- ====================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'PATIENT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Patients Table
CREATE TABLE IF NOT EXISTS patients (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  health_id VARCHAR(64) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  dob DATE NOT NULL,
  gender VARCHAR(32) NOT NULL,
  blood_group VARCHAR(16) NOT NULL,
  allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
  assigned_doctor_id VARCHAR(64),
  assigned_doctor_name VARCHAR(255),
  assigned_hospital_id VARCHAR(64),
  assigned_doctor_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_patients_health_id ON patients(health_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_patients_assigned_doctor ON patients(assigned_doctor_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_patients_assigned_hospital ON patients(assigned_hospital_id);

-- 3. Patient Conditions Table
CREATE TABLE IF NOT EXISTS patient_conditions (
  id VARCHAR(64) PRIMARY KEY,
  patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  condition_name VARCHAR(255) NOT NULL,
  icd_code VARCHAR(32) NOT NULL,
  body_system VARCHAR(64) NOT NULL,
  current_status VARCHAR(32) NOT NULL,
  diagnosed_date DATE NOT NULL,
  resolved_date DATE,
  diagnosing_facility VARCHAR(255) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conditions_patient_status 
  ON patient_conditions(patient_id, current_status);

-- 4. Longitudinal Health Events Table
CREATE TABLE IF NOT EXISTS health_events (
  id VARCHAR(64) PRIMARY KEY,
  patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  condition_id VARCHAR(64) REFERENCES patient_conditions(id) ON DELETE SET NULL,
  event_type VARCHAR(64) NOT NULL,
  event_date DATE NOT NULL,
  title VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  body_system VARCHAR(64) NOT NULL,
  severity VARCHAR(32) NOT NULL DEFAULT 'NORMAL',
  hospital_facility VARCHAR(255) NOT NULL,
  attending_doctor VARCHAR(255) NOT NULL,
  clinical_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Zero-Downtime Covering Index for Biometric Trajectory & Event Graph
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_health_trajectory 
  ON health_events (patient_id, condition_id, event_date ASC) 
  INCLUDE (clinical_summary, severity);

-- 5. Diagnostic Lab Results Table
CREATE TABLE IF NOT EXISTS lab_results (
  id VARCHAR(64) PRIMARY KEY,
  patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  source_document_id VARCHAR(64),
  health_event_id VARCHAR(64) REFERENCES health_events(id) ON DELETE CASCADE,
  test_name VARCHAR(255) NOT NULL,
  parameter_code VARCHAR(64) NOT NULL,
  numeric_value NUMERIC(10, 3) NOT NULL,
  unit VARCHAR(32) NOT NULL,
  reference_range VARCHAR(64) NOT NULL,
  is_abnormal BOOLEAN NOT NULL DEFAULT FALSE,
  observed_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Covering Index for High-Velocity Lab Trajectory Lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lab_results_event 
  ON lab_results (health_event_id) 
  INCLUDE (test_name, numeric_value, unit, is_abnormal);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lab_results_patient_param 
  ON lab_results (patient_id, parameter_code, observed_date ASC) 
  INCLUDE (numeric_value, is_abnormal);

-- 6. Regulatory Audit Logs (Partitioned by Range on created_at for DPDPA Compliance)
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(64) NOT NULL,
  actor_id VARCHAR(64) NOT NULL,
  actor_role VARCHAR(32) NOT NULL,
  action VARCHAR(64) NOT NULL,
  patient_id VARCHAR(64) NOT NULL,
  resource_type VARCHAR(64) NOT NULL,
  resource_id VARCHAR(64) NOT NULL,
  facility_id VARCHAR(64) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Partitions for 2026 Quarters
CREATE TABLE IF NOT EXISTS audit_logs_2026_q1 PARTITION OF audit_logs
  FOR VALUES FROM ('2026-01-01 00:00:00+00') TO ('2026-04-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS audit_logs_2026_q2 PARTITION OF audit_logs
  FOR VALUES FROM ('2026-04-01 00:00:00+00') TO ('2026-07-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS audit_logs_2026_q3 PARTITION OF audit_logs
  FOR VALUES FROM ('2026-07-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS audit_logs_2026_q4 PARTITION OF audit_logs
  FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');

CREATE INDEX IF NOT EXISTS idx_audit_logs_patient_time 
  ON audit_logs (patient_id, created_at DESC);
`;
