import { z } from 'zod';
export const SignalSchema = z.object({
symbol: z.string(),
direction: z.enum(['LONG','SHORT']),
entry: z.number().positive(),
sl: z.number().positive(),
tp1: z.number().positive(),
tp2: z.number().positive(),
tp3: z.number().positive(),
rr1: z.number().positive(),
rr2: z.number().positive(),
rr3: z.number().positive(),
probability: z.number().min(0).max(100),
model: z.string(),
timeframe: z.string(),
features: z.any().optional()
});
