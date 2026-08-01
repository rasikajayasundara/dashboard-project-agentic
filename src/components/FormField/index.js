import { forwardRef, useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FieldWrapper, FieldLabel, FieldError, FormInput, DatePickerWrapper, DatePickerGlobalStyle,
  DateInputWrap, DropdownWrapper, DropdownTrigger, DropdownPanel, SearchBox,
  OptionList, OptionItem, EmptyMsg,
} from "./component.styles";

export default function FormField({ label, required, error, $full, children }) {
  return (
    <FieldWrapper $full={$full}>
      <FieldLabel>
        {label}{required && <span style={{ color: "#F59E0B", marginLeft: 2 }}>*</span>}
      </FieldLabel>
      {children}
      {error && <FieldError>{error}</FieldError>}
    </FieldWrapper>
  );
}

function parseLocalDate(str) {
  if (!str) return null;
  // Accepts a plain "YYYY-MM-DD" or a full ISO datetime ("YYYY-MM-DDTHH:mm:ss.sssZ") —
  // some API responses return the latter for date-only fields, so only the date part is used.
  const [y, m, d] = String(str).split("T")[0].split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function toISODateString(date) {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const DateCustomInput = forwardRef(({ value, onClick, $error }, ref) => (
  <DateInputWrap>
    <FormInput
      ref={ref}
      type="text"
      value={value}
      onClick={onClick}
      onChange={() => {}}
      $error={$error}
      readOnly
      placeholder="Select a date"
      style={{ cursor: "pointer" }}
    />
    <i className="bi bi-calendar3 date-icon" />
  </DateInputWrap>
));

// Escapes ModalBox's overflow:hidden by portaling the popup calendar to
// document.body, so it always renders on top instead of getting clipped.
function DatePickerPortal({ children }) {
  return createPortal(children, document.body);
}

export function FormDatePicker({ value, onChange, $error, ...rest }) {
  return (
    <DatePickerWrapper>
      <DatePickerGlobalStyle />
      <DatePicker
        selected={parseLocalDate(value)}
        onChange={(date) => onChange(toISODateString(date))}
        customInput={<DateCustomInput $error={$error} />}
        dateFormat="dd MMM yyyy"
        forceShowMonthNavigation
        popperContainer={DatePickerPortal}
        {...rest}
      />
    </DatePickerWrapper>
  );
}

function normalizeOptions(options) {
  return options.map((o) => (typeof o === "string" ? { label: o, value: o } : o));
}

function usePortalDropdown(close) {
  const triggerRef = useRef(null);
  const panelRef   = useRef(null);
  const [pos, setPos] = useState(null);

  const open = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  }, []);

  useEffect(() => {
    const onMouse = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        panelRef.current   && !panelRef.current.contains(e.target)
      ) close();
    };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("mousedown", onMouse);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouse);
      document.removeEventListener("keydown", onKey);
    };
  }, [close]);

  return { triggerRef, panelRef, pos, open };
}

export function FormSelectDropdown({ value, onChange, placeholder = "Select...", options = [], $error, disabled = false }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const { triggerRef, panelRef, pos, open: calcPos } = usePortalDropdown(close);
  const opts     = normalizeOptions(options);
  const selected = opts.find((o) => String(o.value) === String(value));

  const toggle = () => {
    if (disabled) return;
    if (!open) { calcPos(); setOpen(true); }
    else close();
  };

  return (
    <DropdownWrapper>
      <DropdownTrigger ref={triggerRef} $error={$error} $open={open} $hasValue={!!selected} onClick={toggle} type="button" disabled={disabled}>
        <span>{selected?.label || placeholder}</span>
        <i className="bi bi-chevron-down chevron" />
      </DropdownTrigger>
      {open && pos && createPortal(
        <DropdownPanel ref={panelRef} style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width }}>
          <OptionList>
            {opts.map((o) => (
              <OptionItem
                key={o.value}
                $selected={String(o.value) === String(value)}
                onClick={() => { onChange(o.value); close(); }}
              >
                {o.label}
                {String(o.value) === String(value) && <i className="bi bi-check2" />}
              </OptionItem>
            ))}
          </OptionList>
        </DropdownPanel>,
        document.body
      )}
    </DropdownWrapper>
  );
}

export function FormSearchDropdown({ value, onChange, placeholder = "Select...", options = [], $error, disabled = false }) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);
  const close = useCallback(() => { setOpen(false); setSearch(""); }, []);
  const { triggerRef, panelRef, pos, open: calcPos } = usePortalDropdown(close);
  const opts     = normalizeOptions(options);
  const selected = opts.find((o) => String(o.value) === String(value));
  const filtered = opts.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));

  const toggle = () => {
    if (disabled) return;
    if (!open) { calcPos(); setOpen(true); }
    else close();
  };

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 30);
  }, [open]);

  return (
    <DropdownWrapper>
      <DropdownTrigger ref={triggerRef} $error={$error} $open={open} $hasValue={!!selected} onClick={toggle} type="button" disabled={disabled}>
        <span>{selected?.label || placeholder}</span>
        <i className="bi bi-chevron-down chevron" />
      </DropdownTrigger>
      {open && pos && createPortal(
        <DropdownPanel ref={panelRef} style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width }}>
          <SearchBox>
            <i className="bi bi-search" />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
            />
          </SearchBox>
          <OptionList>
            {filtered.length === 0
              ? <EmptyMsg>No results found</EmptyMsg>
              : filtered.map((o) => (
                  <OptionItem
                    key={o.value}
                    $selected={String(o.value) === String(value)}
                    onClick={() => { onChange(o.value); close(); }}
                  >
                    {o.label}
                    {String(o.value) === String(value) && <i className="bi bi-check2" />}
                  </OptionItem>
                ))
            }
          </OptionList>
        </DropdownPanel>,
        document.body
      )}
    </DropdownWrapper>
  );
}

export { parseLocalDate };
export { FormInput, FormSelect, InputWrapper, InputSlot, FieldError } from "./component.styles";
