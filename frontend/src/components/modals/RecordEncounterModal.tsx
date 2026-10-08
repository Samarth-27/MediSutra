import React from 'react';
import { X, Stethoscope } from 'lucide-react';

interface RecordEncounterModalProps {
  isOpen: boolean;
  diagSuccessMsg: string;
  patient: any;
  hospitalName: string;
  doctorName: string;
  diagConditionName: string;
  setDiagConditionName: (val: string) => void;
  diagConditionCode: string;
  setDiagConditionCode: (val: string) => void;
  diagBodySystem: string;
  setDiagBodySystem: (val: string) => void;
  diagSeverity: 'MILD' | 'MODERATE' | 'SEVERE';
  setDiagSeverity: (val: 'MILD' | 'MODERATE' | 'SEVERE') => void;
  diagStatus: string;
  setDiagStatus: (val: string) => void;
  diagNotes: string;
  setDiagNotes: (val: string) => void;
  diagRx: string;
  setDiagRx: (val: string) => void;
  diagDept: string;
  setDiagDept: (val: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const RecordEncounterModal: React.FC<RecordEncounterModalProps> = ({
  isOpen,
  diagSuccessMsg,
  patient,
  hospitalName,
  doctorName,
  diagConditionName,
  setDiagConditionName,
  diagConditionCode,
  setDiagConditionCode,
  diagBodySystem,
  setDiagBodySystem,
  diagSeverity,
  setDiagSeverity,
  diagStatus,
  setDiagStatus,
  diagNotes,
  setDiagNotes,
  diagRx,
  setDiagRx,
  diagDept,
  setDiagDept,
  isSubmitting,
  onSubmit,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '20px'
      }}
    >
      <div className="card" style={{ maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FEF3C7', color: '#B45309', padding: '4px 10px', borderRadius: '14px', fontSize: '0.74rem', fontWeight: 800, marginBottom: '6px' }}>
              <Stethoscope size={13} />
              CROSS-HOSPITAL CLINICAL ENCOUNTER
            </div>
            <h3 style={{ fontSize: '1.35rem', color: '#0F172A' }}>
              Record Clinical Diagnosis Encounter
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '2px' }}>
              Issuing Facility: <strong>{hospitalName || 'Apollo Hospitals'}</strong> • Attending: <strong>{doctorName}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ padding: '6px', borderRadius: '8px', background: '#F1F5F9', border: 'none', cursor: 'pointer' }}
          >
            <X size={20} color="#64748B" />
          </button>
        </div>

        {diagSuccessMsg && (
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '12px 16px', borderRadius: '10px', color: '#065F46', fontSize: '0.88rem', fontWeight: 700, marginBottom: '16px' }}>
            ✓ {diagSuccessMsg}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
              Target Patient:
            </label>
            <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem', color: '#0F172A', fontWeight: 700 }}>
              👤 {patient?.fullName} ({patient?.healthId}) • Blood: {patient?.bloodGroup}
            </div>
          </div>

          {/* Quick Disease Presets */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '6px' }}>
              QUICK DIAGNOSIS PRESETS:
            </label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { name: 'Essential Hypertension', code: 'I10', sys: 'Cardiovascular' },
                { name: 'Acute Bronchitis', code: 'J20.9', sys: 'Respiratory' },
                { name: 'Dengue Fever (Non-Severe)', code: 'A90', sys: 'Blood' },
                { name: 'Primary Osteoarthritis of Knee', code: 'M17.1', sys: 'Musculoskeletal' },
                { name: 'Non-Alcoholic Fatty Liver (Grade 1)', code: 'K76.0', sys: 'Hepatic' }
              ].map(p => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setDiagConditionName(p.name);
                    setDiagConditionCode(p.code);
                    setDiagBodySystem(p.sys);
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    background: '#F8FAFC',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    color: '#334155'
                  }}
                >
                  + {p.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                Disease / Condition Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Essential Hypertension"
                value={diagConditionName}
                onChange={(e) => setDiagConditionName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                ICD-10 Code
              </label>
              <input
                type="text"
                placeholder="e.g. I10"
                value={diagConditionCode}
                onChange={(e) => setDiagConditionCode(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontFamily: 'monospace' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                Body System
              </label>
              <select
                value={diagBodySystem}
                onChange={(e) => setDiagBodySystem(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              >
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Respiratory">Respiratory</option>
                <option value="Metabolic">Metabolic</option>
                <option value="Hepatic">Hepatic</option>
                <option value="Renal">Renal</option>
                <option value="Blood">Blood</option>
                <option value="Skin">Skin</option>
                <option value="Musculoskeletal">Musculoskeletal</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                Clinical Severity
              </label>
              <select
                value={diagSeverity}
                onChange={(e) => setDiagSeverity(e.target.value as any)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              >
                <option value="MILD">MILD</option>
                <option value="MODERATE">MODERATE</option>
                <option value="SEVERE">SEVERE</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                Condition Status
              </label>
              <select
                value={diagStatus}
                onChange={(e) => setDiagStatus(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              >
                <option value="DIAGNOSED">DIAGNOSED</option>
                <option value="UNDER_TREATMENT">UNDER_TREATMENT</option>
                <option value="MONITORING">MONITORING</option>
                <option value="SUSPECTED">SUSPECTED</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
              Clinical Assessment & Examination Notes *
            </label>
            <textarea
              rows={2}
              required
              placeholder="Physical exam findings, presenting complaints, vitals, auscultation results..."
              value={diagNotes}
              onChange={(e) => setDiagNotes(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
              Prescribed Therapy & Rx Regimen
            </label>
            <textarea
              rows={2}
              placeholder="Medications, dosages, administration route, lifestyle interventions..."
              value={diagRx}
              onChange={(e) => setDiagRx(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
              Department
            </label>
            <input
              type="text"
              value={diagDept}
              onChange={(e) => setDiagDept(e.target.value)}
              placeholder="e.g. Internal Medicine"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Recording Encounter...' : 'Record Encounter & Update Patient History'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
