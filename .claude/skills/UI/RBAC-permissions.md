# RBAC / Permission Checks

Quick-reference for gating any UI element (button, menu item, nav link, route, form section) behind a permission. Read this before adding a permission check anywhere in ProjeX.

---

## 1. WHERE PERMISSIONS COME FROM

On login, the backend returns `data.modules` — a flat array of granted permission codes (e.g. `"PRO01"`, `"EMP03"`). `getPermissionFlags()` (`src/config/permissionHandler.js`) turns that into a flat object of camelCase booleans on `state.login.permissions`, using `src/jsons/permissionsList.json` as the code → flag map:

```json
"projects": [
  { "action": "project:add",    "action_code": "PRO01" },
  { "action": "project:read",   "action_code": "PRO02" },
  { "action": "project:update", "action_code": "PRO03" },
  { "action": "project:delete", "action_code": "PRO04" }
]
```

`toKey("project:add")` → `can` + `Project` (entity, capitalized) + `Add` (type, capitalized) → **`canProjectAdd`**. The flag name is always fully derived from the module/action names in `permissionsList.json` — there's no separate naming step, so pick `entity`/`type` words in that file with the resulting `canXY` name already in mind.

**Never invent a `permissionsList.json` entry speculatively.** If a backend code shows up in a user's `modules` array (visible via `browser_network_requests` on the login/refresh response) but has no mapping, it silently produces no flag and can't gate anything — that's a real gap (see the `CNF001` case below), not a hypothetical one. Confirm the code is actually present in a real login response before adding it.

---

## 2. THE TWO SHARED PRIMITIVES

```js
import { usePermission } from "../../hooks/usePermission";
import PermissionGate from "../../components/PermissionGate";
```

`usePermission(can)` — `can` is a single key (`"canProjectAdd"`) or an array (requires **all** of them). Returns a boolean. Use it whenever you need the boolean as a local variable (combining with a business rule, driving `disabled`, etc.).

`<PermissionGate can="canProjectAdd">...</PermissionGate>` — thin wrapper over the hook for a standalone block of JSX that should simply not render when unauthorized. Takes an optional `fallback` (default `null`).

Both read `state.login.permissions` directly — never destructure `permissions` from `useSelector` and inline `permissions?.canX &&` checks in new code; that's the pre-RBAC pattern this replaced.

---

## 3. WHICH ONE TO USE — HIDE vs DISABLE

This is the one judgment call every gate requires. Two established patterns, pick by what the control *is*:

**Hide entirely** (`<PermissionGate>` around the button, or `show: <bool>` on an `OptionsMenu` item) — for controls that only trigger an action and carry no information of their own when absent:
- Standalone "Add X" buttons (Add Project, Add Budget, Add Task, New Invoice, Add Assignment)
- `OptionsMenu` items: Edit / Delete / workflow-transition items (Submit, Approve, Send)

```js
const canBudgetEdit = usePermission("canBudgetEdit");
...
<OptionsMenu items={[
  { icon: "bi-pencil", label: "Edit Budget", onClick: openEdit, show: canBudgetEdit },
]} />
```

**Keep visible, disable, explain** — for controls that also convey current state, where hiding would remove information the user still needs to see:
- Inline toggles/switches that show an active/inactive state (Budget active toggle: `disabled={!canBudgetEdit}` + `title="You don't have permission to edit this budget"`)
- Primary sidebar nav links (Projects/Clients/Employees/Invoices): stay visible, `$disabled` styling, `onClick` calls `e.preventDefault()` and dispatches a `snackbarAction.showSnackbar({ message: "You don't have permission to access X", type: SNACKBAR_TYPES.ERROR })` instead of navigating — see `handleRestrictedNavClick` in `src/components/AppSidebar/index.js`

`OptionsMenu` items also independently support `disabled` + `disabledReason` (renders the item grayed with a hover tooltip, distinct from `show` which removes it from the list entirely) — use that for a business-rule reason (e.g. "Can't remove an assignment with burned hours"), and compose it with `show` for the permission check on the same item; they're orthogonal.

---

## 4. COMBINE WITH EXISTING BUSINESS RULES — DON'T REPLACE THEM

Most action buttons already have a status-based business rule (`isDraft || isSubmitted`, `!isSelected`, etc.). A permission check is an additional `&&`, never a replacement:

```js
const canEdit   = (isDraft || isSubmitted) && canInvoiceUpdate;
const canDelete = (isDraft || isSubmitted) && canInvoiceDelete;
```

---

## 5. ROUTE-LEVEL GUARD

`PermissionGuard` (`src/hooks/useLoginSync.js`) reads `state.login.permissions` and checks a small `routePermissionMap` array of `{ path, key }` against `matchPath`, redirecting to `/forbidden` on failure. Route-level gating is deliberately scoped module-by-module as each module's other UI gates are added — don't bulk-add every route at once; confirm which routes are actually in scope for the current task first (see §7).

```js
const routePermissionMap = [
  { path: "/projects",    key: "canProjectRead" },
  { path: "/project/:id", key: "canProjectRead" },
];
```

---

## 6. NO DEDICATED PERMISSION EXISTS — REUSE THE NEAREST ONE, DON'T INVENT A CODE

Not every actionable UI element has its own action code in `permissionsList.json`. When that happens, reuse the closest existing permission rather than fabricating a new backend code:

- Document upload (no `documents` module exists) → reused `canProjectUpdate`, the project-level edit permission
- Invoice workflow transitions — Submit/Approve/Send (no dedicated "transition" action code) → reused `canInvoiceUpdate`
- Budget active/inactive toggle (no dedicated "status" action code) → reused `canBudgetEdit`

Flag the reuse explicitly when you do it (in the PR description or a code comment isn't needed, but say it out loud to whoever asked) — it's a judgment call, not a discovered fact, and the backend may add a dedicated code later.

---

## 7. CONFIRM SCOPE BEFORE EXTENDING IT

RBAC audits reveal gaps everywhere at once — once you're looking at one module's permission checks, it's tempting to "also fix" a neighboring module's dead/broken check you notice along the way. Don't, unless asked. Flag it and move on. Concretely from this codebase's history: fixing the Projects module's route guard did *not* mean also fixing Employees/Clients/Invoices route entries in the same pass — those were explicitly left out and called out as a deliberate scope cut, added later only when separately requested.

---

## 8. DON'T GATE "READ"/"VIEW" AT THE ROW OR BUTTON LEVEL

If a user can see a list/tab at all, they already have read access to it by definition — reaching the page implies `canXRead`. Don't add a `show: canXRead` to a "View" button in a row-level menu; that read permission belongs at the route/tab-visibility level (see §5), not duplicated onto every row action.

---

## 9. WHAT NOT TO DO

| ❌ Don't | ✓ Do instead |
|---|---|
| Inline `permissions?.canX &&` checks in new code | `usePermission("canX")` or `<PermissionGate can="canX">` |
| Hide a stateful toggle/nav link outright | Keep visible, disable it, explain why (tooltip or snackbar) |
| Replace a status business rule with a permission check | `(businessRule) && canX` — combine, don't replace |
| Add a new `permissionsList.json` entry speculatively | Confirm the code is actually present in a real login/refresh network response first |
| Invent a new backend permission code for an ungated action | Reuse the nearest existing permission and say so |
| Gate a "View"/read action per-row | Read is implied by page/tab access — gate the route/tab instead |
| Bulk-gate every module's routes/buttons "while you're in there" | Confirm scope; gate only what was asked, flag the rest |
