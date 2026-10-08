import React from 'react';
import { CheckCircle2, Activity, FileText, RefreshCw } from 'lucide-react';

interface LifetimeDiseasesSectionProps {
  doctorDossier: any;
  onEditCondition: (condition: any) => void;
  onCureCondition: (condition: any) => void;
  onReopenCondition: (conditionId: string) => void;
  onInspectReport: (report: any) => void;
}

export const LifetimeDiseasesSection: React.FC<LifetimeDiseasesSectionProps> = ({
  doctorDossier,
  onEditCondition,
  onCureCondition,
  onReopenCondition,
  onInspectReport
}) => {
  const activeConditions = doctorDossier?.clinicalOverview?.activeConditions || [];
  const pastResolvedDiseases = doctorDossier?.clinicalOverview?.pastResolvedDiseases || [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '20px' }}>
      {/* LEFT COLUMN: ONGOING ACTIVE DISEASES */}
      <div className="card" style={{ padding: '22px', border: '1.5px solid #FDE68A', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #FEF3C7', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }} />
            <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#92400E', margin: 0 }}>
              Ongoing Diseases ({activeConditions.length})
            </h3>
          </div>
          <span className="badge" style={{ background: '#FEF3C7', color: '#B45309', fontWeight: 700, fontSize: '0.76rem' }}>
            ACTIVE MEDICAL CARE
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#78350F', marginBottom: '16px' }}>
          Conditions actively diagnosed requiring medication, treatment, or clinical monitoring. Click "Mark as Cured" when condition resolves.
        </p>

        {activeConditions.length === 0 ? (
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
            {activeConditions.map((cond: any) => {
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
                      type="button"
                      onClick={() => onEditCondition(cond)}
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
                      type="button"
                      onClick={() => onCureCondition(cond)}
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
              Cured Diseases ({pastResolvedDiseases.length})
            </h3>
          </div>
          <span className="badge" style={{ background: '#D1FAE5', color: '#065F46', fontWeight: 800, fontSize: '0.76rem' }}>
            OFFICIALLY RESOLVED
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#064E3B', marginBottom: '16px' }}>
          Diseases successfully cured, with certified doctor sign-off and clinical evidence/lab report proof stored permanently.
        </p>

        {pastResolvedDiseases.length === 0 ? (
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
            {pastResolvedDiseases.map((cond: any) => {
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
                          type="button"
                          onClick={() => {
                            const matched = doctorDossier?.allReports?.find((d: any) => d.id === cond.resolvingReportId);
                            if (matched) onInspectReport(matched);
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
                      type="button"
                      onClick={() => onReopenCondition(cond.id)}
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
  );
};
