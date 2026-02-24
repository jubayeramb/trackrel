import * as cheerio from "cheerio";

/**
 * Sanitize raw HTML for processing.
 *
 * Strips non-content elements to reduce noise and token count
 * when sending to AI selector generation (Gemini 1.5 Flash).
 *
 * Removes: script, style, svg, img, noscript, link, meta, and HTML comments.
 */
export function sanitizeHtml(rawHtml: string): string {
  const $ = cheerio.load(rawHtml);

  // Remove non-content elements that add noise
  $("script").remove();
  $("style").remove();
  $("svg").remove();
  $("img").remove();
  $("noscript").remove();
  $("link").remove();
  $("meta").remove();

  // Remove HTML comments
  $("*")
    .contents()
    .filter(function () {
      return this.type === "comment";
    })
    .remove();

  return $.html();
}

/**
 * Extract text content from HTML using a CSS selector.
 * Returns null if the selector matches no elements.
 */
export function extractText(html: string, selector: string): string | null {
  const $ = cheerio.load(html);
  const element = $(selector);

  if (element.length === 0) {
    return null;
  }

  return element.text().trim();
}
