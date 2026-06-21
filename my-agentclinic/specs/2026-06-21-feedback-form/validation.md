# Feedback Form Validation — Phase 11

## Definition of Done

All of the following must be true before `2026-06-21-feedback-form` is merged into `main`.

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
- `GET /api/agents/:id` returning the agent's appointments, including the `hasFeedback` flag
- `POST /api/feedback`: success, missing/unknown `appointmentId`, invalid `rating` (out of 1–5 range or non-integer), empty `message`, duplicate submission for the same appointment
- `GET /api/dashboard`'s `feedbackCount` and `averageRating` fields (including the `averageRating: null` case when no feedback exists)
- `AgentDetail.tsx`'s appointments section (link shown vs. "Feedback submitted" shown)
- `FeedbackForm.tsx` (submit success + submit failure)
- `Dashboard.tsx` rendering the new fields

### 3. Both servers start with one command

```
npm run dev
```

Must start both the Vite frontend and the Hono API server without errors.

### 4. Full user journey works in a browser

Starting from an agent that already has at least one booked appointment (book one first if needed):

1. Agent detail page shows an "Appointments" section listing that appointment with a "Leave feedback" link
2. Following the link opens a feedback form with a 1–5 rating input and a message field
3. Submitting valid input shows a confirmation message
4. Returning to the agent detail page, that appointment now shows "Feedback submitted" instead of the link
5. Dashboard page's "Feedback received" count increased by 1, and "Average rating" reflects the new submission

### 5. Validation and duplicate-prevention work

- Submitting the feedback form with no rating selected, or an empty message, shows an inline error and does not create a row
- A second `POST /api/feedback` for the same `appointmentId` (e.g. via a repeated request) returns 400 and does not create a second row

### 6. Responsive from phone to desktop

Resize the browser from ~360px to desktop width on the agent detail page's appointments section, the feedback form, and the dashboard. No horizontal scrolling; layout remains readable at all sizes.

### 7. Semantic HTML and keyboard navigation

- The appointments list uses `<ul>/<li>` markup
- The feedback form's rating input and message textarea each have an associated `<label>` and are operable via keyboard (Tab to reach, no mouse-only interaction)
- Focus styles are visible on the "Leave feedback" link, rating input, textarea, and submit button

### 8. Database migration is additive

`migrations/006_feedback.sql` exists as a new file; running the app against a fresh `data/agentclinic.db` applies it after `005_therapists_and_appointments.sql` without errors.

## Not Required

- Authentication on `POST /api/feedback` — anyone with an `appointmentId` can submit; explicitly deferred per `requirements.md`
- Editing or deleting feedback after submission
- A dedicated appointments list page (the appointments section lives inline on agent detail per this spec's decision)
- A production build check — `npm run dev` plus the manual journey above is sufficient, consistent with prior phases' validation bar
