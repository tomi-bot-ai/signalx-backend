import 'dotenv/config';
import { FX_10, GOLD_CROSSES, INDICES } from '../config/symbols.js';
import { generateAISignal } from '../logic/generateSignal.js';
import { insertSignal } from '../services/db.js';
import { log } from '../utils/logger.js';
import { inc } from '../utils/metrics.js';


const symbols = [...FX_10, ...GOLD_CROSSES, ...INDICES.map(i=>i.alias)];


(async function(){
for(const s of symbols){
try {
const sig = await generateAISignal(s,'15m');
if(!sig){ log.warn({ s }, 'no-signal'); continue; }
const id = await insertSignal(sig); inc('signals_created',1);
log.info({ id, s, dir: sig.direction }, 'signal created');
} catch(e){ log.error({ s, err: e.message }, 'ai error'); }
}
})();
