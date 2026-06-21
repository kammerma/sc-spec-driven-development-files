# Feedback Form Plan — Phase 11

## Group 1 — Schema & Types

1. Create `migrations/006_feedback.sql` with `CREATE TABLE feedback (id INTEGER PRIMARY KEY AUTOINCREMENT, appointment_id INTEGER NOT NULL UNIQUE REFERENCES appointments (id), rating INTEGER NOT NULL, message TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)` — `UNIQUE` on `appointment_id` enforces one feedback per appointment at the DB level
2. Add `Feedback`, `FeedbackRow`, `toFeedback` to `src/server/types.ts`
3. Add `AppointmentWithTherapist` (id, therapistName, datetime, status, hasFeedback) to `src/server/types.ts`, used for the agent-detail appointments list
4. Run `npm run typecheck` — must exit 0

## Group 2 — Agent Detail Shows Its Appointments

5. Update `GET /api/agents/:id` to also return the agent's appointments (join `appointments` → `therapists` for the therapist name; `LEFT JOIN feedback` to compute `hasFeedback`), ordered by `datetime` descending
6. Update `AgentWithAilments`'s consumer type to include an `appointments: AppointmentWithTherapist[]` field
7. Update the existing `/api/agents/:id` Vitest test to assert the appointments array (including a case with and without feedback)
8. Update `AgentDetail.tsx` to render an "Appointments" section listing each appointment's therapist, datetime, and status; appointments without feedback show a "Leave feedback" link, appointments with feedback show "Feedback submitted"
9. Add a Vitest + RTL test for `AgentDetail.tsx` covering both link states
10. Run `npm run typecheck` — must exit 0

## Group 3 — Feedback Submission

11. Add `POST /api/feedback` validating `appointmentId` (must reference an existing appointment), `rating` (integer 1–5), and `message` (non-empty after trim); returns 400 with an error message on any failure, 400 if feedback already exists for that `appointmentId`, 201 + the created row on success
12. Write Vitest tests for `POST /api/feedback`: success, missing appointment, invalid rating, empty message, duplicate submission
13. Add `src/components/FeedbackForm.tsx`: a star rating input (1–5) and a message textarea, given an `appointmentId` prop
14. On submit, call `POST /api/feedback`; show a confirmation message on success, inline error on failure
15. Add a route `/agents/:id/appointments/:appointmentId/feedback` rendering a minimal `FeedbackPage` that wraps `FeedbackForm`; wire up the "Leave feedback" link from Group 2 to this route
16. Write a Vitest + RTL test for `FeedbackForm.tsx` covering submit-success and submit-failure
17. Run `npm run typecheck` — must exit 0

## Group 4 — Dashboard Summary

18. Update `GET /api/dashboard` to also return `feedbackCount` (count of `feedback` rows) and `averageRating` (mean `rating` rounded to 1 decimal, `null` if `feedbackCount` is 0)
19. Update the existing `GET /api/dashboard` Vitest test to assert the two new fields against known seed/test data
20. Update `Dashboard.tsx` to render "Feedback received" (`feedbackCount`) and "Average rating" (`averageRating`, or "—" if `null`)
21. Update the existing Dashboard Vitest + RTL test to cover the new fields
22. Run `npm run typecheck` — must exit 0

## Group 5 — Polish & Final Verification

23. Responsive check: agent detail's new appointments section, the feedback form page, and the dashboard's new fields from ~360px through desktop width
24. Keyboard/focus and semantic HTML check: rating input is operable via keyboard, the textarea has an associated `<label>`, the appointments list uses `<ul>/<li>`
25. Run `npm test` — all tests must pass
26. Run `npm run typecheck` — must exit 0
27. Run `npm run dev` — both servers must start without errors
28. Manually walk: agent detail → see existing appointment → "Leave feedback" → submit rating + message → confirmation → dashboard shows updated `feedbackCount`/`averageRating` → revisit agent detail, same appointment now shows "Feedback submitted"
