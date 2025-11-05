import { Router } from 'express';
import { listSignals } from '../services/db.js';

const r = Router();

r.get('/health', (_req, res) => res.json({ ok: true }));

r.get('/signals', async (req, res) => {
  try {
    const limit = Math.min(500, Number(req.query.limit || 100));
    const rows = await listSignals(limit);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'db_error', detail: String(e?.message || e) });
  }
});

export default r;
