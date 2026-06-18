# Phase 2 Requirements — Hello World, Layout, Database & Agents API

## Scope

- React renders `<h1>AgentClinic is open for business</h1>` on the home page (replaces the Phase 1 placeholder heading/tagline content where it conflicts)
- Vite continues to proxy `/api/*` to the Hono server (already configured in Phase 1; confirm it still works end-to-end with the new DB-backed route)
- CSS reset + custom properties (colour and typography) added and applied globally; all future pages render inside the existing `Layout` component
- SQLite database file created via a single plain-SQL migration script
- `better-sqlite3` connected to the Hono API server
- A health-check route confirms the DB is reachable
- `agents` table created, with a handful of named fictional agents seeded
- `GET /api/agents` returns the seeded agents as a JSON list

## Out of Scope

- No agents list page in React — that's Phase 3 (rendering the fetched data)
- No agent detail route or page (Phase 4)
- No ailments, therapies, or appointments (Phases 5–8)
- No migration runner/numbered migrations convention — a single SQL file is sufficient for this phase
- No ORM

## Decisions

### Single spec covers all of Phase 2
Hello-world heading, layout/CSS-reset, and DB+agents-API are delivered together as one feature, matching the roadmap's Phase 2 grouping. One branch, one plan/requirements/validation set.

### Seed data: named fictional agents
The `agents` table ships with a handful of named fictional AI agents (not generic placeholders), each with a model type, status, and presenting complaint. This gives Phase 3's list page real content to render later, and matches the domain whimsy described in `mission.md`.

### SQLite setup: minimal, single migration file
One plain SQL file (e.g. `migrations/001_init.sql`) creates the `agents` table; the DB file lives at the project root (e.g. `data/agentclinic.db`). No migration runner or numbered-migration convention yet — that can be introduced later if/when more tables are added across phases.

### CSS reset + custom properties precede page-specific styles
A global stylesheet (reset + CSS custom properties for colour and typography) is added now so every future page builds on a consistent baseline, per the roadmap's Phase 2 scope. Existing `App.css` / `Layout.css` are updated to consume the custom properties rather than hardcoded values.

## Context

This phase deepens the scaffold from Phase 1 into a real, data-backed application: the frontend gets its real h1 and a consistent visual baseline, and the backend gains a database with its first table and route.

The home page heading changes from Phase 1's tagline-style content to the literal roadmap text: `AgentClinic is open for business`. The existing Phase 1 welcome paragraph may be kept or trimmed as needed to make room for the new heading — exact copy is left to implementation, but the `<h1>` text must match the roadmap.

`better-sqlite3` is synchronous, so the Hono route handlers query it directly without async/await ceremony. The health-check route (e.g. `GET /api/health`) should run a trivial query (such as `SELECT 1`) against the DB to confirm connectivity, separate from the `GET /api/agents` route.

## Stakeholder Notes

- **Mary** needs TypeScript end-to-end — the `agents` table row shape must have a corresponding TypeScript type, and `GET /api/agents` must be typed through to the JSON response.
- **Steve** needs every shipped UI to remain responsive (phone, tablet, desktop) — the CSS reset and custom properties must not regress the responsive behavior already in place from Phase 1.
