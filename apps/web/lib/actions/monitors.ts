"use server";

import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { monitors, checkLogs } from "@trackrel/db";
import type { SelectMonitor, SelectCheckLog } from "@trackrel/db";
import { createMonitorSchema, updateMonitorSchema } from "@trackrel/db/validation";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth-session";
import { ROUTES } from "@/lib/routes";

// ── Types ────────────────────────────────────────────────────────────────

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// ── Create ───────────────────────────────────────────────────────────────

export async function createMonitor(
  input: unknown,
): Promise<ActionResult<SelectMonitor>> {
  const session = await requireSession();

  const parsed = createMonitorSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const [monitor] = await db
    .insert(monitors)
    .values({
      userId: session.user.id,
      url: parsed.data.url,
      selector: parsed.data.selector,
      name: parsed.data.name,
      frequencyMinutes: parsed.data.frequencyMinutes,
    })
    .returning();

  if (!monitor) {
    return { success: false, error: "Failed to create monitor" };
  }

  revalidatePath(ROUTES.dashboard.home);
  revalidatePath(ROUTES.dashboard.monitors.list);

  return { success: true, data: monitor };
}

// ── Read (list) ──────────────────────────────────────────────────────────

export async function getMonitors(): Promise<ActionResult<SelectMonitor[]>> {
  const session = await requireSession();

  const result = await db
    .select()
    .from(monitors)
    .where(eq(monitors.userId, session.user.id))
    .orderBy(desc(monitors.createdAt));

  return { success: true, data: result };
}

// ── Read (single) ────────────────────────────────────────────────────────

export async function getMonitor(
  id: string,
): Promise<ActionResult<SelectMonitor>> {
  const session = await requireSession();

  const [monitor] = await db
    .select()
    .from(monitors)
    .where(and(eq(monitors.id, id), eq(monitors.userId, session.user.id)));

  if (!monitor) {
    return { success: false, error: "Monitor not found" };
  }

  return { success: true, data: monitor };
}

// ── Update ───────────────────────────────────────────────────────────────

export async function updateMonitor(
  id: string,
  input: unknown,
): Promise<ActionResult<SelectMonitor>> {
  const session = await requireSession();

  const parsed = updateMonitorSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const [updated] = await db
    .update(monitors)
    .set(parsed.data)
    .where(and(eq(monitors.id, id), eq(monitors.userId, session.user.id)))
    .returning();

  if (!updated) {
    return { success: false, error: "Monitor not found" };
  }

  revalidatePath(ROUTES.dashboard.home);
  revalidatePath(ROUTES.dashboard.monitors.list);
  revalidatePath(ROUTES.dashboard.monitors.detail(id));

  return { success: true, data: updated };
}

// ── Delete ───────────────────────────────────────────────────────────────

export async function deleteMonitor(
  id: string,
): Promise<ActionResult> {
  const session = await requireSession();

  const [deleted] = await db
    .delete(monitors)
    .where(and(eq(monitors.id, id), eq(monitors.userId, session.user.id)))
    .returning({ id: monitors.id });

  if (!deleted) {
    return { success: false, error: "Monitor not found" };
  }

  revalidatePath(ROUTES.dashboard.home);
  revalidatePath(ROUTES.dashboard.monitors.list);

  return { success: true, data: undefined };
}

// ── Check Logs ───────────────────────────────────────────────────────────

export async function getCheckLogs(
  monitorId: string,
  limit = 50,
): Promise<ActionResult<SelectCheckLog[]>> {
  const session = await requireSession();

  // Verify the monitor belongs to the user
  const [monitor] = await db
    .select({ id: monitors.id })
    .from(monitors)
    .where(and(eq(monitors.id, monitorId), eq(monitors.userId, session.user.id)));

  if (!monitor) {
    return { success: false, error: "Monitor not found" };
  }

  const logs = await db
    .select()
    .from(checkLogs)
    .where(eq(checkLogs.monitorId, monitorId))
    .orderBy(desc(checkLogs.checkedAt))
    .limit(limit);

  return { success: true, data: logs };
}

// ── Dashboard Stats ──────────────────────────────────────────────────────

export interface DashboardStats {
  totalMonitors: number;
  activeMonitors: number;
  pausedMonitors: number;
  failingMonitors: number;
}

export async function getDashboardStats(): Promise<ActionResult<DashboardStats>> {
  const session = await requireSession();

  const userMonitors = await db
    .select()
    .from(monitors)
    .where(eq(monitors.userId, session.user.id));

  const stats: DashboardStats = {
    totalMonitors: userMonitors.length,
    activeMonitors: userMonitors.filter((m) => m.status === "active").length,
    pausedMonitors: userMonitors.filter((m) => m.status === "paused").length,
    failingMonitors: userMonitors.filter((m) => m.status === "failing").length,
  };

  return { success: true, data: stats };
}
