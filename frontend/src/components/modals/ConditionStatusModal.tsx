import React from 'react';
import { X } from 'lucide-react';

interface ConditionStatusModalProps {
  condition: any;
  newStatus: string;
  setNewStatus: (status: string) => void;
  newNotes: string;
  setNewNotes: (notes: string) => void;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export const ConditionStatusModal: React.FC<ConditionStatusModalProps> = ({
  condition,
  newStatus,
  setNewStatus,
  newNotes,
  setNewNotes,
  onClose,
  onSave,
  isSaving
}) => {
  if (!condition) return null;

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
      <div className="card" style={{ maxWidth: '580px', width: '100%', padding: '26px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#0F172A' }}>
            Update Condition Clinical Status
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: '6px', borderRadius: '8px', background: '#F1F5F9', border: 'none', cursor: 'pointer' }}
          >
            <X size={18} color="#64748B" />
          </button>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '4px' }}>
            Condition Name:
          </label>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>
            {condition.conditionName}
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '4px' }}>
            New Clinical Status:
          </label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
          >
            <option value="UNDER_TREATMENT">UNDER_TREATMENT (Active medication & care)</option>
            <option value="STABLE">STABLE (Parameters within target window)</option>
            <option value="MONITORING">MONITORING (Sub-clinical / watchful observation)</option>
            <option value="RESOLVED">RESOLVED (Clinically cured with evidence)</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '4px' }}>
            Status Progression Note:
          </label>
          <textarea
            rows={3}
            placeholder="Document clinical rationale, changed medications, or updated examination findings..."
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="btn-primary"
          >
            {isSaving ? 'Updating...' : 'Save Clinical Status'}
          </button>
        </div>
      </div>
    </div>
  );
};
