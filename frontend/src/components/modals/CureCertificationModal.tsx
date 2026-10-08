import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';

interface CureCertificationModalProps {
  curingCondition: any;
  patient: any;
  cureDate: string;
  setCureDate: (date: string) => void;
  hospitalName: string;
  doctorName: string;
  cureEvidence: string;
  setCureEvidence: (evidence: string) => void;
  cureSuccessNotice: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export const CureCertificationModal: React.FC<CureCertificationModalProps> = ({
  curingCondition,
  patient,
  cureDate,
  setCureDate,
  hospitalName,
  doctorName,
  cureEvidence,
  setCureEvidence,
  cureSuccessNotice,
  onClose,
  onSubmit,
  isSubmitting
}) => {
  if (!curingCondition) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 110,
        padding: '20px'
      }}
    >
      <div className="card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px', border: '2px solid #059669' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge" style={{ background: '#D1FAE5', color: '#065F46', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle2 size={13} color="#059669" />
                NATIONAL CURE REGISTRY
              </span>
              <span className="badge badge-normal">
                {curingCondition.conditionCode || 'ICD-10'}
              </span>
            </div>
            <h3 style={{ fontSize: '1.35rem', color: '#0F172A', fontWeight: 800 }}>
              Certify Disease as Cured: {curingCondition.conditionName}
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '4px' }}>
              Patient: <strong>{patient?.fullName || 'Patient'}</strong> ({patient?.healthId})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}
          >
            <X size={18} color="#64748B" />
          </button>
        </div>

        {cureSuccessNotice ? (
          <div style={{ padding: '20px', background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: '12px', textAlign: 'center', color: '#065F46', fontWeight: 700 }}>
            <CheckCircle2 size={36} color="#059669" style={{ margin: '0 auto 10px auto' }} />
            <div style={{ fontSize: '1.1rem' }}>{cureSuccessNotice}</div>
            <div style={{ fontSize: '0.82rem', marginTop: '4px', fontWeight: 500, color: '#047857' }}>
              Condition permanently moved to Cured Records with immutable audit trail.
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '14px', background: '#F0FDF4', borderRadius: '10px', border: '1px solid #BBF7D0', fontSize: '0.85rem', color: '#166534', lineHeight: 1.5 }}>
                <strong>Clinical Notice:</strong> Marking this condition as <strong>CURED</strong> will transition it from active disease tracking to the verified cured registry. Accredited hospitals and treating physicians nationwide will have instant access to this verified clinical outcome.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Official Cure / Resolution Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={cureDate}
                    onChange={e => setCureDate(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Certifying Care Facility
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={hospitalName || 'Apollo Hospitals & Heart Institute'}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '0.88rem', color: '#475569' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Certifying Physician / Specialist
                </label>
                <input
                  type="text"
                  readOnly
                  value={doctorName || 'Attending Physician'}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '0.88rem', color: '#475569' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Clinical Evidence & Resolution Criteria Proof *
                </label>
                <textarea
                  required
                  rows={3}
                  value={cureEvidence}
                  onChange={e => setCureEvidence(e.target.value)}
                  placeholder="e.g. Platelet count recovered to normal (210,000/µL), asymptomatic for >14 days, repeat culture negative, clinical remission verified."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontFamily: 'inherit', resize: 'vertical' }}
                />
                <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '4px' }}>
                  Specify laboratory findings, radiological clearance, or clinical criteria confirming remission.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: '#059669',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckCircle2 size={16} />
                  {isSubmitting ? 'Recording Cure...' : 'Confirm & Certify Clinical Cure'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
