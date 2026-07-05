import { Router } from 'express';
import { getDb, queryOne, queryAll, execute, persist } from '../db.js';

const router = Router();

router.get('/loyalty', async (req, res) => {
  try {
    await getDb();
    const row = queryOne('SELECT loyalty_trips, gold_tier FROM users WHERE id = ?', [req.userId]);
    if (!row) return res.status(404).json({ error: 'User not found' });
    res.json({ trips: row.loyalty_trips, goldTier: !!row.gold_tier, nextTierAt: 5 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/referrals', async (req, res) => {
  try {
    await getDb();
    const referrals = queryAll('SELECT id, referred_name, status, credit_amount, created_at FROM referrals WHERE referrer_id = ? ORDER BY created_at DESC', [req.userId]);
    const user = queryOne('SELECT referral_code, referral_balance FROM users WHERE id = ?', [req.userId]);
    res.json({
      code: user?.referral_code || '',
      balance: user?.referral_balance || 0,
      referrals: referrals.map(r => ({
        id: r.id, name: r.referred_name, status: r.status,
        creditAmount: r.credit_amount, createdAt: r.created_at,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/refer', async (req, res) => {
  try {
    const { referredName } = req.body;
    if (!referredName) return res.status(400).json({ error: 'Referred name is required' });
    await getDb();
    const id = 'ref-' + Math.random().toString(36).substring(2, 8);
    execute('INSERT INTO referrals (id, referrer_id, referred_name) VALUES (?, ?, ?)', [id, req.userId, referredName]);
    persist();
    res.status(201).json({ id, name: referredName, status: 'pending' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
