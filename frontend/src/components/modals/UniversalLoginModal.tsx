import React from 'react';
import { X, Building2, Stethoscope, Shield } from 'lucide-react';

interface UniversalLoginModalProps {
  isOpen: boolean;
  loginRoleTab: 'HOSPITAL' | 'DOCTOR' | 'CITIZEN';
  setLoginRoleTab: (tab: 'HOSPITAL' | 'DOCTOR' | 'CITIZEN') => void;
  loginSuccessNotice: string;
  selectedHospitalId: string;
  setSelectedHospitalId: (id: string) => void;
  hospitals: any[];
  handleHospitalLogin: (facilityCode?: string) => void;
  loginDoctorLicense: string;
  setLoginDoctorLicense: (license: string) => void;
  selectedHospitalDoctor: string;
  setSelectedHospitalDoctor: (docName: string) => void;
  handleDoctorLogin: () => void;
  loginCitizenIdentifier: string;
  setLoginCitizenIdentifier: (id: string) => void;
  loginCitizenOtp: string;
  setLoginCitizenOtp: (otp: string) => void;
  loginCitizenError: string;
  setLoginCitizenError: (err: string) => void;
  handleCitizenLogin: (id: string, otp: string) => void;
  onClose: () => void;
}

export const UniversalLoginModal: React.FC<UniversalLoginModalProps> = ({
  isOpen,
  loginRoleTab,
  setLoginRoleTab,
  loginSuccessNotice,
  selectedHospitalId,
  setSelectedHospitalId,
  hospitals,
  handleHospitalLogin,
  loginDoctorLicense,
  setLoginDoctorLicense,
  selectedHospitalDoctor,
  setSelectedHospitalDoctor,
  handleDoctorLogin,
  loginCitizenIdentifier,
  setLoginCitizenIdentifier,
  loginCitizenOtp,
  setLoginCitizenOtp,
  loginCitizenError,
  setLoginCitizenError,
  handleCitizenLogin,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
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
        zIndex: 100,
        padding: '20px'
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '660px',
          padding: '30px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.25)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <span className="badge badge-teal" style={{ fontSize: '0.72rem', marginBottom: '6px' }}>
              CENTRAL AUTHENTICATION HIGHWAY
            </span>
            <h2 style={{ fontSize: '1.45rem', color: '#0F172A', marginTop: '2px' }}>
              MediSutra Healthcare Login Gateway
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
              Select your role to access hospital operational consoles, physician stations, or citizen DigiLockers.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            background: '#F1F5F9',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '22px',
            gap: '4px'
          }}
        >
          <button
            type="button"
            onClick={() => setLoginRoleTab('HOSPITAL')}
            style={{
              padding: '9px 12px',
              borderRadius: '10px',
              fontSize: '0.84rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: loginRoleTab === 'HOSPITAL' ? '#0F766E' : 'transparent',
              color: loginRoleTab === 'HOSPITAL' ? '#FFFFFF' : '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Building2 size={16} />
            Hospital Admin
          </button>
          <button
            type="button"
            onClick={() => setLoginRoleTab('DOCTOR')}
            style={{
              padding: '9px 12px',
              borderRadius: '10px',
              fontSize: '0.84rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: loginRoleTab === 'DOCTOR' ? '#0284C7' : 'transparent',
              color: loginRoleTab === 'DOCTOR' ? '#FFFFFF' : '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Stethoscope size={16} />
            Doctor Specialist
          </button>
          <button
            type="button"
            onClick={() => setLoginRoleTab('CITIZEN')}
            style={{
              padding: '9px 12px',
              borderRadius: '10px',
              fontSize: '0.84rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: loginRoleTab === 'CITIZEN' ? '#059669' : 'transparent',
              color: loginRoleTab === 'CITIZEN' ? '#FFFFFF' : '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Shield size={16} />
            Citizen DigiLocker
          </button>
        </div>

        {loginSuccessNotice && (
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '12px 16px', borderRadius: '10px', fontSize: '0.88rem', marginBottom: '18px', fontWeight: 700 }}>
            ✓ {loginSuccessNotice}
          </div>
        )}

        {/* TAB 1: HOSPITAL INSTITUTIONAL LOGIN */}
        {loginRoleTab === 'HOSPITAL' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#F0FDFA', border: '1px solid #CCFBF1', padding: '14px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F766E', marginBottom: '4px' }}>
                🏛️ Institutional Hospital Operating Session
              </div>
              <div style={{ fontSize: '0.78rem', color: '#334155' }}>
                Authenticates the Hospital Superintendent or Admin. Allows creating Doctor IDs, managing the live OPD walk-in queue, and submitting clinical lab reports.
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                Select Hospital Facility:
              </label>
              <select
                value={selectedHospitalId}
                onChange={(e) => {
                  setSelectedHospitalId(e.target.value);
                }}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 600 }}
              >
                {hospitals.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.facilityCode}) • {h.tier}
                  </option>
                ))}
              </select>
            </div>

            {/* 1-Click Fast Hospital Access Badges */}
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '6px' }}>
                QUICK SWITCH DEMO HOSPITAL:
              </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {hospitals.map(h => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => handleHospitalLogin(h.facilityCode)}
                    style={{
                      background: selectedHospitalId === h.id ? '#0F766E' : '#F8FAFC',
                      color: selectedHospitalId === h.id ? '#FFFFFF' : '#334155',
                      border: '1px solid #CBD5E1',
                      padding: '5px 10px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {h.shortName}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleHospitalLogin()}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.92rem', marginTop: '6px' }}
            >
              Authenticate Hospital Console →
            </button>
          </div>
        )}

        {/* TAB 2: DOCTOR SPECIALIST LOGIN */}
        {loginRoleTab === 'DOCTOR' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '14px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0284C7', marginBottom: '4px' }}>
                🩺 Doctor Clinical Station Authentication
              </div>
              <div style={{ fontSize: '0.78rem', color: '#334155' }}>
                Log in using the Doctor ID issued by your hospital. Pull patient cross-hospital dossiers, review past diseases, and submit encounter notes.
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                Hospital Affiliation:
              </label>
              <select
                value={selectedHospitalId}
                onChange={(e) => {
                  setSelectedHospitalId(e.target.value);
                  const h = hospitals.find(x => x.id === e.target.value);
                  if (h && h.activeDoctors?.length > 0) {
                    setLoginDoctorLicense(h.activeDoctors[0].licenseNumber);
                    setSelectedHospitalDoctor(h.activeDoctors[0].name);
                  }
                }}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
              >
                {hospitals.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                Doctor Account / License:
              </label>
              <select
                value={loginDoctorLicense}
                onChange={(e) => {
                  setLoginDoctorLicense(e.target.value);
                  const activeHosp = hospitals.find(h => h.id === selectedHospitalId);
                  const doc = activeHosp?.activeDoctors?.find((d: any) => d.licenseNumber === e.target.value);
                  if (doc) setSelectedHospitalDoctor(doc.name);
                }}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 600 }}
              >
                {(hospitals.find(h => h.id === selectedHospitalId)?.activeDoctors || []).map((doc: any) => (
                  <option key={doc.id} value={doc.licenseNumber}>
                    {doc.name} ({doc.specialization}) • {doc.licenseNumber}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => handleDoctorLogin()}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.92rem',
                background: '#0284C7',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Access Physician Station as {selectedHospitalDoctor} →
            </button>
          </div>
        )}

        {/* TAB 3: CITIZEN DIGILOCKER LOGIN */}
        {loginRoleTab === 'CITIZEN' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCitizenLogin(loginCitizenIdentifier, loginCitizenOtp);
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '14px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#059669', marginBottom: '4px' }}>
                🛡️ Secure Sovereign Citizen Health Vault
              </div>
              <div style={{ fontSize: '0.78rem', color: '#334155' }}>
                Access your personal longitudinal health record using your confidential Unique Health ID (UHID) and verified passcode/OTP.
              </div>
            </div>

            {loginCitizenError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #F87171', color: '#DC2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600 }}>
                ⚠️ {loginCitizenError}
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                Universal Health ID (UHID / ABHA):
              </label>
              <input
                type="text"
                required
                value={loginCitizenIdentifier}
                onChange={(e) => {
                  setLoginCitizenIdentifier(e.target.value);
                  setLoginCitizenError('');
                }}
                placeholder="e.g. MED-00010001"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 600, fontFamily: 'monospace' }}
              />
              <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                Account Isolation: Every citizen possesses a distinct health ID (e.g. MED-00010001 for Rahul Sharma, MED-00010002 for Priya Patel).
              </span>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                Citizen Passcode / OTP:
              </label>
              <input
                type="password"
                required
                value={loginCitizenOtp}
                onChange={(e) => {
                  setLoginCitizenOtp(e.target.value);
                  setLoginCitizenError('');
                }}
                placeholder="Enter 6-digit OTP / PIN"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.15em' }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.92rem',
                background: '#059669',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Verify Credentials & Unlock Vault →
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
