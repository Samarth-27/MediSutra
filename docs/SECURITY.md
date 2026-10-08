# MediSutra — Security, Privacy & Compliance Specification

---

## 1. Security Architecture & Threat Model

Healthcare information is among the most sensitive personal data. MediSutra treats **Patient Data Privacy** as a foundational engineering constraint, adopting a zero-trust model across all internal microservices and external interfaces.

### 1.1 Threat Surface & Defense Mechanisms

| Threat Vector | Potential Impact | MediSutra Mitigation Strategy |
|---|---|---|
| **Cross-Patient Data Leakage** | Patient B reads Patient A's records or vector chunks | Strict tenant filtering enforced at SQL and vector layers; JWT claim verification on every route; automated tenant boundary unit tests. |
| **Malicious File Upload** | Remote code execution via crafted PDFs or SVGs | Magic-byte signature validation; file size capping (25MB); execution bit stripping; isolated storage outside web root; SVG sterilization. |
| **LLM Prompt Injection / Jailbreak** | Model induced to emit unauthorized clinical advice | Strict system prompts; structured JSON-only inter-tier communication; pre-generation intent screening; post-generation Evidence Validator. |
| **Data in Transit Interception** | Eavesdropping on clinical records | Enforced TLS 1.3 with HSTS enabled; secure HTTP-only, SameSite cookies for session management. |
| **Database Compromise** | Exposure of stored health records | Transparent Data Encryption (TDE) / AES-256 encryption at rest; hashed credentials using Argon2id with unique salt. |
| **Unauthorized Clinician Access** | Doctor viewing unconsented patient files | Explicit digital consent record required in `doctor_patient_access` with expiration dates and patient revocation capability. |

---

## 2. Role-Based Access Control (RBAC) Matrix

```
┌──────────────────────────────┬─────────┬─────────┬─────────┐
│ Resource / Action            │ PATIENT │ DOCTOR  │  ADMIN  │
├──────────────────────────────┼─────────┼─────────┼─────────┤
│ View Own Profile & Timeline  │    ✓    │    -    │    -    │
│ Upload Own Medical Documents │    ✓    │    -    │    -    │
│ Ask MediSutra AI (Own Data)  │    ✓    │    -    │    -    │
│ Grant / Revoke Doctor Consent│    ✓    │    -    │    -    │
├──────────────────────────────┼─────────┼─────────┼─────────┤
│ View Consented Patient Data  │    -    │    ✓    │    -    │
│ Append Doctor Clinical Notes │    -    │    ✓    │    -    │
│ Configure Monitoring Protocol│    -    │    ✓    │    ✓    │
│ Compare Reports (Consented)  │    -    │    ✓    │    -    │
├──────────────────────────────┼─────────┼─────────┼─────────┤
│ Manage Medical Taxonomy      │    -    │    -    │    ✓    │
│ View System Audit Logs       │    -    │    -    │    ✓    │
│ Monitor Queue & System Health│    -    │    -    │    ✓    │
│ View Raw Patient Records     │    -    │    -    │  BLOCKED│
└──────────────────────────────┴─────────┴─────────┴─────────┘
```
> **CRITICAL RULE:** Platform Admins have **ZERO** default access to patient medical documents, lab results, or clinical notes. Raw PHI is accessible to an administrator solely under emergency Break-Glass protocols which trigger urgent patient notifications and permanent audit entries.

---

## 3. Secure Document Handling Pipeline

```
[Incoming File Upload]
        │
        ▼
[1. File Size Verification] ──► Exceeds 25MB? ──► [Reject 413]
        │
        ▼
[2. Magic Byte Signature Check] ──► Disallowed MIME? ──► [Reject 415]
(Validates %PDF-1., \xFF\xD8\xFF, \x89PNG\r\n\x1a\n)
        │
        ▼
[3. Cryptographic Hashing]
(Computes SHA-256 checksum to detect duplicates & preserve chain of custody)
        │
        ▼
[4. File Renaming & Quarantine]
(Random UUID key assigned; stored in secure encrypted vault with 0600 permissions)
        │
        ▼
[5. Dispatched to Worker Queue via UUID reference]
```

---

## 4. Immutable Security Audit Trail Specification

Every interaction with Protected Health Information (PHI) triggers an synchronous audit log entry stored in the append-only `audit_logs` table.

### Audit Log Schema Elements
- **Event ID:** UUIDv4
- **Timestamp:** ISO-8601 UTC timestamp with microsecond precision
- **Actor:** `user_id`, `actor_role` (PATIENT, DOCTOR, ADMIN)
- **Subject:** `patient_id` whose data was touched
- **Action Type:** `VIEW_DOCUMENT`, `DOWNLOAD_DOCUMENT`, `EXECUTE_AI_QUERY`, `EXPORT_SUMMARY`, `CONSENT_GRANTED`, `CONSENT_REVOKED`, `BREAK_GLASS_ACCESS`
- **Resource Identifier:** `document_id`, `event_id`, or `query_hash`
- **Network Metadata:** IPv4/IPv6 client address, User-Agent header
- **Result:** `SUCCESS` or `ACCESS_DENIED`

---

## 5. Regulatory Alignment (DPDPA 2023 & HIPAA Principles)

MediSutra aligns with national and international health data protection guidelines:

1. **Digital Personal Data Protection Act (India DPDPA 2023):**
   - **Purpose Limitation:** Patient records are processed strictly for personal health visualization and user-initiated AI analysis.
   - **Consent Mechanism:** Explicit, granular consent before sharing data with healthcare professionals.
   - **Right to Erasure:** Patients retain the right to soft-delete their profile, triggering secure archival and vector deletion.
2. **HIPAA Security Rule Principles:**
   - **Access Control (§ 164.312(a)):** Unique user identification, automatic session timeouts, and role isolation.
   - **Audit Controls (§ 164.312(b)):** Mechanism to record and examine activity in systems containing PHI.
   - **Transmission Security (§ 164.312(e)):** Complete end-to-end encryption for health data across all networks.
