-- MediSutra Database Migration: 0001_initial_pg_schema.sql
-- Description: Zero-downtime PostgreSQL 17 schema with covering composite indexes and audit partitioning
-- Execution Target: Production RDS / Neon / Supabase via PgBouncer (Transaction Pool Mode)

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Enable PgBouncer transaction-mode safe configurations
-- SET LOCAL statement_timeout = '15s';
-- SET LOCAL lock_timeout = '3s';

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

-- 4. Health Events Table
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

-- 6. Regulatory Audit Logs (Range Partitioned by Created Timestamp)
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

-- Quarterly Partitions for 2026
CREATE TABLE IF NOT EXISTS audit_logs_2026_q1 PARTITION OF audit_logs
  FOR VALUES FROM ('2026-01-01 00:00:00+00') TO ('2026-04-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS audit_logs_2026_q2 PARTITION OF audit_logs
  FOR VALUES FROM ('2026-04-01 00:00:00+00') TO ('2026-07-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS audit_logs_2026_q3 PARTITION OF audit_logs
  FOR VALUES FROM ('2026-07-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS audit_logs_2026_q4 PARTITION OF audit_logs
  FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');

COMMIT;

-- ====================================================================
-- CONCURRENT INDEXES (Must be run outside transactional block)
-- ====================================================================
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_health_trajectory 
  ON health_events (patient_id, condition_id, event_date ASC) 
  INCLUDE (clinical_summary, severity);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lab_results_event 
  ON lab_results (health_event_id) 
  INCLUDE (test_name, numeric_value, unit, is_abnormal);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lab_results_patient_param 
  ON lab_results (patient_id, parameter_code, observed_date ASC) 
  INCLUDE (numeric_value, is_abnormal);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_patients_health_id 
  ON patients (health_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_patient_time 
  ON audit_logs (patient_id, created_at DESC);
