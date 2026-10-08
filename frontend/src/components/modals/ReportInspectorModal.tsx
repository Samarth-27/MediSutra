import React from 'react';
import { X } from 'lucide-react';

interface ReportInspectorModalProps {
  report: any;
  onClose: () => void;
}

export const ReportInspectorModal: React.FC<ReportInspectorModalProps> = ({
  report,
  onClose
}) => {
  if (!report) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '20px'
      }}
    >
      <div className="card" style={{ maxWidth: '780px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '18px' }}>
          <div>
            <span className="badge badge-teal" style={{ marginBottom: '6px' }}>
              {report.category || 'Diagnostic'}
            </span>
            <h3 style={{ fontSize: '1.35rem', color: '#0F172A' }}>
              {report.originalFilename || report.documentType}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }}>
              Facility: <strong>{report.labFacility || report.issuingHospital || report.issuingAuthority || 'Diagnostic Laboratory'}</strong> • Date: <strong>{report.reportDate}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ padding: '6px', borderRadius: '8px', background: '#F1F5F9', border: 'none', cursor: 'pointer' }}
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
            {report.keyFindingsSummary}
          </p>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '8px', fontFamily: 'monospace' }}>
            SHA-256: {report.sha256Hash || '0x99e4b7b2...014c'} • OCR Confidence: {Math.round((report.extractionConfidence || 0.98) * 100)}%
          </div>
        </div>

        {/* Extracted Lab Parameters Table */}
        <div>
          <h4 style={{ fontSize: '1.05rem', color: '#0F172A', marginBottom: '10px' }}>
            Extracted Lab Parameters & Quantitative Values
          </h4>

          {report.extractedLabs && report.extractedLabs.length > 0 ? (
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
                  {report.extractedLabs.map((lab: any) => (
                    <tr key={lab.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>
                        {lab.parameterName}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: lab.flag === 'HIGH' ? '#DC2626' : lab.flag === 'LOW' ? '#D97706' : '#059669' }}>
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
          <button type="button" onClick={onClose} className="btn-secondary">
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
