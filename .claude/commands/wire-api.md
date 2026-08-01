# /wire-api

Wire an existing demo-dash UI screen to a live backend endpoint using the Redux Toolkit + Saga pattern.

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

Use the `demo-dash-api-wirer` agent for all implementation work. It contains the full Redux + Saga patterns, consistency rules, and architecture guidelines — do not duplicate them here.

Verification after implementation uses two agents in parallel: `demo-dash-api-reviewer` (code-level correctness) and `demo-dash-api-wiring-tester` (live functional behavior — data rendering, session persistence, pagination, form validation). See Step 7.

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

While reading the consumer, classify the **wiring type** — reused later in Step 7:
- **TABLE** — the consumer renders a `<DataTable>` / paginated list
- **FORM** — the consumer submits data via a modal/form (Add/Edit patterns)
- **DISPLAY** — a simple read-only load with no pagination or submission (most GET-detail wirings)

---

## Step 2 — Verify the API contract against the OpenAPI spec

**Before writing any plan**, confirm the endpoint's exact contract from the backend's OpenAPI spec. Do not make a live authenticated call to the endpoint at this stage, and do not rely on mock data.

The spec lives at:
`https://app-projex-api-dev-gvayezd2deh3cphf.newzealandnorth-01.azurewebsites.net/api-docs/openapi.json`

1. `WebFetch` the spec.
2. Find the path + method entry matching `<endpoint>`. Match tolerantly (trailing slash, `{param}` vs `:param` style) but confirm the exact match before proceeding.
3. **If the endpoint is not found in the spec, or the spec is unreachable: stop and tell the user.** Do not proceed to planning, and do not fall back to a live call. State exactly what was searched for, and if a near-miss exists (e.g. same resource, different path shape), surface it and ask the user to confirm before continuing.
4. Once matched, extract and record:
   - Exact path (cross-check against any existing constant in `apiPath.js` — flag if a differently-shaped constant already exists for what looks like the same resource)
   - Path parameters and query parameters (names, types, required/optional)
   - Request body schema for POST/PUT/PATCH — every field: name, type, required/optional, format, enum values, min/max (this feeds Step 3's edge cases and, for FORM wirings, Step 7's validation test case draft)
   - Response schema — top-level shape, every field name/type, which fields are nullable
5. Present a short confirmation before moving to Step 3:

   > **API contract confirmed from OpenAPI spec** — `<METHOD> <path>`. [N] request fields, [M] response fields. [Note any `apiPath.js` naming mismatch found, or "none".]

If a field's schema is ambiguous or self-contradictory (e.g. marked required but also nullable with no clear semantics), note it as an open question in the Step 3 plan rather than guessing.

---

## Step 3 — Plan

Produce a plan covering:

### Confirmed API contract
Show the request/response schema captured in Step 2 (abbreviated if large).

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

Use the `demo-dash-api-wirer` agent to apply exactly the changes described in the approved plan. Pass it:
- The confirmed API contract from Step 2
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

## Step 7 — Verification (Cycle 1): code review + functional test

Once the build is clean, run **two independent checks** in parallel.

### 7a — Code-level review

Spawn `demo-dash-api-reviewer` (subagent_type: "demo-dash-api-reviewer"). Pass it:
- Feature name and endpoint (from `$ARGUMENTS`)
- The confirmed API contract from Step 2
- The full list of files changed in Step 5
- The route and trigger instructions to reach the wired feature in the browser (e.g. "navigate to `/employees/246`, click the Timesheets tab, expand the current week row")
- Note: the OpenAPI cross-check in its Section 1 can be brief since Step 2 already confirmed the contract — its effort should focus on Sections 2–10

### 7b — Functional wiring test

Spawn `demo-dash-api-wiring-tester` (subagent_type: "demo-dash-api-wiring-tester"). Pass it:
- Feature name and endpoint
- The confirmed API contract from Step 2
- The full list of files changed in Step 5
- The route and trigger instructions
- The wiring type classified in Step 1 (`TABLE` / `FORM` / `DISPLAY`)
- Mode: `DRAFT` if wiring type is `FORM`, otherwise `FULL`

**If wiring type is FORM:** this pass returns only a draft test case list. Display it in full and stop:

> Here are the proposed validation test cases for `<FeatureName>`. Approve to run them, or edit the list first?

Wait for explicit approval. Once approved (with or without edits), resume the same agent (send the approved list back to its agent id) in `FULL` mode, and wait for its complete report before continuing.

**If wiring type is TABLE or DISPLAY:** the agent runs its applicable sections directly in this one call and returns a complete report — no extra gate needed.

Display both the 7a and 7b reports in full, exactly as produced.

---

## Step 8 — Decide what happens next (after every review cycle)

Combine the defect lists from **both** the 7a report (`defect_N` IDs) and the 7b report (`wtest_N` IDs) for this decision — do not treat them separately.

1. **If both verdicts are READY TO PUSH** — stop the loop. Go to Step 10.

2. **If cycle count has reached 3** — stop auto-proceeding. Show both reports and ask:

   > Cycle 3 of 3 complete. Defects remain (see above). Proceed with another fix cycle, or stop here?

   Wait for explicit response. If "proceed," continue looping but keep asking after every subsequent cycle.

3. **If any defect from either report is MAJOR** — always stop and ask, regardless of cycle count:

   > Cycle [N] — major defect(s) found. Proceed with fixes, or stop here?

   Wait for explicit response.

4. **If all defects across both reports are MINOR and cycle count ≤ 3** — auto-proceed to Step 9 without asking:

   > Cycle [N] — minor defects only. Auto-proceeding to fix cycle [N+1].

---

## Step 9 — Fix cycle

If proceeding (auto or human-approved):

Use the `demo-dash-api-wirer` agent to fix only the defects listed across both reports. Pass it:
- The defect IDs to fix and their descriptions (location, expected, actual) from both reports
- The files to edit (do not pass the full wiring context — only what is needed to fix these specific defects)
- Instruction: "Fix only [defect_N, defect_M, wtest_K, ...]. Do not re-implement the full wiring. Do not touch anything outside the defect locations."

After the wirer agent completes, re-run `CI=false npm run build` to confirm the build is still clean. If new errors are introduced, fix them inline before continuing.

Then re-run both checks in targeted mode:
- Spawn `demo-dash-api-reviewer` again, passing the `defect_N` IDs being re-checked, the same route/trigger info, and mode note: "targeted re-check of defect_N, defect_M — do not re-run the full 10-section checklist, only re-verify these specific defects plus a quick console + network check"
- Resume `demo-dash-api-wiring-tester` (or spawn fresh in `FULL` mode if the prior instance isn't addressable), passing the `wtest_N` IDs being re-checked plus the same route/trigger info and approved test case list from before, with the same targeted-recheck instruction

Record for each cycle: which defect IDs (from either report) were sent to the wirer and one line describing what actually changed for each. This log feeds Step 10.

Display both new reports in full. Increment cycle count. Return to Step 8.

---

## Step 10 — Summary, no git

Before the summary, show the cycle log:

```
### Review Cycle Report — [N] cycle(s) total
Cycle 1 — code review: [X] defect(s) ([A] major, [B] minor) · wiring test: [Y] defect(s) ([C] major, [D] minor)
Cycle 2 — fixed defect_1 (description), wtest_1 (description) → [resolved] resolved, [remaining] remaining
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
