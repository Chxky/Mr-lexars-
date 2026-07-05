import { Router } from 'express';
import { getDb, queryOne, queryAll, execute, persist } from '../db.js';

const router = Router();

const POLICE_NUMBERS = { Zimbabwe: '999', Botswana: '999', 'South Africa': '10111' };

router.post('/', async (req, res) => {
  try {
    const { bookingId, silent } = req.body;
    await getDb();
    const id = 'sos-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    execute('INSERT INTO sos_alerts (id, user_id, booking_id, status, silent) VALUES (?, ?, ?, ?, ?)',
      [id, req.userId, bookingId || null, 'active', silent ? 1 : 0]);
    persist();
    res.status(201).json({
      id,
      status: 'active',
      message: silent ? 'Silent alarm triggered. HQ alerted discreetly.' : 'Emergency alert sent. Help is on the way.',
      policeNumbers: POLICE_NUMBERS,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/resolve', async (req, res) => {
  try {
    await getDb();
    execute('UPDATE sos_alerts SET status = ? WHERE id = ? AND user_id = ?', ['resolved', req.params.id, req.userId]);
    persist();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
