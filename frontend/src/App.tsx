import React, { useState, useEffect } from 'react';
import {
  Activity,
  FileText,
  Clock,
  Shield,
  HeartPulse,
  Stethoscope,
  RefreshCw,
  Search,
  Eye,
  X,
  History,
  FolderArchive,
  Building2,
  Download,
  CheckCircle2,
  Lock,
  QrCode,
  Users,
  FileCheck,
  KeyRound,
  Sparkles,
  Send,
  Bot,
  Copy,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { api } from './services/api';
import { LoginGatekeeper } from './components/LoginGatekeeper';

export interface AuthSession {
  role: 'HOSPITAL_ADMIN' | 'DOCTOR' | 'CITIZEN';
  hospital?: any;
  doctor?: any;
  citizen?: any;
  authenticatedAt: string;
}

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
  const [documents, setDocuments] = useState<any[]>([]);
  
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
  const [cureDate, setCureDate] = useState<string>(new Date().toISOString().split('T')[0]);
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
  const [loginFacilityCode, setLoginFacilityCode] = useState('HIP-IN-DEL-001');
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
  const [diagDepartment] = useState('Outpatient Cardiology');
  const [isSubmittingDiag, setIsSubmittingDiag] = useState(false);
  const [diagSuccessMsg, setDiagSuccessMsg] = useState('');

  // Diagnostic Report Generation Form State
  const [repDocType, setRepDocType] = useState('Comprehensive Metabolic Panel');
  const [repCategory, setRepCategory] = useState<'Metabolic' | 'Blood' | 'Renal' | 'Hepatic' | 'Imaging' | 'General'>('Metabolic');
  const [repDate] = useState(new Date().toISOString().split('T')[0]);
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
    // Strict multi-tenant isolation: A citizen can NEVER access another patient's vault
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
      // Refresh dossier
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

      // Refresh patient dossier & citizen data
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
      // Refresh dossier & citizen data
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

      // Refresh registry & hospital dashboard
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

      // Refresh dossier, registry, timeline, conditions
      const dossierRes = await api.getPatientDossier(selectedDoctorPatientId);
      setDoctorDossier(dossierRes.data);
      const regRes = await api.getHospitalPatientRegistry();
      setHospitalRegistry(regRes.data.patients);
      const docPatsRes = await api.getDoctorPatients();
      setDoctorPatients(docPatsRes.data);
      const timeRes = await api.getTimeline();
      setTimelineEvents(timeRes.data.events);

      // Refresh hospital operating dashboard & digilocker
      if (selectedHospitalId) {
        api.getHospitalDashboard(selectedHospitalId).then(r => setHospitalDashboardData(r.data)).catch(()=>{});
      }
      if (digiLockerPatientId) {
        api.getCitizenDigiLocker(digiLockerPatientId).then(r => setDigiLockerData(r.data)).catch(()=>{});
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

      // Refresh dossier, documents, timeline, registry
      const dossierRes = await api.getPatientDossier(selectedDoctorPatientId);
      setDoctorDossier(dossierRes.data);
      const docRes = await api.getDocuments();
      setDocuments(docRes.data.items);
      const timeRes = await api.getTimeline();
      setTimelineEvents(timeRes.data.events);
      const regRes = await api.getHospitalPatientRegistry();
      setHospitalRegistry(regRes.data.patients);

      // Refresh hospital operating dashboard & digilocker
      if (selectedHospitalId) {
        api.getHospitalDashboard(selectedHospitalId).then(r => setHospitalDashboardData(r.data)).catch(()=>{});
      }
      if (digiLockerPatientId) {
        api.getCitizenDigiLocker(digiLockerPatientId).then(r => setDigiLockerData(r.data)).catch(()=>{});
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

      // Refresh doctor patients and hospital registry
      const docPatsRes = await api.getDoctorPatients();
      setDoctorPatients(docPatsRes.data);
      const regRes = await api.getHospitalPatientRegistry();
      setHospitalRegistry(regRes.data.patients);

      // Select newly registered patient
      if (res.data.patient?.id) {
        handleSelectDoctorPatient(res.data.patient.id);
        api.getCitizenDigiLocker(res.data.patient.id).then(r => setDigiLockerData(r.data)).catch(()=>{});
      }
      if (selectedHospitalId) {
        api.getHospitalDashboard(selectedHospitalId).then(r => setHospitalDashboardData(r.data)).catch(()=>{});
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

      // Refresh hospital dashboard & hospitals roster
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

  // Filtered reports for the Doctor or Patient explorer
  const allReportsList = doctorDossier?.allReports || documents || [];
  const filteredReports = allReportsList.filter((doc: any) => {
    const docYear = doc.reportDate ? doc.reportDate.split('-')[0] : '';
    if (selectedYearFilter !== 'ALL' && docYear !== selectedYearFilter) return false;
    if (selectedCategoryFilter !== 'ALL' && doc.category !== selectedCategoryFilter) return false;
    if (reportSearchQuery.trim()) {
      const q = reportSearchQuery.toLowerCase();
      const matchName = doc.originalFilename?.toLowerCase().includes(q);
      const matchType = doc.documentType?.toLowerCase().includes(q);
      const matchFacility = doc.labFacility?.toLowerCase().includes(q);
      const matchFindings = doc.keyFindingsSummary?.toLowerCase().includes(q);
      if (!matchName && !matchType && !matchFacility && !matchFindings) return false;
    }
    return true;
  });

  // Group filtered reports by year
  const groupedReportsByYear: Record<string, any[]> = {};
  filteredReports.forEach((doc: any) => {
    const y = doc.reportDate ? doc.reportDate.split('-')[0] : 'Historical';
    if (!groupedReportsByYear[y]) groupedReportsByYear[y] = [];
    groupedReportsByYear[y].push(doc);
  });

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
              onClick={() => setLoginModalOpen(true)}
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
              onClick={handleLogout}
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
                  onClick={() => setHospitalActiveSubTab(tab.id as any)}
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
                  onClick={() => setHospitalActiveSubTab(tab.id as any)}
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
              { id: 'timeline', label: `🕒 All Lifetime Health Activities (${(digiLockerData?.recentTimeline?.length || timelineEvents?.length || 0)})`, icon: Clock },
              { id: 'lifetime-diseases', label: `🩺 Lifetime Diseases (${(digiLockerData?.lifetimeDiseases?.active?.length || 0) + (digiLockerData?.lifetimeDiseases?.resolved?.length || 0)})`, icon: History },
              { id: 'issued-docs', label: `📁 All Previous Records & Reports (${digiLockerData?.stats?.totalIssuedDocuments || 14})`, icon: FileText },
              { id: 'card', label: '🪪 Digital ABHA Health Card', icon: QrCode }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = digiLockerSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDigiLockerSubTab(tab.id as any)}
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

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '28px 0' }}>
        <div className="container">

          {/* ======================================================== */}
          {/* PORTAL 1: HOSPITAL INTAKE & OPD CONSOLE (HOSPITAL ADMIN) */}
          {/* ======================================================== */}
          {authSession.role === 'HOSPITAL_ADMIN' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Authenticated Role Institutional Scope Banner */}
              <div style={{
                background: 'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)',
                border: '1.5px solid #0D9488',
                borderRadius: '16px',
                padding: '16px 22px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: '#0F766E',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Building2 size={22} />
                  </div>
                  <div>
                    <div style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#0F766E',
                      letterSpacing: '0.04em'
                    }}>
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
                  <span style={{
                    background: '#0F766E',
                    color: '#FFFFFF',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    padding: '5px 12px',
                    borderRadius: '20px'
                  }}>
                    FACILITY RECEPTION & INTAKE CONSOLE
                  </span>
                </div>
              </div>

              {/* SUBTAB 1: ONBOARD PATIENT BY UNIQUE ID & LIVE OPD QUEUE */}
              {hospitalActiveSubTab === 'queue' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  
                  {/* Dedicated Hospital Onboarding Card: Onboard Patient by Unique ID to Doctor */}
                  <div className="card" style={{
                    padding: '22px 26px',
                    background: '#FFFFFF',
                    border: '1.5px solid #0D9488',
                    borderRadius: '16px',
                    boxShadow: '0 4px 16px rgba(15, 118, 110, 0.08)'
                  }}>
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
                            {(hospitals.find(h => h.id === selectedHospitalId)?.activeDoctors || [
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
                          Real-time patient intake at <strong>{hospitals.find(h => h.id === selectedHospitalId)?.name}</strong>. Onboarded patients appear with their assigned physician.
                        </p>
                      </div>

                      <button
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
                        Medical Specialists & Doctor ID Management at {hospitals.find(h => h.id === selectedHospitalId)?.name}
                      </h2>
                      <p style={{ fontSize: '0.84rem', color: '#64748B' }}>
                        This hospital issues unique doctor credentials. Authenticated specialists receive onboarded patients and inspect longitudinal cross-hospital health records.
                      </p>
                    </div>

                    <button
                      id="btn-provision-doctor"
                      onClick={() => setCreateDoctorModalOpen(true)}
                      className="btn-primary"
                      style={{ fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Users size={16} />
                      + Issue New Doctor ID & Access Credential
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                    {(hospitals.find(h => h.id === selectedHospitalId)?.activeDoctors || []).map((doc: any) => (
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
          )}

          {/* ======================================================== */}
          {/* PORTAL 2: SPECIALIST CLINICAL STATION (DOCTOR)           */}
          {/* ======================================================== */}
          {authSession.role === 'DOCTOR' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Doctor Specialist Scope Banner */}
              <div style={{
                background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
                border: '1.5px solid #0284C7',
                borderRadius: '16px',
                padding: '16px 22px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: '#0284C7',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Stethoscope size={22} />
                  </div>
                  <div>
                    <div style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#0369A1',
                      letterSpacing: '0.04em'
                    }}>
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
                    onClick={() => setDiagnosisModalOpen(true)}
                    className="btn-primary"
                    style={{ background: '#F59E0B', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Stethoscope size={15} />
                    + Record Disease Encounter
                  </button>
                  <button
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
                  
                  {/* ======================================================== */}
                  {/* FRONT CHATBOT: DOCTOR CLINICAL AI & REPORT ANALYZER      */}
                  {/* ======================================================== */}
                  <div
                    id="doctor-ai-chatbot-section"
                    className="card"
                    style={{
                      padding: '24px',
                      background: 'linear-gradient(135deg, #F0F9FF 0%, #FFFFFF 100%)',
                      border: '2px solid #0284C7',
                      borderRadius: '18px',
                      boxShadow: '0 8px 24px rgba(2, 132, 199, 0.08)'
                    }}
                  >
                    {/* Chatbot Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
                        }}>
                          <Bot size={24} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                              Clinical AI Copilot & Report Analyzer
                            </span>
                            <span style={{
                              background: '#E0F2FE',
                              color: '#0369A1',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <Sparkles size={12} />
                              CROSS-HOSPITAL SYNTHESIS
                            </span>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '2px', margin: 0 }}>
                            Write patient observations or symptoms. The AI correlates lifetime records, active/cured diseases & lab trajectories across all hospitals in real time.
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          background: '#F1F5F9',
                          border: '1px solid #CBD5E1',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: '#0F172A'
                        }}>
                          👤 Target: <strong>{doctorDossier.patient.fullName}</strong> ({doctorDossier.patient.healthId})
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsAiChatExpanded(!isAiChatExpanded)}
                          style={{
                            background: '#F0F9FF',
                            border: '1px solid #BAE6FD',
                            color: '#0284C7',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {isAiChatExpanded ? <><span>Collapse</span> <ChevronUp size={16} /></> : <><span>Open Assistant</span> <ChevronDown size={16} /></>}
                        </button>
                      </div>
                    </div>

                    {isAiChatExpanded && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Quick Prompt Chips for Physicians */}
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            ⚡ Instant Clinical Analysis Presets (Click to analyze):
                          </div>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {[
                              { label: 'High Fasting Sugar & Tingling in Toes', query: 'Patient has fatigue, elevated fasting sugar, and tingling in toes. Give his report analysis.' },
                              { label: 'Elevated BP & Chest Discomfort', query: 'Patient has elevated blood pressure and occasional chest tightness. Analyze his cardiac, lipid and hypertension history.' },
                              { label: 'Fatigue & Knee Joint Pain', query: 'Patient reports persistent fatigue and pain in knee joints. Check past vitamin D deficiency and inflammatory records.' },
                              { label: 'Complete Cross-Hospital Trajectory', query: 'Give complete cross-hospital lifetime report analysis, active conditions, and resolving reports.' }
                            ].map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleDoctorAiAnalyze(preset.query)}
                                style={{
                                  background: '#FFFFFF',
                                  border: '1px solid #BAE6FD',
                                  color: '#0369A1',
                                  padding: '6px 12px',
                                  borderRadius: '20px',
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#E0F2FE')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                              >
                                <Sparkles size={13} color="#0284C7" />
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Doctor Chatbot Input Box */}
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleDoctorAiAnalyze();
                          }}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            background: '#FFFFFF',
                            border: '1.5px solid #CBD5E1',
                            borderRadius: '12px',
                            padding: '12px'
                          }}
                        >
                          <textarea
                            rows={3}
                            placeholder='Write clinical observations or patient symptoms, e.g. "He has persistent fatigue, fasting glucose 150 mg/dL, and elevated BP. Give his report analysis to me..."'
                            value={doctorAiQuery}
                            onChange={(e) => setDoctorAiQuery(e.target.value)}
                            style={{
                              width: '100%',
                              border: 'none',
                              outline: 'none',
                              fontSize: '0.92rem',
                              fontFamily: 'inherit',
                              resize: 'vertical',
                              color: '#0F172A',
                              lineHeight: '1.5'
                            }}
                          />

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderTop: '1px solid #F1F5F9', paddingTop: '8px' }}>
                            <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                              💡 Synthesizes documents from Apollo, Fortis, Max, Dr. Lal PathLabs & Metropolis in real time.
                            </div>

                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              {doctorAiQuery && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDoctorAiQuery('');
                                    setDoctorAiResponse(null);
                                  }}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '0.8rem',
                                    color: '#64748B',
                                    cursor: 'pointer',
                                    padding: '6px 10px'
                                  }}
                                >
                                  Clear
                                </button>
                              )}
                              <button
                                type="submit"
                                disabled={doctorAiLoading || !doctorAiQuery.trim()}
                                className="btn-primary"
                                style={{
                                  background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                                  padding: '8px 18px',
                                  fontSize: '0.86rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px'
                                }}
                              >
                                {doctorAiLoading ? (
                                  <>
                                    <RefreshCw size={15} className="spin" />
                                    Analyzing Cross-Hospital Records...
                                  </>
                                ) : (
                                  <>
                                    <Send size={15} />
                                    Analyze Patient Reports →
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </form>

                        {/* AI Analysis Output Display Panel */}
                        {doctorAiResponse && (
                          <div
                            style={{
                              background: '#FFFFFF',
                              border: '1.5px solid #BAE6FD',
                              borderRadius: '14px',
                              padding: '22px',
                              boxShadow: '0 4px 16px rgba(2, 132, 199, 0.06)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '18px'
                            }}
                          >
                            {/* Analysis Header Bar */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '8px',
                                  background: '#E0F2FE',
                                  color: '#0284C7',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  <Sparkles size={18} />
                                </div>
                                <div>
                                  <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A' }}>
                                    Clinical Intelligence Synthesis Report
                                  </div>
                                  <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                                    Verified against {doctorAiResponse.correlatedReports?.length || 0} multi-hospital reports • Deterministic Grounding
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={handleCopyAiToConsultationNote}
                                style={{
                                  background: copiedAiToNote ? '#ECFDF5' : '#F0F9FF',
                                  border: copiedAiToNote ? '1.5px solid #10B981' : '1.5px solid #0284C7',
                                  color: copiedAiToNote ? '#065F46' : '#0284C7',
                                  padding: '6px 14px',
                                  borderRadius: '8px',
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                {copiedAiToNote ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                                {copiedAiToNote ? '✓ Copied to Consultation Note!' : '📋 Copy to Consultation Note'}
                              </button>
                            </div>

                            {/* Correlated Conditions Badges */}
                            {doctorAiResponse.correlatedConditions?.length > 0 && (
                              <div>
                                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>
                                  Correlated Lifetime Conditions on Record:
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                  {doctorAiResponse.correlatedConditions.map((c: any, i: number) => {
                                    const isResolved = c.currentStatus === 'RESOLVED';
                                    return (
                                      <span
                                        key={i}
                                        style={{
                                          padding: '5px 12px',
                                          borderRadius: '8px',
                                          fontSize: '0.78rem',
                                          fontWeight: 700,
                                          background: isResolved ? '#ECFDF5' : '#FEF3C7',
                                          color: isResolved ? '#065F46' : '#92400E',
                                          border: isResolved ? '1px solid #A7F3D0' : '1px solid #FDE68A',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '6px'
                                        }}
                                      >
                                        {isResolved ? '✓ CURED:' : '⚠️ ACTIVE:'} {c.conditionName} ({c.conditionCode || 'ICD-10'})
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Quantitative Lab Trajectory Table */}
                            {doctorAiResponse.correlatedLabs?.length > 0 && (
                              <div>
                                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>
                                  Longitudinal Laboratory Indicators Correlated:
                                </div>
                                <div style={{ overflowX: 'auto', border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                                    <thead>
                                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                                        <th style={{ padding: '8px 12px' }}>Biomarker</th>
                                        <th style={{ padding: '8px 12px' }}>Latest Reading</th>
                                        <th style={{ padding: '8px 12px' }}>Ref Range</th>
                                        <th style={{ padding: '8px 12px' }}>Flag</th>
                                        <th style={{ padding: '8px 12px' }}>Baseline</th>
                                        <th style={{ padding: '8px 12px' }}>Trajectory</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {doctorAiResponse.correlatedLabs.map((l: any, i: number) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                          <td style={{ padding: '8px 12px', fontWeight: 700, color: '#0F172A' }}>{l.parameterName}</td>
                                          <td style={{ padding: '8px 12px', fontWeight: 800, color: '#0284C7' }}>
                                            {l.latestValue} {l.latestUnit}
                                            <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', fontWeight: 500 }}>{l.latestDate}</span>
                                          </td>
                                          <td style={{ padding: '8px 12px', color: '#64748B' }}>{l.referenceRange}</td>
                                          <td style={{ padding: '8px 12px' }}>
                                            <span className={`badge ${l.latestFlag === 'NORMAL' ? 'badge-normal' : l.latestFlag === 'HIGH' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.72rem' }}>
                                              {l.latestFlag}
                                            </span>
                                          </td>
                                          <td style={{ padding: '8px 12px', color: '#64748B' }}>{l.baselineValue} {l.latestUnit} ({l.baselineDate})</td>
                                          <td style={{ padding: '8px 12px', fontWeight: 700, color: l.trend === 'Down' ? '#059669' : l.trend === 'Up' ? '#DC2626' : '#64748B' }}>
                                            {l.trend === 'Down' ? '📉 Improved / Down' : l.trend === 'Up' ? '📈 Elevated' : '➡️ Stable'}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {/* Full Synthesized Clinical Analysis Text */}
                            <div style={{
                              background: '#F8FAFC',
                              border: '1px solid #E2E8F0',
                              borderRadius: '10px',
                              padding: '16px',
                              fontSize: '0.88rem',
                              lineHeight: '1.6',
                              color: '#334155',
                              whiteSpace: 'pre-wrap'
                            }}>
                              {doctorAiResponse.answer}
                            </div>

                            {/* Multi-Hospital Provenance Document Citations */}
                            {doctorAiResponse.citations?.length > 0 && (
                              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748B', marginBottom: '8px' }}>
                                  🏛️ CROSS-HOSPITAL EVIDENCE CITATIONS ({doctorAiResponse.citations.length}):
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  {doctorAiResponse.citations.map((c: any, i: number) => (
                                    <div key={i} style={{ fontSize: '0.78rem', color: '#475569', background: '#F8FAFC', padding: '6px 12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                                      📄 <strong>{c.documentTitle}</strong> — {c.snippet}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Bottom Actions */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #E2E8F0' }}>
                              <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                                🛡️ MediSutra Clinical Safety: Decision-support tool grounded on patient health data.
                              </span>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  type="button"
                                  onClick={handleCopyAiToConsultationNote}
                                  className="btn-primary"
                                  style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                                >
                                  {copiedAiToNote ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                  {copiedAiToNote ? '✓ Inserted to Note' : 'Insert to Consultation Note'}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Patient Core Clinical Summary Bar */}
                  <div className="card" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
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
                      }}>
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
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '20px' }}>
                    
                    {/* LEFT COLUMN: ONGOING ACTIVE DISEASES */}
                    <div className="card" style={{ padding: '22px', border: '1.5px solid #FDE68A', background: '#FFFFFF' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #FEF3C7', paddingBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }} />
                          <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#92400E', margin: 0 }}>
                            Ongoing Diseases ({doctorDossier?.clinicalOverview?.activeConditions?.length || 0})
                          </h3>
                        </div>
                        <span className="badge" style={{ background: '#FEF3C7', color: '#B45309', fontWeight: 700, fontSize: '0.76rem' }}>
                          ACTIVE MEDICAL CARE
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#78350F', marginBottom: '16px' }}>
                        Conditions actively diagnosed requiring medication, treatment, or clinical monitoring. Click "Mark as Cured" when condition resolves.
                      </p>

                      {(!doctorDossier?.clinicalOverview?.activeConditions || doctorDossier.clinicalOverview.activeConditions.length === 0) ? (
                        <div style={{ padding: '36px 20px', textAlign: 'center', background: '#FFFBEB', borderRadius: '12px', border: '1px dashed #FCD34D' }}>
                          <CheckCircle2 size={36} color="#059669" style={{ margin: '0 auto 8px auto' }} />
                          <div style={{ fontWeight: 800, color: '#92400E', fontSize: '1rem' }}>
                            No Ongoing Diseases
                          </div>
                          <p style={{ fontSize: '0.82rem', color: '#B45309', marginTop: '4px' }}>
                            Patient is currently free of active chronic illnesses.
                          </p>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {doctorDossier.clinicalOverview.activeConditions.map((cond: any) => {
                            const isSevere = cond.severity === 'SEVERE';
                            const isMild = cond.severity === 'MILD';
                            return (
                              <div
                                key={cond.id}
                                style={{
                                  padding: '18px',
                                  borderRadius: '12px',
                                  border: '1px solid #E2E8F0',
                                  background: '#FAFAFA',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '12px',
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                                      <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                                        {cond.conditionName}
                                      </span>
                                      <span className="badge badge-normal" style={{ fontFamily: 'monospace', fontSize: '0.72rem' }}>
                                        {cond.conditionCode}
                                      </span>
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                                      System: <strong>{cond.bodySystem}</strong> • First Diagnosed: <strong>{cond.firstDocumentedDate || cond.diagnosedDate || 'Recorded'}</strong>
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <span
                                      className="badge"
                                      style={{
                                        background: isSevere ? '#FEE2E2' : isMild ? '#DBEAFE' : '#FEF3C7',
                                        color: isSevere ? '#991B1B' : isMild ? '#1E40AF' : '#92400E',
                                        fontWeight: 800,
                                        fontSize: '0.72rem'
                                      }}
                                    >
                                      {cond.severity}
                                    </span>
                                    <span className="badge badge-teal" style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                                      {cond.currentStatus}
                                    </span>
                                  </div>
                                </div>

                                <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.82rem' }}>
                                  <div style={{ color: '#334155', marginBottom: '4px' }}>
                                    <strong>Prescribed Treatment:</strong> {cond.treatmentSummary || 'Ongoing pharmacological & lifestyle regimen.'}
                                  </div>
                                  {cond.notes && (
                                    <div style={{ color: '#64748B', fontStyle: 'italic', fontSize: '0.78rem' }}>
                                      Note: {cond.notes}
                                    </div>
                                  )}
                                  <div style={{ fontSize: '0.74rem', color: '#0F766E', marginTop: '6px' }}>
                                    Diagnosing Facility: <strong>{cond.diagnosingFacility || 'Network Hospital'}</strong>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', paddingTop: '4px' }}>
                                  <button
                                    onClick={() => {
                                      setEditingCondition(cond);
                                      setNewConditionStatus(cond.currentStatus);
                                    }}
                                    style={{
                                      padding: '6px 12px',
                                      borderRadius: '6px',
                                      background: '#F1F5F9',
                                      border: '1px solid #CBD5E1',
                                      color: '#334155',
                                      fontWeight: 700,
                                      fontSize: '0.76rem',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Update Status / Note
                                  </button>

                                  {/* PRIMARY CURE CERTIFICATION ACTION */}
                                  <button
                                    onClick={() => {
                                      setCuringCondition(cond);
                                      setCureDate(new Date().toISOString().split('T')[0]);
                                      setCureEvidence('Clinical follow-up examination and confirmatory diagnostic investigation confirm complete disease resolution.');
                                    }}
                                    style={{
                                      padding: '8px 16px',
                                      borderRadius: '8px',
                                      background: '#059669',
                                      border: 'none',
                                      color: '#FFFFFF',
                                      fontWeight: 800,
                                      fontSize: '0.82rem',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      boxShadow: '0 2px 4px rgba(5, 150, 105, 0.25)'
                                    }}
                                  >
                                    <CheckCircle2 size={15} />
                                    ✓ Mark as Cured / Resolved
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* RIGHT COLUMN: OFFICIALLY CURED & RESOLVED DISEASES */}
                    <div className="card" style={{ padding: '22px', border: '1.5px solid #A7F3D0', background: '#FFFFFF' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #D1FAE5', paddingBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#059669' }} />
                          <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#065F46', margin: 0 }}>
                            Cured Diseases ({doctorDossier?.clinicalOverview?.pastResolvedDiseases?.length || 0})
                          </h3>
                        </div>
                        <span className="badge" style={{ background: '#D1FAE5', color: '#065F46', fontWeight: 800, fontSize: '0.76rem' }}>
                          OFFICIALLY RESOLVED
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#064E3B', marginBottom: '16px' }}>
                        Diseases successfully cured, with certified doctor sign-off and clinical evidence/lab report proof stored permanently.
                      </p>

                      {(!doctorDossier?.clinicalOverview?.pastResolvedDiseases || doctorDossier.clinicalOverview.pastResolvedDiseases.length === 0) ? (
                        <div style={{ padding: '36px 20px', textAlign: 'center', background: '#F0FDF4', borderRadius: '12px', border: '1px dashed #A7F3D0' }}>
                          <Activity size={36} color="#059669" style={{ margin: '0 auto 8px auto' }} />
                          <div style={{ fontWeight: 800, color: '#065F46', fontSize: '1rem' }}>
                            No Cured Records Yet
                          </div>
                          <p style={{ fontSize: '0.82rem', color: '#047857', marginTop: '4px' }}>
                            When ongoing conditions are cured, clicking "Mark as Cured" records them here with verified clinical proof.
                          </p>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {doctorDossier.clinicalOverview.pastResolvedDiseases.map((cond: any) => {
                            const proofText = cond.resolvingEvidence || cond.resolvingReportDetails || 'Confirmatory clinical laboratory evaluation demonstrates complete disease cure.';
                            return (
                              <div
                                key={cond.id}
                                style={{
                                  padding: '18px',
                                  borderRadius: '12px',
                                  border: '1.5px solid #BBF7D0',
                                  background: '#F0FDF4',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '12px',
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                                      <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#065F46' }}>
                                        {cond.conditionName}
                                      </span>
                                      <span className="badge badge-normal" style={{ fontFamily: 'monospace', fontSize: '0.72rem' }}>
                                        {cond.conditionCode}
                                      </span>
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: '#047857' }}>
                                      System: <strong>{cond.bodySystem}</strong> • Certified Cured on: <strong>{cond.resolvedDate || 'Verified'}</strong>
                                    </div>
                                  </div>

                                  <span
                                    className="badge"
                                    style={{
                                      background: '#059669',
                                      color: '#FFFFFF',
                                      fontWeight: 800,
                                      fontSize: '0.74rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                  >
                                    <CheckCircle2 size={12} />
                                    CURED
                                  </span>
                                </div>

                                {/* Clinical Evidence Box */}
                                <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '8px', border: '1px solid #A7F3D0', fontSize: '0.82rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#166534' }}>
                                    <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                                    <div>
                                      <strong>Verified Clinical Evidence:</strong> {proofText}
                                    </div>
                                  </div>

                                  <div style={{ fontSize: '0.74rem', color: '#0F766E', marginTop: '8px', borderTop: '1px solid #ECFDF5', paddingTop: '6px' }}>
                                    Certified by: <strong>{cond.certifyingDoctor || 'Attending Physician'}</strong> at <strong>{cond.curedByHospital || cond.diagnosingFacility || 'Network Hospital'}</strong>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', paddingTop: '2px' }}>
                                  <div>
                                    {cond.resolvingReportId && (
                                      <button
                                        onClick={() => {
                                          const matched = doctorDossier?.allReports?.find((d: any) => d.id === cond.resolvingReportId);
                                          if (matched) setInspectingReport(matched);
                                        }}
                                        style={{
                                          padding: '5px 10px',
                                          borderRadius: '6px',
                                          background: '#E0F2FE',
                                          border: '1px solid #BAE6FD',
                                          color: '#0369A1',
                                          fontWeight: 700,
                                          fontSize: '0.74rem',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '4px'
                                        }}
                                      >
                                        <FileText size={12} />
                                        Inspect Evidence Report
                                      </button>
                                    )}
                                  </div>

                                  <button
                                    onClick={() => handleReopenCondition(cond.id)}
                                    style={{
                                      padding: '6px 12px',
                                      borderRadius: '6px',
                                      background: '#FFFFFF',
                                      border: '1px solid #CBD5E1',
                                      color: '#64748B',
                                      fontWeight: 600,
                                      fontSize: '0.74rem',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                  >
                                    <RefreshCw size={12} />
                                    Re-open Ongoing Treatment
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* All Previous Health Records & Treatments Archive (Across All Hospitals) */}
                  <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '14px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FolderArchive size={20} color="#0284C7" />
                          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                            All Previous Health Records & Treatments ({doctorDossier.allReports?.length || 0})
                          </h3>
                        </div>
                        <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '4px' }}>
                          Chronological medical archive spanning all hospital visits, lab tests, prescriptions, and discharges throughout this patient's lifespan.
                        </p>
                      </div>

                      {/* Filters */}
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '6px 10px', borderRadius: '8px' }}>
                          <Search size={14} color="#64748B" />
                          <input
                            type="text"
                            placeholder="Filter reports..."
                            value={reportSearchQuery}
                            onChange={(e) => setReportSearchQuery(e.target.value)}
                            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.82rem', width: '130px' }}
                          />
                        </div>

                        <select
                          value={selectedYearFilter}
                          onChange={(e) => setSelectedYearFilter(e.target.value)}
                          style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', background: '#FFFFFF' }}
                        >
                          <option value="ALL">All Years</option>
                          <option value="2026">2026</option>
                          <option value="2025">2025</option>
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                        </select>

                        <select
                          value={selectedCategoryFilter}
                          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                          style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', background: '#FFFFFF' }}
                        >
                          <option value="ALL">All Categories</option>
                          <option value="Metabolic">Metabolic / Diabetes</option>
                          <option value="Blood">Blood / CBC</option>
                          <option value="Renal">Renal / KFT</option>
                          <option value="Imaging">Imaging / Ultrasound</option>
                          <option value="Prescription">Prescriptions</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                        <thead>
                          <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                            <th style={{ padding: '12px 14px' }}>Date</th>
                            <th style={{ padding: '12px 14px' }}>Document / Report</th>
                            <th style={{ padding: '12px 14px' }}>Issuing Facility</th>
                            <th style={{ padding: '12px 14px' }}>Category</th>
                            <th style={{ padding: '12px 14px' }}>Key Findings Summary</th>
                            <th style={{ padding: '12px 14px' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(doctorDossier.allReports || [])
                            .filter((rep: any) => {
                              const matchesSearch = !reportSearchQuery ||
                                rep.originalFilename?.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
                                rep.documentType?.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
                                rep.keyFindingsSummary?.toLowerCase().includes(reportSearchQuery.toLowerCase());
                              const matchesYear = selectedYearFilter === 'ALL' || (rep.reportDate && rep.reportDate.startsWith(selectedYearFilter));
                              const matchesCat = selectedCategoryFilter === 'ALL' || rep.category === selectedCategoryFilter;
                              return matchesSearch && matchesYear && matchesCat;
                            })
                            .map((rep: any) => (
                              <tr key={rep.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap' }}>
                                  {rep.reportDate}
                                </td>
                                <td style={{ padding: '12px 14px' }}>
                                  <div style={{ fontWeight: 800, color: '#0F172A' }}>{rep.documentType}</div>
                                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{rep.originalFilename}</div>
                                </td>
                                <td style={{ padding: '12px 14px', color: '#0F766E', fontWeight: 600, fontSize: '0.82rem' }}>
                                  🏛️ {rep.labFacility || rep.issuingHospital || 'Accredited Facility'}
                                </td>
                                <td style={{ padding: '12px 14px' }}>
                                  <span className="badge badge-teal" style={{ fontSize: '0.72rem' }}>{rep.category || 'Diagnostic'}</span>
                                </td>
                                <td style={{ padding: '12px 14px', color: '#334155', maxWidth: '320px', fontSize: '0.82rem' }}>
                                  {rep.keyFindingsSummary}
                                </td>
                                <td style={{ padding: '12px 14px' }}>
                                  <button
                                    onClick={() => setInspectingReport(rep)}
                                    className="btn-primary"
                                    style={{ padding: '5px 12px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                                  >
                                    Inspect Report
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

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
          )}

          {/* PORTAL 2: CITIZEN HEALTH DIGILOCKER (SOVEREIGN WALLET)   */}
          {/* ======================================================== */}
          {authSession.role === 'CITIZEN' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* DigiLocker National Header Banner */}
              <div className="card" style={{
                background: 'linear-gradient(135deg, #064E3B 0%, #0F766E 50%, #1E3A8A 100%)',
                color: '#FFFFFF',
                padding: '28px 32px',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(15, 118, 110, 0.25)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Indian Tricolor Accent Strip */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #FF9933 33.3%, #FFFFFF 33.3%, #FFFFFF 66.6%, #138808 66.6%)'
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                  <div style={{ maxWidth: '680px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '5px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px' }}>
                      <Shield size={16} />
                      GOVERNMENT OF INDIA • AYUSHMAN BHARAT DIGITAL MISSION (ABDM)
                    </div>
                    <h1 style={{ color: '#FFFFFF', fontSize: '2.1rem', marginBottom: '8px', fontWeight: 800 }}>
                      Sovereign Patient Health Record: Unified Citizen Medical Center
                    </h1>
                    <p style={{ color: '#CCFBF1', fontSize: '0.94rem', lineHeight: '1.6' }}>
                      Every time you visit <strong>Apollo Hospitals, Fortis Memorial, Max Healthcare, AIIMS, or Dr. Lal PathLabs</strong>, all disease diagnoses, prescriptions, and certified lab reports are digitally chronicled directly into your sovereign medical record.
                    </p>
                  </div>

                  {/* Authenticated Citizen Identity Badge */}
                  <div style={{
                    background: 'rgba(255,255,255,0.18)',
                    backdropFilter: 'blur(10px)',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    minWidth: '270px'
                  }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#A7F3D0', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Lock size={13} color="#6EE7B7" />
                      AUTHENTICATED SOVEREIGN VAULT
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>
                      {authSession.citizen?.fullName || digiLockerData?.patient?.fullName || 'Rahul Sharma'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#99F6E4', marginTop: '3px', fontFamily: 'monospace', fontWeight: 700 }}>
                      ABHA UHID: {authSession.citizen?.healthId || digiLockerData?.patient?.healthId || 'MED-00010001'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#CCFBF1', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} color="#34D399" /> Zero-Trust Verified • OTP Authenticated
                    </div>
                  </div>
                </div>

                {/* DigiLocker High-Level Stats Bar */}
                <div style={{
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255,255,255,0.2)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '12px'
                }}>
                  <div style={{ background: 'rgba(255,255,255,0.12)', padding: '10px 14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#CCFBF1' }}>ISSUED HEALTH DOCUMENTS</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>
                      {digiLockerData?.stats?.totalIssuedDocuments || 14} Records
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.12)', padding: '10px 14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#CCFBF1' }}>ISSUING HOSPITALS & LABS</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>
                      {digiLockerData?.stats?.totalIssuingFacilities || 4} Connected
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.12)', padding: '10px 14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#CCFBF1' }}>ACTIVE CONDITIONS</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FCD34D' }}>
                      {digiLockerData?.stats?.activeConditionsCount || 1} Ongoing
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.12)', padding: '10px 14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#CCFBF1' }}>PAST RESOLVED / CURED</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#6EE7B7' }}>
                      {digiLockerData?.stats?.resolvedConditionsCount || 2} Cured
                    </div>
                  </div>
                </div>
              </div>


              {/* ======================================================== */}
              {/* SUBTAB 0: COMPREHENSIVE PATIENT MEDICAL PROFILE & VITALS  */}
              {/* ======================================================== */}
              {/* 1. SUBTAB: ISSUED HEALTH DOCUMENTS (CORE HEALTH RECORDS VAULT) */}
              {digiLockerSubTab === 'issued-docs' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '14px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FileCheck size={20} color="#0F766E" />
                          <h2 style={{ fontSize: '1.35rem', color: '#0F172A' }}>
                            Diagnostic Records & Issued Reports ({digiLockerData?.issuedDocuments?.length || 14})
                          </h2>
                        </div>
                        <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '4px' }}>
                          Official diagnostic laboratory investigations, discharge summaries, and medical imaging digitally certified by accredited institutions.
                        </p>
                      </div>

                      {/* Search in records */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '6px 14px', borderRadius: '8px', minWidth: '260px' }}>
                        <Search size={16} color="#64748B" />
                        <input
                          type="text"
                          placeholder="Search diagnostic reports, investigations, or hospital..."
                          value={digiLockerSearchQuery}
                          onChange={(e) => setDigiLockerSearchQuery(e.target.value)}
                          style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>

                    {/* Filter by Issuing Facility */}
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', alignSelf: 'center', marginRight: '4px' }}>
                        ISSUER:
                      </span>
                      {['ALL', 'Dr. Lal PathLabs', 'Apollo Hospitals', 'Max Healthcare', 'Fortis Healthcare', 'Metropolis'].map(iss => (
                        <button
                          key={iss}
                          onClick={() => setDigiLockerIssuerFilter(iss)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: digiLockerIssuerFilter === iss ? 800 : 500,
                            background: digiLockerIssuerFilter === iss ? '#0F766E' : '#F1F5F9',
                            color: digiLockerIssuerFilter === iss ? '#FFFFFF' : '#475569',
                            border: 'none',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {iss === 'ALL' ? 'All Connected Facilities' : `🏛️ ${iss}`}
                        </button>
                      ))}
                    </div>

                    {/* Filter by Document Category */}
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', alignSelf: 'center', marginRight: '4px' }}>
                        CATEGORY:
                      </span>
                      {['ALL', 'Metabolic', 'Blood', 'Renal', 'Prescription'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setDigiLockerCategoryFilter(cat)}
                          style={{
                            padding: '4px 12px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: digiLockerCategoryFilter === cat ? 700 : 500,
                            background: digiLockerCategoryFilter === cat ? '#CCFBF1' : '#F8FAFC',
                            color: digiLockerCategoryFilter === cat ? '#0F766E' : '#64748B',
                            border: digiLockerCategoryFilter === cat ? '1px solid #0D9488' : '1px solid #E2E8F0',
                            cursor: 'pointer'
                          }}
                        >
                          {cat === 'ALL' ? 'All Document Types' : cat}
                        </button>
                      ))}
                    </div>

                    {/* DigiLocker Document Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
                      {(digiLockerData?.issuedDocuments || [])
                        .filter((doc: any) => {
                          if (digiLockerIssuerFilter !== 'ALL' && !doc.issuingAuthority.toLowerCase().includes(digiLockerIssuerFilter.toLowerCase())) return false;
                          if (digiLockerCategoryFilter !== 'ALL' && doc.category !== digiLockerCategoryFilter) return false;
                          if (digiLockerSearchQuery.trim()) {
                            const q = digiLockerSearchQuery.toLowerCase();
                            return doc.documentType?.toLowerCase().includes(q) ||
                              doc.originalFilename?.toLowerCase().includes(q) ||
                              doc.issuingAuthority?.toLowerCase().includes(q) ||
                              doc.keyFindingsSummary?.toLowerCase().includes(q);
                          }
                          return true;
                        })
                        .map((doc: any) => (
                          <div
                            key={doc.id}
                            style={{
                              border: '1px solid #E2E8F0',
                              borderRadius: '14px',
                              padding: '18px',
                              background: '#FFFFFF',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                              position: 'relative'
                            }}
                          >
                            <div>
                              {/* Header: Issuing Authority Badge */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    background: '#F0FDFA',
                                    color: '#0F766E',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    fontSize: '0.9rem'
                                  }}>
                                    🏛️
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>
                                      {doc.issuingAuthority}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                                      Date of Issue: <strong>{doc.reportDate}</strong>
                                    </div>
                                  </div>
                                </div>
                                <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                                  {doc.category}
                                </span>
                              </div>

                              {/* Title */}
                              <h3 style={{ fontSize: '1.05rem', color: '#0F172A', fontWeight: 800, marginBottom: '6px' }}>
                                {doc.documentType}
                              </h3>

                              {/* Digital Signature Badge */}
                              <div style={{
                                background: '#F0FDF4',
                                border: '1px solid #BBF7D0',
                                padding: '6px 10px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.72rem',
                                color: '#15803D',
                                fontWeight: 700,
                                marginBottom: '10px'
                              }}>
                                <CheckCircle2 size={13} color="#16A34A" />
                                DIGITALLY SIGNED & VERIFIED BY MOHFW / ABDM (SHA-256)
                              </div>

                              {/* Findings Summary */}
                              <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: '1.5', background: '#F8FAFC', padding: '10px', borderRadius: '8px' }}>
                                {doc.keyFindingsSummary}
                              </p>

                              {doc.abnormalCount > 0 && (
                                <div style={{ marginTop: '8px', fontSize: '0.74rem', color: '#DC2626', fontWeight: 700 }}>
                                  ⚠ {doc.abnormalCount} Parameter(s) flagged outside clinical reference range
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '8px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                              <button
                                onClick={() => setInspectingReport(doc)}
                                className="btn-secondary"
                                style={{ flex: 1, padding: '7px 10px', fontSize: '0.8rem', justifyContent: 'center' }}
                              >
                                <Eye size={14} />
                                Inspect Findings
                              </button>
                              <button
                                onClick={() => alert(`Verified Sovereign Health Certificate for ${doc.documentType}\nIssuer: ${doc.issuingAuthority}\nHash: ${doc.digitalSignature?.hash}`)}
                                className="btn-primary"
                                style={{ flex: 1, padding: '7px 10px', fontSize: '0.8rem', justifyContent: 'center' }}
                              >
                                <Download size={14} />
                                Certified Copy
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. SUBTAB: OFFICIAL ABHA DIGITAL HEALTH ID CARD */}
              {digiLockerSubTab === 'card' && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
                  <div style={{
                    maxWidth: '520px',
                    width: '100%',
                    background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                    borderRadius: '24px',
                    color: '#FFFFFF',
                    padding: '28px',
                    boxShadow: '0 16px 36px rgba(0,0,0,0.25)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    position: 'relative'
                  }}>
                    {/* Tricolor top stripe */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '5px',
                      borderRadius: '24px 24px 0 0',
                      background: 'linear-gradient(90deg, #FF9933 33.3%, #FFFFFF 33.3%, #FFFFFF 66.6%, #138808 66.6%)'
                    }} />

                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #0F766E, #0D9488)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF'
                        }}>
                          <HeartPulse size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', color: '#94A3B8' }}>
                            NATIONAL HEALTH AUTHORITY
                          </div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF' }}>
                            AYUSHMAN BHARAT DIGITAL MISSION
                          </div>
                        </div>
                      </div>
                      <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700, color: '#38BDF8' }}>
                        SOVEREIGN VAULT
                      </span>
                    </div>

                    {/* Citizen Details with Photo / QR */}
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                      <div style={{
                        width: '76px',
                        height: '76px',
                        borderRadius: '16px',
                        background: '#334155',
                        border: '2px solid #38BDF8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.8rem',
                        fontWeight: 800,
                        color: '#38BDF8'
                      }}>
                        {digiLockerData?.digitalHealthCard?.fullName?.split(' ').map((n: string) => n[0]).join('') || 'RS'}
                      </div>
                      <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
                          {digiLockerData?.digitalHealthCard?.fullName || 'Rahul Sharma'}
                        </h2>
                        <div style={{ fontSize: '0.84rem', color: '#94A3B8' }}>
                          DOB: <strong>{digiLockerData?.digitalHealthCard?.dob || '1987-05-14'}</strong> • Gender: <strong>{digiLockerData?.digitalHealthCard?.gender || 'Male'}</strong>
                        </div>
                        <div style={{ fontSize: '0.84rem', color: '#94A3B8', marginTop: '2px' }}>
                          Blood Group: <strong style={{ color: '#F87171' }}>{digiLockerData?.digitalHealthCard?.bloodGroup || 'B+'}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Identifiers Grid */}
                    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '14px', padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '18px' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>SOVEREIGN DIGITAL HEALTH ID (UHID)</div>
                        <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#38BDF8', fontFamily: 'monospace' }}>
                          {digiLockerData?.digitalHealthCard?.uhid || 'MED-00010001'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>ABHA NUMBER</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'monospace' }}>
                          {digiLockerData?.digitalHealthCard?.abhaNumber || '91-4402-9812-1001'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>ABHA ADDRESS</div>
                        <div style={{ fontSize: '0.85rem', color: '#E2E8F0', fontWeight: 700 }}>
                          {digiLockerData?.digitalHealthCard?.abhaAddress || 'rahulsharma@abdm'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>ALLERGIES</div>
                        <div style={{ fontSize: '0.82rem', color: '#F87171', fontWeight: 700 }}>
                          {digiLockerData?.digitalHealthCard?.allergies?.join(', ') || 'Sulfa, Penicillin'}
                        </div>
                      </div>
                    </div>

                    {/* QR Code & Scan Pass */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.08)', padding: '12px 16px', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: '#FFFFFF', padding: '6px', borderRadius: '8px', color: '#0F172A' }}>
                          <QrCode size={36} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFFFFF' }}>
                            Touchless Hospital Pass
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                            Scan at Apollo, Fortis, Max or AIIMS reception
                          </div>
                        </div>
                      </div>
                      <span style={{ background: '#16A34A', color: '#FFFFFF', padding: '4px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800 }}>
                        ✓ VERIFIED
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. SUBTAB: LIFETIME DISEASE RECORD (ACTIVE & RESOLVED) */}
              {digiLockerSubTab === 'lifetime-diseases' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Active Conditions */}
                  <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <Activity size={20} color="#D97706" />
                      <h2 style={{ fontSize: '1.35rem', color: '#0F172A' }}>
                        Active Documented Illnesses ({digiLockerData?.lifetimeDiseases?.active?.length || 1})
                      </h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                      {(digiLockerData?.lifetimeDiseases?.active || []).map((c: any) => (
                        <div key={c.id} style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '18px', borderRadius: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#92400E' }}>{c.conditionName}</h3>
                            <span className="badge badge-warning">{c.currentStatus}</span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#78350F', marginBottom: '6px' }}>
                            Diagnosed At: <strong>{c.diagnosingFacility || 'Network Super Speciality'}</strong>
                          </div>
                          <div style={{ fontSize: '0.84rem', color: '#451A03', lineHeight: '1.5' }}>
                            {c.treatmentSummary || 'Ongoing pharmacological management and longitudinal monitoring.'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Past Resolved Illnesses with Resolving Evidence */}
                  <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <CheckCircle2 size={20} color="#059669" />
                      <h2 style={{ fontSize: '1.35rem', color: '#0F172A' }}>
                        Past Resolved Illnesses with Clinical Evidence ({digiLockerData?.lifetimeDiseases?.resolved?.length || 2})
                      </h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                      {(digiLockerData?.lifetimeDiseases?.resolved || []).map((c: any) => (
                        <div key={c.id} style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '18px', borderRadius: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#065F46' }}>{c.conditionName}</h3>
                            <span className="badge badge-normal">✓ RESOLVED ({c.resolvedDate || '2024'})</span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#047857', marginBottom: '8px' }}>
                            Diagnosed At: <strong>{c.diagnosingFacility || 'Network Clinic'}</strong>
                          </div>
                          <div style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: '8px', border: '1px solid #D1FAE5' }}>
                            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#065F46', marginBottom: '4px' }}>
                              📄 RESOLVING CLINICAL EVIDENCE:
                            </div>
                            <div style={{ fontSize: '0.82rem', color: '#1F2937' }}>
                              {c.resolvingReportDetails?.title || 'Confirmatory follow-up lab investigation within normal range.'}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#6B7280', marginTop: '2px' }}>
                              Issued by {c.resolvingReportDetails?.facility || 'Dr. Lal PathLabs'} on {c.resolvingReportDetails?.reportDate || c.resolvedDate}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 1. SUBTAB: ALL PREVIOUS LIFETIME HEALTH ACTIVITIES THROUGHOUT LIFE */}
              {digiLockerSubTab === 'timeline' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Timeline Header Card */}
                  <div className="card" style={{ padding: '24px 28px', background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 50%, #ECFEFF 100%)', border: '1.5px solid #A7F3D0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      <div style={{ maxWidth: '720px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#DCFCE7', color: '#15803D', padding: '4px 12px', borderRadius: '16px', fontSize: '0.76rem', fontWeight: 800, marginBottom: '8px' }}>
                          <Clock size={14} />
                          COMPLETE LIFELONG HEALTH CHRONICLE
                        </div>
                        <h2 style={{ fontSize: '1.55rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.25 }}>
                          All Lifetime Health Activities & Treatments Throughout Life
                        </h2>
                        <p style={{ fontSize: '0.86rem', color: '#475569', marginTop: '6px', lineHeight: 1.5 }}>
                          Every hospital consultation, doctor checkup, disease diagnosis, confirmed clinical cure, and laboratory test result conducted at any hospital across India is chronicled below in chronological order.
                        </p>
                      </div>

                      {/* Quick Summary Pill */}
                      <div style={{ background: '#FFFFFF', padding: '12px 18px', borderRadius: '12px', border: '1px solid #CBD5E1', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>TOTAL LIFETIME ACTIVITIES</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F766E' }}>
                          {(digiLockerData?.recentTimeline || timelineEvents || []).length}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>
                          Across {digiLockerData?.facilitiesHoldingRecords?.length || 4} Connected Facilities
                        </div>
                      </div>
                    </div>

                    {/* Activity Filter Chips Bar */}
                    <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748B' }}>FILTER ACTIVITY:</span>
                        {[
                          { id: 'ALL', label: 'All Activities', icon: '📋' },
                          { id: 'CONSULTATION', label: 'Hospital Visits & Onboarding', icon: '🏥' },
                          { id: 'DIAGNOSIS', label: 'Diagnoses & Cures', icon: '🩺' },
                          { id: 'LAB_RESULT', label: 'Diagnostic Lab Reports', icon: '🧪' }
                        ].map(f => {
                          const isSel = digiLockerTimelineFilter === f.id;
                          return (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => setDigiLockerTimelineFilter(f.id)}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '8px',
                                border: isSel ? '2px solid #0F766E' : '1px solid #CBD5E1',
                                background: isSel ? '#0F766E' : '#FFFFFF',
                                color: isSel ? '#FFFFFF' : '#334155',
                                fontWeight: isSel ? 800 : 600,
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <span>{f.icon}</span>
                              <span>{f.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        Showing <strong>{
                          (digiLockerData?.recentTimeline || timelineEvents || []).filter((e: any) =>
                            digiLockerTimelineFilter === 'ALL' || e.eventType === digiLockerTimelineFilter
                          ).length
                        }</strong> records
                      </div>
                    </div>
                  </div>

                  {/* Chronological Activity Feed */}
                  <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {(digiLockerData?.recentTimeline || timelineEvents || [])
                        .filter((e: any) => digiLockerTimelineFilter === 'ALL' || e.eventType === digiLockerTimelineFilter)
                        .map((e: any, idx: number) => {
                          const isCure = (e.title && e.title.toLowerCase().includes('cure')) || (e.summary && e.summary.toLowerCase().includes('cured'));
                          const isDiagnosis = e.eventType === 'DIAGNOSIS' && !isCure;
                          const isLab = e.eventType === 'LAB_RESULT';

                          return (
                            <div
                              key={e.id || idx}
                              style={{
                                display: 'flex',
                                gap: '16px',
                                padding: '18px 20px',
                                background: isCure ? '#F0FDF4' : isDiagnosis ? '#FFFBEB' : '#F8FAFC',
                                borderRadius: '14px',
                                border: isCure ? '1.5px solid #86EFAC' : isDiagnosis ? '1.5px solid #FDE68A' : '1px solid #E2E8F0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                background: isCure ? '#DCFCE7' : isDiagnosis ? '#FEF3C7' : isLab ? '#DBEAFE' : '#E0E7FF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.3rem',
                                flexShrink: 0
                              }}>
                                {isCure ? '✓' : isDiagnosis ? '🩺' : isLab ? '🧪' : '🏥'}
                              </div>

                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: isCure ? '#065F46' : isDiagnosis ? '#92400E' : '#0F172A', margin: 0 }}>
                                        {e.title}
                                      </h4>
                                      <span
                                        className="badge"
                                        style={{
                                          background: isCure ? '#059669' : isDiagnosis ? '#F59E0B' : isLab ? '#2563EB' : '#4F46E5',
                                          color: '#FFFFFF',
                                          fontWeight: 800,
                                          fontSize: '0.72rem'
                                        }}
                                      >
                                        {isCure ? 'CLINICAL CURE' : e.eventType || 'ACTIVITY'}
                                      </span>
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '3px' }}>
                                      Date of Activity: <strong style={{ color: '#0F172A' }}>{e.eventDate}</strong>
                                      {e.bodySystem && <> • System: <strong>{e.bodySystem}</strong></>}
                                    </div>
                                  </div>

                                  <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      background: '#FFFFFF',
                                      border: '1px solid #CBD5E1',
                                      padding: '4px 10px',
                                      borderRadius: '8px',
                                      fontSize: '0.76rem',
                                      fontWeight: 700,
                                      color: '#0F766E'
                                    }}>
                                      🏛️ {e.hospitalFacility || 'Accredited Healthcare Facility'}
                                    </span>
                                  </div>
                                </div>

                                <p style={{ fontSize: '0.86rem', color: '#334155', lineHeight: '1.55', margin: '6px 0 8px 0' }}>
                                  {e.summary}
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '8px', fontSize: '0.78rem' }}>
                                  <div style={{ color: '#047857', fontWeight: 600 }}>
                                    {e.attendingDoctor ? `👨‍⚕️ Attending Physician: ${e.attendingDoctor}` : 'Verified Network Encounter'}
                                  </div>
                                  <div style={{ color: '#64748B' }}>
                                    Audit ID: <code style={{ fontSize: '0.74rem', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>{e.id}</code>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}

              
            </div>
          )}

          
        </div>
      </main>

      {/* ======================================================== */}
      {/* MODAL 1: REPORT FINDINGS & VALUES INSPECTOR              */}
      {/* ======================================================== */}
      {inspectingReport && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '780px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '18px' }}>
              <div>
                <span className="badge badge-teal" style={{ marginBottom: '6px' }}>
                  {inspectingReport.category || 'Diagnostic'}
                </span>
                <h3 style={{ fontSize: '1.35rem', color: '#0F172A' }}>
                  {inspectingReport.originalFilename}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }}>
                  Facility: <strong>{inspectingReport.labFacility || 'Diagnostic Laboratory'}</strong> • Date: <strong>{inspectingReport.reportDate}</strong>
                </p>
              </div>

              <button
                onClick={() => setInspectingReport(null)}
                style={{ padding: '6px', borderRadius: '8px', background: '#F1F5F9' }}
              >
                <X size={20} color="#64748B" />
              </button>
            </div>

            {/* Findings Overview */}
            <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F766E', marginBottom: '4px' }}>
                CLINICAL IMPRESSION & KEY FINDINGS:
              </div>
              <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>
                {inspectingReport.keyFindingsSummary}
              </p>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '8px', fontFamily: 'monospace' }}>
                SHA-256: {inspectingReport.sha256Hash} • OCR Confidence: {Math.round(inspectingReport.extractionConfidence * 100)}%
              </div>
            </div>

            {/* Extracted Lab Parameters Table */}
            <div>
              <h4 style={{ fontSize: '1.05rem', color: '#0F172A', marginBottom: '10px' }}>
                Extracted Lab Parameters & Quantitative Values
              </h4>

              {inspectingReport.extractedLabs && inspectingReport.extractedLabs.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                        <th style={{ padding: '10px 14px' }}>Test Parameter</th>
                        <th style={{ padding: '10px 14px' }}>Measured Value</th>
                        <th style={{ padding: '10px 14px' }}>Reference Range</th>
                        <th style={{ padding: '10px 14px' }}>Clinical Flag</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inspectingReport.extractedLabs.map((lab: any) => (
                        <tr key={lab.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0F172A' }}>
                            {lab.parameterName}
                          </td>
                          <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>
                            {lab.numericValue} {lab.rawUnit}
                          </td>
                          <td style={{ padding: '12px 14px', color: '#64748B' }}>
                            {lab.referenceMin} - {lab.referenceMax} {lab.rawUnit}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span className={`badge ${lab.flag === 'NORMAL' ? 'badge-normal' : lab.flag === 'HIGH' ? 'badge-danger' : 'badge-warning'}`}>
                              {lab.flag}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '8px', color: '#64748B', fontSize: '0.88rem' }}>
                  Detailed qualitative narrative report with no numerical table parameters. Findings verified above.
                </div>
              )}
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setInspectingReport(null)} className="btn-secondary">
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: DOCTOR CONDITION STATUS UPDATER                 */}
      {/* ======================================================== */}
      {editingCondition && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '580px', width: '100%', padding: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#0F172A' }}>
                Update Condition Clinical Status
              </h3>
              <button onClick={() => setEditingCondition(null)} style={{ padding: '6px', borderRadius: '8px', background: '#F1F5F9' }}>
                <X size={18} color="#64748B" />
              </button>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                Condition Name:
              </label>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>
                {editingCondition.conditionName}
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                New Clinical Status:
              </label>
              <select
                value={newConditionStatus}
                onChange={(e) => setNewConditionStatus(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
              >
                <option value="UNDER_TREATMENT">UNDER_TREATMENT (Active medication & care)</option>
                <option value="STABLE">STABLE (Parameters within target window)</option>
                <option value="IMPROVING">IMPROVING (Favorable downward or upward delta)</option>
                <option value="MONITORING">MONITORING (Observation without dosage changes)</option>
                <option value="RESOLVED">RESOLVED (Cured / Normalized laboratory findings)</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                Physician Assessment Note:
              </label>
              <textarea
                rows={3}
                placeholder="State clinical reasoning for updating status (e.g., patient achieved target HbA1c < 7.0%)..."
                value={statusUpdateNote}
                onChange={(e) => setStatusUpdateNote(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setEditingCondition(null)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleSaveConditionStatus} className="btn-primary">
                {statusUpdateSuccess ? 'Saved Successfully!' : 'Save Status Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: OFFICIAL CLINICAL CURE CERTIFICATION               */}
      {/* ======================================================== */}
      {curingCondition && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px', border: '2px solid #059669' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="badge" style={{ background: '#D1FAE5', color: '#065F46', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <CheckCircle2 size={13} color="#059669" />
                    NATIONAL CURE REGISTRY
                  </span>
                  <span className="badge badge-normal">
                    {curingCondition.conditionCode || 'ICD-10'}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.35rem', color: '#0F172A', fontWeight: 800 }}>
                  Certify Disease as Cured: {curingCondition.conditionName}
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '4px' }}>
                  Patient: <strong>{doctorDossier?.patient?.fullName || 'Patient'}</strong> ({doctorDossier?.patient?.healthId})
                </p>
              </div>
              <button 
                onClick={() => setCuringCondition(null)}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}
              >
                <X size={18} color="#64748B" />
              </button>
            </div>

            {cureSuccessNotice ? (
              <div style={{ padding: '20px', background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: '12px', textAlign: 'center', color: '#065F46', fontWeight: 700 }}>
                <CheckCircle2 size={36} color="#059669" style={{ margin: '0 auto 10px auto' }} />
                <div style={{ fontSize: '1.1rem' }}>{cureSuccessNotice}</div>
                <div style={{ fontSize: '0.82rem', marginTop: '4px', fontWeight: 500, color: '#047857' }}>
                  Condition permanently moved to Cured Records with immutable audit trail.
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmCure}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ padding: '14px', background: '#F0FDF4', borderRadius: '10px', border: '1px solid #BBF7D0', fontSize: '0.85rem', color: '#166534', lineHeight: 1.5 }}>
                    <strong>Clinical Notice:</strong> Marking this condition as <strong>CURED</strong> will transition it from active disease tracking to the verified cured registry. Accredited hospitals and treating physicians nationwide will have instant access to this verified clinical outcome.
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Official Cure / Resolution Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={cureDate}
                        onChange={e => setCureDate(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Certifying Care Facility
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={hospitals.find(h => h.id === selectedHospitalId)?.name || 'Apollo Hospitals & Heart Institute'}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '0.88rem', color: '#475569' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Certifying Physician / Specialist
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedHospitalDoctor || 'Attending Physician'}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '0.88rem', color: '#475569' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Clinical Evidence & Resolution Criteria Proof *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={cureEvidence}
                      onChange={e => setCureEvidence(e.target.value)}
                      placeholder="e.g. Platelet count recovered to normal (210,000/µL), asymptomatic for >14 days, repeat culture negative, clinical remission verified."
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontFamily: 'inherit', resize: 'vertical' }}
                    />
                    <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '4px' }}>
                      Specify laboratory findings, radiological clearance, or clinical criteria confirming remission.
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setCuringCondition(null)}
                      className="btn-secondary"
                      disabled={isSubmittingCure}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingCure}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        background: '#059669',
                        color: '#FFFFFF',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <CheckCircle2 size={16} />
                      {isSubmittingCure ? 'Recording Cure...' : 'Confirm & Certify Clinical Cure'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ONBOARD PATIENT TO DOCTOR BY UNIQUE HEALTH ID     */}
      {/* ======================================================== */}
      {onboardModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '20px'
        }}>
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
                onClick={() => setOnboardModalOpen(false)}
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
                  <button onClick={() => setOnboardModalOpen(false)} className="btn-secondary">
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setOnboardModalOpen(false);
                      setHospitalActiveSubTab('queue');
                    }}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Stethoscope size={16} />
                    View Patient in Doctor Dashboard →
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleOnboardPatientToDoctor}>
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
                      Patient Unique Health ID (UHID / ABHA ID) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MED-00010001"
                      value={onboardHealthId}
                      onChange={e => setOnboardHealthId(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #0F766E', fontSize: '0.95rem', fontFamily: 'monospace', fontWeight: 700 }}
                    />
                    <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '4px' }}>
                      The patient's sovereign unique ID connects their full longitudinal history from all accredited hospitals.
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Assign to Doctor Dashboard *
                      </label>
                      <select
                        value={onboardDoctorName}
                        onChange={e => setOnboardDoctorName(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                      >
                        {(hospitals.find(h => h.id === selectedHospitalId)?.activeDoctors || [
                          { name: 'Dr. Priya Nair', specialization: 'Endocrinologist' },
                          { name: 'Dr. Alok Sen', specialization: 'Cardiologist' },
                          { name: 'Dr. Sunita Rao', specialization: 'Pulmonologist' }
                        ]).map((doc: any, i: number) => (
                          <option key={i} value={doc.name}>
                            {doc.name} ({doc.specialization || 'Attending Specialist'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Clinical Department
                      </label>
                      <input
                        type="text"
                        value={onboardDepartment}
                        onChange={e => setOnboardDepartment(e.target.value)}
                        placeholder="e.g. Outpatient Medicine / Cardiology"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Reason for Consultation / Chief Complaint *
                      </label>
                      <input
                        type="text"
                        required
                        value={onboardComplaint}
                        onChange={e => setOnboardComplaint(e.target.value)}
                        placeholder="e.g. Longitudinal medical records review, diabetes management, second opinion"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Priority
                      </label>
                      <select
                        value={onboardPriority}
                        onChange={e => setOnboardPriority(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
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
                      onClick={() => setOnboardModalOpen(false)}
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
      )}

      {/* ======================================================== */}
      {/* MODAL 4: RECORD DISEASE ENCOUNTER AT HOSPITAL           */}
      {/* ======================================================== */}
      {diagnosisModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '18px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FEF3C7', color: '#B45309', padding: '4px 10px', borderRadius: '14px', fontSize: '0.74rem', fontWeight: 800, marginBottom: '6px' }}>
                  <Stethoscope size={13} />
                  CROSS-HOSPITAL CLINICAL ENCOUNTER
                </div>
                <h3 style={{ fontSize: '1.35rem', color: '#0F172A' }}>
                  Record Clinical Diagnosis Encounter
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '2px' }}>
                  Issuing Facility: <strong>{hospitals.find(h => h.id === selectedHospitalId)?.name || 'Apollo Hospitals'}</strong> • Attending: <strong>{selectedHospitalDoctor}</strong>
                </p>
              </div>

              <button onClick={() => setDiagnosisModalOpen(false)} style={{ padding: '6px', borderRadius: '8px', background: '#F1F5F9' }}>
                <X size={20} color="#64748B" />
              </button>
            </div>

            {diagSuccessMsg && (
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '12px 16px', borderRadius: '10px', color: '#065F46', fontSize: '0.88rem', fontWeight: 700, marginBottom: '16px' }}>
                ✓ {diagSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSaveDiagnosisEncounter} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                  Target Patient:
                </label>
                <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem', color: '#0F172A', fontWeight: 700 }}>
                  👤 {doctorDossier?.patient?.fullName} ({doctorDossier?.patient?.healthId}) • Blood: {doctorDossier?.patient?.bloodGroup}
                </div>
              </div>

              {/* Quick Disease Presets */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '6px' }}>
                  QUICK DIAGNOSIS PRESETS:
                </label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    { name: 'Essential Hypertension', code: 'I10', sys: 'Cardiovascular' },
                    { name: 'Acute Bronchitis', code: 'J20.9', sys: 'Respiratory' },
                    { name: 'Dengue Fever (Non-Severe)', code: 'A90', sys: 'Blood' },
                    { name: 'Primary Osteoarthritis of Knee', code: 'M17.1', sys: 'Musculoskeletal' },
                    { name: 'Non-Alcoholic Fatty Liver (Grade 1)', code: 'K76.0', sys: 'Hepatic' }
                  ].map(p => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        setDiagConditionName(p.name);
                        setDiagConditionCode(p.code);
                        setDiagBodySystem(p.sys);
                      }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        background: '#F8FAFC',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        color: '#334155'
                      }}
                    >
                      + {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Disease / Condition Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Essential Hypertension"
                    value={diagConditionName}
                    onChange={(e) => setDiagConditionName(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    ICD-10 Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. I10"
                    value={diagConditionCode}
                    onChange={(e) => setDiagConditionCode(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Body System
                  </label>
                  <select
                    value={diagBodySystem}
                    onChange={(e) => setDiagBodySystem(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  >
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Metabolic">Metabolic</option>
                    <option value="Hepatic">Hepatic</option>
                    <option value="Renal">Renal</option>
                    <option value="Blood">Blood</option>
                    <option value="Skin">Skin</option>
                    <option value="Musculoskeletal">Musculoskeletal</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Clinical Severity
                  </label>
                  <select
                    value={diagSeverity}
                    onChange={(e) => setDiagSeverity(e.target.value as any)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  >
                    <option value="MILD">MILD</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="SEVERE">SEVERE</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Condition Status
                  </label>
                  <select
                    value={diagStatus}
                    onChange={(e) => setDiagStatus(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  >
                    <option value="DIAGNOSED">DIAGNOSED</option>
                    <option value="UNDER_TREATMENT">UNDER_TREATMENT</option>
                    <option value="MONITORING">MONITORING</option>
                    <option value="SUSPECTED">SUSPECTED</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                  Clinical Assessment & Examination Notes *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Physical exam findings, presenting complaints, vitals, auscultation results..."
                  value={diagNotes}
                  onChange={(e) => setDiagNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                  Prescribed Therapy & Rx Regimen
                </label>
                <textarea
                  rows={2}
                  placeholder="Pharmacotherapy dosage, dietary adjustments, physical therapy guidelines..."
                  value={diagRx}
                  onChange={(e) => setDiagRx(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setDiagnosisModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmittingDiag} className="btn-primary" style={{ background: '#F59E0B' }}>
                  {isSubmittingDiag ? 'Recording Diagnosis...' : 'Record Diagnosis to Platform'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: ISSUE DIAGNOSTIC LAB REPORT AT FACILITY         */}
      {/* ======================================================== */}
      {issueReportModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '780px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '18px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#DBEAFE', color: '#1D4ED8', padding: '4px 10px', borderRadius: '14px', fontSize: '0.74rem', fontWeight: 800, marginBottom: '6px' }}>
                  <FolderArchive size={13} />
                  LABORATORY & IMAGING INGESTION
                </div>
                <h3 style={{ fontSize: '1.35rem', color: '#0F172A' }}>
                  Issue Diagnostic Report into Human Report Center
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '2px' }}>
                  Generating Laboratory: <strong>{hospitals.find(h => h.id === selectedHospitalId)?.name || 'Dr. Lal PathLabs'}</strong>
                </p>
              </div>

              <button onClick={() => setIssueReportModalOpen(false)} style={{ padding: '6px', borderRadius: '8px', background: '#F1F5F9' }}>
                <X size={20} color="#64748B" />
              </button>
            </div>

            {reportSuccessMsg && (
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '12px 16px', borderRadius: '10px', color: '#065F46', fontSize: '0.88rem', fontWeight: 700, marginBottom: '16px' }}>
                ✓ {reportSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSaveDiagnosticReport} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Presets */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '6px' }}>
                  QUICK PANEL PRESETS:
                </label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setRepDocType('Lipid Profile Examination');
                      setRepCategory('Metabolic');
                      setRepFindings('Serum Triglycerides elevated; HDL cholesterol border-line normal.');
                      setRepLabs([
                        { parameterName: 'Total Cholesterol', parameterCode: 'CHOL_TOTAL', numericValue: 215, rawUnit: 'mg/dL', referenceMin: 125, referenceMax: 200, flag: 'HIGH' },
                        { parameterName: 'Triglycerides', parameterCode: 'TRIGLYCERIDES', numericValue: 195, rawUnit: 'mg/dL', referenceMin: 50, referenceMax: 150, flag: 'HIGH' },
                        { parameterName: 'HDL Cholesterol', parameterCode: 'HDL', numericValue: 44, rawUnit: 'mg/dL', referenceMin: 40, referenceMax: 60, flag: 'NORMAL' },
                        { parameterName: 'LDL Cholesterol', parameterCode: 'LDL', numericValue: 132, rawUnit: 'mg/dL', referenceMin: 60, referenceMax: 100, flag: 'HIGH' }
                      ]);
                    }}
                    style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#F8FAFC', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    ⚡ Lipid Panel
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRepDocType('Renal Function & Electrolyte Panel');
                      setRepCategory('Renal');
                      setRepFindings('Serum Creatinine normal. Good renal reserve and electrolyte stability.');
                      setRepLabs([
                        { parameterName: 'Serum Creatinine', parameterCode: 'CREATININE', numericValue: 0.95, rawUnit: 'mg/dL', referenceMin: 0.7, referenceMax: 1.3, flag: 'NORMAL' },
                        { parameterName: 'Blood Urea Nitrogen', parameterCode: 'BUN', numericValue: 16, rawUnit: 'mg/dL', referenceMin: 7, referenceMax: 20, flag: 'NORMAL' },
                        { parameterName: 'Estimated GFR', parameterCode: 'EGFR', numericValue: 98, rawUnit: 'mL/min', referenceMin: 90, referenceMax: 120, flag: 'NORMAL' }
                      ]);
                    }}
                    style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#F8FAFC', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    ⚡ Renal (KFT) Panel
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRepDocType('Complete Hemogram (CBC)');
                      setRepCategory('Blood');
                      setRepFindings('Hemoglobin within physiological range. Leukocyte counts normal.');
                      setRepLabs([
                        { parameterName: 'Hemoglobin', parameterCode: 'HB', numericValue: 14.5, rawUnit: 'g/dL', referenceMin: 13.0, referenceMax: 17.0, flag: 'NORMAL' },
                        { parameterName: 'Total Leukocyte Count', parameterCode: 'WBC', numericValue: 6800, rawUnit: '/µL', referenceMin: 4000, referenceMax: 10000, flag: 'NORMAL' },
                        { parameterName: 'Platelet Count', parameterCode: 'PLATELETS', numericValue: 240000, rawUnit: '/µL', referenceMin: 150000, referenceMax: 450000, flag: 'NORMAL' }
                      ]);
                    }}
                    style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#F8FAFC', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    ⚡ CBC Hemogram
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Document Type / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Comprehensive Metabolic Panel"
                    value={repDocType}
                    onChange={(e) => setRepDocType(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={repCategory}
                    onChange={(e) => setRepCategory(e.target.value as any)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  >
                    <option value="Metabolic">Metabolic</option>
                    <option value="Blood">Blood</option>
                    <option value="Renal">Renal</option>
                    <option value="Hepatic">Hepatic</option>
                    <option value="Imaging">Imaging</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                  Clinical Findings Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Primary impression, notable abnormalities, clinical recommendations..."
                  value={repFindings}
                  onChange={(e) => setRepFindings(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                />
              </div>

              {/* Link to Condition / Resolving option */}
              <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'center' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                      Link to Patient Condition (Optional):
                    </label>
                    <select
                      value={repLinkedCondId}
                      onChange={(e) => setRepLinkedCondId(e.target.value)}
                      style={{ width: '100%', padding: '6px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    >
                      <option value="">No Condition Link</option>
                      {doctorDossier?.clinicalOverview?.activeConditions?.map((c: any) => (
                        <option key={c.id} value={c.id}>
                          {c.conditionName} ({c.currentStatus})
                        </option>
                      ))}
                    </select>
                  </div>

                  {repLinkedCondId && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 700, color: '#059669', cursor: 'pointer', marginTop: '18px' }}>
                      <input
                        type="checkbox"
                        checked={repMarkResolved}
                        onChange={(e) => setRepMarkResolved(e.target.checked)}
                      />
                      Mark this condition as RESOLVED with this report
                    </label>
                  )}
                </div>
              </div>

              {/* Lab Parameters Table */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A' }}>
                    Extracted Quantitative Lab Parameters ({repLabs.length}):
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setRepLabs([...repLabs, { parameterName: 'New Parameter', parameterCode: 'PARAM', numericValue: 100, rawUnit: 'mg/dL', referenceMin: 50, referenceMax: 150, flag: 'NORMAL' }]);
                    }}
                    style={{ fontSize: '0.78rem', color: '#0F766E', fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >
                    + Add Parameter
                  </button>
                </div>

                <div style={{ overflowX: 'auto', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                        <th style={{ padding: '8px 10px' }}>Parameter Name</th>
                        <th style={{ padding: '8px 10px' }}>Value</th>
                        <th style={{ padding: '8px 10px' }}>Unit</th>
                        <th style={{ padding: '8px 10px' }}>Ref Range</th>
                        <th style={{ padding: '8px 10px' }}>Flag</th>
                      </tr>
                    </thead>
                    <tbody>
                      {repLabs.map((lab, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '8px 10px' }}>
                            <input
                              type="text"
                              value={lab.parameterName}
                              onChange={(e) => {
                                const updated = [...repLabs];
                                updated[idx].parameterName = e.target.value;
                                setRepLabs(updated);
                              }}
                              style={{ width: '100%', padding: '4px 6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                            />
                          </td>
                          <td style={{ padding: '8px 10px', width: '90px' }}>
                            <input
                              type="number"
                              step="0.01"
                              value={lab.numericValue}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                const updated = [...repLabs];
                                updated[idx].numericValue = val;
                                updated[idx].flag = val > updated[idx].referenceMax ? 'HIGH' : val < updated[idx].referenceMin ? 'LOW' : 'NORMAL';
                                setRepLabs(updated);
                              }}
                              style={{ width: '100%', padding: '4px 6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                            />
                          </td>
                          <td style={{ padding: '8px 10px', width: '90px' }}>
                            <input
                              type="text"
                              value={lab.rawUnit}
                              onChange={(e) => {
                                const updated = [...repLabs];
                                updated[idx].rawUnit = e.target.value;
                                setRepLabs(updated);
                              }}
                              style={{ width: '100%', padding: '4px 6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                            />
                          </td>
                          <td style={{ padding: '8px 10px', width: '130px' }}>
                            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{lab.referenceMin} - {lab.referenceMax}</span>
                          </td>
                          <td style={{ padding: '8px 10px', width: '90px' }}>
                            <span className={`badge ${lab.flag === 'NORMAL' ? 'badge-normal' : lab.flag === 'HIGH' ? 'badge-danger' : 'badge-warning'}`}>
                              {lab.flag}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setIssueReportModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmittingReport} className="btn-primary" style={{ background: '#3B82F6' }}>
                  {isSubmittingReport ? 'Ingesting Report...' : 'Ingest Report to Center'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: REGISTER CITIZEN TO HUMAN REPORT CENTER         */}
      {/* ======================================================== */}
      {registerCitizenModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
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

              <button onClick={() => setRegisterCitizenModalOpen(false)} style={{ padding: '6px', borderRadius: '8px', background: '#F1F5F9' }}>
                <X size={20} color="#64748B" />
              </button>
            </div>

            {regSuccessMsg && (
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '12px 16px', borderRadius: '10px', color: '#065F46', fontSize: '0.88rem', fontWeight: 700, marginBottom: '16px' }}>
                ✓ {regSuccessMsg}
              </div>
            )}

            <form onSubmit={handleRegisterCitizen} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                <button type="button" onClick={() => setRegisterCitizenModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isRegisteringCitizen} className="btn-primary">
                  {isRegisteringCitizen ? 'Enrolling Citizen...' : 'Register Citizen & Generate UHID'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ======================================================== */}
      {/* MODAL: PROVISION NEW DOCTOR ID & ACCESS CREDENTIALS     */}
      {/* ======================================================== */}
      {createDoctorModalOpen && (
        <div style={{
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
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            width: '100%',
            maxWidth: '620px',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
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
                  Issued by: <strong>{hospitals.find(h => h.id === selectedHospitalId)?.name}</strong>
                </p>
              </div>
              <button onClick={() => setCreateDoctorModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={22} />
              </button>
            </div>

            {createDocSuccessMsg && (
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '12px', borderRadius: '10px', fontSize: '0.88rem', marginBottom: '16px', fontWeight: 600 }}>
                ✓ {createDocSuccessMsg}
              </div>
            )}

            <form onSubmit={handleCreateDoctorSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                    {(hospitals.find(h => h.id === selectedHospitalId)?.departments || ['Internal Medicine', 'Cardiology', 'Endocrinology', 'Pathology']).map((d: string) => (
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
                <button type="button" onClick={() => setCreateDoctorModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmittingDoctor} className="btn-primary">
                  {isSubmittingDoctor ? 'Issuing Doctor ID...' : 'Issue Doctor ID & Authorize Access'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: UNIVERSAL MULTI-ROLE LOGIN PORTAL GATEWAY         */}
      {/* ======================================================== */}
      {loginModalOpen && (
        <div style={{
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
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '660px',
            padding: '30px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.25)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
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
              <button onClick={() => setLoginModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={24} />
              </button>
            </div>

            {/* Role Selector Tabs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              background: '#F1F5F9',
              padding: '4px',
              borderRadius: '12px',
              marginBottom: '22px',
              gap: '4px'
            }}>
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
                      const h = hospitals.find(x => x.id === e.target.value);
                      if (h) setLoginFacilityCode(h.facilityCode);
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
      )}

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
    </div>
  );
}
