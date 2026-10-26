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
  QrCode,
  Cpu
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
  onOpenArchitectureStudio?: () => void;
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
  timelineEventsCount,
  onOpenArchitectureStudio
}) => {
  const isHospital = authSession.role === 'HOSPITAL_ADMIN';
  const isDoctor = authSession.role === 'DOCTOR';

  const roleLabel = isHospital
    ? 'HOSPITAL CONSOLE'
    : isDoctor
    ? 'DOCTOR STATION'
    : 'SOVEREIGN HEALTH VAULT';

  return (
    <header className="medisutra-header">
      <div className="container header-inner">
        {/* Zone 1: Brand & Logo with quiet role indicator */}
        <div className="header-brand">
          <div className="brand-icon-box">
            <HeartPulse size={24} />
          </div>
          <div>
            <div className="brand-title-wrap">
              <span className="brand-name">MediSutra</span>
              <span className="brand-role-quiet">{roleLabel}</span>
            </div>
            <p className="brand-tagline">
              One Person. One Health Identity. One Complete Health Journey.
            </p>
          </div>
        </div>

        {/* Zone 3: Scoped Profile & Primary Actions */}
        <div className="header-actions-zone">
          {/* Scoped Profile Chip */}
          <div className="profile-chip">
            <div
              className={`profile-chip-avatar ${
                isHospital ? 'avatar-hospital' : isDoctor ? 'avatar-doctor' : 'avatar-citizen'
              }`}
            >
              {isHospital ? <Building2 size={18} /> : isDoctor ? <Stethoscope size={18} /> : <Shield size={18} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="profile-chip-name">
                  {isHospital
                    ? authSession.hospital?.name || 'Apollo Hospitals'
                    : isDoctor
                    ? authSession.doctor?.name || 'Dr. Sneha Roy'
                    : authSession.citizen?.fullName || 'Rahul Sharma'}
                </span>
                <span
                  className={`profile-chip-badge ${
                    isHospital ? 'badge-scope-hospital' : isDoctor ? 'badge-scope-doctor' : 'badge-scope-citizen'
                  }`}
                >
                  {isHospital ? 'HOSPITAL ADMIN' : isDoctor ? 'ATTENDING SPECIALIST' : 'SOVEREIGN PATIENT'}
                </span>
              </div>
              <div className="profile-chip-meta">
                {isHospital
                  ? `Facility Code: ${authSession.hospital?.facilityCode || 'HIP-IN-DEL-001'} · ${authSession.hospital?.city || 'Delhi NCR'}`
                  : isDoctor
                  ? `${authSession.doctor?.specialization || 'Endocrinologist'} · Lic: ${authSession.doctor?.licenseNumber || 'MCI-2023-8841'} · ${authSession.hospital?.shortName || 'Apollo'}`
                  : `UHID: ${authSession.citizen?.healthId || 'MED-00010001'} · Sovereign Health Record Vault`}
              </div>
            </div>
          </div>

          {/* Architecture Audit Command Center Trigger */}
          {onOpenArchitectureStudio && (
            <button
              id="open-arch-command-center-btn"
              type="button"
              className="btn-action-arch"
              onClick={onOpenArchitectureStudio}
              title="Launch Senior Staff Architectural & Codebase Audit Studio"
            >
              <Cpu size={15} />
              Architecture Studio
            </button>
          )}

          {/* Switch Role Button */}
          <button
            id="switch-role-btn"
            type="button"
            className="btn-action-switch"
            onClick={onOpenLoginModal}
          >
            <KeyRound size={14} />
            Switch Role
          </button>

          {/* Lock Session / Logout Button */}
          <button
            id="lock-session-logout-btn"
            type="button"
            className="btn-action-logout"
            onClick={onLogout}
          >
            <Lock size={14} />
            Lock & Logout
          </button>
        </div>
      </div>

      {/* Zone 2: Navigation Links (Clean single-line links with subtle active underline) */}
      <div className="header-nav-bar">
        <div className="container nav-links-track">
          {isHospital ? [
            { id: 'queue', label: `📥 Onboard Patients & OPD Queue (${hospitalDashboardData?.opdQueue?.length || 4})`, icon: Users },
            { id: 'doctors', label: `👨‍⚕️ Hospital Doctors Roster (${hospitalDashboardData?.stats?.activeDoctorsCount || 2})`, icon: Stethoscope }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = hospitalActiveSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeHospitalSubTab(tab.id)}
                className={`nav-link-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          }) : isDoctor ? [
            { id: 'dossier', label: '🩺 Assigned Patients & Clinical Dossier', icon: FolderArchive }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = hospitalActiveSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeHospitalSubTab(tab.id)}
                className={`nav-link-btn ${isActive ? 'active-blue' : ''}`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          }) : [
            { id: 'timeline', label: `🕒 All Lifetime Health Activities (${digiLockerData?.recentTimeline?.length || timelineEventsCount || 0})`, icon: Clock },
            { id: 'lifetime-diseases', label: `🩺 Lifetime Diseases (${(digiLockerData?.lifetimeDiseases?.active?.length || 0) + (digiLockerData?.lifetimeDiseases?.resolved?.length || 0)})`, icon: History },
            { id: 'issued-docs', label: `📁 All Previous Records & Reports (${digiLockerData?.stats?.totalIssuedDocuments || 14})`, icon: FileText },
            { id: 'card', label: '🪪 Digital ABHA Health Card', icon: QrCode }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = digiLockerSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeDigiLockerSubTab(tab.id)}
                className={`nav-link-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
