import { Router, Request, Response } from 'express';
import { db } from '../../database/store';
import { authenticateToken } from '../../middleware/auth';

const router = Router();

// GET /api/v1/monitoring/conditions/:conditionId/checkpoints
router.get('/conditions/:conditionId/checkpoints', authenticateToken, (req: Request, res: Response) => {
  const { conditionId } = req.params;
  const condition = db.conditions.find(c => c.id === conditionId);

  if (!condition) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Condition not found.' }
    });
  }

  const checkpoints = db.checkpoints.filter(chk => chk.conditionId === condition.id);

  const enrichedCheckpoints = checkpoints.map(chk => {
    const doc = db.documents.find(d => d.id === chk.matchedDocumentId);
    return {
      ...chk,
      matchedDocumentName: doc?.originalFilename,
      matchedReportDate: doc?.reportDate
    };
  });

  return res.json({
    success: true,
    data: {
      conditionName: condition.conditionName,
      protocolName: 'Standard Periodic Glycemic & Metabolic Review Protocol',
      checkpoints: enrichedCheckpoints
    }
  });
});

export default router;
