import {
  pgTable,
  pgEnum,
  uuid,
  text,
  varchar,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

// ── Enums ──────────────────────────────────────────────────────────────────

export const monitorStatusEnum = pgEnum("monitor_status", [
  "active",
  "paused",
  "failing",
]);

// ── Users ──────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ── Monitors ───────────────────────────────────────────────────────────────

export const monitors = pgTable(
  "monitors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    selector: text("selector").notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    frequencyMinutes: integer("frequency_minutes").notNull().default(60),
    lastCheckAt: timestamp("last_check_at", { withTimezone: true }),
    lastHash: text("last_hash"),
    status: monitorStatusEnum("status").notNull().default("active"),
  },
  (table) => [index("monitors_user_id_idx").on(table.userId)],
);

// ── Check Logs ─────────────────────────────────────────────────────────────

export const checkLogs = pgTable(
  "check_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    monitorId: uuid("monitor_id")
      .notNull()
      .references(() => monitors.id, { onDelete: "cascade" }),
    checkedAt: timestamp("checked_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    responseTimeMs: integer("response_time_ms"),
    statusCode: integer("status_code"),
    detectedTextSnapshot: text("detected_text_snapshot"),
  },
  (table) => [
    index("check_logs_monitor_id_idx").on(table.monitorId),
    index("check_logs_checked_at_idx").on(table.checkedAt),
  ],
);

// ── Inferred Types ─────────────────────────────────────────────────────────

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export type InsertMonitor = typeof monitors.$inferInsert;
export type SelectMonitor = typeof monitors.$inferSelect;

export type InsertCheckLog = typeof checkLogs.$inferInsert;
export type SelectCheckLog = typeof checkLogs.$inferSelect;
