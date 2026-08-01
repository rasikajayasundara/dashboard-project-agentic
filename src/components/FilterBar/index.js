import React, { useState, useRef, useEffect } from "react";
import {
  FilterBarWrapper, FilterLeft, FilterRight,
  SearchWrapper, SearchIcon, SearchInput,
  FilterBtnWrapper, FilterBtn, ClearBtn,
  DropdownPanel, DropdownItem, DropdownEmpty,
  DateRangePanel, DateRangeField, DateRangeLabel, DateRangeInput,
  DateRangeActions, DateRangeClearBtn, DateRangeApplyBtn, DateRangeBackBtn,
  ResetFiltersBtn,
} from "./component.styles";
import { fontSize } from "../../constants/common";
import { toDisplayDate } from "../../utils/dateMaker";

/*
  Props:
  ─────
  filters            [{ key, label, icon?, type?, options?: [{ value, label }] }]
                       - type "dateRange" renders the preset list (Today, Yesterday,
                         Last 7 Days, …, Custom) shown in the design; picking
                         "Custom" expands into a From/To date picker. Its
                         activeFilters value is { preset, from, to } (from/to are
                         the resolved bounds for whichever preset was picked, or
                         the user's own dates when preset is "custom"). Any
                         other/omitted type is the existing single-select
                         options-list dropdown.
  searchPlaceholder  string
  searchValue        string
  onSearchChange     (value: string) => void
  activeFilters      { [key]: selectedValue | { preset, from, to } | null }
  onFilterChange     (key, value | null) => void
  rightSlot          ReactNode — extra content on the right (e.g. view toggle)
*/

const DATE_PRESET_OPTIONS = [
  { value: "today",      label: "Today" },
  { value: "yesterday",  label: "Yesterday" },
  { value: "last7days",  label: "Last 7 Days" },
  { value: "last30days", label: "Last 30 Days" },
  { value: "thisMonth",  label: "This Month" },
  { value: "lastMonth",  label: "Last Month" },
  { value: "thisYear",   label: "This Year" },
  { value: "lastYear",   label: "Last Year" },
  { value: "custom",     label: "Custom" },
];

const DATE_PRESET_LABELS = Object.fromEntries(
  DATE_PRESET_OPTIONS.map((o) => [o.value, o.label])
);

const toISO = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// Resolves a preset key to concrete { from, to } ISO bounds, anchored to the
// start of today so "Last 7 Days" etc. are stable for the rest of the day.
const computePresetRange = (preset) => {
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (preset) {
    case "today":
      return { from: toISO(today), to: toISO(today) };
    case "yesterday": {
      const d = new Date(today); d.setDate(d.getDate() - 1);
      return { from: toISO(d), to: toISO(d) };
    }
    case "last7days": {
      const from = new Date(today); from.setDate(from.getDate() - 6);
      return { from: toISO(from), to: toISO(today) };
    }
    case "last30days": {
      const from = new Date(today); from.setDate(from.getDate() - 29);
      return { from: toISO(from), to: toISO(today) };
    }
    case "thisMonth":
      return {
        from: toISO(new Date(today.getFullYear(), today.getMonth(), 1)),
        to:   toISO(new Date(today.getFullYear(), today.getMonth() + 1, 0)),
      };
    case "lastMonth":
      return {
        from: toISO(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
        to:   toISO(new Date(today.getFullYear(), today.getMonth(), 0)),
      };
    case "thisYear":
      return {
        from: toISO(new Date(today.getFullYear(), 0, 1)),
        to:   toISO(new Date(today.getFullYear(), 11, 31)),
      };
    case "lastYear":
      return {
        from: toISO(new Date(today.getFullYear() - 1, 0, 1)),
        to:   toISO(new Date(today.getFullYear() - 1, 11, 31)),
      };
    default:
      return { from: null, to: null };
  }
};

const isFilterActive = (filter, activeValue) =>
  filter.type === "dateRange" ? !!activeValue?.preset : !!activeValue;

const formatDateRangeLabel = (range) => {
  if (!range) return "";
  const { from, to } = range;
  if (from && to) return `${toDisplayDate(from)} – ${toDisplayDate(to)}`;
  if (from) return `From ${toDisplayDate(from)}`;
  if (to) return `Until ${toDisplayDate(to)}`;
  return "";
};
const FilterBar = ({
  filters = [],
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  activeFilters = {},
  onFilterChange,
  rightSlot,
}) => {
  const [openKey, setOpenKey] = useState(null);
  // Draft from/to values for whichever dateRange filter is currently open —
  // only committed to activeFilters on Apply, so opening the panel never
  // changes the applied filter until the user confirms.
  const [dateDraft, setDateDraft] = useState({ from: "", to: "" });
  // Whether the open dateRange filter is showing the Custom From/To form
  // instead of the preset list (Today, Yesterday, Last 7 Days, …).
  const [customEntry, setCustomEntry] = useState(false);
  // Ref to whichever filter's own button+panel is currently open — not the
  // whole bar. Closing must trigger for ANY click outside that one filter,
  // including empty space elsewhere in this same toolbar.
  const openWrapperRef = useRef(null);
  const suppressNextClickRef = useRef(false);

  useEffect(() => {
    if (!openKey) { setCustomEntry(false); return; }
    const filter = filters.find((f) => f.key === openKey);
    if (filter?.type !== "dateRange") return;
    const current = activeFilters[openKey];
    if (current?.preset === "custom") {
      setCustomEntry(true);
      setDateDraft({ from: current.from || "", to: current.to || "" });
    } else {
      setCustomEntry(false);
      setDateDraft({ from: "", to: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openKey]);

  // Close dropdown when clicking outside its own button+panel. The outside
  // mousedown closes it, but the click event that follows still bubbles to
  // whatever was underneath (e.g. a table row) — swallow that one click in
  // the capture phase so the first outside click only dismisses the dropdown.
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (openWrapperRef.current && !openWrapperRef.current.contains(e.target)) {
        suppressNextClickRef.current = true;
        setOpenKey(null);
      }
    };
    const handleClickCapture = (e) => {
      if (suppressNextClickRef.current) {
        suppressNextClickRef.current = false;
        e.stopPropagation();
        e.preventDefault();
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("click", handleClickCapture, true);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("click", handleClickCapture, true);
    };
  }, []);

  const toggleDropdown = (key) =>
    setOpenKey((prev) => (prev === key ? null : key));

  const handleSelect = (key, value) => {
    // clicking the active option deselects it
    onFilterChange?.(key, activeFilters[key] === value ? null : value);
    setOpenKey(null);
  };

  const handleClear = (e, key) => {
    e.stopPropagation();
    onFilterChange?.(key, null);
  };

  const hasActiveFilters =
    !!searchValue ||
    filters.some((filter) => isFilterActive(filter, activeFilters[filter.key]));

  const handleResetAll = () => {
    if (searchValue) onSearchChange?.("");
    filters.forEach((filter) => {
      if (isFilterActive(filter, activeFilters[filter.key])) {
        onFilterChange?.(filter.key, null);
      }
    });
    setOpenKey(null);
  };

  const handlePresetSelect = (key, preset) => {
    if (preset === "custom") {
      setCustomEntry(true);
      return; // stay open — reveal the From/To form instead of applying yet
    }
    // clicking the active preset again deselects it
    if (activeFilters[key]?.preset === preset) {
      onFilterChange?.(key, null);
    } else {
      onFilterChange?.(key, { preset, ...computePresetRange(preset) });
    }
    setOpenKey(null);
  };

  return (
    <FilterBarWrapper>
      <FilterLeft>
        {/* Search input */}
        <SearchWrapper>
          <SearchIcon className="bi bi-search" />
          <SearchInput
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </SearchWrapper>

        {/* Dynamic filter buttons */}
        {filters.map((filter) => {
          const isDateRange = filter.type === "dateRange";
          const activeValue = activeFilters[filter.key];
          const isActive = isFilterActive(filter, activeValue);
          const selectedLabel = isDateRange
            ? (activeValue?.preset === "custom"
                ? formatDateRangeLabel(activeValue)
                : DATE_PRESET_LABELS[activeValue?.preset])
            : filter.options?.find((o) => o.value === activeValue)?.label;

          return (
            <FilterBtnWrapper
              key={filter.key}
              ref={openKey === filter.key ? openWrapperRef : null}
            >
              <FilterBtn
                $active={isActive}
                onClick={() => toggleDropdown(filter.key)}
              >
                {filter.icon && (
                  <i className={`bi ${filter.icon} btn-icon`} />
                )}
                {isActive ? selectedLabel : filter.label}
                {isActive ? (
                  <ClearBtn onClick={(e) => handleClear(e, filter.key)}>
                    ×
                  </ClearBtn>
                ) : (
                  <i className="bi bi-chevron-down" style={{ fontSize: fontSize.subtitle }} />
                )}
              </FilterBtn>

              {openKey === filter.key && (
                isDateRange ? (
                  customEntry ? (
                    <DateRangePanel>
                      <DateRangeBackBtn type="button" onClick={() => setCustomEntry(false)}>
                        <i className="bi bi-chevron-left" /> Back
                      </DateRangeBackBtn>
                      <DateRangeField>
                        <DateRangeLabel>From</DateRangeLabel>
                        <DateRangeInput
                          type="date"
                          value={dateDraft.from}
                          max={dateDraft.to || undefined}
                          onChange={(e) =>
                            setDateDraft((prev) => ({ ...prev, from: e.target.value }))
                          }
                        />
                      </DateRangeField>
                      <DateRangeField>
                        <DateRangeLabel>To</DateRangeLabel>
                        <DateRangeInput
                          type="date"
                          value={dateDraft.to}
                          min={dateDraft.from || undefined}
                          onChange={(e) =>
                            setDateDraft((prev) => ({ ...prev, to: e.target.value }))
                          }
                        />
                      </DateRangeField>
                      <DateRangeActions>
                        <DateRangeClearBtn
                          type="button"
                          onClick={() => {
                            setDateDraft({ from: "", to: "" });
                            onFilterChange?.(filter.key, null);
                            setOpenKey(null);
                          }}
                        >
                          Clear
                        </DateRangeClearBtn>
                        <DateRangeApplyBtn
                          type="button"
                          disabled={!dateDraft.from && !dateDraft.to}
                          onClick={() => {
                            onFilterChange?.(filter.key, {
                              preset: "custom",
                              from: dateDraft.from || null,
                              to: dateDraft.to || null,
                            });
                            setOpenKey(null);
                          }}
                        >
                          Apply
                        </DateRangeApplyBtn>
                      </DateRangeActions>
                    </DateRangePanel>
                  ) : (
                    <DropdownPanel>
                      {DATE_PRESET_OPTIONS.map((opt) => (
                        <DropdownItem
                          key={opt.value}
                          $active={activeValue?.preset === opt.value}
                          onClick={() => handlePresetSelect(filter.key, opt.value)}
                        >
                          {opt.label}
                          {activeValue?.preset === opt.value && (
                            <i className="bi bi-check2" />
                          )}
                        </DropdownItem>
                      ))}
                    </DropdownPanel>
                  )
                ) : (
                  <DropdownPanel>
                    {filter.options?.length > 0 ? (
                      filter.options.map((opt) => (
                        <DropdownItem
                          key={opt.value}
                          $active={activeValue === opt.value}
                          onClick={() => handleSelect(filter.key, opt.value)}
                        >
                          {opt.label}
                          {activeValue === opt.value && (
                            <i className="bi bi-check2" />
                          )}
                        </DropdownItem>
                      ))
                    ) : (
                      <DropdownEmpty>No options available</DropdownEmpty>
                    )}
                  </DropdownPanel>
                )
              )}
            </FilterBtnWrapper>
          );
        })}
      </FilterLeft>

      <FilterRight>
        {hasActiveFilters && (
          <ResetFiltersBtn type="button" onClick={handleResetAll}>
            <i className="bi bi-arrow-counterclockwise" />
            Reset Filters
          </ResetFiltersBtn>
        )}
        {rightSlot}
      </FilterRight>
    </FilterBarWrapper>
  );
};

export default FilterBar;
