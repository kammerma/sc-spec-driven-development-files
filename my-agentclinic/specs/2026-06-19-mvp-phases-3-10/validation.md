# MVP Validation — Phases 3–10

## Definition of Done

All of the following must be true before the `mvp` branch is merged into `main`.

### 1. TypeScript compiles cleanly

```
npm run typecheck
```

Must exit with code 0 and produce no errors or warnings.

### 2. Automated tests pass

```
npm test
```

Must exit 0. Coverage required for:
- `GET /api/agents/:id` (found + not-found)
- `GET /api/ailments`, `GET /api/ailments/:id` (found + not-found)
- `GET /api/therapies`
- `GET /api/therapists`
- `POST /api/appointments` (success + at least one validation failure)
- `GET /api/dashboard`
- The agents list, ailments list, ailment detail, dashboard components (success render + error state)
- The booking form component (submit success + submit failure)

### 3. Both servers start with one command

```
npm run dev
```

Must start both the Vite frontend and the Hono API server without errors.

### 4. Full user journey works in a browser

Starting from `http://localhost:5173`:

1. Home page still shows the Phase 2 heading
2. Nav links to Agents, Ailments, Therapies, and Dashboard all work
3. Agents list page renders the seeded agents; clicking one opens its detail page
4. Agent detail page shows name, model type, status, presenting complaint, and linked ailments
5. Booking form on the agent detail page accepts a therapist + datetime and shows a confirmation view on success
6. Ailments list page renders seeded ailments; clicking one opens its detail page showing recommended therapies
7. Therapies list page renders seeded therapies
8. Dashboard page shows agent count, open appointment count, and ailments-in-flight count, and the appointment count increases after a successful booking

### 5. Every data-fetching page handles failure visibly

With the API server stopped (or a route temporarily broken), each of the following shows a visible error message rather than a blank page or unhandled exception in the console: agents list, agent detail, ailments list, ailment detail, therapies list, dashboard.

### 6. Responsive from phone to desktop

Resize the browser (or use devtools device toolbar) from ~360px to desktop width on every page listed in check 4. No horizontal scrolling; layout remains readable at all sizes.

### 7. Semantic HTML and keyboard navigation

- Nav is a `<nav>`; list pages use `<ul>/<li>` markup; heading levels do not skip (e.g. no `<h1>` followed directly by `<h3>`)
- Every interactive element (links, the booking form's inputs and submit button, nav items) is reachable via Tab in a logical order and shows a visible focus style
- The booking form's inputs each have an associated `<label>`

### 8. Database migrations are additive and ordered

`migrations/002_ailments.sql` through `migrations/005_therapists_and_appointments.sql` exist as separate numbered files (Phase 2's `001_init.sql` is untouched); running the app against a fresh `data/agentclinic.db` applies all of them in order and seeds data without errors.

### 9. All dependency versions are pinned

Any new dependencies added in `package.json` (e.g. React Testing Library, if not already present) are listed without a `^` or `~` range prefix, consistent with Phase 2.

## Not Required

- Authentication, therapist profiles/login, email notifications, or reporting — explicitly out of scope per `roadmap.md`'s "later phases" note
- Editing, deleting, or status transitions (confirm/cancel) for appointments
- Pagination, search, or filtering on any list page
- A production build check — `npm run dev` plus the manual journey above is sufficient, consistent with Phase 2's validation bar
