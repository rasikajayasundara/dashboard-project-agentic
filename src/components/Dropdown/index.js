import React, { useState, useRef, useEffect } from "react";
import {
  DropdownContainer,
  Input,
  DropdownList,
  DropdownItem,
} from "./styles";

const SearchableDropdown = ({ options = [], onSelect, placeholder }) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef();

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownContainer ref={containerRef}>
      <Input
        placeholder={placeholder || "Search..."}
        value={search}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isOpen && (
        <DropdownList>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((item, index) => (
              <DropdownItem
                key={index}
                onClick={() => {
                  setSearch(item);
                  setIsOpen(false);
                  onSelect && onSelect(item);
                }}
              >
                {item}
              </DropdownItem>
            ))
          ) : (
            <DropdownItem>No results found</DropdownItem>
          )}
        </DropdownList>
      )}
    </DropdownContainer>
  );
};

export default SearchableDropdown;