import { Worker, Job, UnrecoverableError } from "bullmq";
import { createHash } from "node:crypto";
import { workerConnection } from "./connection.js";
import { SCRAPE_QUEUE_NAME } from "./queue.js";
import { fetchPage, FetchPageError } from "./browser.js";
import { extractText } from "./sanitize.js";
import type { ScrapeJobData, ScrapeJobResult } from "./types.js";

/**
 * Hash text content using SHA-256 for change detection.
 */
function computeHash(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

/**
 * Process a single scrape job:
 * 1. Fetch page HTML via LightPanda CDP
 * 2. Extract text using the stored CSS selector
 * 3. Hash the text (SHA-256)
 * 4. Compare with last known hash
 * 5. Return result with change detection
 */
async function processScrapeJob(
  job: Job<ScrapeJobData, ScrapeJobResult>,
): Promise<ScrapeJobResult> {
  const { url, selector, monitorId } = job.data;

  await job.updateProgress(10);

  const start = Date.now();

  // Fetch rendered HTML via LightPanda CDP connection
  let result;
  try {
    result = await fetchPage(url);
  } catch (err) {
    if (err instanceof FetchPageError && err.reason === "http_error") {
      // Permanent HTTP errors (403, 404) — don't retry
      throw new UnrecoverableError(`HTTP error: ${err.message}`);
    }
    throw err; // Timeouts and network errors will be retried by BullMQ
  }

  await job.updateProgress(50);

  // Extract text using the monitor's CSS selector
  const detectedText = extractText(result.html, selector);
  if (detectedText === null) {
    throw new UnrecoverableError(
      `Selector "${selector}" matched no elements on ${url}`,
    );
  }

  const hash = computeHash(detectedText);
  const responseTimeMs = Date.now() - start;

  await job.updateProgress(90);

  // TODO: Compare with DB last_hash and update — will be wired when DB connection is added
  const changed = false;

  return { detectedText, hash, changed, responseTimeMs };
}

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
