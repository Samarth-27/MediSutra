# MediSutra: Multi-Level Architecture Entity-Relationship (ER) Model
### Unified Data Architecture for Multi-Hospital Consoles, Sovereign Citizen DigiLocker, and National Health Interoperability

---

## 1. Executive Summary & Design Principles

MediSutra is structured as a **Multi-Level Federated Healthcare Operating Platform**:
1. **Tier 1 — Institutional Consoles (Multi-Hospital Dashboards)**: Distinct operating consoles for accredited hospital facilities (e.g., Apollo Hospitals, Fortis Healthcare, Max Healthcare, AIIMS New Delhi) and national diagnostic laboratories (Dr. Lal PathLabs, Metropolis Healthcare). Each facility manages live OPD triage, admitted walk-ins, specialist duty rosters, and certified issued documents.
2. **Tier 2 — Sovereign Citizen Health DigiLocker (Patient Platform)**: A single unified health locker for every citizen (aligned with India's Ayushman Bharat Digital Mission - ABDM). When a citizen visits **any** hospital or diagnostic center, all encounters, diagnoses, prescriptions, and lab reports are digitally pushed and synchronized into their personal health wallet.
3. **Tier 3 — Longitudinal Clinical Intelligence Engine**: Neuro-symbolic deterministic clinical tracking that organizes lifetime health records into active ongoing illnesses vs. past resolved conditions (supported by resolving lab evidence), cross-hospital biomarker trajectories, and FHIR R4 interoperability.
4. **Tier 4 — Consent & Governance Layer**: Compliant with the Digital Personal Data Protection Act (DPDPA 2023) and ABDM Consent Framework, enforcing fine-grained hospital access tokens, audit trails, and revocation mechanisms.

---

## 2. High-Level Conceptual Model

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                      INSTITUTIONAL TIER (HOSPITALS)                    │
 │                                                                        │
 │  ┌───────────────────────┐            ┌─────────────────────────────┐  │
 │  │   HOSPITAL_FACILITY   │◀───1:N────▶│      DOCTOR_SPECIALIST      │  │
 │  └───────────┬───────────┘            └──────────────┬──────────────┘  │
 │              │ 1:N                                   │ 1:N             │
 │              ▼                                       ▼                 │
 │  ┌───────────────────────┐            ┌─────────────────────────────┐  │
 │  │   OPD_TRIAGE_QUEUE    │            │     CLINICAL_ENCOUNTER      │  │
 │  └───────────────────────┘            └──────────────┬──────────────┘  │
 └──────────────────────────────────────────────────────┼─────────────────┘
                                                        │
                      SYNCHRONIZED VIA ABDM / DIGILOCKER│
                                                        ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                      CITIZEN DIGILOCKER TIER (SOVEREIGN)               │
 │                                                                        │
 │  ┌───────────────────────┐            ┌─────────────────────────────┐  │
 │  │    PATIENT_CITIZEN    │◀───1:1────▶│    ABHA_HEALTH_IDENTITY     │  │
 │  └───────────┬───────────┘            └─────────────────────────────┘  │
 │              │                                                         │
 │      ┌───────┴───────────────────────────────┐                         │
 │      │ 1:N                                   │ 1:N                     │
 │      ▼                                       ▼                         │
 │  ┌───────────────────────┐            ┌─────────────────────────────┐  │
 │  │   CLINICAL_CONDITION  │            │      MEDICAL_DOCUMENT       │  │
 │  │  (Active vs Resolved) │            │   (Officially Issued Vault) │  │
 │  └───────────┬───────────┘            └──────────────┬──────────────┘  │
 │              │                                       │                 │
 │              │ 0..1:1 (Resolving Evidence Link)      │ 1:N             │
 │              └──────────────────────────────────────▶│                 │
 │                                                      ▼                 │
 │                                       ┌─────────────────────────────┐  │
 │                                       │    BIOMARKER_OBSERVATION    │  │
 │                                       │ (HbA1c, Glucose, Lipids...) │  │
 │                                       └─────────────────────────────┘  │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Complete Logical Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    HOSPITAL_FACILITY ||--o{ HOSPITAL_ADMIN_ACCOUNT : "authenticated_by"
    HOSPITAL_FACILITY ||--o{ HOSPITAL_DEPARTMENT : "operates"
    HOSPITAL_FACILITY ||--o{ DOCTOR_SPECIALIST : "provisions_and_employs"
    HOSPITAL_FACILITY ||--o{ DOCTOR_CREDENTIAL : "issues_doctor_id"
    HOSPITAL_FACILITY ||--o{ OPD_TRIAGE_QUEUE : "manages"
    HOSPITAL_FACILITY ||--o{ MEDICAL_DOCUMENT : "issues_and_submits"
    HOSPITAL_FACILITY ||--o{ CLINICAL_ENCOUNTER : "hosts"
    HOSPITAL_FACILITY ||--o{ CONSENT_ARTIFACT : "requests_access_to"

    DOCTOR_SPECIALIST ||--|| DOCTOR_CREDENTIAL : "authenticates_via"

    PATIENT_CITIZEN ||--|| PATIENT_CREDENTIAL : "authenticates_via"
    PATIENT_CITIZEN ||--|| ABHA_HEALTH_IDENTITY : "owns_sovereign_id"
    PATIENT_CITIZEN ||--o{ OPD_TRIAGE_QUEUE : "enqueued_in"
    PATIENT_CITIZEN ||--o{ CLINICAL_ENCOUNTER : "participates_in"
    PATIENT_CITIZEN ||--o{ CLINICAL_CONDITION : "experiences"
    PATIENT_CITIZEN ||--o{ MEDICAL_DOCUMENT : "stores_in_digilocker"
    PATIENT_CITIZEN ||--o{ CONSENT_ARTIFACT : "grants_or_revokes"
    PATIENT_CITIZEN ||--o{ AUDIT_ACCESS_LOG : "monitors_access_on"

    DOCTOR_SPECIALIST ||--o{ CLINICAL_ENCOUNTER : "attends"
    DOCTOR_SPECIALIST ||--o{ CLINICAL_CONDITION : "diagnoses"
    DOCTOR_SPECIALIST ||--o{ CLINICAL_NOTE : "authors"
    DOCTOR_SPECIALIST ||--o{ PRESCRIPTION_ORDER : "prescribes"

    CLINICAL_ENCOUNTER ||--o{ CLINICAL_NOTE : "contains"
    CLINICAL_ENCOUNTER ||--o{ PRESCRIPTION_ORDER : "originates"
    CLINICAL_ENCOUNTER ||--o{ MEDICAL_DOCUMENT : "orders_or_generates"

    MEDICAL_DOCUMENT ||--o{ BIOMARKER_OBSERVATION : "reports_findings"
    MEDICAL_DOCUMENT ||--o{ DOCUMENT_DIGITAL_SIGNATURE : "stamped_with"
    
    CLINICAL_CONDITION ||--o{ PRESCRIPTION_ORDER : "treated_by"
    CLINICAL_CONDITION ||--o| MEDICAL_DOCUMENT : "resolved_by_evidence"

    CONSENT_ARTIFACT ||--o{ AUDIT_ACCESS_LOG : "authorizes"

    HOSPITAL_FACILITY {
        uuid id PK
        string facility_code UK "HIP-IN-DEL-001"
        string name "Apollo Hospitals & Heart Institute"
        string short_name "Apollo Hospitals"
        string facility_type "SUPER_SPECIALITY | APEX_NATIONAL | DIAGNOSTIC_LAB"
        string tier "ABDM Tier-1"
        string city "New Delhi"
        string state "Delhi"
        string address
        string phone
        string emergency_phone
        jsonb accreditation_badges "['NABH', 'JCI', 'NABL']"
        boolean is_active
        timestamp created_at
    }

    HOSPITAL_ADMIN_ACCOUNT {
        uuid id PK
        uuid hospital_id FK
        string facility_code "HIP-IN-DEL-001"
        string admin_email UK "admin@apollo.medisutra.in"
        string password_hash "$2b$12$..."
        string role "HOSPITAL_ADMIN"
        string authorized_officer_name "Medical Superintendent Dr. S. Mukherjee"
        timestamp last_login_at
    }

    DOCTOR_CREDENTIAL {
        uuid id PK
        uuid doctor_id FK, UK
        uuid created_by_hospital_id FK
        string login_id UK "doc-apollo-priya"
        string password_hash "$2b$12$..."
        string mci_license "MCI-DL-2015-84920"
        boolean is_active true
        timestamp created_at
    }

    PATIENT_CREDENTIAL {
        uuid id PK
        uuid patient_id FK, UK
        string login_identifier UK "91-4402-9812-1001"
        string auth_type "ABHA_OTP_MOBILE"
        string mobile_phone "+91-98101XXXXX"
        timestamp last_authenticated_at
    }

    HOSPITAL_DEPARTMENT {
        uuid id PK
        uuid hospital_id FK
        string code "CARD-01"
        string name "Cardiology & Heart Failure"
        string floor_wing "Block B, 3rd Floor"
        string opd_timings "08:00 - 20:00"
    }

    DOCTOR_SPECIALIST {
        uuid id PK
        uuid hospital_id FK
        uuid department_id FK
        string license_number UK "MCI-DL-2015-84920"
        string name "Dr. Priya Nair"
        string qualification "MBBS, MD (Medicine), DM (Endocrinology)"
        string specialization "Internal Medicine & Diabetology"
        string contact_email
        string contact_phone
        boolean is_on_duty
    }

    PATIENT_CITIZEN {
        uuid id PK
        string uhid UK "MED-00010001"
        string full_name "Rahul Sharma"
        date date_of_birth "1988-04-15"
        string gender "Male"
        string blood_group "B+"
        jsonb allergies "['Penicillin', 'Sulfa']"
        jsonb chronic_tags "['Type 2 Diabetes', 'Dyslipidemia']"
        string emergency_contact_name
        string emergency_contact_phone
        string primary_residence_city "New Delhi"
        timestamp registered_at
    }

    ABHA_HEALTH_IDENTITY {
        uuid id PK
        uuid patient_id FK, UK
        string abha_number UK "91-4402-9812-1001"
        string abha_address UK "rahulsharma@abdm"
        string mobile_linked "+91-98101XXXXX"
        string kyc_status "AADHAAR_VERIFIED"
        string qr_code_payload "MEDISUTRA://HRC/PATIENT?uhid=MED-00010001"
        timestamp verified_at
    }

    OPD_TRIAGE_QUEUE {
        uuid id PK
        uuid hospital_id FK
        uuid patient_id FK
        uuid attending_doctor_id FK
        string token_number "DEL-001-101"
        string triage_priority "URGENT | ROUTINE | FOLLOW_UP | CONSULTATION"
        string chief_complaint "Glycemic follow-up & HbA1c review"
        string status "CHECKED_IN | WAITING | IN_CONSULTATION | COMPLETED"
        timestamp check_in_time
        timestamp consultation_start_time
    }

    CLINICAL_ENCOUNTER {
        uuid id PK
        uuid hospital_id FK
        uuid patient_id FK
        uuid doctor_id FK
        string encounter_type "OPD | EMERGENCY | INPATIENT | LAB_COLLECTION"
        date encounter_date
        string clinical_summary
        string vital_signs_bp "128/82"
        float vital_signs_pulse 74.0
        float vital_signs_temp 98.4
        float vital_signs_weight_kg 72.5
        timestamp created_at
    }

    CLINICAL_CONDITION {
        uuid id PK
        uuid patient_id FK
        uuid diagnosing_doctor_id FK
        uuid diagnosing_facility_id FK
        string condition_name "Type 2 Diabetes Mellitus"
        string icd10_code "E11.9"
        string body_system "Endocrine & Metabolic"
        string severity "MILD | MODERATE | SEVERE"
        string current_status "DIAGNOSED | UNDER_TREATMENT | STABLE | RESOLVED"
        date first_documented_date
        date diagnosed_date
        date resolved_date
        uuid resolving_report_id FK "References confirmatory normal lab document"
        text clinical_notes
        text treatment_summary
    }

    MEDICAL_DOCUMENT {
        uuid id PK
        uuid patient_id FK
        uuid issuing_facility_id FK
        uuid encounter_id FK
        string document_type "Comprehensive Metabolic Panel"
        string category "Metabolic | Blood | Renal | Hepatic | Imaging | Prescription"
        string original_filename "CMP_Apollo_2026_07.pdf"
        string storage_uri "/vault/patients/pat-001/docs/doc-011.pdf"
        date report_date
        date upload_date
        int file_size_bytes
        string mime_type "application/pdf"
        string sha256_hash "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
        text key_findings_summary "Fasting plasma glucose 126 mg/dL, HbA1c 6.8% (Improved)"
        int abnormal_parameters_count 2
        boolean is_digilocker_verified true
    }

    DOCUMENT_DIGITAL_SIGNATURE {
        uuid id PK
        uuid document_id FK, UK
        string algorithm "SHA256withRSA"
        string certificate_thumbprint "ABDM-MOHFW-ROOT-CA-2024"
        string signed_by "Apollo Hospitals Health Information Provider (HIP)"
        timestamp signed_at
        string verification_status "VALID_OFFICIAL_ISSUED_LOCKER_RECORD"
    }

    BIOMARKER_OBSERVATION {
        uuid id PK
        uuid document_id FK
        uuid patient_id FK
        string parameter_name "HbA1c (Glycated Hemoglobin)"
        string parameter_code "HBA1C"
        string loinc_code "4548-4"
        float numeric_value 6.8
        string unit "%"
        float reference_range_min 4.0
        float reference_range_max 5.6
        string flag "HIGH | NORMAL | LOW | CRITICAL"
        date observation_date
        text interpretation "Improving glycemic control compared to baseline 8.7%"
    }

    PRESCRIPTION_ORDER {
        uuid id PK
        uuid encounter_id FK
        uuid patient_id FK
        uuid doctor_id FK
        uuid condition_id FK
        string medication_name "Metformin Hydrochloride"
        string dosage "500 mg"
        string frequency "Twice Daily (BID) after meals"
        string duration "90 Days"
        date start_date
        date end_date
        string instructions "Monitor fasting blood glucose bi-weekly"
    }

    CLINICAL_NOTE {
        uuid id PK
        uuid encounter_id FK
        uuid patient_id FK
        uuid doctor_id FK
        string note_type "ROUTINE_REVIEW | EMERGENCY_ADMISSION | DISCHARGE_SUMMARY"
        date note_date
        text subjective_complaint
        text objective_findings
        text assessment
        text clinical_plan
    }

    CONSENT_ARTIFACT {
        uuid id PK
        uuid patient_id FK
        uuid hospital_facility_id FK
        string abdm_consent_id UK "CONS-ABDM-2026-99124"
        string consent_mode "VIEW_ONLY | FULL_CLINICAL_READ_WRITE"
        string purpose "Direct Patient Care & Longitudinal Review"
        date valid_from
        date valid_to
        string status "GRANTED | REVOKED | EXPIRED"
        timestamp granted_at
        timestamp revoked_at
    }

    AUDIT_ACCESS_LOG {
        uuid id PK
        uuid patient_id FK
        uuid hospital_facility_id FK
        uuid accessed_by_doctor_id FK
        string action "PULL_DIGILOCKER_RECORD | VIEW_LAB_REPORT | EXPORT_FHIR"
        string record_accessed_id "doc-011"
        string client_ip "10.14.0.88"
        timestamp access_timestamp
        string purpose "OPD Consultation Token DEL-001-101"
    }
```

---

## 4. Detailed Entity Specifications & Data Dictionaries

### 4.1 Institutional Tier (Multi-Hospital Dashboards)

#### Entity: `HOSPITAL_FACILITY`
Represents an accredited hospital or independent diagnostic laboratory participating in the national health exchange.
- **Primary Key**: `id` (UUID)
- **Alternate Keys**: `facility_code` (e.g., `HIP-IN-DEL-001`, unique national HIP code)
- **Attributes**:
  - `name`: Full registered institutional name (e.g., *Apollo Hospitals & Heart Institute*).
  - `short_name`: Display label for quick switching (e.g., *Apollo Hospitals*).
  - `facility_type`: Categorizes capability (`SUPER_SPECIALITY`, `APEX_NATIONAL`, `DIAGNOSTIC_LAB`).
  - `tier`: ABDM tier level (`ABDM Tier-1`, `Apex National`, `Reference Lab`).
  - `accreditation_badges`: Array of quality standards (`NABH`, `JCI`, `NABL`, `CAP`).
  - `is_active`: Operational status flag.

#### Entity: `HOSPITAL_DEPARTMENT`
Organizational clinical divisions within a hospital facility.
- **Foreign Key**: `hospital_id` -> `HOSPITAL_FACILITY(id)` (ON DELETE CASCADE)
- **Cardinality**: 1 Hospital has Many Departments (1:N).

#### Entity: `DOCTOR_SPECIALIST`
Credentialed physician or pathologist authorized to log diagnoses, prescribe treatments, and issue certified reports.
- **Primary Key**: `id` (UUID)
- **Alternate Key**: `license_number` (National Medical Commission / State Medical Council unique license).
- **Foreign Keys**: 
  - `hospital_id` -> `HOSPITAL_FACILITY(id)`
  - `department_id` -> `HOSPITAL_DEPARTMENT(id)`
- **Cardinality**: 1 Hospital employs Many Specialists (1:N).

#### Entity: `OPD_TRIAGE_QUEUE`
Active walk-in and scheduled patient queue for the facility's live operating console.
- **Foreign Keys**:
  - `hospital_id` -> `HOSPITAL_FACILITY(id)`
  - `patient_id` -> `PATIENT_CITIZEN(id)`
  - `attending_doctor_id` -> `DOCTOR_SPECIALIST(id)`
- **Attributes**:
  - `token_number`: Formatted queue token (e.g., `DEL-001-101`).
  - `triage_priority`: `URGENT`, `ROUTINE`, `FOLLOW_UP`, `CONSULTATION`.
  - `status`: `CHECKED_IN`, `WAITING`, `IN_CONSULTATION`, `COMPLETED`.

---

### 4.2 Citizen DigiLocker Tier (Sovereign Patient Records)

#### Entity: `PATIENT_CITIZEN`
Master sovereign record of the individual citizen.
- **Primary Key**: `id` (UUID)
- **Alternate Key**: `uhid` (Unique Health Identifier, e.g., `MED-00010001`).
- **Attributes**: Demographics, blood group, allergies array, chronic risk tags, emergency contacts.

#### Entity: `ABHA_HEALTH_IDENTITY`
Government of India Ayushman Bharat Digital Mission (ABDM) sovereign health credential.
- **Primary Key**: `id` (UUID)
- **Foreign Key**: `patient_id` -> `PATIENT_CITIZEN(id)` (UNIQUE, 1:1 relationship).
- **Attributes**:
  - `abha_number`: 14-digit standardized national health ID (`91-4402-9812-1001`).
  - `abha_address`: Federated health handle (`rahulsharma@abdm`).
  - `qr_code_payload`: Encrypted digital payload for touchless QR hospital check-ins.

#### Entity: `CONSENT_ARTIFACT`
Standardized consent grant regulating which hospitals can access the citizen's DigiLocker data.
- **Foreign Keys**:
  - `patient_id` -> `PATIENT_CITIZEN(id)`
  - `hospital_facility_id` -> `HOSPITAL_FACILITY(id)`
- **Attributes**:
  - `abdm_consent_id`: Nationally signed consent token.
  - `consent_mode`: `VIEW_ONLY` vs `FULL_CLINICAL_READ_WRITE`.
  - `status`: `GRANTED`, `REVOKED`, `EXPIRED`.

---

### 4.3 Diagnostic Vault & Lifetime Clinical Record Tier

#### Entity: `MEDICAL_DOCUMENT`
Official health records (lab panels, radiology summaries, discharge cards) officially pushed by hospitals or labs.
- **Primary Key**: `id` (UUID)
- **Foreign Keys**:
  - `patient_id` -> `PATIENT_CITIZEN(id)` (Document belongs to Citizen DigiLocker)
  - `issuing_facility_id` -> `HOSPITAL_FACILITY(id)` (Document issued by Hospital)
  - `encounter_id` -> `CLINICAL_ENCOUNTER(id)` (Optional: generated during visit)
- **Attributes**:
  - `category`: `Metabolic`, `Blood`, `Renal`, `Hepatic`, `Imaging`, `Prescription`.
  - `sha256_hash`: Cryptographic digest guaranteeing document integrity.
  - `key_findings_summary`: Deterministic clinical summary.
  - `is_digilocker_verified`: True if signed by accredited institution.

#### Entity: `DOCUMENT_DIGITAL_SIGNATURE`
PKI cryptographic stamp validating authenticity under ABDM and MoHFW standards.
- **Foreign Key**: `document_id` -> `MEDICAL_DOCUMENT(id)` (UNIQUE, 1:1).
- **Attributes**: `algorithm`, `certificate_thumbprint`, `signed_by`, `signed_at`.

#### Entity: `BIOMARKER_OBSERVATION`
Granular discrete lab measurements extracted from diagnostic documents.
- **Foreign Keys**:
  - `document_id` -> `MEDICAL_DOCUMENT(id)`
  - `patient_id` -> `PATIENT_CITIZEN(id)`
- **Attributes**:
  - `parameter_name`: e.g., *HbA1c (Glycated Hemoglobin)*.
  - `parameter_code`: Standardized biomarker code (`HBA1C`, `GLU_FAST`, `CREATININE`).
  - `loinc_code`: Logical Observation Identifiers Names and Codes standard.
  - `numeric_value`: Continuous metric (e.g., `6.8`).
  - `unit`: Measurement unit (`%`, `mg/dL`).
  - `reference_range_min`, `reference_range_max`: Physiological normal limits.
  - `flag`: `NORMAL`, `HIGH`, `LOW`, `CRITICAL`.

#### Entity: `CLINICAL_CONDITION`
Longitudinal record of medical illnesses across the citizen's lifespan.
- **Primary Key**: `id` (UUID)
- **Foreign Keys**:
  - `patient_id` -> `PATIENT_CITIZEN(id)`
  - `diagnosing_doctor_id` -> `DOCTOR_SPECIALIST(id)`
  - `diagnosing_facility_id` -> `HOSPITAL_FACILITY(id)`
  - `resolving_report_id` -> `MEDICAL_DOCUMENT(id)` (Optional 0..1 relationship: **The core proof link** connecting a resolved condition to the confirmatory normal lab report).
- **Attributes**:
  - `condition_name`: e.g., *Severe Vitamin D Deficiency*, *Type 2 Diabetes Mellitus*.
  - `icd10_code`: International Classification of Diseases code (`E55.9`, `E11.9`).
  - `current_status`: `DIAGNOSED`, `UNDER_TREATMENT`, `STABLE`, `RESOLVED`.
  - `first_documented_date`, `diagnosed_date`, `resolved_date`.

---

## 5. Relational Normalization & Integrity Proof

| Normal Form | Compliance Criteria | How MediSutra Satisfies It |
|---|---|---|
| **1NF (First Normal Form)** | Atomic values, unique records, defined primary keys | All attributes contain atomic scalar values. Repeating lab parameters are factored into the child entity `BIOMARKER_OBSERVATION` rather than stored as delimited strings. |
| **2NF (Second Normal Form)** | 1NF satisfied + No partial key dependencies | Every non-key attribute is fully functionally dependent on the entire composite or surrogate primary key (`id`). |
| **3NF (Third Normal Form)** | 2NF satisfied + No transitive dependencies | Facility details (city, tier, badges) belong to `HOSPITAL_FACILITY`. Documents and Encounters reference `hospital_id` as foreign keys rather than storing facility metadata transitively. |
| **BCNF (Boyce-Codd NF)** | Every determinant is a candidate key | Alternate unique keys (`uhid`, `abha_number`, `facility_code`, `license_number`) strictly determine unique entities across the national network. |

---

## 6. End-to-End Cross-Hospital Workflow (The "DigiLocker" Journey)

```
[Day 1: Dr. Lal PathLabs]
1. Patient Rahul Sharma has blood drawn.
2. Lab enters Fasting Glucose (126 mg/dL) & HbA1c (6.8%).
3. System creates MEDICAL_DOCUMENT with issuing_facility_id = 'Dr. Lal PathLabs'.
4. Creates 2 BIOMARKER_OBSERVATION records.
5. System stamps PKI SHA-256 signature -> Directly pushed to Rahul's Sovereign DigiLocker.
                           │
                           ▼ (Automatic Network Synchronization)
[Day 3: Apollo Hospitals OPD]
6. Rahul walks into Apollo Hospitals.
7. Apollo reception checks Rahul into OPD_TRIAGE_QUEUE with token DEL-001-101.
8. Dr. Priya Nair opens Apollo Hospital Operating Dashboard.
9. Clicks "Pull DigiLocker Record →".
10. System verifies CONSENT_ARTIFACT and generates an AUDIT_ACCESS_LOG.
11. Dr. Priya Nair sees the complete cross-hospital dossier:
    - Yesterday's Dr. Lal PathLabs report (HbA1c 6.8%)
    - Max Healthcare's 2024 ultrasound
    - AIIMS past viral fever resolution
12. Dr. Priya updates CLINICAL_CONDITION ("Type 2 Diabetes Mellitus" -> STABLE) 
    and writes a new PRESCRIPTION_ORDER.
13. Apollo's encounter note is stamped and added to Rahul's DigiLocker.
                           │
                           ▼
[Next Month: Max Healthcare / Fortis]
14. If Rahul visits Max Healthcare or Fortis, their doctors immediately 
    see the complete updated record without manual paperwork!
```

---

## 7. Migration & Implementation Strategy

1. **Database Schema Enforcement**:
   - Align `backend/src/database/store.ts` and Postgres migrations to match these relational tables and foreign keys.
2. **Deterministic Foreign Key Integrity**:
   - Enforce that every issued document references `issuing_facility_id`.
   - Enforce that every resolved condition explicitly links its `resolving_report_id` to the confirmatory lab panel document.
3. **API Alignment**:
   - Institutional route: `/api/v1/hospitals/:facilityId/dashboard` returns queue, facility staff, and issued documents.
   - DigiLocker route: `/api/v1/hospitals/patients/:patientId/digilocker` returns the aggregate sovereign wallet.
