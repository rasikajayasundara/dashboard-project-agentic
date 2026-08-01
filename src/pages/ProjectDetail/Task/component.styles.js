import styled from "styled-components";
import { colors, fontSize } from "../../../constants/common";
import { colorOpacity } from "../../../utils/common";
import PanelBase from "../../../components/Panel";
import { panelShadow } from "../../../components/Panel/component.styles";

export const TaskWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* ── Budget group card ────────────────────────────────────────────────────── */

export const BudgetCard = styled(PanelBase)`
  border-color: ${({ $focused }) => ($focused ? colors.accentBlue : "rgba(31, 41, 66, 0.03)")};
  overflow: hidden;
  box-shadow: ${({ $focused }) =>
    $focused ? `0 0 0 3px ${colorOpacity(colors.accentBlue, 0.15)}` : panelShadow};
  transition: border-color 0.3s, box-shadow 0.3s;
`;

export const EmptyStateCard = styled(PanelBase)`
  padding: 24px;
`;

export const BudgetCardHeader = styled.div`
  padding: 14px 16px 12px;
  border-bottom: 1px solid ${colors.borderLight};
`;

export const BudgetHeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
`;

export const BudgetHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
`;

export const BudgetIdBadge = styled.span`
  font-size: ${fontSize.badge};
  font-weight: 600;
  color: ${colors.textMuted};
  background: ${colors.backgroundGray};
  border: 1px solid ${colors.borderLight};
  border-radius: 4px;
  padding: 2px 7px;
  white-space: nowrap;
  flex-shrink: 0;
`;

export const BudgetTitle = styled.span`
  font-size: ${fontSize.header};
  font-weight: 600;
  color: ${colors.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const BudgetHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

export const TaskCountChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: ${fontSize.badge};
  font-weight: 500;
  color: ${colors.textSecondary};
  background: ${colors.backgroundGray};
  border: 1px solid ${colors.borderLight};
  border-radius: 9999px;
  padding: 2px 9px;
  white-space: nowrap;

  i { font-size: 11px; color: ${colors.textMuted}; }
`;

export const HeaderStat = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  white-space: nowrap;

  strong {
    font-weight: 600;
    color: ${colors.textSecondary};
  }
`;

export const BudgetProgressWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const BudgetProgressMeta = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  white-space: nowrap;
  flex-shrink: 0;
  font-style: italic;
`;

/* ── Table ────────────────────────────────────────────────────────────────── */

export const TaskTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Thead = styled.thead`
  background: ${colors.bgTableHead};
  border-bottom: 1px solid ${colors.borderLight};
`;

export const Th = styled.th`
  padding: 10px 16px;
  font-size: ${fontSize.subtitle};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${colors.textMuted};
  text-align: left;
  white-space: nowrap;
`;

export const Tr = styled.tr`
  border-bottom: 1px solid ${colors.borderLight};
  transition: background 0.15s;
  cursor: pointer;
  &:last-child { border-bottom: none; }
  &:hover { background: ${colors.bgHover}; }
`;

export const Td = styled.td`
  padding: 12px 16px;
  font-size: ${fontSize.general};
  color: ${colors.textPrimary};
  vertical-align: middle;

  &:nth-child(5), &:nth-child(6) {
    text-align: right;
  }

  /* OptionsMenu's root is a block div — text-align doesn't reposition it,
     so force its own content flush right instead of relying on inheritance. */
  &:nth-child(6) > div {
    display: flex;
    justify-content: flex-end;
  }
`;

/* ── Task cell ────────────────────────────────────────────────────────────── */

export const TaskCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const TaskTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const TaskDateRange = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  white-space: nowrap;
  text-align: right;
`;

export const TaskIdChip = styled.button`
  display: inline-block;
  font-size: ${fontSize.badge};
  font-weight: 600;
  color: ${colors.accentBlue};
  background: ${colorOpacity(colors.accentBlue, 0.08)};
  border: none;
  border-radius: 4px;
  padding: 1px 6px;
  cursor: pointer;
  white-space: nowrap;
  width: fit-content;
  transition: background 0.15s;

  &:hover { background: ${colorOpacity(colors.accentBlue, 0.16)}; }
`;

export const TaskNameText = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 500;
  color: ${colors.textPrimary};
  line-height: 1.4;
`;

/* ── Allocations cell ─────────────────────────────────────────────────────── */

export const AvatarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  flex-wrap: wrap;
`;

export const AvatarChip = styled.span`
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  background: ${({ $bg }) => $bg || colors.backgroundGray};
  color: ${({ $color }) => $color || colors.textSecondary};
  border: 2px solid ${colors.white};
  box-shadow: 0 0 0 1px ${colors.borderLight};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  cursor: default;
  flex-shrink: 0;
`;

export const AddAssignBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  background: ${colors.white};
  border: 1.5px dashed ${colors.borderLight};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: ${colors.textMuted};
  cursor: pointer;
  flex-shrink: 0;
  transition: border-color 0.15s, color 0.15s;

  &:hover {
    border-color: ${colors.accentBlue};
    color: ${colors.accentBlue};
  }
`;

/* ── Progress cell ────────────────────────────────────────────────────────── */

export const ProgressCell = styled.div`
  min-width: 130px;
`;

export const ProgressMeta = styled.div`
  margin-top: 4px;
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  white-space: nowrap;
  display: flex;
  justify-content: space-between;
  font-style: italic;
`;

/* ── Total row ────────────────────────────────────────────────────────────── */

export const TotalRow = styled.tr`
  background: ${colors.bgTableHead};
  border-top: 2px solid ${colors.borderLight};
`;

export const TotalLabelTd = styled.td`
  padding: 10px 16px;
  font-size: ${fontSize.highlight};
  font-weight: 700;
  color: ${colors.textPrimary};
`;

export const TotalValueTd = styled.td`
  padding: 10px 16px;
  font-size: ${fontSize.highlight};
  font-weight: 700;
  color: ${colors.textPrimary};
  white-space: nowrap;
  text-align: right;
`;

/* ── Add task button ──────────────────────────────────────────────────────── */

export const AddTaskBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: ${fontSize.general};
  font-weight: 500;
  color: ${colors.accentBlue};
  background: ${colorOpacity(colors.accentBlue, 0.06)};
  border: 1px solid ${colorOpacity(colors.accentBlue, 0.25)};
  border-radius: 6px;
  padding: 5px 11px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, border-color 0.15s;

  i { font-size: 13px; }

  &:hover {
    background: ${colorOpacity(colors.accentBlue, 0.12)};
    border-color: ${colors.accentBlue};
  }
`;

/* ── Empty state ──────────────────────────────────────────────────────────── */

export const EmptyCell = styled.td`
  text-align: center;
  padding: 12px 16px;
  color: ${colors.textMuted};
  font-size: ${fontSize.general};
`;

export const AddTaskRow = styled.tr`
  border-bottom: 1px solid ${colors.borderLight};
  background: ${colors.white};
`;

export const AddTaskCell = styled.td`
  padding: 8px 16px;
`;

export const AddTaskLink = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  background: none;
  border: 1.5px dashed ${colors.accentOrange};
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;
  color: ${colors.accentOrange};
  font-size: ${fontSize.general};
  font-weight: 500;
  text-align: left;
  transition: background 0.15s ease;

  i { font-size: 14px; }

  &:hover {
    background: ${colorOpacity(colors.accentOrange, 0.06)};
  }
`;
