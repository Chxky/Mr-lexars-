import { Router } from 'express';
import { getDb, queryOne, queryAll, execute, persist } from '../db.js';

const router = Router();

const DEFAULT_TIMELINE = [
  { label: 'Collected from sender', detail: '📍 Johannesburg, 45 Main Street. Photo attached.', status: 'done', time: '08:15 AM', photo: true },
  { label: 'Departed Mr Lexar JHB depot', detail: 'Loaded onto Mr Lexar Shuttle.', status: 'done', time: '11:30 AM' },
  { label: 'At Groblersbrug border (SA side)', detail: 'Awaiting customs clearance. Estimated wait: 45 min.', status: 'active', time: '03:45 PM' },
  { label: 'Clear Botswana customs (Expected)', detail: 'Botswana customs clearance procedure.', status: 'pending', time: '05:30 PM' },
  { label: 'In transit to Francistown (Expected)', detail: 'Estimated driving time: 2.5 hours.', status: 'pending', time: '06:30 PM' },
  { label: 'Arrive Francistown depot (Expected)', detail: 'Scheduled arrival at Francistown sorting facility.', status: 'pending', time: '10:00 PM' },
  { label: 'Out for delivery (Expected)', detail: 'Local courier will deliver to recipient.', status: 'pending', time: 'Tomorrow 08:00 AM' },
  { label: 'Delivered to recipient (Expected)', detail: '✅ Recipient: Farai M. • Signature captured • Delivery photo attached.', status: 'pending', time: 'Tomorrow 10:00 AM', photo: true },
];

function generateId() {
  return 'ML-TRK-' + (1000 + Math.floor(Math.random() * 9000));
}

router.post('/', async (req, res) => {
  try {
    const { name, weight, value, senderName, senderPhone, receiverName, receiverPhone, receiverCountry } = req.body;
    if (!name || !senderName || !receiverName) {
      return res.status(400).json({ error: 'Parcel name, sender, and receiver are required' });
    }
    await getDb();
    const id = generateId();
    execute('INSERT INTO parcels (id, user_id, name, weight, value, sender_name, sender_phone, receiver_name, receiver_phone, receiver_country, timeline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, req.userId, name, parseFloat(weight) || 0, parseFloat(value) || 0,
       senderName, senderPhone || '', receiverName, receiverPhone || '', receiverCountry || 'Zimbabwe',
       JSON.stringify(DEFAULT_TIMELINE)]);
    persist();
    res.status(201).json({ id, timeline: DEFAULT_TIMELINE });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    await getDb();
    const rows = queryAll('SELECT id, name, weight, value, sender_name, sender_phone, receiver_name, receiver_phone, receiver_country, status, timeline, created_at FROM parcels WHERE user_id = ? ORDER BY created_at DESC', [req.userId]);
    const parcels = rows.map(r => ({
      id: r.id, name: r.name, weight: r.weight, value: r.value,
      senderName: r.sender_name, senderPhone: r.sender_phone,
      receiverName: r.receiver_name, receiverPhone: r.receiver_phone,
      receiverCountry: r.receiver_country, status: r.status,
      timeline: JSON.parse(r.timeline || '[]'), createdAt: r.created_at,
    }));
    res.json(parcels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
