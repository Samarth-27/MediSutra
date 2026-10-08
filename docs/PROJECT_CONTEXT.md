# MediSutra — Project Context & Engineering Standards

> **Tagline:** One Person. One Health Identity. One Complete Health Journey.  
> **Repository:** `MEDISUTRA`  
> **Current Phase:** Phase 0 (Architecture & Foundation Specifications)  
> **Last Updated:** October 2026

---

## 1. Executive Summary & Philosophy

MediSutra is a **longitudinal personal health intelligence platform**. It is designed to solve the chronic fragmentation of individual medical histories by converting unorganized diagnostic reports, prescriptions, and clinical notes into a structured, chronological, condition-centric health journey grounded in verifiable evidence.

### Core Product Axiom
```
Patient → Health Identity → Medical Events → Conditions → Disease Journeys → Timeline → Trends → Evidence → Healthcare AI
```

### Critical Boundaries
- **MediSutra is NOT:** A generic chatbot, an autonomous physician, an automated prescription generator, or a standard hospital management system (HMS).
- **MediSutra IS:** A personal longitudinal health record (PHR) operating system with clinical decision support, temporal trend analytics, protocol-driven checkpoint tracking, and an evidence-grounded AI intelligence layer.

---

## 2. Technology Stack & Architectural Decisions

| Layer | Selected Technology | Technical Rationale & Alternatives Considered |
|---|---|---|
| **Frontend Web** | React 18+ / Vite / TypeScript | Fast HMR, strong typing for complex medical schemas, rich visualization via Recharts/Lucide. Avoids heavy Next.js SSR overhead for authenticated SPA dashboard. |
| **Styling & Design System** | TailwindCSS + Vanilla CSS Tokens | Strictly follows clean, accessible, tranquil clinical tokens (Slate, Emerald, Amber, Crimson) without excessive aesthetic fluff or clutter. |
| **Backend Core API** | Node.js (v20+) / Express / TypeScript | High I/O throughput for document streaming, robust asynchronous event pipeline, modular domain-driven architecture. |
| **AI Intelligence Service** | Python 3.11+ / FastAPI | Native ecosystem for PyMuPDF, OCR (Tesseract / EasyOCR), embeddings (Sentence-Transformers / BAAI BGE), HuggingFace Transformers, and LangChain/LlamaIndex. |
| **Primary Database** | PostgreSQL 16+ | ACID-compliant relational storage for patients, clinical events, taxonomy, time-series lab readings, RBAC, and immutable audit logs. |
| **Vector Store** | Qdrant / pgvector (PostgreSQL extension) | Hybrid vector and metadata filtering (`patient_id`, `date_range`, `document_type`, `condition_id`) to prevent cross-patient vector leakage. |
| **Object / File Storage** | Local Secure Media Vault / S3-compatible | Original binary reports (PDF, JPG, PNG) stored immutably with SHA-256 checksums and secure pre-signed token delivery. |
| **Task Queue / Worker** | BullMQ / Redis or Async Postgres Queue | Decouples report uploads from intensive OCR, LLM extraction, vector embedding, and timeline reconciliation. |

---

## 3. Core Architectural Conventions

### 3.1 Domain-Driven Directory Architecture
```
MEDISUTRA/
├── docs/                   # Authoritative architecture, API, and DB specifications
├── backend/                # Node.js/TypeScript core REST API & domain services
│   ├── src/
│   │   ├── modules/        # Modular domain packages (auth, patients, documents, etc.)
│   │   ├── middleware/     # Auth, RBAC, audit, rate limiting, error handling
│   │   ├── database/       # Migrations, seeds, Prisma/Knex/Drizzle schemas
│   │   ├── services/       # Cross-cutting infrastructure services
│   │   └── config/         # Strongly-typed environment configs
├── ai-service/             # Python FastAPI service for OCR, NLP, RAG & LLM
│   ├── app/
│   │   ├── routes/         # Ingestion, extraction, retrieval, chat, evaluation
│   │   ├── services/       # OCR, entity extraction, embedding, evidence validator
│   │   ├── prompts/        # Multilingual prompts & structured schemas
│   │   └── models/         # Pydantic schemas & model adapters
├── frontend/               # React/Vite/TypeScript client portal
│   ├── src/
│   │   ├── components/     # UI components (timeline, journey, charts, drawer)
│   │   ├── pages/          # Patient, Doctor, and Admin dashboards
│   │   ├── services/       # Axios API client, query hooks
│   │   └── styles/         # Clinical design tokens and theme variables
└── tests/                  # End-to-end, synthetic validation, and benchmark suites
```

### 3.2 Data Privacy & Multi-Tenancy Boundary
1. **Strict Patient Isolation:** Every database query, vector search, and cache key **must** be scoped to `patient_id`. Cross-patient data retrieval is physically prevented at both the database and vector filtering layers.
2. **Role-Based Access Control (RBAC):**
   - **PATIENT:** Full self-record read/write, audit trail visibility, document upload.
   - **DOCTOR:** Access strictly granted via explicit digital patient delegation/consent.
   - **ADMIN:** Platform metadata, taxonomy, and system health only; **zero** default access to raw clinical documents or PHI.
3. **No Raw LLM Output Without Verification:** No medical claim generated by the AI is delivered to the user without passing through the **Evidence Validator & Hallucination Filter**.

---

## 4. Engineering & Safety Rules

1. **Non-Destructive Ingestion:** Never mutate, discard, or overwrite original uploaded documents. Original binary checksums (SHA-256) are preserved.
2. **Source Grounding Required:** Every extracted `HealthEvent`, `LabResult`, and condition update must store `source_document_id`, `source_page_number`, and `extraction_confidence`.
3. **Non-Judgmental Protocol Language:** When a scheduled checkpoint has no record in the system, display:  
   `"No corresponding record was found in this system."`  
   Never state: `"Patient missed the test."`
4. **Abstention Over Hallucination:** If a lab parameter is missing or reports conflict, the system states the exact limitation without inventing metrics.
5. **Clear Synthetic Demarcation:** All sample records for demonstrations (e.g., *Rahul Sharma, MED-10001*) must be explicitly tagged as synthetic demo data.

---

## 5. Development Roadmap Matrix

- **Phase 0:** Master Specifications, Architecture, Database ERD, API Contracts, and Safety Rules *(Current)*
- **Phase 1:** Core Foundation, Auth, RBAC, Database Schema, and Patient Identity
- **Phase 2:** Medical Document Center, Secure File Storage, and Document Metadata
- **Phase 3:** Document Intelligence Pipeline (OCR, Extraction, Classification, Lab Normalization)
- **Phase 4:** Health Event Engine & Chronological Interactive Timeline
- **Phase 5:** Condition Lifecycle & Disease Journey Engine (Checkpoints, M2/M4/M6 Tracker)
- **Phase 6:** Longitudinal Analytics, Interactive Trend Charts & Report Comparison Engine
- **Phase 7:** Patient-Isolated Vector RAG & Citation Subsystem
- **Phase 8:** Specialized Healthcare AI, Multilingual/Hinglish Query Parsing & Prompt Engine
- **Phase 9:** Evidence Validator, Hallucination Filter & Clinical Safety Guardrails
- **Phase 10:** Doctor Portal, Clinical Summary & Consent Management
- **Phase 11:** AI Evaluation Lab, Benchmark Harness & Model Comparison Suite
- **Phase 12:** Full-System Polish, Performance Optimization, Audit Finalization & Demo Scenarios
