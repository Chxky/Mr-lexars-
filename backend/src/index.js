import express from 'express';
import cors from 'cors';
import { getDb, queryAll } from './db.js';
import { authMiddleware } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import parcelRoutes from './routes/parcels.js';
import profileRoutes from './routes/profile.js';
import sosRoutes from './routes/sos.js';
import locationRoutes from './routes/locations.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);
app.get('/api/sos/numbers', (req, res) => {
  res.json({ Zimbabwe: '999', Botswana: '999', 'South Africa': '10111' });
});
app.get('/api/locations', async (req, res) => {
  try {
    const rows = queryAll('SELECT vehicle_idx, lat, lng, speed, status, updated_at FROM vehicle_locations ORDER BY vehicle_idx');
    res.json(rows.map(r => ({ vehicleIdx: r.vehicle_idx, lat: r.lat, lng: r.lng, speed: r.speed, status: r.status, updatedAt: r.updated_at })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected routes
app.use('/api/bookings', authMiddleware, bookingRoutes);
app.use('/api/parcels', authMiddleware, parcelRoutes);
app.use('/api/profile', authMiddleware, profileRoutes);
app.use('/api/sos', authMiddleware, sosRoutes);
app.use('/api/location', authMiddleware, locationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function start() {
  await getDb();
  app.listen(PORT, () => {
    console.log(`🚐 Mr Lexar API running on http://localhost:${PORT}`);
  });
}

start();
