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

  updateThreadTitle: (id, title) => {
    const cleanTitle = title.replace(/^"|"$/g, '').trim();
    const stmt = db.prepare('UPDATE threads SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    return stmt.run(cleanTitle, id);
  },

  getThreads: () => {
    return db.prepare('SELECT * FROM threads ORDER BY updated_at DESC').all();
  },

  getThread: (id) => {
    return db.prepare('SELECT * FROM threads WHERE id = ?').get(id);
  },

  // Message Management
  addMessage: (id, threadId, role, content, tokens = 0) => {
    const stmt = db.prepare('INSERT INTO messages (id, thread_id, role, content, tokens) VALUES (?, ?, ?, ?, ?)');
    db.prepare('UPDATE threads SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(threadId);
    return stmt.run(id, threadId, role, content, tokens);
  },

  getMessages: (threadId, charLimit = 15000) => {
    // 1. Fetch latest messages first (DESC) so we prioritize recent context
    // We fetch a reasonably large batch (e.g. 100) to ensure we have enough candidates
    const rawMessages = db.prepare('SELECT * FROM messages WHERE thread_id = ? ORDER BY created_at DESC LIMIT 100').all(threadId);
    
    // 2. Accumulate messages until we hit the character budget
    const selectedMessages = [];
    let currentChars = 0;

    for (const msg of rawMessages) {
      const msgLen = (msg.content || '').length;
      if (currentChars + msgLen > charLimit) {
        break; // Context window full
      }
      selectedMessages.push(msg);
      currentChars += msgLen;
    }

    // 3. Reverse back to chronological order (ASC) for the LLM
    return selectedMessages.reverse();
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
