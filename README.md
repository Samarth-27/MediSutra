# MediSutra: Longitudinal Personal Health Intelligence Platform

> **Tagline:** One Person. One Health Identity. One Complete Health Journey.  
> **Final-Year CSE Major Project**

---

## 1. Overview

**MediSutra** transforms scattered, multi-year medical reports (PDFs, lab tests, prescriptions) into a unified, chronological, condition-centric health journey. 

Rather than treating diagnostic reports as isolated files, MediSutra structures medical events, tracks disease lifecycles (Diagnosis → Baseline → Treatment → Follow-up → Latest Documented State), monitors expected vs. actual clinical checkpoints without passing judgment, and provides an evidence-grounded AI intelligence layer supporting English, Hindi, and Hinglish.

---

## 2. Master Architectural Specifications

All foundational engineering documentation and architectural diagrams are established under `/docs`:

1. [PROJECT_CONTEXT.md](file:///c:/Users/Lenovo/OneDrive/Desktop/MEDISUTRA/docs/PROJECT_CONTEXT.md) — Architecture decisions, conventions, and engineering standards.
2. [REQUIREMENTS.md](file:///c:/Users/Lenovo/OneDrive/Desktop/MEDISUTRA/docs/REQUIREMENTS.md) — Complete functional, non-functional requirements and MVP roadmap.
3. [ARCHITECTURE.md](file:///c:/Users/Lenovo/OneDrive/Desktop/MEDISUTRA/docs/ARCHITECTURE.md) — Multi-tier system architecture, sequence flows, and Mermaid diagrams.
4. [DATABASE_DESIGN.md](file:///c:/Users/Lenovo/OneDrive/Desktop/MEDISUTRA/docs/DATABASE_DESIGN.md) — Full relational schema DDL, indexing strategies, and Mermaid ERD.
5. [API_CONTRACT.md](file:///c:/Users/Lenovo/OneDrive/Desktop/MEDISUTRA/docs/API_CONTRACT.md) — RESTful API endpoint contracts, request/response JSON envelopes.
6. [AI_ARCHITECTURE.md](file:///c:/Users/Lenovo/OneDrive/Desktop/MEDISUTRA/docs/AI_ARCHITECTURE.md) — Hybrid RAG, Hinglish intent parsing, claim extraction, evidence validation, and safety guardrails.
7. [SECURITY.md](file:///c:/Users/Lenovo/OneDrive/Desktop/MEDISUTRA/docs/SECURITY.md) — Threat model, RBAC matrix, immutable audit trails, and Indian DPDPA / HIPAA alignment.
8. [UI_DESIGN.md](file:///c:/Users/Lenovo/OneDrive/Desktop/MEDISUTRA/docs/UI_DESIGN.md) — Clinical design system tokens, typography, and frontend page hierarchy.
9. [DEVELOPMENT_PLAN.md](file:///c:/Users/Lenovo/OneDrive/Desktop/MEDISUTRA/docs/DEVELOPMENT_PLAN.md) — 14 Specialized agent roles, agent dependency graph, and 12-phase execution roadmap.
10. [COMPETITIVE_RESEARCH_AND_MODEL_INNOVATION.md](file:///c:/Users/Lenovo/OneDrive/Desktop/MEDISUTRA/docs/COMPETITIVE_RESEARCH_AND_MODEL_INNOVATION.md) — Deep architectural benchmarking against ABDM, Apple Health, Epic MyChart, and unique neuro-symbolic innovations.
11. [HUMAN_REPORT_CENTER_AND_HOSPITAL_NETWORK.md](file:///c:/Users/Lenovo/OneDrive/Desktop/MEDISUTRA/docs/HUMAN_REPORT_CENTER_AND_HOSPITAL_NETWORK.md) — Universal Human Report Center model, multi-hospital station federation (Apollo, Fortis, Max, AIIMS, Dr. Lal PathLabs, Metropolis), cross-facility disease encounters, and diagnostic report ingestion.

---

## 3. Human Report Center (HRC) & Multi-Hospital Network

MediSutra operates as a sovereign **Human Report Center** where:
- **Every Hospital has a Connected Station**: Apollo Hospitals, Fortis Memorial, Max Super Speciality, AIIMS New Delhi, Dr. Lal PathLabs, and Metropolis Healthcare operate federated nodes.
- **Universal Citizen Registry**: Doctors across any participating institution can query registered patients and inspect their longitudinal health dossiers.
- **Encounter & Disease Ingestion ("If any disease comes to him")**: Doctors immediately log acute and chronic disease encounters with institutional stamps, ICD-10 coding, clinical assessments, and prescribed regimens.
- **Centralized Diagnostic Report Insertion ("Any report generated is inserted")**: Diagnostic laboratories and hospital pathology labs directly ingest test panels into the central vault, linking them to conditions and updating biometric trajectories.
- **Lifetime Disease & Report Continuity**: Doctors can review past resolved illnesses (e.g., Bronchitis, Dengue, Sinusitis) alongside active chronic conditions with provenance from past hospital visits.

---

## 3. Running MediSutra Locally

### Backend Core API Gateway
```bash
cd backend
npm install
npm run build
node dist/server.js
# Core API running at http://localhost:5000/api/v1
```

### Frontend Web Portal
```bash
cd frontend
npm install
npm run dev -- --port 3000
# Portal accessible at http://localhost:3000
```

### Python AI & OCR Microservice
```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --port 8000
```

---

## 4. Synthetic Patient Demonstration Profile

- **Patient Name:** Rahul Sharma
- **Digital Health ID:** `MED-00010001`
- **Age / Sex / Blood Group:** 38 / Male / B+
- **Records Spanning:** 2024 to 2026
- **Conditions Modeled:**
  - **Type 2 Diabetes Mellitus:** Active management with Metformin 500mg BID; HbA1c trajectory documented declining from 8.7% down to 6.9%.
  - **Vitamin D Deficiency:** Documented resolved (normalized from 14 to 38 ng/mL).
  - **Acute Viral Fever:** Documented resolved in Aug 2024.
- **Protocol Checkpoints:**
  - M2 (Month 2): Available (`✓`)
  - M4 (Month 4): No corresponding record found in this system (`⚠`)
  - M6 (Month 6): Available (`✓`)
  - Latest: Available (`✓`)
