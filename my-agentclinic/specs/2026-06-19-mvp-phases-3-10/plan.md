# MVP Plan — Phases 3–10

## Group 1 — Phase 3: Agents List Page

1. Add `src/pages/AgentsList.tsx` that fetches `GET /api/agents` and renders name, model type, status, and presenting complaint for each agent
2. Add loading and error states (e.g. "Loading agents…" / "Couldn't load agents")
3. Add a route/link from the shared nav (`Header`/`Layout`) to the agents list page
4. Write a Vitest + RTL test covering the success render and the error state
5. Run `npm run typecheck` — must exit 0

## Group 2 — Phase 4: Agent Detail Page

6. Add `GET /api/agents/:id` to the Hono server; 404 JSON response if no matching row
7. Write a Vitest test for `/api/agents/:id` covering found and not-found cases
8. Add `src/pages/AgentDetail.tsx` that fetches the route's agent and renders name, model type, status, presenting complaint
9. Link each row in `AgentsList` to its detail page
10. Add loading/error/not-found states to the detail page
11. Run `npm run typecheck` — must exit 0

## Group 3 — Phase 5: Ailments

12. Create `migrations/002_ailments.sql` with `CREATE TABLE ailments (id, name, description)` and seed rows (e.g. "context-window claustrophobia", "hallucination anxiety", "instruction-following fatigue")
13. Apply the migration via the existing `db.ts` migration-on-startup pattern from Phase 2
14. Define an `Ailment` TypeScript type
15. Add `GET /api/ailments` returning all rows
16. Write a Vitest test for `GET /api/ailments`
17. Add `src/pages/AilmentsList.tsx` fetching and rendering the list, linked from nav
18. Add loading/error states; write a Vitest + RTL test for the list component
19. Run `npm run typecheck` — must exit 0

## Group 4 — Phase 6: Agent–Ailment Links

20. Create `migrations/003_agent_ailments.sql` with a join table (`agent_id`, `ailment_id`) and seed a few links tying existing seeded agents to existing seeded ailments
21. Update `GET /api/agents/:id` to also return the agent's linked ailments (name + id) via a join query
22. Update the `Agent` detail TypeScript type to include an `ailments` array
23. Update `AgentDetail.tsx` to render the linked ailments (or "No ailments on file" if none)
24. Update the `/api/agents/:id` Vitest test to assert the ailments array is present and correct
25. Run `npm run typecheck` — must exit 0

## Group 5 — Phase 7: Therapies + Ailment Detail Page

26. Create `migrations/004_therapies.sql` with `CREATE TABLE therapies (id, name, description)`, a join table `ailment_therapies (ailment_id, therapy_id)`, seed therapies, and seed links tying them to existing seeded ailments
27. Define a `Therapy` TypeScript type
28. Add `GET /api/therapies` returning all rows
29. Add `GET /api/ailments/:id` returning the ailment plus its linked recommended therapies; 404 if not found
30. Write Vitest tests for `GET /api/therapies` and `GET /api/ailments/:id` (found, not-found, and therapies-present cases)
31. Add `src/pages/TherapiesList.tsx`, linked from nav
32. Add `src/pages/AilmentDetail.tsx` rendering the ailment plus its recommended therapies; link to it from `AilmentsList`
33. Add loading/error states to both new pages; write Vitest + RTL tests for each
34. Run `npm run typecheck` — must exit 0

## Group 6 — Phase 8: Appointment Booking

35. Create `migrations/005_therapists_and_appointments.sql` with `CREATE TABLE therapists (id, name, specialty)` (seeded with a few rows), and `CREATE TABLE appointments (id, agent_id, therapist_id, datetime, status)`
36. Define `Therapist` and `Appointment` TypeScript types
37. Add `GET /api/therapists` returning all rows (used to populate the booking form's select)
38. Add `POST /api/appointments` validating `agent_id`, `therapist_id`, and `datetime` are present and `datetime` parses as a valid date; rejects with 400 + error message on invalid input; inserts with `status: 'requested'` on success
39. Write Vitest tests for `GET /api/therapists` and `POST /api/appointments` (success, and at least one validation-failure case)
40. Add a booking form component to `AgentDetail.tsx` (or a dedicated route) with a therapist select (from `GET /api/therapists`) and a datetime input
41. On submit, call `POST /api/appointments`; show a confirmation view on success, inline error message on failure
42. Write a Vitest + RTL test for the booking form covering submit-success and submit-failure
43. Run `npm run typecheck` — must exit 0

## Group 7 — Phase 9: Staff Dashboard

44. Add `GET /api/dashboard` returning `{ agentCount, openAppointmentCount, ailmentsInFlightCount }` (counts derived from existing tables — "ailments in-flight" = distinct ailments currently linked to at least one agent)
45. Write a Vitest test for `GET /api/dashboard` asserting the shape and values against known seed data
46. Add `src/pages/Dashboard.tsx` rendering the three counts, linked from nav
47. Add loading/error states; write a Vitest + RTL test for the dashboard component
48. Run `npm run typecheck` — must exit 0

## Group 8 — Phase 10: Polish

49. Responsive audit: open every page added in Groups 1–7 (plus the existing Phase 2 home page) from ~360px through desktop width; fix any horizontal scrolling or cramped layouts found
50. Semantic HTML audit: confirm nav uses `<nav>`, lists use `<ul>/<li>` where appropriate, headings follow a logical hierarchy (no skipped levels), and the booking form's inputs have associated `<label>`s
51. Keyboard navigation audit: confirm every interactive element (nav links, list-item links, form inputs/buttons) is reachable via Tab and has a visible focus style
52. Error-state audit: confirm every page that fetches data (agents list/detail, ailments list/detail, therapies list, dashboard) shows a visible error message on fetch failure, not a silent blank page — fix any that don't
53. Run `npm run typecheck` — must exit 0

## Group 9 — Final Verification

54. Run `npm test` (`vitest run`) — all tests must pass
55. Run `npm run typecheck` — must exit 0
56. Run `npm run dev` — both servers must start without errors
57. Manually walk the full user journey in a browser: home → agents list → agent detail → book an appointment → confirmation → ailments list → ailment detail (with therapies) → therapies list → dashboard shows updated counts
58. Resize the browser from phone width (~360px) to desktop on every page in the journey above — confirm no horizontal scrolling
