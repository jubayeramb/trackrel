import { Redis } from "ioredis";
import { env } from "./config.js";

/**
 * Worker connection — maxRetriesPerRequest MUST be null.
 * BullMQ workers use blocking Redis commands (BRPOPLPUSH).
 * If IORedis retries these, the worker breaks.
 */
export const workerConnection = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

/**
 * Queue/producer connection — can fail fast for API callers.
 * Separate from worker connection because they have different retry semantics.
 */
export const queueConnection = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  maxRetriesPerRequest: 20,
});
