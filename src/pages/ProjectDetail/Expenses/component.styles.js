import styled from "styled-components";
import { colors, fontSize } from "../../../constants/common";

export const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid ${colors.borderLight};
`;

export const TableTitle = styled.span`
  display: block;
  font-size: ${fontSize.header};
  font-weight: 600;
  color: ${colors.textPrimary};
`;

export const TableHint = styled.span`
  display: block;
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  margin-top: 2px;
`;

export const AddExpenseBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: ${fontSize.general};
  font-weight: 500;
  color: ${colors.white};
  background: ${colors.accentBlue};
  border: none;
  border-radius: 7px;
  padding: 7px 14px;
  cursor: pointer;
  transition: opacity 0.15s;

  i { font-size: 14px; }

  &:hover { opacity: 0.88; }
`;

export const AmountPrimary = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textPrimary};
  font-variant-numeric: tabular-nums;
`;

export const MutedDash = styled.span`
  color: ${colors.textMuted};
`;

export const AttachBtn = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid ${colors.borderColor};
  background: ${colors.white};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${colors.accentBlue};
  transition: background 0.15s, border-color 0.15s;

  i { font-size: 14px; }

  &:hover {
    background: ${colors.accentBlueLight};
    border-color: ${colors.accentBlue};
  }

  &:disabled {
    color: ${colors.textMuted};
    border-color: ${colors.borderLight};
    background: ${colors.bgHover};
    cursor: not-allowed;
  }
`;
