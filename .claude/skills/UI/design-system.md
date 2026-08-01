# /design-system

Quick-reference for demo-dash's visual design system, grounded in what the **live code actually renders** — not just what `.claude/agents/demo-dash-ui-builder.md` Section 1 says. Read this before building any new UI, and especially before hand-drawing chrome (sidebar/header) for a mockup Artifact.

**Why this file exists, distinct from the agent file's Section 1:** while building the Employees list page in this project, several concrete mismatches turned up between the builder agent's documented tokens and the actual rendered app (see Section 9 below — most notably, the real sidebar is a dark gradient rail, not the white sidebar the agent file describes). This file is the corrected, code-verified reference; treat it as authoritative over Section 1 wherever the two disagree, and treat Section 9 as a live punch-list of what needs fixing in the agent file itself.

---

## 1. Canonical token source

```js
import { colors, fontSize, AVATAR_PALETTES } from "../../constants/common";
```

`src/constants/common.js` is the only place color/fontSize/avatar tokens are defined. There is **no** centralized spacing or radius token object — those are conventions enforced by discipline (multiples of 4px; one of 6/8/12/9999px), not imports.

---

## 2. Color tokens (verified from `src/constants/common.js`)

```js
// ── Active "new" tokens — use these for new UI ─────────────────────────────
accentBlue      "#3796BF"   links, outline buttons, focus/active accents
accentBlueLight "#DBEAF7"   badge bg, soft fills, outline-button hover bg
accentGreen     "#22C55E"   positive indicators, stat icons
accentRed       "#EF4444"   danger, error, overloaded stat icons
accentAmber     "#F59E0B"   warning, outstanding, caution stat icons
accentOrange    "#F97316"   (present, not yet documented/used by the builder agent — check usage before relying on it)
pastelGreen/Blue/Amber/Red   lighter variants — check current usages before adopting, sparsely used
textSecondary   "#6B7280"   muted labels, meta info, sub-text
textMuted       "#9CA3AF"   placeholders, table headers, captions
borderLight     "#F3F4F6"   table borders, card dividers
bgHover         "#F9FAFB"   row hover, subtle bg
bgTableHead     rgba(249,250,251,0.5)  table header background
backgroundGray  "#F7F9FB"   page canvas
white           "#fff"      surfaces, cards

// ── Sidebar (dark rail) — see Section 9, this is the REAL sidebar ──────────
sidebarBg           "#1B2138"   also reused as the PrimaryButton background (!)
sidebarText         "#AEB4C7"   inactive nav item text
sidebarTextActive   "#FFFFFF"   active nav item text
sidebarHoverBg      rgba(255,255,255,0.06)
sidebarActiveBg     rgba(55,150,191,0.16)
sidebarDivider      rgba(255,255,255,0.08)
sidebarFooterText   "#6B7280"

// ── Legacy tokens — still actively used, not dead ───────────────────────────
primaryColor    "#3a529c"   NOT the real sidebar active bg (see Section 9) — used elsewhere
secondaryColor  "#58bdc9"
textGrayColor       "#212529"   used by Card's TableTitle (legacy card title color)
textLightGrayColor  "#a5a6a8"   used by Card's TableSubtitle/FooterInfo
successColor / warningColor / dangerColor
borderColor     "#e2e5ef"   legacy card borders — still used by Card/Panel-adjacent components
primaryLight, primaryMid, secondaryLight, bgPage
```

⚠️ **`textPrimary` is defined as `"#6b7280"` — byte-identical to `textSecondary`.** The two tokens are meant to be visually distinct (bold headings/values vs. muted meta text) but currently resolve to the same gray. Several components sidestep this by hardcoding the *intended* original value, `#686868`, directly instead of importing the token (e.g. `StatCard`'s `CardValue`). If you need genuinely bold/dark text, don't trust `colors.textPrimary` to look different from `colors.textSecondary` — verify visually, or use the raw `#686868` to match existing bold-value styling until the token itself is fixed.

---

## 3. Semantic status/badge colors — use `<StatusBadge>`, never a local map

`src/components/StatusBadge/index.js` is explicitly commented as **"Single source of truth for all status colors across the app. Add new statuses here — never create local badge color maps elsewhere."** It's far more complete than any badge table in the agent file — it covers project/general status, employee workload status, employee account status, client health, client tier, invoice approval, payment, lead status, task priority, task status, notifications, timesheet approval, and expense type, ~35 status strings total.

```jsx
import StatusBadge from "../../components/StatusBadge";
<StatusBadge status="Overloaded" />   // looks up STATUS_MAP internally
```

- Prefix-matched: any status starting with `"Overrun"` (e.g. `"Overrun 6h"`) maps to the same amber `Overrun` entry.
- Unknown status strings fall back to a neutral gray (`bg #F3F4F6 / color #6B7280`), not an error — so a typo'd status silently renders gray rather than failing loudly. Double-check spelling against `STATUS_MAP` when a badge looks unexpectedly gray.
- The rendered `Pill` (`StatusBadge/component.styles.js`) is `border-radius: 9999px`, `font-size: fontSize.badge` (9px), `font-weight: 500`, with a small 6px color dot before the text (`::before`) — reproduce this dot if you ever build a one-off badge instead of reusing the component.

**Workload / progress color thresholds** (used by `DataTable`'s `workload` cell type and progress bars generally):
```
Green (≤80%)   colors.accentGreen
Amber (81–99%) colors.accentAmber
Red (≥100%)    colors.accentRed
```

---

## 4. Typography

**Body-level text — `fontSize` object, 5 tiers, verified in live use:**

| Name | Size | Verified usage |
|---|---|---|
| `general` | 13px | default body text, paragraphs, table cells, form inputs, nav labels |
| `highlight` | 13px | same as general, paired with `font-weight: 600` at the call site |
| `subtitle` | 12px | secondary/meta text — captions, helper text, `Card`'s `TableSubtitle`/`FooterInfo`, `StatCard`'s `CardLabel`/`CardFooter` |
| `header` | 14px | section/card headings — **not** full page-level titles |
| `badge` | 9px | badge/pill/chip text — confirmed as `StatusBadge`'s `Pill` font-size, weight 500 |

Import `fontSize` from `src/constants/common.js`; never hardcode a body-text px value.

**Raw-literal sizes (page titles, stat values, icon glyphs, avatar-initial circles)** — CLAUDE.md explicitly carves these out of the `fontSize` system. Verified real values:

| Use | Verified value | Note |
|---|---|---|
| Page title (`Title` h1) | 20px / weight 600 | matches what was used for the Employees page |
| Stat card big number | 22px / weight 700, color `#686868` (raw, not `colors.textPrimary`) | `StatCard`'s `CardValue` — **not 24px** as the builder agent's Section 1.2 `statValue` row claims |
| Legacy `Card` title (`TableTitle`) | 22px / weight 700, `colors.textGrayColor`, `letter-spacing: -0.3px` | legacy styling, not on the new-token system at all |

---

## 5. Spacing

No centralized token object — enforced as a convention: **multiples of 4px** (4·8·12·16·20·24·32). When in doubt, match the nearest existing sibling spacing rather than picking a new arbitrary value.

---

## 6. Border radius

Rule of thumb (per CLAUDE.md/agent file): only 6px (chips), 8px (buttons/inputs — confirmed in `ButtonStyled`'s `BaseButton`), 12px (icon boxes — confirmed in `StatCard`'s `IconBox`), 9999px (pills/avatars — confirmed in `StatusBadge`'s `Pill`).

⚠️ **The shared `Card`/`Panel` component itself does not comply** — `PanelBase` (`src/components/Panel/component.styles.js`) uses `border-radius: 14px`, not 12px. Since `<Card>` is the mandated reuse target for "content card / panel wrapper," any page built with it will visually show 14px card corners even though the design-system rule says 12px. Don't "fix" this locally in new pages by forcing 12px onto a `<Card>` usage — that would make your page inconsistent with every other `<Card>`-based page. Flag it as a systemic fix if it matters, don't patch it per-page.

---

## 7. Shadows

Documented (agent file, Section 1.5) — use when hand-building a new card-like surface that doesn't reuse `<Card>`:
```css
/* Card */      box-shadow: 0 2px 16px rgba(58,82,156,0.08), 0 1px 3px rgba(0,0,0,0.04);
/* Elevated */  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
```

⚠️ **The actual `<Card>`/`<Panel>`/`<StatCard>` components use a different recipe** (`panelShadow` in `src/components/Panel/component.styles.js`):
```css
box-shadow: 0 1px 2px rgba(31,41,66,0.04), 0 10px 24px -10px rgba(31,41,66,0.16);
```
Same situation as the radius mismatch above — real reused components look different from the documented spec. Reuse the component (correct), don't hand-match the documented shadow onto it (would create a one-off visual inconsistency).

---

## 8. Layout dimensions

```
Header height:        65px, white background, border-bottom
Content padding:      16px 32px 32px (page-level PageWrapper convention)
Stat card gap:        16px
Layout's sidebar slot: 240px reserved width (src/components/Layout/component.styles.js SidebarWrapper)
```

Note the last line against Section 9 below — the slot reserves 240px but the actual `<AppSidebar>` renders `width: 250px` and is `position: fixed`, so it overlays slightly wider than its reserved slot. Not something to "fix" in a new page — just don't be surprised the sidebar visually extends past its 240px column when comparing to a screenshot.

---

## 9. ⚠️ Sidebar & primary-action color — real vs. documented (read this before any mockup)

This is the biggest drift found. The demo-dash-ui-builder agent file's Section 1.6/Section 2 describe a **white, 240px sidebar** with `primaryColor` active-state background. The real, live `<AppSidebar>` (`src/components/AppSidebar/component.styles.js`) is completely different:

```css
/* Real sidebar background */
background: linear-gradient(135deg, #192929 0%, #364158 38%, #201f3b 68%, #010615 100%);
width: 250px;
```
- Active nav item: `background: colors.sidebarActiveBg` (translucent blue), `border-left: 3px solid colors.accentBlue`, text `colors.sidebarTextActive` (white)
- Inactive nav item: text `colors.sidebarText` (`#AEB4C7`, a light gray-blue), transparent bg
- Hover: `colors.sidebarHoverBg`

**Primary buttons are also dark, not blue:** `ButtonStyled`'s `PrimaryButton` background is `colors.sidebarBg` (`#1B2138`), not `colors.accentBlue`. The app's actual primary-action color is a dark navy, matching the sidebar rail — `accentBlue` is really an accent/outline/link color, not the primary-button fill the agent file's comment ("primary action, active states, links") implies.

**Practical impact:**
- Generated pages are **not** affected — `<Layout>`, `<AppSidebar>`, and `<ButtonStyled>` are always reused per the mandatory-reuse rule, so real pages correctly render the dark rail and navy primary buttons regardless of this doc drift.
- **Mockup Artifacts are affected.** The `/generate-UI` workflow requires hand-reconstructing sidebar/header chrome from the agent file's Section 1.6 for the approval-gate mockup (Section 0.2 of that file) — and doing that faithfully to Section 1.6 currently produces a *visually wrong* mockup (light sidebar, blue button) that doesn't match what the real page will look like once built. When building a mockup's chrome, use the values in this section instead of the agent file's Section 1.6.

---

## 10. Known discrepancies — quick summary

| Area | `demo-dash-ui-builder.md` Section 1 says | Live code actually has |
|---|---|---|
| `textPrimary` | `#686868` | `#6b7280` (== `textSecondary`) |
| Sidebar | white, 240px, `primaryColor` active bg | dark gradient rail, 250px, `sidebarBg`/`sidebarActiveBg` |
| Primary button fill | `accentBlue` | `colors.sidebarBg` (`#1B2138` navy) |
| Card/Panel radius | 12px | 14px (`PanelBase`) |
| Card shadow | `0 2px 16px rgba(58,82,156,.08)…` | `panelShadow`: `0 1px 2px rgba(31,41,66,.04), 0 10px 24px -10px rgba(31,41,66,.16)` |
| Modal `ModalBox` radius (Section 3 snippet) | 16px | must actually be 12px per the 4-value rule — already caught once in review |
| Typography `badge` row | 12px / weight 600 | `StatusBadge` `Pill` is `fontSize.badge` = 9px / weight 500 |
| Typography `cardTitle` row | 16px / weight 600 | `Card`'s `TableTitle` uses raw 22px/700, legacy `textGrayColor` |
| Typography `statValue` row | 24px / weight 700 | `StatCard`'s `CardValue` uses raw 22px/700, `#686868` |

None of these are hypothetical — every row above was confirmed by reading the actual `.styles.js` file, not inferred. Treat this table as a punch-list if `demo-dash-ui-builder.md` Section 1 ever gets revised.
