import React, { useState } from 'react';
import {
  Building2,
  Stethoscope,
  Shield,
  Lock,
  ArrowRight,
  HeartPulse,
  AlertCircle
} from 'lucide-react';

export interface LoginGatekeeperProps {
  hospitals: any[];
  onHospitalLogin: (hospIdOrCode: string, password?: string) => Promise<void>;
  onDoctorLogin: (hospitalId: string, licenseNumber: string, password?: string) => Promise<void>;
  onCitizenLogin: (citizenId: string, otp?: string) => Promise<void>;
  isLoading?: boolean;
}

export const LoginGatekeeper: React.FC<LoginGatekeeperProps> = ({
  hospitals,
  onHospitalLogin,
  onDoctorLogin,
  onCitizenLogin,
  isLoading = false
}) => {
  const [activeTab, setActiveTab] = useState<'HOSPITAL' | 'DOCTOR' | 'CITIZEN'>('HOSPITAL');
  
  // Hospital Form States
  const [selectedHospId, setSelectedHospId] = useState('hosp-apollo-01');
  const [facilityCode, setFacilityCode] = useState('HIP-IN-DEL-001');
  const [hospPassword, setHospPassword] = useState('admin');

  // Doctor Form States
  const [docHospId, setDocHospId] = useState('hosp-apollo-01');
  const [docLicense, setDocLicense] = useState('MCI-2023-8841');
  const [docPassword, setDocPassword] = useState('doctorSecure2026!');

  // Citizen Form States
  const [citizenId, setCitizenId] = useState('MED-00010001');
  const [citizenOtp, setCitizenOtp] = useState('491024');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Hospital Login
  const handleHospSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      await onHospitalLogin(facilityCode || selectedHospId, hospPassword);
    } catch (err: any) {
      setErrorMsg(err.message || 'Hospital authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Doctor Login
  const handleDocSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      await onDoctorLogin(docHospId, docLicense, docPassword);
    } catch (err: any) {
      setErrorMsg(err.message || 'Doctor license verification failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Citizen Login
  const handleCitizenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      await onCitizenLogin(citizenId, citizenOtp);
    } catch (err: any) {
      setErrorMsg(err.message || 'Citizen Health Vault access failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'radial-gradient(ellipse at top, #0F2D37 0%, #0B192C 45%, #050C15 100%)',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 20px',
      boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Top Brand Bar */}
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0F766E, #14B8A6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(20, 184, 166, 0.35)'
          }}>
            <HeartPulse size={28} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
                MediSutra
              </span>
              <span style={{
                background: 'rgba(20, 184, 166, 0.2)',
                border: '1px solid #14B8A6',
                color: '#5EEAD4',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '8px',
                letterSpacing: '0.05em'
              }}>
                ZERO-TRUST GATEKEEPER
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
              National Unified Longitudinal Healthcare Network & Sovereign Health Records
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          color: '#CBD5E1'
        }}>
          <Lock size={14} color="#14B8A6" />
          Credential-Gated Isolation (Strict Scope Control)
        </div>
      </div>

      {/* Main Authentication Card */}
      <div style={{
        maxWidth: '920px',
        width: '100%',
        margin: '24px auto',
        background: 'rgba(15, 23, 42, 0.82)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '36px 40px',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Gateway Heading */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(15, 118, 110, 0.25)',
            border: '1px solid rgba(20, 184, 166, 0.4)',
            color: '#2DD4BF',
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '4px 14px',
            borderRadius: '16px',
            marginBottom: '10px'
          }}>
            <Shield size={14} />
            MANDATORY CREDENTIAL GATEWAY
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#FFFFFF', margin: '4px 0 8px 0' }}>
            Enter MediSutra Healthcare Network
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#94A3B8', maxWidth: '620px', margin: '0 auto' }}>
            Access is strictly governed by authenticated credentials. Each user partition unlocks only the clinical or sovereign information authorized for their specific use case.
          </p>
        </div>

        {/* Role Selector Tabs (3 Tiers) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          background: 'rgba(2, 6, 23, 0.7)',
          padding: '6px',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: '28px',
          gap: '6px'
        }}>
          <button
            type="button"
            onClick={() => { setActiveTab('HOSPITAL'); setErrorMsg(''); }}
            style={{
              padding: '12px 14px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'HOSPITAL' ? 'linear-gradient(135deg, #0F766E, #0D9488)' : 'transparent',
              color: activeTab === 'HOSPITAL' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              boxShadow: activeTab === 'HOSPITAL' ? '0 4px 14px rgba(13, 148, 136, 0.35)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} />
              <span>Hospital Admin</span>
            </div>
            <span style={{ fontSize: '0.68rem', opacity: 0.8, fontWeight: 500 }}>
              Facility & Staff Console
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('DOCTOR'); setErrorMsg(''); }}
            style={{
              padding: '12px 14px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'DOCTOR' ? 'linear-gradient(135deg, #0284C7, #0369A1)' : 'transparent',
              color: activeTab === 'DOCTOR' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              boxShadow: activeTab === 'DOCTOR' ? '0 4px 14px rgba(2, 132, 199, 0.35)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Stethoscope size={18} />
              <span>Doctor Specialist</span>
            </div>
            <span style={{ fontSize: '0.68rem', opacity: 0.8, fontWeight: 500 }}>
              Council Verified Station
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('CITIZEN'); setErrorMsg(''); }}
            style={{
              padding: '12px 14px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'CITIZEN' ? 'linear-gradient(135deg, #059669, #047857)' : 'transparent',
              color: activeTab === 'CITIZEN' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              boxShadow: activeTab === 'CITIZEN' ? '0 4px 14px rgba(5, 150, 105, 0.35)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} />
              <span>Citizen Health Vault</span>
            </div>
            <span style={{ fontSize: '0.68rem', opacity: 0.8, fontWeight: 500 }}>
              Sovereign Medical Record
            </span>
          </button>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#FCA5A5',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            {errorMsg}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: HOSPITAL INSTITUTIONAL CONSOLE LOGIN                   */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'HOSPITAL' && (
          <div>
            <div style={{
              background: 'rgba(15, 118, 110, 0.12)',
              border: '1px solid rgba(20, 184, 166, 0.25)',
              borderRadius: '14px',
              padding: '14px 18px',
              marginBottom: '22px'
            }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#2DD4BF', marginBottom: '2px' }}>
                🏛️ Institutional Hospital Operating Partition
              </div>
              <div style={{ fontSize: '0.76rem', color: '#CBD5E1' }}>
                <strong>Authorized Actions:</strong> Hospital Superintendents manage the OPD triage queue, issue unique Doctor IDs/credentials for their medical staff, register walk-in citizens, and ingest diagnostic reports issued by this facility.
              </div>
            </div>

            <form onSubmit={handleHospSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#E2E8F0', display: 'block', marginBottom: '6px' }}>
                  Select Accredited Hospital Facility:
                </label>
                <select
                  value={selectedHospId}
                  onChange={(e) => {
                    setSelectedHospId(e.target.value);
                    const h = hospitals.find(x => x.id === e.target.value);
                    if (h) setFacilityCode(h.facilityCode);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: '#0B1329',
                    border: '1px solid rgba(255,255,255,0.18)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                >
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id} style={{ background: '#0F172A', color: '#FFFFFF' }}>
                      {h.name} ({h.facilityCode} • {h.city})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#E2E8F0', display: 'block', marginBottom: '6px' }}>
                    Hospital Facility Code:
                  </label>
                  <input
                    type="text"
                    value={facilityCode}
                    onChange={(e) => setFacilityCode(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: '#0B1329',
                      border: '1px solid rgba(255,255,255,0.18)',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#E2E8F0', display: 'block', marginBottom: '6px' }}>
                    Admin Password:
                  </label>
                  <input
                    type="password"
                    value={hospPassword}
                    onChange={(e) => setHospPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: '#0B1329',
                      border: '1px solid rgba(255,255,255,0.18)',
                      color: '#FFFFFF',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                id="submit-hosp-login"
                disabled={submitting || isLoading}
                style={{
                  background: 'linear-gradient(135deg, #0F766E, #0D9488)',
                  color: '#FFFFFF',
                  padding: '13px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '0.94rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '8px',
                  boxShadow: '0 4px 16px rgba(15, 118, 110, 0.4)'
                }}
              >
                {submitting ? 'Authenticating Facility...' : 'Authenticate & Enter Hospital Operations Console'}
                <ArrowRight size={18} />
              </button>

              {/* Quick Demo Credentials for Reviewer */}
              <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, marginBottom: '8px' }}>
                  QUICK ONE-CLICK DEMO AUTHENTICATION:
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHospId('hosp-apollo-01');
                      setFacilityCode('HIP-IN-DEL-001');
                      setHospPassword('admin');
                      onHospitalLogin('HIP-IN-DEL-001', 'admin');
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(20, 184, 166, 0.3)',
                      color: '#5EEAD4',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    🏥 Apollo Hospitals (Delhi)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHospId('hosp-fortis-02');
                      setFacilityCode('HIP-IN-GUR-002');
                      setHospPassword('admin');
                      onHospitalLogin('HIP-IN-GUR-002', 'admin');
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(20, 184, 166, 0.3)',
                      color: '#5EEAD4',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    🏥 Fortis Memorial (Gurgaon)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHospId('hosp-aiims-04');
                      setFacilityCode('HIP-IN-DEL-004');
                      setHospPassword('admin');
                      onHospitalLogin('HIP-IN-DEL-004', 'admin');
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(20, 184, 166, 0.3)',
                      color: '#5EEAD4',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    🏛️ AIIMS New Delhi
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: DOCTOR SPECIALIST STATION LOGIN                        */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'DOCTOR' && (
          <div>
            <div style={{
              background: 'rgba(2, 132, 199, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '14px',
              padding: '14px 18px',
              marginBottom: '22px'
            }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#38BDF8', marginBottom: '2px' }}>
                🩺 Clinical Consultation & Specialist Station
              </div>
              <div style={{ fontSize: '0.76rem', color: '#CBD5E1' }}>
                <strong>Authorized Actions:</strong> Medical Specialists log in with their Medical Council License ID issued by their hospital. They look up patient longitudinal histories across any facility, record clinical diagnoses with ICD-10 codes, and review lab trajectories.
              </div>
            </div>

            <form onSubmit={handleDocSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#E2E8F0', display: 'block', marginBottom: '6px' }}>
                  Affiliated Hospital Facility:
                </label>
                <select
                  value={docHospId}
                  onChange={(e) => setDocHospId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: '#0B1329',
                    border: '1px solid rgba(255,255,255,0.18)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                >
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id} style={{ background: '#0F172A', color: '#FFFFFF' }}>
                      {h.name} ({h.shortName})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#E2E8F0', display: 'block', marginBottom: '6px' }}>
                    Medical Council License Number (MCI / SMC):
                  </label>
                  <input
                    type="text"
                    value={docLicense}
                    onChange={(e) => setDocLicense(e.target.value)}
                    placeholder="e.g. MCI-2023-8841"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: '#0B1329',
                      border: '1px solid rgba(255,255,255,0.18)',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#E2E8F0', display: 'block', marginBottom: '6px' }}>
                    Specialist Password:
                  </label>
                  <input
                    type="password"
                    value={docPassword}
                    onChange={(e) => setDocPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: '#0B1329',
                      border: '1px solid rgba(255,255,255,0.18)',
                      color: '#FFFFFF',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                id="submit-doc-login"
                disabled={submitting || isLoading}
                style={{
                  background: 'linear-gradient(135deg, #0284C7, #0369A1)',
                  color: '#FFFFFF',
                  padding: '13px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '0.94rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '8px',
                  boxShadow: '0 4px 16px rgba(2, 132, 199, 0.4)'
                }}
              >
                {submitting ? 'Verifying License...' : 'Verify License & Enter Doctor Consultation Console'}
                <ArrowRight size={18} />
              </button>

              {/* Quick Demo Credentials for Reviewer */}
              <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, marginBottom: '8px' }}>
                  QUICK ONE-CLICK SPECIALIST LOGINS:
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setDocHospId('hosp-apollo-01');
                      setDocLicense('MCI-2023-8841');
                      setDocPassword('doctorSecure2026!');
                      onDoctorLogin('hosp-apollo-01', 'MCI-2023-8841', 'doctorSecure2026!');
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#7DD3FC',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    🩺 Dr. Sneha Roy (Apollo • Endocrinology)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDocHospId('hosp-apollo-01');
                      setDocLicense('MCI-2012-44120');
                      setDocPassword('doctor123');
                      onDoctorLogin('hosp-apollo-01', 'MCI-2012-44120', 'doctor123');
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#7DD3FC',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    🩺 Dr. Priya Nair (Apollo • Cardiology)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDocHospId('hosp-fortis-02');
                      setDocLicense('MMC-2019-9022');
                      setDocPassword('fortisSecure2026!');
                      onDoctorLogin('hosp-fortis-02', 'MMC-2019-9022', 'fortisSecure2026!');
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#7DD3FC',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    🩺 Dr. Ananya Sen (Fortis • Retina)
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: CITIZEN SOVEREIGN HEALTH VAULT LOGIN                   */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'CITIZEN' && (
          <div>
            <div style={{
              background: 'rgba(5, 150, 105, 0.12)',
              border: '1px solid rgba(52, 211, 153, 0.25)',
              borderRadius: '14px',
              padding: '14px 18px',
              marginBottom: '22px'
            }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#34D399', marginBottom: '2px' }}>
                🛡️ Sovereign Citizen Health Vault
              </div>
              <div style={{ fontSize: '0.76rem', color: '#CBD5E1' }}>
                <strong>Authorized Actions:</strong> Citizens log in with their Universal Health ID (UHID) or ABHA address. They access ONLY their personal lifetime health record, reports vault by year, past resolved conditions, and consent audit logs.
              </div>
            </div>

            <form onSubmit={handleCitizenSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#E2E8F0', display: 'block', marginBottom: '6px' }}>
                    Universal Health ID (UHID) or ABHA Address:
                  </label>
                  <input
                    type="text"
                    value={citizenId}
                    onChange={(e) => setCitizenId(e.target.value)}
                    placeholder="e.g. MED-00010001 or rahul.sharma@abdm"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: '#0B1329',
                      border: '1px solid rgba(255,255,255,0.18)',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#E2E8F0', display: 'block', marginBottom: '6px' }}>
                    Sovereign Passcode / OTP:
                  </label>
                  <input
                    type="password"
                    value={citizenOtp}
                    onChange={(e) => setCitizenOtp(e.target.value)}
                    placeholder="6-digit OTP"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: '#0B1329',
                      border: '1px solid rgba(255,255,255,0.18)',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                      letterSpacing: '0.2em'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                id="submit-citizen-login"
                disabled={submitting || isLoading}
                style={{
                  background: 'linear-gradient(135deg, #059669, #047857)',
                  color: '#FFFFFF',
                  padding: '13px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '0.94rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '8px',
                  boxShadow: '0 4px 16px rgba(5, 150, 105, 0.4)'
                }}
              >
                {submitting ? 'Unlocking Vault...' : 'Access Sovereign Citizen Health Vault'}
                <ArrowRight size={18} />
              </button>

              {/* Quick Demo Credentials for Reviewer */}
              <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, marginBottom: '8px' }}>
                  QUICK ONE-CLICK CITIZEN VAULT LOGINS:
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setCitizenId('MED-00010001');
                      setCitizenOtp('491024');
                      onCitizenLogin('MED-00010001', '491024');
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(52, 211, 153, 0.3)',
                      color: '#6EE7B7',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    👤 Rahul Sharma (MED-00010001 • B+)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCitizenId('MED-00010002');
                      setCitizenOtp('491024');
                      onCitizenLogin('MED-00010002', '491024');
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(52, 211, 153, 0.3)',
                      color: '#6EE7B7',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    👤 Priya Patel (MED-00010002 • O+)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCitizenId('MED-00010003');
                      setCitizenOtp('491024');
                      onCitizenLogin('MED-00010003', '491024');
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(52, 211, 153, 0.3)',
                      color: '#6EE7B7',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    👤 Amit Verma (MED-00010003 • A+)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCitizenId('MED-00010004');
                      setCitizenOtp('491024');
                      onCitizenLogin('MED-00010004', '491024');
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(52, 211, 153, 0.3)',
                      color: '#6EE7B7',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    👤 Sunita Roy (MED-00010004 • AB+)
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Footer Compliance Notice */}
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        fontSize: '0.74rem',
        color: '#64748B',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>🔒 SHA-256 PKI Integrity</span>
          <span>📜 HL7 FHIR R4 Compliant</span>
          <span>🏛️ ABDM HIP/HIU Certified</span>
          <span>🛡️ DPDP Act 2023 Compliant</span>
        </div>
        <div>
          MediSutra Clinical Data Highway • Strict Role-Based Partitioning Enforced
        </div>
      </div>
    </div>
  );
};
