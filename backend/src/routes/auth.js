import { Router } from 'express';
import { getDb, queryOne, queryAll, execute, persist } from '../db.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';

const router = Router();

function generateRefCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let r = '';
  for (let i = 0; i < 4; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return 'LEXAR-REF-' + r;
}

router.post('/register', async (req, res) => {
  try {
    const { name, phone, passport, pin } = req.body;
    if (!name || !phone || !pin) {
      return res.status(400).json({ error: 'Name, phone, and pin are required' });
    }
    await getDb();
    const existing = queryOne('SELECT id FROM users WHERE phone = ?', [phone]);
    if (existing) {
      return res.status(409).json({ error: 'Phone number already registered' });
    }
    const id = 'usr-' + Math.random().toString(36).substring(2, 10);
    const refCode = generateRefCode();
    execute('INSERT INTO users (id, name, phone, passport, pin, referral_code) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, phone, passport || '', pin, refCode]);
    persist();
    const token = generateToken(id);
    res.status(201).json({
      token,
      user: { id, name, phone, referralCode: refCode, loyaltyTrips: 0, goldTier: false, referralBalance: 0 },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, pin } = req.body;
    if (!phone || !pin) {
      return res.status(400).json({ error: 'Phone and pin are required' });
    }
    await getDb();
    const row = queryOne('SELECT id, name, phone, referral_code, referral_balance, loyalty_trips, gold_tier FROM users WHERE phone = ? AND pin = ?', [phone, pin]);
    if (!row) {
      return res.status(401).json({ error: 'Invalid phone or PIN' });
    }
    const user = {
      id: row.id, name: row.name, phone: row.phone,
      referralCode: row.referral_code, referralBalance: row.referral_balance,
      loyaltyTrips: row.loyalty_trips, goldTier: !!row.gold_tier,
    };
    const token = generateToken(user.id);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    await getDb();
    const row = queryOne('SELECT id, name, phone, passport, referral_code, referral_balance, loyalty_trips, gold_tier FROM users WHERE id = ?', [req.userId]);
    if (!row) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: row.id, name: row.name, phone: row.phone, passport: row.passport,
      referralCode: row.referral_code, referralBalance: row.referral_balance,
      loyaltyTrips: row.loyalty_trips, goldTier: !!row.gold_tier,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
