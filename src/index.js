import 'dotenv/config';
import express from 'express';
import pinoHttp from 'pino-http';
import rateLimit from 'express-rate-limit';
import routes from './api/routes.js';
import { renderProm } from './utils/metrics.js';


const app = express();
app.use(express.json());
app.use(pinoHttp());


const limiter = rateLimit({ windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS||60000), max: Number(process.env.RATE_LIMIT_MAX||120) });
app.use(limiter);


app.get('/metrics', (_req,res)=>{ res.type('text/plain').send(renderProm()); });
app.use('/api', routes);


const port = Number(process.env.PORT||3000);
app.listen(port, ()=> console.log('server started', { port }));
