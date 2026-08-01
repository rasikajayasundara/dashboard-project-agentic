# API Wiring

Quick-reference for integrating a real API endpoint into demo-dash, replacing mock data. Read this before wiring up any page/tab to the backend.

---

## 1. VERIFY AGAINST THE LIVE SPEC FIRST

Never trust frontend mock field names as a stand-in for the real API contract. Fetch the live OpenAPI spec (`/api-docs/openapi.json` off the API base URL) and confirm the exact path, method, params, and response field names before writing any integration code.

`WebFetch` caches responses for 15 minutes. If you're re-checking whether the backend "just deployed" something, cache-bust with a dummy query param (e.g. `?_=<timestamp>`) — otherwise you'll get a stale answer and falsely conclude an endpoint doesn't exist.

## 2. MAP FIELDS DIRECTLY, FLAG GAPS — DON'T INVENT OR SILENTLY DROP

When a mock field has no real backend equivalent, say so explicitly rather than guessing a substitute or quietly removing the UI element that depended on it. If asked to wire the API without changing the UI, leave the UI structure (columns/tabs/filters) as-is and let the mismatch show (e.g. blank cell, undercounted tab) — note it clearly instead of "fixing" it unprompted.

Integer status/enum fields almost never have a documented mapping in this API's spec — confirm the actual values with whoever owns the backend rather than guessing.

## 3. REUSE THE EXISTING SLICE FOR THE DOMAIN

One Redux slice per domain entity (e.g. `clientSlice` covers the client list, client detail, and client sub-resources like client projects) — don't spin up a new slice per sub-feature. Follow the slice's existing action-naming convention (`xStart`/`xSuccess`/`xFailed`) and reuse its existing shared `error` field rather than adding a new one per action.

## 4. CENTRALIZE PATHS IN apiPath.js

Even for paths with a dynamic segment in the middle (e.g. `projects/{clientId}/byClient`), define the static pieces as constants there rather than hardcoding the path in `api.js` — use a prefix/suffix pair if the ID sits in the middle.

## 5. CONFIRM SCOPE BEFORE EXTENDING IT

If only "integrate the detail page" was asked, don't also wire up Edit/Delete just because the endpoints exist and the buttons are already in the UI — confirm first. Likewise, if asked for an API-only wiring pass, don't remove/restructure UI elements that have no backing data — flag the mismatch and leave the UI alone unless told otherwise.

## 6. ON A DETAIL PAGE WITH TABS, FETCH LAZILY PER TAB — NOT ALL UP FRONT

On mount, the parent page dispatches only the main/header detail fetch — never the other tabs' fetches. Each tab component fetches its own data, unconditionally, in its own `useEffect` keyed on the id (read via `useParams()` directly, not passed as a prop). Since the parent only renders the selected tab's component, switching tabs unmounts the previous one and mounts the new one — so the effect fires on every switch *into* that tab, giving fresh data each time, while clicking the tab you're already on doesn't remount it (React bails out on an unchanged state value), so it correctly does not refire there.

Don't guard this with `if (data.length === 0)` — that prevents the refetch-on-revisit that's actually wanted here. Still clear the cached state in the *parent* entity's own `xDetailStart` reducer (not the tab's) so there's no flash of a previous entity's stale data while the new fetch is in flight when navigating to a *different* entity.

## 7. ONCE A COMPONENT'S REAL ENDPOINT IS WIRED, DELETE ITS MOCK DATA — DON'T LEAVE IT "JUST IN CASE"

When you wire the actual API into a component, remove that component's hardcoded mock/fallback data completely in the same change — don't leave it sitting behind a `|| MOCK_X` fallback "for safety." A reachable mock left in real wired code is a future bug waiting to surface (e.g. masking an empty/failed response as fake data) and a mess for the next person trying to tell what's real. If a shared component is used by multiple callers and only some of them are wired yet, the safe fallback is a guard like `invoice || {}` (so existing field-not-found handling still applies) — not a full fake object with realistic-looking values.

## 8. BIND THE EXACT FIELD NAME — NO GUESS-CHAINS

When mapping an API response to UI props, use only the exact field name confirmed in the live response shape. Never hedge with speculative OR-chains like `inv.name || inv.names || inv.firstName` to cover uncertainty about which field is correct — that's a guess, not a mapping, and it can silently bind the wrong field or mask a real gap. If you're not sure which field holds the value, confirm against the live OpenAPI spec or ask before wiring it; once confirmed, bind that single field. The UI-side prop name in the mapping function should match the API field name 1:1.

This is distinct from #2 above: #2 is for a field that genuinely doesn't exist in the API at all (flag the gap, don't invent a substitute). This rule is for a field that does exist but you're unsure of its exact name/shape — verify or ask, don't hedge with multiple guesses.

## 9. NO UI CHANGES WHILE WIRING — IF YOU HAVE NOTHING TO BIND, ASK, DON'T HIDE OR DELETE

API wiring passes touch data flow only — never the UI. Don't add, remove, restyle, hide, or delete an element because the API doesn't (yet) have a value for it. If an element has nothing to bind, stop and ask rather than quietly leaving it blank, removing it, or hiding it — silently dropping it can look like a deliberate design decision later instead of the open question it actually is.
