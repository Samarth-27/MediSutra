const API_BASE = 'http://localhost:5000/api/v1';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('medisutra_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('medisutra_token', token);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('medisutra_token');
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('medisutra_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {})
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'API request failed');
    }

    return data;
  }

  // Auth Endpoints
  async login(email = 'rahul.sharma@medisutra.in', password = 'demo1234') {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.data?.token) {
      this.setToken(res.data.token);
    }
    return res.data;
  }

  async getProfile() {
    return this.request('/patients/me');
  }

  // Documents
  async getDocuments() {
    return this.request('/documents');
  }

  async uploadDocument(formData: FormData) {
    return this.request('/documents/upload', {
      method: 'POST',
      body: formData
    });
  }

  // Timeline
  async getTimeline(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/timeline?${query}`);
  }

  // Conditions & Journeys
  async getConditions() {
    return this.request('/conditions');
  }

  async getConditionJourney(conditionId: string) {
    return this.request(`/conditions/${conditionId}/journey`);
  }

  async getCheckpoints(conditionId: string) {
    return this.request(`/monitoring/conditions/${conditionId}/checkpoints`);
  }

  // Trends & Comparisons
  async getTrends(parameter = 'HBA1C') {
    return this.request(`/analytics/trends?parameter=${parameter}`);
  }

  async compareReports(reportAId: string, reportBId: string) {
    return this.request('/analytics/compare', {
      method: 'POST',
      body: JSON.stringify({ reportAId, reportBId })
    });
  }

  // AI & Evidence
  async queryAI(query: string, conversationId?: string) {
    return this.request('/ai/query', {
      method: 'POST',
      body: JSON.stringify({ query, conversationId })
    });
  }

  // Doctor Portal
  async getDoctorPatients() {
    return this.request('/doctor/patients');
  }

  async getPatientDossier(patientId: string) {
    return this.request(`/doctor/patients/${patientId}/dossier`);
  }

  async updateConditionStatus(patientId: string, conditionId: string, newStatus: string, clinicalNote: string) {
    return this.request(`/doctor/patients/${patientId}/conditions/${conditionId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ newStatus, clinicalNote })
    });
  }

  async addDoctorNote(patientId: string, content: string, assessmentType = 'ROUTINE_REVIEW') {
    return this.request(`/doctor/patients/${patientId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content, assessmentType })
    });
  }

  // FHIR R4 & Clinical Graph
  async getFhirExport(patientId: string) {
    return this.request(`/doctor/patients/${patientId}/fhir-export`);
  }

  async getConditionTrajectory(patientId: string, conditionId: string) {
    return this.request(`/doctor/patients/${patientId}/conditions/${conditionId}/trajectory`);
  }

  async getClinicalGraph(patientId: string) {
    return this.request(`/doctor/patients/${patientId}/graph`);
  }

  // ABDM (Ayushman Bharat Digital Mission) & MEDS Stream
  async getAbdmCareContexts(patientId: string) {
    return this.request(`/abdm/care-contexts/${patientId}`);
  }

  async getAbdmConsents(patientId: string) {
    return this.request(`/abdm/consents/${patientId}`);
  }

  async revokeAbdmConsent(consentId: string) {
    return this.request(`/abdm/consents/${consentId}/revoke`, {
      method: 'POST'
    });
  }

  async getMedsStream(patientId: string) {
    return this.request(`/abdm/meds-stream/${patientId}`);
  }

  // Multi-Hospital Network & Central Human Report Center
  async getHospitals() {
    return this.request('/hospitals');
  }

  async getHospitalById(id: string) {
    return this.request(`/hospitals/${id}`);
  }

  async getHospitalPatientRegistry(searchQuery = '') {
    const query = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : '';
    return this.request(`/hospitals/patients/registry${query}`);
  }

  async recordHospitalDiagnosisEncounter(encounterData: any) {
    return this.request('/hospitals/encounters/diagnosis', {
      method: 'POST',
      body: JSON.stringify(encounterData)
    });
  }

  async ingestHospitalDiagnosticReport(reportData: any) {
    return this.request('/hospitals/reports/ingest', {
      method: 'POST',
      body: JSON.stringify(reportData)
    });
  }

  async getHospitalDashboard(id: string) {
    return this.request(`/hospitals/${id}/dashboard`);
  }

  async getCitizenDigiLocker(patientId: string) {
    return this.request(`/hospitals/patients/${patientId}/digilocker`);
  }

  async registerCitizenToCenter(patientData: any) {
    return this.request('/hospitals/patients/register', {
      method: 'POST',
      body: JSON.stringify(patientData)
    });
  }

  async getHospitalDoctors(hospitalId: string) {
    return this.request(`/hospitals/${hospitalId}/doctors`);
  }

  async createHospitalDoctor(hospitalId: string, doctorData: any) {
    return this.request(`/hospitals/${hospitalId}/doctors`, {
      method: 'POST',
      body: JSON.stringify(doctorData)
    });
  }

  async loginHospital(facilityCode: string, password = 'admin') {
    return this.request('/hospitals/login', {
      method: 'POST',
      body: JSON.stringify({ facilityCode, password })
    });
  }

  async loginDoctor(hospitalId: string, licenseNumber: string, doctorName?: string) {
    return this.request('/hospitals/doctor/login', {
      method: 'POST',
      body: JSON.stringify({ hospitalId, licenseNumber, doctorName })
    });
  }

  async loginCitizen(identifier: string) {
    const res = await this.request('/auth/citizen/login', {
      method: 'POST',
      body: JSON.stringify({ identifier })
    });
    if (res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  async cureCondition(conditionId: string, payload: {
    resolvedDate?: string;
    curedByHospital?: string;
    doctorName?: string;
    resolvingEvidence?: string;
  }) {
    return this.request(`/hospitals/conditions/${conditionId}/cure`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async reopenCondition(conditionId: string, payload?: {
    reason?: string;
    doctorName?: string;
    hospitalName?: string;
  }) {
    return this.request(`/hospitals/conditions/${conditionId}/reopen`, {
      method: 'POST',
      body: JSON.stringify(payload || {})
    });
  }
}


export const api = new ApiService();
