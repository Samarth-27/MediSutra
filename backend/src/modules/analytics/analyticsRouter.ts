import { Router, Request, Response } from 'express';
import { db } from '../../database/store';
import { authenticateToken } from '../../middleware/auth';

const router = Router();

// GET /api/v1/analytics/trends?parameter=HBA1C
router.get('/trends', authenticateToken, (req: Request, res: Response) => {
  const patientId = req.user?.patientId;
  const parameterCode = ((req.query.parameter as string) || 'HBA1C').toUpperCase();

  const matchingLabs = db.labResults
    .filter(l => l.patientId === patientId && l.parameterCode === parameterCode)
    .sort((a, b) => new Date(a.observedDate).getTime() - new Date(b.observedDate).getTime());

  if (matchingLabs.length === 0) {
    return res.json({
      success: true,
      data: {
        parameterCode,
        parameterName: parameterCode,
        readings: [],
        message: 'No recorded values found for this parameter in available records.'
      }
    });
  }

  const firstReading = matchingLabs[0];
  const latestReading = matchingLabs[matchingLabs.length - 1];
  const delta = Number((latestReading.numericValue - firstReading.numericValue).toFixed(2));

  let summary = `Recorded ${firstReading.parameterName} `;
  if (matchingLabs.length === 1) {
    summary += `has 1 documented reading: ${firstReading.numericValue} ${firstReading.rawUnit}. Historical trend cannot be established.`;
  } else if (delta < 0) {
    summary += `decreased from ${firstReading.numericValue} ${firstReading.rawUnit} to ${latestReading.numericValue} ${latestReading.rawUnit} across ${matchingLabs.length} documented readings.`;
  } else if (delta > 0) {
    summary += `increased from ${firstReading.numericValue} ${firstReading.rawUnit} to ${latestReading.numericValue} ${latestReading.rawUnit} across ${matchingLabs.length} documented readings.`;
  } else {
    summary += `remained stable at ${firstReading.numericValue} ${firstReading.rawUnit} across ${matchingLabs.length} documented readings.`;
  }

  const readings = matchingLabs.map(l => {
    const doc = db.documents.find(d => d.id === l.sourceDocumentId);
    return {
      id: l.id,
      date: l.observedDate,
      value: l.numericValue,
      unit: l.rawUnit,
      flag: l.flag,
      sourceDocumentId: l.sourceDocumentId,
      sourceDocumentName: doc?.originalFilename || 'Medical Report',
      sourcePageNumber: l.sourcePageNumber
    };
  });

  return res.json({
    success: true,
    data: {
      parameterCode,
      parameterName: firstReading.parameterName,
      unit: firstReading.rawUnit,
      referenceMin: firstReading.referenceMin,
      referenceMax: firstReading.referenceMax,
      readings,
      summary,
      delta
    }
  });
});

// POST /api/v1/analytics/compare
router.post('/compare', authenticateToken, (req: Request, res: Response) => {
  const patientId = req.user?.patientId;
  const { reportAId, reportBId } = req.body;

  if (!reportAId || !reportBId) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_INPUT', message: 'Both reportAId and reportBId are required.' }
    });
  }

  const docA = db.documents.find(d => d.id === reportAId && d.patientId === patientId);
  const docB = db.documents.find(d => d.id === reportBId && d.patientId === patientId);

  if (!docA || !docB) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'One or both requested reports could not be found.' }
    });
  }

  // Ensure chronological order (A = earlier, B = later)
  const [earlierDoc, laterDoc] = new Date(docA.reportDate) <= new Date(docB.reportDate)
    ? [docA, docB]
    : [docB, docA];

  const labsA = db.labResults.filter(l => l.sourceDocumentId === earlierDoc.id);
  const labsB = db.labResults.filter(l => l.sourceDocumentId === laterDoc.id);

  // Match parameters present in both or either
  const paramCodes = Array.from(new Set([...labsA.map(l => l.parameterCode), ...labsB.map(l => l.parameterCode)]));

  const comparisonRows = paramCodes.map(code => {
    const valA = labsA.find(l => l.parameterCode === code);
    const valB = labsB.find(l => l.parameterCode === code);

    const name = valB?.parameterName || valA?.parameterName || code;
    const unit = valB?.rawUnit || valA?.rawUnit || '';
    const prev = valA ? valA.numericValue : null;
    const curr = valB ? valB.numericValue : null;

    let delta: number | null = null;
    let percentChange: number | null = null;
    let direction: 'INCREASED' | 'DECREASED' | 'UNCHANGED' | 'NOT_APPLICABLE' = 'NOT_APPLICABLE';

    if (prev !== null && curr !== null) {
      delta = Number((curr - prev).toFixed(2));
      percentChange = Number(((delta / prev) * 100).toFixed(1));
      direction = delta > 0 ? 'INCREASED' : delta < 0 ? 'DECREASED' : 'UNCHANGED';
    }

    return {
      parameterCode: code,
      parameterName: name,
      unit,
      previousValue: prev,
      currentValue: curr,
      delta,
      percentChange,
      direction,
      previousFlag: valA?.flag || 'UNKNOWN',
      currentFlag: valB?.flag || 'UNKNOWN'
    };
  });

  return res.json({
    success: true,
    data: {
      reportPrevious: {
        id: earlierDoc.id,
        filename: earlierDoc.originalFilename,
        date: earlierDoc.reportDate,
        type: earlierDoc.documentType
      },
      reportCurrent: {
        id: laterDoc.id,
        filename: laterDoc.originalFilename,
        date: laterDoc.reportDate,
        type: laterDoc.documentType
      },
      comparison: comparisonRows
    }
  });
});

export default router;
