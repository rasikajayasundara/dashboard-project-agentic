# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # dev server (http://localhost:3000)
npm run build      # production build — CI=false, copies staticwebapp.config.json into build/
npm test           # run tests in watch mode
```

No linting script is defined; ESLint runs via react-scripts (CRA default config, extends react-app).

## Working agreement
- Never run `npm start` or any other dev server on your own initiative — only when the user explicitly asks for it in that turn.
- Never make code edits without the user's explicit go-ahead for that specific change — propose the change and wait for confirmation first, even mid-task.

## Architecture

### Active migration
The project is mid-revamp. **All new code must use the Redux Toolkit slice pattern** (`store/<feature>Slice/`). The `data/` folder (old switch-case reducers, string-constant actions, standalone sagas) is legacy and being phased out — do not add anything to it.

### State management pattern
Each feature in `store/` has three files:
- `index.js` — `createSlice` with reducers and exports `{ actions: featureAction, reducer: featureReducer }`
- `api.js` — plain async functions that call `authAxios` helpers (`getRequest`, `postRequest`, etc.)
- `saga.js` — `takeLatest` watchers that call `api.js` functions and dispatch slice actions

Redux Thunk is **disabled** — all async work goes through Redux-Saga. Never use `createAsyncThunk`.

`rootReducer.js` and `rootSaga.js` are the single registration points for all slices. After adding a new slice, import and register both the reducer and the saga there.

### Auth & API
`src/config/authAxios.js` is the sole HTTP client. It:
- Auto-injects `Authorization: Bearer <token>` from Redux state on every request
- Handles 401s by refreshing the token and replaying the queued failed requests
- Exposes `getRequest / postRequest / putRequest / deleteRequest` helpers (all return `response.data`, not the raw Axios response)

All endpoint paths live in `src/config/apiPath.js`. Always add new paths there — never hardcode URLs in sagas or components.

Two base URLs exist (`src/config/Api.js`): `API_BASE_URL_V1` (main, used by `authAxios`) and a separate analytics base URL for dashboard-only calls.

### Auth / routing
`useInitialNavigation` (in `src/hooks/useLoginSync.js`) redirects unauthenticated users to `/login` on every route change. `PermissionGuard` (same file) checks `state.login.actions` against a hard-coded route→permission map and redirects to `/forbidden` if access is denied.

Auth state is persisted via `secureStorage` (`src/utils/encryptedStorage.js`), which AES-encrypts values before writing to `localStorage`. Use `secureStorage().getItem/setItem/removeItem` — never access `localStorage` directly.

### Styling
- **Styled-components** for all reusable components and pages — every component/page folder gets exactly one `component.styles.js` alongside its `index.js`. This is the only style-file name used in `src/components` and `src/pages` — never name it after the page/component (no `projects.styles.js`, `clientDetail.styles.js`, etc).
- **One component per folder.** If a folder would otherwise need a second style file (e.g. a page and its header component living side by side), give the second component its own subfolder with its own `index.js` + `component.styles.js` instead of inventing a second style filename in the same folder.
- **Exception — `modals/` folders and other folders that intentionally bundle several sibling components** (e.g. `Add*.js` / `Edit*.js` / `*Detail.js` modals sharing one `modals/` directory): these keep feature-named style files instead of `component.styles.js`, since multiple unrelated components already share the directory by design. Name the shared file after what it contains, not after one consumer — e.g. `form.styles.js` for styles shared by an Add and Edit modal (not `addProject.styles.js` used by both Add and Edit), `taskDetail.styles.js` for a single detail modal's own styles.
- **Bootstrap 5** utility classes used throughout JSX
- Colors and avatar palettes are in `src/constants/common.js` — import from there, never hardcode hex values
- Font sizes for body-level UI text also live in `src/constants/common.js` as `fontSize` — import from there, never hardcode a `font-size` px value for text. Five tiers, classified by semantic role (not by nearest px value to whatever was there before):
  - `general` (13px) — default body text: paragraphs, table cells, form inputs, regular labels
  - `highlight` (13px) — same size as `general`, used with `font-weight: 600` for emphasized/bold inline text (names, active states, emphasized values)
  - `subtitle` (12px) — secondary/meta text: captions, helper text, muted labels
  - `header` (14px) — section/card headings (e.g. `CardTitle`-style) — **not** full page-level titles
  - `badge` (9px) — small badge/pill/chip text: status pills, count badges
  - Page-level titles/heroes, big standalone stat/display numbers, icon glyph sizes, and avatar-initial circle sizing are intentionally left as raw px literals, outside this system

### Notifications
`snackbarSlice` drives the global `<Snackbar />` component. Dispatch `snackbarAction.showSnackbar({ message, type })` from any saga (import `SNACKBAR_TYPES` for the type values). Do not use `react-toastify` for new features.

### Environment variables
All env vars are prefixed `REACT_APP_`. Key ones:
- `REACT_APP_API_BASE_URL_V1` — primary API base (used by authAxios)
- `REACT_APP_ANALYTICS_BASE_URL` — analytics/dashboard API (separate base URL)
- `REACT_APP_BACKEND_SOCKET_PORT` — Socket.io server

## Showing agent workflows

When the user asks to see a workflow — "show me the workflow", "show me the api wiring workflow", "show me the specific agent workflow", "how does /generate-UI work" — render the **complete** orchestration as an ASCII arrow/line diagram. Never prose paragraphs, never a numbered list of sentences.

Applies to every workflow command: `/generate-UI`, `/update-UI`, `/review-UI`, `/wire-api`, `/audit-dead-code`.

### Required elements

Every diagram must contain all five, explicitly:

1. **Header line** — `AGENT ORCHESTRATION — <command>` as the first line inside the code fence.
2. **Every step, numbered and in order** — Step 0, Step 1, Step 1.5, … using the same numbers and order as the command's own `.md` file. Never merge, renumber, or skip steps, even ones that do nothing but parse arguments.
3. **Every agent named in full, inside a box** — `╔═ agent: demo-dash-ui-builder ═╗`. The literal word `agent:` precedes the name, and the name is the exact `subagent_type` string. Orchestrator-only steps (parsing, planning, build check, route registration, summary) get **no** box and **no** agent name — that contrast is what makes the diagram readable at a glance.
4. **A labelled FEEDBACK LOOP section** wherever a build→review cycle exists. Draw it as a *closed* loop that visibly returns to the decision step — not as two sequential steps. The loop-back arrow must be drawn and labelled with what increments (`cycle++`), and the decision branches must show every exit condition and which ones stop for a human (⏸).
5. **Human gates marked `⏸`** — every point the orchestrator stops and waits, listed again in a short legend under the diagram.

### Shape to follow

```
AGENT ORCHESTRATION — /<command>
│
├─ Step 0 ── <orchestrator action, no agent>
│
├─ Step N ─→ ╔═ agent: <exact-subagent-name> ═╗
│                  └─→ <what it returns>
│
│   ┌───────────────── FEEDBACK LOOP ─────────────────┐
│   │                                                  │
├───┤  build ─→ ╔═ agent: <builder> ═╗                │
│   │              │                                   │
│   │              ▼                                   │
│   │  review ─→ ╔═ agent: <reviewer> ═╗               │
│   │              └─→ severity-tagged report          │
│   │              │                                   │
│   │  decide ◄────┘                                   │
│   │     ├─ READY TO PUSH ────→ exit loop ────────────┼──→ Step N+1
│   │     ├─ any MAJOR ────────→ ⏸ ask human          │
│   │     ├─ cycle == 3 ───────→ ⏸ ask human          │
│   │     └─ MINOR only ───────→ auto-proceed          │
│   │              │                                   │
│   │              └──── cycle++ ──── loop back ───────┘
│   └──────────────────────────────────────────────────┘
│
└─ Step Z ── summary ──→ ✋ NO git commands
```

Close with a one-line agent roster (`**Agents:** …`), the ⏸ gate legend, and — if a run of that workflow just happened in this session — one line on what actually occurred, including any step run out of order.
