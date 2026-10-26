import { create } from 'zustand';

interface CitizenState {
  digiLockerPatientId: string;
  digiLockerSubTab: 'timeline' | 'lifetime-diseases' | 'issued-docs' | 'card' | 'trends';
  issuerFilter: string;
  categoryFilter: string;
  searchQuery: string;
  timelineFilter: string;

  setDigiLockerPatientId: (id: string) => void;
  setDigiLockerSubTab: (tab: 'timeline' | 'lifetime-diseases' | 'issued-docs' | 'card' | 'trends') => void;
  setIssuerFilter: (filter: string) => void;
  setCategoryFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
  setTimelineFilter: (filter: string) => void;
}

export const useCitizenStore = create<CitizenState>((set) => ({
  digiLockerPatientId: 'pat-demo-001',
  digiLockerSubTab: 'timeline',
  issuerFilter: 'ALL',
  categoryFilter: 'ALL',
  searchQuery: '',
  timelineFilter: 'ALL',

  setDigiLockerPatientId: (digiLockerPatientId) => set({ digiLockerPatientId }),
  setDigiLockerSubTab: (digiLockerSubTab) => set({ digiLockerSubTab }),
  setIssuerFilter: (issuerFilter) => set({ issuerFilter }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setTimelineFilter: (timelineFilter) => set({ timelineFilter })
}));
