# Roadmap

Phases are nano-sized — each one is a single, verifiable change. Small phases mean fast feedback and easy rollback.

---

## Phase 1 — Project Scaffold
- Vite + React + TypeScript project initialised
- Hono API server added alongside frontend
- Both dev servers start with one command (`npm run dev`)

## Phase 2 — Hello World
- React renders a single `<h1>AgentClinic is open for business</h1>`
- Vite proxies `/api/*` to the Hono server
- Confirm TypeScript types work end-to-end

## Phase 3 — Base Layout
- Shared layout component: header, nav, main area, footer
- CSS reset + custom properties for colour and typography
- All future pages render inside this layout

## Phase 4 — Database Setup
- SQLite database file and first migration script
- `better-sqlite3` connected to Hono API server
- Health-check route confirms DB is reachable

## Phase 5 — Agents API
- `agents` table + seed data (a handful of fictional agents)
- `GET /api/agents` returns JSON list

## Phase 6 — Agents List Page
- React page fetches and renders the agents list
- Linked from nav

## Phase 7 — Agent Detail Page
- `GET /api/agents/:id` route
- React detail page: name, model type, status, presenting complaints

## Phase 8 — Ailments
- `ailments` table + seed data (e.g., "context-window claustrophobia")
- `GET /api/ailments` route
- Ailments list page in React

## Phase 9 — Agent–Ailment Links
- Join table linking agents to ailments
- Agent detail page lists that agent's ailments

## Phase 10 — Therapies
- `therapies` table + seed data
- `GET /api/therapies` route + list page
- Ailment detail links to recommended therapies

## Phase 11 — Appointment Booking
- `appointments` table (agent, therapist, datetime, status)
- `POST /api/appointments` route with basic validation
- Booking form on agent detail page; confirmation view on success

## Phase 12 — Staff Dashboard
- `GET /api/dashboard` returns summary counts
- Dashboard page: agents, open appointments, ailments in-flight
- Mary's dashboard is now real

## Phase 13 — Polish
- Responsive layout for Steve's modern-browser requirement
- Semantic HTML audit; keyboard navigation and focus styles
- Error states for failed API fetches

---

Later phases (not yet planned): auth, therapist profiles, email notifications, reporting.
