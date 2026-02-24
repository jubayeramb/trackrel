# AGENTS.md

> **SYSTEM CONTEXT FOR AI AGENTS**
> This document serves as the **Master Instruction Set** for all AI agents contributing to `trackrel`. You must strictly adhere to the technology stack, architectural patterns, and coding standards defined below. Do not introduce new frameworks or deviate from the "Micro-SaaS" philosophy without explicit user approval.

---

## 1. Project Overview

**Name:** Trackrel
**Type:** Micro-SaaS / B2B & B2C Tool
**Core Value Proposition:** A website change detection service that alerts users when specific content on a webpage changes (e.g., price drops, text updates, status changes).
**Key Differentiator:** "Frictionless Onboarding" using an AI-powered CSS Selector generator (Gemini 1.5 Flash) to abstract the DOM complexity for non-technical users, with a fallback to a Browser Extension for power users.

---

## 2. Tech Stack & Architecture (Strict)

### Monorepo Structure

- **Manager:** `pnpm` (Workspaces enabled)
- **Build System:** `turborepo`
- **Local Runtime:** `bun` (Use for scripts, dev server, and fast package installation)
- **Production Runtime:** `Node.js 20+` (Required for stable worker execution in Docker)

### Core Technologies

- **Frontend:** Next.js 16 (App Router, React Server Components)
- **Backend Worker:** Node.js (TypeScript)
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM (with `drizzle-kit` for migrations)
- **Queue System:** BullMQ (Redis required) — _Critical for managing scrape jobs._
- **Scraping Engine:**
  - `LightPanda` (A Zig-based true headless browser, running as a standalone CDP server. Highly memory efficient).
  - `playwright-core` (Used to connect to LightPanda via Chrome DevTools Protocol. Do NOT use the standard `playwright` package to avoid downloading Chromium binaries).
  - `Cheerio` (HTML parsing & sanitization).
- **AI Integration:** Google Gemini 1.5 Flash (via Vercel AI SDK or Google Generative AI SDK)
- **Styling:** Tailwind CSS + Shadcn/UI
- **Validation:** Zod

### Infrastructure (Hybrid Model - Optimized for Cost)

- **Frontend:** Deployed to **Cloudflare Pages** (Static/Edge).
- **Database:** **Neon.tech** or **Supabase** (Managed Postgres).
- **Worker Node:** Docker container deployed on a cheap **VPS** (DigitalOcean/Hetzner/Hostinger).
  - _Constraint:_ The worker handles all heavy lifting (LightPanda/Redis). The frontend serves only UI and API proxying.

---

## 3. Directory Structure (Monorepo)

```text
/
├── apps/
│   ├── web/                 # Next.js App Router (Dashboard + Marketing)
│   └── scraper/             # Node.js + BullMQ + Playwright-Core connecting to LightPanda
├── packages/
│   ├── db/                  # Drizzle ORM schema & connection logic (Shared)
│   ├── ui/                  # Shared UI components (Shadcn)
│   ├── config/              # Shared TSConfig, ESLint, Tailwind config
│   └── logger/              # Shared structured logging
├── tools/                   # Browser Extension (Chrome/Manifest V3)
├── docker-compose.yml       # Local dev: Redis, Postgres, LightPanda Image
└── package.json             # pnpm workspace root
```

---

## 4. Feature Specifications & Implementation Rules

### A. The "Smart Selector" (AI Agent Task)

**Objective:** Allow users to type "Track the price" instead of finding `.product-price`.
**Implementation Flow:**

1.  **Input:** User provides URL + Prompt (e.g., "Price").
2.  **Fetch:** `scraper` fetches HTML via LightPanda.
3.  **Sanitize:** Use `Cheerio` to strip `<script>`, `<style>`, `<svg>`, `<img>`, and comments to reduce token count.
4.  **AI Request:** Send sanitized HTML to **Gemini 1.5 Flash**.
    - _System Prompt:_ "Return a JSON object `{ selector: string }` representing the most stable unique CSS selector for the user's goal."
5.  **Verify:** Immediate feedback loop—highlight the found text to the user.
6.  **Upsell:** Display: _"Not accurate? Use our Browser Extension for 100% precision."_

### B. The Scraper Worker (Node.js + LightPanda)

**Objective:** Robust, cron-based monitoring with an ultra-low memory footprint.
**Implementation Rules:**

- **Queue:** Use `BullMQ` to schedule checks.
- **Connection Pattern:** Connect to the LightPanda browser using `chromium.connectOverCDP({ endpointURL: 'ws://127.0.0.1:9222' })`.
- **No Visuals:** Do not rely on visual layout features (like screenshots or calculating x/y coordinates). LightPanda does not render layout; it only executes JS and builds the DOM. Use strict CSS selector querying.
- **Logic:**
  1.  Fetch page via LightPanda.
  2.  Extract text using the stored CSS selector.
  3.  Hash the text (SHA-256).
  4.  Compare with `last_hash` in DB.
  5.  If different -> Update DB -> Trigger Notification (Email/Webhook).

### C. Database Schema (Drizzle)

- **Users Table:** Standard auth fields.
- **Monitors Table:**
  - `id`, `user_id`, `url`, `selector`, `name`, `frequency_minutes`
  - `last_check_at`, `last_hash`, `status` (active/paused/failing)
- **CheckLogs Table:** (Timeseries-like data)
  - `monitor_id`, `checked_at`, `response_time_ms`, `status_code`, `detected_text_snapshot`

---

## 5. Development Guidelines for Agents

### 1. Code Generation Rules

- **Strict TypeScript:** No `any`. Use Zod for all API input validation and env variable validation.
- **Functional Style:** Prefer pure functions where possible.
- **Comments:** Explain _why_, not _what_, especially in complex scraping logic.

### 2. Package Management

- Always use `pnpm add <package> --filter <workspace>` to install dependencies.
- Never install global dependencies.

### 3. "Agentic" Workflow Steps

When asking an agent to implement a feature, refer to this sequence:

1.  **Define Schema:** Update `packages/db` first.
2.  **Logic:** Implement the core logic in `apps/scraper` or `packages/shared`.
3.  **UI:** Build the interface in `apps/web`.
4.  **Integration:** Connect UI to logic via Next.js Server Actions (tRPC is optional, Server Actions preferred for simplicity).

### 4. Known Constraints

- **LightPanda Only:** The Next.js app runs on Cloudflare Edge/Serverless. It cannot run long-running processes or Playwright. All scraping **MUST** be offloaded to the `apps/scraper` via the queue.
