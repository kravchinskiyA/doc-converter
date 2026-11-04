import { z } from 'zod';

export const AppStatusSchema = z.object({
  status: z.enum(['ok', 'degraded', 'maintenance']),
  timestamp: z.string(),
});

export type AppStatus = z.infer<typeof AppStatusSchema>;

