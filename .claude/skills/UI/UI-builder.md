# /ui-guide

Quick-reference for building any new UI in demo-dash. Read this before creating a page, component, or modal.

---

## 1. FOLDER STRUCTURE

### Pages
Every page — list or detail — gets its **own top-level folder** under `src/pages/`. Never nest a detail page inside a list page folder.

```
src/pages/
  Clients/                  ← list page
    index.js
    clients.styles.js
    modals/
      AddClient.js
      addClient.styles.js
  ClientDetail/             ← detail page (sibling, NOT nested)
    index.js
    clientDetail.styles.js
    ClientHeader.js
    clientHeader.styles.js
    modals/
      EditClient.js
      editClient.styles.js
```

**Rules:**
- `index.js` — component logic
- `<pageName>.styles.js` — all styled-components for that page
- Modal files live in `modals/` subfolder inside the page folder
- Every modal has its own `<modalName>.styles.js` alongside it (if it has local styles)
- Shared styles across modals on the same page go in a single `modals/<page>.styles.js`

### Components
```
src/components/
  MyComponent/
    index.js
    component.styles.js     ← always named component.styles.js
```

---

## 2. STYLING RULES

### Never hardcode colors
Always import from `src/constants/common.js`:
```js
import { colors } from "../../constants/common";
```

### Key color tokens
```js
colors.accentBlue        "#3796BF"   — primary actions, active states
colors.accentRed         "#EF4444"   — danger, delete, error
colors.accentAmber       "#F59E0B"   — warning, hold, caution
colors.accentGreen       "#22C55E"   — success, positive
colors.textPrimary       "#686868"   — headings, names, bold values
colors.textSecondary     "#6B7280"   — labels, meta text
colors.textMuted         "#9CA3AF"   — placeholders, captions
colors.borderLight       "#F3F4F6"   — card dividers, table borders
colors.backgroundGray    "#F7F9FB"   — page canvas
colors.bgHover           "#F9FAFB"   — row hover, subtle fill
```

### Transient props
All styled-component props that control style (not passed to DOM) must use the `$` prefix:
```js
// ✓ correct
<ModalBox $maxWidth="680px" />
<FormInput $error={!!errors.name} />
<TabButton $active={selected === tab} />

// ✗ wrong — will cause React DOM prop warnings
<ModalBox maxWidth="680px" />
```

### Font family
```css
font-family: "Inter", "Segoe UI", sans-serif;
```
Always declare this on the outermost styled-component of a new component.

---

## 3. MODAL PATTERN

### Form modals — use ModalShell primitives
**Never build a custom modal shell from scratch.** Import from `src/components/ModalShell`:

```js
import {
  Overlay, ModalBox, ModalBody,
  ModalHeader, ModalTitle, CloseBtn,
  ModalFooter, FooterButtons, CancelBtn, SaveBtn,
} from "../../components/ModalShell";
```

**Structure:**
```jsx
<Overlay onClick={handleClose}>
  <ModalBox $maxWidth="680px" onClick={(e) => e.stopPropagation()}>

    <ModalHeader>
      <ModalTitle>Edit Project</ModalTitle>
      <CloseBtn onClick={handleClose}><i className="bi bi-x-lg" /></CloseBtn>
    </ModalHeader>

    <ModalBody>
      {/* form fields */}
    </ModalBody>

    <ModalFooter>
      <span style={{ fontSize: 12, color: colors.textMuted }}>* All fields required</span>
      <FooterButtons>
        <CancelBtn onClick={handleClose}>Cancel</CancelBtn>
        <SaveBtn onClick={handleSubmit}>Save Changes</SaveBtn>
      </FooterButtons>
    </ModalFooter>

  </ModalBox>
</Overlay>
```

**Rules:**
- `Overlay` click → close; `ModalBox` click → `stopPropagation()`
- `$maxWidth` — default `"720px"`, use `"560px"` for small, `"680px"` for medium, `"960px"` for large
- Footer is always sticky (flex-shrink: 0 in ModalShell)
- z-index hierarchy: Overlay = 1055, dropdown panels = 2000
- **Form modals always live in a `modals/` subfolder — never inline form modal JSX in `index.js`.** This applies to both page-level and tab-level modals. Each tab subfolder follows the same rule: `<tab>/modals/Add<Item>.js`, `<tab>/modals/Edit<Item>.js`

### Confirmation dialogs — use ConfirmDialog
**Never build a custom confirmation box.** Use the shared component:

```js
import ConfirmDialog from "../../components/ConfirmDialog";
```

```jsx
{showDelete && (
  <ConfirmDialog
    title="Delete Project"
    message="Permanently delete this project? This cannot be undone."
    confirmLabel="Delete"
    variant="danger"           // "danger" | "info" | "success"
    onConfirm={handleDelete}
    onCancel={() => setShowDelete(false)}
  />
)}
```

**Variant guide:**
- `"danger"` — delete, destructive, permanent removal (red)
- `"info"` — hold, archive, status change (blue)
- `"success"` — approve, activate, restore (green)

---

## 4. FORM FIELDS — use FormField components

**Never build raw `<input>` or `<select>` inside modals.** Use the shared `FormField` wrapper and its children:

```js
import FormField, {
  FormInput,
  FormSelectDropdown,    // simple list, no search
  FormSearchDropdown,    // list with search box — use for 8+ options
  FormDatePicker,
} from "../../components/FormField";
```

### FormInput
```jsx
<FormField label="Project Name" required error={errors.projectName} $full>
  <FormInput
    type="text"
    placeholder="e.g. Wellington Bridge Assessment"
    value={values.projectName}
    $error={!!errors.projectName}
    onChange={(e) => handleChange("projectName", e.target.value)}
  />
</FormField>
```

### FormSelectDropdown (simple list)
```jsx
<FormField label="Office Location" required error={errors.officeLocation}>
  <FormSelectDropdown
    value={values.officeLocation}
    $error={!!errors.officeLocation}
    onChange={(val) => handleChange("officeLocation", val)}
    placeholder="Select office"
    options={["Hamilton", "Auckland", "Wellington"]}
    // or: options={[{ label: "Fixed", value: "1" }, { label: "Hourly", value: "2" }]}
  />
</FormField>
```

### FormSearchDropdown (with search — use for long lists or API-backed data)
```jsx
<FormField label="Client" required error={errors.clientId}>
  <FormSearchDropdown
    value={values.clientId}
    $error={!!errors.clientId}
    onChange={(val) => handleChange("clientId", val)}
    placeholder="Select client"
    options={clients.map((c) => ({ label: c.name, value: c.id }))}
  />
</FormField>
```

### FormDatePicker
```jsx
<FormField label="Start Date" required error={errors.startDate}>
  <FormDatePicker
    value={values.startDate}
    onChange={(str) => handleChange("startDate", str)}
    $error={!!errors.startDate}
  />
</FormField>
```

### FormField props
| Prop | Type | Description |
|---|---|---|
| `label` | string | Field label text |
| `required` | boolean | Shows `*` next to label |
| `error` | string | Error message shown below field |
| `$full` | boolean | Spans both columns in a 2-col grid |

### Two-column form grid
Import from the modal's own styles file:
```js
// modals/addProject.styles.js
export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;
```

---

## 5. FORM VALIDATION — useFormValidation hook

```js
import useFormValidation from "../../hooks/useFormValidation";

const RULES = {
  projectName: { required: true, label: "Project Name" },
  email:       { required: true, label: "Email", type: "email" },
  role:        { required: true, label: "Role", minLength: 2 },
};

const { values, errors, handleChange, validate, reset } = useFormValidation(INITIAL_VALUES, RULES);
```

**Rules:**
- Only put fields in `RULES` that are always required — never add conditional required fields (e.g. fee type that's only required when Billable)
- For conditional required fields, validate manually in `handleSubmit` after calling `validate()`
- Call `reset()` in `handleClose` so the form clears when reopened

---

## 6. OPTIONS MENU

Use `OptionsMenu` for the `⋯` action menu on headers and table rows:

```js
import OptionsMenu from "../../components/OptionsMenu";
```

```jsx
<OptionsMenu items={[
  { icon: "bi-pencil",  label: "Edit",    onClick: () => setShowEdit(true)   },
  { icon: "bi-archive", label: "Archive", onClick: () => setShowArchive(true), dividerBefore: true },
  { icon: "bi-trash",   label: "Delete",  onClick: () => setShowDelete(true),  danger: true },
]} />
```

| Prop | Type | Description |
|---|---|---|
| `icon` | string | Bootstrap icon class (without `bi-` prefix in some usages — check) |
| `label` | string | Menu item text |
| `onClick` | fn | Handler |
| `danger` | boolean | Renders item in red |
| `dividerBefore` | boolean | Adds a separator line above this item |
| `show` | boolean | If `false`, item is hidden (default `true`) |

---

## 7. PAGE HEADER PATTERN

Every list page follows this structure:
```
PageHeader
  TitleRow
    Title + TitleBadge (count)
    Subtitle
  HeaderActions
    ButtonStyled (Export / secondary actions)
    ButtonStyled (Add / primary action) — guarded by permission

StatsGrid (4 StatCard components)

DataTable
  tabBarSlot → TabBarContainer + TabButtons
  filterBarSlot → FilterBar
```

Import page-level styled-components from `<pageName>.styles.js`. The following exports are expected:
```js
export const PageWrapper   // outermost padding wrapper
export const PageHeader    // flex row with title + actions
export const TitleRow      // flex col for title+subtitle
export const Title         // h1/h2 styled
export const TitleBadge    // pill count badge
export const Subtitle      // muted subtext
export const HeaderActions // flex row for buttons
```

---

## 8. DETAIL PAGE PATTERN

Every detail page follows this structure:
```
Layout
  PageWrapper
    <EntityHeader> component  ← avatar/logo, name, chips, metrics, OptionsMenu
    TabBarContainer + TabButtons
    Tab content area
    ConfirmDialog modals (conditional render)
    Form modals (conditional render)
```

Header component lives in `src/pages/<PageDetail>/<EntityName>Header.js` with its own `<entityName>Header.styles.js`.

Modal state lives in the detail page `index.js`:
```js
const [showEdit,    setShowEdit]    = useState(false);
const [showDelete,  setShowDelete]  = useState(false);
const [showHold,    setShowHold]    = useState(false);
const [showArchive, setShowArchive] = useState(false);
```

---

## 9. REDUX SLICE PATTERN

Every new feature needs three files in `src/store/<feature>Slice/`:

```
store/
  projectSlice/
    index.js    ← createSlice — exports { actions: projectAction, reducer: projectReducer }
    api.js      ← plain async functions calling authAxios helpers
    saga.js     ← takeLatest watchers
```

**Rules:**
- No `createAsyncThunk` — all async goes through sagas
- Each action type must have its own `takeLatest` watcher — never reuse another action's type
- Register new reducers in `rootReducer.js` and sagas in `rootSaga.js`
- Use `snackbarAction.showSnackbar({ message, type })` for feedback (import `SNACKBAR_TYPES` for the type value)

---

## 10. WHAT NOT TO DO

| ❌ Don't | ✓ Do instead |
|---|---|
| Hardcode `#3796BF` or any hex | Use `colors.accentBlue` |
| Build a custom modal shell | Use `ModalShell` primitives |
| Build a custom confirm box | Use `ConfirmDialog` |
| Use `<select>` in a modal form | Use `FormSelectDropdown` or `FormSearchDropdown` |
| Use `ActionModal` for anything | It is deprecated — use `ConfirmDialog` or `ModalShell` |
| Write styles inside `index.js` | Put all styled-components in `component.styles.js` |
| Inline form modal JSX in any `index.js` or tab `index.js` | Create `modals/<FormName>.js` in the same folder |
| Access `localStorage` directly | Use `secureStorage` from `src/utils/encryptedStorage.js` |
| Hardcode API URLs in components | Add path to `src/config/apiPath.js` and import |
| Use `createAsyncThunk` | Use Redux-Saga |
| Write `<table>` HTML in a page | Use `<DataTable>` component |
