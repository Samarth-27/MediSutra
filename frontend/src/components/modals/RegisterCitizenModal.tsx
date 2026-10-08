import React from 'react';
import { X, Building2 } from 'lucide-react';

interface RegisterCitizenModalProps {
  isOpen: boolean;
  regSuccessMsg: string;
  regFullName: string;
  setRegFullName: (val: string) => void;
  regBloodGroup: string;
  setRegBloodGroup: (val: string) => void;
  regDob: string;
  setRegDob: (val: string) => void;
  regGender: string;
  setRegGender: (val: string) => void;
  regAllergies: string;
  setRegAllergies: (val: string) => void;
  regEmergencyName: string;
  setRegEmergencyName: (val: string) => void;
  regEmergencyPhone: string;
  setRegEmergencyPhone: (val: string) => void;
  regFamilial: string;
  setRegFamilial: (val: string) => void;
  isRegisteringCitizen: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const RegisterCitizenModal: React.FC<RegisterCitizenModalProps> = ({
  isOpen,
  regSuccessMsg,
  regFullName,
  setRegFullName,
  regBloodGroup,
  setRegBloodGroup,
  regDob,
  setRegDob,
  regGender,
  setRegGender,
  regAllergies,
  setRegAllergies,
  regEmergencyName,
  setRegEmergencyName,
  regEmergencyPhone,
  setRegEmergencyPhone,
  regFamilial,
  setRegFamilial,
  isRegisteringCitizen,
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
      <div className="card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F0FDFA', color: '#0F766E', padding: '4px 10px', borderRadius: '14px', fontSize: '0.74rem', fontWeight: 800, marginBottom: '6px' }}>
              <Building2 size={13} />
              CENTRAL CITIZEN ENROLLMENT
            </div>
            <h3 style={{ fontSize: '1.35rem', color: '#0F172A' }}>
              Enroll New Citizen into Human Report Center
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '2px' }}>
              Generates permanent nationwide Universal Health ID (UHID) compatible with Ayushman Bharat (ABDM).
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

        {regSuccessMsg && (
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '12px 16px', borderRadius: '10px', color: '#065F46', fontSize: '0.88rem', fontWeight: 700, marginBottom: '16px' }}>
            ✓ {regSuccessMsg}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sunil Chawla"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                Blood Group *
              </label>
              <select
                value={regBloodGroup}
                onChange={(e) => setRegBloodGroup(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={regDob}
                onChange={(e) => setRegDob(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                Gender *
              </label>
              <select
                value={regGender}
                onChange={(e) => setRegGender(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
              Known Allergies (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Penicillin, Peanuts, Sulfa"
              value={regAllergies}
              onChange={(e) => setRegAllergies(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                Emergency Contact Name
              </label>
              <input
                type="text"
                placeholder="e.g. Pooja Chawla"
                value={regEmergencyName}
                onChange={(e) => setRegEmergencyName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                Emergency Phone
              </label>
              <input
                type="text"
                placeholder="+91-9876543210"
                value={regEmergencyPhone}
                onChange={(e) => setRegEmergencyPhone(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
              Familial Genetic Risk Factors
            </label>
            <input
              type="text"
              placeholder="e.g. Maternal Type 2 Diabetes, Paternal Coronary Artery Disease"
              value={regFamilial}
              onChange={(e) => setRegFamilial(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isRegisteringCitizen} className="btn-primary">
              {isRegisteringCitizen ? 'Enrolling Citizen...' : 'Register Citizen & Generate UHID'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
