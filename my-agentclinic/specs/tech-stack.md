# Tech Stack

AgentClinic is a client-side TypeScript application built with React and Vite. The browser renders all UI; a lightweight API server handles data access.

## Core

| Layer | Choice | Rationale |
|---|---|---|
| Language | TypeScript | Type safety end-to-end; satisfies Mary's requirement |
| Runtime | Node.js | Stable, well-supported, vast ecosystem |
| Frontend framework | **React** | Component model maps cleanly to dashboard and list views |
| Build tool | **Vite** | Fast HMR, TypeScript-native, minimal config |
| API server | **Hono** | Lightweight TypeScript-first server; serves JSON to the React frontend |
| Database | **SQLite** (via `better-sqlite3`) | Embedded, zero-infrastructure, perfect for this scale |
| CSS | Plain CSS + CSS custom properties | No build complexity; Steve gets a modern, attractive result |

## Data

- **SQLite** (via `better-sqlite3`) for local development and early production — simple, embedded, no infrastructure
- Migrations via plain SQL files; no ORM to start

## Testing

- **Vitest** — fast, TypeScript-native, works with both React (via jsdom) and the API server
- Run via `npm test` (`vitest run`); used for validating features before merge

## Tooling

- `vite` for frontend dev server and production build
- `tsx` for running the API server without a build step
- `prettier` for formatting

## What We Are Not Using

- No server-side rendering — React runs in the browser
- No ORM — SQL is sufficient at this scale
- No Docker — not yet; that's a later phase concern
