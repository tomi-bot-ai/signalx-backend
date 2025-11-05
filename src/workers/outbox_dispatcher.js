import { query } from '../services/db.js';
import fetch from 'node-fetch';

async function cycle() {
  const res = await query('select * from outbox where sent = false limit 10');
  const rows = res?.rows ?? res ?? [];

  for (const row of rows) {
    try {
      if (!row.webhook_url) continue;
      await fetch(row.webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(row.payload)
      });
      await query('update outbox set sent = true where id = $1', [row.id]);
      console.log('sent', row.id);
    } catch (err) {
      console.error('send error', err.message);
    }
  }
}

async function loop() {
  while (true) {
    await cycle();
    await new Promise(r => setTimeout(r, 15000));
  }
}

loop();
