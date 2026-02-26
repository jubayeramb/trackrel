# AGENTS.md

> System context for AI agents working on **Trackrel** — a website change detection Micro-SaaS.
> Strictly follow the stack, patterns, and conventions below. Do not introduce new frameworks without explicit approval.

## 1. Quick Reference — Commands

### Monorepo (pnpm + Turborepo)

```bash
pnpm install                  # Install all workspace dependencies
pnpm build                    # Build all workspaces (dependency-ordered via turbo)
pnpm dev                      # Start all dev servers (persistent, non-cached)
pnpm check-types              # Type-check all workspaces
pnpm lint                     # Lint all workspaces (placeholder — not yet configured)
pnpm test                     # Run tests across all workspaces (no test framework yet)
pnpm clean                    # Remove all build artifacts
```

### Per-Workspace

```bash
pnpm --filter @trackrel/scraper build        # tsc → dist/
pnpm --filter @trackrel/scraper dev          # node --watch dist/index.js
pnpm --filter @trackrel/scraper check-types  # tsc --noEmit
pnpm --filter @trackrel/web build            # next build
pnpm --filter @trackrel/web check-types      # tsc --noEmit
pnpm --filter @trackrel/db build             # tsc → dist/
```

### Database (Drizzle — run from packages/db)

```bash
pnpm --filter @trackrel/db drizzle-kit generate   # Generate migration from schema changes
pnpm --filter @trackrel/db drizzle-kit migrate     # Apply pending migrations
pnpm --filter @trackrel/db drizzle-kit studio      # Open Drizzle Studio GUI
```

### Local Infrastructure

```bash
docker compose up -d           # Start Postgres (5432), Redis (6379), LightPanda (9222)
cp .env.example .env           # Create local env file (DATABASE_URL, REDIS_HOST, LIGHTPANDA_URL)
```

### Package Management

```bash
pnpm add <pkg> --filter <workspace>   # e.g. pnpm add zod --filter @trackrel/scraper
# NEVER install globally. NEVER use npm/yarn.
```

### Shadcn UI Components

```bash
# Add a component (ALWAYS run from apps/web, not packages/ui)
cd apps/web && pnpm dlx shadcn@latest add <component-name>
# CLI auto-routes: UI primitives → packages/ui, app blocks → apps/web/components
```

After adding a component, export it from the barrel file:

```typescript
// packages/ui/src/index.ts
export * from "./components/<component-name>";
```

Import in app code:

```typescript
import { Button } from "@trackrel/ui";
// or deep import:
import { Button } from "@trackrel/ui/components/button";
```

## 2. Architecture & Directory Structure

```text
apps/
  web/                   @trackrel/web       — Next.js 16 (App Router, RSC). Cloudflare Edge deploy.
  scraper/               @trackrel/scraper   — Node.js worker. BullMQ + playwright-core → LightPanda CDP.
packages/
  db/                    @trackrel/db        — Drizzle ORM schema, relations, migrations. Shared.
  ui/                    @trackrel/ui        — Shadcn/UI components. Shared.
  logger/                @trackrel/logger    — Structured logging. Shared.
  config/tsconfig/       @trackrel/tsconfig  — Shared base, node, nextjs TS configs.
tools/                   Browser Extension (Chrome Manifest V3)
```

**Key constraints:**
- All scraping runs in `apps/scraper` via BullMQ queue. The Next.js app CANNOT run Playwright.
- Use `playwright-core` (not `playwright`) to connect to LightPanda via CDP. No Chromium downloads.
- LightPanda has no layout rendering — no screenshots, no coordinates. CSS selector queries only.

## 3. Code Style

### TypeScript Configuration

- **Strict mode** enabled: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`
- **Target:** ES2022
- **Module:** `NodeNext` for Node packages, `esnext` (bundler resolution) for Next.js/UI
- **All packages are ESM** (`"type": "module"` in package.json)

### Imports

```typescript
// 1. External packages — named imports preferred; namespace when library expects it
import { Worker, Job, UnrecoverableError } from "bullmq";
import * as cheerio from "cheerio";
// Zod — ALWAYS use namespace import
import * as z from "zod";
// 2. Node built-ins with node: prefix
import { createHash } from "node:crypto";
// 3. Local imports — MUST use .js extension (ESM requirement)
import { env } from "./config.js";
// 4. Type-only imports — use `import type`
import type { ScrapeJobData } from "./types.js";
```

### Naming Conventions

| What | Convention | Example |
|------|-----------|---------|
| Files | kebab-case | `browser.ts`, `drizzle.config.ts` |
| Variables, functions | camelCase | `fetchPage`, `workerConnection` |
| Classes, interfaces, types | PascalCase | `FetchPageError`, `ScrapeJobData` |
| Constants | SCREAMING_SNAKE_CASE | `SCRAPE_QUEUE_NAME`, `NAV_TIMEOUT_MS` |
| DB table variables | camelCase | `checkLogs`, `monitors` |
| DB columns | camelCase → snake_case mapping | `userId` → `user_id` |
| Enums (Drizzle pgEnum) | snake_case values | `"active"`, `"paused"`, `"failing"` |

### Exports

- **Named exports only** — no default exports (exception: Drizzle config's `export default defineConfig`)
- Re-export from `index.ts` barrel files: `export * from "./schema.js";`

### Types & Validation

```typescript
// Interfaces for object shapes; union types for string literal discriminants
export interface ScrapeJobData { monitorId: string; url: string; }
export type FetchPageErrorReason = "timeout" | "network" | "http_error" | "cdp_connection";

// Zod for runtime validation (env vars, API inputs) — parse at startup, fail fast
const envSchema = z.object({ DATABASE_URL: z.string().url() });
export const env = envSchema.parse(process.env);

// Drizzle inferred types for DB rows
export type InsertMonitor = typeof monitors.$inferInsert;
export type SelectMonitor = typeof monitors.$inferSelect;
```

- **No `any`**. No `@ts-ignore`. No `@ts-expect-error`.
- Shared types go in a dedicated `types.ts` file.

### Functions

- `function` declarations for top-level named/exported functions
- Arrow functions for callbacks and event handlers
- `async/await` throughout — no raw Promise chains
- Pure functions where possible (`computeHash`, `sanitizeHtml`, `extractText`)

### Error Handling

```typescript
// Custom Error subclass with typed reason discriminant
export class FetchPageError extends Error {
  public readonly reason: FetchPageErrorReason;
  constructor(message: string, reason: FetchPageErrorReason) {
    super(message); this.name = "FetchPageError"; this.reason = reason;
  }
}

// BullMQ: UnrecoverableError = permanent failure (no retry). Regular throw = retryable.
// Return null for non-fatal "not found" — don't throw.
// Always clean up resources in finally blocks: page.close().catch(() => {})
```

### Comments

- **JSDoc** `/** */` for function-level documentation
- **Section dividers** with Unicode box-drawing: `// ── Error Types ────────`
- Inline comments explain **why**, not what
- No commented-out code

### Drizzle Schema Patterns

```typescript
export const monitorStatusEnum = pgEnum("monitor_status", ["active", "paused", "failing"]);
export const monitors = pgTable("monitors", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
}, (table) => [index("monitors_user_id_idx").on(table.userId)]);
```

## 4. Implementation Workflow

When implementing a feature, follow this order:

1. **Schema** — Update `packages/db/src/schema.ts` + relations + generate migration
2. **Logic** — Implement in `apps/scraper` (worker logic) or shared packages
3. **UI** — Build in `apps/web` using Server Actions (preferred over tRPC)
4. **Verify** — `pnpm check-types` must pass. Run `pnpm build` before marking complete.

## 5. Tech Stack (Do Not Deviate)

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Next.js 16, App Router, RSC | Cloudflare Pages deploy |
| Styling | Tailwind CSS + Shadcn/UI | |
| Backend Worker | Node.js + TypeScript | Docker on VPS |
| Database | PostgreSQL (Neon/Supabase) | |
| ORM | Drizzle ORM + drizzle-kit | |
| Queue | BullMQ + ioredis | Redis required |
| Scraping | playwright-core → LightPanda CDP | `chromium.connectOverCDP()` |
| HTML parsing | Cheerio | Sanitize before AI calls |
| AI | Gemini 1.5 Flash | CSS selector generation |
| Validation | Zod | All inputs + env vars |
| Monorepo | pnpm workspaces + Turborepo | |
