import React from 'react';
import {
  HeartPulse,
  Building2,
  Stethoscope,
  Shield,
  KeyRound,
  Lock,
  Users,
  FolderArchive,
  Clock,
  History,
  FileText,
  QrCode
} from 'lucide-react';
import type { AuthSession } from '../../types';

interface HeaderProps {
  authSession: AuthSession;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  hospitalActiveSubTab: string;
  onChangeHospitalSubTab: (tab: any) => void;
  hospitalDashboardData: any;
  digiLockerSubTab: string;
  onChangeDigiLockerSubTab: (tab: any) => void;
  digiLockerData: any;
  timelineEventsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  authSession,
  onOpenLoginModal,
  onLogout,
  hospitalActiveSubTab,
  onChangeHospitalSubTab,
  hospitalDashboardData,
  digiLockerSubTab,
  onChangeDigiLockerSubTab,
  digiLockerData,
  timelineEventsCount
}) => {
  return (
    <header style={{
      background: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '74px' }}>
        {/* Logo & Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0F766E, #0D9488)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 10px rgba(13, 148, 136, 0.25)'
          }}>
            <HeartPulse size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em' }}>
                MediSutra
              </span>
              <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                {authSession.role === 'HOSPITAL_ADMIN' ? 'HOSPITAL CONSOLE' : authSession.role === 'DOCTOR' ? 'CLINICAL SPECIALIST STATION' : 'SOVEREIGN HEALTH VAULT'}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
              One Person. One Health Identity. One Complete Health Journey.
            </p>
          </div>
        </div>

        {/* Authenticated Identity Scope & Lock Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Scoped Profile Chip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: '#F8FAFC',
            border: '1.5px solid #E2E8F0',
            padding: '6px 16px',
            borderRadius: '14px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: authSession.role === 'HOSPITAL_ADMIN' ? 'linear-gradient(135deg, #0F766E, #0D9488)' : authSession.role === 'DOCTOR' ? 'linear-gradient(135deg, #0284C7, #0369A1)' : 'linear-gradient(135deg, #059669, #047857)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.9rem'
            }}>
              {authSession.role === 'HOSPITAL_ADMIN' ? <Building2 size={18} /> : authSession.role === 'DOCTOR' ? <Stethoscope size={18} /> : <Shield size={18} />}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                  {authSession.role === 'HOSPITAL_ADMIN'
                    ? (authSession.hospital?.name || 'Apollo Hospitals')
                    : authSession.role === 'DOCTOR'
                    ? (authSession.doctor?.name || 'Dr. Sneha Roy')
                    : (authSession.citizen?.fullName || 'Rahul Sharma')}
                </span>
                <span style={{
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '8px',
                  background: authSession.role === 'HOSPITAL_ADMIN' ? '#E0F2FE' : authSession.role === 'DOCTOR' ? '#E0F2FE' : '#DCFCE7',
                  color: authSession.role === 'HOSPITAL_ADMIN' ? '#0369A1' : authSession.role === 'DOCTOR' ? '#0369A1' : '#15803D'
                }}>
                  {authSession.role === 'HOSPITAL_ADMIN' ? 'HOSPITAL ADMIN' : authSession.role === 'DOCTOR' ? 'ATTENDING SPECIALIST' : 'SOVEREIGN PATIENT'}
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
                {authSession.role === 'HOSPITAL_ADMIN'
                  ? `Facility Code: ${authSession.hospital?.facilityCode || 'HIP-IN-DEL-001'} • ${authSession.hospital?.city || 'Delhi NCR'}`
                  : authSession.role === 'DOCTOR'
                  ? `${authSession.doctor?.specialization || 'Endocrinologist'} • Council Lic: ${authSession.doctor?.licenseNumber || 'MCI-2023-8841'} • ${authSession.hospital?.shortName || 'Apollo'}`
                  : `UHID: ${authSession.citizen?.healthId || 'MED-00010001'} • Sovereign Health Record Vault`}
              </div>
            </div>
          </div>

          {/* Switch Role Button */}
          <button
            id="switch-role-btn"
            onClick={onOpenLoginModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              color: '#475569',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <KeyRound size={14} />
            Switch Role
          </button>

          {/* Lock Session / Logout Button */}
          <button
            id="lock-session-logout-btn"
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#FEF2F2',
              border: '1.5px solid #F87171',
              color: '#B91C1C',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.15)'
            }}
          >
            <Lock size={14} />
            Lock & Logout
          </button>
        </div>
      </div>

      {/* Contextual Navigation Tabs Bar (Scoped to Authenticated Role) */}
      <div style={{ background: '#FFFFFF', borderTop: '1px solid #F1F5F9' }}>
        <div className="container" style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '6px 24px' }}>
          {authSession.role === 'HOSPITAL_ADMIN' ? [
            { id: 'queue', label: `📥 Onboard Patients & OPD Queue (${hospitalDashboardData?.opdQueue?.length || 4})`, icon: Users },
            { id: 'doctors', label: `👨‍⚕️ Hospital Doctors Roster (${hospitalDashboardData?.stats?.activeDoctorsCount || 2})`, icon: Stethoscope }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = hospitalActiveSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeHospitalSubTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#0F766E' : '#475569',
                  background: isActive ? '#F0FDFA' : 'transparent',
                  borderBottom: isActive ? '2px solid #0F766E' : '2px solid transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={17} color={isActive ? '#0F766E' : '#64748B'} />
                {tab.label}
              </button>
            );
          }) : authSession.role === 'DOCTOR' ? [
            { id: 'dossier', label: '🩺 Assigned Patients & Clinical Dossier', icon: FolderArchive }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = hospitalActiveSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeHospitalSubTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#0284C7' : '#475569',
                  background: isActive ? '#F0F9FF' : 'transparent',
                  borderBottom: isActive ? '2px solid #0284C7' : '2px solid transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={17} color={isActive ? '#0284C7' : '#64748B'} />
                {tab.label}
              </button>
            );
          }) : [
            { id: 'timeline', label: `🕒 All Lifetime Health Activities (${(digiLockerData?.recentTimeline?.length || timelineEventsCount || 0)})`, icon: Clock },
            { id: 'lifetime-diseases', label: `🩺 Lifetime Diseases (${(digiLockerData?.lifetimeDiseases?.active?.length || 0) + (digiLockerData?.lifetimeDiseases?.resolved?.length || 0)})`, icon: History },
            { id: 'issued-docs', label: `📁 All Previous Records & Reports (${digiLockerData?.stats?.totalIssuedDocuments || 14})`, icon: FileText },
            { id: 'card', label: '🪪 Digital ABHA Health Card', icon: QrCode }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = digiLockerSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeDigiLockerSubTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#0F766E' : '#475569',
                  background: isActive ? '#F0FDFA' : 'transparent',
                  borderBottom: isActive ? '2px solid #0F766E' : '2px solid transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={17} color={isActive ? '#0F766E' : '#64748B'} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
