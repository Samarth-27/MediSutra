import React from 'react';
import {
  Stethoscope,
  FolderArchive,
  Users
} from 'lucide-react';
import type { AuthSession } from '../../types';
import { DoctorAiCopilot } from './DoctorAiCopilot';
import { LifetimeDiseasesSection } from './LifetimeDiseasesSection';
import { ReportsVaultSection } from './ReportsVaultSection';

interface DoctorStationProps {
  authSession: AuthSession;
  hospitalRegistry: any[];
  selectedDoctorPatientId: string;
  handleSelectDoctorPatient: (patientId: string) => void;
  doctorDossier: any;
  setDiagnosisModalOpen: (open: boolean) => void;
  setIssueReportModalOpen: (open: boolean) => void;

  // AI Copilot props
  isAiChatExpanded: boolean;
  setIsAiChatExpanded: (expanded: boolean) => void;
  doctorAiQuery: string;
  setDoctorAiQuery: (query: string) => void;
  doctorAiLoading: boolean;
  doctorAiResponse: any;
  setDoctorAiResponse: (res: any) => void;
  copiedAiToNote: boolean;
  handleDoctorAiAnalyze: (overrideQuery?: string) => Promise<void>;
  handleCopyAiToConsultationNote: () => void;

  // Condition actions
  onEditCondition: (condition: any) => void;
  onCureCondition: (condition: any) => void;
  onReopenCondition: (conditionId: string) => void;
  onInspectReport: (report: any) => void;

  // Reports Vault filters
  reportSearchQuery: string;
  setReportSearchQuery: (query: string) => void;
  selectedYearFilter: string;
  setSelectedYearFilter: (year: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (category: string) => void;

  // Notes Form
  newDoctorNote: string;
  setNewDoctorNote: (note: string) => void;
  isSubmittingNote: boolean;
  handleAddDoctorNote: (e: React.FormEvent) => void;
}

export const DoctorStation: React.FC<DoctorStationProps> = ({
  authSession,
  hospitalRegistry,
  selectedDoctorPatientId,
  handleSelectDoctorPatient,
  doctorDossier,
  setDiagnosisModalOpen,
  setIssueReportModalOpen,
  isAiChatExpanded,
  setIsAiChatExpanded,
  doctorAiQuery,
  setDoctorAiQuery,
  doctorAiLoading,
  doctorAiResponse,
  setDoctorAiResponse,
  copiedAiToNote,
  handleDoctorAiAnalyze,
  handleCopyAiToConsultationNote,
  onEditCondition,
  onCureCondition,
  onReopenCondition,
  onInspectReport,
  reportSearchQuery,
  setReportSearchQuery,
  selectedYearFilter,
  setSelectedYearFilter,
  selectedCategoryFilter,
  setSelectedCategoryFilter,
  newDoctorNote,
  setNewDoctorNote,
  isSubmittingNote,
  handleAddDoctorNote
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Doctor Specialist Scope Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
          border: '1.5px solid #0284C7',
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
              background: '#0284C7',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Stethoscope size={22} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#0369A1',
                letterSpacing: '0.04em'
              }}
            >
              AUTHENTICATED SPECIALIST CLINICAL STATION
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
              {authSession.doctor?.name || 'Dr. Sneha Roy'} ({authSession.doctor?.qualification || 'MBBS, MD'})
            </div>
            <div style={{ fontSize: '0.78rem', color: '#475569' }}>
              Specialization: {authSession.doctor?.specialization || 'Endocrinology'} • License: {authSession.doctor?.licenseNumber || 'MCI-2023-8841'} • Hospital: {authSession.hospital?.name || 'Apollo Hospitals & Heart Institute'}
            </div>
          </div>
        </div>

        {/* Doctor Clinical Actions */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setDiagnosisModalOpen(true)}
            className="btn-primary"
            style={{ background: '#F59E0B', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Stethoscope size={15} />
            + Record Disease Encounter
          </button>
          <button
            type="button"
            onClick={() => setIssueReportModalOpen(true)}
            className="btn-primary"
            style={{ background: '#0284C7', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FolderArchive size={15} />
            + Issue Diagnostic Lab Report
          </button>
        </div>
      </div>

      {/* Patient Selector / Assigned Roster Bar */}
      <div className="card" style={{ padding: '16px 20px', background: '#FFFFFF', border: '1.5px solid #CBD5E1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} color="#0284C7" />
              ASSIGNED PATIENTS ROSTER (Select patient to inspect lifetime dossier):
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
              Patients onboarded to this doctor with their complete cross-hospital medical history throughout their lifespan.
            </p>
          </div>

          {/* Patient Switcher Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {hospitalRegistry.map(p => {
              const isSelected = selectedDoctorPatientId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectDoctorPatient(p.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #0284C7' : '1px solid #CBD5E1',
                    background: isSelected ? '#E0F2FE' : '#FFFFFF',
                    color: isSelected ? '#0369A1' : '#334155',
                    fontWeight: isSelected ? 800 : 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  👤 {p.fullName} <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>({p.healthId})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Patient Longitudinal Clinical Dossier */}
      {doctorDossier && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* FRONT CHATBOT: DOCTOR CLINICAL AI & REPORT ANALYZER */}
          <DoctorAiCopilot
            doctorDossier={doctorDossier}
            isAiChatExpanded={isAiChatExpanded}
            setIsAiChatExpanded={setIsAiChatExpanded}
            doctorAiQuery={doctorAiQuery}
            setDoctorAiQuery={setDoctorAiQuery}
            doctorAiLoading={doctorAiLoading}
            doctorAiResponse={doctorAiResponse}
            setDoctorAiResponse={setDoctorAiResponse}
            copiedAiToNote={copiedAiToNote}
            handleDoctorAiAnalyze={handleDoctorAiAnalyze}
            handleCopyAiToConsultationNote={handleCopyAiToConsultationNote}
          />

          {/* Patient Core Clinical Summary Bar */}
          <div className="card" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: '#F0F9FF',
                  border: '2px solid #0284C7',
                  color: '#0369A1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 800
                }}
              >
                {doctorDossier.patient.fullName.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '1.35rem', color: '#0F172A', margin: 0 }}>{doctorDossier.patient.fullName}</h2>
                  <span className="badge badge-teal" style={{ fontSize: '0.78rem', fontFamily: 'monospace' }}>{doctorDossier.patient.healthId}</span>
                  <span className="badge badge-normal">Consent Active</span>
                </div>
                <div style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '4px' }}>
                  DOB: {doctorDossier.patient.dob} • Sex: {doctorDossier.patient.gender} • Blood: <strong>{doctorDossier.patient.bloodGroup}</strong> • Allergies: <strong style={{ color: '#DC2626' }}>{doctorDossier.patient.allergies?.join(', ') || 'None'}</strong>
                </div>
              </div>
            </div>

            {/* Disease & Report High-Level Metrics */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{ background: '#FFFBEB', padding: '10px 18px', borderRadius: '10px', border: '1px solid #FDE68A', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#92400E', fontWeight: 700 }}>ONGOING DISEASES</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#B45309' }}>
                  {doctorDossier.clinicalOverview?.activeConditions?.length || 0} Active
                </div>
              </div>

              <div style={{ background: '#ECFDF5', padding: '10px 18px', borderRadius: '10px', border: '1px solid #A7F3D0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#065F46', fontWeight: 700 }}>OFFICIALLY CURED</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669' }}>
                  {doctorDossier.clinicalOverview?.pastResolvedDiseases?.length || 0} Resolved
                </div>
              </div>

              <div style={{ background: '#F0F9FF', padding: '10px 18px', borderRadius: '10px', border: '1px solid #BAE6FD', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#0369A1', fontWeight: 700 }}>PREVIOUS HEALTH REPORTS</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284C7' }}>
                  {doctorDossier.allReports?.length || 0} Records
                </div>
              </div>
            </div>
          </div>

          {/* Dual-Column Split: Lifetime Diseases (Ongoing Active vs Cured Resolved) */}
          <LifetimeDiseasesSection
            doctorDossier={doctorDossier}
            onEditCondition={onEditCondition}
            onCureCondition={onCureCondition}
            onReopenCondition={onReopenCondition}
            onInspectReport={onInspectReport}
          />

          {/* All Previous Health Records & Treatments Archive (Across All Hospitals) */}
          <ReportsVaultSection
            allReports={doctorDossier.allReports || []}
            reportSearchQuery={reportSearchQuery}
            setReportSearchQuery={setReportSearchQuery}
            selectedYearFilter={selectedYearFilter}
            setSelectedYearFilter={setSelectedYearFilter}
            selectedCategoryFilter={selectedCategoryFilter}
            setSelectedCategoryFilter={setSelectedCategoryFilter}
            onInspectReport={onInspectReport}
          />

          {/* Doctor Consultation Note & Assessment Form */}
          <div id="doctor-consultation-notes-section" className="card" style={{ padding: '22px' }}>
            <h4 style={{ fontSize: '1.15rem', color: '#0F172A', marginBottom: '8px' }}>
              Add Clinical Assessment & Consultation Note
            </h4>
            <form onSubmit={handleAddDoctorNote} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <textarea
                rows={3}
                placeholder="Enter clinical assessment, diagnostic impressions, or treatment modifications..."
                value={newDoctorNote}
                onChange={(e) => setNewDoctorNote(e.target.value)}
                required
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', width: '100%', fontSize: '0.9rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={isSubmittingNote} className="btn-primary">
                  {isSubmittingNote ? 'Saving...' : 'Save Clinical Consultation Note'}
                </button>
              </div>
            </form>

            {/* Past Consultation Notes */}
            {doctorDossier.doctorNotes?.length > 0 && (
              <div style={{ marginTop: '18px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', marginBottom: '10px' }}>
                  RECORDED CONSULTATION HISTORY ({doctorDossier.doctorNotes.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {doctorDossier.doctorNotes.map((note: any) => (
                    <div key={note.id} style={{ padding: '12px 14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284C7' }}>
                          🩺 {note.doctorName} • {note.doctorSpecialization}
                        </span>
                        <span style={{ fontSize: '0.76rem', color: '#64748B' }}>{note.date}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, lineHeight: 1.5 }}>
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
