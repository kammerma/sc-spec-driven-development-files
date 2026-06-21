---
name: feature-spec
description: Find the next unimplemented phase in specs/roadmap.md, branch for it, ask clarifying questions, then write requirements.md/plan.md/validation.md for that feature. Use when asked to spec out the next feature, start the next roadmap phase, plan a new feature, or create a feature spec.
---

Turns the next phase on a project's `specs/roadmap.md` into a branch plus a `requirements.md` / `plan.md` / `validation.md` spec directory — without writing anything until the user has answered clarifying questions. This is a planning skill: it produces a spec and a branch, it does not implement the feature.

Optional argument: a phase name/number or feature description, if the user already knows which one they want (otherwise pick the next incomplete phase from the roadmap).

## 1. Read the project's specs

This skill is scoped to this project (`my-agentclinic/`). Read `specs/roadmap.md`, `specs/mission.md`, and `specs/tech-stack.md`:
- `specs/roadmap.md` — find the next phase that has **no** "✅ Complete" marker (top to bottom). If the user passed an argument naming a specific phase or feature, use that instead.
- `specs/mission.md` — stakeholder goals and personas, for the Stakeholder Notes section later.
- `specs/tech-stack.md` — current stack and any documented decisions/limitations that the new feature should respect or extend.

## 2. Ask before writing anything

**Before creating any branch or file**, use `AskUserQuestion` in a single call covering the open decisions for this phase, grouped roughly one question per output document:

- A question (or two) resolving scope/requirements ambiguity in the roadmap entry — the kind of thing that becomes a `requirements.md` "Decisions" bullet
- A question about how the feature should be structured or sequenced, if the roadmap entry is vague enough to need it — informs `plan.md`'s task groups
- A question about what "done" looks like for this feature beyond the standard bar (tests pass, typecheck clean) — informs `validation.md`

Keep it to what's genuinely ambiguous from the roadmap + mission + tech-stack context — don't ask about things already answered by those docs. Do not proceed to step 3 until the user has answered.

## 3. Branch

Create and check out a new branch named `YYYY-MM-DD-feature-name` (today's date, kebab-case slug derived from the phase title) from the repo's default branch (commonly `main`).

## 4. Write the spec

Create `specs/YYYY-MM-DD-feature-name/` (same directory level as other dated spec directories, e.g. `specs/2026-06-21-feedback-form/`) containing:

- **`requirements.md`** — `## Scope` (what this phase covers, lifted from the roadmap entry plus the user's answers), `## Decisions` (one subsection per non-obvious call, each explaining *why*), `## Out of Scope`, `## Context` (how this builds on prior phases/specs), `## Stakeholder Notes` (tie back to the personas in `mission.md`)
- **`plan.md`** — numbered task groups (`## Group 1 — <name>`, etc.), each a short ordered list of concrete steps ending in a verification command (`npm run typecheck`, `npm test`, etc., as established by `tech-stack.md`); a final group for full verification/manual walkthrough
- **`validation.md`** — `## Definition of Done` as a numbered checklist of concrete, runnable checks (commands plus expected results) that must all pass before merging; a `## Not Required` section listing what's explicitly out of scope for this phase

Match the tone and structure of existing dated spec directories under `specs/` (e.g. `specs/2026-06-19-mvp-phases-3-10/`, `specs/2026-06-21-feedback-form/`) — read one before writing so the new spec is consistent with prior ones.

Do not start implementing the feature — stop once the branch and the three files exist.
