# MediSutra — RESTful API Contract & Specification

---

## 1. Global API Standards & Conventions

- **Base URL:** `/api/v1`
- **Protocol:** HTTPS / TLS 1.3
- **Authentication:** `Authorization: Bearer <JWT_ACCESS_TOKEN>`
- **Content-Type:** `application/json` (or `multipart/form-data` for file uploads)
- **Standard Date Format:** ISO-8601 extended format (`YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ssZ`)

### Standard Response Envelope
```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2026-10-06T15:30:00Z",
    "requestId": "req_88f912a4b2c1"
  }
}
```

### Standard Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The provided report date is invalid.",
    "details": [
      { "field": "reportDate", "issue": "Date cannot be in the future." }
    ]
  },
  "meta": {
    "timestamp": "2026-10-06T15:30:00Z",
    "requestId": "req_88f912a4b2c1"
  }
}
```

---

## 2. Authentication & Identity Endpoints (`/api/v1/auth`)

### 2.1 Register New Account
- **Method:** `POST /api/v1/auth/register`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "rahul.sharma@example.com",
  "password": "SecurePassword#2026",
  "role": "PATIENT",
  "fullName": "Rahul Sharma",
  "dob": "1988-04-15",
  "gender": "MALE",
  "bloodGroup": "B+"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_78a1bc4e-28b9-4f71-a0c5-5a7d5c90b111",
      "email": "rahul.sharma@example.com",
      "role": "PATIENT"
    },
    "patient": {
      "id": "pat_90a1bc4e-28b9-4f71-a0c5-5a7d5c90b222",
      "healthId": "MED-00010001",
      "fullName": "Rahul Sharma",
      "bloodGroup": "B+"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
    }
  }
}
```

### 2.2 Login User
- **Method:** `POST /api/v1/auth/login`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "rahul.sharma@example.com",
  "password": "SecurePassword#2026"
}
```
- **Response (200 OK):** Contains tokens and user profile.

---

## 3. Patient Health Identity Endpoints (`/api/v1/patients`)

### 3.1 Get Current Patient Profile
- **Method:** `GET /api/v1/patients/me`
- **Access:** Patient
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "pat_90a1bc4e-28b9-4f71-a0c5-5a7d5c90b222",
    "healthId": "MED-00010001",
    "fullName": "Rahul Sharma",
    "dob": "1988-04-15",
    "gender": "MALE",
    "bloodGroup": "B+",
    "allergies": ["Penicillin", "Sulfa Drugs"],
    "emergencyContact": {
      "name": "Pooja Sharma",
      "phone": "+91-9876543210",
      "relationship": "Spouse"
    },
    "activeConditionsCount": 2,
    "resolvedConditionsCount": 1,
    "totalDocumentsCount": 14,
    "activeMedicationsCount": 3
  }
}
```

---

## 4. Medical Document Vault Endpoints (`/api/v1/documents`)

### 4.1 Upload Medical Document
- **Method:** `POST /api/v1/documents/upload`
- **Access:** Patient
- **Headers:** `Content-Type: multipart/form-data`
- **Form Fields:**
  - `file`: (Binary PDF/PNG/JPG)
  - `reportDate`: "2026-07-12" (Optional, extracted automatically if omitted)
  - `documentType`: "LAB_REPORT" (Optional initial hint)
- **Response (202 Accepted):**
```json
{
  "success": true,
  "data": {
    "documentId": "doc_3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "originalFilename": "Diabetes_Followup_July2026.pdf",
    "fileSize": 1428570,
    "processingStatus": "PENDING",
    "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "message": "Document accepted for asynchronous ingestion and extraction pipeline."
  }
}
```

### 4.2 List Patient Documents
- **Method:** `GET /api/v1/documents?page=1&limit=20&type=CBC&status=COMPLETED`
- **Access:** Patient / Authorized Doctor
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "doc_3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "originalFilename": "Diabetes_Followup_July2026.pdf",
        "documentType": "HbA1c & Glucose Panel",
        "reportDate": "2026-07-12",
        "uploadDate": "2026-07-13T10:15:00Z",
        "processingStatus": "COMPLETED",
        "extractionConfidence": 0.985,
        "extractedLabCount": 3,
        "pageCount": 2
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 14 }
  }
}
```

### 4.3 Get Single Document Details with Extracted Entities
- **Method:** `GET /api/v1/documents/:id`
- **Access:** Patient / Authorized Doctor
- **Response (200 OK):** Contains document metadata, raw pages, extracted lab results, and links to created health events.

---

## 5. Chronological Health Timeline Endpoints (`/api/v1/timeline`)

### 5.1 Get Filtered Health Timeline
- **Method:** `GET /api/v1/timeline?startDate=2024-01-01&endDate=2026-10-06&bodySystem=METABOLIC&severity=HIGH`
- **Access:** Patient / Authorized Doctor
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "eventId": "evt_101",
        "eventType": "LAB_RESULT",
        "eventDate": "2026-07-12",
        "title": "HbA1c Lab Test Result",
        "summary": "Recorded HbA1c at 7.2% (Target < 7.0%). Fasting Blood Sugar 142 mg/dL.",
        "condition": {
          "id": "cond_diabetes",
          "name": "Type 2 Diabetes Mellitus"
        },
        "flag": "HIGH",
        "sourceDocument": {
          "documentId": "doc_3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "filename": "Diabetes_Followup_July2026.pdf",
          "pageNumber": 1
        }
      },
      {
        "eventId": "evt_098",
        "eventType": "PRESCRIPTION",
        "eventDate": "2026-01-15",
        "title": "Medication Dosage Adjustment",
        "summary": "Metformin 500mg BID prescribed by Dr. Alok Sen.",
        "condition": {
          "id": "cond_diabetes",
          "name": "Type 2 Diabetes Mellitus"
        },
        "flag": "NORMAL",
        "sourceDocument": {
          "documentId": "doc_2fa74e53-4616-3451-a2eb-1b852e55be55",
          "filename": "Prescription_Jan2026.pdf",
          "pageNumber": 1
        }
      }
    ]
  }
}
```

---

## 6. Conditions & Disease Journey Endpoints (`/api/v1/conditions`)

### 6.1 List Patient Conditions
- **Method:** `GET /api/v1/conditions?status=ACTIVE`
- **Access:** Patient / Authorized Doctor
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "pcond_01",
      "conditionName": "Type 2 Diabetes Mellitus",
      "bodySystem": "Metabolic",
      "currentStatus": "UNDER_TREATMENT",
      "firstDocumentedDate": "2025-01-10",
      "reportsLinkedCount": 7,
      "latestKeyValues": {
        "HbA1c": "7.2 %",
        "Glucose Fasting": "142 mg/dL"
      }
    },
    {
      "id": "pcond_02",
      "conditionName": "Vitamin D Deficiency",
      "bodySystem": "Metabolic",
      "currentStatus": "RESOLVED",
      "firstDocumentedDate": "2024-03-12",
      "resolvedDate": "2024-09-20",
      "reportsLinkedCount": 3,
      "latestKeyValues": {
        "Vitamin D 25-OH": "38 ng/mL"
      }
    }
  ]
}
```

### 6.2 Get Condition Disease Journey & Chronological Stages
- **Method:** `GET /api/v1/conditions/:id/journey`
- **Access:** Patient / Authorized Doctor
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "condition": {
      "id": "pcond_01",
      "name": "Type 2 Diabetes Mellitus",
      "status": "UNDER_TREATMENT"
    },
    "stages": [
      {
        "stage": "FIRST_DOCUMENTED",
        "date": "2025-01-10",
        "label": "First Clinical Mention",
        "description": "Routine annual health check indicated elevated fasting glucose (165 mg/dL).",
        "sourceDocumentId": "doc_001"
      },
      {
        "stage": "DIAGNOSIS",
        "date": "2025-01-22",
        "label": "Confirmed Diagnosis",
        "description": "HbA1c test confirmed 8.7%. Formal diagnosis recorded.",
        "sourceDocumentId": "doc_002"
      },
      {
        "stage": "TREATMENT_INITIATION",
        "date": "2025-02-01",
        "label": "Treatment Commenced",
        "description": "Metformin 500mg daily initiated.",
        "sourceDocumentId": "doc_003"
      },
      {
        "stage": "FOLLOW_UP_MONITORING",
        "date": "2026-07-12",
        "label": "Month 18 Checkup",
        "description": "HbA1c decreased to 7.2%. Fasting glucose 142 mg/dL.",
        "sourceDocumentId": "doc_007"
      }
    ]
  }
}
```

---

## 7. Monitoring Checkpoints Engine (`/api/v1/monitoring`)

### 7.1 Get Condition Monitoring Checkpoints (Expected vs. Actual)
- **Method:** `GET /api/v1/monitoring/conditions/:conditionId/checkpoints`
- **Access:** Patient / Authorized Doctor
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "conditionName": "Type 2 Diabetes Mellitus",
    "protocolName": "T2D Standard Monitoring Protocol (3-Month Glycemic Check)",
    "checkpoints": [
      {
        "code": "M2",
        "targetDate": "2025-03-22",
        "status": "SATISFIED",
        "satisfiedDate": "2025-03-20",
        "matchedDocument": {
          "id": "doc_004",
          "title": "HbA1c Lab Report",
          "page": 1
        },
        "evaluationText": "Available (Recorded on 2025-03-20)"
      },
      {
        "code": "M4",
        "targetDate": "2025-05-22",
        "status": "NO_RECORD",
        "satisfiedDate": null,
        "matchedDocument": null,
        "evaluationText": "No corresponding record was found in this system."
      },
      {
        "code": "M6",
        "targetDate": "2025-07-22",
        "status": "SATISFIED",
        "satisfiedDate": "2025-07-28",
        "matchedDocument": {
          "id": "doc_006",
          "title": "HbA1c Follow-up Report",
          "page": 1
        },
        "evaluationText": "Available (Recorded on 2025-07-28)"
      }
    ]
  }
}
```

---

## 8. Longitudinal Trends & Report Comparison (`/api/v1/analytics`)

### 8.1 Get Parameter Time-Series Trend
- **Method:** `GET /api/v1/analytics/trends?parameter=HBA1C&startDate=2024-01-01&endDate=2026-10-06`
- **Access:** Patient / Authorized Doctor
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "parameterName": "HbA1c (Glycated Hemoglobin)",
    "unit": "%",
    "referenceRange": { "min": 4.0, "max": 5.6, "preDiabetesMax": 6.4 },
    "readings": [
      { "date": "2025-01-22", "value": 8.7, "sourceDocId": "doc_002", "sourcePage": 1, "flag": "HIGH" },
      { "date": "2025-03-20", "value": 8.2, "sourceDocId": "doc_004", "sourcePage": 2, "flag": "HIGH" },
      { "date": "2025-07-28", "value": 7.8, "sourceDocId": "doc_006", "sourcePage": 1, "flag": "HIGH" },
      { "date": "2026-01-14", "value": 7.2, "sourceDocId": "doc_008", "sourcePage": 1, "flag": "HIGH" },
      { "date": "2026-07-12", "value": 6.9, "sourceDocId": "doc_012", "sourcePage": 1, "flag": "HIGH" }
    ],
    "summary": "Recorded HbA1c decreased from 8.7% to 6.9% across 5 documented readings."
  }
}
```

### 8.2 Bilateral Report Comparison
- **Method:** `POST /api/v1/analytics/compare`
- **Access:** Patient / Authorized Doctor
- **Request Body:**
```json
{
  "reportAId": "doc_004",
  "reportBId": "doc_012"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "reportA": { "id": "doc_004", "title": "Comprehensive Metabolic Panel", "date": "2025-03-20" },
    "reportB": { "id": "doc_012", "title": "Comprehensive Metabolic Panel", "date": "2026-07-12" },
    "parameters": [
      {
        "name": "HbA1c",
        "unit": "%",
        "previousValue": 8.2,
        "currentValue": 6.9,
        "delta": -1.3,
        "percentChange": -15.85,
        "direction": "DECREASED",
        "clinicalSignificance": "IMPROVED"
      },
      {
        "name": "Fasting Blood Sugar",
        "unit": "mg/dL",
        "previousValue": 165.0,
        "currentValue": 138.0,
        "delta": -27.0,
        "percentChange": -16.36,
        "direction": "DECREASED",
        "clinicalSignificance": "IMPROVED"
      }
    ]
  }
}
```

---

## 9. MediSutra AI & Clinical Evidence (`/api/v1/ai`)

### 9.1 Query Health History with Evidence Grounding
- **Method:** `POST /api/v1/ai/query`
- **Access:** Patient / Authorized Doctor
- **Request Body:**
```json
{
  "query": "Meri sugar pichli report se kam hui kya?",
  "conversationId": "conv_4a2c91b5"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "conversationId": "conv_4a2c91b5",
    "answer": "Haan, aapke documents ke mutabik aapki sugar kam hui hai. March 2026 mein Fasting Blood Sugar 165 mg/dL aur HbA1c 8.2% darj tha, jabki July 2026 ki latest report mein Fasting Blood Sugar 142 mg/dL aur HbA1c 7.2% darj hai.",
    "evidenceStrength": "STRONG",
    "confidenceReason": "2 relevant reports with consistent extracted lab values were verified against original documents.",
    "intentParsed": {
      "language": "hi-Latn (Hinglish)",
      "intent": "COMPARE_REPORTS",
      "targetParameter": "GLUCOSE / HBA1C"
    },
    "citations": [
      {
        "documentId": "doc_004",
        "documentTitle": "Metabolic Follow-up Report (March 2026)",
        "pageNumber": 2,
        "snippet": "HbA1c: 8.2% | Fasting Plasma Glucose: 165 mg/dL",
        "relevanceScore": 0.96
      },
      {
        "documentId": "doc_012",
        "documentTitle": "Diabetes Review Panel (July 2026)",
        "pageNumber": 1,
        "snippet": "HbA1c: 7.2% | Fasting Plasma Glucose: 142 mg/dL",
        "relevanceScore": 0.98
      }
    ],
    "safetyDisclaimer": "This summary is based strictly on documented records in your MediSutra profile and is for informational support only. Do not modify medication without consulting your physician."
  }
}
```

---

## 10. Doctor Portal Endpoints (`/api/v1/doctor`)

### 10.1 List Consented Patients
- **Method:** `GET /api/v1/doctor/patients`
- **Access:** Doctor
- **Response (200 OK):** List of patients with active condition counts, last visit, and consent expiration.

### 10.2 Get AI Longitudinal Clinical Summary for Doctor
- **Method:** `GET /api/v1/doctor/patients/:id/summary`
- **Access:** Authorized Doctor
- **Response (200 OK):** Concise clinical summary highlighting condition onsets, active therapies, glycemic trajectories, and unrecorded intervals.

### 10.3 Add Doctor Clinical Note
- **Method:** `POST /api/v1/doctor/patients/:id/notes`
- **Access:** Authorized Doctor
- **Request Body:**
```json
{
  "conditionId": "pcond_01",
  "noteType": "CONSULTATION_NOTE",
  "content": "Patient reviewed. Glycemic trajectory showing downward trend on Metformin. Advised lipid panel repeat at M8."
}
```
- **Response (201 Created):** Creates note and appends to patient event timeline.
