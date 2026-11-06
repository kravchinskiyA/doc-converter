import { z } from 'zod';

export * from './auth.js';
export * from './conversion.js';
export * from './account.js';

export const AppStatusSchema = z.object({
  status: z.enum(['ok', 'degraded', 'maintenance']),
  timestamp: z.string(),
});

export type AppStatus = z.infer<typeof AppStatusSchema>;
