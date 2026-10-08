# MediSutra — System Architecture Specification

---

## 1. High-Level Technical Architecture Diagram

```mermaid
graph TB
    subgraph ClientTier ["CLIENT TIER (React 18 + Vite + TypeScript)"]
        PAT[Patient Portal\n- Dashboard & Health ID\n- Timeline & Journeys\n- Trends & Comparisons\n- MediSutra AI & Evidence]
        DOC[Doctor Portal\n- Consented Patients\n- Longitudinal Summary\n- Timeline & Notes\n- Delta Explorer]
        ADM[Admin Portal\n- Taxonomy Config\n- Protocol Definitions\n- Audit & Monitoring\n- Evaluation Lab]
    end

    subgraph GatewayTier ["CORE API GATEWAY & DOMAIN SERVICES (Node.js / Express / TypeScript)"]
        GW[API Gateway & Router\n- Rate Limiting\n- JWT & RBAC Middleware\n- Audit Interceptor]
        
        subgraph DomainModules ["Domain Modules"]
            MOD_AUTH[Auth & Identity Module]
            MOD_DOC[Document Vault Module]
            MOD_EVT[Health Event Engine]
            MOD_CON[Condition & Journey Manager]
            MOD_CHK[Monitoring Checkpoint Engine]
            MOD_TRN[Longitudinal Trend Engine]
            MOD_DOCP[Doctor Portal & Consent]
            MOD_AUD[Security Audit Service]
        end
    end

    subgraph AsyncTier ["ASYNCHRONOUS PIPELINE & TASK QUEUE"]
        QUEUE[(Redis / BullMQ\nJob Queue)]
        WORKER[Background Ingestion Worker\n- File Validation\n- OCR Dispatch\n- Reconciliation]
    end

    subgraph AIServiceTier ["AI INTELLIGENCE & REASONING TIER (Python FastAPI)"]
        OCR_ENG[OCR & PDF Parser\nPyMuPDF / Tesseract]
        CLASS_ENG[Medical Document Classifier]
        EXT_ENG[Entity & Lab Value Extractor\nUnit Normalizer]
        INT_ENG[Multilingual Intent Parser\nEN / HI / Hinglish]
        TEMP_ENG[Temporal Reasoning Engine]
        RAG_ENG[Hybrid Retrieval Engine\nSQL + Vector Dense Search]
        LLM_ENG[Healthcare Model Adapter\nOpen LLM / LoRA]
        VAL_ENG[Claim Extractor &\nEvidence Validator]
        SAFE_ENG[Clinical Safety &\nAbstention Guard]
    end

    subgraph StorageTier ["DATA & PERSISTENCE TIER"]
        POSTGRES[(PostgreSQL 16\n- Patients & Auth\n- Events & Lab Results\n- Conditions & Checkpoints\n- Taxonomy & Audit Logs)]
        VECTOR_DB[(Qdrant / pgvector\n- Document Chunks\n- Embeddings\n- Patient-Isolated Metadata)]
        BLOB_STORE[(Encrypted Object Storage\n- Original PDF/PNG/JPG\n- SHA-256 Immutability)]
    end

    %% Client to Gateway
    PAT -->|HTTPS / REST & WS| GW
    DOC -->|HTTPS / REST & WS| GW
    ADM -->|HTTPS / REST & WS| GW

    %% Gateway to Modules
    GW --> MOD_AUTH
    GW --> MOD_DOC
    GW --> MOD_EVT
    GW --> MOD_CON
    GW --> MOD_CHK
    GW --> MOD_TRN
    GW --> MOD_DOCP
    GW --> MOD_AUD

    %% Document Upload Flow
    MOD_DOC -->|1. Store Raw Binary| BLOB_STORE
    MOD_DOC -->|2. Enqueue Ingestion Task| QUEUE
    QUEUE --> WORKER
    WORKER -->|3. Process Document| OCR_ENG

    %% AI Pipeline within Python Service
    OCR_ENG --> CLASS_ENG
    CLASS_ENG --> EXT_ENG
    EXT_ENG -->|4. Structured Facts| WORKER
    WORKER -->|5. Store Events & Labs| POSTGRES
    WORKER -->|6. Reconcile Journeys| MOD_CON
    EXT_ENG -->|7. Vector Chunks| VECTOR_DB

    %% AI Query Flow
    PAT -->|Natural Language Query| GW
    GW --> INT_ENG
    INT_ENG --> TEMP_ENG
    TEMP_ENG -->|Structured Facts| POSTGRES
    TEMP_ENG -->|Semantic Chunks| VECTOR_DB
    POSTGRES --> RAG_ENG
    VECTOR_DB --> RAG_ENG
    RAG_ENG --> LLM_ENG
    LLM_ENG --> VAL_ENG
    VAL_ENG --> SAFE_ENG
    SAFE_ENG -->|Validated Answer + Citations| GW
    GW -->|Render Evidence Drawer| PAT

    %% Security Audit
    MOD_AUD -->|Immutable Append| POSTGRES
```

---

## 2. Architectural Design Principles

1. **Separation of Concerns:** 
   - Node.js/TypeScript handles deterministic business logic, database transactions, auth, and real-time frontend serving.
   - Python/FastAPI encapsulates heavy scientific processing, OCR, NLP, PyTorch/Transformers inference, vector search, and linguistic normalization.
2. **Deterministic Truth vs. Generative Explanation:**
   - Quantitative facts (e.g., *HbA1c = 7.2% on 2026-07-12*) are stored deterministically in PostgreSQL.
   - The LLM never invents numbers; it retrieves deterministic records from PostgreSQL and relevant semantic passages from Qdrant, synthesizes the narrative, and must have every statement validated by the Evidence Validator.
3. **Decoupled Asynchronous Processing:**
   - File uploads acknowledge immediately (`202 Accepted` with a `job_id`).
   - Resource-intensive OCR, entity extraction, and embedding generation execute asynchronously via a reliable queue.
   - Frontend receives real-time progress updates via WebSockets or optimistic polling.

---

## 3. Subsystem Detailed Descriptions

### 3.1 Client Tier (React 18 + Vite + TypeScript)
- **Design System:** Calm, clinical visual hierarchy using TailwindCSS and CSS variables. Employs accessible contrast ratios, minimal cognitive load, responsive layout, and distinct visual statuses.
- **State Management:** TanStack Query (React Query) for server-state caching, optimistic updates, and automatic cache invalidation on report upload.
- **Visualizations:** Recharts for longitudinal parameter curves (with normal reference range bands); custom SVG/Canvas rendering for the interactive chronological Health Timeline and Disease Journey step-trees.

### 3.2 Gateway & Domain Service Tier (Node.js / Express / TypeScript)
- **Identity & Auth Module:** Manages session lifecycle, password hashing (Argon2id), JWT issuance, and RBAC enforcement.
- **Health Event Engine:** Converts raw extracted entities into normalized `HealthEvent` instances linked to the patient timeline.
- **Condition & Journey Manager:** Maintains the state-machine lifecycle of diseases (Diagnosed → Under Treatment → Stable → Resolved) and maintains parent-child linkages between diagnoses and lab results.
- **Monitoring & Checkpoint Engine:** Cross-references active conditions against medical protocols to track expected vs. actual reports without passing medical judgment.
- **Trend & Comparison Engine:** Executes high-performance temporal aggregations on lab parameters and calculates bilateral report deltas.
- **Audit Service:** Captures every read/write event on medical entities, recording user identity, IP address, timestamp, resource ID, and action.

### 3.3 Asynchronous Ingestion & Document Intelligence Tier
1. **Validation & Hashing:** Computes SHA-256 checksum to detect duplicate uploads; validates file signatures (magic bytes).
2. **Text & Visual Extraction:**
   - For native digital PDFs: PyMuPDF extracts raw text, coordinates, and embedded tables.
   - For scanned PDFs & Images (PNG/JPG): Image pre-processing (deskew, binarization, contrast adjustment) followed by OCR via Tesseract / EasyOCR.
3. **Medical Document Classifier:** Categorizes document into standardized types (e.g., CBC, LFT, Prescription, Discharge Summary) using hybrid regex heuristics and lightweight transformer classification.
4. **Entity & Lab Normalizer:** Extracts `{ parameter, numeric_value, raw_unit, normalized_unit, ref_min, ref_max, abnormal_flag }`. Converts units to canonical standards (e.g., standardizing blood sugar units).
5. **Timeline Reconciler:** Creates structured events in PostgreSQL and triggers condition linking.

### 3.4 Medical RAG & Healthcare AI Tier
```
  [User Query] (English / Hindi / Hinglish)
         │
         ▼
  [Intent & Language Parser] ──► Extracts: Intent, Entity, Time Range, Language
         │
         ▼
  [Temporal Reasoning Engine] ──► Resolves relative terms ("last year", "before diagnosis")
         │
    ┌────┴───────────────────────────┐
    ▼                                ▼
[Structured SQL Query]       [Vector Semantic Search]
(Exact lab values, dates,    (Clinical notes, doctor
 conditions, checkpoints)     impressions, chunk text)
    └────┬───────────────────────────┘
         ▼
  [Reranker & Context Assembler]
         │
         ▼
  [Healthcare Model Adapter (LLM)]
         │
         ▼
  [Claim Extractor] ──► Extracts atomic factual assertions
         │
         ▼
  [Evidence Validator] ──► Verifies each claim against retrieved sources
         │
   ┌─────┴───────────────────────────┐
   │ All claims verified             │ Unsupported claims found
   ▼                                 ▼
[Clinical Safety Guard]      [Prune / Abstain with Warning]
         │
         ▼
[Final Validated Response + Verified Citations + Evidence Rating Badge]
```

### 3.5 Persistence & Storage Tier
- **PostgreSQL 16:** Normalized schema with UUID primary keys, temporal indexing (`CREATE INDEX idx_events_patient_date ON health_events (patient_id, event_date DESC)`), and full JSONB support for unstructured source coordinates.
- **Vector Database (Qdrant / pgvector):** Chunk embeddings (using BAAI/bge-small-en-v1.5 or all-MiniLM-L6-v2) indexed with HNSW. Every vector payload carries mandatory `{ patient_id, document_id, page_number, report_date, document_type }`. Queries strictly enforce `filter: { must: [{ key: "patient_id", match: { value: req.patientId } }] }`.
- **Encrypted Blob Storage:** Files stored with random UUID filenames on disk or S3 bucket, preventing direct URL traversal.

---

## 4. End-to-End Execution Workflows

### 4.1 Document Ingestion & Processing Flow
```mermaid
sequenceDiagram
    autonumber
    actor Patient
    participant UI as Patient Portal
    participant API as Node.js Gateway
    participant Storage as Encrypted Blob Storage
    participant Queue as Redis / BullMQ
    participant AI as AI Worker (Python)
    participant DB as PostgreSQL
    participant Vec as Vector Store

    Patient->>UI: Selects "Upload Report" (e.g., HbA1c_July2026.pdf)
    UI->>API: POST /api/v1/documents/upload (Multipart)
    API->>API: Validate MIME type, size & compute SHA-256
    API->>Storage: Save binary with immutable UUID key
    API->>DB: INSERT into documents (status: 'PENDING')
    API->>Queue: Push job { document_id, patient_id, file_path }
    API-->>UI: 202 Accepted { document_id, status: 'PENDING' }

    Queue->>AI: Worker picks up job
    AI->>AI: PyMuPDF / OCR extraction per page
    AI->>AI: Classify Document Type ('DIABETES_PANEL')
    AI->>AI: Extract Lab Results (HbA1c = 7.2%, Glucose = 142 mg/dL)
    AI->>AI: Normalize Units & Validate Ranges
    AI->>DB: INSERT into lab_results & health_events
    AI->>DB: Link events to condition ('COND-DIABETES')
    AI->>Vec: Embed text chunks with metadata filter tags
    AI->>DB: UPDATE documents SET status = 'COMPLETED', confidence = 0.96
    AI-->>Queue: Acknowledge job completion
    Queue-->>API: Emit WebSocket 'DOCUMENT_PROCESSED'
    API-->>UI: Push notification & update timeline view
```

### 4.2 AI Query, Evidence Validation & Safety Flow
```mermaid
sequenceDiagram
    autonumber
    actor Patient
    participant UI as Patient Portal
    participant API as Node.js Gateway
    participant AI as AI Service (Python)
    participant DB as PostgreSQL
    participant Vec as Vector Store
    participant LLM as Healthcare LLM

    Patient->>UI: Enters "Meri sugar pichli report se kam hui kya?"
    UI->>API: POST /api/v1/ai/query { query, conversation_id }
    API->>AI: Forward Query with Patient Context
    AI->>AI: Multilingual & Intent Parser: Intent=COMPARE, Param=GLUCOSE/HBA1C
    AI->>DB: Query chronological lab results for patient
    DB-->>AI: Returns: March 2026 (8.2%), July 2026 (7.2%)
    AI->>Vec: Query vector chunks for qualitative doctor notes
    Vec-->>AI: Returns chunk from Page 2 of March report
    AI->>LLM: Prompt with Structured Context + Document Chunks
    LLM-->>AI: Raw response with claims
    AI->>AI: Claim Extraction & Evidence Matching
    AI->>AI: Verify: "8.2% to 7.2%" exactly supported by DB & Doc DOC-9282
    AI->>AI: Safety Filter: Confirm no unauthorized dosage or diagnosis
    AI->>AI: Assign Evidence Confidence: "STRONG"
    AI-->>API: Response payload { answer, citations, evidence_strength }
    API-->>UI: 200 OK
    UI->>UI: Render response with interactive citation badges & Evidence Drawer
```
