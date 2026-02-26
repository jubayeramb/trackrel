import * as z from "zod";

const envSchema = z.object({
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  DATABASE_URL: z.string().url(),
  LIGHTPANDA_URL: z.string().default("ws://localhost:9222"),
});

// Validate environment variables at startup — fail fast if misconfigured
export const env = envSchema.parse(process.env);
