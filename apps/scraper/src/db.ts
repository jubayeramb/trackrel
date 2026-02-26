import { createDb } from "@trackrel/db";
import { env } from "./config.js";

/** Shared Drizzle ORM instance for the scraper process. */
export const db = createDb(env.DATABASE_URL);
