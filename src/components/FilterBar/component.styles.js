import styled from "styled-components";
import { colors, fontSize } from "../../constants/common";

export const FilterBarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: ${colors.white};
  border-bottom: 1px solid ${colors.borderLight};
  flex-wrap: wrap;
  gap: 8px;
`;

export const FilterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const FilterRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ResetFiltersBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  padding: 8px 4px;
  font-size: ${fontSize.general};
  font-weight: 500;
  color: ${colors.textMuted};
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.15s;

  &:hover {
    color: ${colors.accentBlue};
  }

  i {
    font-size: 13px;
  }
`;

// ── Search ────────────────────────────────────────────────────────────────────

export const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const SearchIcon = styled.i`
  position: absolute;
  left: 12px;
  font-size: 14px;
  color: ${colors.textMuted};
  pointer-events: none;
`;

export const SearchInput = styled.input`
  background: ${colors.white};
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 14px 8px 36px;
  font-size: ${fontSize.general};
  color: #111827;
  width: 220px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder {
    color: ${colors.textMuted};
  }
  &:focus {
    border-color: ${colors.accentBlue};
    box-shadow: 0 0 0 3px rgba(55, 150, 191, 0.1);
  }
`;

// ── Filter button + dropdown ──────────────────────────────────────────────────

export const FilterBtnWrapper = styled.div`
  position: relative;
`;

export const FilterBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${({ $active }) => ($active ? colors.accentBlueLight : colors.white)};
  border: 1px solid ${({ $active }) => ($active ? colors.accentBlue : "#e5e7eb")};
  border-radius: 8px;
  padding: 8px 12px;
  font-size: ${fontSize.general};
  font-weight: ${({ $active }) => ($active ? "600" : "500")};
  color: ${({ $active }) => ($active ? colors.accentBlue : "#374151")};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;

  &:hover {
    background: ${({ $active }) => ($active ? colors.accentBlueLight : colors.bgHover)};
    border-color: ${({ $active }) => ($active ? colors.accentBlue : "#d1d5db")};
  }

  .btn-icon {
    font-size: 12px;
    color: ${({ $active }) => ($active ? colors.accentBlue : colors.textMuted)};
  }
`;

export const ClearBtn = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-size: 15px;
  line-height: 1;
  border-radius: 9999px;
  color: ${colors.accentBlue};
  margin-left: 2px;

  &:hover {
    background: rgba(55, 150, 191, 0.2);
  }
`;

export const DropdownPanel = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 200;
  background: ${colors.white};
  border: 1px solid ${colors.borderLight};
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  min-width: 180px;
  max-height: 240px;
  overflow-y: auto;
  padding: 4px 0;
`;

export const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 14px;
  background: ${({ $active }) => ($active ? colors.accentBlueLight : "transparent")};
  border: none;
  font-size: ${fontSize.general};
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  color: ${({ $active }) => ($active ? colors.accentBlue : colors.textPrimary)};
  cursor: pointer;
  text-align: left;
  transition: background 0.1s;

  &:hover {
    background: ${({ $active }) => ($active ? colors.accentBlueLight : colors.bgHover)};
  }

  i {
    font-size: 12px;
  }
`;

export const DropdownEmpty = styled.div`
  padding: 12px 14px;
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
`;

// ── Date range filter ─────────────────────────────────────────────────────────

export const DateRangePanel = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 200;
  background: ${colors.white};
  border: 1px solid ${colors.borderLight};
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  width: 240px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const DateRangeBackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  align-self: flex-start;
  background: transparent;
  border: none;
  color: ${colors.textMuted};
  font-size: ${fontSize.subtitle};
  font-weight: 600;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #374151;
  }

  i {
    font-size: 11px;
  }
`;

export const DateRangeField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const DateRangeLabel = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  font-weight: 600;
`;

export const DateRangeInput = styled.input`
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 7px 10px;
  font-size: ${fontSize.general};
  color: #111827;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: ${colors.accentBlue};
    box-shadow: 0 0 0 3px rgba(55, 150, 191, 0.1);
  }
`;

export const DateRangeActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding-top: 4px;
  border-top: 1px solid ${colors.borderLight};
`;

export const DateRangeClearBtn = styled.button`
  background: transparent;
  border: none;
  color: ${colors.textMuted};
  font-size: ${fontSize.general};
  font-weight: 500;
  cursor: pointer;
  padding: 6px 8px;

  &:hover {
    color: #374151;
  }
`;

export const DateRangeApplyBtn = styled.button`
  background: ${colors.accentBlue};
  border: none;
  border-radius: 6px;
  color: ${colors.white};
  font-size: ${fontSize.general};
  font-weight: 600;
  padding: 7px 14px;
  cursor: pointer;
  transition: opacity 0.15s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;
