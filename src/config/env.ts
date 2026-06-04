import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url('API_BASE_URL debe ser una URL válida'),
  VITE_API_TIMEOUT: z.string().transform((val) => parseInt(val, 10)).default('10000'),
  VITE_APP_ENV: z.enum(['development', 'production', 'staging']).default('development'),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Valida y expone las variables de entorno de forma type-safe
 */
export const env: EnvConfig = envSchema.parse(import.meta.env);
