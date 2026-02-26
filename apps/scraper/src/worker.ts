import { Worker, Job, UnrecoverableError } from "bullmq";
import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { monitors, checkLogs } from "@trackrel/db";
import { workerConnection } from "./connection.js";
import { SCRAPE_QUEUE_NAME } from "./queue.js";
import { fetchPage, FetchPageError } from "./browser.js";
import { extractText } from "./sanitize.js";
import { db } from "./db.js";
import type { ScrapeJobData, ScrapeJobResult } from "./types.js";

// ── Constants ─────────────────────────────────────────────────────────────

/** After this many consecutive failed jobs, mark the monitor as "failing". */
const FAIL_THRESHOLD = 3;

// ── Helpers ───────────────────────────────────────────────────────────────

/** Hash text content using SHA-256 for change detection. */
function computeHash(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

// ── Job Processor ─────────────────────────────────────────────────────────

/**
 * Process a single scrape job:
 * 1. Fetch page HTML via LightPanda CDP
 * 2. Extract text using the stored CSS selector
 * 3. Hash the text (SHA-256)
 * 4. Compare with last known hash in DB
 * 5. Persist check_log and update monitor state
 */
async function processScrapeJob(
  job: Job<ScrapeJobData, ScrapeJobResult>,
): Promise<ScrapeJobResult> {
  const { url, selector, monitorId } = job.data;

  await job.updateProgress(10);

  const start = Date.now();

  // ── 1. Fetch rendered HTML via LightPanda CDP ───────────────────────
  let fetchResult;
  try {
    fetchResult = await fetchPage(url);
  } catch (err) {
    if (err instanceof FetchPageError && err.reason === "http_error") {
      // Permanent HTTP errors (403, 404) — don't retry
      await recordFailure(monitorId, Date.now() - start, (err as FetchPageError).statusCode ?? null);
      throw new UnrecoverableError(`HTTP error: ${err.message}`);
    }
    // Timeouts and network errors — record failure but let BullMQ retry
    if (job.attemptsMade + 1 >= (job.opts.attempts ?? 3)) {
      await recordFailure(monitorId, Date.now() - start, null);
    }
    throw err;
  }

  await job.updateProgress(50);

  // ── 2. Extract text using the CSS selector ──────────────────────────
  const detectedText = extractText(fetchResult.html, selector);
  if (detectedText === null) {
    await recordFailure(monitorId, Date.now() - start, fetchResult.statusCode);
    throw new UnrecoverableError(
      `Selector "${selector}" matched no elements on ${url}`,
    );
  }

  // ── 3. Hash and compare ─────────────────────────────────────────────
  const hash = computeHash(detectedText);
  const responseTimeMs = Date.now() - start;

  await job.updateProgress(90);

  const [monitor] = await db
    .select({ lastHash: monitors.lastHash })
    .from(monitors)
    .where(eq(monitors.id, monitorId));

  const changed = monitor !== undefined && monitor.lastHash !== null && monitor.lastHash !== hash;

  // ── 4. Persist results ──────────────────────────────────────────────

  await db.insert(checkLogs).values({
    monitorId,
    responseTimeMs,
    statusCode: fetchResult.statusCode,
    detectedTextSnapshot: detectedText,
  });

  // Success resets "failing" state back to "active"
  await db
    .update(monitors)
    .set({
      lastCheckAt: new Date(),
      lastHash: hash,
      status: "active",
    })
    .where(eq(monitors.id, monitorId));

  return { detectedText, hash, changed, responseTimeMs };
}

// ── Failure Recording ─────────────────────────────────────────────────────

/**
 * Record a failed check in the DB and potentially mark the monitor as failing.
 * Called on unrecoverable errors or when all retry attempts are exhausted.
 */
async function recordFailure(
  monitorId: string,
  responseTimeMs: number,
  statusCode: number | null,
): Promise<void> {
  await db.insert(checkLogs).values({
    monitorId,
    responseTimeMs,
    statusCode,
    detectedTextSnapshot: null,
  });

  await db
    .update(monitors)
    .set({ lastCheckAt: new Date() })
    .where(eq(monitors.id, monitorId));

  // Mark monitor as "failing" after N consecutive failures
  const recentLogs = await db
    .select({ statusCode: checkLogs.statusCode, detectedTextSnapshot: checkLogs.detectedTextSnapshot })
    .from(checkLogs)
    .where(eq(checkLogs.monitorId, monitorId))
    .orderBy(checkLogs.checkedAt)
    .limit(FAIL_THRESHOLD);

  const allFailed = recentLogs.length >= FAIL_THRESHOLD &&
    recentLogs.every((log) => log.detectedTextSnapshot === null);

  if (allFailed) {
    await db
      .update(monitors)
      .set({ status: "failing" })
      .where(eq(monitors.id, monitorId));
  }
}

// ── Worker Instance ───────────────────────────────────────────────────────

export const scrapeWorker = new Worker<ScrapeJobData, ScrapeJobResult>(
  SCRAPE_QUEUE_NAME,
  processScrapeJob,
  {
    connection: workerConnection,
    concurrency: 5,
  },
);

scrapeWorker.on("completed", (job, result) => {
  console.log(
    `[${job.id}] monitor=${job.data.monitorId} changed=${result.changed} time=${result.responseTimeMs}ms`,
  );
});

scrapeWorker.on("failed", (job, err) => {
  console.error(
    `[${job?.id}] failed attempt=${job?.attemptsMade}`,
    err.message,
  );
});

scrapeWorker.on("stalled", (jobId) => {
  console.warn(`Job ${jobId} stalled — will be retried`);
});

scrapeWorker.on("error", (err) => {
  console.error("Worker connection error:", err);
});
