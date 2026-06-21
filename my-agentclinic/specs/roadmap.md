# Roadmap

Phases are nano-sized — each one is a single, verifiable change. Small phases mean fast feedback and easy rollback.

Every phase that ships UI must be responsive (phone, tablet, desktop) per Steve's requirement — this is a baseline expectation, not deferred to a single later phase.

---

## Phase 1 — Project Scaffold ✅ Complete
- Vite + React + TypeScript project initialised
- Hono API server added alongside frontend
- Both dev servers start with one command (`npm run dev`)

## Phase 2 — Hello World, Layout, Database & Agents API
- React renders a single `<h1>AgentClinic is open for business</h1>`
- Vite proxies `/api/*` to the Hono server
- Confirm TypeScript types work end-to-end
- Shared layout component: header, nav, main area, footer
- CSS reset + custom properties for colour and typography
- All future pages render inside this layout
- SQLite database file and first migration script
- `better-sqlite3` connected to Hono API server
- Health-check route confirms DB is reachable
- `agents` table + seed data (a handful of fictional agents)
- `GET /api/agents` returns JSON list

## Phase 3 — Agents List Page
- React page fetches and renders the agents list
- Linked from nav

## Phase 4 — Agent Detail Page
- `GET /api/agents/:id` route
- React detail page: name, model type, status, presenting complaints

## Phase 5 — Ailments
- `ailments` table + seed data (e.g., "context-window claustrophobia")
- `GET /api/ailments` route
- Ailments list page in React

## Phase 6 — Agent–Ailment Links
- Join table linking agents to ailments
- Agent detail page lists that agent's ailments

## Phase 7 — Therapies
- `therapies` table + seed data
- `GET /api/therapies` route + list page
- Ailment detail links to recommended therapies

## Phase 8 — Appointment Booking
- `appointments` table (agent, therapist, datetime, status)
- `POST /api/appointments` route with basic validation
- Booking form on agent detail page; confirmation view on success

## Phase 9 — Staff Dashboard
- `GET /api/dashboard` returns summary counts
- Dashboard page: agents, open appointments, ailments in-flight
- Mary's dashboard is now real

## Phase 10 — Polish
- Responsive audit across all existing pages (catch anything earlier phases missed)
- Semantic HTML audit; keyboard navigation and focus styles
- Error states for failed API fetches

## Phase 11 — Feedback Form
- `feedback` table (name, message, rating, created_at)
- `POST /api/feedback` route with basic validation
- Feedback form page, linked from nav; confirmation view on success

---

Later phases (not yet planned): auth, therapist profiles, email notifications, reporting.
