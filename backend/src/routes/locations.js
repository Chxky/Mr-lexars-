import { Router } from 'express';
import { getDb, queryOne, queryAll, execute, persist } from '../db.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { vehicleIdx, lat, lng, speed, status } = req.body;
    if (vehicleIdx === undefined || lat === undefined || lng === undefined) {
      return res.status(400).json({ error: 'vehicleIdx, lat, and lng are required' });
    }
    await getDb();
    const existing = queryOne('SELECT id FROM vehicle_locations WHERE vehicle_idx = ?', [vehicleIdx]);
    if (existing) {
      execute('UPDATE vehicle_locations SET lat = ?, lng = ?, speed = ?, status = ?, updated_at = datetime(\'now\') WHERE vehicle_idx = ?',
        [lat, lng, speed || '', status || '', vehicleIdx]);
    } else {
      execute('INSERT INTO vehicle_locations (vehicle_idx, lat, lng, speed, status) VALUES (?, ?, ?, ?, ?)',
        [vehicleIdx, lat, lng, speed || '', status || '']);
    }
    persist();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    await getDb();
    const rows = queryAll('SELECT vehicle_idx, lat, lng, speed, status, updated_at FROM vehicle_locations ORDER BY vehicle_idx');
    const locations = rows.map(r => ({
      vehicleIdx: r.vehicle_idx,
      lat: r.lat,
      lng: r.lng,
      speed: r.speed,
      status: r.status,
      updatedAt: r.updated_at,
    }));
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
