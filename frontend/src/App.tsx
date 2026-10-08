import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import type { AuthSession } from './types';
import { LoginGatekeeper } from './components/LoginGatekeeper';
import { Header } from './components/common';
import { HospitalConsole } from './components/hospital';
import { DoctorStation } from './components/doctor';
import { CitizenDigiLocker } from './components/citizen';
import {
  ReportInspectorModal,
  ConditionStatusModal,
  CureCertificationModal,
  OnboardPatientModal,
  RecordEncounterModal,
  IssueLabReportModal,
  RegisterCitizenModal,
  ProvisionDoctorModal,
  UniversalLoginModal
} from './components/modals';

export default function App() {
  const [, setRole] = useState<'PATIENT' | 'DOCTOR'>('PATIENT');

  // Zero-Trust Role-Based Authentication Session
  const [authSession, setAuthSession] = useState<AuthSession | null>(() => {
    try {
      const saved = localStorage.getItem('medisutra_auth_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Patient & Clinical Data
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  const [, setDocuments] = useState<any[]>([]);

  // Doctor Portal States
  const [, setDoctorPatients] = useState<any[]>([]);
  const [selectedDoctorPatientId, setSelectedDoctorPatientId] = useState<string>('pat-demo-001');
  const [doctorDossier, setDoctorDossier] = useState<any>(null);
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [reportSearchQuery, setReportSearchQuery] = useState<string>('');

  // Hospital Network & Operating Portal States
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('hosp-apollo-01');
  const [selectedHospitalDoctor, setSelectedHospitalDoctor] = useState<string>('Dr. Priya Nair');
  const [hospitalDashboardData, setHospitalDashboardData] = useState<any>(null);
  const [hospitalActiveSubTab, setHospitalActiveSubTab] = useState<'queue' | 'dossier' | 'doctors'>('queue');
  const [hospitalRegistry, setHospitalRegistry] = useState<any[]>([]);

  // Disease Cure Certification States
  const [curingCondition, setCuringCondition] = useState<any>(null);
  const [cureDate, setCureDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [cureEvidence, setCureEvidence] = useState<string>('Clinical follow-up examination and confirmatory diagnostic investigation confirm complete disease resolution.');
  const [cureSuccessNotice, setCureSuccessNotice] = useState<string>('');
  const [isSubmittingCure, setIsSubmittingCure] = useState<boolean>(false);

  // Sovereign Citizen Health Record States
  const [digiLockerPatientId, setDigiLockerPatientId] = useState<string>('pat-demo-001');
  const [digiLockerData, setDigiLockerData] = useState<any>(null);
  const [, setDigiLockerLoading] = useState<boolean>(false);
  const [digiLockerSubTab, setDigiLockerSubTab] = useState<'timeline' | 'lifetime-diseases' | 'issued-docs' | 'patient-overview' | 'card' | 'trends' | 'consent' | 'ai'>('timeline');
  const [digiLockerIssuerFilter, setDigiLockerIssuerFilter] = useState<string>('ALL');
  const [digiLockerCategoryFilter, setDigiLockerCategoryFilter] = useState<string>('ALL');
  const [digiLockerSearchQuery, setDigiLockerSearchQuery] = useState<string>('');
  const [digiLockerTimelineFilter, setDigiLockerTimelineFilter] = useState<string>('ALL');

  // Dedicated Multi-Role Login Portal State
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginRoleTab, setLoginRoleTab] = useState<'HOSPITAL' | 'DOCTOR' | 'CITIZEN'>('HOSPITAL');
  const [loginFacilityCode] = useState('HIP-IN-DEL-001');
  const [loginDoctorLicense, setLoginDoctorLicense] = useState('MCI-2012-44120');
  const [loginCitizenIdentifier, setLoginCitizenIdentifier] = useState('MED-00010001');
  const [loginCitizenOtp, setLoginCitizenOtp] = useState('491024');
  const [loginCitizenError, setLoginCitizenError] = useState('');
  const [loginSuccessNotice, setLoginSuccessNotice] = useState('');

  // Doctor ID Creation Modal States (Hospital Admin Action)
  const [createDoctorModalOpen, setCreateDoctorModalOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocLicense, setNewDocLicense] = useState('');
  const [newDocQualification, setNewDocQualification] = useState('MBBS, MD');
  const [newDocSpecialization, setNewDocSpecialization] = useState('Internal Medicine & Cardiology');
  const [newDocDepartment, setNewDocDepartment] = useState('Cardiology');
  const [newDocPassword, setNewDocPassword] = useState('doctor123');
  const [isSubmittingDoctor, setIsSubmittingDoctor] = useState(false);
  const [createDocSuccessMsg, setCreateDocSuccessMsg] = useState('');

  // Hospital Clinical Action Modals
  const [onboardModalOpen, setOnboardModalOpen] = useState(false);
  const [onboardHealthId, setOnboardHealthId] = useState('MED-00010001');
  const [onboardDoctorName, setOnboardDoctorName] = useState('Dr. Priya Nair');
  const [onboardDepartment, setOnboardDepartment] = useState('General Medicine');
  const [onboardComplaint, setOnboardComplaint] = useState('Cross-Hospital Longitudinal Review & Consultation');
  const [onboardPriority, setOnboardPriority] = useState('Routine OPD');
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardResult, setOnboardResult] = useState<any>(null);
  const [diagnosisModalOpen, setDiagnosisModalOpen] = useState(false);
  const [issueReportModalOpen, setIssueReportModalOpen] = useState(false);
  const [registerCitizenModalOpen, setRegisterCitizenModalOpen] = useState(false);

  // Diagnosis Encounter Form State
  const [diagConditionName, setDiagConditionName] = useState('');
  const [diagConditionCode, setDiagConditionCode] = useState('');
  const [diagBodySystem, setDiagBodySystem] = useState('Cardiovascular');
  const [diagSeverity, setDiagSeverity] = useState<'MILD' | 'MODERATE' | 'SEVERE'>('MODERATE');
  const [diagStatus, setDiagStatus] = useState<string>('DIAGNOSED');
  const [diagNotes, setDiagNotes] = useState('');
  const [diagRx, setDiagRx] = useState('');
  const [diagDepartment, setDiagDepartment] = useState('Outpatient Cardiology');
  const [isSubmittingDiag, setIsSubmittingDiag] = useState(false);
  const [diagSuccessMsg, setDiagSuccessMsg] = useState('');

  // Diagnostic Report Generation Form State
  const [repDocType, setRepDocType] = useState('Comprehensive Metabolic Panel');
  const [repCategory, setRepCategory] = useState<'Metabolic' | 'Blood' | 'Renal' | 'Hepatic' | 'Imaging' | 'General'>('Metabolic');
  const [repDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [repFindings, setRepFindings] = useState('');
  const [repLinkedCondId, setRepLinkedCondId] = useState('');
  const [repMarkResolved, setRepMarkResolved] = useState(false);
  const [repLabs, setRepLabs] = useState<Array<{ parameterName: string; parameterCode: string; numericValue: number; rawUnit: string; referenceMin: number; referenceMax: number; flag: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL' }>>([
    { parameterName: 'Fasting Plasma Glucose', parameterCode: 'GLU_FAST', numericValue: 126, rawUnit: 'mg/dL', referenceMin: 70, referenceMax: 99, flag: 'HIGH' },
    { parameterName: 'HbA1c', parameterCode: 'HBA1C', numericValue: 6.8, rawUnit: '%', referenceMin: 4.0, referenceMax: 5.6, flag: 'HIGH' }
  ]);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSuccessMsg, setReportSuccessMsg] = useState('');

  // Register Citizen Form State
  const [regFullName, setRegFullName] = useState('');
  const [regDob, setRegDob] = useState('1990-01-01');
  const [regGender, setRegGender] = useState('Male');
  const [regBloodGroup, setRegBloodGroup] = useState('B+');
  const [regAllergies, setRegAllergies] = useState('');
  const [regEmergencyName, setRegEmergencyName] = useState('');
  const [regEmergencyPhone, setRegEmergencyPhone] = useState('');
  const [regFamilial, setRegFamilial] = useState('');
  const [isRegisteringCitizen, setIsRegisteringCitizen] = useState(false);
  const [regSuccessMsg, setRegSuccessMsg] = useState('');

  // Report Inspector Modal State
  const [inspectingReport, setInspectingReport] = useState<any>(null);

  // Condition Status Update Modal State
  const [editingCondition, setEditingCondition] = useState<any>(null);
  const [newConditionStatus, setNewConditionStatus] = useState<string>('STABLE');
  const [statusUpdateNote, setStatusUpdateNote] = useState<string>('');
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState<boolean>(false);

  // Doctor consultation note
  const [newDoctorNote, setNewDoctorNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // Doctor AI Clinical Assistant & Report Analyzer State
  const [doctorAiQuery, setDoctorAiQuery] = useState('');
  const [doctorAiLoading, setDoctorAiLoading] = useState(false);
  const [doctorAiResponse, setDoctorAiResponse] = useState<any>(null);
  const [copiedAiToNote, setCopiedAiToNote] = useState(false);
  const [isAiChatExpanded, setIsAiChatExpanded] = useState(true);

  // Initial Data Fetch
  useEffect(() => {
    async function loadInitial() {
      try {
        await api.login(); // Auto-authenticate demo patient Rahul Sharma
        const timeRes = await api.getTimeline();
        setTimelineEvents(timeRes.data.events);

        const docRes = await api.getDocuments();
        setDocuments(docRes.data.items);

        // Load Doctor Patients Roster
        const docPatsRes = await api.getDoctorPatients();
        setDoctorPatients(docPatsRes.data);

        // Load Doctor Dossier for default patient (Rahul Sharma)
        const dossierRes = await api.getPatientDossier('pat-demo-001');
        setDoctorDossier(dossierRes.data);

        // Load Hospitals & Nationwide Patient Registry
        const hospRes = await api.getHospitals();
        setHospitals(hospRes.data.facilities);
        if (hospRes.data.facilities?.length > 0) {
          const firstHosp = hospRes.data.facilities[0];
          setSelectedHospitalId(firstHosp.id);
          if (firstHosp.activeDoctors?.length > 0) {
            setSelectedHospitalDoctor(firstHosp.activeDoctors[0].name);
          }
          try {
            const hDashRes = await api.getHospitalDashboard(firstHosp.id);
            setHospitalDashboardData(hDashRes.data);
          } catch (e) {
            console.error('Failed loading hospital dashboard', e);
          }
        }

        const regRes = await api.getHospitalPatientRegistry();
        setHospitalRegistry(regRes.data.patients);

        // Load Sovereign Citizen DigiLocker for default patient or authenticated session
        const activeCitizenId = authSession?.role === 'CITIZEN' && authSession.citizen?.id ? authSession.citizen.id : 'pat-demo-001';
        try {
          const lockRes = await api.getCitizenDigiLocker(activeCitizenId);
          setDigiLockerData(lockRes.data);
          setDigiLockerPatientId(activeCitizenId);
        } catch (e) {
          console.error('Failed loading digilocker', e);
        }

        if (authSession?.role === 'HOSPITAL_ADMIN' && authSession.hospital?.id) {
          setSelectedHospitalId(authSession.hospital.id);
          try {
            const hDashRes = await api.getHospitalDashboard(authSession.hospital.id);
            setHospitalDashboardData(hDashRes.data);
          } catch (e) {
            console.error(e);
          }
        } else if (authSession?.role === 'DOCTOR') {
          if (authSession.hospital?.id) {
            setSelectedHospitalId(authSession.hospital.id);
            try {
              const hDashRes = await api.getHospitalDashboard(authSession.hospital.id);
              setHospitalDashboardData(hDashRes.data);
            } catch (e) {
              console.error(e);
            }
          }
          if (authSession.doctor?.name) {
            setSelectedHospitalDoctor(authSession.doctor.name);
          }
        }
      } catch (err) {
        console.error('Error loading initial data:', err);
      }
    }
    loadInitial();
  }, []);

  // When switching citizen DigiLocker profile
  const handleSelectDigiLockerPatient = async (pId: string) => {
    const effectiveId = authSession?.role === 'CITIZEN' && authSession.citizen?.id ? authSession.citizen.id : pId;
    setDigiLockerPatientId(effectiveId);
    setDigiLockerLoading(true);
    try {
      const res = await api.getCitizenDigiLocker(effectiveId);
      setDigiLockerData(res.data);
      if (authSession?.role !== 'CITIZEN') {
        setSelectedDoctorPatientId(effectiveId);
        const dossierRes = await api.getPatientDossier(effectiveId);
        setDoctorDossier(dossierRes.data);
      }
    } catch (err) {
      console.error('Error loading citizen digilocker:', err);
    } finally {
      setDigiLockerLoading(false);
    }
  };

  // When switching doctor patient
  const handleSelectDoctorPatient = async (pId: string) => {
    setSelectedDoctorPatientId(pId);
    setDigiLockerPatientId(pId);
    try {
      const res = await api.getPatientDossier(pId);
      setDoctorDossier(res.data);
      const lockRes = await api.getCitizenDigiLocker(pId);
      setDigiLockerData(lockRes.data);
    } catch (err) {
      console.error('Error loading patient dossier:', err);
    }
  };

  // Handle Doctor updating condition status
  const handleSaveConditionStatus = async () => {
    if (!editingCondition) return;
    try {
      await api.updateConditionStatus(
        selectedDoctorPatientId,
        editingCondition.id,
        newConditionStatus,
        statusUpdateNote
      );
      setStatusUpdateSuccess(true);
      const res = await api.getPatientDossier(selectedDoctorPatientId);
      setDoctorDossier(res.data);
      setTimeout(() => {
        setStatusUpdateSuccess(false);
        setEditingCondition(null);
        setStatusUpdateNote('');
      }, 1200);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Certifying Clinical Cure
  const handleConfirmCure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!curingCondition) return;
    setIsSubmittingCure(true);
    try {
      const activeHosp = hospitals.find(h => h.id === selectedHospitalId);
      const res = await api.cureCondition(curingCondition.id, {
        resolvedDate: cureDate,
        curedByHospital: activeHosp?.name || 'Apollo Hospitals & Heart Institute',
        doctorName: selectedHospitalDoctor || 'Attending Physician',
        resolvingEvidence: cureEvidence
      });

      setCureSuccessNotice(res.data?.message || `Disease '${curingCondition.conditionName}' successfully certified as CURED!`);

      if (selectedDoctorPatientId) {
        const dRes = await api.getPatientDossier(selectedDoctorPatientId);
        setDoctorDossier(dRes.data);
      }
      if (digiLockerPatientId) {
        const lockRes = await api.getCitizenDigiLocker(digiLockerPatientId);
        setDigiLockerData(lockRes.data);
      }

      setTimeout(() => {
        setIsSubmittingCure(false);
        setCuringCondition(null);
        setCureSuccessNotice('');
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setIsSubmittingCure(false);
      alert(err.message || 'Failed to certify cure.');
    }
  };

  // Handle Reopening Condition if Relapsed
  const handleReopenCondition = async (conditionId: string) => {
    if (!window.confirm('Are you sure you want to re-open this condition for active ongoing treatment?')) return;
    try {
      await api.reopenCondition(conditionId, {
        reason: 'Condition relapsed; re-initiating active treatment protocol.',
        doctorName: selectedHospitalDoctor || 'Attending Physician',
        hospitalName: hospitals.find(h => h.id === selectedHospitalId)?.name || 'Apollo Hospitals'
      });
      if (selectedDoctorPatientId) {
        const dRes = await api.getPatientDossier(selectedDoctorPatientId);
        setDoctorDossier(dRes.data);
      }
      if (digiLockerPatientId) {
        const lockRes = await api.getCitizenDigiLocker(digiLockerPatientId);
        setDigiLockerData(lockRes.data);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to re-open condition.');
    }
  };

  // Handle Onboarding Patient by Unique Health ID to Doctor Dashboard
  const handleOnboardPatientToDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardHealthId.trim()) return;
    setIsOnboarding(true);
    try {
      const activeHosp = hospitals.find(h => h.id === selectedHospitalId);
      const res = await api.onboardPatientToDoctor({
        healthId: onboardHealthId.trim(),
        hospitalId: activeHosp?.id || selectedHospitalId,
        doctorName: onboardDoctorName || selectedHospitalDoctor || 'Dr. Priya Nair',
        department: onboardDepartment,
        chiefComplaint: onboardComplaint,
        priority: onboardPriority
      });

      setOnboardResult(res.data);

      const regRes = await api.getHospitalPatientRegistry();
      setHospitalRegistry(regRes.data.patients);
      const docPatsRes = await api.getDoctorPatients();
      setDoctorPatients(docPatsRes.data);
      const hDashRes = await api.getHospitalDashboard(selectedHospitalId);
      setHospitalDashboardData(hDashRes.data);

      if (res.data?.patient?.id) {
        handleSelectDoctorPatient(res.data.patient.id);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to onboard patient by Unique Health ID.');
    } finally {
      setIsOnboarding(false);
    }
  };

  // Handle adding clinical note
  const handleAddDoctorNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctorNote.trim()) return;
    setIsSubmittingNote(true);
    try {
      await api.addDoctorNote(selectedDoctorPatientId, newDoctorNote, 'ROUTINE_REVIEW');
      setNewDoctorNote('');
      const res = await api.getPatientDossier(selectedDoctorPatientId);
      setDoctorDossier(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  // Handle Doctor AI Clinical Report Analysis
  const handleDoctorAiAnalyze = async (queryOverride?: string) => {
    const q = (queryOverride !== undefined ? queryOverride : doctorAiQuery).trim();
    if (!q) return;
    setDoctorAiLoading(true);
    if (queryOverride) setDoctorAiQuery(queryOverride);
    try {
      const res = await api.doctorAnalyzePatient(selectedDoctorPatientId, q);
      setDoctorAiResponse(res.data);
    } catch (err) {
      console.error('Doctor AI analysis error:', err);
      try {
        const fallback = await api.queryAI(q, undefined, selectedDoctorPatientId);
        setDoctorAiResponse(fallback.data);
      } catch (e) {
        console.error(e);
      }
    } finally {
      setDoctorAiLoading(false);
    }
  };

  const handleCopyAiToConsultationNote = () => {
    if (!doctorAiResponse) return;
    const noteText = doctorAiResponse.copyableNote || doctorAiResponse.answer || '';
    setNewDoctorNote(prev => (prev ? `${prev}\n\n${noteText}` : noteText));
    setCopiedAiToNote(true);
    setTimeout(() => setCopiedAiToNote(false), 3000);
    const noteEl = document.getElementById('doctor-consultation-notes-section');
    if (noteEl) {
      noteEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Recording New Disease Encounter at Current Hospital
  const handleSaveDiagnosisEncounter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagConditionName.trim() || !diagNotes.trim()) return;
    setIsSubmittingDiag(true);
    try {
      const activeHosp = hospitals.find(h => h.id === selectedHospitalId);
      const res = await api.recordHospitalDiagnosisEncounter({
        patientId: selectedDoctorPatientId,
        hospitalId: selectedHospitalId,
        hospitalName: activeHosp?.name || 'Apollo Hospitals & Heart Institute',
        doctorName: selectedHospitalDoctor || 'Dr. Priya Nair',
        department: diagDepartment,
        conditionName: diagConditionName,
        conditionCode: diagConditionCode || diagConditionName.toUpperCase().replace(/\s+/g, '_').slice(0, 8),
        bodySystem: diagBodySystem,
        severity: diagSeverity,
        status: diagStatus,
        clinicalNotes: diagNotes,
        treatmentSummary: diagRx,
        encounterDate: new Date().toISOString().split('T')[0]
      });

      setDiagSuccessMsg(res.data.message);

      const dossierRes = await api.getPatientDossier(selectedDoctorPatientId);
      setDoctorDossier(dossierRes.data);
      const regRes = await api.getHospitalPatientRegistry();
      setHospitalRegistry(regRes.data.patients);
      const docPatsRes = await api.getDoctorPatients();
      setDoctorPatients(docPatsRes.data);
      const timeRes = await api.getTimeline();
      setTimelineEvents(timeRes.data.events);

      if (selectedHospitalId) {
        api.getHospitalDashboard(selectedHospitalId).then(r => setHospitalDashboardData(r.data)).catch(() => { });
      }
      if (digiLockerPatientId) {
        api.getCitizenDigiLocker(digiLockerPatientId).then(r => setDigiLockerData(r.data)).catch(() => { });
      }

      setTimeout(() => {
        setIsSubmittingDiag(false);
        setDiagnosisModalOpen(false);
        setDiagSuccessMsg('');
        setDiagConditionName('');
        setDiagConditionCode('');
        setDiagNotes('');
        setDiagRx('');
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setIsSubmittingDiag(false);
      alert(err.message || 'Failed to record clinical encounter.');
    }
  };

  // Handle Issuing Diagnostic Report at Current Hospital / Lab
  const handleSaveDiagnosticReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repDocType.trim() || !repFindings.trim()) return;
    setIsSubmittingReport(true);
    try {
      const activeHosp = hospitals.find(h => h.id === selectedHospitalId);
      const res = await api.ingestHospitalDiagnosticReport({
        patientId: selectedDoctorPatientId,
        hospitalId: selectedHospitalId,
        hospitalName: activeHosp?.name || 'Dr. Lal PathLabs National Reference Laboratory',
        documentType: repDocType,
        category: repCategory,
        reportDate: repDate,
        originalFilename: `${repDocType.replace(/\s+/g, '_')}_${repDate}.pdf`,
        keyFindingsSummary: repFindings,
        linkedConditionId: repLinkedCondId || undefined,
        markConditionResolved: repMarkResolved,
        extractedLabs: repLabs
      });

      setReportSuccessMsg(res.data.message);

      const dossierRes = await api.getPatientDossier(selectedDoctorPatientId);
      setDoctorDossier(dossierRes.data);
      const docRes = await api.getDocuments();
      setDocuments(docRes.data.items);
      const timeRes = await api.getTimeline();
      setTimelineEvents(timeRes.data.events);
      const regRes = await api.getHospitalPatientRegistry();
      setHospitalRegistry(regRes.data.patients);

      if (selectedHospitalId) {
        api.getHospitalDashboard(selectedHospitalId).then(r => setHospitalDashboardData(r.data)).catch(() => { });
      }
      if (digiLockerPatientId) {
        api.getCitizenDigiLocker(digiLockerPatientId).then(r => setDigiLockerData(r.data)).catch(() => { });
      }

      setTimeout(() => {
        setIsSubmittingReport(false);
        setIssueReportModalOpen(false);
        setReportSuccessMsg('');
        setRepFindings('');
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setIsSubmittingReport(false);
      alert(err.message || 'Failed to issue diagnostic report.');
    }
  };

  // Handle Registering Citizen in Central Human Report Center
  const handleRegisterCitizen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regDob || !regGender || !regBloodGroup) return;
    setIsRegisteringCitizen(true);
    try {
      const activeHosp = hospitals.find(h => h.id === selectedHospitalId);
      const allergiesList = regAllergies ? regAllergies.split(',').map(s => s.trim()).filter(Boolean) : [];
      const res = await api.registerCitizenToCenter({
        fullName: regFullName,
        dob: regDob,
        gender: regGender,
        bloodGroup: regBloodGroup,
        allergies: allergiesList,
        emergencyContact: {
          name: regEmergencyName || 'Primary Family Contact',
          phone: regEmergencyPhone || '+91-9876543210',
          relationship: 'Family'
        },
        baselineHistory: {
          familialRisks: regFamilial ? [regFamilial] : ['None documented'],
          registeredAtHospital: activeHosp?.name || 'Apollo Hospitals & Heart Institute'
        },
        registeringHospital: activeHosp?.name || 'Apollo Hospitals & Heart Institute'
      });

      setRegSuccessMsg(res.data.message);

      const docPatsRes = await api.getDoctorPatients();
      setDoctorPatients(docPatsRes.data);
      const regRes = await api.getHospitalPatientRegistry();
      setHospitalRegistry(regRes.data.patients);

      if (res.data.patient?.id) {
        handleSelectDoctorPatient(res.data.patient.id);
        api.getCitizenDigiLocker(res.data.patient.id).then(r => setDigiLockerData(r.data)).catch(() => { });
      }
      if (selectedHospitalId) {
        api.getHospitalDashboard(selectedHospitalId).then(r => setHospitalDashboardData(r.data)).catch(() => { });
      }

      setTimeout(() => {
        setIsRegisteringCitizen(false);
        setRegisterCitizenModalOpen(false);
        setRegSuccessMsg('');
        setRegFullName('');
        setRegAllergies('');
        setRegEmergencyName('');
        setRegEmergencyPhone('');
        setRegFamilial('');
      }, 1800);
    } catch (err: any) {
      console.error(err);
      setIsRegisteringCitizen(false);
      alert(err.message || 'Failed to register citizen.');
    }
  };

  // Handle Hospital Institutional Login
  const handleHospitalLogin = async (hospIdOrCode = loginFacilityCode, password = 'admin') => {
    try {
      const res = await api.loginHospital(hospIdOrCode, password);
      const hosp = res.data.hospital;
      setSelectedHospitalId(hosp.id);
      setHospitalActiveSubTab('queue');
      const hDash = await api.getHospitalDashboard(hosp.id);
      setHospitalDashboardData(hDash.data);
      if (hosp.departments?.length > 0) setNewDocDepartment(hosp.departments[0]);

      const sess: AuthSession = {
        role: 'HOSPITAL_ADMIN',
        hospital: hosp,
        authenticatedAt: new Date().toLocaleTimeString()
      };
      setAuthSession(sess);
      localStorage.setItem('medisutra_auth_session', JSON.stringify(sess));
      setLoginSuccessNotice(`Authenticated as Institutional Admin for ${hosp.name}`);
      setTimeout(() => {
        setLoginModalOpen(false);
        setLoginSuccessNotice('');
      }, 500);
    } catch (err: any) {
      alert(err.message || 'Hospital authentication failed');
      throw err;
    }
  };

  // Handle Doctor Login
  const handleDoctorLogin = async (hospId = selectedHospitalId, licNumber = loginDoctorLicense, _password = 'doctorSecure2026!') => {
    try {
      const res = await api.loginDoctor(hospId, licNumber);
      const doc = res.data.doctor;
      const hosp = res.data.hospital;
      setSelectedHospitalDoctor(doc.name);
      setSelectedHospitalId(hosp.id);
      setHospitalActiveSubTab('dossier');
      setRole('DOCTOR');

      const sess: AuthSession = {
        role: 'DOCTOR',
        doctor: doc,
        hospital: hosp,
        authenticatedAt: new Date().toLocaleTimeString()
      };
      setAuthSession(sess);
      localStorage.setItem('medisutra_auth_session', JSON.stringify(sess));
      setLoginSuccessNotice(`Doctor session verified for ${doc.name} (${doc.licenseNumber})`);
      setTimeout(() => {
        setLoginModalOpen(false);
        setLoginSuccessNotice('');
      }, 500);
    } catch (err: any) {
      alert(err.message || 'Doctor login failed');
      throw err;
    }
  };

  // Handle Citizen DigiLocker Login
  const handleCitizenLogin = async (citizenId = loginCitizenIdentifier, otp = loginCitizenOtp) => {
    setLoginCitizenError('');
    try {
      const res = await api.loginCitizen(citizenId, otp);
      const pat = res.data.patient;
      setDigiLockerPatientId(pat.id);
      handleSelectDigiLockerPatient(pat.id);
      setRole('PATIENT');

      const sess: AuthSession = {
        role: 'CITIZEN',
        citizen: pat,
        authenticatedAt: new Date().toLocaleTimeString()
      };
      setAuthSession(sess);
      localStorage.setItem('medisutra_auth_session', JSON.stringify(sess));
      setLoginSuccessNotice(`Sovereign Health Vault unlocked for ${pat.fullName} (${pat.healthId})`);
      setTimeout(() => {
        setLoginModalOpen(false);
        setLoginSuccessNotice('');
      }, 500);
    } catch (err: any) {
      setLoginCitizenError(err.message || 'Citizen Health Vault login failed');
      alert(err.message || 'Citizen Health Vault login failed');
      throw err;
    }
  };

  // Handle Lock & Logout
  const handleLogout = () => {
    setAuthSession(null);
    localStorage.removeItem('medisutra_auth_session');
    api.clearToken();
  };

  // Handle Hospital Admin Creating New Doctor ID
  const handleCreateDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim() || !newDocLicense.trim()) return;
    setIsSubmittingDoctor(true);
    try {
      const res = await api.createHospitalDoctor(selectedHospitalId, {
        name: newDocName,
        licenseNumber: newDocLicense,
        qualification: newDocQualification,
        specialization: newDocSpecialization,
        department: newDocDepartment,
        password: newDocPassword
      });

      setCreateDocSuccessMsg(res.data.message);

      const hDashRes = await api.getHospitalDashboard(selectedHospitalId);
      setHospitalDashboardData(hDashRes.data);
      const hospRes = await api.getHospitals();
      setHospitals(hospRes.data.facilities);

      setTimeout(() => {
        setIsSubmittingDoctor(false);
        setCreateDoctorModalOpen(false);
        setCreateDocSuccessMsg('');
        setNewDocName('');
        setNewDocLicense('');
      }, 1800);
    } catch (err: any) {
      setIsSubmittingDoctor(false);
      alert(err.message || 'Failed to provision Doctor ID');
    }
  };

  // ========================================================
  // ZERO-TRUST GATEKEEPER: STRICT ENTRY THROUGH CREDENTIALS ONLY
  // ========================================================
  if (!authSession) {
    return (
      <LoginGatekeeper
        hospitals={hospitals}
        onHospitalLogin={handleHospitalLogin}
        onDoctorLogin={handleDoctorLogin}
        onCitizenLogin={handleCitizenLogin}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header & Navigation */}
      <Header
        authSession={authSession}
        onOpenLoginModal={() => setLoginModalOpen(true)}
        onLogout={handleLogout}
        hospitalActiveSubTab={hospitalActiveSubTab}
        onChangeHospitalSubTab={setHospitalActiveSubTab}
        hospitalDashboardData={hospitalDashboardData}
        digiLockerSubTab={digiLockerSubTab}
        onChangeDigiLockerSubTab={setDigiLockerSubTab}
        digiLockerData={digiLockerData}
        timelineEventsCount={digiLockerData?.recentTimeline?.length || timelineEvents?.length || 0}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '28px 0' }}>
        <div className="container">
          {/* PORTAL 1: HOSPITAL INTAKE & OPD CONSOLE (HOSPITAL ADMIN) */}
          {authSession.role === 'HOSPITAL_ADMIN' && (
            <HospitalConsole
              authSession={authSession}
              hospitalActiveSubTab={hospitalActiveSubTab}
              hospitals={hospitals}
              selectedHospitalId={selectedHospitalId}
              hospitalDashboardData={hospitalDashboardData}
              hospitalRegistry={hospitalRegistry}
              onboardHealthId={onboardHealthId}
              setOnboardHealthId={setOnboardHealthId}
              onboardDoctorName={onboardDoctorName}
              setOnboardDoctorName={setOnboardDoctorName}
              onboardDepartment={onboardDepartment}
              setOnboardDepartment={setOnboardDepartment}
              onboardComplaint={onboardComplaint}
              setOnboardComplaint={setOnboardComplaint}
              onboardPriority={onboardPriority}
              setOnboardPriority={setOnboardPriority}
              isOnboarding={isOnboarding}
              onboardResult={onboardResult}
              handleOnboardPatientToDoctor={handleOnboardPatientToDoctor}
              setRegisterCitizenModalOpen={setRegisterCitizenModalOpen}
              setCreateDoctorModalOpen={setCreateDoctorModalOpen}
            />
          )}

          {/* PORTAL 2: SPECIALIST CLINICAL STATION (DOCTOR) */}
          {authSession.role === 'DOCTOR' && (
            <DoctorStation
              authSession={authSession}
              hospitalRegistry={hospitalRegistry}
              selectedDoctorPatientId={selectedDoctorPatientId}
              handleSelectDoctorPatient={handleSelectDoctorPatient}
              doctorDossier={doctorDossier}
              setDiagnosisModalOpen={setDiagnosisModalOpen}
              setIssueReportModalOpen={setIssueReportModalOpen}
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
              onEditCondition={(cond) => {
                setEditingCondition(cond);
                setNewConditionStatus(cond.currentStatus);
              }}
              onCureCondition={(cond) => {
                setCuringCondition(cond);
                setCureDate(new Date().toISOString().split('T')[0]);
                setCureEvidence('Clinical follow-up examination and confirmatory diagnostic investigation confirm complete disease resolution.');
              }}
              onReopenCondition={handleReopenCondition}
              onInspectReport={setInspectingReport}
              reportSearchQuery={reportSearchQuery}
              setReportSearchQuery={setReportSearchQuery}
              selectedYearFilter={selectedYearFilter}
              setSelectedYearFilter={setSelectedYearFilter}
              selectedCategoryFilter={selectedCategoryFilter}
              setSelectedCategoryFilter={setSelectedCategoryFilter}
              newDoctorNote={newDoctorNote}
              setNewDoctorNote={setNewDoctorNote}
              isSubmittingNote={isSubmittingNote}
              handleAddDoctorNote={handleAddDoctorNote}
            />
          )}

          {/* PORTAL 3: CITIZEN HEALTH DIGILOCKER (SOVEREIGN WALLET) */}
          {authSession.role === 'CITIZEN' && (
            <CitizenDigiLocker
              authSession={authSession}
              digiLockerData={digiLockerData}
              digiLockerSubTab={digiLockerSubTab}
              digiLockerSearchQuery={digiLockerSearchQuery}
              setDigiLockerSearchQuery={setDigiLockerSearchQuery}
              digiLockerIssuerFilter={digiLockerIssuerFilter}
              setDigiLockerIssuerFilter={setDigiLockerIssuerFilter}
              digiLockerCategoryFilter={digiLockerCategoryFilter}
              setDigiLockerCategoryFilter={setDigiLockerCategoryFilter}
              digiLockerTimelineFilter={digiLockerTimelineFilter}
              setDigiLockerTimelineFilter={setDigiLockerTimelineFilter}
              timelineEvents={timelineEvents}
              onInspectReport={setInspectingReport}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: '#FFFFFF', borderTop: '1px solid #E2E8F0', padding: '24px 0', marginTop: 'auto' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.95rem' }}>MediSutra</span>
            <span style={{ fontSize: '0.8rem', color: '#64748B', marginLeft: '10px' }}>
              Longitudinal Personal Health Intelligence Platform • Designed for Patients & Treating Clinicians
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
            Built with React 18, Node.js API Gateway, PostgreSQL Data Model, and Clinical Evidence Validation.
          </div>
        </div>
      </footer>

      {/* Modals Container */}
      <ReportInspectorModal
        report={inspectingReport}
        onClose={() => setInspectingReport(null)}
      />

      <ConditionStatusModal
        condition={editingCondition}
        newStatus={newConditionStatus}
        setNewStatus={setNewConditionStatus}
        newNotes={statusUpdateNote}
        setNewNotes={setStatusUpdateNote}
        onClose={() => setEditingCondition(null)}
        onSave={handleSaveConditionStatus}
        isSaving={statusUpdateSuccess}
      />

      <CureCertificationModal
        curingCondition={curingCondition}
        patient={doctorDossier?.patient}
        cureDate={cureDate}
        setCureDate={setCureDate}
        hospitalName={hospitals.find(h => h.id === selectedHospitalId)?.name || 'Apollo Hospitals & Heart Institute'}
        doctorName={selectedHospitalDoctor || 'Attending Physician'}
        cureEvidence={cureEvidence}
        setCureEvidence={setCureEvidence}
        cureSuccessNotice={cureSuccessNotice}
        onClose={() => setCuringCondition(null)}
        onSubmit={handleConfirmCure}
        isSubmitting={isSubmittingCure}
      />

      <OnboardPatientModal
        isOpen={onboardModalOpen}
        onboardResult={onboardResult}
        hospitalRegistry={hospitalRegistry}
        onboardHealthId={onboardHealthId}
        setOnboardHealthId={setOnboardHealthId}
        onboardDoctorName={onboardDoctorName}
        setOnboardDoctorName={setOnboardDoctorName}
        onboardDepartment={onboardDepartment}
        setOnboardDepartment={setOnboardDepartment}
        onboardComplaint={onboardComplaint}
        setOnboardComplaint={setOnboardComplaint}
        onboardPriority={onboardPriority}
        setOnboardPriority={setOnboardPriority}
        isOnboarding={isOnboarding}
        onSubmit={handleOnboardPatientToDoctor}
        onClose={() => setOnboardModalOpen(false)}
        onSuccessAction={() => {
          setOnboardModalOpen(false);
          setHospitalActiveSubTab('queue');
        }}
        activeDoctors={hospitals.find(h => h.id === selectedHospitalId)?.activeDoctors || []}
      />

      <RecordEncounterModal
        isOpen={diagnosisModalOpen}
        diagSuccessMsg={diagSuccessMsg}
        patient={doctorDossier?.patient}
        hospitalName={hospitals.find(h => h.id === selectedHospitalId)?.name || 'Apollo Hospitals'}
        doctorName={selectedHospitalDoctor}
        diagConditionName={diagConditionName}
        setDiagConditionName={setDiagConditionName}
        diagConditionCode={diagConditionCode}
        setDiagConditionCode={setDiagConditionCode}
        diagBodySystem={diagBodySystem}
        setDiagBodySystem={setDiagBodySystem}
        diagSeverity={diagSeverity}
        setDiagSeverity={setDiagSeverity}
        diagStatus={diagStatus}
        setDiagStatus={setDiagStatus}
        diagNotes={diagNotes}
        setDiagNotes={setDiagNotes}
        diagRx={diagRx}
        setDiagRx={setDiagRx}
        diagDept={diagDepartment}
        setDiagDept={setDiagDepartment}
        isSubmitting={isSubmittingDiag}
        onSubmit={handleSaveDiagnosisEncounter}
        onClose={() => setDiagnosisModalOpen(false)}
      />

      <IssueLabReportModal
        isOpen={issueReportModalOpen}
        reportSuccessMsg={reportSuccessMsg}
        hospitalName={hospitals.find(h => h.id === selectedHospitalId)?.name || 'Dr. Lal PathLabs'}
        patientConditions={doctorDossier?.clinicalOverview?.activeConditions || []}
        repDocType={repDocType}
        setRepDocType={setRepDocType}
        repCategory={repCategory}
        setRepCategory={setRepCategory}
        repFindings={repFindings}
        setRepFindings={setRepFindings}
        repLinkedCondId={repLinkedCondId}
        setRepLinkedCondId={setRepLinkedCondId}
        repMarkResolved={repMarkResolved}
        setRepMarkResolved={setRepMarkResolved}
        repLabs={repLabs}
        setRepLabs={setRepLabs}
        isSubmitting={isSubmittingReport}
        onSubmit={handleSaveDiagnosticReport}
        onClose={() => setIssueReportModalOpen(false)}
      />

      <RegisterCitizenModal
        isOpen={registerCitizenModalOpen}
        regSuccessMsg={regSuccessMsg}
        regFullName={regFullName}
        setRegFullName={setRegFullName}
        regBloodGroup={regBloodGroup}
        setRegBloodGroup={setRegBloodGroup}
        regDob={regDob}
        setRegDob={setRegDob}
        regGender={regGender}
        setRegGender={setRegGender}
        regAllergies={regAllergies}
        setRegAllergies={setRegAllergies}
        regEmergencyName={regEmergencyName}
        setRegEmergencyName={setRegEmergencyName}
        regEmergencyPhone={regEmergencyPhone}
        setRegEmergencyPhone={setRegEmergencyPhone}
        regFamilial={regFamilial}
        setRegFamilial={setRegFamilial}
        isRegisteringCitizen={isRegisteringCitizen}
        onSubmit={handleRegisterCitizen}
        onClose={() => setRegisterCitizenModalOpen(false)}
      />

      <ProvisionDoctorModal
        isOpen={createDoctorModalOpen}
        createDocSuccessMsg={createDocSuccessMsg}
        hospitalName={hospitals.find(h => h.id === selectedHospitalId)?.name || 'Network Hospital'}
        departments={hospitals.find(h => h.id === selectedHospitalId)?.departments || []}
        newDocName={newDocName}
        setNewDocName={setNewDocName}
        newDocLicense={newDocLicense}
        setNewDocLicense={setNewDocLicense}
        newDocQualification={newDocQualification}
        setNewDocQualification={setNewDocQualification}
        newDocDepartment={newDocDepartment}
        setNewDocDepartment={setNewDocDepartment}
        newDocSpecialization={newDocSpecialization}
        setNewDocSpecialization={setNewDocSpecialization}
        newDocPassword={newDocPassword}
        setNewDocPassword={setNewDocPassword}
        isSubmittingDoctor={isSubmittingDoctor}
        onSubmit={handleCreateDoctorSubmit}
        onClose={() => setCreateDoctorModalOpen(false)}
      />

      <UniversalLoginModal
        isOpen={loginModalOpen}
        loginRoleTab={loginRoleTab}
        setLoginRoleTab={setLoginRoleTab}
        loginSuccessNotice={loginSuccessNotice}
        selectedHospitalId={selectedHospitalId}
        setSelectedHospitalId={setSelectedHospitalId}
        hospitals={hospitals}
        handleHospitalLogin={handleHospitalLogin}
        loginDoctorLicense={loginDoctorLicense}
        setLoginDoctorLicense={setLoginDoctorLicense}
        selectedHospitalDoctor={selectedHospitalDoctor}
        setSelectedHospitalDoctor={setSelectedHospitalDoctor}
        handleDoctorLogin={handleDoctorLogin}
        loginCitizenIdentifier={loginCitizenIdentifier}
        setLoginCitizenIdentifier={setLoginCitizenIdentifier}
        loginCitizenOtp={loginCitizenOtp}
        setLoginCitizenOtp={setLoginCitizenOtp}
        loginCitizenError={loginCitizenError}
        setLoginCitizenError={setLoginCitizenError}
        handleCitizenLogin={handleCitizenLogin}
        onClose={() => setLoginModalOpen(false)}
      />
    </div>
  );
}
