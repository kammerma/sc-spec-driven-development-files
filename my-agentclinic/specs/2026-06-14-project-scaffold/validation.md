# Phase 1 Validation — Project Scaffold

## Definition of Done

All of the following must be true before this branch is merged.

### 1. TypeScript compiles cleanly

```
npm run typecheck
```

Must exit with code 0 and produce no errors or warnings.

### 2. Both servers start with one command

```
npm run dev
```

Must start both the Vite frontend and the Hono API server without errors. A single terminal is sufficient — no second process required.

### 3. Home page renders correctly in the browser

Open `http://localhost:5173` in a browser.

Must load without errors and display:

- An `<h1>` containing `AgentClinic`
- A visible tagline referencing the wellness platform premise
- A short welcome paragraph (at least one sentence describing what AgentClinic does)
- Minimal layout styles applied (content is not flush-left raw text)

### 4. Hono API responds through the Vite proxy

```
curl -s http://localhost:5173/api
```

Must return a JSON response (e.g. `{"status":"ok"}`). This confirms the Vite proxy is correctly forwarding `/api/*` to the Hono server.

### 5. All dependency versions are pinned

`package.json` must list every dependency without a `^` or `~` range prefix.

### 6. Strict TypeScript is on

`tsconfig.json` must contain `"strict": true`.

### 7. Home page is responsive

Resize the browser (or use devtools device toolbar) from phone width (~360px) to desktop.

Must not produce horizontal scrolling, and padding/font-size must scale down sensibly on narrow viewports rather than staying fixed.

## Not Required

- No automated tests for this phase
- No CI pipeline required
- No production build check — `npm run dev` is sufficient
