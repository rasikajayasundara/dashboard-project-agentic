import styled, { keyframes } from "styled-components";
import { colors, fontSize } from "../../../constants/common";
import PanelBase from "../../../components/Panel";

// ── Table shell ───────────────────────────────────────────────────────────────

export const TableWrapper = styled(PanelBase)`
  overflow: hidden;
`;

// Scrolls the fixed-width grid horizontally on narrow viewports instead of
// letting the columns collapse/overlap — same fallback DataTable's own
// TableScrollWrapper uses.
export const TableScrollWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const GRID_COLUMNS = "minmax(220px, 1fr) 190px 120px 170px 220px";
const GRID_MIN_WIDTH = "920px";

export const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: ${GRID_COLUMNS};
  min-width: ${GRID_MIN_WIDTH};
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

// ── Row ───────────────────────────────────────────────────────────────────────

export const Row = styled.div`
  display: grid;
  grid-template-columns: ${GRID_COLUMNS};
  min-width: ${GRID_MIN_WIDTH};
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid ${colors.borderLight};
  cursor: pointer;
  transition: background 0.15s ease;
  user-select: none;

  &:hover {
    background: ${colors.backgroundGray};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const EmployeeCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const ChevronIcon = styled.i`
  font-size: 13px;
  color: ${colors.textMuted};
  transition: transform 0.2s ease;
  transform: ${({ $open }) => ($open ? "rotate(90deg)" : "rotate(0deg)")};
  flex-shrink: 0;
`;

export const AvatarCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  border: 1px solid ${({ $border }) => $border};
`;

export const EmployeeMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
`;

export const EmployeeName = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textPrimary};
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const EmployeeRole = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  line-height: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const WeekLabel = styled.span`
  font-size: ${fontSize.general};
  color: ${colors.textPrimary};
`;

export const HoursCell = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textPrimary};
`;

export const StatusCell = styled.div`
  display: flex;
  align-items: center;
`;

// ── Actions ───────────────────────────────────────────────────────────────────

export const ActionsCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

export const ApproveBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border: 1.5px solid ${colors.accentGreen};
  border-radius: 8px;
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
`;

export const RejectBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border: 1.5px solid ${colors.accentRed};
  border-radius: 8px;
  background: transparent;
  color: ${colors.accentRed};
  font-size: ${fontSize.general};
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: #fef2f2;
  }
`;

export const ReviewedText = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  font-style: italic;
  white-space: nowrap;
`;

// ── Expanded entries (grouped by date) ───────────────────────────────────────

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const EntriesWrapper = styled.div`
  border-bottom: 1px solid ${colors.borderLight};
  background: ${colors.white};
  animation: ${slideDown} 0.18s ease both;
  padding: 12px 20px 18px 66px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  &:last-child {
    border-bottom: none;
  }
`;

// ── Rejection reason banner ───────────────────────────────────────────────────

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
`;

export const DateGroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 0 2px;
`;

export const DateLabel = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textSecondary};
  min-width: 88px;
`;

export const DayInfoText = styled.span`
  margin-left: auto;
  font-size: ${fontSize.highlight};
  font-weight: 700;
  color: ${colors.textPrimary};
  white-space: nowrap;
`;

// ── Entry card ────────────────────────────────────────────────────────────────

export const EntriesBox = styled.div`
  border: 1px solid ${colors.borderColor};
  border-radius: 8px;
  overflow: hidden;
  background: ${colors.white};
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

export const EntryHours = styled.span`
  font-size: ${fontSize.general};
  color: ${colors.textPrimary};
  white-space: nowrap;
`;

export const EntryComment = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  font-style: italic;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
  text-align: right;
`;

// ── Empty ─────────────────────────────────────────────────────────────────────

export const EmptyEntries = styled.div`
  padding: 40px 24px;
  text-align: center;
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
`;
