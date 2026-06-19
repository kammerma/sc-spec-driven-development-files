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
- **Known limitation**: `src/server/db.ts` always opens `data/agentclinic.db` relative to the project root, so Vitest's API tests (`POST /api/appointments`, etc.) write into the same SQLite file the dev server uses — there is no separate test database or in-memory mode yet. Running `npm test` while `npm run dev` is open will visibly change dashboard counts. Worth revisiting (e.g. an in-memory SQLite instance for tests) before appointment status transitions or other write-heavy features are added.

## Tooling

- `vite` for frontend dev server and production build
- `tsx` for running the API server without a build step
- `prettier` for formatting

## What We Are Not Using

- No server-side rendering — React runs in the browser
- No ORM — SQL is sufficient at this scale
- No Docker — not yet; that's a later phase concern
