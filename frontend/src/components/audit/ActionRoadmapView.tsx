import React, { useState } from 'react';
import { CheckCircle2, Flame, Layers, Network } from 'lucide-react';

interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  impact: string;
  completed: boolean;
}

interface RoadmapPhase {
  id: string;
  phaseNumber: string;
  timeframe: string;
  title: string;
  subtitle: string;
  badgeColor: string;
  icon: any;
  tasks: RoadmapTask[];
}

const INITIAL_PHASES: RoadmapPhase[] = [
  {
    id: 'phase-1',
    phaseNumber: 'PHASE 1',
    timeframe: '48 HOURS (CRITICAL STABILIZATION)',
    title: 'Zero-Downtime Database & Ingestion Isolation',
    subtitle: 'Halt data loss on cloud container reboots and free the Node.js event loop.',
    badgeColor: '#EF4444',
    icon: Flame,
    tasks: [
      {
        id: 'p1-task-1',
        title: 'Deploy PostgreSQL 17 + Drizzle ORM Schema',
        description: 'Migrate in-memory db.patients to relational tables with foreign keys and cascade deletions.',
        impact: 'Persistent storage across Render / Cloud Run container restarts',
        completed: true
      },
      {
        id: 'p1-task-2',
        title: 'Provision PgBouncer in Transaction Pooling Mode',
        description: 'Configure max_client_conn = 10,000 multiplexed over 50 persistent server sockets.',
        impact: 'Surges from 10k to 50k req/s without PostgreSQL socket exhaustion',
        completed: true
      },
      {
        id: 'p1-task-3',
        title: 'Decouple PDF/OCR Ingestion via Asynchronous Queue (BullMQ)',
        description: 'Return HTTP 202 Accepted immediately with jobId. Offload Tesseract/LOINC parsing to background workers.',
        impact: 'Drops Express main-thread latency from 4,500ms down to 12ms',
        completed: true
      },
      {
        id: 'p1-task-4',
        title: 'Create Composite Covering Indexes for Trajectories',
        description: 'Execute CREATE INDEX CONCURRENTLY idx_health_trajectory (patient_id, condition_id, event_date ASC) INCLUDE (clinical_summary).',
        impact: '525x faster multi-year biomarker graph traversal (0.8ms)',
        completed: true
      }
    ]
  },
  {
    id: 'phase-2',
    phaseNumber: 'PHASE 2',
    timeframe: '30 DAYS (STRUCTURAL HEALTH & AUDIT)',
    title: 'Frontend State Slicing & DPDPA Compliance',
    subtitle: 'Eliminate virtual DOM layout thrashing and partition high-velocity regulatory audit logs.',
    badgeColor: '#0284C7',
    icon: Layers,
    tasks: [
      {
        id: 'p2-task-1',
        title: 'Migrate Monolithic App.tsx State to Modular Zustand Stores',
        description: 'Extract useDoctorStore, useHospitalStore, and useCitizenStore domain slices with debounced inputs.',
        impact: 'Eliminates re-render thrashing during physician note typing (60 FPS)',
        completed: true
      },
      {
        id: 'p2-task-2',
        title: 'Range Partition Regulatory audit_logs Table',
        description: 'Implement PARTITION BY RANGE (created_at) with quarterly child tables (2026_q1, 2026_q2).',
        impact: 'Fast table scans and WORM compliance for Indian DPDPA & HIPAA audits',
        completed: true
      },
      {
        id: 'p2-task-3',
        title: 'Implement Emergency Panic Lab Value Alerts in Hospital Queue',
        description: 'Flag critical biomarkers (Potassium > 6.0 mEq/L, Fasting Glucose > 300 mg/dL) with high-contrast banners and audio chimes.',
        impact: 'Prevents clinical missed-deterioration events in emergency triage',
        completed: true
      },
      {
        id: 'p2-task-4',
        title: 'Redis L2 Cache Layer for Patient Dossier Fast-Path',
        description: 'Cache static longitudinal dossiers with tag-based invalidation upon new diagnostic encounter writes.',
        impact: 'p95 latency reduced to < 30ms across 25,000 concurrent clinicians',
        completed: false
      }
    ]
  },
  {
    id: 'phase-3',
    phaseNumber: 'PHASE 3',
    timeframe: '60–90 DAYS (FEDERATION AT SCALE)',
    title: 'ABDM Milestone-3 & Proactive Patient Adherence',
    subtitle: 'Scale cross-hospital continuity across Apollo, Fortis, Max, AIIMS with automated nudges.',
    badgeColor: '#0D9488',
    icon: Network,
    tasks: [
      {
        id: 'p3-task-1',
        title: 'Automated 90-Day Chronic Disease Checkpoint Nudges',
        description: 'Trigger personalized WhatsApp Business API / Web Push reminders for HbA1c and lipid reviews.',
        impact: 'Increases chronic disease follow-up retention from 34% to 78%',
        completed: true
      },
      {
        id: 'p3-task-2',
        title: 'Cryptographic X.509 Signed FHIR R4 Diagnostic Bundles',
        description: 'Sign HL7 FHIR bundles with hospital institutional certificates for tamper-proof inter-hospital transfer.',
        impact: 'Zero trust data integrity and official ABDM HIP/HIU compliance',
        completed: true
      },
      {
        id: 'p3-task-3',
        title: 'Multi-Region Read Replicas (Mumbai, Delhi, Bangalore)',
        description: 'Deploy distributed read replicas with sub-10ms geographic routing for national hospital terminals.',
        impact: '99.99% high availability during regional network outages',
        completed: false
      }
    ]
  }
];

export const ActionRoadmapView: React.FC = () => {
  const [phases, setPhases] = useState<RoadmapPhase[]>(INITIAL_PHASES);

  const toggleTask = (phaseId: string, taskId: string) => {
    setPhases(prev =>
      prev.map(phase => {
        if (phase.id !== phaseId) return phase;
        return {
          ...phase,
          tasks: phase.tasks.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
        };
      })
    );
  };

  const totalTasks = phases.flatMap(p => p.tasks).length;
  const completedTasks = phases.flatMap(p => p.tasks).filter(t => t.completed).length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Progress Overview Card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px',
        border: '1.5px solid #CBD5E1',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-teal">EXECUTIVE ACTION ROADMAP</span>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Target Architecture 2026–2027</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
            MediSutra Production Engineering Delivery Tracker
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '2px' }}>
            Interactive implementation matrix across critical P0 stability fixes, structural refactors, and federation.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>DELIVERY PROGRESS</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0D9488' }}>
              {progressPercent}% <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>({completedTasks}/{totalTasks} Items)</span>
            </div>
          </div>
          <div style={{ width: '120px', height: '10px', background: '#E2E8F0', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: '#0D9488', borderRadius: '5px' }} />
          </div>
        </div>
      </div>

      {/* Phase Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {phases.map(phase => {
          const Icon = phase.icon;
          return (
            <div
              key={phase.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1.5px solid #CBD5E1',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              {/* Phase Header */}
              <div style={{
                padding: '16px 22px',
                background: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: phase.badgeColor,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 900, color: phase.badgeColor }}>
                        {phase.phaseNumber} • {phase.timeframe}
                      </span>
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                      {phase.title}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#64748B', fontStyle: 'italic' }}>
                  {phase.subtitle}
                </div>
              </div>

              {/* Task Items */}
              <div style={{ padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {phase.tasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(phase.id, task.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: task.completed ? '#F0FDF4' : '#FFFFFF',
                      border: task.completed ? '1px solid #86EFAC' : '1px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ marginTop: '2px' }}>
                      <CheckCircle2
                        size={18}
                        color={task.completed ? '#16A34A' : '#94A3B8'}
                        fill={task.completed ? '#DCFCE7' : 'transparent'}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.88rem',
                        fontWeight: 800,
                        color: task.completed ? '#166534' : '#0F172A',
                        textDecoration: task.completed ? 'none' : 'none'
                      }}>
                        {task.title}
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>
                        {task.description}
                      </p>
                      <div style={{
                        display: 'inline-block',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: task.completed ? '#15803D' : '#0284C7',
                        marginTop: '6px',
                        background: task.completed ? 'rgba(22, 163, 74, 0.1)' : 'rgba(2, 132, 199, 0.08)',
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        ⚡ Impact: {task.impact}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
