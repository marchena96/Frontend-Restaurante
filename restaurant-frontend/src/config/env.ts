import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().default('/api'),
  VITE_API_TIMEOUT: z.coerce.number().positive().default(15000),
  VITE_APP_ENV: z
    .enum(['development', 'test', 'staging', 'production'])
    .default('development'),
})

export const env = envSchema.parse(import.meta.env)
