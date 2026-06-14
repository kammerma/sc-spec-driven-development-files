# Phase 1 Plan — Project Scaffold

## Group 1 — Vite + React Setup

1. Replace the existing `package.json` with a Vite + React + TypeScript configuration (exact version pins, no `^`)
2. Install `vite`, `react`, `react-dom`, `@vitejs/plugin-react`, and their TypeScript type packages
3. Create `vite.config.ts` with the React plugin enabled
4. Create `tsconfig.json` with `"strict": true`, appropriate `target`/`module`, and `jsx: "react-jsx"`
5. Create `index.html` as the Vite entry point
6. Create `src/main.tsx` mounting `<App />` into `#root`
7. Create `src/App.tsx` with a minimal placeholder (empty `<div>`) to confirm React mounts
8. Confirm `npm run dev` (frontend only) starts Vite and the browser shows the React page

## Group 2 — Hono API Server

9. Install `hono`, `@hono/node-server`, and `tsx` as a dev dependency (exact versions)
10. Create `src/server/index.ts` with a minimal Hono app
11. Add a single `GET /api` route returning `{ "status": "ok" }` as JSON
12. Add `"server": "tsx src/server/index.ts"` to `package.json` scripts
13. Confirm `npm run server` starts Hono and `curl http://localhost:3001/api` returns JSON

## Group 3 — Vite Proxy Configuration

14. Add a `server.proxy` entry to `vite.config.ts` that forwards `/api/*` to `http://localhost:3001`
15. Confirm proxying works: Vite dev server running, `curl http://localhost:5173/api` returns the same JSON as the direct Hono call

## Group 4 — Unified Dev Script

16. Install `concurrently` as a dev dependency (exact version)
17. Replace or update the `"dev"` script in `package.json` to run both Vite and the Hono server together via `concurrently`
18. Add `"typecheck": "tsc --noEmit"` to `package.json` scripts

## Group 5 — Home Page

19. Update `src/App.tsx` with the AgentClinic home page: an `<h1>AgentClinic</h1>` heading and a tagline drawn from the mission ("A full-service wellness platform for AI agents")
20. Add a short welcome paragraph below the tagline describing what AgentClinic does (reference `specs/mission.md` for wording)
21. Create `src/App.css` with minimal layout styles: centered content, comfortable max-width, readable font size (no CSS reset, no custom properties — those are Phase 3)
22. Import `App.css` in `src/App.tsx`

## Group 6 — Verify

23. Run `npm run typecheck` — must exit 0 with no errors
24. Run `npm run dev` — both servers must start without errors in a single terminal
25. Open `http://localhost:5173` in a browser — must show the home page with the heading, tagline, and welcome paragraph
26. Run `curl http://localhost:5173/api` — must return `{"status":"ok"}` proxied through Vite to Hono
