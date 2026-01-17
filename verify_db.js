import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust path to point to the actual DB location
const dbPath = path.join(__dirname, '../../backend/src/features/memory/chat_history.db');
console.log('Checking Database at:', dbPath);

try {
  const db = new Database(dbPath, { readonly: true });
  
  const columns = db.prepare('PRAGMA table_info(messages)').all();
  console.log('Messages Table Columns:', columns.map(c => c.name));
  
  const hasTokens = columns.some(c => c.name === 'tokens');
  console.log('Has tokens column?', hasTokens);
  
  const userVersion = db.prepare('PRAGMA user_version').get().user_version;
  console.log('User Version:', userVersion);

} catch (err) {
  console.error('Error opening DB:', err);
}
