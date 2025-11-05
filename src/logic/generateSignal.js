import 'dotenv/config';
import OpenAI from 'openai';
import { latestBars } from '../services/db.js';
import { SignalSchema } from '../schemas/signal.js';
import { log } from '../utils/logger.js';


const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';


function rrTargets(entry, sl, dir, multipliers){
const risk = Math.abs(entry - sl);
return multipliers.map(m => dir==='LONG' ? entry + m*risk : entry - m*risk);
}


function sanity(symbol, last, s){
const risk = Math.abs(s.entry - s.sl);
if (risk <= 0 || !isFinite(risk)) throw new Error('invalid risk');
if (Math.abs(s.entry - last) / Math.max(1,last) > 0.02) throw new Error('entry too far from market');
if (s.probability < Number(process.env.MIN_PROBABILITY||60)) throw new Error('low probability');
}


export async function generateAISignal(symbol, timeframe='15m'){
const bars = await latestBars(symbol, Number(process.env.MAX_BARS||180), timeframe);
if (bars.length < 40) return null;
const last = bars.at(-1).close;


const sys = `You generate forex/indices trade signals. Reply JSON only with keys: direction(LONG|SHORT), entry, sl, probability.
Rules: conservative entries near last price, SL logical beyond swing, RR baseline 1:1, probability in 60-85.`;
const usr = { symbol, timeframe, last, ohlcv: bars.map(b=>({t:b.ts,o:b.open,h:b.high,l:b.low,c:b.close,v:b.volume})) };


const resp = await client.chat.completions.create({
model: MODEL, temperature: 0.2, response_format: { type: 'json_object' },
messages: [ {role:'system', content: sys}, {role:'user', content: JSON.stringify(usr)} ]
});


let raw; try { raw = JSON.parse(resp.choices[0].message.content); } catch { return null; }
const dir = raw.direction;
if (!['LONG','SHORT'].includes(dir)) return null;
const multipliers = (process.env.RR_MULTIPLIERS||'1,1,1').split(',').map(Number);
const [tp1,tp2,tp3] = rrTargets(raw.entry, raw.sl, dir, multipliers);


const candidate = {
symbol, direction: dir, entry: +raw.entry, sl: +raw.sl,
tp1, tp2, tp3, rr1:multipliers[0], rr2:multipliers[1], rr3:multipliers[2],
probability: +raw.probability||60, model: MODEL, timeframe,
features: { last }
};
sanity(symbol, last, candidate);
return SignalSchema.parse(candidate);
}
