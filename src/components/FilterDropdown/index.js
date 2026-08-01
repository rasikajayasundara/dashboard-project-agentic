import React, { useState, useRef, useEffect } from "react";
import {
  DropdownContainer,
  TriggerBadge,
  PanelWrapper,
  AccordionItem,
  AccordionHeader,
  LabelGroup,
  FilterIcon,
  FilterLabel,
  ChevronIcon,
  CountBadge,
  AccordionBody,
  OptionRow,
  OptionLeft,
  Avatar,
  Dot,
  CheckIcon,
  Footer,
  ClearBtn,
} from "./component.styles";
import { CheckSVG, ChevronSVG, FilterSVG, typeIcons } from "./svgs";
import ButtonStyled from "../ButtonStyled";

const initials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const FilterAccordion = ({ filter, selections, onToggle }) => {
  const [open, setOpen] = useState(false);
  const { id, label, type, options } = filter;
  const selected = selections[id] || [];

  return (
    <AccordionItem $open={open}>
      <AccordionHeader $open={open} onClick={() => setOpen((o) => !o)}>
        <LabelGroup>
          <FilterIcon $open={open}>
            {typeIcons[type] || typeIcons.client}
          </FilterIcon>
          <FilterLabel $open={open}>{label}</FilterLabel>
          {selected.length > 0 && <CountBadge>{selected.length}</CountBadge>}
        </LabelGroup>
        <ChevronIcon $open={open}>
          <ChevronSVG />
        </ChevronIcon>
      </AccordionHeader>

      {open && (
        <AccordionBody>
          {options.map((opt) => {
            const sel = selected.includes(opt.value);
            return (
              <OptionRow
                key={opt.value}
                $selected={sel}
                onClick={() => onToggle(id, opt.value)}
              >
                <OptionLeft>
                  {type === "manager" && (
                    <Avatar $color={opt.color}>{initials(opt.label)}</Avatar>
                  )}
                  {type === "status" && <Dot $color={opt.color} />}
                  {opt.label}
                </OptionLeft>
                {sel && (
                  <CheckIcon>
                    <CheckSVG />
                  </CheckIcon>
                )}
              </OptionRow>
            );
          })}
        </AccordionBody>
      )}
    </AccordionItem>
  );
};

const FilterDropdown = ({
  filters = [],
  onApply,
  placeholder = "Search projects...",
  triggerLabel = "Filters",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selections, setSelections] = useState({});
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleToggle = (filterId, value) => {
    setSelections((prev) => {
      const curr = prev[filterId] || [];
      return {
        ...prev,
        [filterId]: curr.includes(value)
          ? curr.filter((v) => v !== value)
          : [...curr, value],
      };
    });
  };

  const handleClear = () => {
    setSearch("");
    setSelections({});
  };

  const handleApply = () => {
    onApply?.({ selections, search });
    setOpen(false);
  };

  const totalSelected = Object.values(selections).flat().length;

  const filteredFilters = filters.map((f) => ({
    ...f,
    options: f.options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  return (
    <>
      <DropdownContainer ref={containerRef}>
        <ButtonStyled
          startSlot={<FilterSVG />}
          variant="secondary"
          $open={open}
          onClick={() => setOpen((o) => !o)}
        >
          {triggerLabel}
          {totalSelected > 0 && (
            <TriggerBadge key={totalSelected}>{totalSelected}</TriggerBadge>
          )}
          <svg
            className="chev"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </ButtonStyled>

        {open && (
          <PanelWrapper>
            <div>
              {filteredFilters.map((filter) => (
                <FilterAccordion
                  key={filter.id}
                  filter={filter}
                  selections={selections}
                  onToggle={handleToggle}
                />
              ))}

              <Footer>
                <ClearBtn onClick={handleClear}>
                  {totalSelected > 0 ? `Clear (${totalSelected})` : "Clear all"}
                </ClearBtn>
                <ButtonStyled variant="secondary" onClick={handleApply}>
                  Apply filters
                </ButtonStyled>
              </Footer>
            </div>
          </PanelWrapper>
        )}
      </DropdownContainer>
    </>
  );
};

export default FilterDropdown;
