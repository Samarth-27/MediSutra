import React, { useEffect } from 'react';
import {
  Palette,
  Sun,
  Moon,
  X,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useThemeStore, THEME_PRESETS, type ThemePalette } from '../../stores/useThemeStore';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({ isOpen, onClose }) => {
  const { theme, mode, setTheme, setMode } = useThemeStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="theme-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-modal-title"
    >
      <div className="theme-modal-card">
        {/* Modal Header */}
        <div className="theme-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--brand-gradient)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Palette size={20} />
            </div>
            <div>
              <h2 id="theme-modal-title" style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Theme &amp; Color Customizer
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                Configure canvas luminance and clinical color palette across MediSutra.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close theme customizer"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-light)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="theme-modal-body">
          {/* Section 1: Canvas Luminance Modes */}
          <div>
            <div className="theme-section-title">
              <Sparkles size={14} color="var(--brand-primary)" />
              CANVAS LUMINANCE MODES
            </div>

            <div className="theme-mode-grid">
              {/* Light Mode Card */}
              <button
                type="button"
                className={`theme-mode-card ${mode === 'light' ? 'active' : ''}`}
                onClick={() => setMode('light')}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    color: '#0F172A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Sun size={18} color="#D97706" />
                </div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Hospital Light Mode
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Daylight contrast for OPD &amp; desks
                  </div>
                </div>
                {mode === 'light' && (
                  <CheckCircle2 size={18} color="var(--brand-primary)" />
                )}
              </button>

              {/* Dark Mode Card */}
              <button
                type="button"
                className={`theme-mode-card ${mode === 'dark' ? 'active' : ''}`}
                onClick={() => setMode('dark')}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#0B0F17',
                    border: '1.5px solid #334155',
                    color: '#F8FAFC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Moon size={18} color="#38BDF8" />
                </div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Clinical Dark Mode
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Deep slate for night monitoring
                  </div>
                </div>
                {mode === 'dark' && (
                  <CheckCircle2 size={18} color="var(--brand-primary)" />
                )}
              </button>
            </div>
          </div>

          {/* Section 2: Clinical Palette Grid */}
          <div>
            <div className="theme-section-title">
              <Palette size={14} color="var(--brand-primary)" />
              CLINICAL COLOR PALETTES (4 PRESETS)
            </div>

            <div className="theme-preset-grid">
              {THEME_PRESETS.map((preset) => {
                const isSelected = theme === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    className={`theme-preset-card ${isSelected ? 'active' : ''}`}
                    onClick={() => setTheme(preset.id as ThemePalette)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {preset.name}
                      </span>
                      {isSelected && (
                        <CheckCircle2 size={16} color="var(--brand-primary)" />
                      )}
                    </div>

                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: '2px 0 6px 0', lineHeight: 1.35 }}>
                      {preset.description}
                    </p>

                    {/* Color Swatch Preview Strip */}
                    <div className="theme-preview-strip">
                      <span
                        className="theme-swatch-circle"
                        style={{ background: preset.primary }}
                        title={`Primary: ${preset.primary}`}
                      />
                      <span
                        className="theme-swatch-circle"
                        style={{ background: preset.accent }}
                        title={`Accent: ${preset.accent}`}
                      />
                      <span
                        className="theme-swatch-circle"
                        style={{ background: preset.lightBg, border: `1.5px solid ${preset.accent}` }}
                        title={`Surface: ${preset.lightBg}`}
                      />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'monospace', marginLeft: '4px' }}>
                        {preset.primary}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Notice & Close Button */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-light)',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={14} color="var(--brand-primary)" />
              <span>Persists automatically in <code>localStorage</code></span>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={onClose}
              style={{ padding: '8px 20px', fontSize: '0.82rem' }}
            >
              Done &amp; Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
