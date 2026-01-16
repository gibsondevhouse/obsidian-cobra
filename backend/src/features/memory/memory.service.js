import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.join(__dirname, 'chat_history.db');

// Ensure directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS threads (
    id TEXT PRIMARY KEY,
    title TEXT,
    mode TEXT DEFAULT 'chat',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    thread_id TEXT,
    role TEXT,
    content TEXT,
    tokens INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS memory_fragments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT,
    value TEXT,
    type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export const MemoryService = {
  // Thread Management
  createThread: (id, title, mode = 'chat') => {
    const stmt = db.prepare('INSERT INTO threads (id, title, mode) VALUES (?, ?, ?)');
    return stmt.run(id, title, mode);
  },

  getThreads: () => {
    return db.prepare('SELECT * FROM threads ORDER BY updated_at DESC').all();
  },

  getThread: (id) => {
    return db.prepare('SELECT * FROM threads WHERE id = ?').get(id);
  },

  // Message Management
  addMessage: (id, threadId, role, content) => {
    const stmt = db.prepare('INSERT INTO messages (id, thread_id, role, content) VALUES (?, ?, ?, ?)');
    db.prepare('UPDATE threads SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(threadId);
    return stmt.run(id, threadId, role, content);
  },

  getMessages: (threadId) => {
    return db.prepare('SELECT * FROM messages WHERE thread_id = ? ORDER BY created_at ASC').all(threadId);
  },

  // Global Memory/Settings
  setMemory: (key, value, type = 'general') => {
    const stmt = db.prepare('INSERT OR REPLACE INTO memory_fragments (key, value, type) VALUES (?, ?, ?)');
    return stmt.run(key, value, type);
  },

  getMemory: (key) => {
    return db.prepare('SELECT * FROM memory_fragments WHERE key = ?').get(key);
  },

  getAllMemory: () => {
    return db.prepare('SELECT * FROM memory_fragments').all();
  }
};
