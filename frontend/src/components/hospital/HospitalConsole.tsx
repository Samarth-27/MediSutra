import React from 'react';
import {
  Building2,
  Users,
  CheckCircle2
} from 'lucide-react';
import type { AuthSession } from '../../types';

interface HospitalConsoleProps {
  authSession: AuthSession;
  hospitalActiveSubTab: 'queue' | 'doctors' | string;
  hospitals: any[];
  selectedHospitalId: string;
  hospitalDashboardData: any;
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
  onboardResult: any;
  handleOnboardPatientToDoctor: (e: React.FormEvent) => void;
  setRegisterCitizenModalOpen: (open: boolean) => void;
  setCreateDoctorModalOpen: (open: boolean) => void;
}

export const HospitalConsole: React.FC<HospitalConsoleProps> = ({
  authSession,
  hospitalActiveSubTab,
  hospitals,
  selectedHospitalId,
  hospitalDashboardData,
  hospitalRegistry,
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
  onboardResult,
  handleOnboardPatientToDoctor,
  setRegisterCitizenModalOpen,
  setCreateDoctorModalOpen
}) => {
  const currentHospital = hospitals.find(h => h.id === selectedHospitalId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Authenticated Role Institutional Scope Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)',
          border: '1.5px solid #0D9488',
          borderRadius: '16px',
          padding: '16px 22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#0F766E',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Building2 size={22} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#0F766E',
                letterSpacing: '0.04em'
              }}
            >
              AUTHENTICATED HOSPITAL FACILITY PARTITION
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
              {authSession.hospital?.name || 'Apollo Hospitals & Heart Institute'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#475569' }}>
              Facility Code: {authSession.hospital?.facilityCode || 'HIP-IN-DEL-001'} • {authSession.hospital?.city || 'Delhi NCR'} • {authSession.hospital?.tier || 'Super Speciality'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              background: '#0F766E',
              color: '#FFFFFF',
              fontSize: '0.74rem',
              fontWeight: 800,
              padding: '5px 12px',
              borderRadius: '20px'
            }}
          >
            FACILITY RECEPTION & INTAKE CONSOLE
          </span>
        </div>
      </div>

      {/* SUBTAB 1: ONBOARD PATIENT BY UNIQUE ID & LIVE OPD QUEUE */}
      {hospitalActiveSubTab === 'queue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Dedicated Hospital Onboarding Card: Onboard Patient by Unique ID to Doctor */}
          <div
            className="card"
            style={{
              padding: '22px 26px',
              background: '#FFFFFF',
              border: '1.5px solid #0D9488',
              borderRadius: '16px',
              boxShadow: '0 4px 16px rgba(15, 118, 110, 0.08)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#CCFBF1', color: '#0F766E', padding: '3px 10px', borderRadius: '12px', fontSize: '0.74rem', fontWeight: 800, marginBottom: '4px' }}>
                  <Users size={13} />
                  HOSPITAL PATIENT INTAKE TO DOCTOR DASHBOARD
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Onboard Patient by Sovereign Unique ID (UHID / ABHA)
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '3px' }}>
                  Entering the patient's unique ID automatically links all their previous health treatments, disease history, and lab reports from any hospital in India directly into the treating doctor's dashboard.
                </p>
              </div>
            </div>

            <form onSubmit={handleOnboardPatientToDoctor}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Patient Sovereign UHID / ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MED-00010001"
                    value={onboardHealthId}
                    onChange={e => setOnboardHealthId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #0F766E',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      background: '#F0FDFA'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Assign to Attending Doctor *
                  </label>
                  <select
                    value={onboardDoctorName}
                    onChange={e => setOnboardDoctorName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      background: '#FFFFFF'
                    }}
                  >
                    {(currentHospital?.activeDoctors || [
                      { name: 'Dr. Priya Nair', specialization: 'Endocrinologist' },
                      { name: 'Dr. Alok Sen', specialization: 'Cardiologist' },
                      { name: 'Dr. Sunita Rao', specialization: 'Pulmonologist' }
                    ]).map((doc: any, i: number) => (
                      <option key={i} value={doc.name}>
                        {doc.name} ({doc.specialization || 'Attending'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Department
                  </label>
                  <input
                    type="text"
                    value={onboardDepartment}
                    onChange={e => setOnboardDepartment(e.target.value)}
                    placeholder="e.g. Outpatient Medicine"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.86rem',
                      background: '#FFFFFF'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Chief Complaint / Reason
                  </label>
                  <input
                    type="text"
                    value={onboardComplaint}
                    onChange={e => setOnboardComplaint(e.target.value)}
                    placeholder="e.g. Cross-hospital review"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.86rem',
                      background: '#FFFFFF'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Triage Priority
                  </label>
                  <select
                    value={onboardPriority}
                    onChange={e => setOnboardPriority(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.86rem',
                      background: '#FFFFFF'
                    }}
                  >
                    <option value="Routine OPD">Routine OPD</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Specialist Review">Specialist Review</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isOnboarding}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)'
                  }}
                >
                  <CheckCircle2 size={15} />
                  {isOnboarding ? 'Linking All Records...' : 'Onboard & Link Treatments'}
                </button>
              </div>
            </form>

            {/* Quick Preset Patients Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>QUICK ONBOARD PRESET:</span>
              {hospitalRegistry.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setOnboardHealthId(p.healthId)}
                  style={{
                    background: onboardHealthId === p.healthId ? '#CCFBF1' : '#F1F5F9',
                    color: onboardHealthId === p.healthId ? '#0F766E' : '#475569',
                    border: onboardHealthId === p.healthId ? '1.5px solid #0F766E' : '1px solid #CBD5E1',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  👤 {p.fullName} ({p.healthId})
                </button>
              ))}
            </div>

            {/* Immediate Onboard Success Notice */}
            {onboardResult && (
              <div style={{ marginTop: '14px', padding: '14px 18px', background: '#ECFDF5', border: '1.5px solid #A7F3D0', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ color: '#065F46', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={18} />
                    {onboardResult.message || `Patient onboarded to ${onboardResult.assignedDoctor}'s dashboard!`}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#047857', marginTop: '3px' }}>
                    Linked <strong>{onboardResult.recordsLinked?.totalDocumentsCount || 0} previous hospital records</strong> and <strong>{onboardResult.recordsLinked?.totalConditionsCount || 0} lifetime diseases</strong> across <strong>{onboardResult.recordsLinked?.facilitiesCount || 1} network hospitals</strong>.
                  </div>
                </div>
                <span style={{
                  background: '#059669',
                  color: '#FFFFFF',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 800
                }}>
                  ✓ Sent to Doctor Station
                </span>
              </div>
            )}
          </div>

          {/* Live OPD & Walk-in Queue Table */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={20} color="#0F766E" />
                  <h2 style={{ fontSize: '1.35rem', color: '#0F172A', margin: 0 }}>
                    Live Outpatient (OPD) & Intake Queue
                  </h2>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '4px' }}>
                  Real-time patient intake at <strong>{currentHospital?.name}</strong>. Onboarded patients appear with their assigned physician.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRegisterCitizenModalOpen(true)}
                className="btn-primary"
                style={{ fontSize: '0.84rem', padding: '8px 16px' }}
              >
                + Check-in Walk-in Patient
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                    <th style={{ padding: '12px 16px' }}>Token #</th>
                    <th style={{ padding: '12px 16px' }}>Citizen / UHID</th>
                    <th style={{ padding: '12px 16px' }}>Demographics</th>
                    <th style={{ padding: '12px 16px' }}>Priority</th>
                    <th style={{ padding: '12px 16px' }}>Chief Presenting Complaint</th>
                    <th style={{ padding: '12px 16px' }}>Attending Physician</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px' }}>Intake Triage</th>
                  </tr>
                </thead>
                <tbody>
                  {(hospitalDashboardData?.opdQueue || []).map((q: any) => (
                    <tr key={q.tokenNumber} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontWeight: 800, background: '#F1F5F9', padding: '4px 10px', borderRadius: '8px', fontSize: '0.82rem', color: '#0F172A' }}>
                          {q.tokenNumber}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.94rem' }}>
                          {q.patientName}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#0F766E', fontFamily: 'monospace', fontWeight: 700 }}>
                          {q.healthId}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#475569', fontSize: '0.82rem' }}>
                        {q.age} yrs • {q.gender} • <strong>{q.bloodGroup}</strong>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge ${q.priority === 'Urgent' ? 'badge-danger' : q.priority === 'Follow-up' ? 'badge-teal' : 'badge-normal'}`}>
                          {q.priority}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#334155', maxWidth: '240px' }}>
                        {q.chiefComplaint}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#0F766E', fontWeight: 600, fontSize: '0.82rem' }}>
                        🩺 {q.attendingDoctor}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: q.status.includes('Consultation') ? '#0D9488' : '#D97706',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          ● {q.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: '#0F766E',
                          background: '#F0FDFA',
                          border: '1px solid #CCFBF1',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <CheckCircle2 size={12} color="#0D9488" />
                          Intake Registered
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: HOSPITAL DOCTORS ROSTER */}
      {hospitalActiveSubTab === 'doctors' && (
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', color: '#0F172A', marginBottom: '4px' }}>
                Medical Specialists & Doctor ID Management at {currentHospital?.name}
              </h2>
              <p style={{ fontSize: '0.84rem', color: '#64748B' }}>
                This hospital issues unique doctor credentials. Authenticated specialists receive onboarded patients and inspect longitudinal cross-hospital health records.
              </p>
            </div>

            <button
              id="btn-provision-doctor"
              type="button"
              onClick={() => setCreateDoctorModalOpen(true)}
              className="btn-primary"
              style={{ fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Users size={16} />
              + Issue New Doctor ID & Access Credential
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {(currentHospital?.activeDoctors || []).map((doc: any) => (
              <div key={doc.id} style={{ background: '#F8FAFC', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#CCFBF1', color: '#0F766E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                        🩺
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>{doc.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#0F766E', fontWeight: 600 }}>{doc.qualification}</div>
                      </div>
                    </div>
                    <span className="badge badge-normal" style={{ fontSize: '0.7rem' }}>
                      ✓ Active Faculty
                    </span>
                  </div>

                  <div style={{ fontSize: '0.84rem', color: '#475569', marginBottom: '4px' }}>
                    Specialty: <strong>{doc.specialization}</strong>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748B', marginBottom: '14px' }}>
                    MCI License: <strong style={{ color: '#0F172A', fontFamily: 'monospace' }}>{doc.licenseNumber}</strong>
                  </div>
                </div>

                <div style={{
                  background: '#F0FDFA',
                  border: '1px solid #CCFBF1',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  color: '#0F766E',
                  fontWeight: 700,
                  textAlign: 'center'
                }}>
                  ✓ Doctor ID Provisioned & Verified
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
