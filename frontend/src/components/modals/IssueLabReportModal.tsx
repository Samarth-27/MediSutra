import React from 'react';
import { X, FolderArchive, Plus, Trash2 } from 'lucide-react';

interface IssueLabReportModalProps {
  isOpen: boolean;
  reportSuccessMsg: string;
  hospitalName: string;
  patientConditions: any[];
  repDocType: string;
  setRepDocType: (val: string) => void;
  repCategory: 'Metabolic' | 'Blood' | 'Renal' | 'Hepatic' | 'Imaging' | 'General';
  setRepCategory: (val: any) => void;
  repFindings: string;
  setRepFindings: (val: string) => void;
  repLinkedCondId: string;
  setRepLinkedCondId: (val: string) => void;
  repMarkResolved: boolean;
  setRepMarkResolved: (val: boolean) => void;
  repLabs: any[];
  setRepLabs: React.Dispatch<React.SetStateAction<any[]>>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const IssueLabReportModal: React.FC<IssueLabReportModalProps> = ({
  isOpen,
  reportSuccessMsg,
  hospitalName,
  patientConditions = [],
  repDocType,
  setRepDocType,
  repCategory,
  setRepCategory,
  repFindings,
  setRepFindings,
  repLinkedCondId,
  setRepLinkedCondId,
  repMarkResolved,
  setRepMarkResolved,
  repLabs,
  setRepLabs,
  isSubmitting,
  onSubmit,
  onClose
}) => {
  if (!isOpen) return null;

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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#DBEAFE', color: '#1D4ED8', padding: '4px 10px', borderRadius: '14px', fontSize: '0.74rem', fontWeight: 800, marginBottom: '6px' }}>
              <FolderArchive size={13} />
              LABORATORY & IMAGING INGESTION
            </div>
            <h3 style={{ fontSize: '1.35rem', color: '#0F172A' }}>
              Issue Diagnostic Report into Human Report Center
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '2px' }}>
              Generating Laboratory: <strong>{hospitalName || 'Dr. Lal PathLabs'}</strong>
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

        {reportSuccessMsg && (
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '12px 16px', borderRadius: '10px', color: '#065F46', fontSize: '0.88rem', fontWeight: 700, marginBottom: '16px' }}>
            ✓ {reportSuccessMsg}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                  {patientConditions.map((c: any) => (
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

          {/* Quantitative Table Parameters */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A' }}>
                Quantitative Lab Parameters ({repLabs.length})
              </label>
              <button
                type="button"
                onClick={() => setRepLabs(prev => [...prev, { parameterName: '', numericValue: 0, rawUnit: '', referenceMin: 0, referenceMax: 0, flag: 'NORMAL' }])}
                style={{ padding: '4px 10px', borderRadius: '6px', background: '#F1F5F9', border: '1px solid #CBD5E1', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={13} /> Add Test Parameter
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {repLabs.map((lab, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 1fr 40px', gap: '8px', alignItems: 'center', background: '#F8FAFC', padding: '8px 10px', borderRadius: '8px' }}>
                  <input
                    type="text"
                    placeholder="Parameter (e.g. Glucose)"
                    value={lab.parameterName}
                    onChange={(e) => {
                      const updated = [...repLabs];
                      updated[idx].parameterName = e.target.value;
                      setRepLabs(updated);
                    }}
                    style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Value"
                    value={lab.numericValue}
                    onChange={(e) => {
                      const updated = [...repLabs];
                      updated[idx].numericValue = parseFloat(e.target.value) || 0;
                      setRepLabs(updated);
                    }}
                    style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Unit"
                    value={lab.rawUnit}
                    onChange={(e) => {
                      const updated = [...repLabs];
                      updated[idx].rawUnit = e.target.value;
                      setRepLabs(updated);
                    }}
                    style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Ref Min"
                    value={lab.referenceMin}
                    onChange={(e) => {
                      const updated = [...repLabs];
                      updated[idx].referenceMin = parseFloat(e.target.value) || 0;
                      setRepLabs(updated);
                    }}
                    style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Ref Max"
                    value={lab.referenceMax}
                    onChange={(e) => {
                      const updated = [...repLabs];
                      updated[idx].referenceMax = parseFloat(e.target.value) || 0;
                      setRepLabs(updated);
                    }}
                    style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
                  />
                  <select
                    value={lab.flag}
                    onChange={(e) => {
                      const updated = [...repLabs];
                      updated[idx].flag = e.target.value;
                      setRepLabs(updated);
                    }}
                    style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem' }}
                  >
                    <option value="NORMAL">NORMAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="LOW">LOW</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setRepLabs(repLabs.filter((_, i) => i !== idx))}
                    style={{ background: '#FEE2E2', border: 'none', borderRadius: '6px', color: '#DC2626', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Ingesting Report...' : 'Issue Certified Diagnostic Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
