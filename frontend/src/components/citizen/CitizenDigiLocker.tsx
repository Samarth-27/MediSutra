import React from 'react';
import {
  Shield,
  Lock,
  CheckCircle2,
  FileCheck,
  Search,
  Eye,
  Download,
  HeartPulse,
  QrCode,
  Activity,
  Clock
} from 'lucide-react';
import type { AuthSession } from '../../types';

interface CitizenDigiLockerProps {
  authSession: AuthSession;
  digiLockerData: any;
  digiLockerSubTab: 'issued-docs' | 'card' | 'lifetime-diseases' | 'timeline' | string;
  digiLockerSearchQuery: string;
  setDigiLockerSearchQuery: (query: string) => void;
  digiLockerIssuerFilter: string;
  setDigiLockerIssuerFilter: (issuer: string) => void;
  digiLockerCategoryFilter: string;
  setDigiLockerCategoryFilter: (category: string) => void;
  digiLockerTimelineFilter: string;
  setDigiLockerTimelineFilter: (filter: string) => void;
  timelineEvents: any[];
  onInspectReport: (report: any) => void;
}

export const CitizenDigiLocker: React.FC<CitizenDigiLockerProps> = ({
  authSession,
  digiLockerData,
  digiLockerSubTab,
  digiLockerSearchQuery,
  setDigiLockerSearchQuery,
  digiLockerIssuerFilter,
  setDigiLockerIssuerFilter,
  digiLockerCategoryFilter,
  setDigiLockerCategoryFilter,
  digiLockerTimelineFilter,
  setDigiLockerTimelineFilter,
  timelineEvents = [],
  onInspectReport
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* DigiLocker National Header Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #064E3B 0%, #0F766E 50%, #1E3A8A 100%)',
          color: '#FFFFFF',
          padding: '28px 32px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(15, 118, 110, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Indian Tricolor Accent Strip */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #FF9933 33.3%, #FFFFFF 33.3%, #FFFFFF 66.6%, #138808 66.6%)'
          }}
        />

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
          <div
            style={{
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(10px)',
              padding: '16px 20px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.3)',
              minWidth: '270px'
            }}
          >
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
        <div
          style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px'
          }}
        >
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

      {/* SUBTAB 1: ISSUED HEALTH DOCUMENTS */}
      {digiLockerSubTab === 'issued-docs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileCheck size={20} color="#0F766E" />
                  <h2 style={{ fontSize: '1.35rem', color: '#0F172A', margin: 0 }}>
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
                  type="button"
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
                  type="button"
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
                          <div
                            style={{
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
                            }}
                          >
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
                      <div
                        style={{
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
                        }}
                      >
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
                        type="button"
                        onClick={() => onInspectReport(doc)}
                        className="btn-secondary"
                        style={{ flex: 1, padding: '7px 10px', fontSize: '0.8rem', justifyContent: 'center' }}
                      >
                        <Eye size={14} />
                        Inspect Findings
                      </button>
                      <button
                        type="button"
                        onClick={() => alert(`Verified Sovereign Health Certificate for ${doc.documentType}\nIssuer: ${doc.issuingAuthority}\nHash: ${doc.digitalSignature?.hash || '0x7f83b...281'}`)}
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

      {/* SUBTAB 2: OFFICIAL ABHA DIGITAL HEALTH ID CARD */}
      {digiLockerSubTab === 'card' && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
          <div
            style={{
              maxWidth: '520px',
              width: '100%',
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              borderRadius: '24px',
              color: '#FFFFFF',
              padding: '28px',
              boxShadow: '0 16px 36px rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.15)',
              position: 'relative'
            }}
          >
            {/* Tricolor top stripe */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '5px',
                borderRadius: '24px 24px 0 0',
                background: 'linear-gradient(90deg, #FF9933 33.3%, #FFFFFF 33.3%, #FFFFFF 66.6%, #138808 66.6%)'
              }}
            />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #0F766E, #0D9488)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}
                >
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
              <div
                style={{
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
                }}
              >
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

      {/* SUBTAB 3: LIFETIME DISEASE RECORD */}
      {digiLockerSubTab === 'lifetime-diseases' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Active Conditions */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Activity size={20} color="#D97706" />
              <h2 style={{ fontSize: '1.35rem', color: '#0F172A', margin: 0 }}>
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
              <h2 style={{ fontSize: '1.35rem', color: '#0F172A', margin: 0 }}>
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

      {/* SUBTAB 4: ALL PREVIOUS LIFETIME HEALTH ACTIVITIES THROUGHOUT LIFE */}
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
                  {(digiLockerData?.recentTimeline || timelineEvents).length}
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
                  (digiLockerData?.recentTimeline || timelineEvents).filter((e: any) =>
                    digiLockerTimelineFilter === 'ALL' || e.eventType === digiLockerTimelineFilter
                  ).length
                }</strong> records
              </div>
            </div>
          </div>

          {/* Chronological Activity Feed */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(digiLockerData?.recentTimeline || timelineEvents)
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
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: isCure ? '#DCFCE7' : isDiagnosis ? '#FEF3C7' : isLab ? '#DBEAFE' : '#E0E7FF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.3rem',
                          flexShrink: 0
                        }}
                      >
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
                            <span
                              style={{
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
                              }}
                            >
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
  );
};
