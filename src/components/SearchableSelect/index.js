import { useEffect, useMemo, useRef, useState } from "react";
import {
  Wrapper,
  Button,
  Caret,
  Dropdown,
  SearchInput,
  Option,
  OptionList,
  NoData,
} from "./component.styles";

const SearchableSelect = ({
  label,
  options,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [hoverIndex, setHoverIndex] = useState(-1);

  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return options;
    return options.filter((o) => o.toLowerCase().includes(term));
  }, [options, q]);


  useEffect(() => {
    const onDocClick = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      inputRef.current?.select();
    } else {
      setQ("");
      setHoverIndex(-1);
    }
  }, [open]);

  const currentLabel = value === "All" ? label : value;

  return (
    <Wrapper ref={wrapRef}>
      <Button onClick={() => setOpen((o) => !o)}>
        <span>{currentLabel}</span>
        <Caret open={open} />
      </Button>

      {open && (
        <Dropdown>
          <SearchInput
            ref={inputRef}
            placeholder="Type to search…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setHoverIndex(0);
            }}
          />

          {/* All option */}
          <Option
            active={value === "All"}
            onMouseEnter={() => setHoverIndex(-1)}
            onClick={() => {
              onChange("All");
              setOpen(false);
            }}
          >
            {label}
          </Option>

          <OptionList ref={listRef}>
            {filtered.length ? (
              filtered.map((opt, i) => (
                <Option
                  key={opt}
                  active={opt === value}
                  hover={i === hoverIndex}
                  onMouseEnter={() => setHoverIndex(i)}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                >
                  {opt}
                </Option>
              ))
            ) : (
              <NoData>No matches</NoData>
            )}
          </OptionList>
        </Dropdown>
      )}
    </Wrapper>
  );
};

export default SearchableSelect;
