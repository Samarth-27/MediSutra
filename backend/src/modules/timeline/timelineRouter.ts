import { Router, Request, Response } from 'express';
import { db } from '../../database/store';
import { authenticateToken } from '../../middleware/auth';

const router = Router();

// GET /api/v1/timeline
router.get('/', authenticateToken, (req: Request, res: Response) => {
  let patientId = req.user?.patientId;
  // Non-patient roles (doctors/admins) can specify target patientId, but citizens are strictly locked to their own token patientId
  if (req.user?.role !== 'PATIENT' && req.query.patientId) {
    patientId = req.query.patientId as string;
  }
  const { startDate, endDate, bodySystem, severity, conditionId } = req.query;

  let events = db.healthEvents.filter(e => e.patientId === patientId);

  if (startDate) {
    events = events.filter(e => e.eventDate >= (startDate as string));
  }
  if (endDate) {
    events = events.filter(e => e.eventDate <= (endDate as string));
  }
  if (bodySystem && bodySystem !== 'ALL') {
    events = events.filter(e => e.bodySystem.toLowerCase() === (bodySystem as string).toLowerCase());
  }
  if (severity && severity !== 'ALL') {
    events = events.filter(e => e.severity === severity);
  }
  if (conditionId && conditionId !== 'ALL') {
    events = events.filter(e => e.conditionId === conditionId);
  }

  // Chronological sort: newest first
  events.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());

  // Enrich events with source document details
  const enrichedEvents = events.map(evt => {
    const doc = db.documents.find(d => d.id === evt.sourceDocumentId);
    const cond = db.conditions.find(c => c.id === evt.conditionId);
    return {
      ...evt,
      documentName: doc?.originalFilename || 'Clinical Document',
      conditionName: cond?.conditionName || undefined
    };
  });

  return res.json({
    success: true,
    data: {
      events: enrichedEvents,
      totalCount: enrichedEvents.length
    }
  });
});

export default router;
