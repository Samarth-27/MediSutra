# MediSutra — Healthcare AI & Hybrid RAG Architecture Specification

---

## 1. AI Pipeline Overview

The MediSutra AI reasoning layer operates on a fundamental principle:
> **The AI must not merely know medicine; it must understand the patient's own medical history, reason over time, retrieve evidence, recognize uncertainty, and explain only what the documented records actually substantiate.**

```mermaid
graph TD
    UQ[User Question\nEnglish / Hindi / Hinglish] --> LID[Language & Script Detection]
    LID --> INT[Intent & Slot Extractor]
    INT --> TEMP[Temporal Reasoning & Date Normalizer]
    
    TEMP --> DUAL_RET{Hybrid Dual-Retrieval}
    
    subgraph StructuredRet [Deterministic Retrieval]
        DUAL_RET -->|Patient ID + Date Range + Param Code| SQL_ENG[PostgreSQL Structured Query\n- Lab Results Time-Series\n- Condition Lifecycles\n- Prescriptions & Events]
    end
    
    subgraph SemanticRet [Dense Semantic Retrieval]
        DUAL_RET -->|Patient ID Filter + Query Vector| VEC_ENG[Qdrant / Vector Store\n- Document Text Chunks\n- Clinical Impressions\n- Doctor Notes]
    end
    
    SQL_ENG --> CTX_ASM[Context Assembler & Token Budgeter]
    VEC_ENG --> RERANK[Cross-Encoder Reranker]
    RERANK --> CTX_ASM
    
    CTX_ASM --> LLM[Healthcare-Adapted Model\nQwen2.5 / Llama 3 / Mistral]
    LLM --> RAW_ANS[Draft Response]
    
    RAW_ANS --> CLAIM_EXT[Claim Extractor\nAtomic Factual Assertions]
    CLAIM_EXT --> EVIDENCE_VAL{Evidence Matcher}
    
    EVIDENCE_VAL -->|Supported Claims| SAFE_CHK[Clinical Safety Guardrails]
    EVIDENCE_VAL -->|Unsupported Claims| PRUNE[Prune or Trigger Safe Abstention]
    PRUNE --> SAFE_CHK
    
    SAFE_CHK --> CONF_RATING[Evidence Confidence Evaluator\n🟢 Strong | 🟡 Limited | 🔴 Insufficient]
    CONF_RATING --> FINAL_PAYLOAD[Final Validated Payload\nAnswer + Verified Citations + Evidence Badge]
```

---

## 2. Indian Healthcare Language Support (English, Hindi, Hinglish)

Patients across India frequently express clinical concerns in mixed Hindi-English (Hinglish) with phonetic Latin transliteration and colloquial medical terms.

### 2.1 Multilingual Intent & Slot Extraction
The system utilizes few-shot and instruction-tuned intent parsing to convert user vernacular into canonical parameters:

| Input Utterance | Detected Language | Extracted Intent | Target Entity / Parameter | Temporal Reference |
|---|---|---|---|---|
| *"Meri sugar pichli report se kam hui kya?"* | Hinglish (`hi-Latn`) | `COMPARE_REPORTS` | `GLUCOSE / HBA1C` | `PREVIOUS_VS_LATEST` |
| *"Hb kitna tha last time?"* | Hinglish (`hi-Latn`) | `PARAMETER_LOOKUP` | `HEMOGLOBIN` | `LATEST` |
| *"Thyroid report dikhao."* | Hinglish (`hi-Latn`) | `VIEW_REPORTS` | `THYROID_PANEL` | `ALL` |
| *"BP high aa raha hai kya?"* | Hinglish (`hi-Latn`) | `EVALUATE_TREND` | `BLOOD_PRESSURE` | `RECENT` |
| *"Compare my diabetes reports from 2024 and 2026."* | English (`en`) | `COMPARE_REPORTS` | `TYPE_2_DIABETES` | `2024 vs 2026` |
| *"क्या मेरी पुरानी रिपोर्ट में कोई इन्फेक्शन था?"* | Hindi (`hi-Deva`) | `CONDITION_LOOKUP` | `INFECTION / CBC` | `HISTORICAL` |

### 2.2 Medical Vocabulary Mapping Dictionary
A curated synonyms dictionary maps regional expressions to standard taxonomy codes:
- `sugar` / `shakkar` / `glu` → `GLUCOSE_FASTING`, `HBA1C`
- `hb` / `khoon` / `hemoglobin` → `HEMOGLOBIN`
- `dhadkan` / `bp` / `chhati` → `CARDIOVASCULAR`, `ECG`, `BLOOD_PRESSURE`
- `pathri` / `kidney` / `creatinine` → `RENAL_PANEL`, `CREATININE`
- `kamzori` / `vitamin` → `VITAMIN_D`, `VITAMIN_B12`

---

## 3. Temporal Reasoning & Query Decomposition

Medical questions are inherently chronological. MediSutra rejects flat semantic matching in favor of time-aware query decomposition:

1. **Relative Date Resolution:**
   - `"last time"` → Evaluates to `MAX(observed_date)` for the queried parameter.
   - `"before my diagnosis"` → Queries `patient_conditions.diagnosed_date` (e.g. `2025-01-22`), filtering all health events with `event_date < '2025-01-22'`.
   - `"after starting Metformin"` → Queries `medications.start_date` (e.g. `2025-02-01`), filtering subsequent lab values.
2. **Interval Comparisons:**
   - Automatically bins time-series into baseline, follow-up, and latest windows.

---

## 4. Hybrid Retrieval Architecture (RAG)

### 4.1 Structured Database Retrieval
Direct deterministic SQL execution supplies exact lab readings, eliminating numerical drift:
```sql
SELECT observed_date, parameter_name, numeric_value, unit, flag, source_document_id, source_page_number
FROM lab_results
WHERE patient_id = :patient_id
  AND parameter_code = ANY(:param_codes)
ORDER BY observed_date ASC;
```

### 4.2 Dense Vector Document Retrieval
Text passages, physician impressions, and narrative discharge notes are chunked and embedded:
- **Chunking Strategy:** Semantic page-aware chunking (300 tokens per chunk with 50-token overlap).
- **Mandatory Metadata Filter:**
  ```json
  {
    "filter": {
      "must": [
        { "key": "patient_id", "match": { "value": "pat_90a1bc4e..." } }
      ]
    }
  }
  ```
- **Embedding Model:** `BAAI/bge-small-en-v1.5` or `all-MiniLM-L6-v2` generating 384-dimensional dense vectors.

### 4.3 Reranker & Context Assembly
Top 10 retrieved chunks are passed through a cross-encoder (`cross-encoder/ms-marco-MiniLM-L-6-v2`) to prioritize the top 3 most relevant passages. Context is structured with explicit markdown demarcations:
```markdown
[PATIENT_CONTEXT]
Patient ID: MED-00010001 | Age: 38 | Biological Sex: Male
Documented Active Conditions: Type 2 Diabetes Mellitus

[STRUCTURED_LAB_HISTORY: HBA1C]
- 2025-01-22: 8.7% (High) [Doc: DOC-002, Page 1]
- 2025-03-20: 8.2% (High) [Doc: DOC-004, Page 2]
- 2026-07-12: 6.9% (Normal/Target) [Doc: DOC-012, Page 1]

[RELEVANT_DOCUMENT_PASSAGES]
[PASSAGE 1 | Doc: DOC-004 | Page 2]
"Patient advised dietary modification and 30 minutes daily aerobic exercise..."
```

---

## 5. Healthcare Model Adaptation (Research Component)

### 5.1 Base Model Selection
MediSutra investigates parameter-efficient open weights:
- **Primary Open Base Candidate:** `Qwen2.5-7B-Instruct` / `Qwen2.5-1.5B` (exceptional multilingual Hindi/English tokenization and structured JSON adherence).
- **Secondary Candidates:** `Llama-3.1-8B-Instruct`, `Mistral-7B-Instruct-v0.3`.

### 5.2 LoRA / QLoRA Fine-Tuning Setup
Instruction tuning is configured with 4-bit quantization (QLoRA) using HuggingFace `peft` and `trl`:
- **LoRA Hyperparameters:** `r = 16`, `lora_alpha = 32`, `target_modules = ["q_proj", "v_proj", "k_proj", "o_proj"]`, `dropout = 0.05`.
- **Target Tasks:**
  1. Medical report classification (18 classes).
  2. Entity & numerical lab value extraction with bounding box linkage.
  3. Longitudinal report comparison and percentage delta synthesis.
  4. Non-judgmental monitoring protocol reconciliation.
  5. Evidence citation formatting.
  6. Safe abstention on missing records.

---

## 6. Claim Extraction & Evidence Validator Pipeline

To eliminate hallucinations, MediSutra implements an automated post-generation validation layer:

```
                  [Draft Response]
                         │
                         ▼
             [Claim Extraction Prompt]
                         │
      Decomposes text into atomic factual claims:
      Claim 1: "HbA1c was 8.2% in March 2026"
      Claim 2: "HbA1c was 6.9% in July 2026"
      Claim 3: "Patient cholesterol is 180 mg/dL"
                         │
                         ▼
             [Evidence Verification Engine]
      Cross-references each claim against retrieved database
      records and document chunks.
                         │
     ┌───────────────────┴───────────────────┐
     ▼                                       ▼
  [Claim 1 & 2: VERIFIED]            [Claim 3: UNVERIFIED]
  Matched DOC-004 & DOC-012          (No cholesterol record found)
     │                                       │
     ▼                                       ▼
  Retained in final output           Pruned from output with notice:
                                     "No cholesterol value exists in available records."
```

### Categorical Evidence Strength Scoring
1. 🟢 **Strong Evidence:** Multiple corroborated reports exist; values extracted with confidence > 0.90; perfect date alignment.
2. 🟡 **Limited Evidence:** Single isolated report or lower OCR quality; user alerted to verify original document.
3. 🔴 **Insufficient Evidence:** No corresponding document found in MediSutra vault; system declares:  
   *"No record was found in the available documents. Historical trend cannot be established."*

---

## 7. Clinical Safety Guardrails & Abstention Matrix

| User Trigger / Scenario | Prohibited Action | Mandatory System Behavior |
|---|---|---|
| User asks: *"Should I increase Metformin to 1000mg?"* | Modifying or advising medication dosage | Safe Refusal: *"MediSutra cannot adjust or advise medication dosages. Please contact your treating physician."* |
| User asks: *"Do I have liver cancer?"* | Making autonomous medical diagnosis | Safe Refusal: Explains documented lab parameters neutrally without diagnostic labeling. Directs to specialist. |
| User inputs chest pain, shortness of breath, sudden numbness | Standard conversational RAG | Emergency Alert Trigger: Immediate red banner advising emergency hotline (112 / 108 in India) or nearest hospital. |
| User asks for unrecorded test (e.g. LDL) | Hallucinating typical average numbers | Non-Hallucination Abstention: *"I could not find an LDL reading in your available records."* |
| Checkpoint interval unfulfilled (e.g. M4) | Declaring patient non-compliant | Non-Judgmental Notice: *"No corresponding record was found in this system."* |

---

## 8. Research Benchmark & Model Comparison Suite

To support the CSE major project research component, the platform defines a rigorous evaluation pipeline comparing four distinct model configurations on an identical synthetic patient test benchmark (100 multi-turn queries across 10 years of patient history):

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MODEL COMPARISON MATRIX                         │
├─────────┬──────────────────────────────────────────────────────────────┤
│ Model A │ General-Purpose Commercial LLM (Baseline)                    │
│ Model B │ Base Open Foundation Model (e.g. Qwen2.5-7B-Base)            │
│ Model C │ Healthcare-Adapted Model (Fine-tuned LoRA without RAG)       │
│ Model D │ MediSutra Full System (Healthcare-Adapted + Hybrid RAG +     │
│         │ Evidence Validator & Hallucination Filter)                   │
└─────────┴──────────────────────────────────────────────────────────────┘
```

### Quantitative Metrics Computed:
1. **Extraction Accuracy & F1:** Precision and recall of extracted lab numbers and units.
2. **Retrieval Groundedness (RAGAS / TruLens metric):** Degree to which generated sentences are anchored in retrieved documents.
3. **Citation Accuracy (%):** Exact document ID and page number match rate.
4. **Unsupported Claim Rate (%):** Frequency of assertions unsupported by input documents.
5. **Hallucination Rate (%):** Generation of fabricated numbers or conditions.
6. **Abstention Precision (%):** Correctly refusing to answer when data is absent.
7. **End-to-End Latency (ms):** Turnaround time per query.
