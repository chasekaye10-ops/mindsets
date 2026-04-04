import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync('mentalworkout.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK(type IN ('focus', 'boredom', 'breathing', 'walk')),
      duration_seconds INTEGER NOT NULL,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      completed_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      scheduled_start TEXT NOT NULL,
      scheduled_end TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS user_profile (
      id INTEGER PRIMARY KEY CHECK(id = 1),
      baseline_focus_seconds INTEGER DEFAULT 300,
      current_focus_level INTEGER DEFAULT 300,
      current_boredom_level INTEGER DEFAULT 120,
      mental_fitness_score INTEGER DEFAULT 0,
      streak_count INTEGER DEFAULT 0,
      trial_start_date TEXT,
      is_premium INTEGER DEFAULT 0
    );

    INSERT OR IGNORE INTO user_profile (id, trial_start_date) VALUES (1, datetime('now'));
  `);

  return db;
}

export async function saveSession(
  type: 'focus' | 'boredom' | 'breathing' | 'walk',
  durationSeconds: number,
  rating: number
) {
  const database = await getDB();
  await database.runAsync(
    'INSERT INTO sessions (type, duration_seconds, rating) VALUES (?, ?, ?)',
    [type, durationSeconds, rating]
  );
}

export async function getRecentSessions(type: string, limit: number = 5) {
  const database = await getDB();
  return database.getAllAsync<{
    id: number;
    type: string;
    duration_seconds: number;
    rating: number;
    completed_at: string;
  }>(
    'SELECT * FROM sessions WHERE type = ? ORDER BY completed_at DESC LIMIT ?',
    [type, limit]
  );
}
