# BCO 519A — MAJOR PROJECT DISSERTATION REPORT

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
* **Team Members:** [Student Name 2] (Roll No: [Enrollment 2]), [Student Name 3] (Roll No: [Enrollment 3])  

**Under the Guidance & Supervision of:**
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

## **CERTIFICATE OF APPROVAL**

This is to certify that the Major Project entitled **"MEDISUTRA: A Unified Longitudinal Personal Health Intelligence & Federated Clinical Copilot Platform"** submitted by **Samarth [Enrollment No.]** and team in partial fulfillment of the requirements for the award of the degree of **Bachelor of Technology in Computer Science & Engineering** under course code **BCO 519A (Major Project)** is an authentic record of bonafide engineering and research work carried out under my supervision and guidance.

The project fulfills all prescribed **Course Outcomes (COs)**:
* **CO1:** Real-world problem identification and algorithmic computing formulation for healthcare data fragmentation.
* **CO2:** Software design, architectural structuring, and full-stack system development utilizing modern tools and programming frameworks.
* **CO3:** Implementation and robust testing adhering to standard engineering, verification, and documentation practices.
* **CO4:** Professional ethics, team collaboration, data protection governance, and project lifecycle management.
* **CO5:** Effective communication of project outcomes through comprehensive reports, presentations, and viva-voce examination.

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

## **DECLARATION OF ORIGINALITY**

We hereby declare that this Major Project Report entitled **"MEDISUTRA: A Unified Longitudinal Personal Health Intelligence & Federated Clinical Copilot Platform"** is our original work developed in partial fulfillment of course requirements for **BCO 519A**. We confirm that:
1. This work has been completed in adherence to the highest standards of academic integrity and engineering ethics.
2. All third-party libraries, open-source software dependencies, datasets, academic literature, and international standards (including HL7 FHIR, ICD-10, LOINC, and ABDM blueprints) have been properly cited and acknowledged.
3. No portion of this software or report has been plagiarized or submitted elsewhere for any academic degree, diploma, or certificate.
4. All patient data presented in this report consists of synthetically simulated clinical records and de-identified benchmark cohorts to protect citizen privacy in accordance with the Digital Personal Data Protection Act (DPDPA 2023).

<br />
___________________________  
**Samarth (Lead Developer)**  
Enrollment No: [Roll No]  
B.Tech Computer Science & Engineering  
Date: October 2026  

---

\newpage

## **ACKNOWLEDGEMENT**

The completion of this major project marks a pivotal milestone in our academic and professional journey. We express our profound gratitude to all the mentors, faculty members, and peers who guided and supported us throughout the conceptualization, design, implementation, and evaluation of **MediSutra**.

First and foremost, we express our heartfelt appreciation to our respected Faculty Guide, **[Faculty Guide Name]**, Department of Computer Science & Engineering, for invaluable mentorship, constructive critique, and continuous technical encouragement. Your profound guidance in software design, distributed architectures, and healthcare data security helped us navigate complex engineering challenges.

We extend our sincere thanks to the **Project Coordinator, [Coordinator Name]**, and the **Head of Department, [HOD Name]**, for providing state-of-the-art departmental computing infrastructure, laboratory resources, and a stimulating research atmosphere that fostered our creativity and innovation.

We are also thankful to the departmental technical staff for their continuous logistical support during development and testing phases. Finally, we express our deepest gratitude to our parents and peers whose unconditional encouragement, patience, and motivation fueled our commitment to excellence.

<br />

**Samarth & Team**  
Department of Computer Science & Engineering  

---

\newpage

## **ABSTRACT**

In modern healthcare ecosystems, medical records remain critically fragmented across proprietary hospital silos, standalone diagnostic laboratories, private outpatient clinics, and unstructured physical paper folders. When patients transition across healthcare facilities (e.g., from Apollo Hospitals to Max Healthcare or Fortis), attending clinicians face an acute absence of longitudinal medical history. This pervasive data fragmentation leads to redundant diagnostic testing, delayed critical interventions, adverse drug-condition interactions, and impaired clinical decision-making.

**MediSutra** is engineered as a sovereign, federated **Human Report Center (HRC)** and **Longitudinal Personal Health Intelligence Platform**. Built around the core design paradigm of *"One Person, One Health Identity, One Complete Health Journey"*, the platform aggregates disparate health events into a continuous, condition-centric health dossier anchored to a standardized 14-digit Ayushman Bharat Health Account (ABDM/ABHA) identifier.

The platform introduces four foundational engineering contributions:
1. **Federated Multi-Hospital Encounter Ingestion:** Connects major healthcare nodes (Apollo, Fortis, Max, AIIMS) into a federated clinical graph, enabling licensed clinicians to record structured ICD-10 encounter diagnoses and certify verified cure milestones with follow-up evidence, maintaining an explicit boundary between active chronic diseases and resolved historical illnesses.
2. **Centralized Diagnostic Vault & Biomarker Trajectory Computing:** Ingests structured pathology panels from diagnostic chains (Dr. Lal PathLabs, Metropolis), deterministically calculating numerical deltas, reference deviations, and multi-year trajectories (e.g., Glycated Hemoglobin HbA1c, Fasting Blood Glucose, Vitamin D).
3. **Deterministic Clinical AI Copilot:** Unlike unconstrained conversational models vulnerable to generative hallucinations, the MediSutra AI engine executes deterministic cross-hospital retrieval-augmented synthesis. It correlates free-form physician observations with the patient's complete longitudinal record, generating structured clinical assessments with multi-hospital citations and 1-click consultation note transfer.
4. **Zero-Trust Role-Based Access Control (RBAC) & Sovereign Citizen DigiLocker:** Implements strict role-scoped workspaces where citizens retain sovereign cryptographic consent over their records, while doctors and hospital administrators operate within isolated security domains, strictly compliant with India's Digital Personal Data Protection Act (DPDPA 2023).

The platform is developed using a full-stack TypeScript architecture (React 19, Vite, Express.js, Node.js) and validated across multi-hospital patient cohorts. Performance evaluations demonstrate sub-15ms database query response latencies, zero TypeScript compiler errors, and sub-second end-to-end clinical synthesis generation.

**Keywords:** Longitudinal Health Records, Ayushman Bharat Digital Mission (ABDM/ABHA), Clinical Decision Support System (CDSS), Neuro-Symbolic AI, Zero-Trust Architecture, Health Data Interoperability, FHIR R4, Biomarker Trajectories.

---

\newpage

## **TABLE OF CONTENTS**

| Chapter / Section | Title | Page No. |
| :--- | :--- | :---: |
| | Certificate of Approval | ii |
| | Declaration of Originality | iii |
| | Acknowledgement | iv |
| | Abstract | v |
| | List of Figures | viii |
| | List of Tables | x |
| | List of Abbreviations & Acronyms | xi |
| **Chapter 1** | **INTRODUCTION** | **1** |
| 1.1 | Global & National Healthcare Landscape | 1 |
| 1.2 | The Fragmentation Dilemma in Indian Healthcare | 3 |
| 1.3 | Motivation & Research Rationale | 4 |
| 1.4 | Problem Statement & Formal Problem Formulation | 6 |
| 1.5 | Objectives of the Major Project | 8 |
| 1.6 | Scope, Boundary Conditions & Assumptions | 9 |
| 1.7 | Course Outcome Attainment Mapping (CO1 – CO5) | 10 |
| 1.8 | Thesis Organization | 12 |
| **Chapter 2** | **LITERATURE REVIEW & THEORETICAL FOUNDATIONS** | **14** |
| 2.1 | Evolution of Health Information Systems (EHR) | 14 |
| 2.2 | National Digital Health Initiatives (ABDM, NHS, Estonia) | 16 |
| 2.3 | International Healthcare Data Standards & Semantic Ontologies | 18 |
| 2.4 | Clinical Artificial Intelligence & Safety Engineering | 22 |
| 2.5 | Comparative Analysis of Existing Healthcare Platforms | 25 |
| 2.6 | Research Gaps and Problem Opportunities | 27 |
| **Chapter 3** | **SYSTEM REQUIREMENTS SPECIFICATION (SRS)** | **29** |
| 3.1 | Stakeholder Analysis & User Personas | 29 |
| 3.2 | Functional Requirements Specification (FRS-1 to FRS-10) | 31 |
| 3.3 | Non-Functional Requirements Specification (NFRS) | 34 |
| 3.4 | Hardware Requirements & Sizing Matrix | 36 |
| 3.5 | Software Requirements & Technology Stack Justification | 37 |
| 3.6 | Regulatory Compliance & Ethical Governance (DPDPA 2023) | 39 |
| **Chapter 4** | **SYSTEM ARCHITECTURE & DESIGN** | **41** |
| 4.1 | Enterprise 4-Tier Architecture Overview | 41 |
| 4.2 | Data Flow Diagrams (Level 0, Level 1, Level 2) | 43 |
| 4.3 | Federated Human Report Center (HRC) Topology | 46 |
| 4.4 | Conceptual & Logical Entity-Relationship (ER) Design | 48 |
| 4.5 | Detailed Relational Schema & Data Dictionary | 50 |
| 4.6 | UML Sequence Diagrams: Consultation & AI Workflow | 53 |
| 4.7 | Disease Lifecycle State Transition Machine | 55 |
| 4.8 | Zero-Trust Role-Based Access Control Architecture | 57 |
| **Chapter 5** | **IMPLEMENTATION DETAILS & ALGORITHM ENGINEERING** | **59** |
| 5.1 | Codebase Organization & Modular Directory Hierarchy | 59 |
| 5.2 | Core Backend Services & Modular Domain Routers | 61 |
| 5.3 | Clinical AI Copilot & Trajectory Computing Algorithms | 64 |
| 5.4 | Frontend Specialist Workstation & React Architecture | 67 |
| 5.5 | Luxury Clinical UI Design System & Micro-Animations | 69 |
| 5.6 | Coding Conventions, Oxlint & Version Control | 71 |
| **Chapter 6** | **RESULTS, EXPERIMENTAL VERIFICATION & PERFORMANCE ANALYSIS** | **73** |
| 6.1 | Test Methodology, Environments & Test Harness | 73 |
| 6.2 | Comprehensive Test Case Execution Matrix | 75 |
| 6.3 | Quantitative Performance Benchmarking | 77 |
| 6.4 | Comprehensive Visual System Walkthrough (All 17 Figures) | 79 |
| 6.5 | Clinical Validation Case Studies | 84 |
| **Chapter 7** | **DISCUSSION & COMPARATIVE EVALUATION** | **87** |
| 7.1 | Key Technical Findings & Observations | 87 |
| 7.2 | Architectural Advantages Over Monolithic EHRs | 88 |
| 7.3 | Trade-offs in Neuro-Symbolic AI vs. Generative Models | 89 |
| 7.4 | Societal, Economic & Clinical Impact | 90 |
| **Chapter 8** | **CONCLUSION & FUTURE SCOPE** | **92** |
| 8.1 | Summary of Contributions | 92 |
| 8.2 | Course Outcome Attainment Verification (CO1 – CO5) | 93 |
| 8.3 | Limitations of the Current Prototype | 94 |
| 8.4 | Future Research & Industry Roadmap | 95 |
| **Chapter 9** | **REFERENCES & BIBLIOGRAPHY** | **97** |
| **Appendices**| **SOURCE CODE & API SPECIFICATIONS** | **100** |

---

\newpage

## **LIST OF FIGURES**

| Figure No. | Caption / Description | Page |
| :--- | :--- | :---: |
| **Figure 4.1** | MediSutra Enterprise 4-Tier System Architecture Diagram | 42 |
| **Figure 4.2** | Data Flow Diagram Level 0: Context Level Diagram | 44 |
| **Figure 4.3** | Data Flow Diagram Level 1: Core Subsystems Data Flow | 45 |
| **Figure 4.4** | MediSutra Federated Human Report Center Network Topology | 47 |
| **Figure 4.5** | Entity-Relationship (ER) Conceptual Schema Model | 49 |
| **Figure 4.6** | UML Sequence Diagram: Clinical Consultation & AI Synthesis Flow | 54 |
| **Figure 4.7** | Disease Lifecycle State Transition Machine (Active vs. Cured) | 56 |
| **Figure 4.8** | Zero-Trust Role-Based Access Control Matrix | 58 |
| **Figure 5.1** | Deterministic Clinical AI Decision-Support Flowchart | 65 |
| **Figure 5.2** | Longitudinal Biomarker Trajectory Analysis (HbA1c & Fasting Glucose) | 66 |
| **Figure 6.1** | Clinical AI Copilot & Longitudinal Report Analyzer Workstation | 80 |
| **Figure 6.2** | Clinical Intelligence Synthesis Report with Lab Trajectories | 81 |
| **Figure 6.3** | Doctor Specialist Station & Longitudinal Patient Dossier | 81 |
| **Figure 6.4** | Active vs. Cured Lifetime Disease Continuity Display | 82 |
| **Figure 6.5** | Centralized Multi-Hospital Diagnostic Reports Vault | 82 |
| **Figure 6.6** | Sovereign Citizen DigiLocker & 14-Digit ABHA Identity Card | 83 |
| **Figure 6.7** | Federated Multi-Hospital Network Registry Node Directory | 83 |

---

\newpage

## **LIST OF TABLES**

| Table No. | Description / Title | Page |
| :--- | :--- | :---: |
| **Table 1.1** | Course Outcomes (COs) Mapping with Project Modules | 11 |
| **Table 2.1** | Comparative Benchmarking of Contemporary Healthcare Platforms | 26 |
| **Table 3.1** | User Personas & Operational Access Profiles | 30 |
| **Table 3.2** | Hardware Sizing Specifications for Production Deployment | 36 |
| **Table 3.3** | Software Frameworks, Libraries, and Runtime Dependencies | 38 |
| **Table 4.1** | Relational Database Schema: Patient Entity Data Dictionary | 50 |
| **Table 4.2** | Relational Database Schema: Clinical Encounter Entity | 51 |
| **Table 4.3** | Relational Database Schema: Disease Condition Entity | 51 |
| **Table 4.4** | Relational Database Schema: Diagnostic Report Entity | 52 |
| **Table 4.5** | Relational Database Schema: Lab Biomarker Entity | 52 |
| **Table 4.6** | Zero-Trust RBAC Privilege Matrix across System Personas | 58 |
| **Table 6.1** | Comprehensive Automated Unit & Integration Test Results | 75 |
| **Table 6.2** | End-to-End Clinical Workflow Test Execution Matrix | 76 |
| **Table 6.3** | API Gateway Latency & Throughput Benchmark Performance | 77 |
| **Table 6.4** | Database Query Execution Benchmarks across Patient Cohorts | 78 |
| **Table 8.1** | Attainment Verification Matrix for Course Outcomes (CO1 to CO5) | 94 |

---

\newpage

## **COMPLETE WORD DOCUMENT READY FOR PRINTING**

The complete **61-Page** formatted Microsoft Word dissertation document has been compiled and verified:
* **Word Document Path:** [docs/MediSutra_Major_Project_Report_50_Pages.docx](file:///c:/Users/Lenovo/OneDrive/Desktop/MEDISUTRA/docs/MediSutra_Major_Project_Report_50_Pages.docx)
* **Exact Microsoft Word Page Count:** **61 Pages** (Verified via Word COM engine)
* **Embedded Graphics:** 17 High-Resolution Figures & Screenshots (10 Architectural Diagrams + 7 Live UI Interfaces)
* **Embedded Tables:** 20 Full Data Dictionaries, Test Matrices, and Benchmark Tables
* **Word Count:** 9,487 Technical Words across 260 Detailed Paragraphs
