import { Worker, Job, UnrecoverableError } from "bullmq";
import { createHash } from "node:crypto";
import { workerConnection } from "./connection.js";
import { SCRAPE_QUEUE_NAME } from "./queue.js";
import type { ScrapeJobData, ScrapeJobResult } from "./types.js";

/**
 * Hash text content using SHA-256 for change detection.
 */
function computeHash(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

/**
 * Process a single scrape job:
 * 1. Fetch page via LightPanda (placeholder — Unit 4 will add fetchPage)
 * 2. Extract text using CSS selector
 * 3. Hash the text
 * 4. Compare with last known hash
 * 5. Return result with change detection
 */
async function processScrapeJob(
  job: Job<ScrapeJobData, ScrapeJobResult>,
): Promise<ScrapeJobResult> {
  const { url, selector, monitorId } = job.data;

  await job.updateProgress(10);

  const start = Date.now();

  // Placeholder — fetchPage will be implemented in Unit 4
  // For now, throw to indicate it's not yet wired up
  const detectedText = `placeholder: ${url} -> ${selector}`;

  const hash = computeHash(detectedText);
  const responseTimeMs = Date.now() - start;

  await job.updateProgress(90);

  // TODO: Compare with DB last_hash and update — will be wired in later units
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
