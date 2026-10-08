import React from 'react';
import {
  Bot,
  Sparkles,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  CheckCircle2,
  Copy
} from 'lucide-react';
import type { PatientDossier, AiDoctorAnalysisResponse } from '../../types';
import { renderClinicalMarkdown } from '../../utils/formatters';

interface DoctorAiCopilotProps {
  doctorDossier: PatientDossier;
  isAiChatExpanded: boolean;
  setIsAiChatExpanded: (expanded: boolean) => void;
  doctorAiQuery: string;
  setDoctorAiQuery: (query: string) => void;
  doctorAiLoading: boolean;
  doctorAiResponse: AiDoctorAnalysisResponse | null;
  setDoctorAiResponse: (res: any) => void;
  copiedAiToNote: boolean;
  handleDoctorAiAnalyze: (overrideQuery?: string) => Promise<void>;
  handleCopyAiToConsultationNote: () => void;
}

export const DoctorAiCopilot: React.FC<DoctorAiCopilotProps> = ({
  doctorDossier,
  isAiChatExpanded,
  setIsAiChatExpanded,
  doctorAiQuery,
  setDoctorAiQuery,
  doctorAiLoading,
  doctorAiResponse,
  setDoctorAiResponse,
  copiedAiToNote,
  handleDoctorAiAnalyze,
  handleCopyAiToConsultationNote
}) => {
  return (
    <div id="doctor-ai-chatbot-section" className="ai-copilot-card">
      {/* Chatbot Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 18px rgba(2, 132, 199, 0.35)',
            flexShrink: 0
          }}>
            <Bot size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                Clinical AI Copilot & Longitudinal Report Analyzer
              </span>
              <span className="badge badge-teal" style={{ fontSize: '0.72rem', fontWeight: 800 }}>
                <Sparkles size={12} />
                MULTI-HOSPITAL NEURAL SYNTHESIS
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#ECFDF5',
                color: '#065F46',
                border: '1px solid #A7F3D0',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '0.72rem',
                fontWeight: 800
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', animation: 'pulse-live-dot 2s infinite' }} />
                DOSSIER GROUNDED
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '3px', margin: 0, lineHeight: 1.4 }}>
              Enter presenting symptoms, clinical findings, or queries. The AI deterministically correlates lifetime cross-hospital records, active/cured diseases, and quantitative lab trajectories in real time.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: '#F8FAFC',
            border: '1.5px solid #E2E8F0',
            padding: '6px 14px',
            borderRadius: '10px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>👤 Target:</span>
            <span style={{ color: '#0284C7' }}>{doctorDossier.patient.fullName}</span>
            <span style={{ fontFamily: 'monospace', fontSize: '0.74rem', color: '#64748B' }}>({doctorDossier.patient.healthId})</span>
          </div>
          <button
            type="button"
            onClick={() => setIsAiChatExpanded(!isAiChatExpanded)}
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #BAE6FD',
              color: '#0284C7',
              padding: '6px 14px',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(2, 132, 199, 0.08)'
            }}
          >
            {isAiChatExpanded ? <><span>Collapse</span> <ChevronUp size={16} /></> : <><span>Open Assistant</span> <ChevronDown size={16} /></>}
          </button>
        </div>
      </div>

      {isAiChatExpanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Quick Prompt Chips for Physicians */}
          <div>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ⚡ Instant Clinical Analysis Presets (Click to run):
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { icon: '🩺', label: 'High Fasting Sugar & Tingling in Toes', query: 'Patient has fatigue, elevated fasting sugar, and tingling in toes. Give his report analysis.' },
                { icon: '🫀', label: 'Elevated BP & Chest Discomfort', query: 'Patient has elevated blood pressure and occasional chest tightness. Analyze his cardiac, lipid and hypertension history.' },
                { icon: '🦵', label: 'Persistent Fatigue & Knee Joint Pain', query: 'Patient reports persistent fatigue and pain in knee joints. Check past vitamin D deficiency and inflammatory records.' },
                { icon: '📋', label: 'Complete Cross-Hospital Trajectory', query: 'Give complete cross-hospital lifetime report analysis, active conditions, and resolving reports.' }
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="ai-prompt-pill"
                  onClick={() => handleDoctorAiAnalyze(preset.query)}
                >
                  <span>{preset.icon}</span>
                  <span>{preset.label}</span>
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
            className="ai-input-box"
          >
            <textarea
              rows={3}
              placeholder='Write clinical observations or patient symptoms, e.g. "Patient has fatigue, elevated fasting sugar, and tingling in toes. Give his report analysis to me..."'
              value={doctorAiQuery}
              onChange={(e) => setDoctorAiQuery(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: '0.94rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                color: '#0F172A',
                lineHeight: '1.55',
                background: 'transparent'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '10px', marginTop: '4px' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1rem' }}>🏛️</span>
                <span>Synthesizes records from Apollo, Fortis, Max, Dr. Lal PathLabs & Metropolis in real time.</span>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
                      fontSize: '0.82rem',
                      color: '#64748B',
                      cursor: 'pointer',
                      padding: '6px 12px',
                      fontWeight: 600
                    }}
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  disabled={doctorAiLoading || !doctorAiQuery.trim()}
                  className="ai-analyze-btn"
                >
                  {doctorAiLoading ? (
                    <>
                      <RefreshCw size={16} className="spin" />
                      Analyzing Cross-Hospital Records...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
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
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 8px 30px rgba(2, 132, 199, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              {/* Analysis Header Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
                    color: '#0284C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(2, 132, 199, 0.15)'
                  }}>
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                      Clinical Intelligence Synthesis Report
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                      Verified against {doctorAiResponse.citations?.length || 0} multi-hospital reports • Deterministic Grounding
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyAiToConsultationNote}
                  style={{
                    background: copiedAiToNote ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
                  }}
                >
                  {copiedAiToNote ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  {copiedAiToNote ? '✓ Copied to Consultation Note!' : '📋 Copy to Consultation Note'}
                </button>
              </div>

              {/* Correlated Conditions Badges */}
              {doctorAiResponse.correlatedConditions?.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Correlated Lifetime Conditions on Record:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {doctorAiResponse.correlatedConditions.map((c: any, i: number) => {
                      const isResolved = c.currentStatus === 'RESOLVED';
                      return (
                        <span
                          key={i}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '10px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            background: isResolved ? '#ECFDF5' : '#FEF3C7',
                            color: isResolved ? '#065F46' : '#92400E',
                            border: isResolved ? '1.5px solid #A7F3D0' : '1.5px solid #FDE68A',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
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
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Longitudinal Laboratory Indicators Correlated:
                  </div>
                  <div style={{ overflowX: 'auto', border: '1.5px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#64748B' }}>
                          <th style={{ padding: '10px 14px', fontWeight: 800 }}>Biomarker</th>
                          <th style={{ padding: '10px 14px', fontWeight: 800 }}>Latest Reading</th>
                          <th style={{ padding: '10px 14px', fontWeight: 800 }}>Ref Range</th>
                          <th style={{ padding: '10px 14px', fontWeight: 800 }}>Flag</th>
                          <th style={{ padding: '10px 14px', fontWeight: 800 }}>Baseline Reading</th>
                          <th style={{ padding: '10px 14px', fontWeight: 800 }}>Trajectory</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doctorAiResponse.correlatedLabs.map((l: any, i: number) => (
                          <tr key={i} style={{ borderBottom: '1px solid #F1F5F9', background: i % 2 === 0 ? '#FFFFFF' : '#FBFDFF' }}>
                            <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0F172A' }}>{l.parameterName}</td>
                            <td style={{ padding: '10px 14px', fontWeight: 800, color: '#0284C7' }}>
                              {l.latestValue} {l.latestUnit}
                              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', fontWeight: 500 }}>{l.latestDate}</span>
                            </td>
                            <td style={{ padding: '10px 14px', color: '#64748B' }}>{l.referenceRange}</td>
                            <td style={{ padding: '10px 14px' }}>
                              <span className={`badge ${l.latestFlag === 'NORMAL' ? 'badge-normal' : l.latestFlag === 'HIGH' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.74rem' }}>
                                {l.latestFlag}
                              </span>
                            </td>
                            <td style={{ padding: '10px 14px', color: '#64748B' }}>{l.baselineValue} {l.latestUnit} ({l.baselineDate})</td>
                            <td style={{ padding: '10px 14px', fontWeight: 700, color: l.trend === 'Down' ? '#059669' : l.trend === 'Up' ? '#DC2626' : '#64748B' }}>
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
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                borderRadius: '14px',
                padding: '20px 22px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}>
                {renderClinicalMarkdown(doctorAiResponse.answer)}
              </div>

              {/* Multi-Hospital Provenance Document Citations */}
              {doctorAiResponse.citations?.length > 0 && (
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '14px' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    🏛️ CROSS-HOSPITAL EVIDENCE CITATIONS ({doctorAiResponse.citations.length}):
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {doctorAiResponse.citations.map((c: any, i: number) => (
                      <div key={i} style={{ fontSize: '0.8rem', color: '#334155', background: '#F8FAFC', padding: '8px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        📄 <strong>{c.documentTitle}</strong> — {c.snippet}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                  🛡️ MediSutra Clinical Decision Support: Grounded strictly on verified patient records.
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleCopyAiToConsultationNote}
                    className="btn-primary"
                    style={{ padding: '8px 18px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    {copiedAiToNote ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                    {copiedAiToNote ? '✓ Inserted to Note' : 'Insert to Consultation Note'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
