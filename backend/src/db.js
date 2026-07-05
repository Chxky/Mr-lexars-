import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'mr-lexar.db');

let db = null;

export async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs();
  const exists = fs.existsSync(DB_PATH);

  if (exists) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA journal_mode=WAL');
  db.run('PRAGMA foreign_keys=ON');

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    passport TEXT DEFAULT '',
    pin TEXT NOT NULL,
    referral_code TEXT UNIQUE NOT NULL,
    referral_balance REAL DEFAULT 0,
    loyalty_trips INTEGER DEFAULT 0,
    gold_tier INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    pickup TEXT NOT NULL,
    dropoff TEXT NOT NULL,
    date TEXT NOT NULL,
    passenger_name TEXT NOT NULL,
    passport TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    vehicle TEXT DEFAULT '',
    status TEXT DEFAULT 'confirmed',
    family_tracking INTEGER DEFAULT 0,
    family_phone TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS parcels (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    weight REAL DEFAULT 0,
    value REAL DEFAULT 0,
    sender_name TEXT NOT NULL,
    sender_phone TEXT DEFAULT '',
    receiver_name TEXT NOT NULL,
    receiver_phone TEXT DEFAULT '',
    receiver_country TEXT DEFAULT 'Zimbabwe',
    status TEXT DEFAULT 'registered',
    timeline TEXT DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS referrals (
    id TEXT PRIMARY KEY,
    referrer_id TEXT NOT NULL,
    referred_name TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    credit_amount REAL DEFAULT 5,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (referrer_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS vehicle_locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_idx INTEGER NOT NULL UNIQUE,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    speed TEXT DEFAULT '',
    status TEXT DEFAULT '',
    updated_at TEXT DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS sos_alerts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    booking_id TEXT,
    status TEXT DEFAULT 'active',
    silent INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  if (!exists) {
    const userId = 'user-001';
    db.run('INSERT INTO users (id, name, phone, passport, pin, referral_code, referral_balance, loyalty_trips, gold_tier) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, 'Tendai M.', '+27710779990', 'BN123456', '1234', 'LEXAR-REF-8291', 5, 4, 0]);
    db.run('INSERT INTO referrals (id, referrer_id, referred_name, status, credit_amount) VALUES (?, ?, ?, ?, ?)',
      ['ref-001', userId, 'Tendai C.', 'pending', 5]);
    db.run('INSERT INTO referrals (id, referrer_id, referred_name, status, credit_amount) VALUES (?, ?, ?, ?, ?)',
      ['ref-002', userId, 'Farai M.', 'completed', 5]);
    db.run('INSERT INTO vehicle_locations (vehicle_idx, lat, lng, speed, status) VALUES (?, ?, ?, ?, ?)',
      [0, -25.865, 25.644, '0 km/h', 'At Mafikeng Depot']);
    db.run('INSERT INTO vehicle_locations (vehicle_idx, lat, lng, speed, status) VALUES (?, ?, ?, ?, ?)',
      [1, -22.6, 27.1, '65 km/h', 'On Route to Francistown']);
    db.run('INSERT INTO vehicle_locations (vehicle_idx, lat, lng, speed, status) VALUES (?, ?, ?, ?, ?)',
      [2, -17.79, 25.27, '0 km/h', 'At Kazungula Border']);
    db.run('INSERT INTO vehicle_locations (vehicle_idx, lat, lng, speed, status) VALUES (?, ?, ?, ?, ?)',
      [3, -25.3, 27.2, '85 km/h', 'On Route to Gaborone']);
    persist();
  }

  return db;
}

export function persist() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

export function queryOne(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const row = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return row;
}

export function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

export function execute(sql, params = []) {
  db.run(sql, params);
}
