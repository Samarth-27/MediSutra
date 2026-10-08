import React from 'react';
import { FolderArchive, Search } from 'lucide-react';

interface ReportsVaultSectionProps {
  allReports: any[];
  reportSearchQuery: string;
  setReportSearchQuery: (query: string) => void;
  selectedYearFilter: string;
  setSelectedYearFilter: (year: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (category: string) => void;
  onInspectReport: (report: any) => void;
}

export const ReportsVaultSection: React.FC<ReportsVaultSectionProps> = ({
  allReports = [],
  reportSearchQuery,
  setReportSearchQuery,
  selectedYearFilter,
  setSelectedYearFilter,
  selectedCategoryFilter,
  setSelectedCategoryFilter,
  onInspectReport
}) => {
  const filteredReports = allReports.filter((rep: any) => {
    const matchesSearch = !reportSearchQuery ||
      rep.originalFilename?.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
      rep.documentType?.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
      rep.keyFindingsSummary?.toLowerCase().includes(reportSearchQuery.toLowerCase());
    const matchesYear = selectedYearFilter === 'ALL' || (rep.reportDate && rep.reportDate.startsWith(selectedYearFilter));
    const matchesCat = selectedCategoryFilter === 'ALL' || rep.category === selectedCategoryFilter;
    return matchesSearch && matchesYear && matchesCat;
  });

  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderArchive size={20} color="#0284C7" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              All Previous Health Records & Treatments ({allReports.length})
            </h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '4px' }}>
            Chronological medical archive spanning all hospital visits, lab tests, prescriptions, and discharges throughout this patient's lifespan.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '6px 10px', borderRadius: '8px' }}>
            <Search size={14} color="#64748B" />
            <input
              type="text"
              placeholder="Filter reports..."
              value={reportSearchQuery}
              onChange={(e) => setReportSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.82rem', width: '130px' }}
            />
          </div>

          <select
            value={selectedYearFilter}
            onChange={(e) => setSelectedYearFilter(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', background: '#FFFFFF' }}
          >
            <option value="ALL">All Years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>

          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', background: '#FFFFFF' }}
          >
            <option value="ALL">All Categories</option>
            <option value="Metabolic">Metabolic / Diabetes</option>
            <option value="Blood">Blood / CBC</option>
            <option value="Renal">Renal / KFT</option>
            <option value="Imaging">Imaging / Ultrasound</option>
            <option value="Prescription">Prescriptions</option>
          </select>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
              <th style={{ padding: '12px 14px' }}>Date</th>
              <th style={{ padding: '12px 14px' }}>Document / Report</th>
              <th style={{ padding: '12px 14px' }}>Issuing Facility</th>
              <th style={{ padding: '12px 14px' }}>Category</th>
              <th style={{ padding: '12px 14px' }}>Key Findings Summary</th>
              <th style={{ padding: '12px 14px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((rep: any) => (
              <tr key={rep.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap' }}>
                  {rep.reportDate}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ fontWeight: 800, color: '#0F172A' }}>{rep.documentType}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{rep.originalFilename}</div>
                </td>
                <td style={{ padding: '12px 14px', color: '#0F766E', fontWeight: 600, fontSize: '0.82rem' }}>
                  🏛️ {rep.labFacility || rep.issuingHospital || 'Accredited Facility'}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <span className="badge badge-teal" style={{ fontSize: '0.72rem' }}>{rep.category || 'Diagnostic'}</span>
                </td>
                <td style={{ padding: '12px 14px', color: '#334155', maxWidth: '320px', fontSize: '0.82rem' }}>
                  {rep.keyFindingsSummary}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <button
                    type="button"
                    onClick={() => onInspectReport(rep)}
                    className="btn-primary"
                    style={{ padding: '5px 12px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                  >
                    Inspect Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
