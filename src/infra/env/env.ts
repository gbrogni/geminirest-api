import { z } from 'zod';

export const envSchema = z.object({
  GEMINI_API_KEY: z.string(),
  GEMINI_PRO_VISION_MODEL: z.string().default('gemini-pro-vision'),
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3333),
});

export type Env = z.infer<typeof envSchema>;