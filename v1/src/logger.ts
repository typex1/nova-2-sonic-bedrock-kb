import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(__dirname, '../logs');
const LOG_FILE = path.join(LOG_DIR, 'nova-2-sonic.log');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

export function logEntry(type: string, sessionId: string, data: Record<string, unknown>): void {
  const line = JSON.stringify({ timestamp: new Date().toISOString(), type, sessionId, ...data }) + '\n';
  fs.appendFile(LOG_FILE, line, (err) => {
    if (err) console.error('Failed to write log:', err);
  });
}
