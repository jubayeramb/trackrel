import { chromium, errors } from "playwright-core";
import type { Browser, Page } from "playwright-core";
import { env } from "./config.js";

const CONNECT_TIMEOUT_MS = 10_000;
const NAV_TIMEOUT_MS = 30_000;

// ── Error Types ────────────────────────────────────────────────────────────

export type FetchPageErrorReason =
  | "timeout"
  | "network"
  | "http_error"
  | "cdp_connection";

export class FetchPageError extends Error {
  public readonly reason: FetchPageErrorReason;
  public readonly statusCode?: number;

  constructor(
    message: string,
    reason: FetchPageErrorReason,
    statusCode?: number,
  ) {
    super(message);
    this.name = "FetchPageError";
    this.reason = reason;
    this.statusCode = statusCode;
  }
}

// ── Result Type ────────────────────────────────────────────────────────────

export interface FetchPageResult {
  html: string;
  statusCode: number;
  url: string;
}

// ── Core Function ──────────────────────────────────────────────────────────

/**
 * Fetch a page's rendered HTML via LightPanda CDP.
 *
 * LightPanda executes JS and builds the DOM but does NOT render layout —
 * no screenshots, no getBoundingClientRect(), no x/y coordinates.
 * Use CSS selector querying only.
 *
 * After fetching, browser.close() only disconnects Playwright from CDP;
 * the LightPanda process stays alive for the next job.
 */
export async function fetchPage(url: string): Promise<FetchPageResult> {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    // Connect to LightPanda's CDP server
    browser = await chromium.connectOverCDP(env.LIGHTPANDA_URL, {
      timeout: CONNECT_TIMEOUT_MS,
    });

    // Fresh context per job — clean cookies/storage, no state leaks
    const context = await browser.newContext();
    context.setDefaultNavigationTimeout(NAV_TIMEOUT_MS);

    page = await context.newPage();

    // domcontentloaded is optimal for LightPanda — it doesn't render layout
    // so waiting for 'load' (images, fonts) wastes time
    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: NAV_TIMEOUT_MS,
    });

    // page.goto() does NOT throw on HTTP 4xx/5xx — must check manually
    if (response === null) {
      throw new FetchPageError(
        `Navigation returned null response for ${url}`,
        "network",
      );
    }

    const statusCode = response.status();

    if (statusCode === 403) {
      throw new FetchPageError(
        `Access forbidden (403) for ${url}`,
        "http_error",
        403,
      );
    }

    if (statusCode >= 400) {
      throw new FetchPageError(
        `HTTP ${statusCode} error for ${url}`,
        "http_error",
        statusCode,
      );
    }

    const html = await page.content();
    const finalUrl = page.url();

    return { html, statusCode, url: finalUrl };
  } catch (err) {
    if (err instanceof FetchPageError) throw err;

    if (err instanceof errors.TimeoutError) {
      throw new FetchPageError(
        `Timeout fetching ${url}: ${(err as Error).message}`,
        "timeout",
      );
    }

    // CDP connection failure — LightPanda not running, wrong port, etc.
    if (err instanceof Error && err.message.includes("connect")) {
      throw new FetchPageError(
        `CDP connection failed to ${env.LIGHTPANDA_URL}: ${err.message}`,
        "cdp_connection",
      );
    }

    // Network-level errors: ERR_NAME_NOT_RESOLVED, SSL, etc.
    throw new FetchPageError(
      `Network error fetching ${url}: ${(err as Error).message}`,
      "network",
    );
  } finally {
    // Cleanup: page → browser. browser.close() disconnects from CDP,
    // does NOT kill the LightPanda process.
    if (page) {
      await page.close().catch(() => {});
    }
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
