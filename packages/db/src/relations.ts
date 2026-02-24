import { relations } from "drizzle-orm";
import { users, monitors, checkLogs } from "./schema.js";

export const usersRelations = relations(users, ({ many }) => ({
  monitors: many(monitors),
    }));

  export const monitorsRelations = relations(monitors, ({ one, many }) => ({
  user: one(users, {
    fields: [monitors.userId],
    references: [users.id],
  }),
  checkLogs: many(checkLogs),
  }));

    export const checkLogsRelations = relations(checkLogs, ({ one }) => ({
  monitor: one(monitors, {
    fields: [checkLogs.monitorId],
    references: [monitors.id],
  }),
}));
