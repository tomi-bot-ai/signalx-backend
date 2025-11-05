import 'dotenv/config';
import axios from 'axios';
import { log } from '../utils/logger.js';


const { FMP_API_KEY, FMP_BASE } = process.env;
const TIMEOUT = Number(process.env.HTTP_TIMEOUT_MS||15000);
const RETRIES = Number(process.env.MAX_HTTP_RETRIES||3);


function buildUrl(symbol, isIndex){
const path = isIndex ? process.env.FMP_IDX_ENDPOINT : process.env.FMP_FX_ENDPOINT;
return `${FMP_BASE}${path}${encodeURIComponent(symbol)}?apikey=${FMP_API_KEY}`;
}


async function get(url){
let lastErr;
for(let i=0;i<RETRIES;i++){
try { return (await axios.get(url,{ timeout: TIMEOUT })).data; }
catch(e){ lastErr=e; await new Promise(r=>setTimeout(r, 500*(i+1))); }
}
throw lastErr;
}


export async function fetch15m(symbol, isIndex=false){
const url = buildUrl(symbol, isIndex);
const data = await get(url);
if(!Array.isArray(data)) return [];
return data.map(d=>({
ts: new Date(d.date).toISOString(),
open: +d.open, high: +d.high, low: +d.low, close: +d.close, volume: +(d.volume??0)
})).sort((a,b)=> new Date(a.ts)-new Date(b.ts));
}


export async function fetchBatch(symbols, indexMap){
const out=[];
for(const s of symbols){
const vendor = indexMap[s] || s; const isIdx = Boolean(indexMap[s]);
try {
const bars = await fetch15m(vendor, isIdx);
for(const b of bars){ out.push({ symbol: s, timeframe:'15m', ...b }); }
} catch(e){ log.error({ s, err: e.message }, 'FMP error'); }
}
return out;
}
