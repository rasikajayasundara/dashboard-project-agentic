# /audit-dead-code

Run a static, read-only scan of the demo-dash frontend for orphaned code — unregistered or unused Redux slices, unreferenced pages/components, unused styled-component exports, dangling route/nav links, and unused `apiPath.js` constants — using the `demo-dash-dead-code-auditor` agent.

This command never deletes or edits anything. It produces a report and stops. Deleting anything it finds is a separate, explicit decision — this command doesn't make it for you.

**Usage:**
```
/audit-dead-code                        (scans the whole src/ tree)
/audit-dead-code employeesSlice         (scans one slice)
/audit-dead-code Employees page         (scans one page)
/audit-dead-code AppSidebar              (scans one component)
```

Given: `$ARGUMENTS`

---

## Step 1 — Determine scope

If `$ARGUMENTS` is empty, scope is `FULL` (entire `src/`).

If `$ARGUMENTS` names something, resolve it against the actual project structure (`src/store/`, `src/pages/`, `src/components/`) the same way `/review-UI` resolves targets — infer from plain language, don't require exact folder-name syntax. If it can't be resolved with reasonable confidence, ask rather than guess (a wrong scope means auditing the wrong thing and reporting nothing useful).

State the resolved scope back in one line before proceeding, e.g. "Auditing: entire src/ tree" or "Auditing: employeesSlice only".

---

## Step 2 — Run the audit

Spawn `demo-dash-dead-code-auditor` (subagent_type: "demo-dash-dead-code-auditor"), passing the resolved scope from Step 1.

Display the report in full, exactly as produced.

---

## Step 3 — Summary, no action taken

Do not act on any finding automatically — not even CONFIRMED ones. If the report has findings, close with:

> Found [N] CONFIRMED and [M] LIKELY dead-code candidates (see report above). Want me to remove any of these? Point me at specific finding IDs, or say "all confirmed" — I won't delete anything without you naming what to remove.

If the user asks for removal, edit the named files directly (this is simple deletion of already-identified dead code, not a task that needs its own agent) — remove the finding's file/export/registration, then run `CI=false npm run build` to confirm nothing broke, and report the result. If a build error appears after removing something the auditor marked CONFIRMED, stop, restore that specific change, and tell the user the finding was a false positive (the grep-based check missed a real reference) rather than pushing through.

**Do not run any git commands. Do not commit. Do not push. Wait for the user to ask.**
