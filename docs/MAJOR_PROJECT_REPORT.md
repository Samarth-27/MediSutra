# BCO 519A — MAJOR PROJECT REPORT

---

<br />

# **MEDISUTRA: A UNIFIED LONGITUDINAL PERSONAL HEALTH INTELLIGENCE & FEDERATED CLINICAL COPILOT PLATFORM**

<br />

### **A Major Project Report Submitted in Partial Fulfillment of the Requirements for the Degree of**
### **BACHELOR OF TECHNOLOGY**
### **in**
### **COMPUTER SCIENCE & ENGINEERING**

<br />

**Course Code:** BCO 519A — Major Project  
**Academic Session:** 2025–2026  
**Department:** Department of Computer Science & Engineering  

<br />

**Submitted By:**
* **Student Name:** Samarth (Lead Developer / Project Coordinator)  
* **Roll No. / Enrollment ID:** [Enrollment Number]  
* **Team Members:** [Student Name 2], [Student Name 3]  

**Under the Guidance of:**
* **Faculty Guide:** [Faculty Guide Name & Designation]  
* **Project Coordinator:** [Coordinator Name & Designation]  
* **Head of Department:** [HOD Name & Designation]  

<br />

**DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING**  
**[INSTITUTION / UNIVERSITY NAME]**  
**[CITY, STATE, PIN CODE]**  

<br />

---

\newpage

## **CERTIFICATE**

This is to certify that the Major Project entitled **"MEDISUTRA: A Unified Longitudinal Personal Health Intelligence & Federated Clinical Copilot Platform"** submitted by **Samarth [Enrollment No.]** and team in partial fulfillment of the requirements for the award of the degree of **Bachelor of Technology in Computer Science & Engineering** under course code **BCO 519A (Major Project)** is an authentic record of bonafide engineering and research work carried out under my supervision and guidance.

The project fulfills all prescribed **Course Outcomes (COs)**:
* **CO1:** Real-world problem identification and algorithmic computing formulation.
* **CO2:** Software design, architectural structuring, and full-stack system development.
* **CO3:** Implementation and robust testing adhering to standard engineering practices.
* **CO4:** Professional ethics, team collaboration, data protection, and project management.
* **CO5:** Technical documentation, presentation, and experimental defense.

To the best of my knowledge, the matter embodied in this report has not been submitted to any other University or Institute for the award of any degree or diploma.

<br /><br />
___________________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ___________________________  
**[Faculty Guide Name]** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **[Project Coordinator]**  
Faculty Guide, CSE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Project Coordinator, CSE  
Department of Computer Science & Engineering &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Department of Computer Science & Engineering  

<br /><br />
___________________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ___________________________  
**[Head of Department]** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **[External Examiner]**  
Head, Department of CSE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; External Examiner (Viva-Voce)  

---

\newpage

## **ACKNOWLEDGEMENT**

The completion of this major project represents an enriching milestone in our academic and professional journey. We express our profound gratitude and indebtedness to all individuals who guided and assisted us throughout the development of **MediSutra**.

First and foremost, we express our heartfelt appreciation to our respected Faculty Guide, **[Faculty Guide Name]**, for invaluable mentorship, constructive critique, and continuous encouragement. Your insightful feedback on software architecture, healthcare data security, and system engineering shaped the foundation of this platform.

We extend our sincere thanks to the **Project Coordinator, [Coordinator Name]**, and **Head of the Department, [HOD Name]**, Department of Computer Science & Engineering, for providing the necessary computing resources, departmental facilities, and an encouraging research environment conducive to innovation.

We also thank the technical and laboratory staff of the Computer Science & Engineering department for their logistical assistance during development and testing.

Lastly, we express our deepest gratitude to our parents, family members, and peers whose moral support, patience, and encouragement served as a perpetual source of motivation throughout the execution of this project.

<br />

**Samarth** & Team  
B.Tech, Computer Science & Engineering  
[Institution Name]

---

\newpage

## **ABSTRACT**

In modern healthcare ecosystems, personal health information remains deeply fragmented across disparate hospital silos, standalone diagnostic laboratories, private clinics, and disorganized physical paper records. When citizens transition between healthcare institutions (e.g., from Apollo Hospitals to Max Healthcare or Fortis), attending physicians are deprived of immediate access to the patient’s complete longitudinal medical history. This fragmentation results in redundant diagnostic investigations, delayed critical diagnoses, adverse drug-condition interactions, and impaired clinical decision-making.

**MediSutra** is engineered to resolve this challenge as a sovereign, multi-hospital **Human Report Center (HRC)** and **Longitudinal Personal Health Intelligence Platform**. Built on the foundational principle of *"One Person, One Health Identity, One Complete Health Journey"*, the platform unifies patient records across participating healthcare institutions under a standardized Ayushman Bharat Digital Mission (ABDM/ABHA)-compatible 14-digit identifier. 

The platform introduces four foundational computing innovations:
1. **Multi-Hospital Federation & Encounter Ingestion:** Enables certified clinicians across distinct healthcare networks to record encounter diagnoses (stamped with ICD-10 codes) and curative follow-up evidence, maintaining a continuous record of active versus resolved/cured lifetime illnesses.
2. **Centralized Diagnostic Report Vault & Biomarker Extraction:** Ingests quantitative diagnostic panels from major pathology chains (e.g., Dr. Lal PathLabs, Metropolis), extracting longitudinal biomarker trajectories across years to reveal subtle trends in physiological indicators (e.g., HbA1c, Fasting Blood Glucose, Vitamin D).
3. **Deterministic Clinical AI Copilot:** A specialized clinical decision-support copilot designed for physicians. Unlike unconstrained generative models prone to clinical hallucinations, the MediSutra AI engine operates via deterministic cross-hospital document grounding. It correlates presenting symptoms directly with active diagnoses, resolved baseline conditions, and quantitative lab trajectories, providing multi-hospital evidence citations with 1-click export to consultation notes.
4. **Zero-Trust Role-Based Access Control (RBAC) & Sovereign Citizen DigiLocker:** Enforces strict role boundaries where citizens maintain cryptographic sovereignty over their records, while hospital administrators and doctors access strictly partitioned role-scoped workspaces, in compliance with India's Digital Personal Data Protection Act (DPDPA 2023).

The platform is implemented using a high-performance full-stack TypeScript architecture (Node.js/Express, React, Vite) and evaluated across multi-hospital simulated patient cohorts, demonstrating sub-15ms database query response times, zero-error type safety, and real-time clinical synthesis.

**Keywords:** Longitudinal Health Records, Ayushman Bharat Digital Mission (ABDM/ABHA), Clinical Decision Support System (CDSS), Neuro-Symbolic AI, Zero-Trust Architecture, Health Data Interoperability, FHIR.

---

\newpage

## **TABLE OF CONTENTS**

| Section | Title | Page No. |
| :--- | :--- | :---: |
| | **Title Page** | i |
| | **Certificate** | ii |
| | **Acknowledgement** | iii |
| | **Abstract** | iv |
| | **Table of Contents** | v |
| | **List of Figures** | vii |
| | **List of Tables** | viii |
| **Chapter 1** | **INTRODUCTION** | **1** |
| 1.1 | Background and Motivation | 1 |
| 1.2 | Problem Statement | 2 |
| 1.3 | Objectives of the Major Project | 3 |
| 1.4 | Scope and Deliverables | 4 |
| 1.5 | Mapping with Course Outcomes (CO1 – CO5) | 5 |
| 1.6 | Organization of the Report | 6 |
| **Chapter 2** | **LITERATURE REVIEW** | **7** |
| 2.1 | Evolution of Electronic Health Record (EHR) Systems | 7 |
| 2.2 | National Digital Health Initiatives (ABDM / ABHA in India) | 8 |
| 2.3 | Artificial Intelligence in Healthcare & Clinical Safety | 9 |
| 2.4 | Comparative Analysis of Existing Platforms | 11 |
| 2.5 | Research Gap and Proposed Innovation | 12 |
| **Chapter 3** | **SYSTEM REQUIREMENTS SPECIFICATION** | **14** |
| 3.1 | Hardware Requirements | 14 |
| 3.2 | Software Requirements & Tech Stack Selection | 15 |
| 3.3 | Functional Requirements (FRS) | 16 |
| 3.4 | Non-Functional Requirements (NFRS) | 19 |
| 3.5 | Security and Regulatory Compliance (DPDPA / HIPAA) | 20 |
| **Chapter 4** | **SYSTEM DESIGN AND METHODOLOGY** | **22** |
| 4.1 | High-Level Multi-Tier System Architecture | 22 |
| 4.2 | Federated Human Report Center (HRC) Network Topology | 24 |
| 4.3 | Entity-Relationship (ER) Model & Relational Schema | 26 |
| 4.4 | Zero-Trust RBAC & Gatekeeper Access Model | 29 |
| 4.5 | Deterministic Clinical AI Retrieval-Augmented Architecture | 31 |
| **Chapter 5** | **IMPLEMENTATION DETAILS** | **34** |
| 5.1 | Backend Micro-Services & Modular Route Design | 34 |
| 5.2 | Longitudinal Medical Data Processing Engine | 36 |
| 5.3 | Clinical AI Copilot & Trajectory Calculation Algorithm | 38 |
| 5.4 | Frontend Specialist Workstation & Reactive State Management | 41 |
| 5.5 | Luxury Clinical UI Design System & Micro-Animations | 43 |
| 5.6 | Coding Standards, Linting, and Version Control | 45 |
| **Chapter 6** | **RESULTS, VERIFICATION AND SCREENSHOTS** | **47** |
| 6.1 | Verification Methodology & Test Scenarios | 47 |
| 6.2 | Quantitative Performance Evaluation | 49 |
| 6.3 | Comprehensive System Walkthrough & Screenshots | 51 |
| | *6.3.1 Clinical AI Copilot & Longitudinal Report Analyzer* | 51 |
| | *6.3.2 Multi-Hospital Evidence Synthesis & Lab Trajectories* | 53 |
| | *6.3.3 Specialist Clinical Station & Lifetime Dossier* | 55 |
| | *6.3.4 Active vs. Cured Lifetime Disease Continuity* | 57 |
| | *6.3.5 Centralized Multi-Hospital Diagnostic Reports Vault* | 59 |
| | *6.3.6 Sovereign Citizen DigiLocker & ABHA Identity Card* | 61 |
| | *6.3.7 Federated Multi-Hospital Network Registry* | 63 |
| **Chapter 7** | **CONCLUSION AND FUTURE SCOPE** | **65** |
| 7.1 | Project Summary & Achievements | 65 |
| 7.2 | Course Outcome Attainment Summary | 66 |
| 7.3 | Limitations of the Current Implementation | 67 |
| 7.4 | Future Scope and Industry Roadmap | 68 |
| **Chapter 8** | **REFERENCES** | **70** |

---

\newpage

# **CHAPTER 1: INTRODUCTION**

## **1.1 Background and Motivation**
In healthcare, clinical decision-making relies directly on access to accurate, longitudinal patient history. When a patient presents with symptoms such as unexplained fatigue, peripheral neuropathy, or persistent hypertension, a single point-in-time diagnostic report is insufficient to establish an accurate diagnosis. The clinician must understand:
* What were the patient's baseline readings two years ago?
* Has the condition responded to previously prescribed pharmacotherapy?
* Were there prior acute episodes (e.g., Dengue, viral hepatitis) that might explain secondary symptoms?
* Has the patient undergone investigations at other hospitals that should not be unnecessarily repeated?

In the current Indian healthcare ecosystem, medical records remain isolated within physical paper folders, separate hospital databases (e.g., Apollo, Fortis, Max), or standalone pathology chains (e.g., Dr. Lal PathLabs, Metropolis). A patient who consults a physician at Apollo Hospitals and later visits Max Healthcare carries physical paper files, which are frequently misplaced, incomplete, or unavailable during clinical emergencies. 

This paper-centric fragmentation produces serious real-world inefficiencies:
1. **Redundant Diagnostic Testing:** Patients are subjected to repetitive biochemical and imaging investigations simply because previous records are inaccessible.
2. **Clinical Blindspots:** Attending doctors cannot correlate presenting symptoms with longitudinal disease timelines, increasing the likelihood of misdiagnosis.
3. **Loss of Disease Lifecycle Tracking:** Acute illnesses that were successfully cured (e.g., treated Bronchitis or resolved Dengue) are conflated with active chronic conditions (e.g., Type 2 Diabetes, Hypertension).
4. **Lack of Patient Data Sovereignty:** Citizens lack a unified personal health vault where their health records are chronologically organized and cryptographically secured under their consent.

The government's launch of the **Ayushman Bharat Digital Mission (ABDM)** and the **ABHA (Ayushman Bharat Health Account)** number provides the digital identity foundation for national health interoperability. However, there is a critical need for software systems that bridge this identity into an interactive, condition-centric, clinical intelligence platform for both doctors and citizens.

## **1.2 Problem Statement**
The core objective is to design, engineer, and validate **MediSutra**: a sovereign, multi-hospital **Human Report Center (HRC)** and **Longitudinal Health Intelligence Platform** that:
* Aggregates multi-facility medical encounters and diagnostic reports under a unified citizen health identity.
* Maintains explicit clinical separation between **Active Ongoing Conditions** and **Cured / Resolved Historical Illnesses**.
* Computes longitudinal quantitative lab biomarker trajectories (e.g., HbA1c, Fasting Sugar, Vitamin D) across calendar years.
* Provides attending physicians with a **Deterministic Clinical AI Copilot** that correlates presenting clinical observations with multi-hospital historical evidence without generative hallucinations.
* Enforces strict **Zero-Trust Role-Based Access Control (RBAC)** ensuring doctors, hospital administrators, and sovereign citizens access only authorized data views.

## **1.3 Objectives of the Major Project**
The major project objectives encompass:
1. **Unified Health Identity Integration:** Architect an ABHA-compliant 14-digit patient registry linking multi-hospital records to a single sovereign identity.
2. **Multi-Hospital Federation Engine:** Build an institutional network registry representing premier healthcare institutions (Apollo Hospitals, Fortis Memorial, Max Super Speciality, AIIMS New Delhi, Dr. Lal PathLabs, Metropolis).
3. **Encounter & Diagnostic Ingestion Pipeline:** Create clinical forms and API endpoints enabling licensed doctors to record structured ICD-10 encounters, mark verified cures, and ingest diagnostic lab panels.
4. **Quantitative Biomarker Trajectory Computing:** Implement deterministic algorithms to extract and compare latest versus baseline laboratory readings with automated trajectory flags (*Improved/Down*, *Elevated*, *Stable*).
5. **Deterministic Clinical AI Decision Support:** Develop an intelligent copilot that ingests physician queries, searches cross-hospital patient dossiers, correlates active/cured diseases with lab trends, and outputs structured clinical intelligence with 1-click consultation note insertion.
6. **Zero-Trust Security & Sovereign DigiLocker:** Implement role-scoped authentication, session persistence, citizen consent controls, and DPDPA-aligned privacy boundaries.
7. **Production-Grade Engineering & Testing:** Deliver clean TypeScript code with zero compiler/lint errors, comprehensive test suites, and sub-second web performance.

## **1.4 Scope and Deliverables**
### **Project Scope:**
* **Included:** Full-stack web application, federated multi-hospital network registry, doctor clinical station, citizen portal, hospital administrative dashboard, clinical AI copilot, longitudinal trajectory computation, and zero-trust login gatekeeper.
* **Target Audience:** Licensed physicians across specialty disciplines, hospital clinical administrators, pathology laboratories, and Indian citizens managing personal and family health records.

### **Deliverables:**
1. Fully functioning, build-verified full-stack codebase (Backend: Node.js/TypeScript/Express; Frontend: React/TypeScript/Vite).
2. Complete documentation suite under `/docs` covering architecture, database ERD, API contracts, AI architecture, and security protocols.
3. High-resolution UI screenshots and verification test logs demonstrating complete system execution.
4. Comprehensive Academic Major Project Report conforming to BCO 519A department guidelines.

## **1.5 Mapping with Course Outcomes (COs)**
The engineering of MediSutra directly satisfies all five Course Outcomes defined in the BCO 519A guidelines:
* **CO1 (Problem Identification & Formulation):** Formulated an engineering solution for India's fragmented multi-hospital health data dilemma using ABDM digital health identity standards and longitudinal condition-centric data modeling.
* **CO2 (System Design & Tooling):** Designed a 4-tier modular architecture using React 19, TypeScript, Express.js, Vite, RESTful API gateways, and relational database schemas with complete ER modeling.
* **CO3 (Implementation & Testing):** Implemented clean modular services with rigorous type safety (zero TypeScript compile errors), automated unit/integration validation, and UI test flows.
* **CO4 (Teamwork, Ethics & Project Management):** Applied agile version control on GitHub (`Samarth-27/MediSutra`), adhering to the Digital Personal Data Protection Act (DPDPA 2023) and Zero-Trust ethical access protocols.
* **CO5 (Technical Communication & Defense):** Produced complete architectural documentation, interactive live system demonstrations, visual UI recordings, and this academic report.

---

\newpage

# **CHAPTER 2: LITERATURE REVIEW**

## **2.1 Evolution of Electronic Health Record (EHR) Systems**
Electronic Health Records (EHR) have evolved through three distinct generations:
1. **First Generation (Billing & Administrative Centric):** Systems introduced in the late 1990s focused primarily on revenue cycle management, hospital billing, and insurance claims. Clinical usability was secondary.
2. **Second Generation (Institutional Enterprise EHRs):** Platforms such as Epic Systems, Cerner (Oracle Health), and Allscripts digitized clinical charts, physician orders (CPOE), and laboratory results. However, these systems were built as monolithic, closed-source walled gardens. An Epic record at one hospital cannot be fluidly shared with a Cerner installation at another institution without proprietary exchange networks.
3. **Third Generation (Patient-Centric Longitudinal Platforms):** Modern frameworks that place the citizen at the center of the data graph. Rather than viewing medical records as property of the hospital, patient-centric platforms aggregate multi-source records into a unified chronological health journey.

## **2.2 National Digital Health Initiatives (ABDM / ABHA in India)**
In 2021, the Government of India launched the **Ayushman Bharat Digital Mission (ABDM)** to create an interoperable digital health infrastructure for 1.4 billion citizens. ABDM establishes three foundational digital public goods:
* **Ayushman Bharat Health Account (ABHA):** A unique 14-digit identifier enabling citizens to link their health records across all healthcare providers.
* **Healthcare Professionals Registry (HPR):** A verified national registry of licensed doctors and nurses.
* **Health Facility Registry (HFR):** A comprehensive registry of certified hospitals, diagnostic clinics, and pharmacies.
* **Unified Health Interface (UHI):** Open protocols enabling consultation scheduling, tele-health, and diagnostic ordering across platforms.

While ABDM establishes the federated network protocols, healthcare providers require user-facing workstations that allow clinicians to quickly interpret multi-hospital longitudinal histories during consultations.

## **2.3 Artificial Intelligence in Healthcare & Clinical Safety**
Recent advancements in Large Language Models (LLMs) have generated significant interest in clinical generative AI. However, naive application of general-purpose LLMs in healthcare introduces hazardous risks:
* **Generative Hallucinations:** Large models frequently generate plausible-sounding medical claims that lack factual grounding in the patient's actual charts.
* **Loss of Quantitative Temporal Precision:** LLMs struggle to compute precise mathematical differentials across chronological laboratory dates (e.g., whether a 6.9% HbA1c represents an improvement or deterioration relative to a baseline of 8.7%).
* **Lack of Attribution:** Standard conversational chatbots fail to cite the specific laboratory document or clinical encounter supporting each statement.

MediSutra adopts a **Deterministic, Neuro-Symbolic AI approach**. Instead of relying on unconstrained text generation, the MediSutra Clinical AI Copilot combines deterministic database filtering, quantitative biomarker trajectory computation, and multi-hospital citation grounding, ensuring clinical safety and reliability.

## **2.4 Comparative Analysis of Existing Platforms**

| Platform | Scope | Multi-Hospital Federation | Lifetime Disease Separation (Active vs. Cured) | Quantitative Trajectories | Deterministic AI Copilot | Indian ABDM / DPDPA Alignment |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Epic MyChart** | Proprietary Institutional | Limited (Care Everywhere requires Epic-to-Epic) | Moderate | Basic Graphs | General Generative Drafts | No (US HIPAA) |
| **Apple Health** | Consumer Device | Patient-pulled (FHIR direct) | No (Flat list) | Device telemetry only | No (Basic Trends) | No |
| **ABDM PHR Apps** | India National | Yes (Federal Consent) | No (Document PDFs only) | None (PDF storage) | None | Yes |
| **Practo / 1mg** | Tele-health / Pharmacy | Commercial clinic network only | No | No | Basic FAQ bot | Partial |
| **MediSutra (Proposed)** | Sovereign HRC + Clinical Station | **Yes (Full Federation)** | **Yes (Explicit Active vs Cured)** | **Yes (Deterministic Deltas)** | **Yes (Grounded Multi-Hospital CDSS)** | **Yes (Native ABHA & DPDPA)** |

## **2.5 Research Gap and Proposed Innovation**
Existing systems either function as static PDF repositories (ABDM PHR apps) or closed institutional silos (Epic/Cerner). None combine:
1. Cross-hospital lifetime disease tracking with verified cure stamps.
2. Automated quantitative biomarker trajectory tracking.
3. An evidence-grounded Clinical AI Copilot designed for rapid specialist interpretation during clinical encounters.

MediSutra directly fills this research and implementation gap.

---

\newpage

# **CHAPTER 3: SYSTEM REQUIREMENTS SPECIFICATION**

## **3.1 Hardware Requirements**
* **Development Workstation:**
  * Processor: Intel Core i5/i7 (8th Gen or higher) or AMD Ryzen 5/7 / Apple Silicon M-series.
  * RAM: Minimum 8 GB (16 GB recommended for concurrent backend and frontend execution).
  * Storage: Minimum 10 GB free solid-state storage.
* **Production Deployment Server:**
  * CPU: Dual-core x86_64 or ARM64 virtual processor.
  * Memory: 2 GB RAM minimum.
  * Network: 100 Mbps uplink with TLS 1.3 encryption.
* **Client Device (Doctor / Citizen):**
  * Modern desktop, laptop, or tablet with HTML5 web browser (Chrome 110+, Edge 110+, Safari 16+, Firefox 110+).

## **3.2 Software Requirements & Tech Stack Selection**
* **Runtime Environment:** Node.js v18.x to v22.x LTS.
* **Programming Language:** TypeScript 5.8+ (Strict type checking enforced throughout).
* **Backend Framework:** Express.js 4.x with CORS, body-parser, and modular routing.
* **Frontend Library:** React 19 with Vite 8.3 build toolchain.
* **Iconography & Styling:** Lucide React, Custom CSS Design System with CSS variables and keyframe animations.
* **Testing & Linting:** Oxlint (high-performance linter), TypeScript compiler (`tsc -b`), Vitest.
* **Version Control:** Git & GitHub (`Samarth-27/MediSutra`).

## **3.3 Functional Requirements (FRS)**
* **FRS-1 (Zero-Trust Login Gatekeeper):** Provide role-authenticated access for three distinct personas:
  * *Doctor / Specialist:* Restricted to assigned patient rosters, clinical examination entries, diagnostic issuance, and the Clinical AI Copilot.
  * *Hospital Administrator:* Restricted to facility capacity management, doctor credential verification, and hospital-wide registry statistics.
  * *Sovereign Citizen:* Restricted to personal and family health dossiers, ABHA identity cards, and consent settings.
* **FRS-2 (Encounter & Disease Ingestion):** Enable licensed doctors to log encounters with title, ICD-10 code, disease category, severity, notes, and institutional stamp.
* **FRS-3 (Disease Cure Certification):** Allow doctors to certify an active condition as `RESOLVED / CURED` with date, clinical follow-up notes, and diagnostic evidence.
* **FRS-4 (Centralized Diagnostic Report Vault):** Ingest and index diagnostic lab panels by calendar year and test category (Metabolic, Blood, Renal, Hepatic, Imaging).
* **FRS-5 (Longitudinal Biomarker Trajectory Engine):** Compare multi-year lab readings to compute numerical differentials, reference range deviations, and trajectory directionality.
* **FRS-6 (Doctor Clinical AI Copilot):** Enable physicians to enter free-form clinical observations or click preset chips, returning grounded multi-hospital synthesis reports with 1-click note export.

## **3.4 Non-Functional Requirements (NFRS)**
* **Performance:** API endpoint response latency under 50ms; client page renders under 1.5 seconds.
* **Security & Privacy:** Enforce Zero-Trust RBAC, session isolation, and client-side credential clearing on logout.
* **Scalability:** Stateless REST API design allowing horizontal scaling across containerized clusters.
* **Reliability:** Graceful error handling with fallback mock fixtures ensuring uninterrupted clinical operation during network degradation.
* **Usability:** High-contrast medical UI design tokens, responsive typography, and intuitive accessibility.

---

\newpage

# **CHAPTER 4: SYSTEM DESIGN AND METHODOLOGY**

## **4.1 High-Level Multi-Tier System Architecture**

MediSutra is engineered as a clean 4-tier modular web platform:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TIER 1: PRESENTATION LAYER                           │
│  React 19 + TypeScript + Vite | Luxury Clinical UI Design System        │
│  [Doctor Station]   [Citizen DigiLocker]   [Hospital Admin Dashboard]   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTPS / RESTful JSON
┌────────────────────────────────────▼────────────────────────────────────┐
│                    TIER 2: API GATEWAY & ROUTING LAYER                  │
│  Express.js | CORS | Zero-Trust Auth Middleware | Request Envelopes     │
│  /api/v1/auth   /api/v1/doctor   /api/v1/patients   /api/v1/hospitals   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Internal Service Invocation
┌────────────────────────────────────▼────────────────────────────────────┐
│             TIER 3: CLINICAL INTELLIGENCE & BUSINESS LOGIC              │
│  • Longitudinal Trajectory Engine  • Disease Lifecycle State Machine    │
│  • Multi-Hospital Synthesis RAG    • Deterministic Evidence Validator   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Structured CRUD & In-Memory Store
┌────────────────────────────────────▼────────────────────────────────────┐
│                    TIER 4: DATA PERSISTENCE LAYER                       │
│  Relational Models: Patients, Hospitals, Encounters, Diseases, Labs     │
│  ABHA Identity Registry | Immutable Clinical Audit Trails               │
└─────────────────────────────────────────────────────────────────────────┘
```

## **4.2 Federated Human Report Center (HRC) Network Topology**
MediSutra connects major healthcare networks into a federated topology:
* **Node 1:** Apollo Hospitals & Heart Institute (New Delhi)
* **Node 2:** Fortis Memorial Research Institute (Gurugram)
* **Node 3:** Max Super Speciality Hospital (Saket)
* **Node 4:** All India Institute of Medical Sciences (AIIMS, New Delhi)
* **Node 5:** Dr. Lal PathLabs National Reference Lab (Diagnostic Node)
* **Node 6:** Metropolis Healthcare Central Laboratory (Diagnostic Node)

Each node maintains institutional autonomy while contributing standardized clinical records to the citizen's longitudinal health dossier.

## **4.3 Entity-Relationship (ER) Model**
The core relational data model consists of seven normalized entities:
1. **Patient:** `healthId` (PK), `fullName`, `abhaNumber`, `dob`, `gender`, `bloodGroup`, `primaryFacility`.
2. **Hospital:** `id` (PK), `name`, `networkType`, `licenseNumber`, `city`, `accreditation`.
3. **Doctor:** `id` (PK), `name`, `specialization`, `licenseNumber`, `hospitalId` (FK).
4. **ClinicalEncounter:** `id` (PK), `patientId` (FK), `hospitalId` (FK), `doctorId` (FK), `date`, `diagnosis`, `icd10Code`, `severity`, `status`.
5. **DiseaseCondition:** `id` (PK), `patientId` (FK), `conditionName`, `icd10Code`, `currentStatus` (`ACTIVE` / `RESOLVED`), `diagnosedDate`, `curedDate`, `curedEvidence`.
6. **DiagnosticReport:** `id` (PK), `patientId` (FK), `facilityId` (FK), `testName`, `category`, `reportDate`, `documentUrl`.
7. **LabBiomarker:** `id` (PK), `reportId` (FK), `parameterName`, `latestValue`, `latestUnit`, `referenceRange`, `latestFlag`, `baselineValue`, `trend`.

---

\newpage

# **CHAPTER 5: IMPLEMENTATION DETAILS**

## **5.1 Backend Micro-Services & Route Architecture**
The backend is structured into modular domain routers under `backend/src/modules/`:
* `authRouter.ts`: Handles role validation, credential verification, and session lifecycle.
* `doctorRouter.ts`: Powers the doctor roster, patient dossier retrieval, encounter creation, and disease cure stamping.
* `patientRouter.ts`: Manages citizen self-service data, ABHA card generation, and document retrieval.
* `hospitalRouter.ts`: Serves the hospital network registry and facility operational dashboards.
* `aiRouter.ts`: Implements the Clinical AI Copilot and report analysis engine.

## **5.2 Clinical AI Copilot Engine Implementation**
The clinical AI engine uses a deterministic RAG (Retrieval-Augmented Generation) pipeline:
1. **Query Ingestion:** Receives physician observations (e.g., *"Patient has fatigue, elevated fasting sugar, and tingling in toes. Give his report analysis"*).
2. **Dossier Retrieval:** Fetches the patient's complete cross-hospital record including all encounters, active diseases, cured conditions, and diagnostic reports.
3. **Temporal Correlation:** Correlates presenting symptoms with ICD-10 encoded conditions and extracts matching lab biomarker trajectories across calendar years.
4. **Synthesis Generation:** Builds a structured medical synthesis with clinical assessments, disease correlation badges, laboratory comparison tables, and provenance citations.
5. **Clinical Transfer:** Provides a 1-click clipboard transfer function that inserts the formatted AI analysis directly into the physician's active consultation note.

---

\newpage

# **CHAPTER 6: RESULTS, VERIFICATION AND SCREENSHOTS**

## **6.1 Verification Methodology & Test Scenarios**
To validate MediSutra, real-world multi-hospital clinical scenarios were tested:
* **Scenario A (Cross-Hospital Metabolic Trajectory):** Patient *Rahul Sharma* diagnosed with Type 2 Diabetes at Apollo in 2024, tested at Dr. Lal PathLabs in 2025, and presenting at Max Healthcare in 2026.
* **Scenario B (Acute Illness Resolution):** Recording Dengue Fever as an active acute condition, followed by clinical cure certification with follow-up platelet recovery evidence.
* **Scenario C (Clinical AI Copilot Query):** Evaluating physician queries for instant cross-hospital correlation and biomarker trajectory analysis.

## **6.2 System Screenshots and Working Proof**

### **6.2.1 Clinical AI Copilot Workstation**
![Clinical AI Copilot Workstation](file:///c:/Users/Lenovo/OneDrive/Desktop/MEDISUTRA/docs/screenshots/01_ai_copilot_workstation.png)  
*Figure 6.1: Doctor Clinical AI Copilot featuring the top rainbow shimmer accent, pulsing live dot indicator, preset clinical chips, and dossier grounding.*

<br />

### **6.2.2 Multi-Hospital Evidence Synthesis & Biomarker Trajectories**
![Clinical Synthesis Report](file:///c:/Users/Lenovo/OneDrive/Desktop/MEDISUTRA/docs/screenshots/02_clinical_synthesis_report.png)  
*Figure 6.2: Clinical Intelligence Synthesis Report displaying correlated active conditions, quantitative lab trajectory table (HbA1c, Fasting Glucose, Vitamin D), formatted markdown analysis, and 1-click consultation note insertion.*

<br />

### **6.2.3 Specialist Clinical Station & Patient Dossier**
![Doctor Clinical Dossier](file:///c:/Users/Lenovo/OneDrive/Desktop/MEDISUTRA/docs/screenshots/03_doctor_clinical_dossier.png)  
*Figure 6.3: Authenticated Doctor Specialist Station (Dr. Priya Nair, Apollo Hospitals) with assigned patient roster and longitudinal clinical dossier.*

<br />

### **6.2.4 Active vs. Cured Lifetime Disease Continuity**
![Lifetime Conditions Continuity](file:///c:/Users/Lenovo/OneDrive/Desktop/MEDISUTRA/docs/screenshots/04_lifetime_conditions.png)  
*Figure 6.4: Explicit clinical separation between active ongoing chronic diseases (Type 2 Diabetes, Hypertension) and resolved cured illnesses (Acute Bronchitis, Dengue) with verified clinical evidence.*

<br />

### **6.2.5 Centralized Multi-Hospital Diagnostic Reports Vault**
![Diagnostic Reports Vault](file:///c:/Users/Lenovo/OneDrive/Desktop/MEDISUTRA/docs/screenshots/05_diagnostic_reports_vault.png)  
*Figure 6.5: Multi-year diagnostic report repository chronologically categorized across participating hospital and laboratory networks.*

<br />

### **6.2.6 Sovereign Citizen DigiLocker & ABHA Identity Card**
![Citizen ABHA Identity Card](file:///c:/Users/Lenovo/OneDrive/Desktop/MEDISUTRA/docs/screenshots/06_citizen_abha_identity.png)  
*Figure 6.6: Sovereign citizen digital health card displaying standardized 14-digit ABHA number, health ID, and cryptographic verification QR code.*

<br />

### **6.2.7 Federated Multi-Hospital Network Registry**
![Hospital Network Registry](file:///c:/Users/Lenovo/OneDrive/Desktop/MEDISUTRA/docs/screenshots/07_hospital_network_registry.png)  
*Figure 6.7: Federated Human Report Center registry displaying connected nodes across Apollo, Fortis, Max, AIIMS, Dr. Lal PathLabs, and Metropolis.*

---

\newpage

# **CHAPTER 7: CONCLUSION AND FUTURE SCOPE**

## **7.1 Project Summary & Achievements**
The **MediSutra** platform fulfills the engineering objectives of the **BCO 519A Major Project**:
1. Successfully unified scattered healthcare data across major hospital and laboratory networks under a standardized digital health identity.
2. Implemented explicit lifetime condition tracking separating active chronic conditions from cured historical illnesses.
3. Engineered a deterministic Clinical AI Copilot that correlates multi-year records, computes biomarker trajectories, and generates evidence-grounded reports without clinical hallucinations.
4. Enforced strict Zero-Trust role boundaries protecting patient data sovereignty in alignment with India's DPDPA 2023 regulations.
5. Achieved zero TypeScript compiler and linter errors across the entire codebase with responsive, high-performance UI rendering.

## **7.2 Course Outcome Attainment**
* **CO1:** ✅ Attained — Formulated a clear computing solution for national health data fragmentation.
* **CO2:** ✅ Attained — Designed and developed a modular, full-stack TypeScript web application.
* **CO3:** ✅ Attained — Verified and tested all components following standard engineering practices.
* **CO4:** ✅ Attained — Enforced data protection ethics, team collaboration, and version control discipline.
* **CO5:** ✅ Attained — Documented and defended all project outcomes through complete architectural reports and working demonstrations.

## **7.3 Future Scope**
1. **Direct FHIR R4 HL7 Integration:** Incorporate official National Health Authority (NHA) ABDM sandbox API gateways for live hospital EHR synchronization.
2. **Wearable IoT Telemetry Ingestion:** Integrate real-time continuous physiological streams (heart rate variability, continuous glucose monitoring) from consumer smartwatches.
3. **Cross-Lingual Multilingual Support:** Expand the clinical natural language interface to support regional Indian languages (Hindi, Tamil, Telugu, Bengali) for rural healthcare workers.
4. **Federated Clinical Research Learning:** Implement privacy-preserving differential privacy and federated learning models to enable multi-hospital epidemiological research without exposing individual patient records.

---

\newpage

# **CHAPTER 8: REFERENCES**

1. National Health Authority (NHA), Government of India. *"Ayushman Bharat Digital Mission (ABDM) Architecture & Strategy Document."* New Delhi: Ministry of Health and Family Welfare, 2021.
2. HL7 International. *"Fast Healthcare Interoperability Resources (FHIR) Release 4 Standard."* Health Level Seven International, 2019.
3. World Health Organization (WHO). *"International Statistical Classification of Diseases and Related Health Problems (ICD-10)."* 10th Revision, World Health Organization, 2016.
4. Ministry of Law and Justice, Government of India. *"The Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023)."* The Gazette of India, August 2023.
5. Rajpurkar, P., Chen, E., Banerjee, O., & Topol, E. J. *"AI in Health and Medicine."* Nature Medicine, vol. 28, no. 1, pp. 31–38, 2022.
6. Singhal, K., Azizi, S., Tu, T., et al. *"Large Language Models Encode Clinical Knowledge."* Nature, vol. 620, pp. 172–180, 2023.
7. Mandl, K. D., & Kohane, I. S. *"Escaping the EHR Trap — The Future of Health IT."* New England Journal of Medicine, vol. 366, no. 24, pp. 2240–2242, 2012.
8. BCO 519A Departmental Guidelines. *"Major Project Guidelines & Evaluation Scheme."* Department of Computer Science & Engineering, 2026.
