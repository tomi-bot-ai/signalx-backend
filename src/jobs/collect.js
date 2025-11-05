import 'dotenv/config';
import { FX_10, GOLD_CROSSES, INDICES } from '../config/symbols.js';
import { fetchBatch } from '../services/fmp.js';
import { upsertOHLCV } from '../services/db.js';
import { log } from '../utils/logger.js';
import { inc } from '../utils/metrics.js';


const symbols = [...FX_10, ...GOLD_CROSSES, ...INDICES.map(i=>i.alias)];
const iMap = {}; INDICES.forEach(i=> iMap[i.alias]=i.vendorSymbol);


(async function(){
try {
const rows = await fetchBatch(symbols, iMap);
const n = await upsertOHLCV(rows);
inc('collect_rows', n); log.info({ rows: rows.length, upserted: n }, 'collect done');
process.exit(0);
} catch(e){ log.error({ err: e.message }, 'collect failed'); process.exit(1); }
})();
