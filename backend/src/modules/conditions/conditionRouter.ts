import { Router, Request, Response } from 'express';
import { db } from '../../database/store';
import { authenticateToken } from '../../middleware/auth';

const router = Router();

// GET /api/v1/conditions
router.get('/', authenticateToken, (req: Request, res: Response) => {
  const patientId = req.user?.patientId;
  const conditions = db.conditions.filter(c => c.patientId === patientId);

  const enrichedConditions = conditions.map(cond => {
    const linkedStages = db.conditionStages.filter(s => s.conditionId === cond.id);
    const linkedCheckpoints = db.checkpoints.filter(chk => chk.conditionId === cond.id);
    const linkedLabs = db.labResults.filter(l => {
      const evt = db.healthEvents.find(e => e.id === l.healthEventId);
      return evt?.conditionId === cond.id;
    });

    return {
      ...cond,
      stagesCount: linkedStages.length,
      checkpointsCount: linkedCheckpoints.length,
      reportsLinkedCount: linkedLabs.length
    };
  });

  return res.json({
    success: true,
    data: enrichedConditions
  });
});

// GET /api/v1/conditions/:id/journey
router.get('/:id/journey', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const condition = db.conditions.find(c => c.id === id);

  if (!condition) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Condition not found.' }
    });
  }

  const stages = db.conditionStages
    .filter(s => s.conditionId === condition.id)
    .sort((a, b) => new Date(a.stageDate).getTime() - new Date(b.stageDate).getTime());

  const enrichedStages = stages.map(stage => {
    const doc = db.documents.find(d => d.id === stage.sourceDocumentId);
    return {
      ...stage,
      documentName: doc?.originalFilename,
      documentType: doc?.documentType
    };
  });

  const checkpoints = db.checkpoints.filter(chk => chk.conditionId === condition.id);

  return res.json({
    success: true,
    data: {
      condition,
      stages: enrichedStages,
      checkpoints
    }
  });
});

export default router;
