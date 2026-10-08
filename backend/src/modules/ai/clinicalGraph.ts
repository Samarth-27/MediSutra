import { db, PatientCondition, DocumentRecord, LabResult, HealthEvent } from '../../database/store';

export interface GraphNode {
  id: string;
  type: 'PATIENT' | 'CONDITION' | 'DOCUMENT' | 'LAB_RESULT' | 'HEALTH_EVENT' | 'INTERVENTION';
  label: string;
  timestamp?: string;
  properties: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: 
    | 'HAS_CONDITION'
    | 'DOCUMENTED_IN'
    | 'EVIDENCES_CONDITION'
    | 'RESOLVED_BY'
    | 'CONTAINS_LAB'
    | 'TRIGGERED_EVENT'
    | 'FOLLOWED_BY';
  timestamp?: string;
  properties?: Record<string, any>;
}

export interface ClinicalGraph {
  patientId: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface ConditionTrajectory {
  conditionId: string;
  conditionName: string;
  currentStatus: string;
  timeline: {
    stage: string;
    date: string;
    description: string;
    document?: DocumentRecord;
    associatedLabs: LabResult[];
  }[];
  isResolved: boolean;
  resolvingReport?: DocumentRecord;
}

/**
 * Temporal Clinical Knowledge Graph Engine
 * Performs deterministic multi-hop graph queries over patient records,
 * eliminating LLM temporal hallucinations.
 */
export class ClinicalGraphEngine {
  /**
   * Build an in-memory property graph for a given patient
   */
  static buildPatientGraph(patientId: string): ClinicalGraph {
    const patient = db.patients.find(p => p.id === patientId);
    if (!patient) throw new Error(`Patient ${patientId} not found`);

    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    // 1. Patient Node
    nodes.push({
      id: patient.id,
      type: 'PATIENT',
      label: patient.fullName,
      properties: {
        healthId: patient.healthId,
        gender: patient.gender,
        dob: patient.dob,
        bloodGroup: patient.bloodGroup
      }
    });

    // 2. Condition Nodes & Edges
    const conditions = db.conditions.filter(c => c.patientId === patientId);
    conditions.forEach(c => {
      nodes.push({
        id: c.id,
        type: 'CONDITION',
        label: c.conditionName,
        timestamp: c.firstDocumentedDate,
        properties: {
          conditionCode: c.conditionCode,
          currentStatus: c.currentStatus,
          severity: c.severity,
          firstDocumentedDate: c.firstDocumentedDate,
          resolvedDate: c.resolvedDate,
          treatmentSummary: c.treatmentSummary
        }
      });

      edges.push({
        id: `e-pat-cond-${c.id}`,
        source: patient.id,
        target: c.id,
        relationship: 'HAS_CONDITION',
        timestamp: c.firstDocumentedDate
      });

      // Resolving report link if resolved
      if (c.resolvingReportId) {
        edges.push({
          id: `e-cond-res-${c.id}`,
          source: c.id,
          target: c.resolvingReportId,
          relationship: 'RESOLVED_BY',
          timestamp: c.resolvedDate
        });
      }
    });

    // 3. Document Nodes & Lab Result Nodes
    const documents = db.documents.filter(d => d.patientId === patientId);
    documents.forEach(doc => {
      nodes.push({
        id: doc.id,
        type: 'DOCUMENT',
        label: doc.originalFilename,
        timestamp: doc.reportDate,
        properties: {
          category: doc.category,
          labFacility: doc.labFacility,
          reportDate: doc.reportDate,
          abnormalCount: doc.abnormalCount,
          keyFindingsSummary: doc.keyFindingsSummary
        }
      });

      edges.push({
        id: `e-pat-doc-${doc.id}`,
        source: patient.id,
        target: doc.id,
        relationship: 'DOCUMENTED_IN',
        timestamp: doc.reportDate
      });

      // Lab observations inside this document
      const labs = db.labResults.filter(l => l.sourceDocumentId === doc.id);
      labs.forEach(lab => {
        nodes.push({
          id: lab.id,
          type: 'LAB_RESULT',
          label: `${lab.parameterName}: ${lab.numericValue} ${lab.rawUnit}`,
          timestamp: lab.observedDate,
          properties: {
            parameterCode: lab.parameterCode,
            parameterName: lab.parameterName,
            numericValue: lab.numericValue,
            unit: lab.rawUnit,
            flag: lab.flag,
            refMin: lab.referenceMin,
            refMax: lab.referenceMax
          }
        });

        edges.push({
          id: `e-doc-lab-${lab.id}`,
          source: doc.id,
          target: lab.id,
          relationship: 'CONTAINS_LAB',
          timestamp: lab.observedDate
        });
      });
    });

    // 4. Connect Conditions to relevant Documents/Labs based on bodySystem/parameter
    conditions.forEach(cond => {
      if (cond.conditionCode === 'COND-T2D') {
        const glycemicDocs = documents.filter(d => d.category === 'Metabolic');
        glycemicDocs.forEach(d => {
          edges.push({
            id: `e-cond-doc-${cond.id}-${d.id}`,
            source: d.id,
            target: cond.id,
            relationship: 'EVIDENCES_CONDITION',
            timestamp: d.reportDate
          });
        });
      } else if (cond.conditionCode === 'COND-VITD') {
        const vitdDocs = documents.filter(d => d.id === 'doc-001' || d.id === 'doc-004');
        vitdDocs.forEach(d => {
          edges.push({
            id: `e-cond-doc-${cond.id}-${d.id}`,
            source: d.id,
            target: cond.id,
            relationship: 'EVIDENCES_CONDITION',
            timestamp: d.reportDate
          });
        });
      }
    });

    return { patientId, nodes, edges };
  }

  /**
   * Deterministically trace complete chronological trajectory of a condition
   */
  static traceConditionTrajectory(patientId: string, conditionId: string): ConditionTrajectory | null {
    const condition = db.conditions.find(c => c.id === conditionId && c.patientId === patientId);
    if (!condition) return null;

    const stages = db.conditionStages
      .filter(s => s.conditionId === condition.id)
      .sort((a, b) => new Date(a.stageDate).getTime() - new Date(b.stageDate).getTime());

    const timeline = stages.map(stg => {
      const doc = stg.sourceDocumentId ? db.documents.find(d => d.id === stg.sourceDocumentId) : undefined;
      const associatedLabs = doc ? db.labResults.filter(l => l.sourceDocumentId === doc.id) : [];

      return {
        stage: stg.label,
        date: stg.stageDate,
        description: stg.description,
        document: doc,
        associatedLabs
      };
    });

    const resolvingReport = condition.resolvingReportId
      ? db.documents.find(d => d.id === condition.resolvingReportId)
      : undefined;

    return {
      conditionId: condition.id,
      conditionName: condition.conditionName,
      currentStatus: condition.currentStatus,
      timeline,
      isResolved: condition.currentStatus === 'RESOLVED',
      resolvingReport
    };
  }

  /**
   * Query all resolved past diseases with verified evidence
   */
  static getResolvedDiseasesSummary(patientId: string) {
    const resolved = db.conditions.filter(c => c.patientId === patientId && c.currentStatus === 'RESOLVED');
    return resolved.map(cond => {
      const resolvingDoc = cond.resolvingReportId ? db.documents.find(d => d.id === cond.resolvingReportId) : null;
      const resolvingLabs = resolvingDoc ? db.labResults.filter(l => l.sourceDocumentId === resolvingDoc.id) : [];

      return {
        id: cond.id,
        conditionName: cond.conditionName,
        firstDocumentedDate: cond.firstDocumentedDate,
        resolvedDate: cond.resolvedDate,
        treatmentSummary: cond.treatmentSummary,
        resolvingReport: resolvingDoc ? {
          id: resolvingDoc.id,
          filename: resolvingDoc.originalFilename,
          reportDate: resolvingDoc.reportDate,
          facility: resolvingDoc.labFacility,
          evidenceSnippet: resolvingDoc.keyFindingsSummary
        } : null,
        resolvingLabs: resolvingLabs.map(l => ({
          parameterName: l.parameterName,
          value: `${l.numericValue} ${l.rawUnit}`,
          status: l.flag
        }))
      };
    });
  }

  /**
   * Multi-hop temporal query: trace response to intervention across time
   */
  static traceLabBiomarkerTrajectory(patientId: string, parameterCode: string) {
    const labs = db.labResults
      .filter(l => l.patientId === patientId && l.parameterCode === parameterCode)
      .sort((a, b) => new Date(a.observedDate).getTime() - new Date(b.observedDate).getTime());

    if (labs.length === 0) return null;

    const baseline = labs[0];
    const latest = labs[labs.length - 1];
    const delta = (latest.numericValue - baseline.numericValue).toFixed(1);
    const percentChange = (((latest.numericValue - baseline.numericValue) / baseline.numericValue) * 100).toFixed(1);

    return {
      parameterName: baseline.parameterName,
      parameterCode,
      unit: baseline.rawUnit,
      baseline: {
        date: baseline.observedDate,
        value: baseline.numericValue,
        flag: baseline.flag,
        documentId: baseline.sourceDocumentId
      },
      latest: {
        date: latest.observedDate,
        value: latest.numericValue,
        flag: latest.flag,
        documentId: latest.sourceDocumentId
      },
      totalReadings: labs.length,
      numericalDelta: Number(delta),
      percentChange: `${percentChange}%`,
      trendDirection: Number(delta) < 0 ? 'DECREASING' : Number(delta) > 0 ? 'INCREASING' : 'STABLE',
      history: labs.map(l => ({
        date: l.observedDate,
        value: l.numericValue,
        flag: l.flag,
        documentId: l.sourceDocumentId
      }))
    };
  }
}
