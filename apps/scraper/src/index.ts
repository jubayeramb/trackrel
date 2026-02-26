import { scrapeWorker } from "./worker.js";
import { startScheduler, stopScheduler } from "./scheduler.js";
import { workerConnection, queueConnection } from "./connection.js";

async function main(): Promise<void> {
  startScheduler();
  console.log("Scraper started: worker + scheduler running");
}

async function gracefulShutdown(signal: string): Promise<void> {
  console.log(`Received ${signal}, shutting down...`);

  await stopScheduler();
  await scrapeWorker.close();

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
  console.error("Failed to start:", err);
  process.exit(1);
});
