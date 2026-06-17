# Phase 1 Requirements — Project Scaffold

## Scope

Install and configure Vite + React + TypeScript as the frontend, and Hono (via `@hono/node-server`) as the API server. Both dev servers start with a single `npm run dev` command.

Deliver a minimal AgentClinic home page: a heading, tagline, and short welcome paragraph drawn from the mission. This is the first thing a developer sees when they run the project — it should reflect the product, not a generic placeholder.

## Out of Scope

- No client-side routing library (Phase 6+)
- No test files written for this phase (Vitest was added to the toolchain after this phase shipped; see `tech-stack.md`)
- No CSS framework, CSS reset, or custom properties (Phase 3)
- No database or API routes beyond a basic health-check
- No CI/CD pipeline

## Decisions

### Pin all dependency versions
All packages in `package.json` must use exact versions — no `^` or `~` range prefix. Future phases must not silently upgrade without deliberate review.

### Enforce strict TypeScript from the start
`tsconfig.json` must include `"strict": true`. This is non-negotiable from the first commit so the codebase never accumulates loose types.

### Concurrent dev servers via a single command
Use `concurrently` (or equivalent) so `npm run dev` starts both the Vite frontend and the Hono API server together. Developers should never need to manage two terminals.

### Layout subcomponents live in their own files
`Header`, `Main`, and `Footer` are each defined in their own file under `src/components/` (`Header.tsx`, `Main.tsx`, `Footer.tsx`), not inlined inside `Layout.tsx`. Keeps each subcomponent independently readable and testable as the layout grows.

### Layout and home page are responsive
Steve needs the site to work well on phones, tablets, and desktop browsers. `App.css` and `Layout.css` use fluid widths and a breakpoint for narrow viewports so the home page stays readable without horizontal scrolling or oversized padding on small screens. This applies retroactively (added after the phase initially shipped); see `tech-stack.md`.

## Context

This phase proves the baseline scaffold works: Vite builds and hot-reloads the React frontend, Hono serves an API response, and the Vite proxy routes `/api/*` traffic to Hono.

The entry point for the frontend is the default Vite + React template structure. The Hono server lives under `src/server/` and is run separately via `tsx`.

The home page content should come from `specs/mission.md` — the heading is "AgentClinic", the tagline reflects the wellness platform premise, and the paragraph gives a one- or two-sentence summary of what AgentClinic does. Minimal layout styles (centered, readable) are acceptable; a full CSS reset and custom properties are deferred to Phase 3.

## Stakeholder Notes

- **Mary** needs TypeScript end-to-end (satisfied by `"strict": true` + passing `tsc --noEmit`)
- **Steve** needs the home page to work well on a modern browser at any screen size (satisfied by the responsive layout decision above)
