import type {
  SelectUser,
  SelectSession,
  SelectMonitor,
  SelectCheckLog,
} from "./schema.js";

// ── DTOs (safe for client exposure) ───────────────────────────────────────

/** User data safe for client — no sensitive fields exposed. */
export type UserDTO = Pick<
  SelectUser,
  "id" | "name" | "email" | "image" | "emailVerified" | "createdAt"
>;

/** Session data safe for client. */
export type SessionDTO = Pick<
  SelectSession,
  "id" | "expiresAt" | "userId" | "createdAt"
>;

/** Full monitor data — no sensitive fields at this level. */
export type MonitorDTO = SelectMonitor;

/** Full check log data. */
export type CheckLogDTO = SelectCheckLog;

// ── Paginated Response ────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
