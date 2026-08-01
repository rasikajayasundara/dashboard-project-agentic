# /update-UI

Update existing ProjeX UI — a page, a shared component, a modal, or another UI unit — using the `projex-ui-builder` agent, followed by an automated review-and-fix cycle with live Playwright checks.

**Usage:**
```
/update-UI page <PageName> — <what to change>
/update-UI component <ComponentName> — <what to change>
/update-UI modal <ParentName> <ModalAction> — <what to change>
/update-UI <other-type> <Name> — <what to change>
```

**Examples:**
```
/update-UI page Employees — add a Location column and a department breakdown stat card
/update-UI page Clients — replace the health tab with an industry tab, add tier filter
/update-UI component FilterBar — add a "clear all" button when any filter is active
/update-UI component ButtonStyled — add a "danger" variant
/update-UI modal Clients AddClient — add a tier dropdown field to the form
/update-UI tab ProjectDetail Timeline — add a filter for activity type
```

---

Use the `projex-ui-builder` agent for all UI changes. It contains the full design system, component patterns, and architecture guidelines — do not duplicate them here.

Given: `$ARGUMENTS`

## Step 0 — Parse the command

The first token in `$ARGUMENTS` is always the **type**. Parse according to type:

- **`page`** — second token is `<PageName>`. Everything after the dash is what's changing.
- **`component`** — second token is `<ComponentName>`. Everything after the dash is what's changing.
- **`modal`** — the next **two** tokens are `<ParentName>` then `<ModalAction>`, in that order (e.g. `modal Clients AddClient` → parent = `Clients`, action = `AddClient`). Do not collapse these into one name. Everything after the dash is what's changing.
- **Anything else** (e.g. `tab`, `panel`, `section`) — treat the second token as `<Name>`. State your interpretation of what's being targeted explicitly in Step 1's plan — do not silently assume; let the human catch a wrong inference at the approval gate.

If the parsed tokens don't make sense (missing name, missing parent for a modal, the named target doesn't appear to exist, etc.), stop and ask for clarification before planning anything.

---

## Step 1 — Read first, then plan

### If type is `page`

Read the existing files before planning:
- `src/pages/<PageName>/index.js`
- `src/pages/<PageName>/<pageName>.styles.js`

Produce a plan covering:
- What is changing — specific additions, removals, or modifications
- What is staying the same — what will not be touched
- Files to be edited
- Any regression risk (filter logic, tab counts, DataTable data shape)

### If type is `component`

Read the existing files before planning:
- `src/components/<ComponentName>/index.js`
- `src/components/<ComponentName>/component.styles.js`

Then search the codebase for all files that import this component.

Produce a plan covering:
- What is changing — props, styles, logic, or structure
- What is staying the same
- Whether the change is backwards-compatible or breaking
- Consumers that need updating if the change is breaking
- All files to be edited

### If type is `modal`

Read the existing files before planning:
- `src/pages/<ParentName>/modals/<ModalAction>.js` (and its `.styles.js` if it's a complex form modal), or the equivalent under a component's modals folder if the parent is a component, not a page

Produce a plan covering:
- What is changing in the modal — fields, validation, layout, button labels
- Whether this changes the modal's category (e.g. growing from a simple confirm into a form means moving it out of `modals/confirmations.js` into its own file)
- Files to be edited

### If type is anything else (inferred)

State explicitly in the plan: "Interpreting `<type> <Name>` as [your inferred meaning] because [reasoning]." Read the relevant existing files first, then produce a plan with what's changing, what's staying the same, and files to be edited.

---

## Step 1.5 — Build a live mockup artifact (required, every type, no exceptions)

Before asking for approval, build and publish a live, interactive HTML mockup of the change via the `Artifact` tool, following `projex-ui-builder.md` Section 0 exactly:

- Ground it in the **actual current file(s)** read in Step 1 — rebuild the real current layout faithfully first, then apply the planned change on top of that accurate baseline. This is a before/after comparison, not a reinterpretation from scratch
- Every color, type size, spacing, and radius comes from `projex-ui-builder.md` Section 1 (DESIGN SYSTEM) — nothing invented
- Frame it inside the real ProjeX chrome — sidebar, header, the actual tab bar/page header — reconstructed from the real components
- Bootstrap Icons are unreachable from the Artifact sandbox — hand-draw equivalent thin-stroke inline SVGs, don't substitute emoji
- If there's more than one reasonable way to make the change, build them into one artifact with a toggle, not separate links
- Load the `artifact-design` skill first, per the `Artifact` tool's own requirement

This is not optional for small changes either — adding one column or one field still gets a mockup.

---

**Stop and ask: "Does this plan and mockup look good? Should I proceed?"**

---

## Step 2 — Wait for approval

Do not edit any files until the user approves. If changes are requested, revise the plan and ask again.

---

## Step 2.5 — Authenticate (once per command run)

Before the first build/review cycle, log the Playwright browser session in **once**:

1. Navigate to the dev server's login route
2. Read `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` from the project's `.env` file — never ask the user to paste credentials into chat, never print them in any report or summary
3. Fill and submit the login form
4. Confirm the session landed past login (e.g. redirected to a dashboard/home route, not still on `/login`)

This authenticated session is then reused for every review cycle in this run — do not log in again per cycle. If login fails (wrong credentials, login route changed, etc.), stop here and tell the user rather than proceeding to build with no way to review.

If `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` aren't found in `.env`, stop and ask the user where test credentials are configured rather than guessing or proceeding without auth.

---

## Step 3 — Apply changes (Cycle 1)

Once approved, use the `projex-ui-builder` agent to apply only the changes described in the plan. Do not refactor or touch anything outside the agreed scope. If the change is breaking (component type), update all affected consumers in the same step — do not leave any consumer in a broken state.

After the change, spawn the `projex-ui-reviewer` subagent (subagent_type: "projex-ui-reviewer") in **FULL REVIEW** mode. Pass it:

- The original change spec from $ARGUMENTS
- The file path(s) of everything that was just edited
- A route to test on the dev server (assume already running unless told otherwise):
  - `page` — the page's own route
  - `component` — at least one consumer route where the component is rendered; if the component is used in multiple visually distinct contexts (e.g. inside both a list page and a detail tab), test more than one
  - `modal` — the parent page/component's route, plus the trigger action needed to open the modal
- Mode: FULL REVIEW
- Note that the browser session is already authenticated (from Step 2.5) — the reviewer must not attempt to log in itself

Display the reviewer's report in full, exactly as produced.

---

## Step 4 — Decide what happens next (run this after every cycle's review)

Apply this rule, in order:

1. **If verdict is BLOCKED (re-authentication needed)** — do not attempt to fix anything or continue the loop. Tell the user the session appears to have expired or been redirected to login mid-run, and ask whether to re-run Step 2.5 and retry this cycle, or stop here.

2. **If verdict is READY TO PUSH** — stop the loop. Go to Step 5.5.

3. **If cycle count has reached 3** — regardless of severity, stop auto-proceeding. Show the report and ask:

   > Cycle 3 of 3 complete. Defects remain (see above). Proceed with another fix cycle, or stop here?

   Wait for explicit response. If "proceed," continue looping but keep asking after every subsequent cycle — do not return to auto-proceed mode once the cap has been hit.

4. **If any defect in this cycle's report is tagged MAJOR** — always stop and ask, regardless of cycle count:

   > Cycle [N] of 3 — major defect(s) found. Proceed with fixes, or skip and stop here?

   Wait for explicit response.

5. **If all defects are MINOR and cycle count is ≤ 3** — auto-proceed to Step 5 without asking, but say so clearly:

   > Cycle [N] of 3 — minor defects only. Auto-proceeding to fix cycle [N+1].

---

## Step 5 — Fix cycle

If proceeding (auto or human-approved):

Use the `projex-ui-builder` agent to fix only the defects listed in the latest reviewer report (by defect ID, location, expected vs actual). Do not redo the whole change and do not touch unrelated code or consumers outside what was already identified as needing updates.

Record, for this cycle, the defect IDs sent to the builder and a one-line description of what was actually changed for each (e.g. `defect_2: moved donut chart logic into <DonutChart>`). This running log is required input for the cycle report in Step 7 — keep it updated every cycle, do not reconstruct it from memory at the end.

After the fix, spawn `projex-ui-reviewer` again in **TARGETED RE-REVIEW** mode, passing the defect IDs from the previous cycle and the same route/trigger info used in Step 3. Reuse the existing authenticated session — do not re-run Step 2.5 unless Step 4 sent you back here specifically to re-authenticate.

Display the new report. Increment cycle count. Return to Step 4.

---

## Step 5.5 — Accessibility check

Once `projex-ui-reviewer` reaches READY TO PUSH, spawn the `projex-a11y-check` subagent (subagent_type: "projex-a11y-check") to run a deterministic WCAG 2.1 AA scan:

- **`component` type**: run in COMPONENT mode — pass the updated component's rendered HTML.
- **`page` type or `modal` type**: run in PAGE mode — pass the same route (and, for a modal, the trigger action) used for the reviewer in Step 3, since the browser session is already authenticated.

Display the report in full. If the verdict is `MAJOR VIOLATIONS PRESENT`, stop and ask:

> Accessibility check found major violation(s) (see above). Proceed to verify / summary anyway, or send this back to `projex-ui-builder` for a fix cycle first?

If the user asks for a fix, use `projex-ui-builder` to address the listed violations only, then re-run `projex-a11y-check` once (do not loop indefinitely — this follows the same 3-cycle discipline as the UI review loop, counted against the same cycle total). Otherwise, or once violations are resolved/minor-only, continue to Step 6.

---

## Step 6 — Verify

After the loop ends in READY TO PUSH (or you choose to stop early), confirm based on type:

- **page**: Column `index` values still align with positions in `toTableData()`; every tab key in `TABS` is handled in `matchesTab()`; every filter key in `<PAGE>_FILTERS` has a guard in the `filtered` useMemo; all imports complete, no unused exports
- **component**: New optional props have defaults so existing consumers are unaffected; all transient styled-component props use the `$` prefix; every new export from `component.styles.js` is imported in `index.js`; all consumers identified in Step 1 still work with the updated interface
- **modal**: Form fields match the plan; validation behaves as expected; modal still opens/closes correctly from its trigger
- **inferred types**: whatever verification is sensible given what was actually changed

Report the result explicitly.

---

## Step 7 — Summary, no git

Before the rest of the summary, always show a full cycle-by-cycle report, even if only one cycle ran:

```
### Cycle Report — [N] cycle(s) total
Cycle 1 — FULL REVIEW: [X] defect(s) found ([A] MAJOR, [B] MINOR)
Cycle 2 — fixed defect_1, defect_2: [one-line description of each fix] → TARGETED RE-REVIEW: [resolved] resolved, [remaining] remaining
Cycle 3 — fixed defect_3: [one-line description] → TARGETED RE-REVIEW: [resolved] resolved, [remaining] remaining
...
Final verdict: [READY TO PUSH | NEEDS FIXES (...) | stopped early by user at cycle N]
```

Use the per-cycle fix log recorded during Step 5 for the "fixed ..." lines — do not summarize from memory. If the loop stopped early (user declined another cycle, or stuck at BLOCKED), say so explicitly in the final verdict line instead of READY TO PUSH.

Then report what was changed, any consumers updated or Redux wiring still needed, and any defects left unresolved if stopped early.

**Do not run any git commands. Wait for the user to ask.**
