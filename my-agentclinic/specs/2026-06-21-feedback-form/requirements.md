# Feedback Form Requirements — Phase 11

## Scope

This spec covers `specs/roadmap.md`'s Phase 11 — Feedback Form, delivered on the `2026-06-21-feedback-form` branch.

- `feedback` table (rating, message, created_at) tied to a specific appointment
- `POST /api/feedback` route with validation
- A feedback form, reachable from an agent's own appointments, with a confirmation view on success
- Staff dashboard shows a feedback summary (count + average rating)

## Decisions

### Feedback is submitted by an agent, about one of its own appointments
Per stakeholder answer: feedback is not anonymous or general — it is left by the agent that had the appointment, about that specific appointment. `feedback.appointment_id` is a required foreign key to `appointments`. There is no `agent_id` column on `feedback`; the agent is derived via `appointments.agent_id` when needed (e.g. for the dashboard summary), avoiding a duplicate/denormalized reference.

### Rating is 1–5 stars, plus a required message
`feedback.rating` is an `INTEGER` constrained in application code to 1–5. `feedback.message` is required free text (non-empty after trim). Both are required — there is no rating-only or message-only submission.

### One feedback submission per appointment
`POST /api/feedback` rejects (400) a second submission for an `appointment_id` that already has feedback. This keeps the dashboard's average rating meaningful and avoids needing edit/delete UI in this phase.

### Spec gap: no existing way to see "my appointments"
The roadmap and the existing MVP spec never introduced an appointments list anywhere — `AgentDetail.tsx` only has a booking *form*, not a list of appointments already booked for that agent. Since feedback is appointment-scoped, this phase needs a minimal way to choose which appointment to leave feedback on. Rather than building a separate appointments page, `GET /api/agents/:id` is extended to also return that agent's appointments (id, therapist name, datetime, status, and whether feedback already exists), and `AgentDetail.tsx` renders that list with a "Leave feedback" link per appointment lacking feedback. No appointment status transitions are part of this — an appointment is eligible for feedback regardless of its `status` (still just `'requested'` per the existing fixed-enum decision).

### Feedback summary on the dashboard
Per stakeholder answer, `GET /api/dashboard` gains two fields: `feedbackCount` (total `feedback` rows) and `averageRating` (mean of `feedback.rating`, rounded to one decimal; `null` if `feedbackCount` is 0). `Dashboard.tsx` renders both, with `averageRating` showing "—" when `null`.

## Out of Scope

- Editing or deleting feedback once submitted
- Staff replying to or moderating feedback
- Feedback tied to anything other than an appointment (e.g. general site feedback, therapy feedback)
- Pagination/search on the new appointments-within-agent-detail list — seed-scale data only
- Auth — consistent with the rest of the MVP, anyone can submit feedback for any `appointment_id` by calling the API directly; this is an accepted limitation, not addressed until a future auth phase

## Context

This is the first post-MVP phase, building on the `appointments` table and fixed-status-enum decisions from `specs/2026-06-19-mvp-phases-3-10/requirements.md`. It follows the same automated-test and responsive-by-default bar established there.

## Stakeholder Notes

- **Susan** gets a closed feedback loop on the booking feature she specified in the MVP.
- **Mary** gets the dashboard's third surface area (alongside agents/appointments/ailments) backed by real data, with Vitest coverage on the new route per the existing test-rigor decision.
- **Steve** needs the feedback form and updated agent detail / dashboard sections to remain responsive, per the roadmap's standing requirement.
