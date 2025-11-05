const map = new Map();
for (const pair of (process.env.API_KEYS||'').split('|')){
if(!pair) continue; const [id,secret]=pair.split(':'); if(id&&secret) map.set(secret,id);
}
export function requireKey(role){
return function(req,res,next){
const key = req.headers['x-api-key'] || req.query.key;
const id = key ? map.get(String(key)) : null;
if(!id) return res.status(401).json({ error: 'unauthorized' });
if(role && role!==id) return res.status(403).json({ error: 'forbidden' });
req.apiRole = id; next();
};
}
