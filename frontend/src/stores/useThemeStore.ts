import { create } from 'zustand';

export type ThemePalette = 'teal' | 'indigo' | 'emerald' | 'rose';
export type ThemeMode = 'light' | 'dark';

export interface ThemePreset {
  id: ThemePalette;
  name: string;
  primary: string;
  accent: string;
  lightBg: string;
  description: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'teal',
    name: 'MediSutra Classic Teal',
    primary: '#0F766E',
    accent: '#0D9488',
    lightBg: '#F0FDFA',
    description: 'Default clinical trust and longitudinal health.'
  },
  {
    id: 'indigo',
    name: 'Precision Royal Indigo',
    primary: '#4338CA',
    accent: '#6366F1',
    lightBg: '#EEF2FF',
    description: 'Enterprise health-tech analytics.'
  },
  {
    id: 'emerald',
    name: 'Vitality Forest Emerald',
    primary: '#047857',
    accent: '#10B981',
    lightBg: '#ECFDF5',
    description: 'Holistic recovery, wellness, and cure protocols.'
  },
  {
    id: 'rose',
    name: 'High-Acuity Clinical Rose',
    primary: '#BE123C',
    accent: '#F43F5E',
    lightBg: '#FFF1F2',
    description: 'Emergency department triage alerts.'
  }
];

const getStoredTheme = (): ThemePalette => {
  try {
    const saved = localStorage.getItem('medisutra_theme');
    if (saved === 'teal' || saved === 'indigo' || saved === 'emerald' || saved === 'rose') {
      return saved;
    }
  } catch {}
  return 'teal';
};

const getStoredMode = (): ThemeMode => {
  try {
    const saved = localStorage.getItem('medisutra_mode');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch {}
  return 'light';
};

const applyToDocument = (theme: ThemePalette, mode: ThemeMode) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-mode', mode);
  }
};

interface ThemeState {
  theme: ThemePalette;
  mode: ThemeMode;
  isCustomizerOpen: boolean;
  setTheme: (theme: ThemePalette) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setIsCustomizerOpen: (open: boolean) => void;
}

// Initial application on script evaluation
const initialTheme = getStoredTheme();
const initialMode = getStoredMode();
applyToDocument(initialTheme, initialMode);

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme,
  mode: initialMode,
  isCustomizerOpen: false,

  setTheme: (theme: ThemePalette) => {
    try {
      localStorage.setItem('medisutra_theme', theme);
    } catch {}
    applyToDocument(theme, get().mode);
    set({ theme });
  },

  setMode: (mode: ThemeMode) => {
    try {
      localStorage.setItem('medisutra_mode', mode);
    } catch {}
    applyToDocument(get().theme, mode);
    set({ mode });
  },

  toggleMode: () => {
    const nextMode: ThemeMode = get().mode === 'light' ? 'dark' : 'light';
    try {
      localStorage.setItem('medisutra_mode', nextMode);
    } catch {}
    applyToDocument(get().theme, nextMode);
    set({ mode: nextMode });
  },

  setIsCustomizerOpen: (isCustomizerOpen: boolean) => set({ isCustomizerOpen })
}));
