import { db, Patient, PatientCondition, DocumentRecord, LabResult } from '../../database/store';

export interface FHIRResource {
  resourceType: string;
  id: string;
  [key: string]: any;
}

export interface FHIRBundle {
  resourceType: 'Bundle';
  id: string;
  type: 'collection';
  timestamp: string;
  total: number;
  entry: {
    fullUrl: string;
    resource: FHIRResource;
  }[];
}

/**
 * HL7 FHIR R4 Interoperability Adapter
 * Maps MediSutra's longitudinal clinical data into standard HL7 FHIR R4 resources
 * for hospital EHR integration (Epic, Cerner, Bahmni) and ABDM compliance.
 */
export class FHIRAdapter {
  static exportPatientBundle(patientId: string): FHIRBundle {
    const patient = db.patients.find(p => p.id === patientId);
    if (!patient) throw new Error(`Patient ${patientId} not found`);

    const conditions = db.conditions.filter(c => c.patientId === patientId);
    const documents = db.documents.filter(d => d.patientId === patientId);
    const labs = db.labResults.filter(l => l.patientId === patientId);

    const bundleEntries: { fullUrl: string; resource: FHIRResource }[] = [];

    // 1. FHIR Patient Resource
    const fhirPatient: FHIRResource = {
      resourceType: 'Patient',
      id: patient.id,
      identifier: [
        {
          use: 'official',
          system: 'https://medisutra.in/health-identity',
          value: patient.healthId
        }
      ],
      active: true,
      name: [
        {
          use: 'official',
          text: patient.fullName
        }
      ],
      gender: patient.gender.toLowerCase() === 'male' ? 'male' : 'female',
      birthDate: patient.dob,
      extension: [
        {
          url: 'http://hl7.org/fhir/StructureDefinition/patient-bloodGroup',
          valueString: patient.bloodGroup
        }
      ]
    };
    bundleEntries.push({
      fullUrl: `urn:uuid:${patient.id}`,
      resource: fhirPatient
    });

    // 2. FHIR Condition Resources
    conditions.forEach(cond => {
      const isResolved = cond.currentStatus === 'RESOLVED';
      const fhirCondition: FHIRResource = {
        resourceType: 'Condition',
        id: cond.id,
        clinicalStatus: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
              code: isResolved ? 'resolved' : 'active',
              display: isResolved ? 'Resolved' : 'Active'
            }
          ]
        },
        verificationStatus: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status',
              code: 'confirmed',
              display: 'Confirmed'
            }
          ]
        },
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/condition-category',
                code: 'problem-list-item',
                display: 'Problem List Item'
              }
            ]
          }
        ],
        code: {
          coding: [
            {
              system: 'https://medisutra.in/condition-codes',
              code: cond.conditionCode,
              display: cond.conditionName
            }
          ],
          text: cond.conditionName
        },
        subject: {
          reference: `Patient/${patient.id}`,
          display: patient.fullName
        },
        onsetDateTime: cond.firstDocumentedDate,
        ...(cond.resolvedDate ? { abatementDateTime: cond.resolvedDate } : {}),
        note: [
          {
            text: cond.treatmentSummary || `Status: ${cond.currentStatus}`
          }
        ]
      };

      bundleEntries.push({
        fullUrl: `urn:uuid:${cond.id}`,
        resource: fhirCondition
      });
    });

    // 3. FHIR Observation Resources (Lab Results)
    labs.forEach(lab => {
      const fhirObservation: FHIRResource = {
        resourceType: 'Observation',
        id: lab.id,
        status: 'final',
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'laboratory',
                display: 'Laboratory'
              }
            ]
          }
        ],
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: lab.parameterCode,
              display: lab.parameterName
            }
          ],
          text: lab.parameterName
        },
        subject: {
          reference: `Patient/${patient.id}`,
          display: patient.fullName
        },
        effectiveDateTime: lab.observedDate,
        valueQuantity: {
          value: lab.numericValue,
          unit: lab.rawUnit,
          system: 'http://unitsofmeasure.org'
        },
        interpretation: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
                code: lab.flag === 'NORMAL' ? 'N' : lab.flag === 'HIGH' ? 'H' : 'L',
                display: lab.flag
              }
            ]
          }
        ],
        referenceRange: [
          {
            low: {
              value: lab.referenceMin,
              unit: lab.rawUnit
            },
            high: {
              value: lab.referenceMax,
              unit: lab.rawUnit
            }
          }
        ]
      };

      bundleEntries.push({
        fullUrl: `urn:uuid:${lab.id}`,
        resource: fhirObservation
      });
    });

    // 4. FHIR DiagnosticReport Resources
    documents.forEach(doc => {
      const relatedLabs = labs.filter(l => l.sourceDocumentId === doc.id);
      const fhirReport: FHIRResource = {
        resourceType: 'DiagnosticReport',
        id: doc.id,
        status: 'final',
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
                code: 'LAB',
                display: 'Laboratory'
              }
            ],
            text: doc.category
          }
        ],
        code: {
          text: doc.originalFilename
        },
        subject: {
          reference: `Patient/${patient.id}`,
          display: patient.fullName
        },
        effectiveDateTime: doc.reportDate,
        issued: `${doc.uploadDate}T00:00:00Z`,
        performer: [
          {
            display: doc.labFacility
          }
        ],
        result: relatedLabs.map(l => ({
          reference: `Observation/${l.id}`,
          display: l.parameterName
        })),
        conclusion: doc.keyFindingsSummary
      };

      bundleEntries.push({
        fullUrl: `urn:uuid:${doc.id}`,
        resource: fhirReport
      });
    });

    return {
      resourceType: 'Bundle',
      id: `bundle-medisutra-${patient.id}`,
      type: 'collection',
      timestamp: new Date().toISOString(),
      total: bundleEntries.length,
      entry: bundleEntries
    };
  }
}
