# Tech Stack

AgentClinic is a client-side TypeScript application built with React and Vite. The browser renders all UI; a lightweight API server handles data access.

## Core

| Layer | Choice | Rationale |
|---|---|---|
| Language | TypeScript | Type safety end-to-end; satisfies Mary's requirement |
| Runtime | Node.js | Stable, well-supported, vast ecosystem |
| Frontend framework | **React** | Component model maps cleanly to dashboard and list views |
| Routing | **React Router** (`react-router-dom`) | Client-side route matching for nav links and per-id detail pages (agents, ailments); added in the MVP phase since multi-page navigation wasn't possible with a single static `App` |
| Build tool | **Vite** | Fast HMR, TypeScript-native, minimal config |
| API server | **Hono** | Lightweight TypeScript-first server; serves JSON to the React frontend |
| Database | **SQLite** (via `better-sqlite3`) | Embedded, zero-infrastructure, perfect for this scale |
| CSS | Plain CSS + CSS custom properties | No build complexity; Steve gets a modern, attractive result |
| Layout | Responsive (fluid widths + breakpoints) | Steve's requirement: the site must work well on phones, tablets, and desktop browsers |

## Data

- **SQLite** (via `better-sqlite3`) for local development and early production — simple, embedded, no infrastructure
- Migrations via plain SQL files; no ORM to start

## Testing

- **Vitest** — fast, TypeScript-native, works with both React (via jsdom) and the API server
- Run via `npm test` (`vitest run`); used for validating features before merge
- `src/server/db.ts` checks `process.env.VITEST` (set automatically by Vitest) and opens an in-memory SQLite database during test runs instead of `data/agentclinic.db`, so `npm test` no longer writes real rows into the database the dev server reads. This fixed a real issue: rows from prior test runs (`POST /api/appointments`, `POST /api/feedback`) had been accumulating in the dev database, visible as duplicate appointments once the Phase 11 feedback work added an appointments list to the agent detail page.

## Tooling

- `vite` for frontend dev server and production build
- The API server runs via `node --watch src/server/index.ts` (dev) / `node src/server/index.ts` (one-off), using Node's built-in TypeScript type-stripping — no `tsx`/esbuild step. This replaced `tsx` after Windows Smart App Control blocked `esbuild.exe` (an unsigned binary `tsx` spawns as a subprocess) from running; Vite and Vitest were unaffected since neither spawns it as a separate process. Relative imports under `src/server/` use explicit `.ts` extensions (`tsconfig.json` sets `allowImportingTsExtensions` + `noEmit`) because Node's ESM resolver requires them.
- No formatter configured yet (`prettier` was previously listed here but was never actually added to `package.json` or given a config file)

## What We Are Not Using

- No server-side rendering — React runs in the browser
- No ORM — SQL is sufficient at this scale
- No Docker — not yet; that's a later phase concern
