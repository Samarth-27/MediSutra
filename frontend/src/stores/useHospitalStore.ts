import { create } from 'zustand';

interface HospitalState {
  selectedHospitalId: string;
  activeSubTab: 'queue' | 'dossier' | 'doctors';
  onboardModalOpen: boolean;
  createDoctorModalOpen: boolean;
  onboardHealthId: string;
  onboardDoctorName: string;
  onboardDepartment: string;
  onboardComplaint: string;
  onboardPriority: string;
  isOnboarding: boolean;

  setSelectedHospitalId: (id: string) => void;
  setActiveSubTab: (tab: 'queue' | 'dossier' | 'doctors') => void;
  setOnboardModalOpen: (open: boolean) => void;
  setCreateDoctorModalOpen: (open: boolean) => void;
  setOnboardHealthId: (id: string) => void;
  setOnboardDoctorName: (name: string) => void;
  setOnboardDepartment: (dept: string) => void;
  setOnboardComplaint: (complaint: string) => void;
  setOnboardPriority: (priority: string) => void;
  setIsOnboarding: (onboarding: boolean) => void;
}

export const useHospitalStore = create<HospitalState>((set) => ({
  selectedHospitalId: 'hosp-apollo-01',
  activeSubTab: 'queue',
  onboardModalOpen: false,
  createDoctorModalOpen: false,
  onboardHealthId: 'MED-00010001',
  onboardDoctorName: 'Dr. Priya Nair',
  onboardDepartment: 'General Medicine',
  onboardComplaint: 'Cross-Hospital Longitudinal Review & Consultation',
  onboardPriority: 'Routine OPD',
  isOnboarding: false,

  setSelectedHospitalId: (id) => set({ selectedHospitalId: id }),
  setActiveSubTab: (activeSubTab) => set({ activeSubTab }),
  setOnboardModalOpen: (onboardModalOpen) => set({ onboardModalOpen }),
  setCreateDoctorModalOpen: (createDoctorModalOpen) => set({ createDoctorModalOpen }),
  setOnboardHealthId: (onboardHealthId) => set({ onboardHealthId }),
  setOnboardDoctorName: (onboardDoctorName) => set({ onboardDoctorName }),
  setOnboardDepartment: (onboardDepartment) => set({ onboardDepartment }),
  setOnboardComplaint: (onboardComplaint) => set({ onboardComplaint }),
  setOnboardPriority: (onboardPriority) => set({ onboardPriority }),
  setIsOnboarding: (isOnboarding) => set({ isOnboarding })
}));
