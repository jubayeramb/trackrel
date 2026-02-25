import { relations } from "drizzle-orm";
import {
  users,
  sessions,
  accounts,
  monitors,
  checkLogs,
} from "./schema.js";

// ── User Relations ────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  monitors: many(monitors),
}));

// ── Session Relations ─────────────────────────────────────────────────────

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

// ── Account Relations ─────────────────────────────────────────────────────

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

// ── Monitor Relations ─────────────────────────────────────────────────────

export const monitorsRelations = relations(monitors, ({ one, many }) => ({
  user: one(users, {
    fields: [monitors.userId],
    references: [users.id],
  }),
  checkLogs: many(checkLogs),
}));

// ── Check Log Relations ───────────────────────────────────────────────────

export const checkLogsRelations = relations(checkLogs, ({ one }) => ({
  monitor: one(monitors, {
    fields: [checkLogs.monitorId],
    references: [monitors.id],
  }),
}));
