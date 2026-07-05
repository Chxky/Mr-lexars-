import { Router } from 'express';
import { getDb, queryOne, queryAll, execute, persist } from '../db.js';

const router = Router();

function generateId() {
  return 'ML-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

router.post('/', async (req, res) => {
  try {
    const { pickup, dropoff, date, passengerName, passport, phone } = req.body;
    if (!pickup || !dropoff || !passengerName) {
      return res.status(400).json({ error: 'Pickup, dropoff, and passenger name are required' });
    }
    await getDb();
    const id = generateId();
    const vehicles = ['Mr Lexar Shuttle 03', 'Mr Lexar Shuttle 07', 'Mr Lexar Shuttle 12', 'Mr Lexar Express 02'];
    const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    execute('INSERT INTO bookings (id, user_id, pickup, dropoff, date, passenger_name, passport, phone, vehicle) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, req.userId, pickup, dropoff, date || new Date().toISOString().split('T')[0], passengerName, passport || '', phone || '', vehicle]);
    execute('UPDATE users SET loyalty_trips = loyalty_trips + 1 WHERE id = ?', [req.userId]);
    const user = queryOne('SELECT loyalty_trips FROM users WHERE id = ?', [req.userId]);
    const trips = user.loyalty_trips;
    let goldUnlocked = false;
    if (trips >= 5) {
      execute('UPDATE users SET gold_tier = 1 WHERE id = ?', [req.userId]);
      goldUnlocked = true;
    }
    persist();
    res.status(201).json({ id, vehicle, goldTierUnlocked: goldUnlocked, loyaltyTrips: trips });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    await getDb();
    const rows = queryAll('SELECT id, pickup, dropoff, date, passenger_name, vehicle, status, family_tracking, family_phone, created_at FROM bookings WHERE user_id = ? ORDER BY created_at DESC', [req.userId]);
    const bookings = rows.map(r => ({
      id: r.id, pickup: r.pickup, dropoff: r.dropoff, date: r.date,
      passengerName: r.passenger_name, vehicle: r.vehicle, status: r.status,
      familyTracking: !!r.family_tracking, familyPhone: r.family_phone, createdAt: r.created_at,
    }));
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/family', async (req, res) => {
  try {
    const { phone } = req.body;
    await getDb();
    execute('UPDATE bookings SET family_tracking = 1, family_phone = ? WHERE id = ? AND user_id = ?',
      [phone || '', req.params.id, req.userId]);
    persist();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
