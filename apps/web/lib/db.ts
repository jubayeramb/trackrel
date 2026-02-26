import { createDb } from "@trackrel/db/client";

/** Singleton Drizzle instance for the web app. */
export const db = createDb(process.env["DATABASE_URL"]!);
