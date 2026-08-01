import styled from "styled-components";
import { colors, fontSize } from "../../../constants/common";
import { colorOpacity } from "../../../utils/common";
import PanelBase from "../../../components/Panel";

export const BudgetWrapper = styled.div`
`;

/* ── Table header bar ─────────────────────────────────────────────────────── */

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

export const AddBudgetBtn = styled.button`
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

/* ── Card shell ───────────────────────────────────────────────────────────── */

export const TableCard = styled(PanelBase)`
  /* overflow must stay visible so row OptionsMenu dropdowns aren't clipped */
`;

/* ── Table ────────────────────────────────────────────────────────────────── */

export const BudgetTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

export const Thead = styled.thead`
  background: ${colors.bgTableHead};
  border-bottom: 1px solid ${colors.borderLight};
`;

export const Th = styled.th`
  padding: 12px 16px;
  font-size: ${fontSize.subtitle};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${colors.textMuted};
  text-align: ${({ $right }) => ($right ? "right" : "left")};
  white-space: nowrap;
`;

export const Tr = styled.tr`
  border-bottom: 1px solid ${colors.borderLight};
  transition: background 0.15s;
  &:last-child { border-bottom: none; }
  &:hover { background: ${colors.bgHover}; }
`;

export const Td = styled.td`
  padding: 14px 16px;
  font-size: ${fontSize.general};
  color: ${colors.textPrimary};
  vertical-align: middle;
  text-align: ${({ $right }) => ($right ? "right" : "left")};
`;

/* ── Cell components ──────────────────────────────────────────────────────── */

export const BudgetId = styled.span`
  font-size: ${fontSize.badge};
  font-weight: 500;
  color: ${colors.textMuted};
  background: ${colors.backgroundGray};
  border: 1px solid ${colors.borderLight};
  border-radius: 4px;
  padding: 2px 7px;
  white-space: nowrap;
`;

export const BudgetName = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 500;
  color: ${colors.textPrimary};
  line-height: 1.4;
`;

export const TypeBadge = styled.span`
  display: inline-block;
  font-size: ${fontSize.badge};
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 9999px;
  background: ${colorOpacity(colors.accentBlue, 0.1)};
  color: ${colors.accentBlue};
  white-space: nowrap;
`;

export const TaskChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: ${fontSize.badge};
  font-weight: 500;
  color: ${colors.textSecondary};
  background: ${colors.backgroundGray};
  border: 1px solid ${colors.borderLight};
  border-radius: 9999px;
  padding: 3px 10px;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: ${colorOpacity(colors.accentBlue, 0.1)};
    border-color: ${colors.accentBlue};
    color: ${colors.accentBlue};
  }

  i {
    font-size: 11px;
    color: ${colors.textMuted};
  }

  &:hover i {
    color: ${colors.accentBlue};
  }
`;

export const ProgressCell = styled.div`
  min-width: 190px;
`;

export const SpentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  font-style: italic;
`;

export const AmountPrimary = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textPrimary};
  font-variant-numeric: tabular-nums;
`;

/* ── Total footer ─────────────────────────────────────────────────────────── */

export const TotalRow = styled.tr`
  border-top: 2px solid ${colors.borderLight};
`;

export const TotalLabelTd = styled.td`
  padding: 14px 16px;
  font-size: ${fontSize.highlight};
  font-weight: 700;
  color: ${colors.textSecondary};
  text-align: right;
  background: ${colors.bgTableHead};
  border-bottom-left-radius: 9px;
`;

export const TotalAmountTd = styled.td`
  padding: 14px 16px;
  text-align: right;
  white-space: nowrap;
  background: ${colors.bgTableHead};
`;

/* trailing spacer cell under the options column — carries the footer's
   rounded bottom-right corner */
export const TotalEndTd = styled.td`
  background: ${colors.bgTableHead};
  border-bottom-right-radius: 9px;
`;

export const TotalAmount = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${colors.textPrimary};
  font-variant-numeric: tabular-nums;
`;

/* ── Toggle switch ────────────────────────────────────────────────────────── */

export const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 34px;
  height: 18px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  flex-shrink: 0;

  input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
  }

  span {
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background: #D1D5DB;
    opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
    transition: background 0.2s;

    &::after {
      content: "";
      position: absolute;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: ${colors.white};
      top: 2px;
      left: 2px;
      transition: transform 0.2s;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
    }
  }

  input:checked + span {
    background: ${colors.pastelBlue};
    &::after { transform: translateX(16px); }
  }

  input:focus-visible + span {
    outline: 2px solid ${colors.pastelBlue};
    outline-offset: 2px;
  }
`;

/* ── Empty state ──────────────────────────────────────────────────────────── */

export const EmptyCell = styled.td`
  text-align: center;
  padding: 16px;
  color: ${colors.textMuted};
  font-size: ${fontSize.general};
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 20px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;
