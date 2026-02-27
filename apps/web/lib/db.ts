import * as schema from "@trackrel/db";
import type { Database } from "@trackrel/db";

const url = process.env["DATABASE_URL"]!;

/**
 * Drizzle DB instance — auto-selects driver based on DATABASE_URL.
 * - Neon HTTP driver for production (Cloudflare Workers, stateless HTTP)
 * - postgres.js TCP driver for local dev (Docker PostgreSQL)
 */
export const db: Database = await initDb();

async function initDb(): Promise<Database> {
  if (url.includes(".neon.tech")) {
    const { neon } = await import("@neondatabase/serverless");
    const { drizzle } = await import("drizzle-orm/neon-http");
    // neon-http query API is identical to postgres-js — safe to unify under Database type
    return drizzle({ client: neon(url), schema }) as unknown as Database;
  }
  const { createDb } = await import("@trackrel/db/client");
  return createDb(url);
}
