---
name: run-my-agentclinic
description: Build, run, and drive AgentClinic (Vite/React + Hono API). Use when asked to start AgentClinic, run its dev server, run its tests, or screenshot/click through its UI.
---

AgentClinic is a Vite/React frontend with a Hono API server, started together via `npm run dev`. Drive it by starting the dev server, then running the Playwright driver script at `.claude/skills/run-my-agentclinic/driver.mjs`, which walks the main user journey and writes screenshots.

All paths below are relative to `my-agentclinic/`.

## Prerequisites

None beyond Node.js (this repo was built/run on Node 24). No OS packages were needed — the API server runs via plain `node --watch`, no native binary spawn (see Gotchas: this matters on Windows specifically).

## Setup

```bash
npm install
```

## Run (agent path)

1. Start both servers in the background and wait for the port:

```bash
npm run dev &
timeout 30 bash -c 'until curl -sf http://localhost:5173/api/agents >/dev/null; do sleep 1; done'
```

Vite picks the next free port (5174, 5175, …) if 5173 is busy — check the `[vite]` log line for the actual port, or kill stray `node`/`vite` processes first if you need it pinned to 5173.

2. Install Playwright on demand (it's not a project dependency — agent tooling only, install with `--no-save`) and make sure Chromium is present:

```bash
npm install --no-save playwright
npx playwright install chromium
```

3. Run the driver against the dev server's base URL:

```bash
node .claude/skills/run-my-agentclinic/driver.mjs http://localhost:5173
```

It walks: home → Agents list → first agent's detail page → books an appointment (real write) → Dashboard, and writes four screenshots to the current directory: `run-check-home.png`, `run-check-agent-detail.png`, `run-check-booking-confirmed.png`, `run-check-dashboard.png` (already in `.gitignore`). It exits non-zero and prints any browser console errors it captured.

4. Clean up afterward:

```bash
rm -f run-check-*.png
npm uninstall playwright --no-save
# stop the dev server: kill the backgrounded npm run dev, or on Windows:
#   Get-Process node | Stop-Process -Force
```

## Run (human path)

```bash
npm run dev   # → http://localhost:5173 (frontend), http://localhost:3001 (API). Ctrl-C to stop.
```

## Test

```bash
npm run typecheck   # tsc --noEmit, must exit 0
npm test            # vitest run — 14 files / 46 tests passing as of this writing
```

`npm test` uses an in-memory SQLite database (see `src/server/db.ts`'s `process.env.VITEST` check) — it does not touch `data/agentclinic.db`, so it's safe to run while the dev server is up.

---

## Gotchas

- **On Windows, with Smart App Control on, `npm run dev` fails with `Error: spawn UNKNOWN` / errno `-4094` from inside esbuild.** This is *not* an esbuild bug — Smart App Control blocks the unsigned `esbuild.exe` that `tsx` used to spawn as a subprocess. This repo no longer depends on `tsx`/`esbuild` at all (the dev/server scripts use `node --watch` with Node's native TypeScript stripping) specifically to avoid this, but if you see this error again after adding a new tool, check whether it spawns a native `.exe`.
- **`chromium-cli` isn't installed in this environment.** Use Playwright directly (`npm install --no-save playwright`); the Chromium binary is cached under `~/AppData/Local/ms-playwright` once downloaded, so `npx playwright install chromium` is a fast no-op on repeat runs.
- **Booking an appointment in the driver writes a real row** to `data/agentclinic.db` (the dev DB, not the test DB) — that's intentional, it's the one write-path worth smoke-testing, but it means repeated driver runs will accumulate appointments tied to whichever agent is first in the Agents list. Harmless for a smoke check; don't rely on exact dashboard counts.
- **Vite may not land on port 5173** if a previous `npm run dev` is still running — it silently tries 5174, 5175, etc. Pass the actual printed URL to the driver as `argv[2]` rather than assuming 5173.
