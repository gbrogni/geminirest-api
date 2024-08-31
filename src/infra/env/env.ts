import { z } from 'zod';

export const envSchema = z.object({
  GEMINI_API_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;