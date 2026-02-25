import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import * as relations from "./relations.js";

/** Create a Drizzle ORM instance connected to PostgreSQL via postgres.js. */
export function createDb(databaseUrl: string) {
  const client = postgres(databaseUrl);
  return drizzle(client, { schema: { ...schema, ...relations } });
}

export type Database = ReturnType<typeof createDb>;
