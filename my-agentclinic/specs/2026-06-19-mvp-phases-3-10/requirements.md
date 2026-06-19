# MVP Requirements — Phases 3–10

## Scope

This spec covers everything remaining on `specs/roadmap.md` needed to reach the MVP: Phases 3 through 10, delivered together on the `mvp` branch.

- **Phase 3 — Agents List Page**: React page fetches and renders the agents list (from the existing `GET /api/agents`); linked from nav.
- **Phase 4 — Agent Detail Page**: `GET /api/agents/:id` route; React detail page showing name, model type, status, presenting complaints.
- **Phase 5 — Ailments**: `ailments` table + seed data (e.g. "context-window claustrophobia"); `GET /api/ailments` route; ailments list page.
- **Phase 6 — Agent–Ailment Links**: join table linking agents to ailments; agent detail page lists that agent's ailments.
- **Phase 7 — Therapies**: `therapies` table + seed data; `GET /api/therapies` route + list page; ailment detail page links to its recommended therapies.
- **Phase 8 — Appointment Booking**: `appointments` table (agent, therapist, datetime, status); `POST /api/appointments` with basic validation; booking form on agent detail page; confirmation view on success.
- **Phase 9 — Staff Dashboard**: `GET /api/dashboard` returns summary counts; dashboard page showing agents, open appointments, ailments in-flight; linked from nav.
- **Phase 10 — Polish**: responsive audit across all pages shipped in this spec and Phase 2; semantic HTML and keyboard navigation/focus-style audit; error states for failed API fetches on every page that fetches data.

## Out of Scope

- Auth, therapist profiles (beyond the minimal seed needed for booking — see Decisions), email notifications, reporting — explicitly deferred in `roadmap.md`'s "Later phases" note.
- Editing or deleting agents, ailments, therapies, or appointments — only creation (booking) and read paths are required.
- Pagination or search/filter on any list page — seed data sets are small enough that a full list is fine.
- Production build/deploy pipeline — `npm run dev` remains the verification path, consistent with Phase 2.

## Decisions

### One combined spec and branch for Phases 3–10
The MVP is delivered as a single `mvp` branch with one plan/requirements/validation set, rather than per-phase spec directories. Each phase is still implemented and verified as a discrete, ordered step within the plan so failures are easy to localize, but there is one merge to `main` at the end.

### Minimal `therapists` table, seeded
The roadmap's Phase 8 references "therapist" as a field on `appointments`, and `mission.md` names therapists as a served persona, but no phase explicitly creates a `therapists` table. This spec adds a minimal `therapists` table (`id`, `name`, `specialty`) with a handful of seeded rows (e.g. specialties matching the seeded ailments — hallucination anxiety, context-window claustrophobia, instruction-following fatigue). The booking form's therapist field is a select populated from `GET /api/therapists` rather than free text, so `appointments.therapist_id` is a real foreign key. No therapist list/detail pages, login, or profiles are added — the table exists only to support booking.

### Ailment detail page introduced to support Phase 7
Phase 5 only specifies an ailments *list* page, but Phase 7 says "ailment detail links to recommended therapies," which requires an ailment detail view. This spec adds `GET /api/ailments/:id` and an ailment detail page as part of Phase 7's work (not Phase 5), since that's the first point a per-ailment view is actually needed.

### Appointment status is a fixed enum
`appointments.status` is a `TEXT` column constrained (in application code, not a DB `CHECK`) to `'requested'` on creation. No status transitions (confirmed/cancelled) are part of this MVP — the dashboard's "open appointments" count simply counts all rows, since every booked appointment starts and stays `'requested'` for now.

### Automated tests required for new routes and key components
Every new API route (`/api/agents/:id`, `/api/ailments`, `/api/ailments/:id`, `/api/therapies`, `/api/therapists`, `/api/appointments` POST, `/api/dashboard`) gets a Vitest test exercising at least its success path. Key interactive components — the booking form and any component with conditional rendering (loading/error/empty states) — get a Vitest + React Testing Library test. Simple presentational list/detail components that just map props to markup do not require dedicated tests.

### Polish (Phase 10) is part of this branch's definition of done
Per `roadmap.md`, every phase that ships UI must already be responsive — Phase 10 here means a final audit across all pages introduced in this spec (Phases 3–9) plus the Phase 2 home page, not a deferred first attempt at responsiveness. The audit also covers semantic HTML, keyboard navigation/focus styles, and adding visible error states for failed fetches (replacing any silent failures).

## Context

This is the first multi-phase spec in the project — Phase 2 covered a single phase. Phases 3–9 build out AgentClinic's core domain in the order the roadmap lays out (agents → ailments → therapies → booking → dashboard), since each phase's UI and API depend on data introduced by the previous one (e.g. the booking form needs both agents and therapists to exist first).

`better-sqlite3` and the existing `migrations/001_init.sql` pattern from Phase 2 continue to apply: new tables are added via additional numbered migration files (`002_ailments.sql`, `003_therapies_and_links.sql`, `004_appointments.sql`, etc.) rather than editing the existing one, since `001_init.sql` has already shipped.

## Stakeholder Notes

- **Mary** needs TypeScript end-to-end (as in Phase 2) and now also wants automated test coverage on new routes/components per this spec's test decision, plus her dashboard to show real counts — not placeholder data.
- **Steve** needs every page shipped in this spec to be responsive from the start, and Phase 10's audit confirms nothing slipped through across Phases 3–9 plus the Phase 2 home page.
