/**
 * Asynchronous Medical Report Ingestion Queue (BullMQ + Redis Worker Pattern)
 * 
 * Prevents Node.js event-loop freezes by offloading multi-page PDF rendering,
 * OCR biometric parameter extraction, and LOINC code mapping to background workers.
 */

export interface IngestionJobPayload {
  jobId: string;
  patientId: string;
  documentTitle: string;
  fileKey: string;
  mimeType: string;
  priority: 'ROUTINE' | 'URGENT' | 'STAT';
  submittedAt: string;
  status: 'QUEUED' | 'EXTRACTING_TEXT' | 'PARSING_BIOMARKERS' | 'VALIDATING_LOINC' | 'COMPLETED' | 'FAILED';
  progressPercent: number;
  result?: {
    documentId: string;
    extractedBiomarkersCount: number;
    panicValuesDetected: boolean;
    processingTimeMs: number;
  };
  error?: string;
}

class IngestionQueueManager {
  private jobs: Map<string, IngestionJobPayload> = new Map();

  /**
   * Enqueues a document for asynchronous processing and immediately returns 202 Accepted.
   */
  async enqueueReportIngestion(params: {
    patientId: string;
    documentTitle: string;
    fileKey: string;
    mimeType: string;
    priority?: 'ROUTINE' | 'URGENT' | 'STAT';
  }): Promise<{ jobId: string; status: string; estimatedCompletionSec: number }> {
    const jobId = `job-ocr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    
    const initialJob: IngestionJobPayload = {
      jobId,
      patientId: params.patientId,
      documentTitle: params.documentTitle,
      fileKey: params.fileKey,
      mimeType: params.mimeType,
      priority: params.priority || 'ROUTINE',
      submittedAt: new Date().toISOString(),
      status: 'QUEUED',
      progressPercent: 5
    };

    this.jobs.set(jobId, initialJob);

    // Simulate async background worker dispatch (BullMQ/Redis worker sandbox)
    this.processBackgroundJobAsync(jobId);

    return {
      jobId,
      status: 'QUEUED',
      estimatedCompletionSec: params.priority === 'STAT' ? 1.5 : 3.0
    };
  }

  /**
   * Worker task simulation: executes non-blocking chunked OCR & biomarker extraction
   */
  private processBackgroundJobAsync(jobId: string) {
    setTimeout(() => {
      const job = this.jobs.get(jobId);
      if (!job) return;
      job.status = 'EXTRACTING_TEXT';
      job.progressPercent = 35;
    }, 400);

    setTimeout(() => {
      const job = this.jobs.get(jobId);
      if (!job) return;
      job.status = 'PARSING_BIOMARKERS';
      job.progressPercent = 70;
    }, 1000);

    setTimeout(() => {
      const job = this.jobs.get(jobId);
      if (!job) return;
      job.status = 'COMPLETED';
      job.progressPercent = 100;
      job.result = {
        documentId: `doc-${Date.now()}`,
        extractedBiomarkersCount: 6,
        panicValuesDetected: false,
        processingTimeMs: 1450
      };
    }, 1800);
  }

  getJobStatus(jobId: string): IngestionJobPayload | undefined {
    return this.jobs.get(jobId);
  }
}

export const ingestionQueue = new IngestionQueueManager();
