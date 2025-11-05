import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
}

export async function listSignals(limit = 5) {
  const result = await query(
    'SELECT * FROM signals ORDER BY created_at DESC LIMIT $1',
    [limit]
  );
  return result.rows;
}
