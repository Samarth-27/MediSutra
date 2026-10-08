import React from 'react';
import { X, Users } from 'lucide-react';

interface ProvisionDoctorModalProps {
  isOpen: boolean;
  createDocSuccessMsg: string;
  hospitalName: string;
  departments: string[];
  newDocName: string;
  setNewDocName: (val: string) => void;
  newDocLicense: string;
  setNewDocLicense: (val: string) => void;
  newDocQualification: string;
  setNewDocQualification: (val: string) => void;
  newDocDepartment: string;
  setNewDocDepartment: (val: string) => void;
  newDocSpecialization: string;
  setNewDocSpecialization: (val: string) => void;
  newDocPassword: string;
  setNewDocPassword: (val: string) => void;
  isSubmittingDoctor: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const ProvisionDoctorModal: React.FC<ProvisionDoctorModalProps> = ({
  isOpen,
  createDocSuccessMsg,
  hospitalName,
  departments = [],
  newDocName,
  setNewDocName,
  newDocLicense,
  setNewDocLicense,
  newDocQualification,
  setNewDocQualification,
  newDocDepartment,
  setNewDocDepartment,
  newDocSpecialization,
  setNewDocSpecialization,
  newDocPassword,
  setNewDocPassword,
  isSubmittingDoctor,
  onSubmit,
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
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
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
          borderRadius: '18px',
          width: '100%',
          maxWidth: '620px',
          padding: '28px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#E0F2FE', color: '#0369A1', padding: '4px 10px', borderRadius: '12px', fontSize: '0.74rem', fontWeight: 700, marginBottom: '6px' }}>
              <Users size={14} />
              HOSPITAL ADMINISTRATIVE ACTION
            </div>
            <h3 style={{ fontSize: '1.3rem', color: '#0F172A' }}>
              Provision Doctor ID & Issue Access Credentials
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
              Issued by: <strong>{hospitalName}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}
          >
            <X size={22} />
          </button>
        </div>

        {createDocSuccessMsg && (
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '12px', borderRadius: '10px', fontSize: '0.88rem', marginBottom: '16px', fontWeight: 600 }}>
            ✓ {createDocSuccessMsg}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
              Doctor Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Dr. Sanjeev Kapoor"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                MCI / SMC Registration License *
              </label>
              <input
                type="text"
                placeholder="e.g. MCI-2018-99214"
                value={newDocLicense}
                onChange={(e) => setNewDocLicense(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontFamily: 'monospace' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                Medical Qualification
              </label>
              <input
                type="text"
                placeholder="e.g. MBBS, MD, DM"
                value={newDocQualification}
                onChange={(e) => setNewDocQualification(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                Department
              </label>
              <select
                value={newDocDepartment}
                onChange={(e) => setNewDocDepartment(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              >
                {(departments.length > 0 ? departments : ['Internal Medicine', 'Cardiology', 'Endocrinology', 'Pathology']).map((d: string) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                Clinical Specialization
              </label>
              <input
                type="text"
                placeholder="e.g. Interventional Cardiology & Heart Failure"
                value={newDocSpecialization}
                onChange={(e) => setNewDocSpecialization(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
              Initial Doctor Login Password
            </label>
            <input
              type="password"
              value={newDocPassword}
              onChange={(e) => setNewDocPassword(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', fontSize: '0.78rem', color: '#64748B', lineHeight: '1.5' }}>
            ℹ️ <strong>Authority Guarantee:</strong> Once created, this specialist can log in, pull cross-hospital patient DigiLocker records, chronicle disease diagnoses, and issue certified laboratory reports under this hospital.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmittingDoctor} className="btn-primary">
              {isSubmittingDoctor ? 'Issuing Doctor ID...' : 'Issue Doctor ID & Authorize Access'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
