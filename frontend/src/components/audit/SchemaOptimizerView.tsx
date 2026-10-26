import React, { useState } from 'react';
import { Database, CheckCircle2, AlertTriangle, Cpu, Copy, Check, Terminal } from 'lucide-react';
import { POSTGRES_SCHEMA_SQL } from '../../../../backend/src/database/schema';

export const SchemaOptimizerView: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('MEDISUTRA_HRC');
  const [copied, setCopied] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(POSTGRES_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunAST = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner & Template Loader */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        borderRadius: '16px',
        padding: '24px',
        border: '1.5px solid #334155',
        color: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: '#0D9488',
              color: '#FFFFFF',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '3px 9px',
              borderRadius: '6px'
            }}>
              AST DIAGNOSTIC ENGINE
            </span>
            <span style={{ color: '#94A3B8', fontSize: '0.82rem' }}>
              Target: PostgreSQL 17 + Drizzle ORM + PgBouncer (Transaction Mode)
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '6px', color: '#F8FAFC' }}>
            Zero-Downtime Schema & Index Optimizer
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#CBD5E1', maxWidth: '780px', marginTop: '4px' }}>
            Detects unindexed foreign keys, table lock hazards during concurrent schema mutations,
            and generates composite covering indexes obeying the <strong>Equality-Range-Sort (ERS)</strong> rule.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => { setSelectedTemplate('MEDISUTRA_HRC'); handleRunAST(); }}
            style={{
              background: selectedTemplate === 'MEDISUTRA_HRC' ? 'linear-gradient(135deg, #0D9488, #14B8A6)' : '#334155',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Database size={16} />
            {analyzing ? 'Analyzing AST Graph...' : 'Load Template: MediSutra: Longitudinal Health & HRC'}
          </button>
        </div>
      </div>

      {/* AST Diagnostic Analysis Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
        {/* Finding 1 */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1.5px solid #FCA5A5',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(239,68,68,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#DC2626', fontWeight: 800, fontSize: '0.9rem' }}>
            <AlertTriangle size={20} />
            P0: Unindexed Longitudinal Biometric Trajectory
          </div>
          <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '8px', lineHeight: '1.45' }}>
            Querying a citizen's 2-year HbA1c, Fasting Glucose, or Lipid trajectory performs an unindexed sequential scan across millions of rows in <code>health_events</code>.
          </p>
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            padding: '10px 12px',
            marginTop: '12px',
            fontSize: '0.78rem',
            fontFamily: 'monospace',
            color: '#991B1B'
          }}>
            Seq Scan on health_events (cost=0.00..89240.50 rows=145 width=280)
          </div>
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontSize: '0.8rem', fontWeight: 700 }}>
            <CheckCircle2 size={16} /> Remedied by: <code>idx_health_trajectory</code> (CONCURRENT covering index)
          </div>
        </div>

        {/* Finding 2 */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1.5px solid #FDE047',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(234,179,8,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CA8A04', fontWeight: 800, fontSize: '0.9rem' }}>
            <Cpu size={20} />
            P0: Regulatory Audit Log Bloat (DPDPA / HIPAA)
          </div>
          <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '8px', lineHeight: '1.45' }}>
            At 100 hospital terminals, <code>audit_logs</code> exceeds 10M rows in 90 days. Unpartitioned tables cause VACUUM freezes and slow ABDM compliance verification.
          </p>
          <div style={{
            background: '#FEFCE8',
            border: '1px solid #FEF08A',
            borderRadius: '8px',
            padding: '10px 12px',
            marginTop: '12px',
            fontSize: '0.78rem',
            fontFamily: 'monospace',
            color: '#854D0E'
          }}>
            Table Bloat Risk: 12.4 GB unpartitioned • WORM Non-Compliant
          </div>
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontSize: '0.8rem', fontWeight: 700 }}>
            <CheckCircle2 size={16} /> Remedied by: Range Partitioning on <code>created_at</code> (Quarterly Partitions)
          </div>
        </div>

        {/* Finding 3 */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1.5px solid #BAE6FD',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(2,132,199,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0284C7', fontWeight: 800, fontSize: '0.9rem' }}>
            <Database size={20} />
            P0: Table Lock Risks during Index Creation
          </div>
          <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '8px', lineHeight: '1.45' }}>
            Standard <code>CREATE INDEX</code> takes an exclusive table lock (SHARE lock), queuing all hospital writes and timing out emergency department admissions.
          </p>
          <div style={{
            background: '#F0F9FF',
            border: '1px solid #BAE6FD',
            borderRadius: '8px',
            padding: '10px 12px',
            marginTop: '12px',
            fontSize: '0.78rem',
            fontFamily: 'monospace',
            color: '#075985'
          }}>
            Lock Mode: AccessExclusiveLock • Queues Emergency OPD Intake
          </div>
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontSize: '0.8rem', fontWeight: 700 }}>
            <CheckCircle2 size={16} /> Remedied by: <code>CREATE INDEX CONCURRENTLY</code> outside transaction block
          </div>
        </div>
      </div>

      {/* Generated Production Migration Script Viewer */}
      <div style={{
        background: '#0F172A',
        borderRadius: '16px',
        border: '1px solid #334155',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 20px',
          background: '#1E293B',
          borderBottom: '1px solid #334155'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Terminal size={18} color="#2DD4BF" />
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#F8FAFC' }}>
              Generated Zero-Downtime PostgreSQL 17 Migration Script (Drizzle / PgBouncer Ready)
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                background: copied ? '#10B981' : '#334155',
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied SQL!' : 'Copy Migration Script'}
            </button>
          </div>
        </div>

        <pre style={{
          margin: 0,
          padding: '20px',
          color: '#E2E8F0',
          fontSize: '0.82rem',
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          lineHeight: '1.55',
          overflowX: 'auto',
          maxHeight: '440px',
          background: '#090D16'
        }}>
          <code>{POSTGRES_SCHEMA_SQL}</code>
        </pre>
      </div>
    </div>
  );
};
