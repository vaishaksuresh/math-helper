import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import path from 'path'
import fs from 'fs'

const dbPath = process.env.DATABASE_URL ?? path.join(process.cwd(), 'data', 'sqlite.db')

// Ensure data directory exists
const dir = path.dirname(dbPath)
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

const sqlite = new Database(dbPath)
sqlite.pragma('journal_mode = WAL')
sqlite.pragma('foreign_keys = ON')

export const db = drizzle(sqlite, { schema })

// Auto-migrate: create tables if they don't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT NOT NULL,
    grade_preference INTEGER,
    difficulty_preference TEXT,
    theme TEXT NOT NULL DEFAULT 'dark',
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    profile_id TEXT REFERENCES profiles(id),
    student_name TEXT,
    grade_level INTEGER NOT NULL,
    difficulty TEXT NOT NULL,
    mode TEXT NOT NULL,
    total_questions INTEGER,
    time_limit_minutes INTEGER,
    status TEXT NOT NULL DEFAULT 'active',
    current_question_index INTEGER NOT NULL DEFAULT 0,
    score INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    completed_at INTEGER,
    last_active_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id),
    order_index INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL,
    requires_paper INTEGER NOT NULL DEFAULT 0,
    choices TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    explanation TEXT NOT NULL,
    hint TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS answers (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id),
    question_id TEXT NOT NULL REFERENCES questions(id),
    user_answer TEXT,
    is_correct INTEGER,
    answered_at INTEGER NOT NULL,
    time_spent_seconds INTEGER,
    hint_used INTEGER NOT NULL DEFAULT 0,
    solve_used INTEGER NOT NULL DEFAULT 0
  );
`)

// Add new columns to existing tables (safe to run multiple times)
const alterStatements = [
  `ALTER TABLE sessions ADD COLUMN profile_id TEXT REFERENCES profiles(id)`,
  `ALTER TABLE questions ADD COLUMN hint TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE answers ADD COLUMN hint_used INTEGER NOT NULL DEFAULT 0`,
  `ALTER TABLE answers ADD COLUMN solve_used INTEGER NOT NULL DEFAULT 0`,
]
for (const stmt of alterStatements) {
  try { sqlite.exec(stmt) } catch { /* column already exists */ }
}

export { sqlite }
