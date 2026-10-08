import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches

os.makedirs('docs/diagrams', exist_ok=True)

def save_fig(fig, filename):
    path = os.path.join('docs/diagrams', filename)
    fig.savefig(path, dpi=200, bbox_inches='tight', facecolor='white')
    plt.close(fig)
    print(f"Saved: {path}")

# =============================================================================
# 1. System Architecture 4-Tier Diagram
# =============================================================================
def make_architecture_diagram():
    fig, ax = plt.subplots(figsize=(10, 7))
    ax.axis('off')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 7)

    # Title
    ax.text(5, 6.7, "MediSutra Enterprise 4-Tier Architecture", fontsize=15, fontweight='bold', ha='center', color='#0F172A')

    tiers = [
        ("Tier 1: Presentation Layer", "#0284C7", "#E0F2FE", 5.2, [
            "Doctor Specialist Workstation (React 19 + TypeScript)",
            "Sovereign Citizen DigiLocker & ABHA Identity Portal",
            "Hospital Clinical Administration & Capacity Dashboard"
        ]),
        ("Tier 2: API Gateway & Network Ingress", "#0D9488", "#CCFBF1", 3.7, [
            "Express.js REST Gateway with Zero-Trust RBAC Middleware",
            "Session State Gatekeeper & Role Partitioning Enforcer",
            "CORS Ingress & Standardized JSON Response Envelopes"
        ]),
        ("Tier 3: Clinical Intelligence & Logic Engine", "#6366F1", "#EEF2FF", 2.2, [
            "Deterministic Clinical AI Copilot & Longitudinal RAG",
            "Quantitative Biomarker Trajectory Computing Engine",
            "Disease Lifecycle State Machine (Active vs. Cured)"
        ]),
        ("Tier 4: Distributed Health Data & Persistence", "#059669", "#D1FAE5", 0.7, [
            "Federated Multi-Hospital Network Registry (Apollo, Max, Fortis, AIIMS)",
            "Diagnostic Pathology Vault (Dr. Lal PathLabs, Metropolis)",
            "ABDM 14-Digit Health Registry & Cryptographic Audit Trails"
        ])
    ]

    for title, border_col, bg_col, y_pos, items in tiers:
        rect = patches.FancyBboxPatch((0.5, y_pos), 9.0, 1.15, boxstyle="round,pad=0.08",
                                     edgecolor=border_col, facecolor=bg_col, linewidth=2)
        ax.add_patch(rect)
        ax.text(0.8, y_pos + 0.85, title, fontsize=12, fontweight='bold', color=border_col)
        items_str = "  •  ".join(items)
        ax.text(0.8, y_pos + 0.35, items_str, fontsize=9.5, color='#334155')

    # Connecting arrows
    for y in [5.2, 3.7, 2.2]:
        ax.annotate('', xy=(5.0, y), xytext=(5.0, y + 0.35),
                    arrowprops=dict(arrowstyle="->", lw=2, color='#64748B'))

    save_fig(fig, "01_system_architecture_4_tier.png")

# =============================================================================
# 2. DFD Level 0 (Context Diagram)
# =============================================================================
def make_dfd_level_0():
    fig, ax = plt.subplots(figsize=(10, 6.5))
    ax.axis('off')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 6.5)

    ax.text(5, 6.1, "Data Flow Diagram (DFD Level 0: Context Level)", fontsize=14, fontweight='bold', ha='center', color='#0F172A')

    # Center Bubble
    center_circle = patches.Circle((5, 3.2), 1.25, edgecolor='#0284C7', facecolor='#F0F9FF', linewidth=2.5)
    ax.add_patch(center_circle)
    ax.text(5, 3.4, "0.0\nMediSutra Health\nIntelligence\nPlatform", fontsize=11, fontweight='bold', ha='center', va='center', color='#0284C7')

    # External Entities
    entities = [
        ("Attending Physician /\nSpecialist Doctor", (0.5, 3.8), 2.2, 1.2, "#0369A1", "#E0F2FE"),
        ("Sovereign Citizen /\nPatient", (0.5, 1.4), 2.2, 1.2, "#0D9488", "#CCFBF1"),
        ("Diagnostic Pathology\nLabs (Lal/Metropolis)", (7.3, 3.8), 2.2, 1.2, "#6366F1", "#EEF2FF"),
        ("Hospital Network\nAdmins & ABDM Gateway", (7.3, 1.4), 2.2, 1.2, "#D97706", "#FEF3C7")
    ]

    for name, (x, y), w, h, b_col, bg_col in entities:
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.05", edgecolor=b_col, facecolor=bg_col, linewidth=2)
        ax.add_patch(rect)
        ax.text(x + w/2, y + h/2, name, fontsize=10, fontweight='bold', ha='center', va='center', color='#0F172A')

    # Arrows with labels
    # Doctor -> Center
    ax.annotate('', xy=(3.75, 3.8), xytext=(2.7, 4.4), arrowprops=dict(arrowstyle="->", lw=1.5, color='#0284C7'))
    ax.text(3.1, 4.3, "Encounter/Cure Data", fontsize=8, color='#0369A1', rotation=25)
    # Center -> Doctor
    ax.annotate('', xy=(2.7, 3.9), xytext=(3.75, 3.3), arrowprops=dict(arrowstyle="->", lw=1.5, color='#0284C7'))
    ax.text(3.0, 3.4, "AI Synthesis Dossier", fontsize=8, color='#0369A1', rotation=25)

    # Citizen -> Center
    ax.annotate('', xy=(3.8, 2.7), xytext=(2.7, 2.2), arrowprops=dict(arrowstyle="->", lw=1.5, color='#0D9488'))
    ax.text(3.0, 2.3, "Consent & Access Req", fontsize=8, color='#0D9488', rotation=-20)
    # Center -> Citizen
    ax.annotate('', xy=(2.7, 1.7), xytext=(3.8, 2.2), arrowprops=dict(arrowstyle="->", lw=1.5, color='#0D9488'))
    ax.text(3.0, 1.8, "ABHA Card & Reports", fontsize=8, color='#0D9488', rotation=-20)

    # Lab -> Center
    ax.annotate('', xy=(6.25, 3.8), xytext=(7.3, 4.4), arrowprops=dict(arrowstyle="<-", lw=1.5, color='#6366F1'))
    ax.text(6.4, 4.3, "Lab Panels & Biomarkers", fontsize=8, color='#6366F1', rotation=-25)

    # Admin -> Center
    ax.annotate('', xy=(6.2, 2.6), xytext=(7.3, 2.0), arrowprops=dict(arrowstyle="<-", lw=1.5, color='#D97706'))
    ax.text(6.4, 2.1, "Facility Reg & Policies", fontsize=8, color='#D97706', rotation=25)

    save_fig(fig, "02_dfd_level_0_context.png")

# =============================================================================
# 3. DFD Level 1 (System Flow)
# =============================================================================
def make_dfd_level_1():
    fig, ax = plt.subplots(figsize=(10, 7))
    ax.axis('off')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 7)

    ax.text(5, 6.7, "Data Flow Diagram (DFD Level 1: Core Subsystems)", fontsize=14, fontweight='bold', ha='center', color='#0F172A')

    processes = [
        ("1.0 Zero-Trust\nAuth & Role Gatekeeper", (1.0, 4.8), "#0284C7", "#E0F2FE"),
        ("2.0 Clinical Encounter\n& Cure Ingestion", (6.0, 4.8), "#0D9488", "#CCFBF1"),
        ("3.0 Diagnostic Vault\n& Biomarker Extractor", (1.0, 2.2), "#6366F1", "#EEF2FF"),
        ("4.0 Deterministic Clinical\nAI Copilot & Synthesis", (6.0, 2.2), "#D97706", "#FEF3C7")
    ]

    for title, (x, y), b_col, bg_col in processes:
        rect = patches.FancyBboxPatch((x, y), 3.0, 1.1, boxstyle="round,pad=0.08", edgecolor=b_col, facecolor=bg_col, linewidth=2)
        ax.add_patch(rect)
        ax.text(x + 1.5, y + 0.55, title, fontsize=10, fontweight='bold', ha='center', va='center', color='#0F172A')

    # Data Store (Bottom)
    store_rect = patches.FancyBboxPatch((3.0, 0.4), 4.0, 0.9, boxstyle="square,pad=0.05", edgecolor='#0F172A', facecolor='#F1F5F9', linewidth=2)
    ax.add_patch(store_rect)
    ax.text(5.0, 0.85, "D1: Unified Longitudinal Patient Data Store\n(Encounters, Conditions, Lab Biomarkers, ABHA)", fontsize=9.5, fontweight='bold', ha='center', va='center', color='#0F172A')

    # Arrows connecting processes to Data Store
    ax.annotate('', xy=(4.0, 1.3), xytext=(2.5, 2.2), arrowprops=dict(arrowstyle="->", lw=1.5, color='#6366F1'))
    ax.annotate('', xy=(6.0, 1.3), xytext=(7.5, 2.2), arrowprops=dict(arrowstyle="->", lw=1.5, color='#D97706'))
    ax.annotate('', xy=(7.0, 1.3), xytext=(7.5, 4.8), arrowprops=dict(arrowstyle="->", lw=1.5, color='#0D9488'))
    ax.annotate('', xy=(3.5, 1.3), xytext=(2.5, 4.8), arrowprops=dict(arrowstyle="->", lw=1.5, color='#0284C7'))

    save_fig(fig, "03_dfd_level_1_subsystems.png")

# =============================================================================
# 4. Federated Hospital Network Topology
# =============================================================================
def make_hrc_topology():
    fig, ax = plt.subplots(figsize=(10, 7))
    ax.axis('off')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 7)

    ax.text(5, 6.7, "MediSutra Federated Human Report Center (HRC) Topology", fontsize=14, fontweight='bold', ha='center', color='#0F172A')

    # Central Hub
    hub = patches.Circle((5, 3.5), 1.35, edgecolor='#0284C7', facecolor='#F0F9FF', linewidth=3)
    ax.add_patch(hub)
    ax.text(5, 3.7, "CENTRAL HRC HUB", fontsize=11, fontweight='bold', ha='center', color='#0284C7')
    ax.text(5, 3.25, "Unified Patient Registry\nABHA ID: 14-Digit Sovereign\nConsensus Health Graph", fontsize=8.5, ha='center', color='#334155')

    # Hospital Spokes
    spokes = [
        ("Apollo Hospitals &\nHeart Institute", (1.2, 5.0), "#0369A1", "#E0F2FE"),
        ("Fortis Memorial\nResearch Institute", (1.2, 1.8), "#0D9488", "#CCFBF1"),
        ("Max Super Speciality\nHospital (Saket)", (7.2, 5.0), "#4338CA", "#EEF2FF"),
        ("AIIMS New Delhi\n(Apex Public Hospital)", (7.2, 1.8), "#B45309", "#FEF3C7"),
        ("Dr. Lal PathLabs\n(Diagnostic Node)", (5.0, 5.5), "#047857", "#D1FAE5"),
        ("Metropolis Healthcare\n(Diagnostic Node)", (5.0, 0.5), "#BE185D", "#FCE7F3")
    ]

    for name, (x, y), b_col, bg_col in spokes:
        node = patches.FancyBboxPatch((x - 1.1, y - 0.45), 2.2, 0.9, boxstyle="round,pad=0.06", edgecolor=b_col, facecolor=bg_col, linewidth=2)
        ax.add_patch(node)
        ax.text(x, y, name, fontsize=8.5, fontweight='bold', ha='center', va='center', color='#0F172A')
        # Connecting line to center
        ax.plot([x, 5], [y, 3.5], color='#94A3B8', linestyle='--', linewidth=1.5, zorder=0)

    save_fig(fig, "04_hrc_network_topology.png")

# =============================================================================
# 5. Disease Lifecycle State Machine
# =============================================================================
def make_state_machine():
    fig, ax = plt.subplots(figsize=(10, 5.5))
    ax.axis('off')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5.5)

    ax.text(5, 5.0, "Clinical Disease Lifecycle State Transition Machine", fontsize=14, fontweight='bold', ha='center', color='#0F172A')

    states = [
        ("SUSPECTED", 1.2, 3.0, "#D97706", "#FEF3C7"),
        ("ACTIVE /\nUNDER_TREATMENT", 3.8, 3.0, "#DC2626", "#FEE2E2"),
        ("RESOLVED /\nCURED", 6.4, 3.0, "#059669", "#D1FAE5"),
        ("HISTORICAL\nARCHIVED", 9.0, 3.0, "#475569", "#F1F5F9")
    ]

    for name, x, y, b_col, bg_col in states:
        box = patches.FancyBboxPatch((x - 0.9, y - 0.5), 1.8, 1.0, boxstyle="round,pad=0.08", edgecolor=b_col, facecolor=bg_col, linewidth=2)
        ax.add_patch(box)
        ax.text(x, y, name, fontsize=9.5, fontweight='bold', ha='center', va='center', color='#0F172A')

    # Transition arrows
    ax.annotate('', xy=(2.9, 3.0), xytext=(2.1, 3.0), arrowprops=dict(arrowstyle="->", lw=2, color='#0F172A'))
    ax.text(2.5, 3.3, "Diagnosis &\nICD-10", fontsize=7.5, ha='center', color='#0F172A')

    ax.annotate('', xy=(5.5, 3.0), xytext=(4.7, 3.0), arrowprops=dict(arrowstyle="->", lw=2, color='#059669'))
    ax.text(5.1, 3.3, "Verified Cure\n& Evidence", fontsize=7.5, ha='center', color='#059669', fontweight='bold')

    ax.annotate('', xy=(8.1, 3.0), xytext=(7.3, 3.0), arrowprops=dict(arrowstyle="->", lw=2, color='#475569'))
    ax.text(7.7, 3.3, "Longitudinal\nContinuity", fontsize=7.5, ha='center', color='#475569')

    # Relapse cycle
    ax.annotate('', xy=(3.8, 2.3), xytext=(6.4, 2.3),
                arrowprops=dict(arrowstyle="->", lw=1.5, color='#DC2626', connectionstyle="arc3,rad=-0.4"))
    ax.text(5.1, 1.2, "Relapse / Secondary Flare", fontsize=8, ha='center', color='#DC2626')

    save_fig(fig, "05_disease_lifecycle_state_machine.png")

# =============================================================================
# 6. Clinical AI RAG Flowchart
# =============================================================================
def make_ai_rag_flowchart():
    fig, ax = plt.subplots(figsize=(10, 7.5))
    ax.axis('off')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 7.5)

    ax.text(5, 7.1, "Deterministic Clinical AI Decision-Support Flowchart", fontsize=14, fontweight='bold', ha='center', color='#0F172A')

    steps = [
        ("Step 1: Clinical Observation Input", "Physician inputs freeform observations or selects instant clinical presets.", 5.9, "#0284C7", "#E0F2FE"),
        ("Step 2: Cross-Hospital Record Fetch", "Retrieve multi-hospital dossier: Encounters, Active/Cured Diseases, Diagnostic Panels.", 4.6, "#0D9488", "#CCFBF1"),
        ("Step 3: Temporal Symptom-Disease Correlation", "Map clinical tokens to ICD-10 conditions. Partition Active from Cured historical illness.", 3.3, "#6366F1", "#EEF2FF"),
        ("Step 4: Quantitative Biomarker Trajectory Computing", "Compare latest readings to baseline: compute numerical delta, reference flag, and directionality.", 2.0, "#D97706", "#FEF3C7"),
        ("Step 5: Grounded Synthesis & Note Transfer", "Generate structured clinical report with multi-hospital citations. 1-click note export.", 0.7, "#059669", "#D1FAE5")
    ]

    for title, desc, y, b_col, bg_col in steps:
        box = patches.FancyBboxPatch((1.0, y), 8.0, 0.9, boxstyle="round,pad=0.06", edgecolor=b_col, facecolor=bg_col, linewidth=2)
        ax.add_patch(box)
        ax.text(1.3, y + 0.55, title, fontsize=10.5, fontweight='bold', color=b_col)
        ax.text(1.3, y + 0.22, desc, fontsize=8.5, color='#334155')

    # Arrows
    for y in [5.9, 4.6, 3.3, 2.0]:
        ax.annotate('', xy=(5.0, y), xytext=(5.0, y + 0.2), arrowprops=dict(arrowstyle="->", lw=2, color='#64748B'))

    save_fig(fig, "06_clinical_ai_rag_flowchart.png")

# =============================================================================
# 7. Biomarker Trajectory Chart (HbA1c & Fasting Glucose)
# =============================================================================
def make_biomarker_chart():
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.5))

    # Dates
    dates = ['Jan 2024\n(Baseline)', 'Jul 2024', 'Jan 2025', 'Jul 2025', 'Jan 2026', 'Jul 2026\n(Latest)']
    
    # HbA1c
    hba1c = [8.7, 8.2, 7.6, 7.3, 7.0, 6.9]
    ax1.plot(dates, hba1c, marker='o', color='#0284C7', linewidth=2.5, markersize=8)
    ax1.axhline(5.7, color='#10B981', linestyle='--', label='Normal (<5.7%)')
    ax1.axhline(6.5, color='#F59E0B', linestyle='--', label='Diabetic Threshold (>=6.5%)')
    ax1.set_title("HbA1c Glycated Hemoglobin Trajectory (%)", fontsize=11, fontweight='bold', color='#0F172A')
    ax1.set_ylabel("Percentage (%)")
    ax1.grid(True, linestyle=':', alpha=0.6)
    ax1.legend(fontsize=8, loc='upper right')
    for i, txt in enumerate(hba1c):
        ax1.annotate(f"{txt}%", (dates[i], hba1c[i] + 0.15), ha='center', fontsize=9, fontweight='bold', color='#0284C7')

    # Fasting Blood Sugar
    fbs = [172, 160, 152, 145, 140, 138]
    ax2.plot(dates, fbs, marker='s', color='#DC2626', linewidth=2.5, markersize=8)
    ax2.axhline(100, color='#10B981', linestyle='--', label='Normal Fasting (<100 mg/dL)')
    ax2.axhline(126, color='#F59E0B', linestyle='--', label='Diabetic Fasting (>=126 mg/dL)')
    ax2.set_title("Fasting Plasma Glucose Trajectory (mg/dL)", fontsize=11, fontweight='bold', color='#0F172A')
    ax2.set_ylabel("mg/dL")
    ax2.grid(True, linestyle=':', alpha=0.6)
    ax2.legend(fontsize=8, loc='upper right')
    for i, txt in enumerate(fbs):
        ax2.annotate(f"{txt}", (dates[i], fbs[i] + 3), ha='center', fontsize=9, fontweight='bold', color='#DC2626')

    plt.tight_layout()
    save_fig(fig, "07_biomarker_trajectories_chart.png")

# =============================================================================
# 8. Zero-Trust RBAC Matrix Diagram
# =============================================================================
def make_rbac_diagram():
    fig, ax = plt.subplots(figsize=(10, 5.5))
    ax.axis('off')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5.5)

    ax.text(5, 5.0, "Zero-Trust Role-Based Access Control (RBAC) Architecture", fontsize=14, fontweight='bold', ha='center', color='#0F172A')

    roles = [
        ("DOCTOR / SPECIALIST", ["• Assigned Patient Dossiers Only", "• Record Encounter & Stamp Cure", "• Issue Diagnostic Lab Orders", "• Clinical AI Copilot Workstation"], 0.5, "#0284C7", "#E0F2FE"),
        ("HOSPITAL ADMINISTRATOR", ["• Institutional Facility Profile", "• Doctor Staff Directory & Licensure", "• Facility Inpatient Capacity Stats", "• Cross-Hospital Audit Metrics"], 3.8, "#0D9488", "#CCFBF1"),
        ("SOVEREIGN CITIZEN", ["• Personal & Family DigiLocker", "• ABHA 14-Digit Identity Card", "• Complete Lifetime Health Journey", "• Consent Grant / Revocation"], 7.1, "#D97706", "#FEF3C7")
    ]

    for title, perms, x, b_col, bg_col in roles:
        box = patches.FancyBboxPatch((x, 0.8), 2.7, 3.7, boxstyle="round,pad=0.08", edgecolor=b_col, facecolor=bg_col, linewidth=2)
        ax.add_patch(box)
        ax.text(x + 1.35, 4.1, title, fontsize=10, fontweight='bold', ha='center', color=b_col)
        ax.plot([x + 0.2, x + 2.5], [3.9, 3.9], color=b_col, linewidth=1)
        for idx, perm in enumerate(perms):
            ax.text(x + 0.2, 3.5 - (idx * 0.7), perm, fontsize=8.5, color='#1E293B')

    save_fig(fig, "08_zero_trust_rbac_matrix.png")

# =============================================================================
# 9. UML Sequence Diagram: Consultation Encounter
# =============================================================================
def make_sequence_diagram():
    fig, ax = plt.subplots(figsize=(10, 7))
    ax.axis('off')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 7)

    ax.text(5, 6.7, "UML Sequence Diagram: Doctor Consultation & AI Copilot Flow", fontsize=14, fontweight='bold', ha='center', color='#0F172A')

    actors = [
        ("Physician", 1.5),
        ("React UI", 3.8),
        ("Express Gateway", 6.2),
        ("AI / DB Engine", 8.5)
    ]

    for name, x in actors:
        box = patches.FancyBboxPatch((x - 0.7, 5.9), 1.4, 0.5, boxstyle="round,pad=0.04", edgecolor='#0F172A', facecolor='#F1F5F9', linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, 6.15, name, fontsize=9.5, fontweight='bold', ha='center', va='center')
        ax.plot([x, x], [5.9, 0.6], color='#94A3B8', linestyle=':', linewidth=1.5)

    messages = [
        (5.3, 1.5, 3.8, "1. Select Patient (Rahul Sharma)", '#0284C7'),
        (4.7, 3.8, 6.2, "2. GET /doctor/patient-dossier", '#0D9488'),
        (4.1, 6.2, 8.5, "3. Query Lifetime Records", '#6366F1'),
        (3.5, 8.5, 3.8, "4. Return Unified Dossier", '#059669'),
        (2.9, 1.5, 3.8, "5. Click AI Preset: 'High Fasting Sugar...'", '#0284C7'),
        (2.3, 3.8, 8.5, "6. POST /ai/doctor-analysis (symptoms)", '#D97706'),
        (1.7, 8.5, 3.8, "7. Return Grounded Synthesis + Trajectories", '#059669'),
        (1.1, 3.8, 1.5, "8. 1-Click Insert into Clinical Note", '#0284C7')
    ]

    for y, x1, x2, label, col in messages:
        ax.annotate('', xy=(x2, y), xytext=(x1, y), arrowprops=dict(arrowstyle="->", lw=1.5, color=col))
        mid = (x1 + x2) / 2
        ax.text(mid, y + 0.12, label, fontsize=8, ha='center', color=col, fontweight='bold')

    save_fig(fig, "09_uml_consultation_sequence.png")

# =============================================================================
# 10. Conceptual ER Diagram
# =============================================================================
def make_er_diagram():
    fig, ax = plt.subplots(figsize=(10, 7.5))
    ax.axis('off')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 7.5)

    ax.text(5, 7.1, "Entity-Relationship (ER) Conceptual Schema", fontsize=14, fontweight='bold', ha='center', color='#0F172A')

    entities = [
        ("PATIENT (PK: healthId)", ["abhaNumber", "fullName", "dob", "gender", "bloodGroup"], (1.0, 4.8), "#0284C7", "#E0F2FE"),
        ("HOSPITAL (PK: id)", ["name", "networkType", "licenseNumber", "city"], (6.5, 4.8), "#0D9488", "#CCFBF1"),
        ("DOCTOR (PK: id)", ["name", "specialization", "licenseNumber", "hospitalId (FK)"], (6.5, 2.2), "#6366F1", "#EEF2FF"),
        ("CLINICAL_ENCOUNTER", ["patientId (FK)", "hospitalId (FK)", "doctorId (FK)", "icd10Code", "severity"], (3.8, 3.5), "#D97706", "#FEF3C7"),
        ("DIAGNOSTIC_REPORT", ["patientId (FK)", "facilityId (FK)", "category", "reportDate"], (1.0, 1.2), "#059669", "#D1FAE5"),
        ("LAB_BIOMARKER", ["reportId (FK)", "parameterName", "latestValue", "baselineValue", "trend"], (3.8, 1.2), "#DC2626", "#FEE2E2")
    ]

    for title, fields, (x, y), b_col, bg_col in entities:
        box = patches.FancyBboxPatch((x, y), 2.5, 1.5, boxstyle="round,pad=0.06", edgecolor=b_col, facecolor=bg_col, linewidth=2)
        ax.add_patch(box)
        ax.text(x + 1.25, y + 1.25, title, fontsize=8.5, fontweight='bold', ha='center', color=b_col)
        ax.plot([x + 0.1, x + 2.4], [y + 1.1, y + 1.1], color=b_col, linewidth=1)
        for f_idx, field in enumerate(fields):
            ax.text(x + 0.15, y + 0.85 - (f_idx * 0.22), f"• {field}", fontsize=7.5, color='#1E293B')

    # Cardinality connections
    ax.plot([3.5, 3.8], [5.5, 4.2], color='#64748B', linestyle='--', linewidth=1.5)
    ax.text(3.4, 5.0, "1:N", fontsize=8, color='#0284C7', fontweight='bold')

    ax.plot([6.5, 6.3], [5.5, 4.2], color='#64748B', linestyle='--', linewidth=1.5)
    ax.text(6.4, 5.0, "1:N", fontsize=8, color='#0D9488', fontweight='bold')

    ax.plot([6.5, 6.3], [2.9, 3.5], color='#64748B', linestyle='--', linewidth=1.5)
    ax.text(6.4, 3.1, "1:N", fontsize=8, color='#6366F1', fontweight='bold')

    ax.plot([2.2, 2.2], [4.8, 2.7], color='#64748B', linestyle='--', linewidth=1.5)
    ax.text(2.3, 3.7, "1:N", fontsize=8, color='#0284C7', fontweight='bold')

    ax.plot([3.5, 3.8], [1.9, 1.9], color='#64748B', linestyle='--', linewidth=1.5)
    ax.text(3.6, 2.1, "1:N", fontsize=8, color='#059669', fontweight='bold')

    save_fig(fig, "10_conceptual_er_diagram.png")

if __name__ == '__main__':
    make_architecture_diagram()
    make_dfd_level_0()
    make_dfd_level_1()
    make_hrc_topology()
    make_state_machine()
    make_ai_rag_flowchart()
    make_biomarker_chart()
    make_rbac_diagram()
    make_sequence_diagram()
    make_er_diagram()
    print("All diagrams generated successfully!")
