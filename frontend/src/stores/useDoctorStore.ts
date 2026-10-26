import { create } from 'zustand';

interface DoctorState {
  selectedPatientId: string;
  searchQuery: string;
  yearFilter: string;
  categoryFilter: string;
  newDoctorNote: string;
  isSubmittingNote: boolean;
  doctorAiQuery: string;
  doctorAiLoading: boolean;
  doctorAiResponse: any;
  isAiChatExpanded: boolean;

  setSelectedPatientId: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setYearFilter: (year: string) => void;
  setCategoryFilter: (category: string) => void;
  setNewDoctorNote: (note: string) => void;
  setIsSubmittingNote: (submitting: boolean) => void;
  setDoctorAiQuery: (query: string) => void;
  setDoctorAiLoading: (loading: boolean) => void;
  setDoctorAiResponse: (res: any) => void;
  setIsAiChatExpanded: (expanded: boolean) => void;
  resetPatientContext: () => void;
}

export const useDoctorStore = create<DoctorState>((set) => ({
  selectedPatientId: 'pat-demo-001',
  searchQuery: '',
  yearFilter: 'ALL',
  categoryFilter: 'ALL',
  newDoctorNote: '',
  isSubmittingNote: false,
  doctorAiQuery: '',
  doctorAiLoading: false,
  doctorAiResponse: null,
  isAiChatExpanded: false,

  setSelectedPatientId: (id) => set({ selectedPatientId: id }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setYearFilter: (yearFilter) => set({ yearFilter }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setNewDoctorNote: (newDoctorNote) => set({ newDoctorNote }),
  setIsSubmittingNote: (isSubmittingNote) => set({ isSubmittingNote }),
  setDoctorAiQuery: (doctorAiQuery) => set({ doctorAiQuery }),
  setDoctorAiLoading: (doctorAiLoading) => set({ doctorAiLoading }),
  setDoctorAiResponse: (doctorAiResponse) => set({ doctorAiResponse }),
  setIsAiChatExpanded: (isAiChatExpanded) => set({ isAiChatExpanded }),
  resetPatientContext: () => set({
    doctorAiResponse: null,
    doctorAiQuery: '',
    newDoctorNote: '',
    searchQuery: '',
    yearFilter: 'ALL',
    categoryFilter: 'ALL'
  })
}));
