# Phase 2 Plan — Hello World, Layout, Database & Agents API

## Group 1 — Hello World Heading

1. Update `src/App.tsx` so the `<h1>` reads exactly `AgentClinic is open for business`
2. Trim or adjust the surrounding tagline/welcome paragraph as needed so the page still reads sensibly with the new heading
3. Run `npm run typecheck` — must exit 0

## Group 2 — CSS Reset & Custom Properties

4. Create `src/styles/reset.css` with a minimal modern CSS reset (box-sizing, margin/padding normalization, sensible defaults for media elements)
5. Create `src/styles/theme.css` defining CSS custom properties on `:root` for colour palette and typography (font family, base size, scale)
6. Import `reset.css` and `theme.css` once at the application entry point (`src/main.tsx`)
7. Update `App.css` and `Layout.css` to reference the new custom properties instead of hardcoded colour/font values
8. Confirm in a browser that the home page still renders correctly and remains responsive from phone width through desktop

## Group 3 — SQLite Database & Migration

9. Install `better-sqlite3` and its TypeScript types (exact versions, no `^`/`~`)
10. Create `migrations/001_init.sql` with a `CREATE TABLE agents (...)` statement (columns: `id`, `name`, `model_type`, `status`, `presenting_complaint`)
11. Create a small script (e.g. `src/server/db.ts`) that opens/creates `data/agentclinic.db` and applies `migrations/001_init.sql` if the `agents` table doesn't already exist
12. Add seed data: a handful of named fictional agents inserted if the table is empty
13. Add `data/agentclinic.db` to `.gitignore` (generated file, not checked in)

## Group 4 — Health-Check Route

14. Add `GET /api/health` to the Hono server that runs `SELECT 1` against the DB and returns `{ "status": "ok", "db": "reachable" }`
15. Confirm `curl http://localhost:3001/api/health` (and via the Vite proxy) returns the expected JSON

## Group 5 — Agents API Route

16. Define a TypeScript type for an `Agent` row (`id`, `name`, `modelType`, `status`, `presentingComplaint`)
17. Add `GET /api/agents` to the Hono server, querying all rows from the `agents` table and returning them as JSON typed as `Agent[]`
18. Confirm `curl http://localhost:3001/api/agents` (and via the Vite proxy at `http://localhost:5173/api/agents`) returns the seeded agents as a JSON array

## Group 6 — Verify

19. Run `npm run typecheck` — must exit 0 with no errors
20. Run `npm run dev` — both servers must start without errors in a single terminal
21. Open `http://localhost:5173` in a browser — must show `<h1>AgentClinic is open for business</h1>` styled via the new reset/custom properties
22. Run `curl http://localhost:5173/api/health` — must confirm DB reachability
23. Run `curl http://localhost:5173/api/agents` — must return the seeded agents list
24. Resize the browser from phone width (~360px) to desktop — must remain free of horizontal scrolling, consistent with Phase 1's responsive baseline
