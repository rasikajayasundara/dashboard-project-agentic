import styled, { css } from "styled-components";
import { colors, fontSize } from "../../../constants/common";
import { colorOpacity } from "../../../utils/common";
import PanelBase from "../../../components/Panel";

export const TeamTabWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const MemberCard = styled(PanelBase)`
  overflow: hidden;
`;

export const EmptyStateCard = styled(PanelBase)`
  padding: 24px;
`;

export const MemberCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
  &:hover {
    background: ${colors.bgHover};
  }
`;

export const MemberAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  border: 1.5px solid ${({ $border }) => $border};
`;

export const MemberInfo = styled.div`
  flex-shrink: 0;
  width: 200px;
`;

export const MemberName = styled.div`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textPrimary};
`;

export const MemberRole = styled.div`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  margin-top: 2px;
`;

export const HoursSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
`;

export const HoursBarTrack = styled.div`
  position: relative;
  height: 8px;
  border-radius: 4px;
  background: ${colors.borderLight};
  overflow: hidden;
`;

export const HoursBarLayer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 4px;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $color }) => $color};
`;

export const HoursBarMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  font-style: italic;
`;

export const TaskStatRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-shrink: 0;
`;

export const TaskStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

export const TaskStatNum = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${({ $color }) => $color || colors.textPrimary};
  line-height: 1;
`;

export const TaskStatLabel = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const Chevron = styled.i`
  font-size: 13px;
  color: ${colors.textMuted};
  transition: transform 0.2s;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};
  flex-shrink: 0;
  margin-left: 4px;
`;

export const TaskListWrapper = styled.div`
  border-top: 1px solid ${colors.borderLight};
`;

export const TaskTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${fontSize.general};
`;

export const TaskTableHead = styled.thead`
  background: ${colors.bgTableHead};
`;

export const TaskTh = styled.th`
  padding: 9px 14px;
  font-size: ${fontSize.subtitle};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${colors.textMuted};
  text-align: left;
  white-space: nowrap;
  border-bottom: 1px solid ${colors.borderLight};
`;

export const TaskTd = styled.td`
  padding: 11px 14px;
  color: ${colors.textPrimary};
  border-bottom: 1px solid ${colors.borderLight};
  vertical-align: middle;

  &:last-child {
    border-bottom: none;
  }

  tr:last-child & {
    border-bottom: none;
  }
`;

export const TaskIdChip = styled.span`
  display: inline-block;
  font-size: ${fontSize.badge};
  font-weight: 600;
  color: ${colors.accentBlue};
  background: ${colorOpacity(colors.accentBlue, 0.08)};
  border: none;
  border-radius: 4px;
  padding: 2px 6px;
  white-space: nowrap;
`;

export const TaskNameText = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 500;
  color: ${({ $done }) => ($done ? colors.textMuted : colors.textPrimary)};
  text-decoration: ${({ $done }) => ($done ? "line-through" : "none")};
`;

const STATUS_STYLES = {
  done: css`
    background: #dcfce7;
    color: #16a34a;
    border: 1px solid #bbf7d0;
  `,
  inprogress: css`
    background: #fef9c3;
    color: #92400e;
    border: 1px solid #fde68a;
  `,
  due: css`
    background: #fee2e2;
    color: #dc2626;
    border: 1px solid #fecaca;
  `,
  "at risk": css`
    background: #fef3c7;
    color: #b45309;
    border: 1px solid #fde68a;
  `,
};

export const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: ${fontSize.badge};
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 9999px;
  white-space: nowrap;
  ${({ $status }) => STATUS_STYLES[$status] || STATUS_STYLES["inprogress"]}
`;

export const TaskProgressBar = styled.div`
  position: relative;
  width: 80px;
  height: 6px;
  border-radius: 3px;
  background: ${colors.borderLight};
  overflow: hidden;
`;

export const TaskProgressFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 3px;
  width: ${({ $pct }) => Math.min($pct, 100)}%;
  background: ${({ $over }) => ($over ? colors.accentRed : colors.accentBlue)};
`;
