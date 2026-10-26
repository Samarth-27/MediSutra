import React, { useState } from 'react';
import {
  Database,
  Cpu,
  Code,
  Calendar,
  FileDown,
  CheckCircle2,
  BellRing,
  Send,
  MessageSquare
} from 'lucide-react';
import { SchemaOptimizerView } from './SchemaOptimizerView';
import { LoadSimulatorView } from './LoadSimulatorView';
import { CodeRefactorStudioView } from './CodeRefactorStudioView';
import { ActionRoadmapView } from './ActionRoadmapView';
import { ExecutiveDossierModal } from './ExecutiveDossierModal';

interface ArchitectureCommandCenterProps {
  onClose?: () => void;
}

export const ArchitectureCommandCenter: React.FC<ArchitectureCommandCenterProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'load-simulator' | 'code-refactors' | 'action-roadmap'>('schema');
  const [dossierModalOpen, setDossierModalOpen] = useState(false);
  const [nudgeModalOpen, setNudgeModalOpen] = useState(false);
  const [nudgeSent, setNudgeSent] = useState(false);

  const handleSendNudge = () => {
    setNudgeSent(true);
    setTimeout(() => {
      setNudgeSent(false);
      setNudgeModalOpen(false);
    }, 2200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Executive Command Center Header */}
      <div style={{
        background: 'linear-gradient(135deg, #091E28 0%, #06151E 50%, #030B10 100%)',
        borderRadius: '20px',
        padding: '26px 30px',
        border: '1.5px solid #144955',
        color: '#FFFFFF',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '18px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: 'linear-gradient(135deg, #0D9488, #14B8A6)',
              color: '#FFFFFF',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '6px',
              letterSpacing: '0.04em'
            }}>
              SENIOR ARCHITECTURE & CODEBASE AUDIT
            </span>
            <span style={{ color: '#5EEAD4', fontSize: '0.8rem', fontWeight: 600 }}>
              Live Infrastructure Command Center
            </span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginTop: '8px', letterSpacing: '-0.02em', color: '#F0FDFA' }}>
            MediSutra Scale & Resilience Command Studio
          </h1>
          <p style={{ fontSize: '0.86rem', color: '#99F6E4', maxWidth: '780px', marginTop: '4px', opacity: 0.85 }}>
            Synthesized architectural audit resolving in-memory reboot wipes, event loop freezes, and virtual DOM thrashing across 50,000 req/sec hospital nodes.
          </p>

          <div style={{ display: 'flex', gap: '12px', marginTop: '14px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.08)', padding: '3px 9px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
              🔒 Zero-Downtime Migration
            </span>
            <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.08)', padding: '3px 9px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
              ⚡ PgBouncer 10k Conns
            </span>
            <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.08)', padding: '3px 9px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
              🗄️ BullMQ Async Queue
            </span>
            <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.08)', padding: '3px 9px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
              ⚛️ Zustand 60 FPS Slices
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Nudge Simulation Button */}
          <button
            type="button"
            onClick={() => setNudgeModalOpen(true)}
            style={{
              background: 'rgba(20, 184, 166, 0.15)',
              border: '1px solid #14B8A6',
              color: '#5EEAD4',
              padding: '10px 16px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <BellRing size={16} />
            Test 90-Day Checkpoint Nudge
          </button>

          {/* Export Executive Dossier Button */}
          <button
            type="button"
            onClick={() => setDossierModalOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #0D9488, #14B8A6)',
              border: 'none',
              color: '#FFFFFF',
              padding: '10px 18px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(13, 148, 136, 0.4)'
            }}
          >
            <FileDown size={18} />
            Export Executive Dossier
          </button>

          {/* Close Studio Button (if invoked as modal/overlay) */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#FCA5A5',
                padding: '10px 16px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              ✕ Exit Studio
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        background: '#FFFFFF',
        padding: '6px',
        borderRadius: '16px',
        border: '1.5px solid #CBD5E1',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        gap: '6px'
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('schema')}
          style={{
            padding: '12px 14px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'schema' ? 'linear-gradient(135deg, #0D9488, #0F766E)' : 'transparent',
            color: activeTab === 'schema' ? '#FFFFFF' : '#475569',
            fontWeight: 800,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <Database size={18} />
          <span>Schema Optimizer</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('load-simulator')}
          style={{
            padding: '12px 14px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'load-simulator' ? 'linear-gradient(135deg, #0284C7, #0369A1)' : 'transparent',
            color: activeTab === 'load-simulator' ? '#FFFFFF' : '#475569',
            fontWeight: 800,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <Cpu size={18} />
          <span>Load Simulator (10k–50k)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('code-refactors')}
          style={{
            padding: '12px 14px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'code-refactors' ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' : 'transparent',
            color: activeTab === 'code-refactors' ? '#FFFFFF' : '#475569',
            fontWeight: 800,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <Code size={18} />
          <span>Code Refactor Studio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('action-roadmap')}
          style={{
            padding: '12px 14px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'action-roadmap' ? 'linear-gradient(135deg, #EA580C, #C2410C)' : 'transparent',
            color: activeTab === 'action-roadmap' ? '#FFFFFF' : '#475569',
            fontWeight: 800,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <Calendar size={18} />
          <span>Action Roadmap (Phases 1–3)</span>
        </button>
      </div>

      {/* Active Tab Component */}
      <div>
        {activeTab === 'schema' && <SchemaOptimizerView />}
        {activeTab === 'load-simulator' && <LoadSimulatorView />}
        {activeTab === 'code-refactors' && <CodeRefactorStudioView />}
        {activeTab === 'action-roadmap' && <ActionRoadmapView />}
      </div>

      {/* Export Executive Dossier Modal */}
      <ExecutiveDossierModal
        isOpen={dossierModalOpen}
        onClose={() => setDossierModalOpen(false)}
      />

      {/* Simulated 90-Day WhatsApp / Web Push Adherence Nudge Modal */}
      {nudgeModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '26px',
            maxWidth: '520px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0F766E' }}>
              <MessageSquare size={22} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                WhatsApp / Web Push Adherence Nudge
              </h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '6px' }}>
              Simulates automated, non-judgmental proactive engagement for chronic disease checkpoints (ABDM Milestone-3 compliant).
            </p>

            <div style={{
              background: '#F0FDFA',
              border: '1.5px solid #2DD4BF',
              borderRadius: '12px',
              padding: '16px',
              marginTop: '16px',
              color: '#134E4A'
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0D9488', marginBottom: '4px' }}>
                OUTBOUND MESSAGE PAYLOAD (To: +91 98765 43210 - Rahul Sharma)
              </div>
              <p style={{ fontSize: '0.88rem', fontStyle: 'italic', lineHeight: '1.45' }}>
                “Namaste Rahul, Dr. Priya Nair scheduled your 90-day HbA1c review for this week. Book a home collection with Dr. Lal PathLabs in 1 tap.”
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setNudgeModalOpen(false)}
                className="btn-secondary"
                style={{ padding: '9px 16px', fontSize: '0.84rem' }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSendNudge}
                className="btn-primary"
                disabled={nudgeSent}
                style={{
                  padding: '9px 18px',
                  fontSize: '0.84rem',
                  background: nudgeSent ? '#10B981' : '#0D9488',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {nudgeSent ? <CheckCircle2 size={16} /> : <Send size={16} />}
                {nudgeSent ? 'Nudge Dispatched!' : 'Simulate Outbound Dispatch'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
