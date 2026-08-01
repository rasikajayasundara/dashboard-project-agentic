import styled, { keyframes, css } from "styled-components";
import { colors, fontSize } from "../../constants/common";
import PanelBase from "../Panel";

// ── Table shell ───────────────────────────────────────────────────────────────

export const TableWrapper = styled(PanelBase)`
  overflow: hidden;
`;

export const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 140px 220px 160px;
  align-items: center;
  padding: 10px 20px;
  background: ${colors.backgroundGray};
  border-bottom: 1px solid ${colors.borderColor};
`;

export const HeaderCell = styled.span`
  font-size: ${fontSize.subtitle};
  font-weight: 600;
  color: ${colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.4px;

  &:last-child {
    text-align: right;
  }
`;

// ── Week row ──────────────────────────────────────────────────────────────────

export const WeekRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 140px 220px 160px;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid ${colors.borderLight};
  cursor: pointer;
  transition: background 0.15s ease;
  user-select: none;
  background: ${({ $rejected }) => ($rejected ? "#fef2f2" : "transparent")};

  &:hover {
    background: ${({ $rejected }) => ($rejected ? "#fee2e2" : colors.backgroundGray)};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const WeekLabelCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ChevronIcon = styled.i`
  font-size: 13px;
  color: ${colors.textMuted};
  transition: transform 0.2s ease;
  transform: ${({ $open }) => ($open ? "rotate(90deg)" : "rotate(0deg)")};
  flex-shrink: 0;
`;

export const WeekLabel = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 500;
  color: ${({ $current }) => ($current ? "#3796BF" : colors.textPrimary)};
`;

export const CurrentBadge = styled.span`
  font-size: ${fontSize.badge};
  font-weight: 500;
  color: #3796BF;
  background: #DBEAF7;
  border-radius: 9999px;
  padding: 2px 8px;
  white-space: nowrap;
`;

export const HoursCell = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textPrimary};
`;

export const ProgressCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-right: 16px;
`;

export const StatusCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

export const StatusText = styled.span`
  font-size: ${fontSize.general};
  color: ${({ $status }) =>
    $status === "Approved"  ? "#166534" :
    $status === "Submitted" ? "#92400E" :
    $status === "Rejected"  ? colors.accentRed :
    colors.textMuted};
  font-weight: ${({ $status }) => ($status !== "Not Submitted" ? "600" : "400")};
`;

export const SubmitBtn = styled.button`
  padding: 4px 10px;
  border: 1.5px solid ${colors.accentGreen};
  border-radius: 6px;
  background: transparent;
  color: ${colors.accentGreen};
  font-size: ${fontSize.general};
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: #f0fdf4;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      background: transparent;
    }
  }
`;

export const DeleteBtn = styled.button`
  background: none;
  border: none;
  padding: 2px 4px;
  cursor: pointer;
  color: ${colors.textMuted};
  font-size: 14px;
  line-height: 1;
  border-radius: 4px;
  transition: color 0.15s ease, background 0.15s ease;

  &:hover {
    color: #EF4444;
    background: #FEE2E2;
  }
`;

// ── Expanded entries (grouped by date) ───────────────────────────────────────

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const EntriesWrapper = styled.div`
  border-bottom: 1px solid ${colors.borderLight};
  background: #ffffff;
  animation: ${slideDown} 0.18s ease both;
  padding: 12px 20px 16px 48px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  &:last-child {
    border-bottom: none;
  }
`;

export const ReasonBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 8px;
  padding: 10px 14px;
  color: ${colors.accentRed};
  font-size: ${fontSize.general};

  i {
    font-size: 14px;
    margin-top: 2px;
    flex-shrink: 0;
  }
`;

export const ReasonText = styled.span`
  color: #991b1b;
  line-height: 1.4;
`;

// ── Date group ────────────────────────────────────────────────────────────────

export const DateGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: ${({ $locked }) => ($locked ? "default" : "pointer")};
  pointer-events: ${({ $locked }) => ($locked ? "none" : "auto")};
`;

export const DateGroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 0 2px;
`;

export const DayMiniBarWrap = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

export const DayInfoText = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 700;
  color: ${colors.textPrimary};
  white-space: nowrap;
`;

export const DayMiniBarTrack = styled.div`
  width: 80px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
`;

export const DayMiniBarFill = styled.div`
  height: 100%;
  border-radius: 2px;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $pct }) =>
    $pct >= 100 ? "#22c55e" :
    $pct >= 70  ? "#f59e0b" : "#3796BF"};
  transition: width 0.3s ease;
`;

export const DateLabel = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${({ $today }) => ($today ? "#f97316" : colors.textSecondary)};
  min-width: 88px;
`;

export const TodayBadge = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 500;
  color: #f97316;
`;

export const AddTodayPrompt = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1.5px dashed #f97316;
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;
  color: #f97316;
  font-size: ${fontSize.general};
  font-weight: 500;
  width: 100%;
  text-align: left;
  transition: background 0.15s ease;

  &:hover {
    background: #fff7ed;
  }
`;

export const DateMeta = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
`;

export const EmptyDateGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const EmptyDateLabel = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textSecondary};
  min-width: 88px;
`;

export const NoEntriesPrompt = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1.5px dashed #d1d5db;
  border-radius: 8px;
  padding: 10px 14px;
  cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};
  color: ${({ $disabled }) => ($disabled ? "#d1d5db" : "#9ca3af")};
  font-size: ${fontSize.general};
  font-weight: 500;
  width: 100%;
  text-align: left;
  transition: background 0.15s ease;
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};
  opacity: ${({ $disabled }) => ($disabled ? 0.35 : 1)};

  &:hover {
    background: ${({ $disabled }) => ($disabled ? "none" : "#f9fafb")};
  }
`;

// ── Entry card ────────────────────────────────────────────────────────────────

export const EntriesBox = styled.div`
  border: 1px solid ${colors.borderColor};
  border-radius: 8px;
  overflow: hidden;
  background: ${({ $hovered }) => ($hovered ? '#f4f9fb' : '#ffffff')};
  transition: background 0.15s;
`;

export const EntryCard = styled.div`
  display: flex;
  align-items: stretch;
  background: transparent;

  & + & {
    border-top: 1px solid ${colors.borderLight};
  }
`;

export const EntryAccent = styled.div`
  width: 4px;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const EntryBody = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 7px 12px;
  flex: 1;
  min-width: 0;
`;

export const EntryMainRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
`;

export const EntryRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
`;

export const EntryTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const EntryDate = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  white-space: nowrap;
  min-width: 84px;
`;

export const EntryProject = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
`;

export const EntryProjectNo = styled.span`
  font-size: ${fontSize.highlight};
  color: ${colors.textPrimary};
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const EntryMeta = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const EntryProjectName = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
`;

export const EntryTask = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 500;
  color: ${colors.textPrimary};
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const EntryHours = styled.span`
  font-size: ${fontSize.general};
  color: ${colors.textPrimary};
  white-space: nowrap;
`;

export const EntrySeparator = styled.div`
  width: 1px;
  height: 20px;
  background: ${colors.borderColor};
  flex-shrink: 0;
  margin: 0 4px;
`;

export const EntryComment = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  font-style: italic;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
  text-align: right;
`;

// ── Budget progress (per entry) ───────────────────────────────────────────────

export const BudgetWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
`;

export const BudgetTrack = styled.div`
  width: 72px;
  height: 3px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
`;

export const BudgetFill = styled.div`
  height: 100%;
  border-radius: 2px;
  width: ${({ $pct }) => Math.min($pct, 100)}%;
  background: ${({ $pct }) =>
    $pct > 100 ? "#ef4444" :
    $pct >= 80  ? "#f59e0b" : "#22c55e"};
`;

export const BudgetLabel = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  white-space: nowrap;
`;

export const NoRecordsText = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  padding: 2px 0;
`;

// ── Empty ─────────────────────────────────────────────────────────────────────

export const EmptyEntries = styled.div`
  padding: 20px 48px;
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
`;

// ── Leave / Public Holiday ────────────────────────────────────────────────────

export const LeaveSlot = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f3f4f6;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 14px;
  color: #9ca3af;
  font-size: ${fontSize.general};
  font-weight: 500;
  width: 100%;
`;
