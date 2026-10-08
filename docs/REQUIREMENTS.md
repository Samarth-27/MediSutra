# MediSutra — Functional and Non-Functional Requirements Specification

---

## 1. System Vision & Objective

MediSutra is an enterprise-grade **Longitudinal Personal Health Intelligence Platform**. Its primary objective is to ingest scattered, heterogeneous medical documents across a patient's lifespan, convert them into structured chronological events, map them to disease-specific journeys, compute parameter trends, and provide an evidence-backed AI reasoning layer for patients and treating clinicians.

---

## 2. User Roles & Access Control Requirements (RBAC)

### 2.1 Role 1: Patient (Primary Consumer)
- **FR-PAT-01:** Register and obtain a globally unique internal Digital Health ID (`MED-XXXXX`).
- **FR-PAT-02:** Manage core demographic profile, blood group, allergies, past surgical history, and emergency contacts.
- **FR-PAT-03:** Upload diagnostic reports, clinical summaries, and prescriptions in PDF, JPG, PNG formats.
- **FR-PAT-04:** View organized documents with processing status, confidence scores, and preview capabilities.
- **FR-PAT-05:** Explore an interactive chronological Health Timeline categorized by date, severity, and body system.
- **FR-PAT-06:** View active and documented resolved conditions with distinct visual demarcations.
- **FR-PAT-07:** View Disease Journeys showing progression stages (Diagnosis → Baseline → Treatment → Follow-up → Monitoring).
- **FR-PAT-08:** Inspect configured monitoring checkpoints (e.g., M2, M4, M6) with clear distinction between available records and unrecorded intervals.
- **FR-PAT-09:** View longitudinal trend charts of repeating clinical parameters (e.g., HbA1c, Fasting Blood Sugar, Creatinine, Bilirubin).
- **FR-PAT-10:** Perform side-by-side Report Comparison between any two reports showing absolute and percentage deltas.
- **FR-PAT-11:** Query the health assistant in English, Hindi, or Hinglish regarding personal health history and receive evidence-grounded answers with verifiable document citations.
- **FR-PAT-12:** Grant and revoke read access to verified doctors with time-bounded consent.

### 2.2 Role 2: Doctor (Clinical Decision Support)
- **FR-DOC-01:** Access a list of assigned or consented patients with key active conditions and latest update timestamps.
- **FR-DOC-02:** Access the comprehensive longitudinal timeline of authorized patients.
- **FR-DOC-03:** View AI-generated longitudinal clinical summaries with one-click access to source evidence pages.
- **FR-DOC-04:** Perform multi-report comparative delta analyses.
- **FR-DOC-05:** Append clinical consultation notes, update documented condition status (e.g., Diagnosed, Under Treatment, Stable, Resolved), and assign monitoring protocols.
- **FR-DOC-06:** Inspect AI reasoning trace, evidence confidence (Strong / Limited / Insufficient), and raw extracted data.

### 2.3 Role 3: Admin (System & Taxonomy Administrator)
- **FR-ADM-01:** Manage system users, role assignments, and account statuses.
- **FR-ADM-02:** Configure the hierarchical Medical Taxonomy (Body Systems: Blood, Metabolic, Hepatic, Renal, Cardiovascular, Thyroid, Imaging).
- **FR-ADM-03:** Manage supported report types, lab reference ranges, and parameter unit normalization rules.
- **FR-ADM-04:** Configure condition monitoring protocols and default checkpoint milestones (e.g., Type 2 Diabetes protocol: M2, M4, M6 follow-up intervals).
- **FR-ADM-05:** Monitor system health, processing queue latency, and immutable security audit logs.
- **FR-ADM-06:** Strictly restricted from accessing raw patient medical documents and Protected Health Information (PHI) unless explicitly authorized under emergency break-glass protocols with full audit logging.

---

## 3. Core Functional Requirements by Module

### 3.1 Digital Health Identity Module
- **FR-ID-01:** Unique identifier generation matching format `MED-XXXXXXXX` (e.g., `MED-00012345`).
- **FR-ID-02:** Support immutable creation date, biological sex, date of birth, blood group, recorded allergies, and emergency contact details.
- **FR-ID-03:** Support baseline medical history declaration (pre-existing conditions, familial risk factors).

### 3.2 Medical Document Center & Ingestion Pipeline
- **FR-DOC-01:** Ingestion support for single and multi-page PDF, PNG, JPEG, WebP, and TIFF. Max file size: 25MB per document.
- **FR-DOC-02:** File validation (MIME-type check, magic byte inspection, SHA-256 checksum computation to detect duplicates).
- **FR-DOC-03:** Asynchronous queue processing with status progression: `PENDING` → `UPLOADING` → `VALIDATED` → `OCR_PROCESSING` → `CLASSIFYING` → `EXTRACTING` → `RECONCILING` → `COMPLETED` / `FAILED`.
- **FR-DOC-04:** Document Classification into one of 18 standard clinical report types (CBC, LFT, KFT, Lipid Profile, HbA1c, Blood Glucose, Thyroid Panel, Vitamin Profile, Urine Analysis, ECG, X-Ray, MRI, CT, Ultrasound, Prescription, Discharge Summary, Clinical Notes, Other).
- **FR-DOC-05:** Extraction Confidence Score (0.0 to 1.0) calculated per document and per extracted lab result.

### 3.3 Information Extraction & Normalization Engine
- **FR-EXT-01:** Entity extraction including Test Name, Quantitative Value, Unit, Standard Reference Range, Flag (Normal, High, Low, Critical), and Observation Date.
- **FR-EXT-02:** Unit normalization (e.g., converting `mg/dL` to `mmol/L` if required, standardizing `g/dL`, `uIU/mL`, `%`).
- **FR-EXT-03:** Date extraction disambiguation (distinguishing between sample collection date, report authorization date, and print date).
- **FR-EXT-04:** Provenance linking: every extracted field must store `document_id`, `page_number`, and bounding coordinates where available.

### 3.4 Structured Health Event & Chronological Timeline Engine
- **FR-EVT-01:** Conversion of extracted facts into standardized `HealthEvent` records:
  - Event Types: `LAB_RESULT`, `DIAGNOSIS`, `PRESCRIPTION`, `PROCEDURE`, `CONSULTATION`, `LIFESTYLE_OBSERVATION`.
- **FR-EVT-02:** Chronological aggregation into a patient-wide timeline view with multi-dimensional filtering (by date range, severity flag, body system, condition).
- **FR-EVT-03:** Direct linkage from every timeline card to the underlying source document page.

### 3.5 Condition Management & Disease Journey Engine
- **FR-CON-01:** Lifecycle state modeling for conditions:
  - `RECORDED`, `SUSPECTED`, `DIAGNOSED`, `UNDER_TREATMENT`, `MONITORING`, `IMPROVING`, `STABLE`, `RESOLVED`, `UNKNOWN`.
  - Absolute ban on automated categorization as "CURED".
- **FR-CON-02:** Chronological progression stages per condition:
  `FIRST_DOCUMENTED` → `DIAGNOSIS` → `BASELINE_TESTS` → `TREATMENT_INITIATION` → `FOLLOW_UP_MONITORING` → `LATEST_DOCUMENTED_STATE`.
- **FR-CON-03:** Automatic linking of incoming lab results and prescriptions to established conditions based on clinical taxonomy rules (e.g., HbA1c and Fasting Glucose automatically linked to Diabetes).

### 3.6 Expected vs. Actual Monitoring & Checkpoint Engine
- **FR-CHK-01:** Support configurable condition protocols defining periodic milestones (e.g., Month 2, Month 4, Month 6, Month 12).
- **FR-CHK-02:** Automated reconciliation between configured checkpoints and recorded health events.
- **FR-CHK-03:** Non-judgmental status reporting:
  - Checkpoint satisfied: `"Available (Report Date: YYYY-MM-DD)"`.
  - Checkpoint unsatisfied: `"No corresponding record was found in this system."` (Strict ban on declaring "Patient missed test").

### 3.7 Longitudinal Trend & Report Comparison Engine
- **FR-TRN-01:** Real-time generation of longitudinal time-series vectors for repeated numerical parameters (e.g., HbA1c over 24 months).
- **FR-TRN-02:** Interactive charting with reference range overlays, event markers (e.g., medication start date), and tooltips showing source report and page number.
- **FR-TRN-03:** Bilateral Report Comparison: User selects Report A and Report B; system outputs tabular delta analysis (Previous Value, Current Value, Absolute Delta, Percentage Delta, Directional Indicator).

### 3.8 Hybrid Medical RAG & Healthcare AI Engine
- **FR-AI-01:** Natural language question answering over personal health records supporting English, Hindi, and Hinglish.
- **FR-AI-02:** Intent detection supporting: `SUMMARIZE_HISTORY`, `COMPARE_REPORTS`, `PARAMETER_TREND`, `CONDITION_DETAILS`, `MISSING_CHECKPOINTS`, `MEDICATION_REVIEW`, `TEMPORAL_QUERY`.
- **FR-AI-03:** Dual-retrieval pipeline: Combines structured SQL context (structured events, exact lab numbers, condition states) with dense vector RAG over document text chunks.
- **FR-AI-04:** Temporal reasoning: Accurately decomposes queries such as *"What happened before my diagnosis in 2024?"* and *"What was my HbA1c change after starting Metformin?"*.
- **FR-AI-05:** Strict Claim Extraction & Evidence Validation: Every generated factual claim is mapped to retrieved document chunks. Unsupported claims are automatically pruned.
- **FR-AI-06:** Categorical Evidence Rating: Each AI response outputs an evidence strength indicator:
  - 🟢 **Strong Evidence** (Corroborated by multiple consistent reports).
  - 🟡 **Limited Evidence** (Single mention or ambiguous document quality).
  - 🔴 **Insufficient Evidence** (No matching records found; model explicitly abstains).
- **FR-AI-07:** Clinical Safety Guardrails: Hard-coded refusal to prescribe medication, adjust dosages, declare definitive unverified diagnoses, or provide acute emergency management.

---

## 4. Non-Functional Requirements (NFR)

### 4.1 Security, Privacy & Compliance
- **NFR-SEC-01:** Data Isolation: Enforce cryptographic and logical tenant separation; zero risk of cross-patient vector or relational contamination.
- **NFR-SEC-02:** Data at Rest Encryption: AES-256 for all stored document files and database backups.
- **NFR-SEC-03:** Data in Transit: TLS 1.3 enforced across all HTTP and WebSocket endpoints.
- **NFR-SEC-04:** Audit Trails: Append-only, tamper-evident audit log for every document access, AI query, note addition, and consent grant.
- **NFR-SEC-05:** Compliance Alignment: Architecture adheres to HIPAA Security Rule principles and India's Digital Personal Data Protection Act (DPDPA 2023) / DISHA standards.

### 4.2 Performance & Scalability
- **NFR-PERF-01:** Dashboard initial load under 1.2s on standard 4G networks.
- **NFR-PERF-02:** Asynchronous document processing pipeline turnaround under 15s for standard 2-page PDF reports.
- **NFR-PERF-03:** AI Chat response first-token latency under 1.5s; complete validated response under 4.0s.
- **NFR-PERF-04:** Horizontal scalability for background worker tier.

### 4.3 Reliability & Groundedness
- **NFR-REL-01:** Zero Tolerance for Hallucinated Lab Values: The system must achieve a 0% hallucination rate on numerical clinical parameters in benchmark evaluation.
- **NFR-REL-02:** High Precision Document Citation: 100% of cited evidence links must accurately open the exact source document and target page.

---

## 5. MVP Feature Prioritization Matrix

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FEATURE PRIORITY MATRIX                         │
├─────────────────────────┬────────────────────────┬─────────────────────┤
│   MUST HAVE (MVP 1.0)   │  SHOULD HAVE (MVP 1.5) │ COULD HAVE (Future) │
├─────────────────────────┼────────────────────────┼─────────────────────┤
│ Digital Health Identity │ Doctor Portal & Notes  │ Wearables Sync      │
│ Document Center Upload  │ Checkpoint Protocols   │ HL7 / FHIR Gateway  │
│ OCR & Value Extraction  │ Hinglish Intent Engine │ Federated Learning  │
│ Health Timeline View    │ Health Knowledge Graph │ Voice Audio Input   │
│ Condition Management    │ Comparative Delta View │ Multi-hospital Sync │
│ Longitudinal Charts     │ Model Evaluation Lab   │ Pharmacogenomics    │
│ Hybrid Vector RAG       │ Notification Dispatch  │ Native Mobile Apps  │
│ Evidence Validator      │ Break-glass Admin Flow │ DICOM Web Viewer    │
│ Safety Abstention Layer │ PDF Health Summary Exp │                     │
└─────────────────────────┴────────────────────────┴─────────────────────┘
```
