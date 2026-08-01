# /generate-UI

Generate new ProjeX UI — a page, a shared component, a modal, or another UI unit — using the `projex-ui-builder` agent, followed by an automated review-and-fix cycle with live Playwright checks.

**Usage:**
```
/generate-UI page <PageName> — <description>
/generate-UI component <ComponentName> — <description>
/generate-UI modal <ParentName> <ModalAction> — <description>
/generate-UI <other-type> <Name> — <description>
```

**Examples:**
```
/generate-UI page Timesheets — weekly time entries per employee
/generate-UI page ClientDetail — client profile with projects and invoices tabs
/generate-UI component RatingStars — 5-star rating input, used in feedback forms
/generate-UI modal Clients AddClient — form to create a new client record
/generate-UI modal ProjectDetail LogTime — log time against a project task
/generate-UI tab ProjectDetail Timeline — new tab showing project activity history
```

---

Use the `projex-ui-builder` agent for all UI generation. It contains the full design system, component patterns, and architecture guidelines — do not duplicate them here.

Given: `$ARGUMENTS`

## Step 0 — Parse the command

The first token in `$ARGUMENTS` is always the **type**. Parse according to type:

- **`page`** — second token is `<PageName>`. Everything after the dash is the description.
- **`component`** — second token is `<ComponentName>`. Everything after the dash is the description.
- **`modal`** — the next **two** tokens are `<ParentName>` then `<ModalAction>`, in that order (e.g. `modal Clients AddClient` → parent = `Clients`, action = `AddClient`). Do not collapse these into one name. Everything after the dash is the description.
- **Anything else** (e.g. `tab`, `panel`, `section`) — treat the second token as `<Name>`. State your interpretation of what's being requested explicitly in Step 1's plan — do not silently assume; let the human catch a wrong inference at the approval gate.

If the parsed tokens don't make sense (missing name, missing parent for a modal, etc.), stop and ask for clarification before planning anything.

---

## Step 1 — Plan first

### If type is `page`

**Folder structure rule (mandatory):**
Every page — whether list or detail — gets its own top-level folder under `src/pages/`:
- List page: `src/pages/Clients/` (not nested inside another page)
- Detail page: `src/pages/ClientDetail/` (NOT `src/pages/Clients/clientDetail/`)

This mirrors the existing pattern: `src/pages/Employees/` + `src/pages/EmployeeDetail/` are siblings, never nested.

Produce a plan covering:
- File paths to be created — always `src/pages/<PageName>/index.js`, `src/pages/<PageName>/<pageName>.styles.js`, and any tab subfolders (e.g. `src/pages/<PageName>/Overview/index.js`)
- For detail pages: header component file, tab subfolder files
- For list pages: columns (key, label, cell type), filters (keys and mock options), tabs (keys and what each filters for)
- Stat cards — 4 entries with labels, values, and accent colors
- Route — URL path, which routing file it goes in, and whether an existing import needs updating
- Shared components to be used

### If type is `component`

Produce a plan covering:
- File paths: `src/components/<ComponentName>/index.js`, `src/components/<ComponentName>/component.styles.js`
- Props — name, type, required/optional, defaults
- Whether this duplicates or overlaps an existing component in `src/components/` (check first — flag if so, since the builder should not create a near-duplicate)
- Shared components/tokens to be used internally

### If type is `modal`

Produce a plan covering:
- Is this a **simple confirm** (message + two buttons, no form — use `<ActionModal>`, goes in `modals/confirmations.js`) or a **complex form modal** (custom Overlay + ModalBox pattern, own file)?
- File path: `src/pages/<ParentName>/modals/<ModalAction>.js` (and matching `<modalAction>.styles.js` if complex), or the equivalent under a component's modals folder if the parent is a component, not a page
- Whether `<ParentName>` and its `modals/` folder already exist — read first before planning
- Fields/sections for a complex form; message and button labels for a simple confirm
- How the modal will be triggered (which button/action opens it) — note if it's not yet wired to anything, since unwired modals stay at the root per the builder's dead-code rules until connected

### If type is anything else (inferred)

State explicitly in the plan: "Interpreting `<type> <Name>` as [your inferred meaning] because [reasoning]." Then produce a plan with file paths, what's being created, and how it fits the existing structure (tab subfolder, panel section, etc.) per the builder agent's folder rules.

---

## Step 1.5 — Build a live mockup artifact (required, every type, no exceptions)

Before asking for approval, build and publish a live, interactive HTML mockup of the plan via the `Artifact` tool, following `projex-ui-builder.md` Section 0 exactly:

- Every color, type size, spacing, and radius comes from that agent file's Section 1 (DESIGN SYSTEM) — nothing invented
- Frame it inside the real ProjeX chrome — sidebar, header, and the actual tab bar/page header of whatever it attaches to — reconstructed from the real components, not imagined
- Bootstrap Icons are unreachable from the Artifact sandbox — hand-draw equivalent thin-stroke inline SVGs, don't substitute emoji
- If the plan has more than one reasonable direction worth showing, build them into one artifact with a toggle, not separate links
- Load the `artifact-design` skill first, per the `Artifact` tool's own requirement

This is not optional for simple changes either — a one-field addition still gets a mockup, since the point is the human reviews something they can see, not a bullet list they have to imagine.

---

**Stop and ask: "Does this plan and mockup look good? Should I proceed?"**

---

## Step 2 — Wait for approval

Do not create any files until the user approves. If changes are requested, revise the plan and ask again.

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

## Step 3 — Build (Cycle 1)

Once approved, use the `projex-ui-builder` agent to generate the files exactly as planned.

After the builder completes, spawn the `projex-ui-reviewer` subagent (subagent_type: "projex-ui-reviewer") in **FULL REVIEW** mode. Pass it:

- The original spec from $ARGUMENTS
- The file path(s) of everything that was just generated
- A route to test on the dev server (assume already running unless told otherwise):
  - `page` — the new page's own route
  - `component` — a route where the component is rendered, or a sandbox/demo route if one exists
  - `modal` — the parent page/component's route, plus the trigger action needed to open the modal so the reviewer can exercise it
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

Use the `projex-ui-builder` agent to fix only the defects listed in the latest reviewer report (by defect ID, location, expected vs actual). Do not regenerate from scratch and do not touch unrelated code.

Record, for this cycle, the defect IDs sent to the builder and a one-line description of what was actually changed for each (e.g. `defect_2: moved donut chart logic into <DonutChart>`). This running log is required input for the cycle report in Step 7 — keep it updated every cycle, do not reconstruct it from memory at the end.

After the fix, spawn `projex-ui-reviewer` again in **TARGETED RE-REVIEW** mode, passing the defect IDs from the previous cycle and the same route/trigger info used in Step 3. Reuse the existing authenticated session — do not re-run Step 2.5 unless Step 4 sent you back here specifically to re-authenticate.

Display the new report. Increment cycle count. Return to Step 4.

---

## Step 5.5 — Accessibility check

Once `projex-ui-reviewer` reaches READY TO PUSH, spawn the `projex-a11y-check` subagent (subagent_type: "projex-a11y-check") to run a deterministic WCAG 2.1 AA scan:

- **`component` type**: run in COMPONENT mode — pass the generated component's rendered HTML.
- **`page` type or `modal` type**: run in PAGE mode — pass the same route (and, for a modal, the trigger action) used for the reviewer in Step 3, since the browser session is already authenticated.

Display the report in full. If the verdict is `MAJOR VIOLATIONS PRESENT`, stop and ask:

> Accessibility check found major violation(s) (see above). Proceed to route check / summary anyway, or send this back to `projex-ui-builder` for a fix cycle first?

If the user asks for a fix, use `projex-ui-builder` to address the listed violations only, then re-run `projex-a11y-check` once (do not loop indefinitely — this follows the same 3-cycle discipline as the UI review loop, counted against the same cycle total). Otherwise, or once violations are resolved/minor-only, continue to Step 6.

---

## Step 6 — Route check (page type only)

If type is `page`, after the loop ends in READY TO PUSH (or you choose to stop early):
- Locate the routing config and add the new route
- Confirm the path, import, and that no existing routes are affected

For `component` and `modal` types, skip this step — there is no route to register.

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

Then report what was created (files, columns/props/fields as relevant to type), route added (if applicable), and any defects left unresolved if stopped early.

**Do not run any git commands. Wait for the user to ask.**
