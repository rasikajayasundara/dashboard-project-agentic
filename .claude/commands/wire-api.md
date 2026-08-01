# /wire-api

Wire an existing ProjeX UI screen to a live backend endpoint using the Redux Toolkit + Saga pattern.

**Usage:**
```
/wire-api <FeatureName> — <endpoint> — <what to wire>
```

**Examples:**
```
/wire-api TimesheetEntries — GET timesheets/timeEntries/{weekStart}/{empId}/{timesheetId} — fetch and display per-day time entries when a week row is expanded
/wire-api LogTimeModal — GET timesheets/{empId}/tasks/{date} — replace mock task list with live allocated tasks and already-logged entries
/wire-api EmployeeTasks — GET taskAss/{userId}/byUser — replace MOCK_TASKS with real assigned task list
/wire-api ClientDetail — GET clients/{clientId} — load client info into the detail page header
```

---

Use the `projex-api-wirer` agent for all implementation work. It contains the full Redux + Saga patterns, consistency rules, and architecture guidelines — do not duplicate them here.

Given: `$ARGUMENTS`

---

## Step 1 — Parse and read

Parse `$ARGUMENTS`:
- Token before the first ` — ` is `<FeatureName>`
- Token between the two ` — ` separators is `<endpoint>` (HTTP method + URL pattern)
- Everything after the second ` — ` is the wiring description

If parsing fails (missing separators, missing feature name, missing endpoint), stop and ask for clarification.

Read the relevant existing files:
- The page or component the user wants wired (search under `src/pages/` and `src/components/`)
- The slice that owns this feature (search under `src/store/` — check `rootReducer.js` to confirm what exists)
- `src/config/apiPath.js` — check for existing path constants that might already cover this endpoint
- `src/store/rootReducer.js` and `src/store/rootSaga.js` — check what slices are already registered

---

## Step 2 — Verify the actual API response

**Before writing any plan**, make a live authenticated call to confirm the real response shape. Do not rely on the OpenAPI spec or mock data — both are known to diverge from the deployed API.

To get an auth token:
1. Navigate to the dev server (`http://localhost:3000`) — if the session is already logged in it will redirect to dashboard
2. Capture a network request's Authorization header by navigating to a page that makes API calls (e.g. `/employees/246`) and reading a recent request via `browser_network_requests` + `browser_network_request`
3. Use the captured Bearer token in a `browser_evaluate` fetch call to hit the real endpoint

If the dev server is not running or the API is unreachable, stop and tell the user. Do not proceed with plan based on assumed response shape.

Once the live response is confirmed:
- Record the exact top-level response shape (`{ success, message, data: { ... } }` vs `{ success, message, data: [...] }`)
- Record every field name and its type (including whether numbers come back as strings like `"15.00"`)
- Note any fields that are `null` in the response
- Note any nested structures

---

## Step 3 — Plan

Produce a plan covering:

### Confirmed API response
Show the actual response shape captured in Step 2 (abbreviated if large).

### Field mapping table
Map every mock/hardcoded field the UI currently uses to the real API field name:

| Current UI field | Real API field | Transform needed |
|---|---|---|
| `task.id` | `task.assignmentId` | none |
| `task.allocated` | `task.allocatedHours` | `Number()` — API returns string |
| … | … | … |

### Files to change (in implementation order)
1. `src/config/apiPath.js` — new constant(s) to add
2. `src/store/<slice>/api.js` — new API function
3. `src/store/<slice>/index.js` — new state fields + reducers
4. `src/store/<slice>/saga.js` — new worker + watcher
5. `src/store/rootReducer.js` / `rootSaga.js` — only if brand-new slice
6. `src/pages/.../index.js` or `src/components/.../index.js` — consumer update

### What stays the same
List anything that will not be touched.

### Destructive operations (DELETE and irreversible mutations)
If the HTTP method is DELETE (or any action that permanently destroys data), the plan MUST include a `ConfirmDialog` gate. Never wire a destructive action to fire immediately on button click. The pattern:
- Button click → sets a `confirmPendingEntry` (or similar) state variable to the entity being deleted
- `<ConfirmDialog>` renders conditionally on that variable with `variant="danger"`, a clear message (include entity name/hours so user knows exactly what is being deleted), and `confirmLabel="Delete"`
- Actual dispatch happens only inside `onConfirm`; `onCancel` clears the state variable

List the `ConfirmDialog` component file and the parent page as explicit files to change.

### Edge cases
Call out any non-obvious handling:
- `null` timesheetId → use `weekStartDate` as cache key
- Timezone: date objects → use `toLocalISO()` not `.toISOString()`
- Concurrent fetches → `takeEvery` with cache key vs `takeLatest`
- Numeric strings → coerce with `Number()` before use
- Null date fields → guard before formatting

---

**Stop and ask: "Does this plan look good? Should I proceed?"**

---

## Step 4 — Wait for approval

Do not edit any files until the user approves. If changes are requested, revise the plan and ask again.

---

## Step 5 — Implement

Use the `projex-api-wirer` agent to apply exactly the changes described in the approved plan. Pass it:
- The confirmed API response shape from Step 2
- The field mapping table from Step 3
- The ordered list of files to change
- All edge cases identified in the plan

The agent implements in this strict order:
1. `apiPath.js`
2. `api.js`
3. `index.js` (slice)
4. `saga.js`
5. `rootReducer.js` / `rootSaga.js` (only if new slice)
6. Page / component

---

## Step 6 — Build verification

After implementation, run a compile check:

```
CI=false npm run build
```

- **Zero errors** — proceed to Step 7
- **Errors present** — show the errors, fix them inline (do not spawn a new agent for simple import/typo fixes), re-run the build, confirm clean before Step 7
- **Warnings only** — acceptable; note any new warnings introduced (pre-existing warnings are not a concern)

---

## Step 7 — API integration review (Cycle 1)

Once the build is clean, spawn the `projex-api-reviewer` subagent (subagent_type: "projex-api-reviewer"). Pass it:

- Feature name and endpoint (from `$ARGUMENTS`)
- The confirmed live API response shape from Step 2
- The full list of files changed in Step 5
- The route and trigger instructions to reach the wired feature in the browser (e.g. "navigate to `/employees/246`, click the Timesheets tab, expand the current week row")
- The bearer token captured in Step 2, or instruction to capture a fresh one via `browser_network_requests`

Display the reviewer's report in full, exactly as produced.

---

## Step 8 — Decide what happens next (after every review cycle)

Apply this rule, in order:

1. **If verdict is READY TO PUSH** — stop the loop. Go to Step 10.

2. **If cycle count has reached 3** — stop auto-proceeding. Show the report and ask:

   > Cycle 3 of 3 complete. Defects remain (see above). Proceed with another fix cycle, or stop here?

   Wait for explicit response. If "proceed," continue looping but keep asking after every subsequent cycle.

3. **If any defect is MAJOR** — always stop and ask, regardless of cycle count:

   > Cycle [N] — major defect(s) found. Proceed with fixes, or stop here?

   Wait for explicit response.

4. **If all defects are MINOR and cycle count ≤ 3** — auto-proceed to Step 9 without asking:

   > Cycle [N] — minor defects only. Auto-proceeding to fix cycle [N+1].

---

## Step 9 — Fix cycle

If proceeding (auto or human-approved):

Use the `projex-api-wirer` agent to fix only the defects listed in the reviewer report. Pass it:
- The defect IDs to fix and their descriptions (location, expected, actual) from the reviewer report
- The files to edit (do not pass the full wiring context — only what is needed to fix these specific defects)
- Instruction: "Fix only defect_N, defect_M. Do not re-implement the full wiring. Do not touch anything outside the defect locations."

After the wirer agent completes, re-run `CI=false npm run build` to confirm the build is still clean. If new errors are introduced, fix them inline before continuing.

Then spawn `projex-api-reviewer` again, passing:
- The defect IDs being re-checked
- The same route/trigger info used in Step 7
- Mode note: "targeted re-check of defect_N, defect_M — do not re-run the full 10-section checklist, only re-verify these specific defects plus a quick console + network check"

Record for each cycle: which defect IDs were sent to the wirer and one line describing what actually changed for each. This log feeds Step 10.

Display the new reviewer report in full. Increment cycle count. Return to Step 8.

---

## Step 10 — Summary, no git

Before the summary, show the cycle log:

```
### Review Cycle Report — [N] cycle(s) total
Cycle 1 — [X] defect(s) found ([A] major, [B] minor)
Cycle 2 — fixed defect_1 (description), defect_2 (description) → [resolved] resolved, [remaining] remaining
...
Final verdict: [READY TO PUSH | NEEDS FIXES (...) | stopped by user at cycle N]
```

Then report:

```
### API Wiring Summary — <FeatureName>

**Endpoint:** <METHOD> <path>
**Slice:** <sliceName> (new | extended)

**Files changed:**
- src/config/apiPath.js — added <CONSTANT_NAME>
- src/store/<slice>/api.js — added <functionName>
- src/store/<slice>/index.js — added <state fields> + <reducer names>
- src/store/<slice>/saga.js — added <workerName>, registered with <takeLatest|takeEvery>
- src/pages/.../index.js — replaced <mock/prop> with useSelector + useEffect dispatch

**Field mappings applied:**
- <mock field> → <api field> [+ transform if any]
- ...

**Edge cases handled:**
- [list each one]

**Build:** clean (0 errors, N warnings)
```

**Do not run any git commands. Do not commit. Do not push. Wait for the user to ask.**
