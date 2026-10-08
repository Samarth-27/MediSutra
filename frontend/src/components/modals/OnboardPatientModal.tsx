import React from 'react';
import { X, Users, CheckCircle2, Stethoscope } from 'lucide-react';

interface OnboardPatientModalProps {
  isOpen: boolean;
  onboardResult: any;
  hospitalRegistry: any[];
  onboardHealthId: string;
  setOnboardHealthId: (val: string) => void;
  onboardDoctorName: string;
  setOnboardDoctorName: (val: string) => void;
  onboardDepartment: string;
  setOnboardDepartment: (val: string) => void;
  onboardComplaint: string;
  setOnboardComplaint: (val: string) => void;
  onboardPriority: string;
  setOnboardPriority: (val: string) => void;
  isOnboarding: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  onSuccessAction: () => void;
  activeDoctors?: any[];
}

export const OnboardPatientModal: React.FC<OnboardPatientModalProps> = ({
  isOpen,
  onboardResult,
  hospitalRegistry = [],
  onboardHealthId,
  setOnboardHealthId,
  onboardDoctorName,
  setOnboardDoctorName,
  onboardDepartment,
  setOnboardDepartment,
  onboardComplaint,
  setOnboardComplaint,
  onboardPriority,
  setOnboardPriority,
  isOnboarding,
  onSubmit,
  onClose,
  onSuccessAction,
  activeDoctors = []
}) => {
  if (!isOpen) return null;

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
      <div className="card" style={{ maxWidth: '640px', width: '100%', maxHeight: '92vh', overflowY: 'auto', padding: '28px', border: '2px solid #0F766E' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge" style={{ background: '#CCFBF1', color: '#0F766E', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Users size={13} />
                HOSPITAL INTAKE & DOCTOR ASSIGNMENT
              </span>
              <span className="badge badge-normal">
                Central Health Record Linkage
              </span>
            </div>
            <h3 style={{ fontSize: '1.35rem', color: '#0F172A', fontWeight: 800 }}>
              Onboard Patient to Doctor Dashboard
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '4px' }}>
              Enter the citizen's Unique Health ID to immediately link and import their lifetime health treatments from all hospitals.
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

        {onboardResult ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '20px', background: '#ECFDF5', border: '1.5px solid #6EE7B7', borderRadius: '12px', textAlign: 'center', color: '#065F46' }}>
              <CheckCircle2 size={40} color="#059669" style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>{onboardResult.message}</div>
              <div style={{ fontSize: '0.84rem', marginTop: '6px', color: '#047857' }}>
                Patient: <strong>{onboardResult.patient?.fullName}</strong> ({onboardResult.patient?.healthId})
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>RECORDS LINKED</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F766E' }}>{onboardResult.recordsLinked?.totalReportsCount || 0}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Diagnostic Reports</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>LIFETIME DISEASES</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#D97706' }}>{onboardResult.recordsLinked?.totalConditionsCount || 0}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Active & Resolved</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>HOSPITALS VISITED</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2563EB' }}>{onboardResult.recordsLinked?.facilitiesCount || 1}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Federated Facilities</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" onClick={onClose} className="btn-secondary">
                Close
              </button>
              <button
                type="button"
                onClick={onSuccessAction}
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Stethoscope size={16} />
                View Patient in Doctor Dashboard →
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Quick Select Preset Chips */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  SELECT REGISTERED CITIZEN (OR ENTER UNIQUE ID BELOW):
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {hospitalRegistry.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setOnboardHealthId(p.healthId)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: onboardHealthId === p.healthId ? '2px solid #0F766E' : '1px solid #CBD5E1',
                        background: onboardHealthId === p.healthId ? '#CCFBF1' : '#FFFFFF',
                        color: onboardHealthId === p.healthId ? '#0F766E' : '#334155',
                        fontWeight: onboardHealthId === p.healthId ? 800 : 600,
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      👤 {p.fullName} ({p.healthId})
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Patient Sovereign UHID / Unique Health ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MED-00010001"
                  value={onboardHealthId}
                  onChange={e => setOnboardHealthId(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #0F766E', fontSize: '0.95rem', fontFamily: 'monospace', fontWeight: 700, background: '#F0FDFA' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Assign to Attending Doctor *
                  </label>
                  <select
                    value={onboardDoctorName}
                    onChange={e => setOnboardDoctorName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontWeight: 600, background: '#FFFFFF' }}
                  >
                    {(activeDoctors.length > 0 ? activeDoctors : [
                      { name: 'Dr. Sneha Roy', specialization: 'Endocrinology' },
                      { name: 'Dr. Priya Nair', specialization: 'Endocrinologist' },
                      { name: 'Dr. Alok Sen', specialization: 'Cardiologist' }
                    ]).map((doc: any, i: number) => (
                      <option key={i} value={doc.name}>
                        {doc.name} ({doc.specialization || 'Attending'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Department
                  </label>
                  <input
                    type="text"
                    value={onboardDepartment}
                    onChange={e => setOnboardDepartment(e.target.value)}
                    placeholder="e.g. Endocrinology & Medicine"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Chief Presenting Complaint
                  </label>
                  <input
                    type="text"
                    value={onboardComplaint}
                    onChange={e => setOnboardComplaint(e.target.value)}
                    placeholder="e.g. Cross-hospital consultation and diagnostic review"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Triage Priority
                  </label>
                  <select
                    value={onboardPriority}
                    onChange={e => setOnboardPriority(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                  >
                    <option value="Routine OPD">Routine OPD</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Specialist Review">Specialist Review</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                  disabled={isOnboarding}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isOnboarding}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Users size={16} />
                  {isOnboarding ? 'Onboarding & Linking Records...' : 'Onboard & Link Cross-Hospital Records'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
