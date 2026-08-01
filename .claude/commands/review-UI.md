# /review-UI

Review existing demo-dash UI — already built pages, components, or modals — using the `demo-dash-ui-reviewer` agent, with the same severity-gated review-fix cycle used by `/generate-UI` and `/update-UI`. Unlike those two commands, this one doesn't build anything first; it reviews what's already there and only invokes the builder if you choose to fix what's found.

**Usage:**

Just describe what you want reviewed, in plain language:
```
/review-UI check the invoice page for mobile responsiveness
/review-UI review the clients page, focus on accessibility
/review-UI look at the add client modal and check form validation
/review-UI review Employees, Clients, and Projects pages
/review-UI check DataTable
```

A short structured form also works if you prefer it (`<type> <Name>`, e.g. `/review-UI page Clients`), but it's not required — the command reads whatever you type as a normal sentence.

**More examples:**
```
/review-UI Invoices page — also check that overdue rows are sorted to the top
/review-UI sweep page Employees, Clients, Projects
/review-UI sweep component StatusBadge, DataTable, FilterBar
```

---

This command never calls `demo-dash-ui-builder` on its own — it only reviews. The builder is invoked later, in the fix cycle, and only if you approve fixing what was found (or it's minor-only and auto-proceeding, same rule as the other two commands).

Given: `$ARGUMENTS`

## Step 0 — Understand the request

Read `$ARGUMENTS` as a normal sentence, the way you'd understand a teammate asking you to check something — not as a structured command with fixed positions or required separators. There is no fixed syntax to match against. Figure out:

1. **What kind of thing is being reviewed** — a page, a shared component, or a modal. Infer this from context (e.g. "invoice page" → page, "the DataTable component" → component, "the add client popup/modal" → modal). If it's ambiguous between page and component, prefer whichever actually exists in the codebase under that name.

2. **Which specific one(s).** Match the name mentioned to the actual project naming convention (PascalCase folder names under `src/pages/` or `src/components/`) — e.g. "invoice page" → `Invoices`, "the clients page" → `Clients`. If multiple targets are named (a list, "and", commas), treat it as a sweep — review each independently through Steps 1–5, same as before. For a modal, also work out which page/component it belongs under; if that's genuinely not inferable from what was said, ask rather than guess, since a wrong guess means reviewing the wrong file.

3. **What to focus on, if anything.** Anything in the sentence describing *what to pay attention to* — a breakpoint, a behaviour, an interaction, an area of concern ("mobile", "accessibility", "make sure the form validates", "check it looks right on tablet") — becomes a focus note. If the note names a specific breakpoint or device class, tell the reviewer to still run the full standard checklist but give Section 8's visual/responsive check extra depth at that breakpoint specifically (e.g. tap targets, menu collapse, horizontal scroll at mobile width), without skipping the other breakpoints. If nothing specific is mentioned, there's no focus note — review runs at standard depth across the board.

Before proceeding, state your understanding back in one short line — e.g. "Reviewing: Invoices page, with extra focus on mobile responsiveness" — so you can catch a wrong read immediately rather than after a full cycle runs against the wrong thing.

Only stop and ask if the request genuinely can't be resolved with reasonable confidence — no nameable target exists, multiple equally-likely targets share a name, or a modal's parent truly can't be inferred. Otherwise, proceed on your best understanding and let the one-line confirmation be the safety check.

---

## Step 1 — Confirm the target exists

demo-dash does not maintain spec files for already-built pages/components — the original generation source is the Figma reference file plus the `demo-dash-ui-builder` design system rules, not a saved spec document. So for a standalone review, there is normally **no original spec to compare against** unless a focus note from Step 0 effectively supplies one (e.g. "make sure it matches what we agreed for the budget tab" gives the reviewer something concrete to check against).

Given that:
- If a focus note was identified in Step 0 that describes intended behaviour or content (not just "look at mobile" or "check accessibility"), that note **is** the spec for this review's Section 1 (Spec Alignment) check.
- If the focus note is purely about an area of attention (a breakpoint, a general quality concern) rather than a description of intended functionality, Section 1 has nothing concrete to check against. The reviewer should say so plainly ("no spec provided for this review — skipping spec-alignment comparison, all other sections run as normal") rather than inventing one or treating it as a blocking problem.

Confirm the target's file(s) exist before proceeding:
- `page` — `src/pages/<PageName>/index.js`
- `component` — `src/components/<ComponentName>/index.js`
- `modal` — `src/pages/<ParentName>/modals/<ModalAction>.js` (or the equivalent under a component's modals folder if the parent is a component, not a page)

If the named target doesn't exist, stop and tell the user rather than guessing at a similar name.

---

## Step 1.5 — Authenticate (once per command run, not per target)

Before the first review, log the Playwright browser session in **once** for this entire command run — even across multiple targets in a sweep:

1. Navigate to the dev server's login route
2. Read `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` from the project's `.env` file — never ask the user to paste credentials into chat, never print them in any report or summary
3. Fill and submit the login form
4. Confirm the session landed past login (e.g. redirected to a dashboard/home route, not still on `/login`)

Reuse this same session for every target and every cycle in this run. If login fails, stop here and tell the user. If `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` aren't found in `.env`, stop and ask where test credentials are configured.

---

## Step 2 — Review (Cycle 1, per target)

Spawn the `demo-dash-ui-reviewer` subagent (subagent_type: "demo-dash-ui-reviewer") in **FULL REVIEW** mode. Pass it:

- Any focus note identified in Step 0 (this is the only spec source for standalone review — say explicitly if none was given, so the reviewer knows to skip Section 1's comparison rather than guess at intent)
- If the focus note names a specific breakpoint or device class (mobile, tablet, desktop, "small screens", etc.), tell the reviewer to still run the full standard checklist but give Section 8's visual/responsive check extra scrutiny at that breakpoint specifically — e.g. additional interaction checks (tap targets, menu collapse behaviour, horizontal scroll) at 375px, not just the standard single screenshot. The other breakpoints are still checked, just without the same depth.
- The target file(s)
- A route to test on the dev server (already authenticated from Step 1.5):
  - `page` — the page's own route
  - `component` — at least one consumer route where the component is rendered; test more than one if it's used in visually distinct contexts
  - `modal` — the parent page/component's route, plus the trigger action needed to open the modal
- Mode: FULL REVIEW
- Note explicitly that this is a standalone review (no fresh build just happened) — the reviewer's checklist and behaviour are otherwise unchanged

Display the reviewer's report in full, exactly as produced.

---

## Step 3 — Decide what happens next (run this after every cycle's review, per target)

Apply this rule, in order:

1. **If verdict is BLOCKED (re-authentication needed)** — do not attempt to fix anything or continue this target's loop. Tell the user the session appears to have expired, and ask whether to re-run Step 1.5 and retry, or stop here.

2. **If verdict is READY TO PUSH** — nothing to fix from `demo-dash-ui-reviewer`. Go to Step 3.5 for this target before moving on.

3. **If cycle count has reached 3 for this target** — regardless of severity, stop auto-proceeding. Show the report and ask:

   > Cycle 3 of 3 complete for [target]. Defects remain (see above). Proceed with another fix cycle, or stop here and move on?

   Wait for explicit response. If "proceed," continue looping but keep asking after every subsequent cycle for this target.

4. **If any defect in this cycle's report is tagged MAJOR** — always stop and ask, regardless of cycle count:

   > Cycle [N] of 3 for [target] — major defect(s) found. Proceed with fixes, or skip this target and move on?

   Wait for explicit response.

5. **If all defects are MINOR and cycle count is ≤ 3** — auto-proceed to Step 4 without asking, but say so clearly:

   > Cycle [N] of 3 for [target] — minor defects only. Auto-proceeding to fix cycle [N+1].

---

## Step 4 — Fix cycle (per target, only if proceeding)

This is the only step where `demo-dash-ui-builder` gets called.

Use the `demo-dash-ui-builder` agent to fix only the defects listed in the latest reviewer report (by defect ID, location, expected vs actual) for this target. Do not regenerate from scratch and do not touch unrelated code.

After the fix, spawn `demo-dash-ui-reviewer` again in **TARGETED RE-REVIEW** mode, passing the defect IDs from the previous cycle and the same route/trigger info used in Step 2.

Display the new report. Increment cycle count for this target. Return to Step 3.

---

## Step 3.5 — Accessibility check (per target)

Once `demo-dash-ui-reviewer` reaches READY TO PUSH for a target, spawn the `demo-dash-a11y-check` subagent (subagent_type: "demo-dash-a11y-check") to run a deterministic WCAG 2.1 AA scan:

- **component target**: run in COMPONENT mode — pass the component's rendered HTML from a consumer route.
- **page or modal target**: run in PAGE mode — pass the same route (and, for a modal, the trigger action) used for the reviewer in Step 2, reusing the already-authenticated session.

Display the report in full. If the verdict is `MAJOR VIOLATIONS PRESENT`, stop and ask:

> Accessibility check found major violation(s) for [target] (see above). Move on to the next target / summary anyway, or send this back to `demo-dash-ui-builder` for a fix cycle first?

If the user asks for a fix, use `demo-dash-ui-builder` to address the listed violations only, then re-run `demo-dash-a11y-check` once (same 3-cycle cap as the UI review loop for this target, not a separate budget). Otherwise, or once violations are resolved/minor-only, move to the next target in the queue (if sweep), or go to Step 5.

---

## Step 5 — Summary, no git

If this was a sweep, report results for every target: final verdict, cycles run, and any defects left unresolved per target — not just the last one processed.

If this was a single target, report final verdict, total cycles run, and any defects left unresolved if stopped early.

**Do not run any git commands. Wait for the user to ask.**
