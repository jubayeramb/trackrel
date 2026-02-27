# Trackrel

Website change detection as a service. Monitor any webpage for changes and get notified instantly.

## Architecture

```
apps/
  web/          → Next.js 16 (App Router, RSC) — landing page & dashboard
  scraper/      → Node.js worker — BullMQ queue + playwright-core → LightPanda CDP
packages/
  db/           → Drizzle ORM schema, relations, migrations (PostgreSQL)
  ui/           → Shared shadcn/UI component library
  logger/       → Structured logging
  config/
    tsconfig/   → Shared TypeScript configs
tools/          → Browser extension (Chrome Manifest V3)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, App Router, RSC, Tailwind CSS v4, shadcn/UI |
| Worker | Node.js, BullMQ, playwright-core, Cheerio |
| Database | PostgreSQL via Drizzle ORM |
| Queue | BullMQ + Redis |
| Scraping | LightPanda (headless browser via CDP) |
| AI | Gemini 1.5 Flash (CSS selector generation) |
| Validation | Zod |
| Monorepo | pnpm workspaces + Turborepo |

## Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 10 (`corepack enable && corepack prepare pnpm@latest --activate`)
- **Docker** (for local Postgres, Redis, LightPanda)

## Getting Started

```bash
# Clone and install
git clone <repo-url> && cd trackrel
pnpm install

# Start local infrastructure
docker compose up -d    # Postgres :5432, Redis :6379, LightPanda :9222

# Configure environment
cp .env.example .env

# Run all dev servers
pnpm dev
```

The web app runs at `http://localhost:3000`.

## Commands

### Monorepo

```bash
pnpm dev              # Start all dev servers
pnpm build            # Build all workspaces
pnpm check-types      # Type-check all workspaces
pnpm lint             # Lint all workspaces
pnpm test             # Run tests
pnpm clean            # Remove build artifacts
```

### Per-Workspace

```bash
pnpm --filter @trackrel/web dev
pnpm --filter @trackrel/scraper build
pnpm --filter @trackrel/db db:generate
pnpm --filter @trackrel/db db:migrate
pnpm --filter @trackrel/db db:studio
```

### Adding shadcn Components

```bash
# Always run from apps/web — CLI auto-routes primitives to packages/ui
cd apps/web && pnpm dlx shadcn@latest add <component-name> --yes
```

Then export from the barrel file:

```typescript
// packages/ui/src/index.ts
export * from "./components/<component-name>";
```

## Environment Variables

| Variable | Description | Default |
|----------|------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/trackrel` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `LIGHTPANDA_URL` | LightPanda CDP WebSocket URL | `ws://localhost:9222` |

## Project Structure

- **`apps/web`** — Next.js frontend deployed to Cloudflare Pages. Contains the landing page, dashboard, and server actions.
- **`apps/scraper`** — Standalone Node.js worker that processes BullMQ jobs. Connects to LightPanda via CDP to fetch pages, diffs content, and triggers notifications. Runs on a VPS via Docker.
- **`packages/db`** — Drizzle ORM schema shared between web and scraper. Manages migrations via drizzle-kit.
- **`packages/ui`** — Source-only shadcn/UI components. No build step — Next.js compiles them via Turbopack.
- **`packages/logger`** — Shared structured logging utility.
- **`tools/`** — Chrome extension for one-click monitor setup.

## License

MIT
