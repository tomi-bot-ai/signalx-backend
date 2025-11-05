import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { Pool } from 'pg';

const file = process.argv[2];
if (!file) { console.error('Usage: node scripts/run_sql.mjs <file.sql>'); process.exit(1); }

const sql = await readFile(file, 'utf8');

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,   // np. port 5432
  ssl: { rejectUnauthorized: false },              // <-- ważne dla Supabase
  max: 5
});

const client = await pool.connect();
try {
  await client.query(sql);
  console.log('Applied', file);
} finally {
  client.release();
  await pool.end();
}
