import { SQLiteDatabase } from "expo-sqlite";

// Runs once when the app opens. Creates the tables if they don't exist yet.
export async function initDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL DEFAULT 'task',
      repeat TEXT NOT NULL DEFAULT 'daily',
      duration INTEGER NOT NULL DEFAULT 0,
      steps TEXT NOT NULL DEFAULT '[]',
      color TEXT NOT NULL DEFAULT 'peach',
      position INTEGER NOT NULL DEFAULT 0,
      done_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);
}
