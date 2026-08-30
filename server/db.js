import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, 'sqc.db')
const db = new Database(dbPath)

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

/* ──────────────────────────────────────────────────────────────
   SCHEMA — All tables for the Symbiosis Quantum Club site
   ────────────────────────────────────────────────────────────── */

db.exec(`
  /* ── Team members ── */
  CREATE TABLE IF NOT EXISTS team_members (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    role        TEXT    NOT NULL,
    category    TEXT    NOT NULL CHECK(category IN ('faculty','core','advisors','heads','coheads')),
    department  TEXT,
    bio         TEXT,
    image       TEXT,
    linkedin    TEXT,
    rotated     INTEGER DEFAULT 0,
    sort_order  INTEGER DEFAULT 0,
    created_at  TEXT    DEFAULT (datetime('now'))
  );

  /* ── Blog posts ── */
  CREATE TABLE IF NOT EXISTS blog_posts (
    id            TEXT PRIMARY KEY,
    slug          TEXT UNIQUE NOT NULL,
    title         TEXT NOT NULL,
    date          TEXT NOT NULL,
    category      TEXT,
    read_time     TEXT,
    excerpt       TEXT,
    lead_summary  TEXT,
    image         TEXT,
    image_caption TEXT,
    author_name   TEXT,
    author_role   TEXT,
    author_dept   TEXT,
    author_avatar TEXT,
    author_linkedin TEXT,
    tags          TEXT,  -- JSON array stored as text
    created_at    TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS blog_sections (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id    TEXT    NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    title      TEXT,
    content    TEXT,
    quote      TEXT,
    code_snippet TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS blog_takeaways (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id    TEXT    NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    takeaway   TEXT    NOT NULL,
    sort_order INTEGER DEFAULT 0
  );

  /* ── Events ── */
  CREATE TABLE IF NOT EXISTS events (
    id               TEXT PRIMARY KEY,
    slug             TEXT UNIQUE NOT NULL,
    title            TEXT NOT NULL,
    subtitle         TEXT,
    category         TEXT,
    date             TEXT,
    date_display     TEXT,
    status           TEXT CHECK(status IN ('upcoming','past')),
    location         TEXT,
    participants     TEXT,
    duration         TEXT,
    sessions         INTEGER,
    cover_image      TEXT,
    excerpt          TEXT,
    description      TEXT,  -- JSON array stored as text
    tags             TEXT,  -- JSON array stored as text
    registration_url TEXT,
    ibm_badge        TEXT,
    qiskit_logo      TEXT,
    gallery          TEXT,  -- JSON array stored as text
    created_at       TEXT DEFAULT (datetime('now'))
  );

  /* ── Event registrations (students signing up) ── */
  CREATE TABLE IF NOT EXISTS event_registrations (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id   TEXT    NOT NULL,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL,
    phone      TEXT,
    college    TEXT,
    year       TEXT,
    branch     TEXT,
    team_name  TEXT,
    message    TEXT,
    created_at TEXT    DEFAULT (datetime('now'))
  );

  /* ── Contact form submissions ── */
  CREATE TABLE IF NOT EXISTS contact_submissions (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    subject    TEXT,
    message    TEXT NOT NULL,
    read       INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  /* ── Newsletter subscribers ── */
  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT UNIQUE NOT NULL,
    name       TEXT,
    subscribed INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  /* ── Testimonials ── */
  CREATE TABLE IF NOT EXISTS testimonials (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    quote      TEXT NOT NULL,
    name       TEXT NOT NULL,
    role       TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  /* ── Pioneers ── */
  CREATE TABLE IF NOT EXISTS pioneers (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    role        TEXT,
    year        TEXT,
    description TEXT,
    image       TEXT
  );

  /* ── Timeline ── */
  CREATE TABLE IF NOT EXISTS timeline (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    year        INTEGER NOT NULL,
    title       TEXT    NOT NULL,
    description TEXT
  );

  /* ── Quantum Life Stories ── */
  CREATE TABLE IF NOT EXISTS stories (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT,
    image       TEXT
  );
`)

export default db
