import { Queue } from "bullmq";
import { queueConnection } from "./connection.js";
import type { ScrapeJobData, ScrapeJobResult } from "./types.js";

export const SCRAPE_QUEUE_NAME = "scrape";

export const scrapeQueue = new Queue<ScrapeJobData, ScrapeJobResult>(
  SCRAPE_QUEUE_NAME,
  {
    connection: queueConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5_000,
      },
      removeOnComplete: { count: 500 },
      removeOnFail: { count: 1_000 },
    },
  },
);
