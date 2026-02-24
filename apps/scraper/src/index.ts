import { scrapeWorker } from "./worker.js";
import { workerConnection, queueConnection } from "./connection.js";

async function main(): Promise<void> {
  console.log("Scraper worker started");
}

async function gracefulShutdown(signal: string): Promise<void> {
  console.log(`Received ${signal}, shutting down...`);

  // Stop accepting new jobs — waits for active jobs to finish
  await scrapeWorker.close();

  // Close Redis connections
  await workerConnection.quit();
  await queueConnection.quit();

  console.log("Shutdown complete");
  process.exit(0);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  gracefulShutdown("uncaughtException").catch(() => process.exit(1));
});

main().catch((err) => {
  console.error("Failed to start worker:", err);
  process.exit(1);
});
