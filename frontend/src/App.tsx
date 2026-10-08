import React, { useState, useEffect } from 'react';
import {
  Activity,
  FileText,
  Clock,
  GitBranch,
  TrendingUp,
  Shield,
  Upload,
  HeartPulse,
  Send,
  Stethoscope,
  Sparkles,
  RefreshCw,
  Search,
  Eye,
  X,
  History,
  FolderArchive,
  Edit3,
  Calendar,
  Building2,
  AlertTriangle,
  Download,
  Code2,
  Network,
  CheckCircle2,
  Lock,
  QrCode,
  Users,
  FileCheck,
  KeyRound
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'past-diseases' | 'all-reports' | 'timeline' | 'journeys' | 'trends' | 'ai' | 'doctor' | 'network'>('dashboard');
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
  const [patientData, setPatientData] = useState<any>(null);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  const [conditions, setConditions] = useState<any[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<any>(null);
  const [journeyData, setJourneyData] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [trends, setTrends] = useState<any>(null);
  const [selectedTrendParam, setSelectedTrendParam] = useState('HBA1C');
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [reportA, setReportA] = useState('doc-008');
  const [reportB, setReportB] = useState('doc-011');
  
  // Doctor Portal States
  const [, setDoctorPatients] = useState<any[]>([]);
  const [selectedDoctorPatientId, setSelectedDoctorPatientId] = useState<string>('pat-demo-001');
  const [doctorDossier, setDoctorDossier] = useState<any>(null);
  const [doctorActiveSubTab, setDoctorActiveSubTab] = useState<'diseases' | 'reports' | 'trends' | 'notes'>('diseases');
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [selectedConditionFilter, setSelectedConditionFilter] = useState<string>('ALL');
  const [reportSearchQuery, setReportSearchQuery] = useState<string>('');

  // Hospital Network & Operating Portal States
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('hosp-apollo-01');
  const [selectedHospitalDoctor, setSelectedHospitalDoctor] = useState<string>('Dr. Priya Nair');
  const [hospitalDashboardData, setHospitalDashboardData] = useState<any>(null);
  const [hospitalActiveSubTab, setHospitalActiveSubTab] = useState<'disease-registry' | 'queue' | 'dossier' | 'issued-reports' | 'doctors'>('disease-registry');
  const [hospitalRegistry, setHospitalRegistry] = useState<any[]>([]);
  const [hospitalSearchQuery, setHospitalSearchQuery] = useState<string>('');

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
  const [digiLockerSubTab, setDigiLockerSubTab] = useState<'patient-overview' | 'lifetime-diseases' | 'issued-docs' | 'card' | 'timeline' | 'trends' | 'consent' | 'ai'>('patient-overview');
  const [digiLockerIssuerFilter, setDigiLockerIssuerFilter] = useState<string>('ALL');
  const [digiLockerCategoryFilter, setDigiLockerCategoryFilter] = useState<string>('ALL');
  const [digiLockerSearchQuery, setDigiLockerSearchQuery] = useState<string>('');

  // Dedicated Multi-Role Login Portal State
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginRoleTab, setLoginRoleTab] = useState<'HOSPITAL' | 'DOCTOR' | 'CITIZEN'>('HOSPITAL');
  const [loginFacilityCode, setLoginFacilityCode] = useState('HIP-IN-DEL-001');
  const [loginDoctorLicense, setLoginDoctorLicense] = useState('MCI-2012-44120');
  const [loginCitizenIdentifier, setLoginCitizenIdentifier] = useState('MED-00010001');
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

  // FHIR R4 Export Modal State
  const [fhirModalOpen, setFhirModalOpen] = useState(false);
  const [fhirBundleData, setFhirBundleData] = useState<any>(null);
  const [fhirLoading, setFhirLoading] = useState(false);
  const [fhirCopied, setFhirCopied] = useState(false);

  // Condition Trajectory Modal State
  const [trajectoryModalOpen, setTrajectoryModalOpen] = useState(false);
  const [activeTrajectoryData, setActiveTrajectoryData] = useState<any>(null);
  const [, setTrajectoryLoading] = useState(false);

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

  // AI Chat States
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);

  // Upload modal state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFilename, setUploadFilename] = useState('');
  const [uploadType, setUploadType] = useState('Comprehensive Metabolic Panel');
  const [uploadCategory, setUploadCategory] = useState('Metabolic');
  const [uploadFacility, setUploadFacility] = useState('Dr. Lal PathLabs, Delhi');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    async function loadInitial() {
      try {
        await api.login(); // Auto-authenticate demo patient Rahul Sharma
        const profRes = await api.getProfile();
        setPatientData(profRes.data);

        const timeRes = await api.getTimeline();
        setTimelineEvents(timeRes.data.events);

        const condRes = await api.getConditions();
        setConditions(condRes.data);
        if (condRes.data.length > 0) {
          setSelectedCondition(condRes.data[0]);
          const jRes = await api.getConditionJourney(condRes.data[0].id);
          setJourneyData(jRes.data);
        }

        const docRes = await api.getDocuments();
        setDocuments(docRes.data.items);

        const trendRes = await api.getTrends('HBA1C');
        setTrends(trendRes.data);

        const compRes = await api.compareReports('doc-008', 'doc-011');
        setComparisonResult(compRes.data);

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
    setDigiLockerPatientId(pId);
    setDigiLockerLoading(true);
    try {
      const res = await api.getCitizenDigiLocker(pId);
      setDigiLockerData(res.data);
      setSelectedDoctorPatientId(pId);
      const dossierRes = await api.getPatientDossier(pId);
      setDoctorDossier(dossierRes.data);
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

  // Handle Condition Switch in Patient View
  const handleSelectCondition = async (cond: any) => {
    setSelectedCondition(cond);
    try {
      const res = await api.getConditionJourney(cond.id);
      setJourneyData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Trend Param Switch
  const handleTrendParamChange = async (param: string) => {
    setSelectedTrendParam(param);
    try {
      const res = await api.getTrends(param);
      setTrends(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Report Comparison
  const handleRunComparison = async () => {
    try {
      const res = await api.compareReports(reportA, reportB);
      setComparisonResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle AI Query
  const handleSendAiQuery = async (queryText = aiQuery) => {
    if (!queryText.trim()) return;
    setAiLoading(true);
    setAiQuery(queryText);
    try {
      const res = await api.queryAI(queryText);
      setAiResponse(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
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

  // Handle FHIR R4 Bundle Export
  const handleExportFhirBundle = async () => {
    setFhirLoading(true);
    try {
      const res = await api.getFhirExport(selectedDoctorPatientId);
      setFhirBundleData(res.data);
      setFhirModalOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setFhirLoading(false);
    }
  };

  // Download FHIR JSON
  const handleDownloadFhirJson = () => {
    if (!fhirBundleData) return;
    const jsonStr = JSON.stringify(fhirBundleData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fhir_r4_bundle_${selectedDoctorPatientId}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle Viewing Condition Trajectory
  const handleViewConditionTrajectory = async (condId: string) => {
    setTrajectoryLoading(true);
    try {
      const res = await api.getConditionTrajectory(selectedDoctorPatientId, condId);
      setActiveTrajectoryData(res.data);
      setTrajectoryModalOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setTrajectoryLoading(false);
    }
  };

  // Handle Document Upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFilename) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('filename', uploadFilename);
      formData.append('documentType', uploadType);
      formData.append('category', uploadCategory);
      formData.append('labFacility', uploadFacility);
      formData.append('reportDate', new Date().toISOString().split('T')[0]);
      
      await api.uploadDocument(formData);
      setUploadSuccess(true);
      
      // Refresh documents & timeline & dossier
      const docRes = await api.getDocuments();
      setDocuments(docRes.data.items);
      const timeRes = await api.getTimeline();
      setTimelineEvents(timeRes.data.events);
      const dossierRes = await api.getPatientDossier(selectedDoctorPatientId);
      setDoctorDossier(dossierRes.data);

      setTimeout(() => {
        setUploadSuccess(false);
        setIsUploading(false);
        setUploadFilename('');
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
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
  const handleCitizenLogin = async (citizenId = loginCitizenIdentifier) => {
    try {
      const res = await api.loginCitizen(citizenId);
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
      alert(err.message || 'Citizen Health Vault login failed');
      throw err;
    }
  };

  // Handle Lock & Logout
  const handleLogout = () => {
    setAuthSession(null);
    localStorage.removeItem('medisutra_auth_session');
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
    if (selectedConditionFilter === 'T2D' && doc.category !== 'Metabolic') return false;
    if (selectedConditionFilter === 'VITD' && doc.id !== 'doc-001' && doc.id !== 'doc-004') return false;
    if (selectedConditionFilter === 'LIPID' && !doc.originalFilename?.toLowerCase().includes('lipid') && !doc.keyFindingsSummary?.toLowerCase().includes('lipid')) return false;
    if (selectedConditionFilter === 'BRONCHITIS' && doc.id !== 'doc-003') return false;
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
              { id: 'disease-registry', label: 'Disease Cure & Ongoing Registry', icon: Activity },
              { id: 'queue', label: `Live OPD & Walk-in Queue (${hospitalDashboardData?.opdQueue?.length || 4})`, icon: Users },
              { id: 'doctors', label: `Medical Specialists & Duty Roster (${hospitalDashboardData?.stats?.activeDoctorsCount || 2})`, icon: Stethoscope },
              { id: 'issued-reports', label: `Reports Issued by this Hospital (${hospitalDashboardData?.stats?.totalReportsIssued || 5})`, icon: FileText }
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
              { id: 'disease-registry', label: 'Disease Cure & Ongoing Registry', icon: Activity },
              { id: 'dossier', label: 'Patient Cross-Hospital Clinical Dossier', icon: FolderArchive },
              { id: 'queue', label: `Hospital OPD Triage Queue (${hospitalDashboardData?.opdQueue?.length || 4})`, icon: Users },
              { id: 'issued-reports', label: `Diagnostic Records Archive (${hospitalDashboardData?.stats?.totalReportsIssued || 5})`, icon: FileText }
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
            }) : [
              { id: 'patient-overview', label: 'Patient Medical Profile & Vitals', icon: Activity },
              { id: 'lifetime-diseases', label: `Lifetime Diseases & Diagnoses (${(digiLockerData?.lifetimeDiseases?.active?.length || 0) + (digiLockerData?.lifetimeDiseases?.resolved?.length || 0)})`, icon: History },
              { id: 'issued-docs', label: `Diagnostic Records & Reports (${digiLockerData?.stats?.totalIssuedDocuments || 14})`, icon: FileText },
              { id: 'card', label: 'ABHA Health Card & Identity', icon: QrCode },
              { id: 'timeline', label: 'Cross-Hospital Care Timeline', icon: Clock },
              { id: 'trends', label: 'Biomarkers & Laboratory Trends', icon: TrendingUp },
              { id: 'consent', label: `Data Consent & Facility Access (${digiLockerData?.facilitiesHoldingRecords?.length || 4})`, icon: Shield },
              { id: 'ai', label: 'MediSutra AI Health Assistant', icon: Sparkles }
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
          {/* PORTAL 1: HOSPITAL OPERATING CONSOLE (AUTHENTICATED)     */}
          {/* ======================================================== */}
          {(authSession.role === 'HOSPITAL_ADMIN' || authSession.role === 'DOCTOR') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Authenticated Role Institutional Scope Banner */}
              <div style={{
                background: authSession.role === 'HOSPITAL_ADMIN' ? 'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)' : 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
                border: authSession.role === 'HOSPITAL_ADMIN' ? '1.5px solid #0D9488' : '1.5px solid #0284C7',
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
                    background: authSession.role === 'HOSPITAL_ADMIN' ? '#0F766E' : '#0284C7',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {authSession.role === 'HOSPITAL_ADMIN' ? <Building2 size={22} /> : <Stethoscope size={22} />}
                  </div>
                  <div>
                    <div style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: authSession.role === 'HOSPITAL_ADMIN' ? '#0F766E' : '#0369A1',
                      letterSpacing: '0.04em'
                    }}>
                      {authSession.role === 'HOSPITAL_ADMIN' ? 'AUTHENTICATED HOSPITAL FACILITY PARTITION' : 'AUTHENTICATED SPECIALIST CLINICAL STATION'}
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                      {authSession.role === 'HOSPITAL_ADMIN'
                        ? (authSession.hospital?.name || 'Apollo Hospitals & Heart Institute')
                        : `${authSession.doctor?.name || 'Dr. Sneha Roy'} (${authSession.doctor?.qualification || 'MBBS, MD'})`}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                      {authSession.role === 'HOSPITAL_ADMIN'
                        ? `Facility Code: ${authSession.hospital?.facilityCode || 'HIP-IN-DEL-001'} • ${authSession.hospital?.city || 'Delhi NCR'} • ${authSession.hospital?.tier || 'Super Speciality'}`
                        : `Specialization: ${authSession.doctor?.specialization || 'Endocrinology'} • License: ${authSession.doctor?.licenseNumber || 'MCI-2023-8841'} • Hospital: ${authSession.hospital?.name || 'Apollo Hospitals'}`}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    background: authSession.role === 'HOSPITAL_ADMIN' ? '#0F766E' : '#0284C7',
                    color: '#FFFFFF',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    padding: '5px 12px',
                    borderRadius: '20px'
                  }}>
                    {authSession.role === 'HOSPITAL_ADMIN' ? 'FACILITY ADMIN SESSION' : 'SPECIALIST SESSION'}
                  </span>
                </div>
              </div>

              {/* Active Hospital Header Command Banner */}
              <div className="card" style={{
                background: 'linear-gradient(135deg, #0F766E 0%, #134E4A 100%)',
                color: '#FFFFFF',
                padding: '24px 28px',
                borderRadius: '18px',
                boxShadow: '0 8px 24px rgba(15, 118, 110, 0.25)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>
                        {hospitals.find(h => h.id === selectedHospitalId)?.tier.toUpperCase() || 'SUPER SPECIALITY'}
                      </span>
                      <span style={{ fontSize: '0.84rem', color: '#99F6E4' }}>
                        Facility Code: <strong>{hospitals.find(h => h.id === selectedHospitalId)?.facilityCode || 'HIP-IN-DEL-001'}</strong> • Emergency: <strong>{hospitals.find(h => h.id === selectedHospitalId)?.emergencyPhone || '+91-11-26925858'}</strong>
                      </span>
                    </div>
                    <h1 style={{ color: '#FFFFFF', fontSize: '1.8rem', marginBottom: '4px' }}>
                      {hospitals.find(h => h.id === selectedHospitalId)?.name || 'Apollo Hospitals & Heart Institute'}
                    </h1>
                    <p style={{ color: '#CCFBF1', fontSize: '0.9rem' }}>
                      Accreditation: {hospitals.find(h => h.id === selectedHospitalId)?.accreditation?.join(' • ') || 'NABH • JCI'} • Departments: {hospitals.find(h => h.id === selectedHospitalId)?.departments?.join(', ')}
                    </p>
                  </div>

                  {/* Top Controls: Attending Doctor Selector & FHIR Export */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {authSession.role === 'DOCTOR' ? (
                      <div style={{
                        background: 'rgba(255,255,255,0.18)',
                        backdropFilter: 'blur(8px)',
                        padding: '8px 14px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.3)'
                      }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#CCFBF1', marginBottom: '2px' }}>
                          🩺 VERIFIED SPECIALIST:
                        </div>
                        <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.88rem' }}>
                          {authSession.doctor?.name || selectedHospitalDoctor}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#99F6E4' }}>
                          MCI Lic: {authSession.doctor?.licenseNumber || 'Verified Active'}
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(8px)',
                        padding: '8px 14px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.25)'
                      }}>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#CCFBF1', display: 'block', marginBottom: '4px' }}>
                          🩺 ON-DUTY PHYSICIAN:
                        </label>
                        <select
                          value={selectedHospitalDoctor}
                          onChange={(e) => setSelectedHospitalDoctor(e.target.value)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#FFFFFF',
                            color: '#0F172A',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                          }}
                        >
                          {(hospitals.find(h => h.id === selectedHospitalId)?.activeDoctors || []).map((doc: any) => (
                            <option key={doc.id} value={doc.name}>
                              {doc.name} ({doc.specialization})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <button
                      onClick={handleExportFhirBundle}
                      disabled={fhirLoading}
                      style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: '1px solid rgba(255,255,255,0.4)',
                        color: '#FFFFFF',
                        padding: '10px 16px',
                        borderRadius: '12px',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        backdropFilter: 'blur(8px)'
                      }}
                    >
                      <Code2 size={16} />
                      {fhirLoading ? 'Exporting...' : 'HL7 FHIR R4'}
                    </button>
                  </div>
                </div>

                {/* Sub-bar: Telemetry Cards & 3 High-Impact Action Buttons */}
                <div style={{
                  marginTop: '18px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  {/* Hospital Telemetry Quick Badges */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem' }}>
                      <span style={{ color: '#CCFBF1' }}>Active OPD Queue:</span> <strong>{hospitalDashboardData?.stats?.activeOpdQueueCount || 4} Patients</strong>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem' }}>
                      <span style={{ color: '#CCFBF1' }}>Certified Reports Issued:</span> <strong>{hospitalDashboardData?.stats?.totalReportsIssued || 5}</strong>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem' }}>
                      <span style={{ color: '#CCFBF1' }}>Diagnoses Logged:</span> <strong>{hospitalDashboardData?.stats?.totalEncountersRecorded || 3}</strong>
                    </div>
                  </div>

                  {/* High-Impact Clinical Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {authSession.role === 'HOSPITAL_ADMIN' && (
                      <button
                        id="btn-issue-doctor-id"
                        onClick={() => setCreateDoctorModalOpen(true)}
                        style={{
                          background: '#0284C7',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '10px',
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.35)'
                        }}
                      >
                        <Users size={15} />
                        + Issue Doctor ID
                      </button>
                    )}

                    {authSession.role === 'DOCTOR' && (
                      <button
                        onClick={() => setDiagnosisModalOpen(true)}
                        style={{
                          background: '#F59E0B',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '10px',
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(245, 158, 11, 0.35)'
                        }}
                      >
                        <Stethoscope size={15} />
                        + Record Disease Encounter
                      </button>
                    )}

                    <button
                      onClick={() => setIssueReportModalOpen(true)}
                      style={{
                        background: '#3B82F6',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.35)'
                      }}
                    >
                      <FolderArchive size={15} />
                      + Issue Diagnostic Lab Report
                    </button>

                    {authSession.role === 'HOSPITAL_ADMIN' && (
                      <button
                        onClick={() => setRegisterCitizenModalOpen(true)}
                        style={{
                          background: 'rgba(255,255,255,0.2)',
                          color: '#FFFFFF',
                          border: '1px solid rgba(255,255,255,0.4)',
                          padding: '8px 16px',
                          borderRadius: '10px',
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Building2 size={15} />
                        + Enroll Walk-In Citizen
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Universal Citizen Health Record Lookup (Treating Doctors Only) */}
              {authSession.role === 'DOCTOR' && (
                <div className="card" style={{ padding: '16px 20px', background: '#F8FAFC', border: '1px solid #CBD5E1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Search size={16} color="#0F766E" />
                        UNIVERSAL PATIENT HEALTH RECORD LOOKUP (Longitudinal Medical History):
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                        Pull any citizen's universal medical records from any hospital across India with sovereign clinical authorization.
                      </p>
                    </div>

                    {/* Quick Patient Switcher Chips */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Quick Select Patient:</span>
                      {hospitalRegistry.map(p => {
                        const isSelected = selectedDoctorPatientId === p.id;
                        return (
                          <button
                            key={p.id}
                            onClick={() => {
                              handleSelectDoctorPatient(p.id);
                              setHospitalActiveSubTab('dossier');
                            }}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              border: isSelected ? '1.5px solid #0F766E' : '1px solid #CBD5E1',
                              background: isSelected ? '#CCFBF1' : '#FFFFFF',
                              color: isSelected ? '#0F766E' : '#334155',
                              fontWeight: isSelected ? 800 : 600,
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            👤 {p.fullName} ({p.healthId})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 0: CENTRAL DISEASE CURE & ONGOING REGISTRY */}
              {hospitalActiveSubTab === 'disease-registry' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  {/* Registry Hero Header */}
                  <div className="card" style={{ padding: '24px 28px', background: 'linear-gradient(135deg, #F0FDF4 0%, #F8FAFC 50%, #ECFEFF 100%)', border: '1.5px solid #A7F3D0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      <div style={{ maxWidth: '720px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span className="badge" style={{ background: '#059669', color: '#FFFFFF', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Activity size={13} />
                            NATIONAL CENTRAL REGISTRY
                          </span>
                          <span className="badge badge-teal" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Shield size={12} />
                            SOVEREIGN HEALTH NETWORK
                          </span>
                          <span className="badge badge-normal">
                            Cross-Hospital Synchronized
                          </span>
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.25 }}>
                          Central Disease Cure & Ongoing Registry
                        </h2>
                        <p style={{ fontSize: '0.88rem', color: '#475569', marginTop: '6px', lineHeight: 1.5 }}>
                          The unified sovereign platform tracking active ongoing diseases and officially certified clinical cures across accredited hospitals and treating doctors nationwide.
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setDiagnosisModalOpen(true)}
                          className="btn-primary"
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', fontSize: '0.88rem', fontWeight: 700 }}
                        >
                          <Activity size={16} />
                          + Record Ongoing Disease
                        </button>
                        <button
                          onClick={() => setIssueReportModalOpen(true)}
                          className="btn-secondary"
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', fontSize: '0.88rem', fontWeight: 700 }}
                        >
                          <FileText size={16} />
                          + Issue Lab / Clearance Report
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Active Patient Switcher & Demographic Bar */}
                  <div className="card" style={{ padding: '18px 24px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: 900, fontSize: '1.2rem', boxShadow: '0 4px 6px -1px rgba(15, 118, 110, 0.2)' }}>
                          {doctorDossier?.patient?.fullName ? doctorDossier.patient.fullName.charAt(0) : 'P'}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                              {doctorDossier?.patient?.fullName || 'Rahul Sharma'}
                            </span>
                            <span className="badge badge-teal" style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                              {doctorDossier?.patient?.healthId || 'MED-00010001'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <span><strong>Gender:</strong> {doctorDossier?.patient?.gender || 'Male'}</span>
                            <span>•</span>
                            <span><strong>Blood Group:</strong> {doctorDossier?.patient?.bloodGroup || 'B+'}</span>
                            <span>•</span>
                            <span><strong>Allergies:</strong> {doctorDossier?.patient?.allergies || 'Penicillin (Moderate rash)'}</span>
                            <span>•</span>
                            <span><strong>Registered At:</strong> {doctorDossier?.patient?.registeringHospital || 'Apollo Hospitals'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Switch Patient Chips */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>SWITCH PATIENT:</span>
                        {hospitalRegistry.map(p => {
                          const isSelected = selectedDoctorPatientId === p.id;
                          return (
                            <button
                              key={p.id}
                              onClick={() => handleSelectDoctorPatient(p.id)}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '8px',
                                border: isSelected ? '2px solid #0F766E' : '1px solid #CBD5E1',
                                background: isSelected ? '#CCFBF1' : '#FFFFFF',
                                color: isSelected ? '#0F766E' : '#334155',
                                fontWeight: isSelected ? 800 : 600,
                                fontSize: '0.82rem',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              👤 {p.fullName}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick Metric Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
                      <div style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', padding: '14px 18px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          🟡 Ongoing Active Diseases
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#92400E', marginTop: '4px' }}>
                          {doctorDossier?.clinicalOverview?.activeConditions?.length || 0}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#78350F', marginTop: '2px' }}>
                          Under active monitoring & medication
                        </div>
                      </div>

                      <div style={{ background: '#ECFDF5', border: '1.5px solid #A7F3D0', padding: '14px 18px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          🟢 Officially Cured Diseases
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#065F46', marginTop: '4px' }}>
                          {doctorDossier?.clinicalOverview?.pastResolvedDiseases?.length || 0}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#064E3B', marginTop: '2px' }}>
                          Verified resolution with clinical proof
                        </div>
                      </div>

                      <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', padding: '14px 18px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          🏥 Network Facilities
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>
                          6 Hospitals
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                          Apollo, AIIMS, Fortis, Max, Medanta, Tata
                        </div>
                      </div>

                      <div style={{ background: '#F0FDFA', border: '1.5px solid #99F6E4', padding: '14px 18px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          📋 Cross-Hospital Vault
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#115E59', marginTop: '4px' }}>
                          {doctorDossier?.allReports?.length || 0} Reports
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#134E4A', marginTop: '2px' }}>
                          Central Human Report Center records
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dual-Column Split: Ongoing vs Cured Diseases */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '20px' }}>
                    
                    {/* LEFT COLUMN: ONGOING DISEASES */}
                    <div className="card" style={{ padding: '22px', border: '1.5px solid #FDE68A', background: '#FFFFFF' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #FEF3C7', paddingBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }} />
                          <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#92400E' }}>
                            Ongoing Diseases ({doctorDossier?.clinicalOverview?.activeConditions?.length || 0})
                          </h3>
                        </div>
                        <span className="badge" style={{ background: '#FEF3C7', color: '#B45309', fontWeight: 700, fontSize: '0.76rem' }}>
                          ACTIVE MEDICAL CARE
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#78350F', marginBottom: '16px' }}>
                        Conditions actively diagnosed, requiring continuous medication, dietary protocols, or clinical follow-up.
                      </p>

                      {(!doctorDossier?.clinicalOverview?.activeConditions || doctorDossier.clinicalOverview.activeConditions.length === 0) ? (
                        <div style={{ padding: '36px 20px', textAlign: 'center', background: '#FFFBEB', borderRadius: '12px', border: '1px dashed #FCD34D' }}>
                          <CheckCircle2 size={36} color="#059669" style={{ margin: '0 auto 8px auto' }} />
                          <div style={{ fontWeight: 800, color: '#92400E', fontSize: '1rem' }}>
                            No Ongoing Diseases
                          </div>
                          <p style={{ fontSize: '0.82rem', color: '#B45309', marginTop: '4px' }}>
                            Patient is currently free of active chronic illnesses. Use the button above to record a new diagnosis if needed.
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
                                    Diagnosing Care Facility: <strong>{cond.diagnosingFacility || 'Apollo Hospitals & Heart Institute'}</strong>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', paddingTop: '4px' }}>
                                  <div style={{ display: 'flex', gap: '8px' }}>
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
                                      Update Status
                                    </button>
                                  </div>

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

                    {/* RIGHT COLUMN: CURED & RESOLVED DISEASES */}
                    <div className="card" style={{ padding: '22px', border: '1.5px solid #A7F3D0', background: '#FFFFFF' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #D1FAE5', paddingBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#059669' }} />
                          <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#065F46' }}>
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
                            When ongoing conditions are successfully treated, clicking "Mark as Cured" records them here with verified clinical proof.
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
                                    Certified by: <strong>{cond.certifyingDoctor || 'Attending Physician'}</strong> at <strong>{cond.curedByHospital || cond.diagnosingFacility || 'Apollo Hospitals & Heart Institute'}</strong>
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
                </div>
              )}

              {/* SUBTAB 1: LIVE OPD & WALK-IN PATIENT QUEUE */}
              {hospitalActiveSubTab === 'queue' && (
                <div className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={20} color="#0F766E" />
                        <h2 style={{ fontSize: '1.35rem', color: '#0F172A' }}>
                          Live Outpatient (OPD) & Emergency Walk-In Queue
                        </h2>
                      </div>
                      <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '4px' }}>
                        Real-time patient intake at <strong>{hospitals.find(h => h.id === selectedHospitalId)?.name}</strong>. Clicking any patient instantly pulls up their longitudinal cross-hospital health records.
                      </p>
                    </div>

                    {authSession.role === 'HOSPITAL_ADMIN' && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => setRegisterCitizenModalOpen(true)}
                          className="btn-primary"
                          style={{ fontSize: '0.84rem', padding: '8px 16px' }}
                        >
                          + Check-in Walk-in Patient
                        </button>
                      </div>
                    )}
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                          <th style={{ padding: '12px 16px' }}>Token #</th>
                          <th style={{ padding: '12px 16px' }}>Citizen / Sovereign UHID</th>
                          <th style={{ padding: '12px 16px' }}>Demographics</th>
                          <th style={{ padding: '12px 16px' }}>Priority</th>
                          <th style={{ padding: '12px 16px' }}>Chief Presenting Complaint</th>
                          <th style={{ padding: '12px 16px' }}>Attending Physician</th>
                          <th style={{ padding: '12px 16px' }}>Status</th>
                          <th style={{ padding: '12px 16px' }}>{authSession.role === 'DOCTOR' ? 'Clinical Dossier' : 'Intake Triage'}</th>
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
                              {authSession.role === 'DOCTOR' ? (
                                <button
                                  onClick={() => {
                                    handleSelectDoctorPatient(q.patientId);
                                    setHospitalActiveSubTab('dossier');
                                  }}
                                  className="btn-primary"
                                  style={{ padding: '6px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                                >
                                  Pull Patient Dossier →
                                </button>
                              ) : (
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
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: REPORTS ISSUED BY THIS HOSPITAL */}
              {hospitalActiveSubTab === 'issued-reports' && (
                <div className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.35rem', color: '#0F172A' }}>
                        Diagnostic Reports Issued by {hospitals.find(h => h.id === selectedHospitalId)?.name}
                      </h2>
                      <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '4px' }}>
                        Verified digital laboratory investigations and imaging summaries stamped with institutional accreditation.
                      </p>
                    </div>
                    <button onClick={() => setIssueReportModalOpen(true)} className="btn-primary" style={{ fontSize: '0.84rem' }}>
                      + Issue New Lab Report
                    </button>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                          <th style={{ padding: '12px 16px' }}>Document / File</th>
                          <th style={{ padding: '12px 16px' }}>Category</th>
                          <th style={{ padding: '12px 16px' }}>Issue Date</th>
                          <th style={{ padding: '12px 16px' }}>Key Findings</th>
                          <th style={{ padding: '12px 16px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(hospitalDashboardData?.recentIssuedReports || []).map((rep: any) => (
                          <tr key={rep.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ fontWeight: 800, color: '#0F172A' }}>{rep.documentType}</div>
                              <div style={{ fontSize: '0.76rem', color: '#64748B' }}>{rep.originalFilename}</div>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <span className="badge badge-teal">{rep.category}</span>
                            </td>
                            <td style={{ padding: '14px 16px', color: '#475569' }}>
                              {rep.reportDate}
                            </td>
                            <td style={{ padding: '14px 16px', color: '#334155', maxWidth: '300px' }}>
                              {rep.keyFindingsSummary}
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <button onClick={() => setInspectingReport(rep)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                                Inspect Findings
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUBTAB 4: MEDICAL SPECIALISTS ON DUTY & DOCTOR PROVISIONING (HOSPITAL ADMIN ONLY) */}
              {authSession.role === 'HOSPITAL_ADMIN' && hospitalActiveSubTab === 'doctors' && (
                <div className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '14px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.35rem', color: '#0F172A', marginBottom: '4px' }}>
                        Medical Specialists & Doctor ID Management at {hospitals.find(h => h.id === selectedHospitalId)?.name}
                      </h2>
                      <p style={{ fontSize: '0.84rem', color: '#64748B' }}>
                        This hospital issues unique doctor credentials. Authenticated specialists access cross-hospital longitudinal health records and submit clinical diagnoses and reports.
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

              {/* SUBTAB 2: PATIENT CROSS-HOSPITAL DOSSIER (DOCTOR ONLY) */}
              {authSession.role === 'DOCTOR' && hospitalActiveSubTab === 'dossier' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Patient Core Clinical Summary Bar */}
                  {doctorDossier && (
                <div className="card" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: '#F0FDFA',
                      border: '2px solid #0D9488',
                      color: '#0F766E',
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
                        <h2 style={{ fontSize: '1.35rem', color: '#0F172A' }}>{doctorDossier.patient.fullName}</h2>
                        <span className="badge badge-teal" style={{ fontSize: '0.78rem' }}>{doctorDossier.patient.healthId}</span>
                        <span className="badge badge-normal">Consent Active</span>
                      </div>
                      <div style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '4px' }}>
                        DOB: {doctorDossier.patient.dob} • Sex: {doctorDossier.patient.gender} • Blood: <strong>{doctorDossier.patient.bloodGroup}</strong> • Allergies: <strong style={{ color: '#DC2626' }}>{doctorDossier.patient.allergies?.join(', ') || 'None'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* High-Level Disease & Report Metrics */}
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    <div style={{ background: '#F8FAFC', padding: '10px 18px', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>LIFETIME DISEASES</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F766E' }}>
                        {doctorDossier.clinicalOverview.totalLifetimeDiseasesCount}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                        {doctorDossier.clinicalOverview.activeConditions.length} Active • {doctorDossier.clinicalOverview.pastResolvedDiseases.length} Resolved
                      </div>
                    </div>

                    <div style={{ background: '#F8FAFC', padding: '10px 18px', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>ALL PREVIOUS REPORTS</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#2563EB' }}>
                        {doctorDossier.clinicalOverview.totalPreviousReportsCount}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                        Spanning 2023–2026
                      </div>
                    </div>

                    <div style={{ background: '#F8FAFC', padding: '10px 18px', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>CLINICAL RISK LEVEL</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#D97706', marginTop: '4px' }}>
                        {doctorDossier.patient.riskLevel || 'MODERATE'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                        Last Visit: {doctorDossier.patient.lastEncounterDate}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cross-Hospital Network Care Synchronization Bar */}
              {doctorDossier && (
                <div style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Network size={18} color="#0F766E" />
                      <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                        Cross-Hospital Network Care Synchronization
                      </span>
                      <span className="badge badge-teal" style={{ fontSize: '0.72rem' }}>
                        CENTRAL HUMAN REPORT CENTER
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                      Diagnostic reports and disease records synchronized across all accredited healthcare institutions.
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {Array.from(new Set([
                      ...(doctorDossier.allReports || []).map((r: any) => r.labFacility || r.issuingHospital),
                      ...(doctorDossier.events || []).map((e: any) => e.hospitalFacility),
                      ...(doctorDossier.clinicalOverview.activeConditions || []).map((c: any) => c.diagnosingFacility),
                      ...(doctorDossier.clinicalOverview.pastResolvedDiseases || []).map((c: any) => c.diagnosingFacility)
                    ].filter(Boolean))).map((facName: any, idx: number) => {
                      const repCount = (doctorDossier.allReports || []).filter((r: any) => (r.labFacility === facName || r.issuingHospital === facName)).length;
                      return (
                        <div key={idx} style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#F8FAFC',
                          border: '1px solid #CBD5E1',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          color: '#334155',
                          fontWeight: 600
                        }}>
                          <span>🏛️</span>
                          <span>{facName}</span>
                          <span style={{
                            background: '#E2E8F0',
                            color: '#0F172A',
                            padding: '1px 6px',
                            borderRadius: '10px',
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}>
                            {repCount > 0 ? `${repCount} report${repCount > 1 ? 's' : ''}` : 'Encounter'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-Navigation for Doctor Views */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #E2E8F0', paddingBottom: '2px' }}>
                {[
                  { id: 'diseases', label: 'Lifetime Disease History (Past & Active)', icon: History },
                  { id: 'reports', label: 'All Previous Reports Vault (By Year)', icon: FolderArchive },
                  { id: 'trends', label: 'Longitudinal Lab Trajectories', icon: TrendingUp },
                  { id: 'notes', label: 'Clinical Assessment & Notes', icon: Edit3 }
                ].map(sub => {
                  const Icon = sub.icon;
                  const isActive = doctorActiveSubTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setDoctorActiveSubTab(sub.id as any)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '8px 8px 0 0',
                        fontSize: '0.9rem',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#0F766E' : '#64748B',
                        background: isActive ? '#FFFFFF' : 'transparent',
                        border: isActive ? '1px solid #E2E8F0' : 'none',
                        borderBottom: isActive ? '2px solid #0F766E' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      <Icon size={16} />
                      {sub.label}
                    </button>
                  );
                })}
              </div>

              {/* SUBTAB 1: LIFETIME PAST DISEASES HISTORY */}
              {doctorActiveSubTab === 'diseases' && doctorDossier && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Active Documented Conditions */}
                  <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', color: '#0F172A' }}>
                          Active Documented Conditions ({doctorDossier.clinicalOverview.activeConditions.length})
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
                          Conditions currently requiring pharmacotherapy, dietary management, or periodic monitoring.
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {doctorDossier.clinicalOverview.activeConditions.map((cond: any) => (
                        <div key={cond.id} style={{
                          padding: '18px',
                          borderRadius: '12px',
                          border: '1px solid #E2E8F0',
                          background: '#F8FAFC',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          flexWrap: 'wrap',
                          gap: '14px'
                        }}>
                          <div style={{ flex: 1, minWidth: '280px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>
                                {cond.conditionName}
                              </span>
                              <span className="badge badge-warning">
                                {cond.currentStatus}
                              </span>
                              <span className="badge badge-teal">
                                {cond.bodySystem}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 700 }}>
                                Severity: {cond.severity}
                              </span>
                            </div>

                            <p style={{ fontSize: '0.86rem', color: '#475569', marginTop: '6px' }}>
                              <strong>First Documented:</strong> {cond.firstDocumentedDate} • <strong>Diagnosed:</strong> {cond.diagnosedDate || 'N/A'}
                            </p>

                            <p style={{ fontSize: '0.86rem', color: '#334155', marginTop: '6px' }}>
                              <strong>Treatment Plan:</strong> {cond.treatmentSummary || 'Lifestyle intervention'}
                            </p>

                            {cond.notes && (
                              <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '6px', fontStyle: 'italic' }}>
                                Clinical note: {cond.notes}
                              </p>
                            )}
                          </div>

                          {/* Doctor Quick Actions */}
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => handleViewConditionTrajectory(cond.id)}
                              className="btn-secondary"
                              style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                            >
                              <GitBranch size={14} />
                              Trace Trajectory
                            </button>
                            <button
                              onClick={() => {
                                setEditingCondition(cond);
                                setNewConditionStatus(cond.currentStatus);
                              }}
                              className="btn-secondary"
                              style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                            >
                              <Edit3 size={14} />
                              Update Status / Note
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documented Resolved Past Diseases */}
                  <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', color: '#0F172A' }}>
                          Documented Resolved Past Diseases ({doctorDossier.clinicalOverview.pastResolvedDiseases.length})
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
                          Complete lifetime history of cured or resolved illnesses with proof of resolving laboratory reports.
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {doctorDossier.clinicalOverview.pastResolvedDiseases.map((cond: any) => (
                        <div key={cond.id} style={{
                          padding: '18px',
                          borderRadius: '12px',
                          border: '1px solid #A7F3D0',
                          background: '#ECFDF5',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          flexWrap: 'wrap',
                          gap: '14px'
                        }}>
                          <div style={{ flex: 1, minWidth: '280px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#065F46' }}>
                                {cond.conditionName}
                              </span>
                              <span className="badge badge-normal">
                                ✓ RESOLVED
                              </span>
                              <span className="badge badge-teal">
                                {cond.bodySystem}
                              </span>
                            </div>

                            <p style={{ fontSize: '0.86rem', color: '#047857', marginTop: '6px' }}>
                              <strong>Active Duration:</strong> {cond.firstDocumentedDate} → <strong>{cond.resolvedDate}</strong>
                            </p>

                            <p style={{ fontSize: '0.86rem', color: '#065F46', marginTop: '4px' }}>
                              <strong>Therapy Administered:</strong> {cond.treatmentSummary || 'Symptomatic recovery'}
                            </p>

                            {cond.resolvingReportId && (
                              <div style={{ fontSize: '0.8rem', color: '#0F766E', marginTop: '6px', fontWeight: 700 }}>
                                📄 Resolving Evidence Document ID: <u>{cond.resolvingReportId}</u>
                              </div>
                            )}

                            {cond.notes && (
                              <p style={{ fontSize: '0.82rem', color: '#047857', marginTop: '6px', fontStyle: 'italic' }}>
                                Clinical outcome: {cond.notes}
                              </p>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button
                              onClick={() => handleViewConditionTrajectory(cond.id)}
                              className="btn-secondary"
                              style={{ fontSize: '0.82rem', padding: '6px 12px', background: '#FFFFFF', borderColor: '#A7F3D0', color: '#047857' }}
                            >
                              <GitBranch size={14} />
                              Trace Provenance Trajectory
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>


                </div>
              )}

              {/* SUBTAB 2: ALL PREVIOUS REPORTS VAULT (BY YEAR) */}
              {doctorActiveSubTab === 'reports' && doctorDossier && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Filter & Search Bar for Reports */}
                  <div className="card" style={{ padding: '16px 20px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px', background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '6px 12px', borderRadius: '8px' }}>
                      <Search size={16} color="#64748B" />
                      <input
                        type="text"
                        placeholder="Search all previous reports by test name, lab facility, or parameter..."
                        value={reportSearchQuery}
                        onChange={(e) => setReportSearchQuery(e.target.value)}
                        style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.88rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B' }}>Year:</label>
                      <select
                        value={selectedYearFilter}
                        onChange={(e) => setSelectedYearFilter(e.target.value)}
                        style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.85rem' }}
                      >
                        <option value="ALL">All Years (2023–2026)</option>
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B' }}>Category:</label>
                      <select
                        value={selectedCategoryFilter}
                        onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                        style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.85rem' }}
                      >
                        <option value="ALL">All Categories</option>
                        <option value="Metabolic">Metabolic / Diabetes</option>
                        <option value="Blood">Blood / CBC</option>
                        <option value="Renal">Renal / KFT</option>
                        <option value="Imaging">Imaging / Ultrasound</option>
                        <option value="Prescription">Prescriptions</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B' }}>Linked Condition:</label>
                      <select
                        value={selectedConditionFilter}
                        onChange={(e) => setSelectedConditionFilter(e.target.value)}
                        style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.85rem' }}
                      >
                        <option value="ALL">All Conditions</option>
                        <option value="T2D">Type 2 Diabetes Reports</option>
                        <option value="VITD">Vitamin D Deficiency Reports</option>
                        <option value="LIPID">Dyslipidemia Reports</option>
                        <option value="BRONCHITIS">Acute Bronchitis Reports</option>
                      </select>
                    </div>

                    <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600, marginLeft: 'auto' }}>
                      Showing {filteredReports.length} of {doctorDossier.clinicalOverview.totalPreviousReportsCount} reports
                    </span>
                  </div>


                  {/* Chronological Year-by-Year Reports Archive */}
                  {Object.keys(groupedReportsByYear).sort((a,b) => b.localeCompare(a)).map(year => (
                    <div key={year} className="card" style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', borderBottom: '2px solid #F1F5F9', paddingBottom: '10px' }}>
                        <Calendar size={18} color="#0F766E" />
                        <h3 style={{ fontSize: '1.25rem', color: '#0F172A' }}>
                          Year {year} Diagnostic Reports Archive
                        </h3>
                        <span className="badge badge-teal">
                          {groupedReportsByYear[year].length} Reports
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
                        {groupedReportsByYear[year].map((doc: any) => (
                          <div
                            key={doc.id}
                            style={{
                              background: '#F8FAFC',
                              border: '1px solid #E2E8F0',
                              borderRadius: '12px',
                              padding: '16px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                  <span className="badge badge-teal" style={{ fontSize: '0.72rem' }}>
                                    {doc.category || 'General'}
                                  </span>
                                  {doc.id === 'doc-001' && <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>⚡ Vit D Baseline</span>}
                                  {doc.id === 'doc-004' && <span className="badge badge-normal" style={{ fontSize: '0.68rem' }}>✅ Vit D Resolving Proof</span>}
                                  {doc.id === 'doc-005' && <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>⚡ T2D Diagnosis Trigger</span>}
                                  {doc.id === 'doc-003' && <span className="badge badge-normal" style={{ fontSize: '0.68rem' }}>✅ Bronchitis Resolved</span>}
                                  {doc.id === 'doc-011' && <span className="badge badge-teal" style={{ fontSize: '0.68rem' }}>⭐ Annual Review</span>}
                                </div>
                                <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                                  {doc.reportDate}
                                </span>
                              </div>


                              <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                                {doc.originalFilename}
                              </h4>

                              <div style={{ fontSize: '0.78rem', color: '#0F766E', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Building2 size={13} />
                                {doc.labFacility || 'Diagnostic Laboratory'}
                              </div>

                              <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '8px', lineHeight: '1.4' }}>
                                {doc.keyFindingsSummary}
                              </p>
                            </div>

                            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {doc.abnormalCount > 0 ? (
                                  <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>
                                    <AlertTriangle size={12} />
                                    {doc.abnormalCount} Abnormal Values
                                  </span>
                                ) : (
                                  <span className="badge badge-normal" style={{ fontSize: '0.7rem' }}>
                                    ✓ Normal Values
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() => setInspectingReport(doc)}
                                className="btn-primary"
                                style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                              >
                                <Eye size={13} />
                                Inspect Findings
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                </div>
              )}

              {/* SUBTAB 3: LONGITUDINAL LAB TRAJECTORIES */}
              {doctorActiveSubTab === 'trends' && doctorDossier && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem' }}>Longitudinal Parameter Trajectory</h3>
                        <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
                          Examine changes across all recorded diagnostic reports spanning years.
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        {['HBA1C', 'GLU_FAST', 'VIT_D', 'CREATININE', 'WBC'].map(pCode => (
                          <button
                            key={pCode}
                            onClick={() => handleTrendParamChange(pCode)}
                            style={{
                              padding: '6px 14px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              background: selectedTrendParam === pCode ? '#0F766E' : '#F1F5F9',
                              color: selectedTrendParam === pCode ? '#FFFFFF' : '#475569'
                            }}
                          >
                            {pCode}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ height: '320px', width: '100%', marginTop: '10px' }}>
                      {trends?.readings && trends.readings.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={trends.readings} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                            <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                            <YAxis stroke="#94A3B8" fontSize={12} domain={['auto', 'auto']} />
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const d = payload[0].payload;
                                  return (
                                    <div style={{ background: '#FFFFFF', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}>
                                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{d.date}</div>
                                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F766E' }}>
                                        {d.value} {d.unit}
                                      </div>
                                      <div style={{ fontSize: '0.72rem', color: '#0F766E', marginTop: '4px' }}>
                                        📄 {d.sourceDocumentName}
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            {trends.referenceMax && (
                              <ReferenceLine y={trends.referenceMax} stroke="#DC2626" strokeDasharray="4 4" label={{ value: `Upper Limit: ${trends.referenceMax}`, fill: '#DC2626', fontSize: 11 }} />
                            )}
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#0F766E"
                              strokeWidth={3}
                              dot={{ r: 6, fill: '#0D9488', strokeWidth: 2, stroke: '#FFFFFF' }}
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
                          No recorded readings found.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 4: CLINICAL ASSESSMENT & NOTES */}
              {doctorActiveSubTab === 'notes' && doctorDossier && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* AI Longitudinal Clinical Summary */}
                  <div className="card" style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0F766E', fontWeight: 700, fontSize: '0.95rem', marginBottom: '8px' }}>
                      <Sparkles size={18} />
                      AI Longitudinal Clinical Briefing for Treating Physician
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.7' }}>
                      Patient presented in Jan 2025 with acute fasting hyperglycemia (165 mg/dL) and confirmatory HbA1c of 8.7%. Initiated on Metformin 500mg BID. Longitudinal glycemic tracking demonstrates a favorable downward trajectory over 18 months: 8.7% → 8.2% (M2) → 7.8% (M6) → 6.9% (Latest, July 2026). Note: M4 checkpoint was not uploaded to this platform. Renal and hepatic parameters remain within normal physiological ranges (Creatinine 0.9 mg/dL; Normal liver ultrasound in Aug 2026). Severe Vitamin D deficiency (14 ng/mL in Mar 2024) is documented resolved (38 ng/mL in Sep 2024). Acute viral infection with leukocytosis resolved in Aug 2024.
                    </p>
                  </div>

                  {/* Add Consultation Note Form */}
                  <div className="card">
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Record New Physician Clinical Note</h4>
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
                  </div>

                  {/* Consultation Notes Timeline */}
                  <div className="card">
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '14px' }}>Recorded Clinical Consultation History ({doctorDossier.doctorNotes.length})</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {doctorDossier.doctorNotes.map((note: any) => (
                        <div key={note.id} style={{ padding: '14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F766E' }}>
                              {note.doctorName} • {note.doctorSpecialization}
                            </span>
                            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                              {note.date}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.5' }}>
                            {note.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      )}

          {/* ======================================================== */}
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
              {digiLockerSubTab === 'patient-overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* MASTER PATIENT CLINICAL PROFILE & IDENTITY CARD */}
                  <div className="card" style={{
                    padding: '28px',
                    borderRadius: '20px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{
                          width: '84px',
                          height: '84px',
                          borderRadius: '20px',
                          background: 'linear-gradient(135deg, #0F766E 0%, #0369A1 100%)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                          fontWeight: 800,
                          boxShadow: '0 8px 20px rgba(15, 118, 110, 0.3)',
                          border: '3px solid #CCFBF1'
                        }}>
                          {(authSession.citizen?.fullName || digiLockerData?.patient?.fullName || 'Rahul Sharma')
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                              {authSession.citizen?.fullName || digiLockerData?.patient?.fullName || 'Rahul Sharma'}
                            </h2>
                            <span style={{
                              background: '#FEF2F2',
                              color: '#DC2626',
                              border: '1.5px solid #FCA5A5',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '0.82rem',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              🩸 Blood Group: {digiLockerData?.patient?.bloodGroup || 'B+'} (Rh Pos)
                            </span>
                            <span className="badge badge-normal" style={{ fontSize: '0.78rem' }}>
                              ✓ ABDM Sovereign ID Verified
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#64748B', fontSize: '0.88rem', marginTop: '8px', flexWrap: 'wrap' }}>
                            <span>Age: <strong>38 Years</strong> (DOB: {digiLockerData?.patient?.dob || '1988-04-15'})</span>
                            <span>•</span>
                            <span>Gender: <strong>{digiLockerData?.patient?.gender || 'Male'}</strong></span>
                            <span>•</span>
                            <span>Universal UHID: <strong style={{ color: '#0F766E', fontFamily: 'monospace' }}>{authSession.citizen?.healthId || digiLockerData?.patient?.healthId || 'MED-00010001'}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Emergency Contact Quick Widget */}
                      <div style={{
                        background: '#FFF1F2',
                        border: '1.5px solid #FECDD3',
                        borderRadius: '14px',
                        padding: '14px 18px',
                        minWidth: '280px'
                      }}>
                        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#BE123C', letterSpacing: '0.05em', marginBottom: '4px' }}>
                          🚨 EMERGENCY NEXT-OF-KIN CONTACT
                        </div>
                        <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#881337' }}>
                          {digiLockerData?.patient?.emergencyContact?.name || 'Pooja Sharma'} ({digiLockerData?.patient?.emergencyContact?.relationship || 'Spouse'})
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#9F1239', fontWeight: 700, marginTop: '2px', fontFamily: 'monospace' }}>
                          📞 {digiLockerData?.patient?.emergencyContact?.phone || '+91-9876543210'}
                        </div>
                      </div>
                    </div>

                    {/* Secondary Identifiers & National Registry Line */}
                    <div style={{
                      marginTop: '20px',
                      paddingTop: '16px',
                      borderTop: '1px solid #F1F5F9',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '14px'
                    }}>
                      <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>ABHA ADDRESS (PHR HANDLE)</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                          {digiLockerData?.digitalHealthCard?.abhaAddress || 'rahulsharma@abdm'}
                        </div>
                      </div>
                      <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>14-DIGIT ABHA NUMBER</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', fontFamily: 'monospace', marginTop: '2px' }}>
                          {digiLockerData?.digitalHealthCard?.abhaNumber || '91-4402-9812-1001'}
                        </div>
                      </div>
                      <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>PRIMARY ATTENDING FACILITY</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F766E', marginTop: '2px' }}>
                          Apollo Super Speciality, New Delhi
                        </div>
                      </div>
                      <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>CLINICAL RISK STRATIFICATION</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#D97706', marginTop: '2px' }}>
                          MODERATE (Glycemic & Lipid Protocol)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CRITICAL SAFETY ALERTS & CONTRAINDICATION PANEL */}
                  <div style={{
                    background: 'linear-gradient(135deg, #FEF2F2 0%, #FFF1F2 100%)',
                    border: '1.5px solid #FCA5A5',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    boxShadow: '0 4px 16px rgba(220, 38, 38, 0.08)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <AlertTriangle size={22} color="#DC2626" />
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#991B1B', margin: 0 }}>
                        Critical Patient Safety Alerts & Clinical Contraindications
                      </h3>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                      {/* Drug Allergy Box */}
                      <div style={{ background: '#FFFFFF', padding: '14px 16px', borderRadius: '12px', border: '1px solid #FECDD3' }}>
                        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#DC2626', letterSpacing: '0.04em' }}>
                          ⚠ DOCUMENTED DRUG ALLERGIES (STRICT CONTRAINDICATION)
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#991B1B', marginTop: '4px' }}>
                          {digiLockerData?.patient?.allergies?.join(', ') || 'Penicillin (Beta-Lactam Antibiotics)'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#7F1D1D', marginTop: '4px', lineHeight: '1.4' }}>
                          Documented severe allergic hypersensitivity reaction (urticaria & angioedema risk). Avoid Amoxicillin, Ampicillin, Piperacillin, and cross-reactive cephalosporins.
                        </div>
                      </div>

                      {/* Familial Risk Box */}
                      <div style={{ background: '#FFFFFF', padding: '14px 16px', borderRadius: '12px', border: '1px solid #FECDD3' }}>
                        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#B45309', letterSpacing: '0.04em' }}>
                          🧬 FAMILIAL & GENETIC DISEASE RISKS
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#78350F', marginTop: '4px' }}>
                          • Maternal Type 2 Diabetes Mellitus<br />
                          • Paternal Essential Hypertension
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#92400E', marginTop: '4px', lineHeight: '1.4' }}>
                          Requires tight bi-annual HbA1c screening and ambulatory blood pressure monitoring.
                        </div>
                      </div>

                      {/* Surgical & Lifestyle Background */}
                      <div style={{ background: '#FFFFFF', padding: '14px 16px', borderRadius: '12px', border: '1px solid #FECDD3' }}>
                        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', letterSpacing: '0.04em' }}>
                          📋 SURGICAL & LIFESTYLE BASELINE
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E293B', marginTop: '4px' }}>
                          • Laparoscopic Appendectomy (2015, Uneventful)<br />
                          • Non-smoker, Non-drinker, Desk Occupation
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px', lineHeight: '1.4' }}>
                          Under daily 45-minute aerobic brisk walking and low glycemic index nutritional protocol.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* LIVE PHYSIOLOGICAL VITALS & METABOLIC BIOMARKERS MATRIX */}
                  <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <HeartPulse size={22} color="#0F766E" />
                          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                            Live Physiological Vitals & Metabolic Biomarkers
                          </h3>
                        </div>
                        <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '4px' }}>
                          Latest cross-verified clinical observations calibrated from hospital encounters and certified laboratory investigations.
                        </p>
                      </div>

                      <button
                        onClick={() => setDigiLockerSubTab('trends')}
                        className="btn-secondary"
                        style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <TrendingUp size={15} />
                        View Longitudinal Multi-Year Graphs →
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                      {/* Vital 1: Blood Pressure */}
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>BLOOD PRESSURE</span>
                          <span className="badge badge-normal" style={{ fontSize: '0.7rem' }}>✓ Optimal</span>
                        </div>
                        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', margin: '6px 0 2px' }}>
                          124 / 82 <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>mmHg</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Reference Target: &lt; 130/85 mmHg</div>
                        <div style={{ fontSize: '0.72rem', color: '#0F766E', fontWeight: 600, marginTop: '4px' }}>
                          Source: Max Healthcare (Jul 2026)
                        </div>
                      </div>

                      {/* Vital 2: HbA1c */}
                      <div style={{ background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: '14px', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F766E' }}>HbA1c (GLYCATED HB)</span>
                          <span className="badge badge-normal" style={{ fontSize: '0.7rem' }}>✓ Controlled</span>
                        </div>
                        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F766E', margin: '6px 0 2px' }}>
                          6.8 <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0D9488' }}>%</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#134E4A' }}>Target: &lt; 7.0% (Improved from 8.7% baseline)</div>
                        <div style={{ fontSize: '0.72rem', color: '#0F766E', fontWeight: 600, marginTop: '4px' }}>
                          Source: Apollo Hospitals (Jul 2026)
                        </div>
                      </div>

                      {/* Vital 3: Fasting Glucose */}
                      <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '14px', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#B45309' }}>FASTING GLUCOSE</span>
                          <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>Target Monitored</span>
                        </div>
                        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#B45309', margin: '6px 0 2px' }}>
                          126 <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#92400E' }}>mg/dL</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#78350F' }}>Target (Diabetic): 80 - 130 mg/dL</div>
                        <div style={{ fontSize: '0.72rem', color: '#B45309', fontWeight: 600, marginTop: '4px' }}>
                          Source: Apollo Hospitals (Jul 2026)
                        </div>
                      </div>

                      {/* Vital 4: Heart Rate */}
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>RESTING HEART RATE</span>
                          <span className="badge badge-normal" style={{ fontSize: '0.7rem' }}>✓ Normal</span>
                        </div>
                        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', margin: '6px 0 2px' }}>
                          74 <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>bpm</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Normal Range: 60 - 100 bpm (Sinus Rhythm)</div>
                        <div style={{ fontSize: '0.72rem', color: '#0F766E', fontWeight: 600, marginTop: '4px' }}>
                          Source: Fortis Healthcare (Aug 2026)
                        </div>
                      </div>

                      {/* Vital 5: SpO2 */}
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>OXYGEN SATURATION (SpO2)</span>
                          <span className="badge badge-normal" style={{ fontSize: '0.7rem' }}>✓ Normal</span>
                        </div>
                        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', margin: '6px 0 2px' }}>
                          99 <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>%</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Normal Room Air: 95 - 100%</div>
                        <div style={{ fontSize: '0.72rem', color: '#0F766E', fontWeight: 600, marginTop: '4px' }}>
                          Source: Fortis Healthcare (Aug 2026)
                        </div>
                      </div>

                      {/* Vital 6: BMI & Weight */}
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>BODY MASS INDEX (BMI)</span>
                          <span className="badge badge-normal" style={{ fontSize: '0.7rem' }}>✓ Healthy Weight</span>
                        </div>
                        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', margin: '6px 0 2px' }}>
                          24.0 <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>kg/m²</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Height: 176 cm • Weight: 74.4 kg</div>
                        <div style={{ fontSize: '0.72rem', color: '#0F766E', fontWeight: 600, marginTop: '4px' }}>
                          Source: Annual Health Check (Jul 2026)
                        </div>
                      </div>

                      {/* Vital 7: Serum Creatinine */}
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>SERUM CREATININE (RENAL)</span>
                          <span className="badge badge-normal" style={{ fontSize: '0.7rem' }}>✓ Normal Renal</span>
                        </div>
                        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', margin: '6px 0 2px' }}>
                          0.90 <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>mg/dL</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Reference: 0.70 - 1.20 mg/dL</div>
                        <div style={{ fontSize: '0.72rem', color: '#0F766E', fontWeight: 600, marginTop: '4px' }}>
                          Source: Dr. Lal PathLabs (May 2026)
                        </div>
                      </div>

                      {/* Vital 8: 25-OH Vitamin D */}
                      <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '14px', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#065F46' }}>25-OH VITAMIN D</span>
                          <span className="badge badge-normal" style={{ fontSize: '0.7rem' }}>✓ Resolved Sufficient</span>
                        </div>
                        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#065F46', margin: '6px 0 2px' }}>
                          38.4 <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#047857' }}>ng/mL</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#065F46' }}>Sufficient: 30 - 100 ng/mL (Baseline: 14 ng/mL)</div>
                        <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, marginTop: '4px' }}>
                          Source: Dr. Lal PathLabs (Sep 2024)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACTIVE MEDICAL CONDITIONS & CERTIFIED RESOLVED ILLNESSES */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '20px' }}>
                    {/* Active Conditions */}
                    <div className="card" style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Activity size={20} color="#D97706" />
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                            Active Ongoing Conditions ({digiLockerData?.lifetimeDiseases?.active?.length || 1})
                          </h3>
                        </div>
                        <button
                          onClick={() => setDigiLockerSubTab('lifetime-diseases')}
                          style={{ fontSize: '0.8rem', color: '#0F766E', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          View Full History →
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {(digiLockerData?.lifetimeDiseases?.active || [
                          {
                            id: 'c1',
                            conditionName: 'Type 2 Diabetes Mellitus (ICD-10 E11.9)',
                            currentStatus: 'UNDER_TREATMENT',
                            severity: 'MODERATE',
                            diagnosingFacility: 'Apollo Hospitals, New Delhi',
                            diagnosedDate: '2025-01-22',
                            treatmentSummary: 'Metformin 500mg BID with meals, lifestyle modification, 45m daily walking.',
                            notes: 'Glycemic control improved: HbA1c downward trajectory 8.7% -> 8.2% -> 7.8% -> 6.9%.'
                          }
                        ]).map((c: any) => (
                          <div key={c.id} style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', padding: '16px', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#92400E', margin: 0 }}>
                                {c.conditionName}
                              </h4>
                              <span className="badge badge-warning">{c.currentStatus}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#78350F', marginBottom: '6px' }}>
                              🏛️ Facility: <strong>{c.diagnosingFacility || 'Apollo Super Speciality'}</strong> • Diagnosed: <strong>{c.diagnosedDate || 'Jan 2025'}</strong>
                            </div>
                            <p style={{ fontSize: '0.84rem', color: '#451A03', lineHeight: '1.5', margin: '4px 0' }}>
                              <strong>Protocol:</strong> {c.treatmentSummary}
                            </p>
                            {c.notes && (
                              <div style={{ fontSize: '0.78rem', color: '#B45309', background: 'rgba(255,255,255,0.7)', padding: '6px 10px', borderRadius: '6px', marginTop: '6px' }}>
                                📈 <strong>Trajectory:</strong> {c.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certified Resolved Past Illnesses */}
                    <div className="card" style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircle2 size={20} color="#059669" />
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                            Past Cured Illnesses with Evidence ({digiLockerData?.lifetimeDiseases?.resolved?.length || 2})
                          </h3>
                        </div>
                        <button
                          onClick={() => setDigiLockerSubTab('lifetime-diseases')}
                          style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          Audit Clinical Evidence →
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {(digiLockerData?.lifetimeDiseases?.resolved || [
                          {
                            id: 'r1',
                            conditionName: 'Severe Vitamin D Deficiency',
                            resolvedDate: '2024-09-20',
                            diagnosingFacility: 'Dr. Lal PathLabs',
                            resolvingReportDetails: {
                              title: 'Cholecalciferol Follow-up 25-OH Vitamin D Test',
                              facility: 'Dr. Lal PathLabs, Delhi',
                              reportDate: '2024-09-20'
                            }
                          },
                          {
                            id: 'r2',
                            conditionName: 'Acute Viral Fever & Bronchitis',
                            resolvedDate: '2024-08-25',
                            diagnosingFacility: 'Fortis Memorial Research Institute',
                            resolvingReportDetails: {
                              title: 'Complete Blood Count (CBC) with Differential',
                              facility: 'Fortis Healthcare',
                              reportDate: '2024-08-25'
                            }
                          }
                        ]).map((c: any) => (
                          <div key={c.id} style={{ background: '#ECFDF5', border: '1.5px solid #A7F3D0', padding: '16px', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#065F46', margin: 0 }}>
                                {c.conditionName}
                              </h4>
                              <span className="badge badge-normal">✓ CURED ({c.resolvedDate})</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#047857', marginBottom: '6px' }}>
                              Diagnosed & Treated At: <strong>{c.diagnosingFacility || 'Network Super Speciality'}</strong>
                            </div>
                            <div style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: '8px', border: '1px solid #D1FAE5', marginTop: '6px' }}>
                              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#065F46', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                📄 CERTIFIED RESOLUTION EVIDENCE:
                              </div>
                              <div style={{ fontSize: '0.82rem', color: '#1F2937', marginTop: '2px', fontWeight: 600 }}>
                                {c.resolvingReportDetails?.title || 'Confirmatory follow-up lab investigation within normal range.'}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#6B7280', marginTop: '2px' }}>
                                Issued by {c.resolvingReportDetails?.facility || 'Accredited NABL Lab'} • Confirmed {c.resolvedDate}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ACTIVE OUTPATIENT MEDICATION REGIMEN */}
                  <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          Current Active Medication Regimen (Pharmacotherapy Schedule)
                        </h3>
                        <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '4px' }}>
                          Prescriptions synchronized across treating physicians with safety cross-referencing against documented allergies.
                        </p>
                      </div>
                      <span className="badge badge-normal" style={{ fontSize: '0.78rem' }}>
                        ✓ Allergen Safe (Zero Penicillin Class Interaction)
                      </span>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                        <thead>
                          <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                            <th style={{ padding: '12px 14px' }}>Medication & Molecule</th>
                            <th style={{ padding: '12px 14px' }}>Dosage & Route</th>
                            <th style={{ padding: '12px 14px' }}>Frequency & Schedule</th>
                            <th style={{ padding: '12px 14px' }}>Clinical Indication</th>
                            <th style={{ padding: '12px 14px' }}>Prescribing Physician</th>
                            <th style={{ padding: '12px 14px' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '14px' }}>
                              <div style={{ fontWeight: 800, color: '#0F172A' }}>💊 Metformin Hydrochloride</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Biguanide • Oral Tablet</div>
                            </td>
                            <td style={{ padding: '14px', fontWeight: 700 }}>500 mg</td>
                            <td style={{ padding: '14px' }}>
                              <span style={{ fontWeight: 700, color: '#0F766E' }}>Twice Daily (BID)</span>
                              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>With breakfast & dinner</div>
                            </td>
                            <td style={{ padding: '14px', color: '#334155' }}>Type 2 Diabetes (Glycemic Control)</td>
                            <td style={{ padding: '14px', fontSize: '0.82rem', color: '#0F766E', fontWeight: 700 }}>
                              Dr. Rajesh Sharma (Apollo)
                            </td>
                            <td style={{ padding: '14px' }}>
                              <span className="badge badge-normal" style={{ fontSize: '0.72rem' }}>Active</span>
                            </td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '14px' }}>
                              <div style={{ fontWeight: 800, color: '#0F172A' }}>💊 Cholecalciferol (Vitamin D3)</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Vitamin Supplement • Oral Softgel</div>
                            </td>
                            <td style={{ padding: '14px', fontWeight: 700 }}>60,000 IU</td>
                            <td style={{ padding: '14px' }}>
                              <span style={{ fontWeight: 700, color: '#0F766E' }}>Once Monthly</span>
                              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Maintenance dosage after breakfast</div>
                            </td>
                            <td style={{ padding: '14px', color: '#334155' }}>Bone Density & Serum Vitamin D Maintenance</td>
                            <td style={{ padding: '14px', fontSize: '0.82rem', color: '#0F766E', fontWeight: 700 }}>
                              Fortis Internal Medicine Clinic
                            </td>
                            <td style={{ padding: '14px' }}>
                              <span className="badge badge-normal" style={{ fontSize: '0.72rem' }}>Maintenance</span>
                            </td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '14px' }}>
                              <div style={{ fontWeight: 800, color: '#0F172A' }}>💊 Omega-3 Marine Triglycerides</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>EPA + DHA • Oral Softgel</div>
                            </td>
                            <td style={{ padding: '14px', fontWeight: 700 }}>1,000 mg</td>
                            <td style={{ padding: '14px' }}>
                              <span style={{ fontWeight: 700, color: '#0F766E' }}>Once Daily (OD)</span>
                              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>With evening meal</div>
                            </td>
                            <td style={{ padding: '14px', color: '#334155' }}>Mild Dyslipidemia (Triglyceride Modulation)</td>
                            <td style={{ padding: '14px', fontSize: '0.82rem', color: '#0F766E', fontWeight: 700 }}>
                              Max Healthcare Preventive Clinic
                            </td>
                            <td style={{ padding: '14px' }}>
                              <span className="badge badge-normal" style={{ fontSize: '0.72rem' }}>Active</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* FEDERATED HOSPITAL NETWORK & RECORD PROVENANCE */}
                  <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          Connected Healthcare Network & Data Provenance
                        </h3>
                        <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '4px' }}>
                          Hospitals and diagnostic centers with authenticated digital contributions in your sovereign medical record.
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setDigiLockerSubTab('issued-docs')}
                          className="btn-primary"
                          style={{ fontSize: '0.82rem', padding: '8px 14px' }}
                        >
                          Browse All {digiLockerData?.stats?.totalIssuedDocuments || 14} Reports →
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <Building2 size={18} color="#0F766E" />
                          <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Apollo Hospitals</h4>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>New Delhi • Endocrinology & Cardiology</div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F766E', marginTop: '6px' }}>
                          4 Diagnostic Records • Active Attending
                        </div>
                      </div>

                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <Building2 size={18} color="#0F766E" />
                          <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Fortis Memorial</h4>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Gurugram • Pulmonology & Internal Medicine</div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F766E', marginTop: '6px' }}>
                          3 Diagnostic Records • Acute Care Record
                        </div>
                      </div>

                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <Building2 size={18} color="#0F766E" />
                          <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Max Healthcare</h4>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Saket, New Delhi • Executive Wellness</div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F766E', marginTop: '6px' }}>
                          3 Diagnostic Records • Annual Health Checks
                        </div>
                      </div>

                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <Building2 size={18} color="#0F766E" />
                          <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Dr. Lal PathLabs</h4>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>NABL Accredited • Pathology Laboratory</div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F766E', marginTop: '6px' }}>
                          4 Pathology Ingestions • Longitudinal Vitals
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

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

              {/* 4. SUBTAB: MULTI-HOSPITAL TIMELINE */}
              {digiLockerSubTab === 'timeline' && (
                <div className="card" style={{ padding: '24px' }}>
                  <h2 style={{ fontSize: '1.35rem', color: '#0F172A', marginBottom: '14px' }}>
                    Multi-Hospital Health Timeline
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {(digiLockerData?.recentTimeline || timelineEvents || []).map((e: any) => (
                      <div key={e.id} style={{ display: 'flex', gap: '16px', padding: '14px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '1.3rem' }}>
                          {e.eventType === 'LAB_RESULT' ? '🧪' : e.eventType === 'DIAGNOSIS' ? '🩺' : '📄'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A' }}>{e.title}</h4>
                            <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{e.eventDate}</span>
                          </div>
                          <p style={{ fontSize: '0.84rem', color: '#334155', marginTop: '4px' }}>{e.summary}</p>
                          <div style={{ fontSize: '0.74rem', color: '#0F766E', marginTop: '4px', fontWeight: 600 }}>
                            Facility: {e.hospitalFacility || 'Accredited Health Center'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. SUBTAB: BIOMARKER TRENDS */}
              {digiLockerSubTab === 'trends' && (
                <div className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.35rem', color: '#0F172A' }}>
                        Biomarker Trajectory Across Multi-Year Investigations
                      </h2>
                      <p style={{ fontSize: '0.84rem', color: '#64748B' }}>
                        Unified trends across tests conducted at Apollo, Fortis, Max, AIIMS, and Dr. Lal PathLabs.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['HBA1C', 'GLU_FAST', 'VIT_D', 'CREATININE', 'WBC'].map(pCode => (
                        <button
                          key={pCode}
                          onClick={() => handleTrendParamChange(pCode)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            background: selectedTrendParam === pCode ? '#0F766E' : '#F1F5F9',
                            color: selectedTrendParam === pCode ? '#FFFFFF' : '#475569'
                          }}
                        >
                          {pCode}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ height: '320px', width: '100%' }}>
                    {trends?.readings && trends.readings.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trends.readings}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                          <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                          <YAxis stroke="#94A3B8" fontSize={12} domain={['auto', 'auto']} />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" stroke="#0F766E" strokeWidth={3} dot={{ r: 6, fill: '#0D9488' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
                        No readings available.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 6. SUBTAB: DIGILOCKER CONSENT & ACCESS LOGS */}
              {digiLockerSubTab === 'consent' && (
                <div className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.35rem', color: '#0F172A' }}>
                        Sovereign Consent & Institutional Access Permissions
                      </h2>
                      <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '4px' }}>
                        You retain sovereign ownership. Every hospital access event is logged under Indian DPDPA & ABDM protocols.
                      </p>
                    </div>
                    <button onClick={() => alert('All active consent authorizations verified under Indian DPDPA compliance.')} className="btn-secondary" style={{ fontSize: '0.84rem' }}>
                      Audit All Tokens
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {(digiLockerData?.consentLogs || []).map((c: any, idx: number) => (
                      <div key={idx} style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Building2 size={16} color="#0F766E" />
                            <span style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0F172A' }}>
                              {c.facilityName}
                            </span>
                            <span className="badge badge-normal">
                              ✓ {c.consentStatus}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
                            Access Level: <strong>{c.accessType}</strong> • Purpose: {c.purpose}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            onClick={() => alert(`Revoked clinical data access for ${c.facilityName}.`)}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#DC2626' }}
                          >
                            Revoke Access
                          </button>
                          <button
                            onClick={() => alert(`Emergency 24-hour pass extended to ${c.facilityName}.`)}
                            className="btn-primary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          >
                            Grant 24h Pass
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. SUBTAB: MEDISUTRA AI EXPLAINER */}
              {digiLockerSubTab === 'ai' && (
                <div className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Sparkles size={20} color="#0F766E" />
                    <h2 style={{ fontSize: '1.35rem', color: '#0F172A' }}>
                      MediSutra AI Health Explainer
                    </h2>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: '#64748B', marginBottom: '18px' }}>
                    Ask questions in English, Hindi, or Hinglish to understand your diagnostic reports and disease timelines without medical jargon.
                  </p>

                  <form onSubmit={(e) => { e.preventDefault(); handleSendAiQuery(aiQuery); }} style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
                    <input
                      type="text"
                      placeholder="e.g. Kya mera HbA1c pehle se behtar hai? Ya Fortis ki report me kya nikla?"
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                    <button type="submit" disabled={aiLoading} className="btn-primary" style={{ padding: '12px 20px' }}>
                      {aiLoading ? 'Explaining...' : 'Ask AI'}
                    </button>
                  </form>

                  {aiResponse && (
                    <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.94rem', color: '#0F172A', lineHeight: '1.6', marginBottom: '10px' }}>
                        {aiResponse.answer || aiResponse.explanation}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        ⚠ {aiResponse.safetyDisclaimer}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: PAST DISEASES & LIFETIME MEDICAL HISTORY            */}
          {/* ======================================================== */}
          {activeTab === 'past-diseases' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F0FDFA', color: '#0F766E', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '8px' }}>
                  <History size={15} />
                  COMPLETE MEDICAL BIOGRAPHY
                </div>
                <h2 style={{ fontSize: '1.65rem' }}>Past Diseases & Lifetime Condition Trajectory</h2>
                <p style={{ fontSize: '0.88rem', color: '#64748B' }}>
                  Chronological record of every medical condition, acute infection, or chronic diagnosis documented across this patient's lifespan.
                </p>
              </div>

              {/* Summary Stats of Conditions */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div className="card" style={{ padding: '18px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>TOTAL LIFETIME CONDITIONS</span>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F766E', margin: '4px 0' }}>
                    {conditions.length}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Documented Since 2023</span>
                </div>

                <div className="card" style={{ padding: '18px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>ACTIVE UNDER MANAGEMENT</span>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#D97706', margin: '4px 0' }}>
                    {conditions.filter(c => c.currentStatus !== 'RESOLVED').length}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Requiring Ongoing Care</span>
                </div>

                <div className="card" style={{ padding: '18px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>DOCUMENTED RESOLVED</span>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669', margin: '4px 0' }}>
                    {conditions.filter(c => c.currentStatus === 'RESOLVED').length}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#059669' }}>Cured with Evidence</span>
                </div>
              </div>

              {/* Conditions List Deck */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {conditions.map((cond) => {
                  const isResolved = cond.currentStatus === 'RESOLVED';
                  return (
                    <div
                      key={cond.id}
                      className="card"
                      style={{
                        padding: '22px',
                        borderLeft: `5px solid ${isResolved ? '#059669' : '#0F766E'}`
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h3 style={{ fontSize: '1.25rem', color: '#0F172A' }}>
                              {cond.conditionName}
                            </h3>
                            <span className={`badge ${isResolved ? 'badge-normal' : 'badge-warning'}`}>
                              {cond.currentStatus}
                            </span>
                            <span className="badge badge-teal">
                              {cond.bodySystem}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '6px' }}>
                            <strong>First Recorded:</strong> {cond.firstDocumentedDate}
                            {cond.diagnosedDate && <> • <strong>Diagnosed:</strong> {cond.diagnosedDate}</>}
                            {cond.resolvedDate && <> • <strong>Resolved On:</strong> <strong style={{ color: '#059669' }}>{cond.resolvedDate}</strong></>}
                          </div>
                        </div>

                        {/* Disease Severity Indicator */}
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>SEVERITY LEVEL:</span>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: cond.severity === 'SEVERE' ? '#DC2626' : cond.severity === 'MODERATE' ? '#D97706' : '#059669' }}>
                            {cond.severity || 'MODERATE'}
                          </div>
                        </div>
                      </div>

                      {/* Treatment & Resolution Details */}
                      <div style={{ marginTop: '14px', padding: '14px', background: '#F8FAFC', borderRadius: '10px', fontSize: '0.88rem', color: '#334155', lineHeight: '1.6' }}>
                        <p><strong>Treatment Given:</strong> {cond.treatmentSummary || 'Symptomatic management'}</p>
                        {cond.notes && <p style={{ marginTop: '4px', color: '#64748B' }}><strong>Clinical Summary:</strong> {cond.notes}</p>}
                        {cond.resolvingReportId && (
                          <p style={{ marginTop: '6px', color: '#0F766E', fontWeight: 600 }}>
                            📄 Resolving Evidence Document ID: <u>{cond.resolvingReportId}</u>
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: ALL PREVIOUS REPORTS VAULT                          */}
          {/* ======================================================== */}
          {activeTab === 'all-reports' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F0FDFA', color: '#0F766E', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '8px' }}>
                  <FolderArchive size={15} />
                  COMPLETE DIAGNOSTIC RECORD ARCHIVE
                </div>
                <h2 style={{ fontSize: '1.65rem' }}>All Previous Reports Across Years</h2>
                <p style={{ fontSize: '0.88rem', color: '#64748B' }}>
                  Every diagnostic blood test, metabolic panel, ultrasound, and prescription verified with SHA-256 integrity and extracted clinical findings.
                </p>
              </div>

              {/* Filter & Search Bar */}
              <div className="card" style={{ padding: '16px 20px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px', background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '6px 12px', borderRadius: '8px' }}>
                  <Search size={16} color="#64748B" />
                  <input
                    type="text"
                    placeholder="Search all previous reports by test name, lab facility, or parameter..."
                    value={reportSearchQuery}
                    onChange={(e) => setReportSearchQuery(e.target.value)}
                    style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.88rem' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B' }}>Year:</label>
                  <select
                    value={selectedYearFilter}
                    onChange={(e) => setSelectedYearFilter(e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.85rem' }}
                  >
                    <option value="ALL">All Years (2023–2026)</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B' }}>Category:</label>
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.85rem' }}
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

              {/* Ingest / Upload Past Report Card */}
              <div className="card" style={{ border: '2px dashed #0D9488', background: '#F0FDFA', padding: '20px' }}>
                <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: '#CCFBF1', color: '#0F766E', padding: '8px', borderRadius: '8px' }}>
                      <Upload size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', color: '#0F766E' }}>Ingest Additional Previous Diagnostic Report</h4>
                      <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        Upload historical blood tests, metabolic panels, or prescriptions to attach to this patient's lifetime records.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder="Filename (e.g. CBC_Feb2024.pdf)"
                      value={uploadFilename}
                      onChange={(e) => setUploadFilename(e.target.value)}
                      required
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.85rem' }}
                    />
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.85rem' }}
                    >
                      <option value="Metabolic">Metabolic / Diabetes</option>
                      <option value="Blood">Blood / CBC</option>
                      <option value="Renal">Renal / KFT</option>
                      <option value="Imaging">Imaging / Ultrasound</option>
                      <option value="Prescription">Prescription</option>
                    </select>
                    <select
                      value={uploadType}
                      onChange={(e) => setUploadType(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.85rem' }}
                    >
                      <option value="Comprehensive Metabolic Panel">Metabolic Panel</option>
                      <option value="Complete Blood Count (CBC)">CBC Hemogram</option>
                      <option value="Renal Function Test (KFT)">Renal Profile (KFT)</option>
                      <option value="Thyroid Profile (TSH, T3, T4)">Thyroid Profile</option>
                      <option value="Ultrasound / Imaging Report">Ultrasound / Imaging</option>
                      <option value="Clinical Prescription">Prescription</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Facility (e.g. Apollo Diagnostics)"
                      value={uploadFacility}
                      onChange={(e) => setUploadFacility(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.85rem' }}
                    />
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.85rem', justifyContent: 'center' }}
                    >
                      {isUploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
                      {uploadSuccess ? 'Ingested!' : 'Ingest Report'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Grouped Reports Deck */}
              {Object.keys(groupedReportsByYear).sort((a,b) => b.localeCompare(a)).map(year => (
                <div key={year} className="card" style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '2px solid #F1F5F9', paddingBottom: '10px' }}>
                    <Calendar size={18} color="#0F766E" />
                    <h3 style={{ fontSize: '1.25rem', color: '#0F172A' }}>
                      Year {year} Diagnostic Reports
                    </h3>
                    <span className="badge badge-teal">
                      {groupedReportsByYear[year].length} Reports
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                    {groupedReportsByYear[year].map((doc: any) => (
                      <div
                        key={doc.id}
                        style={{
                          background: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          borderRadius: '12px',
                          padding: '18px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <span className="badge badge-teal" style={{ fontSize: '0.72rem' }}>
                              {doc.category || 'Diagnostic'}
                            </span>
                            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                              {doc.reportDate}
                            </span>
                          </div>

                          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                            {doc.originalFilename}
                          </h4>

                          <div style={{ fontSize: '0.78rem', color: '#0F766E', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Building2 size={13} />
                            {doc.labFacility || 'Diagnostic Laboratory'}
                          </div>

                          <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '8px', lineHeight: '1.4' }}>
                            {doc.keyFindingsSummary}
                          </p>
                        </div>

                        <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {doc.abnormalCount > 0 ? (
                              <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>
                                <AlertTriangle size={12} />
                                {doc.abnormalCount} Abnormal Values
                              </span>
                            ) : (
                              <span className="badge badge-normal" style={{ fontSize: '0.7rem' }}>
                                ✓ Normal Values
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => setInspectingReport(doc)}
                            className="btn-primary"
                            style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                          >
                            <Eye size={13} />
                            Inspect Findings
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: DASHBOARD                                           */}
          {/* ======================================================== */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Patient Digital Health ID Banner Card */}
              <div className="card" style={{
                background: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)',
                color: '#FFFFFF',
                padding: '28px',
                borderRadius: '20px',
                boxShadow: '0 8px 20px rgba(15, 118, 110, 0.25)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{
                      background: 'rgba(255,255,255,0.2)',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      letterSpacing: '0.05em'
                    }}>
                      DIGITAL HEALTH IDENTITY
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#99F6E4' }}>
                      Verified Record
                    </span>
                  </div>
                  <h1 style={{ color: '#FFFFFF', fontSize: '1.85rem', marginBottom: '6px' }}>
                    {patientData?.patient?.fullName || 'Rahul Sharma'}
                  </h1>
                  <p style={{ color: '#CCFBF1', fontSize: '0.92rem' }}>
                    Health ID: <strong style={{ color: '#FFFFFF', letterSpacing: '0.02em' }}>{patientData?.patient?.healthId || 'MED-00010001'}</strong> • Age: 38 • Sex: Male • Blood Group: <strong>B+</strong>
                  </p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
                    <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem' }}>
                      Allergies: <strong>Penicillin</strong>
                    </span>
                    <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem' }}>
                      Emergency Contact: <strong>Pooja Sharma (+91-9876543210)</strong>
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setActiveTab('all-reports')}
                    className="btn-secondary"
                    style={{ background: 'rgba(255,255,255,0.9)', color: '#0F766E', border: 'none' }}
                  >
                    <FolderArchive size={16} />
                    View All Previous Reports
                  </button>
                  <button
                    onClick={() => setActiveTab('ai')}
                    style={{
                      background: '#F59E0B',
                      color: '#0F172A',
                      padding: '10px 18px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Sparkles size={16} />
                    Ask MediSutra AI
                  </button>
                </div>
              </div>

              {/* Longitudinal Health State Summary (3 Core Questions) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ background: '#F0FDFA', color: '#0F766E', padding: '8px', borderRadius: '8px' }}>
                      <Activity size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>QUESTION 1</div>
                      <h3 style={{ fontSize: '1.05rem' }}>What is my health record?</h3>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.6' }}>
                    <p style={{ marginBottom: '8px' }}>
                      • <strong>Active Conditions:</strong> Type 2 Diabetes, Mild Dyslipidemia
                    </p>
                    <p style={{ marginBottom: '8px' }}>
                      • <strong>Documented Resolved:</strong> Severe Vitamin D Deficiency, Acute Viral Fever, Gastroenteritis
                    </p>
                    <p>
                      • <strong>Active Therapy:</strong> Metformin 500mg BID
                    </p>
                  </div>
                </div>

                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ background: '#ECFDF5', color: '#059669', padding: '8px', borderRadius: '8px' }}>
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>QUESTION 2</div>
                      <h3 style={{ fontSize: '1.05rem' }}>What has changed?</h3>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.6' }}>
                    <p style={{ marginBottom: '8px' }}>
                      • <strong>HbA1c:</strong> Declined from <strong>8.7%</strong> (Jan 2025) to <strong>6.9%</strong> (Jul 2026).
                    </p>
                    <p style={{ marginBottom: '8px' }}>
                      • <strong>Fasting Sugar:</strong> Reduced from <strong>172</strong> to <strong>138 mg/dL</strong>.
                    </p>
                    <p>
                      • <strong>Vitamin D:</strong> Normalized from <strong>14</strong> to <strong>38 ng/mL</strong>.
                    </p>
                  </div>
                </div>

                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ background: '#EFF6FF', color: '#2563EB', padding: '8px', borderRadius: '8px' }}>
                      <Shield size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>QUESTION 3</div>
                      <h3 style={{ fontSize: '1.05rem' }}>Where is the evidence?</h3>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.6' }}>
                    <p style={{ marginBottom: '8px' }}>
                      • <strong>{documents.length || 12} Diagnostic Reports</strong> spanning 2023 to 2026.
                    </p>
                    <p style={{ marginBottom: '8px' }}>
                      • <strong>All Past Diseases</strong> verified with resolving reports.
                    </p>
                    <p>
                      • Every claim has a <strong>verifiable citation</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Overview Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div className="card" style={{ padding: '18px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>ACTIVE CONDITIONS</span>
                  <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0F766E', margin: '4px 0' }}>
                    {conditions.filter(c => c.currentStatus !== 'RESOLVED').length}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Under Active Management</span>
                </div>

                <div className="card" style={{ padding: '18px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>RESOLVED CONDITIONS</span>
                  <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#059669', margin: '4px 0' }}>
                    {conditions.filter(c => c.currentStatus === 'RESOLVED').length}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#059669' }}>Documented Recovery</span>
                </div>

                <div className="card" style={{ padding: '18px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>PREVIOUS REPORTS</span>
                  <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#2563EB', margin: '4px 0' }}>
                    {documents.length || 12}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Spanning 2023–2026</span>
                </div>

                <div className="card" style={{ padding: '18px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>HEALTH EVENTS</span>
                  <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#7C3AED', margin: '4px 0' }}>
                    {timelineEvents.length || 8}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Chronological Milestones</span>
                </div>
              </div>

              {/* ABDM Ecosystem & Sovereign Data Consent Bar */}
              <div className="card" style={{
                background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
                border: '1px solid #A7F3D0',
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge badge-normal" style={{ fontSize: '0.78rem' }}>
                      ✓ ABDM CONNECT (AYUSHMAN BHARAT DIGITAL MISSION)
                    </span>
                    <span style={{ fontSize: '0.82rem', color: '#047857', fontWeight: 600 }}>
                      ABHA Address: <strong>rahul.sharma@abdm</strong> (ID: 91-8822-1004-9021)
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: '#065F46', marginBottom: '4px' }}>
                    4 Linked Care Contexts Across Hospitals & Diagnostic Labs
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: '#047857' }}>
                    Sovereign Consent Active: <strong>CONSENT-MED-9921</strong> granted to <strong>Dr. Alok Sen, MD</strong> (Apollo Health City). Valid until Jul 2027.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    onClick={async () => {
                      const res = await api.getMedsStream(patientData?.patient?.id || 'pat-demo-001');
                      const jsonStr = JSON.stringify(res.data, null, 2);
                      const blob = new Blob([jsonStr], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `meds_event_stream_${patientData?.patient?.healthId || 'MED-00010001'}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="btn-secondary"
                    style={{ background: '#FFFFFF', borderColor: '#A7F3D0', color: '#065F46', fontSize: '0.84rem' }}
                  >
                    <Download size={14} style={{ marginRight: '4px' }} />
                    Export MEDS Stream
                  </button>
                  <button
                    onClick={() => {
                      alert("ABDM Sovereign Consent: As an Indian citizen with ABHA ID 91-8822-1004-9021, you retain full rights under ABDM guidelines to revoke data access at any time.");
                    }}
                    className="btn-primary"
                    style={{ background: '#059669', fontSize: '0.84rem' }}
                  >
                    ABDM Consent Manager
                  </button>
                </div>
              </div>

              {/* Timeline Snapshot & Recent Reports Split View */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>

                
                {/* Timeline Snapshot */}
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem' }}>Longitudinal Health Timeline</h3>
                      <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Chronological milestones across 4 years</p>
                    </div>
                    <button onClick={() => setActiveTab('timeline')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                      View Complete Timeline →
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {timelineEvents.slice(0, 4).map((evt, idx) => (
                      <div key={evt.id || idx} style={{
                        display: 'flex',
                        gap: '14px',
                        padding: '12px',
                        borderRadius: '10px',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0'
                      }}>
                        <div style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          background: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          height: 'fit-content',
                          textAlign: 'center',
                          minWidth: '78px'
                        }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B' }}>
                            {evt.eventDate.split('-')[0]}
                          </div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F766E' }}>
                            {evt.eventDate.split('-').slice(1).join('/')}
                          </div>
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A' }}>
                              {evt.title}
                            </span>
                            <span className={`badge ${evt.severity === 'NORMAL' ? 'badge-normal' : evt.severity === 'HIGH' ? 'badge-danger' : 'badge-warning'}`}>
                              {evt.severity}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px' }}>
                            {evt.summary}
                          </p>
                          <div style={{ fontSize: '0.74rem', color: '#0F766E', marginTop: '6px', fontWeight: 600 }}>
                            📄 {evt.documentName}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Documents & Quick Checkpoint Status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Quick Checkpoint Widget */}
                  <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '1.15rem' }}>Diabetes Protocol Monitoring</h3>
                      <button onClick={() => setActiveTab('journeys')} style={{ fontSize: '0.8rem', color: '#0F766E', fontWeight: 600 }}>
                        Inspect Journey →
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#ECFDF5', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#059669' }}>M2 (Month 2 Checkup)</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669' }}>✓ AVAILABLE</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#FFFBEB', borderRadius: '8px', border: '1px solid #FDE68A' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#D97706' }}>M4 (Month 4 Checkup)</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#D97706' }}>⚠ NO RECORD IN SYSTEM</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#ECFDF5', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#059669' }}>M6 (Month 6 Checkup)</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669' }}>✓ AVAILABLE</span>
                      </div>
                    </div>
                  </div>

                  {/* Previous Reports Quick Access */}
                  <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '1.15rem' }}>All Previous Reports Snapshot</h3>
                      <button onClick={() => setActiveTab('all-reports')} style={{ fontSize: '0.8rem', color: '#0F766E', fontWeight: 600 }}>
                        Vault Archive ({documents.length}) →
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {documents.slice(0, 3).map(doc => (
                        <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#F8FAFC', borderRadius: '8px' }}>
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>{doc.originalFilename}</div>
                            <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{doc.documentType} • {doc.reportDate}</div>
                          </div>
                          <button onClick={() => setInspectingReport(doc)} style={{ fontSize: '0.78rem', color: '#0F766E', fontWeight: 700 }}>
                            Inspect →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: HEALTH TIMELINE                                     */}
          {/* ======================================================== */}
          {activeTab === 'timeline' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem' }}>Longitudinal Health Timeline</h2>
                <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Unified chronological sequence of health events, lab results, and diagnoses.
                </p>
              </div>

              {/* Chronological Event Tree */}
              <div style={{ position: 'relative', paddingLeft: '28px', borderLeft: '2px solid #CCFBF1' }}>
                {timelineEvents.map((evt, idx) => (
                  <div key={evt.id || idx} style={{ position: 'relative', marginBottom: '24px' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-37px',
                      top: '18px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: evt.severity === 'HIGH' ? '#DC2626' : '#0F766E',
                      border: '3px solid #FFFFFF',
                      boxShadow: '0 0 0 2px #CCFBF1'
                    }} />

                    <div className="card" style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F766E' }}>
                            {evt.eventDate}
                          </span>
                          <span className="badge badge-teal">
                            {evt.eventType}
                          </span>
                          {evt.conditionName && (
                            <span className="badge badge-info">
                              {evt.conditionName}
                            </span>
                          )}
                        </div>

                        <span className={`badge ${evt.severity === 'NORMAL' ? 'badge-normal' : evt.severity === 'HIGH' ? 'badge-danger' : 'badge-warning'}`}>
                          {evt.severity}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '6px' }}>
                        {evt.title}
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5' }}>
                        {evt.summary}
                      </p>

                      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#0F766E', fontWeight: 600 }}>
                        <FileText size={15} />
                        Source Document: <u>{evt.documentName}</u> (Page {evt.sourcePageNumber || 1})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: CONDITION JOURNEYS & CHECKPOINTS                    */}
          {/* ======================================================== */}
          {activeTab === 'journeys' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem' }}>Condition Journeys & Protocol Tracker</h2>
                <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Explore how medical conditions progress across clinical stages and verify expected vs. actual monitoring records.
                </p>
              </div>

              {/* Condition Selector Tabs */}
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                {conditions.map(c => {
                  const isSelected = selectedCondition?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelectCondition(c)}
                      className="card"
                      style={{
                        padding: '14px 20px',
                        minWidth: '220px',
                        textAlign: 'left',
                        borderColor: isSelected ? '#0F766E' : '#E2E8F0',
                        background: isSelected ? '#F0FDFA' : '#FFFFFF'
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>{c.bodySystem}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                        {c.conditionName}
                      </div>
                      <span className={`badge ${c.currentStatus === 'RESOLVED' ? 'badge-normal' : 'badge-warning'}`} style={{ marginTop: '8px' }}>
                        {c.currentStatus}
                      </span>
                    </button>
                  );
                })}
              </div>

              {journeyData && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
                  {/* Disease Journey Stages */}
                  <div className="card">
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>
                      {journeyData.condition.conditionName} — Journey Stages
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '20px' }}>
                      Chronological evolution from initial detection to latest documented status.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {journeyData.stages.map((stage: any, index: number) => (
                        <div key={stage.id} style={{ display: 'flex', gap: '14px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: '#0F766E',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}>
                              {index + 1}
                            </div>
                            {index < journeyData.stages.length - 1 && (
                              <div style={{ width: '2px', flex: 1, background: '#CBD5E1', minHeight: '30px' }} />
                            )}
                          </div>

                          <div style={{ flex: 1, paddingBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                                {stage.label}
                              </span>
                              <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                                {stage.stageDate}
                              </span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
                              {stage.description}
                            </p>
                            {stage.documentName && (
                              <div style={{ fontSize: '0.75rem', color: '#0F766E', marginTop: '6px', fontWeight: 600 }}>
                                📄 {stage.documentName}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expected vs Actual Checkpoints */}
                  <div className="card">
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>
                      Monitoring Protocol Checkpoints
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '20px' }}>
                      Reconciled against configured periodic checkpoints without judging patient compliance.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {journeyData.checkpoints.map((chk: any) => {
                        const isSatisfied = chk.status === 'SATISFIED';
                        return (
                          <div
                            key={chk.id}
                            style={{
                              padding: '16px',
                              borderRadius: '12px',
                              border: `1px solid ${isSatisfied ? '#A7F3D0' : '#FDE68A'}`,
                              background: isSatisfied ? '#ECFDF5' : '#FFFBEB'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: 700, color: isSatisfied ? '#059669' : '#D97706', fontSize: '0.95rem' }}>
                                {chk.code}
                              </span>
                              <span className={`badge ${isSatisfied ? 'badge-normal' : 'badge-warning'}`}>
                                {isSatisfied ? 'AVAILABLE' : 'NO RECORD'}
                              </span>
                            </div>

                            <p style={{ fontSize: '0.85rem', color: isSatisfied ? '#065F46' : '#92400E', marginTop: '6px' }}>
                              {chk.evaluationNotes}
                            </p>

                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '6px' }}>
                              Target Interval Window: {chk.targetDate}
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

          {/* ======================================================== */}
          {/* TAB: TRENDS & REPORT COMPARISON                          */}
          {/* ======================================================== */}
          {activeTab === 'trends' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem' }}>Longitudinal Trends & Report Comparison</h2>
                <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Interactive time-series curves and bilateral delta analysis across diagnostic checkpoints.
                </p>
              </div>

              {/* Parameter Trend Chart */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem' }}>
                      Parameter Trajectory: {trends?.parameterName || 'HbA1c'}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
                      {trends?.summary}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['HBA1C', 'GLU_FAST', 'VIT_D', 'CREATININE', 'WBC'].map(pCode => (
                      <button
                        key={pCode}
                        onClick={() => handleTrendParamChange(pCode)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          background: selectedTrendParam === pCode ? '#0F766E' : '#F1F5F9',
                          color: selectedTrendParam === pCode ? '#FFFFFF' : '#475569'
                        }}
                      >
                        {pCode}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ height: '320px', width: '100%', marginTop: '10px' }}>
                  {trends?.readings && trends.readings.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trends.readings} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                        <YAxis stroke="#94A3B8" fontSize={12} domain={['auto', 'auto']} />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const d = payload[0].payload;
                              return (
                                <div style={{ background: '#FFFFFF', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}>
                                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{d.date}</div>
                                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F766E' }}>
                                    {d.value} {d.unit}
                                  </div>
                                  <div style={{ fontSize: '0.72rem', color: '#0F766E', marginTop: '4px' }}>
                                    📄 {d.sourceDocumentName} (Page {d.sourcePageNumber})
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        {trends.referenceMax && (
                          <ReferenceLine y={trends.referenceMax} stroke="#DC2626" strokeDasharray="4 4" label={{ value: `Upper Ref: ${trends.referenceMax}`, fill: '#DC2626', fontSize: 11 }} />
                        )}
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#0F766E"
                          strokeWidth={3}
                          dot={{ r: 6, fill: '#0D9488', strokeWidth: 2, stroke: '#FFFFFF' }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
                      No data readings found.
                    </div>
                  )}
                </div>
              </div>

              {/* Bilateral Report Comparison */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem' }}>Bilateral Report Delta Comparison</h3>
                    <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
                      Select any two diagnostic reports to inspect numerical changes and clinical directions.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <select
                      value={reportA}
                      onChange={(e) => setReportA(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF' }}
                    >
                      {documents.map(d => (
                        <option key={d.id} value={d.id}>{d.originalFilename} ({d.reportDate})</option>
                      ))}
                    </select>

                    <span style={{ fontWeight: 700, color: '#64748B' }}>vs</span>

                    <select
                      value={reportB}
                      onChange={(e) => setReportB(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF' }}
                    >
                      {documents.map(d => (
                        <option key={d.id} value={d.id}>{d.originalFilename} ({d.reportDate})</option>
                      ))}
                    </select>

                    <button onClick={handleRunComparison} className="btn-primary" style={{ padding: '8px 16px' }}>
                      Compare
                    </button>
                  </div>
                </div>

                {comparisonResult && (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                          <th style={{ padding: '12px 18px' }}>Parameter</th>
                          <th style={{ padding: '12px 18px' }}>Earlier Value ({comparisonResult.reportPrevious?.date})</th>
                          <th style={{ padding: '12px 18px' }}>Later Value ({comparisonResult.reportCurrent?.date})</th>
                          <th style={{ padding: '12px 18px' }}>Absolute Delta</th>
                          <th style={{ padding: '12px 18px' }}>Change (%)</th>
                          <th style={{ padding: '12px 18px' }}>Direction</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonResult.comparison.map((row: any) => (
                          <tr key={row.parameterCode} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '14px 18px', fontWeight: 600, color: '#0F172A' }}>
                              {row.parameterName}
                            </td>
                            <td style={{ padding: '14px 18px', color: '#475569' }}>
                              {row.previousValue !== null ? `${row.previousValue} ${row.unit}` : 'N/A'}
                            </td>
                            <td style={{ padding: '14px 18px', fontWeight: 700, color: '#0F172A' }}>
                              {row.currentValue !== null ? `${row.currentValue} ${row.unit}` : 'N/A'}
                            </td>
                            <td style={{ padding: '14px 18px', fontWeight: 700, color: row.delta < 0 ? '#059669' : row.delta > 0 ? '#DC2626' : '#64748B' }}>
                              {row.delta !== null ? (row.delta > 0 ? `+${row.delta}` : `${row.delta}`) : 'N/A'}
                            </td>
                            <td style={{ padding: '14px 18px', color: row.percentChange < 0 ? '#059669' : '#DC2626' }}>
                              {row.percentChange !== null ? `${row.percentChange}%` : 'N/A'}
                            </td>
                            <td style={{ padding: '14px 18px' }}>
                              <span className={`badge ${row.direction === 'DECREASED' ? 'badge-normal' : row.direction === 'INCREASED' ? 'badge-danger' : 'badge-info'}`}>
                                {row.direction}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: MEDISUTRA AI                                        */}
          {/* ======================================================== */}
          {activeTab === 'ai' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '960px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F0FDFA', color: '#0F766E', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px' }}>
                  <Sparkles size={16} />
                  LONGITUDINAL HEALTH INTELLIGENCE
                </div>
                <h2 style={{ fontSize: '1.8rem', color: '#0F172A' }}>Ask About Medical History & Previous Reports</h2>
                <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
                  Ask questions in <strong>English, Hindi, or Hinglish</strong>. Every claim is strictly validated against documents.
                </p>
              </div>

              {/* Quick Suggestions Pills */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {[
                  "Meri sugar pichli report se kam hui kya?",
                  "Summarize my complete health history",
                  "Which checkpoints have no corresponding record?",
                  "What past diseases did I have?",
                  "What is my cholesterol level?",
                  "Should I increase Metformin to 1000mg?"
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendAiQuery(prompt)}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.78rem',
                      color: '#334155',
                      fontWeight: 500
                    }}
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>

              {/* Query Input Bar */}
              <div className="card" style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                <input
                  type="text"
                  placeholder="Ask a question about your medical history, reports, or trends..."
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAiQuery()}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    padding: '12px 16px',
                    fontSize: '0.95rem'
                  }}
                />
                <button
                  onClick={() => handleSendAiQuery()}
                  disabled={aiLoading}
                  className="btn-primary"
                  style={{ padding: '10px 20px' }}
                >
                  {aiLoading ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
                  Ask AI
                </button>
              </div>

              {/* AI Response Display */}
              {aiResponse && (
                <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className={`badge ${aiResponse.evidenceStrength === 'STRONG' ? 'badge-normal' : aiResponse.evidenceStrength === 'LIMITED' ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                        {aiResponse.evidenceStrength === 'STRONG' ? '🟢 STRONG EVIDENCE' : aiResponse.evidenceStrength === 'LIMITED' ? '🟡 LIMITED EVIDENCE' : '🔴 INSUFFICIENT EVIDENCE'}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                        Detected Intent: <strong>{aiResponse.intentParsed?.intent}</strong>
                      </span>
                    </div>

                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      Evidence Engine v1.0
                    </span>
                  </div>

                  <div style={{ fontSize: '0.98rem', color: '#0F172A', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                    {aiResponse.answer}
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', fontSize: '0.82rem', color: '#475569' }}>
                    <strong>Evidence Rationale:</strong> {aiResponse.confidenceReason}
                  </div>

                  {aiResponse.citations && aiResponse.citations.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>
                        DOCUMENTED SOURCE EVIDENCE ({aiResponse.citations.length}):
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {aiResponse.citations.map((cite: any, i: number) => (
                          <div key={i} style={{ background: '#F0FDFA', border: '1px solid #CCFBF1', padding: '14px', borderRadius: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F766E' }}>
                                📄 {cite.documentTitle} • Page {cite.pageNumber}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#0F766E', fontWeight: 600 }}>
                                Relevance: {Math.round(cite.relevanceScore * 100)}%
                              </span>
                            </div>
                            <p style={{ fontSize: '0.82rem', color: '#334155', marginTop: '6px', fontStyle: 'italic' }}>
                              "{cite.snippet}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px', fontSize: '0.78rem', color: '#94A3B8' }}>
                    ⚠ {aiResponse.safetyDisclaimer}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: MULTI-HOSPITAL NETWORK & SOVEREIGN HUMAN REPORT CENTER*/}
          {/* ======================================================== */}
          {false && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              
              {/* Header Hero */}
              <div className="card" style={{
                background: 'linear-gradient(135deg, #0F766E 0%, #1E3A8A 100%)',
                color: '#FFFFFF',
                padding: '30px 32px',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(15, 118, 110, 0.25)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                  <div style={{ maxWidth: '680px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '5px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px' }}>
                      <Building2 size={16} />
                      NATIONWIDE HEALTH INTEROPERABILITY NETWORK
                    </div>
                    <h1 style={{ color: '#FFFFFF', fontSize: '2.1rem', marginBottom: '8px', fontWeight: 800 }}>
                      Sovereign Human Report Center
                    </h1>
                    <p style={{ color: '#E0F2FE', fontSize: '0.96rem', lineHeight: '1.6' }}>
                      A unified clinical information infrastructure where <strong>every hospital, clinic, and diagnostic lab</strong> connects to a single sovereign personal health record. When any disease arises or report is generated at ANY institution, it is immediately chronicled with permanent provenance.
                    </p>
                  </div>

                  {/* Network Vital Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '14px 18px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>{hospitals.length || 6}</div>
                      <div style={{ fontSize: '0.72rem', color: '#BAE6FD', fontWeight: 600 }}>ACCREDITED HOSPITALS</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '14px 18px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>{hospitalRegistry.length || 4}</div>
                      <div style={{ fontSize: '0.72rem', color: '#BAE6FD', fontWeight: 600 }}>ENROLLED CITIZENS</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '14px 18px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>100%</div>
                      <div style={{ fontSize: '0.72rem', color: '#BAE6FD', fontWeight: 600 }}>FHIR R4 / ABDM READY</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '14px 18px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>0</div>
                      <div style={{ fontSize: '0.72rem', color: '#BAE6FD', fontWeight: 600 }}>DATA SILOS</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 1: PARTICIPATING HOSPITAL NODES GRID */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.35rem', color: '#0F172A' }}>
                      Federated Hospital & Diagnostic Network Nodes ({hospitals.length})
                    </h2>
                    <p style={{ fontSize: '0.84rem', color: '#64748B' }}>
                      All registered facilities run an institutional station capable of querying and ingesting health records with sovereign authorization.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
                  {hospitals.map(hosp => {
                    const isCurrentStation = selectedHospitalId === hosp.id;
                    return (
                      <div
                        key={hosp.id}
                        className="card"
                        style={{
                          border: isCurrentStation ? '2px solid #0F766E' : '1px solid #E2E8F0',
                          background: isCurrentStation ? '#F0FDFA' : '#FFFFFF',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          position: 'relative'
                        }}
                      >
                        {isCurrentStation && (
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: '#0F766E',
                            color: '#FFFFFF',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '12px'
                          }}>
                            ACTIVE DOCTOR STATION
                          </div>
                        )}

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <div style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '10px',
                              background: '#E0F2FE',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#0284C7',
                              fontWeight: 800,
                              fontSize: '1.1rem'
                            }}>
                              🏛️
                            </div>
                            <div>
                              <h3 style={{ fontSize: '1.05rem', color: '#0F172A', fontWeight: 800 }}>{hosp.name}</h3>
                              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                Facility Code: <strong>{hosp.facilityCode}</strong> • {hosp.city}, {hosp.state}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '10px 0' }}>
                            <span className="badge badge-teal" style={{ fontSize: '0.72rem' }}>{hosp.tier}</span>
                            {hosp.accreditation?.map((acc: string) => (
                              <span key={acc} className="badge badge-normal" style={{ fontSize: '0.7rem' }}>✓ {acc}</span>
                            ))}
                          </div>

                          <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '8px' }}>
                            <strong>Departments:</strong> {hosp.departments?.join(', ')}
                          </div>

                          <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', marginTop: '10px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F766E', marginBottom: '4px' }}>
                              AUTHORIZED ATTENDING STAFF:
                            </div>
                            {hosp.activeDoctors?.map((doc: any) => (
                              <div key={doc.id} style={{ fontSize: '0.78rem', color: '#334155', display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                                <span>🩺 {doc.name} ({doc.qualification})</span>
                                <span style={{ color: '#64748B' }}>{doc.specialization}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              setSelectedHospitalId(hosp.id);
                              if (hosp.activeDoctors?.length > 0) {
                                setSelectedHospitalDoctor(hosp.activeDoctors[0].name);
                              }
                              setRole('DOCTOR');
                              setActiveTab('doctor');
                            }}
                            className={isCurrentStation ? 'btn-primary' : 'btn-secondary'}
                            style={{ flex: 1, padding: '7px 12px', fontSize: '0.82rem', justifyContent: 'center' }}
                          >
                            {isCurrentStation ? 'Current Station (Open Console)' : 'Switch Doctor Station Here'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: CENTRAL HUMAN REPORT CENTER PATIENT REGISTRY */}
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.35rem', color: '#0F172A' }}>
                      Nationwide Citizen Registry & Human Report Center ({hospitalRegistry.length})
                    </h2>
                    <p style={{ fontSize: '0.84rem', color: '#64748B' }}>
                      Universal citizen records accessible by authorized doctors at any registered facility across India.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '6px 12px', borderRadius: '8px', minWidth: '260px' }}>
                      <Search size={16} color="#64748B" />
                      <input
                        type="text"
                        placeholder="Search by Citizen Name, UHID, Blood Group..."
                        value={hospitalSearchQuery}
                        onChange={async (e) => {
                          const val = e.target.value;
                          setHospitalSearchQuery(val);
                          const res = await api.getHospitalPatientRegistry(val);
                          setHospitalRegistry(res.data.patients);
                        }}
                        style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.88rem' }}
                      />
                    </div>

                    <button
                      onClick={() => setRegisterCitizenModalOpen(true)}
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                    >
                      + Enroll New Citizen to Center
                    </button>
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                        <th style={{ padding: '12px 16px' }}>Citizen / UHID</th>
                        <th style={{ padding: '12px 16px' }}>Demographics</th>
                        <th style={{ padding: '12px 16px' }}>Lifetime Facilities Visited</th>
                        <th style={{ padding: '12px 16px' }}>Active Diseases</th>
                        <th style={{ padding: '12px 16px' }}>Past Resolved</th>
                        <th style={{ padding: '12px 16px' }}>Reports Ingested</th>
                        <th style={{ padding: '12px 16px' }}>Clinical Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hospitalRegistry.map(citizen => (
                        <tr key={citizen.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.94rem' }}>
                              {citizen.fullName}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#0F766E', fontWeight: 700, fontFamily: 'monospace' }}>
                              {citizen.healthId}
                            </div>
                          </td>

                          <td style={{ padding: '14px 16px', color: '#475569' }}>
                            <div>{citizen.dob} ({citizen.gender})</div>
                            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                              Blood: <strong>{citizen.bloodGroup}</strong> • Allergies: {citizen.allergies?.join(', ') || 'None'}
                            </div>
                          </td>

                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '240px' }}>
                              {citizen.facilitiesVisited?.map((f: string, i: number) => (
                                <span key={i} style={{ background: '#F1F5F9', color: '#334155', padding: '2px 7px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600 }}>
                                  🏛️ {f.split(',')[0]}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td style={{ padding: '14px 16px' }}>
                            <span className={`badge ${citizen.activeConditionsCount > 0 ? 'badge-warning' : 'badge-normal'}`}>
                              {citizen.activeConditionsCount} Active
                            </span>
                            <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '3px' }}>
                              {citizen.activeConditionsList?.map((c: any) => c.name).join(', ') || 'None'}
                            </div>
                          </td>

                          <td style={{ padding: '14px 16px' }}>
                            <span className="badge badge-normal">
                              ✓ {citizen.resolvedConditionsCount} Resolved
                            </span>
                            <div style={{ fontSize: '0.74rem', color: '#047857', marginTop: '3px' }}>
                              {citizen.resolvedConditionsList?.map((c: any) => c.name).join(', ') || 'None'}
                            </div>
                          </td>

                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 800, color: '#2563EB', fontSize: '1rem' }}>
                              {citizen.totalReportsCount} reports
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                              Last: {citizen.lastEncounterDate}
                            </div>
                          </td>

                          <td style={{ padding: '14px 16px' }}>
                            <button
                              onClick={() => {
                                handleSelectDoctorPatient(citizen.id);
                                setRole('DOCTOR');
                                setActiveTab('doctor');
                              }}
                              className="btn-primary"
                              style={{ padding: '6px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                            >
                              Open Dossier →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 3: SYSTEM ARCHITECTURE & INTEGRATION PARADIGM */}
              <div className="card" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '24px' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#0F172A', marginBottom: '10px' }}>
                  How the Central Human Report Center Unifies Healthcare Across Hospitals
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '14px' }}>
                  <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>🏛️</div>
                    <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                      1. Hospital Encounter Diagnosis
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: '1.5' }}>
                      When a patient visits Fortis or Max with a new disease, the attending doctor logs the ICD-10 diagnosis. It immediately stamps the patient's lifetime health record.
                    </p>
                  </div>

                  <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>🔬</div>
                    <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                      2. Lab & Diagnostic Ingestion
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: '1.5' }}>
                      When Dr. Lal PathLabs or Apollo runs bloodwork or an MRI, the report is generated into the Human Report Center. Values immediately normalize and update longitudinal biometric trends.
                    </p>
                  </div>

                  <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>🩺</div>
                    <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                      3. Seamless Zero-Paperwork Care
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: '1.5' }}>
                      When the patient next steps into AIIMS or Apollo, the treating physician pulls up the complete timeline with full provenance, past resolved conditions, and delta charts instantly.
                    </p>
                  </div>
                </div>
              </div>

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

      {/* MODAL 3: HL7 FHIR R4 BUNDLE EXPORT INSPECTOR             */}
      {/* ======================================================== */}
      {fhirModalOpen && fhirBundleData && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '840px', width: '100%', maxHeight: '92vh', overflowY: 'auto', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '18px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="badge badge-teal" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Code2 size={13} />
                    HL7 FHIR Release 4 (v4.0.1)
                  </span>
                  <span className="badge badge-normal">
                    ABDM / US Core Interoperable
                  </span>
                </div>
                <h3 style={{ fontSize: '1.4rem', color: '#0F172A' }}>
                  Longitudinal Patient FHIR R4 Bundle Export
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }}>
                  Standardized clinical collection for <strong>{doctorDossier?.patient?.fullName || 'Patient'}</strong> ({doctorDossier?.patient?.healthId})
                </p>
              </div>

              <button onClick={() => setFhirModalOpen(false)} style={{ padding: '6px', borderRadius: '8px', background: '#F1F5F9' }}>
                <X size={20} color="#64748B" />
              </button>
            </div>

            {/* Standard FHIR Resource Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>FHIR PATIENT</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F766E' }}>1 Resource</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Demographics & Health ID</div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>FHIR CONDITIONS</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F766E' }}>
                  {fhirBundleData.entry.filter((e: any) => e.resource.resourceType === 'Condition').length} Resources
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Active & Resolved Lifecycles</div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>DIAGNOSTIC REPORTS</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563EB' }}>
                  {fhirBundleData.entry.filter((e: any) => e.resource.resourceType === 'DiagnosticReport').length} Resources
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Multi-Year Lab & Ultrasound</div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>OBSERVATIONS</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#7C3AED' }}>
                  {fhirBundleData.entry.filter((e: any) => e.resource.resourceType === 'Observation').length} Resources
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>LOINC Standardized Metrics</div>
              </div>
            </div>

            {/* Interoperability Compliance Notice */}
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '12px 16px', borderRadius: '10px', marginBottom: '18px', fontSize: '0.84rem', color: '#065F46' }}>
              ✓ <strong>Interoperability Verified:</strong> This bundle conforms to the HL7 FHIR R4 standard. It can be directly imported into hospital EHRs (Epic Care Everywhere, Cerner, MEDITECH, Bahmni) or open-source personal health aggregators (Fasten Health).
            </div>

            {/* Raw FHIR JSON Payload Preview */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A' }}>
                  Standard FHIR R4 Bundle JSON ({fhirBundleData.total} Total Resources):
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(fhirBundleData, null, 2));
                    setFhirCopied(true);
                    setTimeout(() => setFhirCopied(false), 2000);
                  }}
                  style={{ fontSize: '0.78rem', color: '#0F766E', fontWeight: 700, background: 'transparent', cursor: 'pointer' }}
                >
                  {fhirCopied ? '✓ Copied to Clipboard!' : 'Copy FHIR JSON'}
                </button>
              </div>

              <pre style={{
                maxHeight: '300px',
                overflowY: 'auto',
                background: '#0F172A',
                color: '#38BDF8',
                padding: '16px',
                borderRadius: '10px',
                fontSize: '0.76rem',
                fontFamily: 'Consolas, Monaco, monospace',
                lineHeight: '1.45'
              }}>
                {JSON.stringify(fhirBundleData, null, 2)}
              </pre>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setFhirModalOpen(false)} className="btn-secondary">
                Close
              </button>
              <button onClick={handleDownloadFhirJson} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download size={16} />
                Download FHIR R4 Bundle (.json)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: TEMPORAL CONDITION TRAJECTORY INSPECTOR         */}
      {/* ======================================================== */}
      {trajectoryModalOpen && activeTrajectoryData && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '780px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="badge badge-teal" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Network size={13} />
                    Temporal Clinical Knowledge Graph
                  </span>
                  <span className={`badge ${activeTrajectoryData.isResolved ? 'badge-normal' : 'badge-warning'}`}>
                    {activeTrajectoryData.currentStatus}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.4rem', color: '#0F172A' }}>
                  {activeTrajectoryData.conditionName} — Longitudinal Trajectory
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }}>
                  Multi-hop chronological progression reconstructed deterministically across medical checkpoints.
                </p>
              </div>

              <button onClick={() => setTrajectoryModalOpen(false)} style={{ padding: '6px', borderRadius: '8px', background: '#F1F5F9' }}>
                <X size={20} color="#64748B" />
              </button>
            </div>

            {/* Resolved Banner if condition is cured */}
            {activeTrajectoryData.isResolved && activeTrajectoryData.resolvingReport && (
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '16px', borderRadius: '12px', marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065F46', fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>
                  ✓ Condition Successfully Resolved
                </div>
                <p style={{ fontSize: '0.88rem', color: '#047857', lineHeight: '1.5' }}>
                  Resolving evidence established in <strong>{activeTrajectoryData.resolvingReport.originalFilename}</strong> on <strong>{activeTrajectoryData.resolvingReport.reportDate}</strong> at {activeTrajectoryData.resolvingReport.labFacility}.
                </p>
                <div style={{ fontSize: '0.82rem', color: '#065F46', marginTop: '6px', fontStyle: 'italic' }}>
                  "{activeTrajectoryData.resolvingReport.keyFindingsSummary}"
                </div>
              </div>
            )}

            {/* Step-by-Step Multi-Hop Trajectory Timeline */}
            <div style={{ position: 'relative', paddingLeft: '28px', borderLeft: '2px solid #CCFBF1', marginBottom: '24px' }}>
              {activeTrajectoryData.timeline.map((step: any, idx: number) => (
                <div key={idx} style={{ position: 'relative', marginBottom: '20px' }}>
                  <div style={{
                    position: 'absolute',
                    left: '-37px',
                    top: '4px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: activeTrajectoryData.isResolved && idx === activeTrajectoryData.timeline.length - 1 ? '#059669' : '#0F766E',
                    border: '3px solid #FFFFFF',
                    boxShadow: '0 0 0 2px #CCFBF1'
                  }} />

                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '16px', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                        {step.stage}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#0F766E', fontWeight: 700 }}>
                        {step.date}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.86rem', color: '#334155', lineHeight: '1.5' }}>
                      {step.description}
                    </p>

                    {step.document && (
                      <div style={{ fontSize: '0.78rem', color: '#0F766E', fontWeight: 600, marginTop: '8px' }}>
                        📄 Supporting Evidence: {step.document.originalFilename} ({step.document.labFacility})
                      </div>
                    )}

                    {step.associatedLabs && step.associatedLabs.length > 0 && (
                      <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {step.associatedLabs.map((l: any) => (
                          <span key={l.id} className="badge badge-teal" style={{ fontSize: '0.75rem' }}>
                            {l.parameterName}: {l.numericValue} {l.rawUnit} ({l.flag})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setTrajectoryModalOpen(false)} className="btn-secondary">
                Close Trajectory
              </button>
            </div>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '14px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#059669', marginBottom: '4px' }}>
                    🗄️ Sovereign Citizen Health DigiLocker
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#334155' }}>
                    Every diagnosis, prescription, and lab report from all hospitals across India are stored in this sovereign wallet.
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                    Select Citizen Profile:
                  </label>
                  <select
                    value={loginCitizenIdentifier}
                    onChange={(e) => setLoginCitizenIdentifier(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 600 }}
                  >
                    {hospitalRegistry.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.healthId}) • Blood: {p.bloodGroup}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick 1-click citizen chips */}
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '6px' }}>
                    QUICK DEMO CITIZENS:
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {hospitalRegistry.slice(0, 5).map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleCitizenLogin(p.id)}
                        style={{
                          background: loginCitizenIdentifier === p.id ? '#059669' : '#F8FAFC',
                          color: loginCitizenIdentifier === p.id ? '#FFFFFF' : '#334155',
                          border: '1px solid #CBD5E1',
                          padding: '5px 10px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {p.fullName}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCitizenLogin()}
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
                  Open Sovereign Citizen DigiLocker →
                </button>
              </div>
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
