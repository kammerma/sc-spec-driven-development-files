# Phase 2 Validation — Hello World, Layout, Database & Agents API

## Definition of Done

All of the following must be true before this branch is merged.

### 1. TypeScript compiles cleanly

```
npm run typecheck
```

Must exit with code 0 and produce no errors or warnings.

### 2. Both servers start with one command

```
npm run dev
```

Must start both the Vite frontend and the Hono API server without errors.

### 3. Home page shows the correct heading

Open `http://localhost:5173` in a browser.

Must display an `<h1>` containing exactly `AgentClinic is open for business`.

### 4. CSS reset and custom properties are applied

Inspect the page styles (devtools).

- A reset stylesheet must be loaded (no default browser margin on `<h1>`/`<body>`, consistent `box-sizing`)
- Colour and typography values must come from CSS custom properties defined on `:root`, not hardcoded hex/px values scattered through component CSS

### 5. Home page remains responsive

Resize the browser (or use devtools device toolbar) from phone width (~360px) to desktop.

Must not produce horizontal scrolling; layout must remain readable at all sizes, consistent with the Phase 1 baseline.

### 6. Database file and migration exist

- `migrations/001_init.sql` exists and defines the `agents` table
- Running the app creates `data/agentclinic.db` if it doesn't already exist
- `data/agentclinic.db` is listed in `.gitignore` and not committed

### 7. Health-check route confirms DB connectivity

```
curl -s http://localhost:5173/api/health
```

Must return a JSON response indicating the database is reachable (e.g. `{"status":"ok","db":"reachable"}`).

### 8. Agents API returns seeded data

```
curl -s http://localhost:5173/api/agents
```

Must return a JSON array of agent objects, each with at minimum `id`, `name`, `modelType`, `status`, and `presentingComplaint` fields, populated with the seeded fictional agents (more than zero entries).

### 9. All dependency versions are pinned

`package.json` must list `better-sqlite3` and its types without a `^` or `~` range prefix.

## Not Required

- No React UI for displaying agents yet (Phase 3)
- No automated tests required for this phase (may be added if convenient, but not blocking)
- No production build check — `npm run dev` is sufficient
