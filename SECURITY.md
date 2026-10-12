# MediSutra Security & Hardening Architecture

This document outlines the security controls, defense-in-depth measures, and compliance standards implemented in the MediSutra healthcare platform.

---

## 1. Threat Model & Overview

MediSutra processes sensitive health information (Electronic Health Records - EHR, FHIR resources, ABDM care contexts). As a healthcare platform, the architecture enforces defense-in-depth against:
- **Unauthorized Data Access & Privilege Escalation** (Broken Object Level Authorization / IDOR)
- **Credential Stuffing & Brute-Force Attacks** (Denial of Service / Account Takeover)
- **Cross-Site Scripting (XSS) & Code Injection** (Prototype Pollution, Malicious Payloads)
- **Cross-Origin Information Leakage** (CORS misconfiguration)
- **Sensitive Data & Secret Exposure** (API keys in Git history or environment files)
- **Supply-Chain Attacks** (Outdated or vulnerable third-party dependencies)

---

## 2. Authentication & Access Control (RBAC & IDOR Defense)

### Strict JWT Verification
- All protected endpoints require a signed JSON Web Token (JWT) using HMAC SHA-256 (`CONFIG.JWT_SECRET`).
- Tokens contain the user's role, unique user identifier, patient/doctor correlation ID, and expiration timestamps.
- In production mode, weak fallback secrets are disallowed; a cryptographically strong 32+ character secret is strictly enforced.

### Role-Based Access Control (RBAC)
User identities are partitioned into distinct role domains:
- **`PATIENT`**: Limited strictly to viewing and managing their own ABHA care context, personal medical documents, and condition timelines.
- **`DOCTOR`**: Clinical staff authorized to diagnose conditions, ingest clinical encounters, record notes, and utilize AI clinical copilots.
- **`HOSPITAL_ADMIN`**: Administrative personnel managing hospital credentials and linked doctor rosters.
- **`ADMIN`**: Platform administrators with audit privileges.

### Insecure Direct Object Reference (IDOR) Protections
- **Citizen Isolation**: Citizens attempting to request clinical journeys (`/conditions/:id/journey`), check documents (`/documents/patient/:id`), or monitor biometric checkpoints for other patient IDs receive an immediate `403 Forbidden` (`FORBIDDEN_TENANT_ACCESS`).
- **Clinical Boundary**: Clinical operations (encounters, cures, reopenings, medical AI copilots) reject non-clinical tokens with `401 Unauthorized` or `403 Forbidden`.

---

## 3. HTTP Security Headers & Transport Hardening

Implemented via `helmet` in [`backend/src/middleware/security.ts`](file:///c:/Users/Lenovo/OneDrive/Desktop/MEDISUTRA/backend/src/middleware/security.ts):
- **Content Security Policy (CSP)**: Restricts scripts, styles, objects, and framing sources (`default-src 'self'`, `frame-ancestors 'none'`).
- **Strict-Transport-Security (HSTS)**: 1-year max age with preload and includeSubDomains enabled for HTTPS enforcement.
- **X-Frame-Options (`DENY`)**: Eliminates clickjacking risks.
- **X-Content-Type-Options (`nosniff`)**: Disables browser MIME-type sniffing.
- **X-Permitted-Cross-Domain-Policies (`none`)**: Prevents Flash and PDF cross-domain policy abuse.
- **Referrer-Policy (`strict-origin-when-cross-origin`)**: Prevents patient identifiers in URLs from leaking into external referrers.
- **`hidePoweredBy()`**: Strips `X-Powered-By: Express` server fingerprint banners.

---

## 4. Cross-Origin Resource Sharing (CORS)

- Dynamic whitelist configured via `CONFIG.CORS_ORIGIN` (defaults to approved frontend origins, e.g., `http://localhost:5173`, `http://localhost:3000`).
- Arbitrary origins (e.g., unauthorized external domains) receive blocked CORS headers.
- Safe HTTP methods allowed: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`.
- Explicit header whitelist: `Content-Type`, `Authorization`, `X-Requested-With`, `X-Role`.
- Preflight results cached for 24 hours (`maxAge: 86400`).

---

## 5. Tiered Rate Limiting

Implemented via `express-rate-limit`:
1. **Global API Limiter**: 300 requests per 15 minutes per IP address.
2. **Auth & Sensitive Route Limiter**: 20 requests per 15 minutes per IP address to eliminate credential-stuffing and password brute-forcing on `/api/v1/auth/*` and hospital login endpoints.
3. **AI Inference Limiter**: 60 requests per 10 minutes per IP on `/api/v1/ai/*` to protect computational backend resources and prevent LLM resource exhaustion.

---

## 6. Input Sanitization & Anti-XSS

- **Recursive Payload Sanitization**: Strips dangerous script tags (`<script>`, `javascript:`, event handlers `onload=`, `onerror=`) across `req.body`, `req.query`, and `req.params`.
- **Prototype Pollution Prevention**: Rejects or strips reserved prototype keys (`__proto__`, `constructor`, `prototype`) before objects are merged into memory.
- **Strict Size Limits**: JSON and URL-encoded body limits capped at 10MB to prevent memory exhaustion attacks.

---

## 7. File Upload Security

- Implemented via `multer` in [`documentRouter.ts`](file:///c:/Users/Lenovo/OneDrive/Desktop/MEDISUTRA/backend/src/modules/documents/documentRouter.ts):
- **Strict MIME Whitelisting**: Only approved healthcare document formats accepted (`application/pdf`, `image/jpeg`, `image/png`, `image/webp`, `image/tiff`, `application/dicom`).
- **File Size Caps**: 25MB maximum per document upload.
- **Path Traversal Protection**: Unique file naming via `Date.now() + Math.round(Math.random() * 1e9)` prevents overwriting existing records or escaping upload storage directories.

---

## 8. Password Security & Database Safety

- Password hashing is enforced via `bcrypt` with salt rounds >= 10.
- Password bypasses (empty passwords or demo fallbacks) are blocked.
- Database records are isolated per patient ABHA identifier.

---

## 9. Secret Hygiene & Git History Audit

- `.gitignore` strictly excludes:
  - All `.env*` environment files (preserving only `.env.example`)
  - Private cryptographic keys (`*.key`, `*.pem`, `*.cert`, `*.pfx`, `*.p12`)
  - Cloud credentials and secrets (`credentials.json`, `secrets.json`)
  - Storage vaults and runtime caches
- Full repository Git history was scanned for leaked credentials (`sk-`, `ghp_`, `AIza`, AWS keys) with zero unencrypted secrets found.

---

## 10. Production Safe Mode & Dependency Audit

- **Production Mode**: Internal stack traces, raw error messages, and file system paths are suppressed in production mode (`CONFIG.IS_PRODUCTION`). Standardized generic error codes are returned to clients.
- **Dependency Audit**:
  - `backend`: **0 vulnerabilities** (`npm audit`)
  - `frontend`: **0 vulnerabilities** (`npm audit`)
  - Critical packages (`uuid`, `helmet`, `express-rate-limit`) updated to current secure releases.

---

## 11. Security Audit Verification Results

Verification suite test run:
```
=== RUNNING SECURITY AUDIT VERIFICATION ===

[TEST 1] Security Headers Check:
 - X-Content-Type-Options (nosniff): PASS
 - X-Powered-By hidden: PASS
 - X-Frame-Options: PASS
 - Content-Security-Policy: PASS

[TEST 2] CORS Policy Check:
 - Allowed Origin (http://localhost:5173): PASS
 - Malicious Origin Blocked: PASS

[TEST 3] Admin & Protected Route Authorization:
 - Clinical Route Unauthorized Access Blocked: PASS (HTTP 401)
 - Condition Journey IDOR Check (Token Required): PASS (HTTP 401)

[TEST 4] Rate Limiting Headers:
 - Rate Limit Header Present: PASS (Limit: 20)

[TEST 5] Form Sanitization & Anti-XSS:
 - Prototype Pollution Blocked: PASS
 - XSS Injection Handled Gracefully: PASS (HTTP 400)

=== AUDIT SUMMARY: 5 PASSED, 0 FAILED ===
```
