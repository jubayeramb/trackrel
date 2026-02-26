import { eq, and, or, lt, isNull, sql } from "drizzle-orm";
import { monitors } from "@trackrel/db";
import { scrapeQueue } from "./queue.js";
import { db } from "./db.js";
import type { ScrapeJobData } from "./types.js";

// ── Constants ─────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 30_000;

// ── Scheduler ─────────────────────────────────────────────────────────────

let timer: ReturnType<typeof setInterval> | null = null;

/**
 * Query for active monitors that are due for a check and enqueue a
 * scrape job for each one. Uses BullMQ job IDs keyed on monitorId
 * to prevent duplicate enqueues for the same monitor.
 */
async function pollAndEnqueue(): Promise<void> {
  const now = new Date();

  const dueMonitors = await db
    .select({
      id: monitors.id,
      url: monitors.url,
      selector: monitors.selector,
      userId: monitors.userId,
    })
    .from(monitors)
    .where(
      and(
        eq(monitors.status, "active"),
        or(
          isNull(monitors.lastCheckAt),
          lt(
            monitors.lastCheckAt,
            sql`${now} - (${monitors.frequencyMinutes} || ' minutes')::interval`,
          ),
        ),
      ),
    );

  if (dueMonitors.length === 0) return;

  const jobs = dueMonitors.map((m) => ({
    name: `scrape:${m.id}`,
    data: {
      monitorId: m.id,
      url: m.url,
      selector: m.selector,
      userId: m.userId,
    } satisfies ScrapeJobData,
    opts: {
      // Dedup: if a job for this monitor is already queued/active, skip it
      jobId: `monitor:${m.id}`,
    },
  }));

  await scrapeQueue.addBulk(jobs);

  console.log(`Scheduler: enqueued ${jobs.length} job(s)`);
}

export function startScheduler(): void {
  // Run immediately on startup, then on interval
  pollAndEnqueue().catch((err) => {
    console.error("Scheduler poll error:", err);
  });

  timer = setInterval(() => {
    pollAndEnqueue().catch((err) => {
      console.error("Scheduler poll error:", err);
    });
  }, POLL_INTERVAL_MS);
}

export async function stopScheduler(): Promise<void> {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  await scrapeQueue.close();
}
