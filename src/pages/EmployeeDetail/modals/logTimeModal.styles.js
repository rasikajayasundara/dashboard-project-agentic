import styled from "styled-components";
import { colors, fontSize } from "../../../constants/common";
export { Overlay, ModalBox, ModalHeader, ModalTitle, CloseBtn, ModalFooter, FooterButtons, CancelBtn, SaveBtn } from "../../../components/ModalShell";

// ── Week strip ────────────────────────────────────────────────────────────────

export const WeekStrip = styled.div`
  padding: 8px 20px;
  border-bottom: 2px solid ${colors.borderLight};
  background: ${colors.backgroundGray};
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
`;

export const WeekTotalLabel = styled.span`
  font-size: ${fontSize.subtitle};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: ${colors.textMuted};
  white-space: nowrap;
  flex-shrink: 0;
`;

export const WeekStripLabel = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  white-space: nowrap;
  flex-shrink: 0;
`;

export const WeekStripBar = styled.div`
  flex: 1;
`;

export const WeekStripHours = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textPrimary};
  white-space: nowrap;
  flex-shrink: 0;
`;

export const AddingBadge = styled.span`
  font-size: ${fontSize.badge};
  font-weight: 600;
  color: ${({ $over }) => $over ? "#dc2626" : "#16a34a"};
  background: ${({ $over }) => $over ? "#fee2e2" : "#dcfce7"};
  border-radius: 9999px;
  padding: 2px 8px;
  white-space: nowrap;
  flex-shrink: 0;
`;

// ── Body ──────────────────────────────────────────────────────────────────────

export const ModalBody = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;
`;

// ── Sidebar ───────────────────────────────────────────────────────────────────

export const Sidebar = styled.div`
  width: 188px;
  flex-shrink: 0;
  border-right: 1px solid ${colors.borderLight};
  overflow-y: auto;
  padding: 10px 8px;
  background: ${colors.backgroundGray};
`;

export const SidebarLabel = styled.p`
  font-size: ${fontSize.subtitle};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: ${colors.textMuted};
  margin: 0 0 10px 6px;
`;

export const SidebarItem = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 7px;
  width: 100%;
  background: ${({ $active }) => ($active ? "#fff" : "none")};
  border: 1px solid ${({ $active }) => ($active ? colors.borderColor : "transparent")};
  border-radius: 7px;
  padding: 6px 8px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s, border-color 0.15s;
  margin-bottom: 3px;

  &:hover {
    background: #fff;
    border-color: ${colors.borderColor};
  }
`;

export const SidebarDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
  margin-top: 3px;
`;

export const SidebarMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

export const SidebarProjectNo = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 700;
  color: ${colors.textPrimary};
`;

export const SidebarProjectName = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SidebarHoursBadge = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 700;
  color: ${({ $hasHours }) => ($hasHours ? "#16a34a" : colors.textMuted)};
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 1px;
`;

// ── Main content (right of sidebar) ──────────────────────────────────────────

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
`;

export const MainPanel = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 14px 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
`;

// ── Project section ───────────────────────────────────────────────────────────

export const ProjectSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const ProjectHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid ${colors.borderLight};
`;

export const ProjectAccent = styled.div`
  width: 3px;
  height: 20px;
  border-radius: 9999px;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const ProjectHeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
`;

export const ProjectNo = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 700;
  color: ${colors.textPrimary};
`;

export const ProjectName = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
`;

export const ProjectHoursTotal = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${({ $hasHours }) => ($hasHours ? "#16a34a" : colors.textMuted)};
  white-space: nowrap;
`;

// ── Task card ─────────────────────────────────────────────────────────────────

export const TaskCard = styled.div`
  padding: 10px 2px;
  border-bottom: 1px solid ${colors.borderLight};
  background: #fff;

  &:last-child {
    border-bottom: none;
  }
`;

export const TaskRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const TaskMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
`;

export const TaskName = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textPrimary};
  line-height: 1.3;
`;

export const TaskBudget = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  line-height: 1.3;
`;

export const HoursWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

export const HoursInput = styled.input`
  width: 54px;
  padding: 4px 6px;
  border: 1.5px solid ${({ $active }) => ($active ? "#3796BF" : colors.borderColor)};
  border-radius: 7px;
  font-size: ${fontSize.highlight};
  font-weight: 700;
  color: ${colors.textPrimary};
  text-align: center;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  background: ${({ $active }) => ($active ? "#f0f9ff" : "#fff")};

  &:focus {
    border-color: #3796BF;
    box-shadow: 0 0 0 3px rgba(55, 150, 191, 0.12);
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 0.6;
  }
`;

export const HoursUnit = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  font-weight: 500;
`;

export const TaskNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const TaskMeta2 = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

export const TaskProgressTrack = styled.div`
  width: 72px;
  height: 3px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  flex-shrink: 0;
`;

export const TaskProgressFill = styled.div`
  height: 100%;
  border-radius: 2px;
  width: ${({ $pct }) => Math.min($pct, 100)}%;
  background: ${({ $pct }) =>
    $pct > 100 ? "#ef4444" :
    $pct >= 80  ? "#f59e0b" : "#22c55e"};
`;

export const TaskProgressLabel = styled.span`
  font-size: ${fontSize.highlight};
  color: ${({ $over }) => $over ? "#ef4444" : colors.textMuted};
  font-weight: ${({ $over }) => $over ? "600" : "400"};
  white-space: nowrap;
`;

export const TaskDateRange = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  white-space: nowrap;
  margin-left: auto;
`;

export const CommentWrap = styled.div`
  margin-top: 7px;
`;

export const CommentInput = styled.textarea`
  width: 100%;
  resize: none;
  border: 1.5px solid ${({ $error }) => $error ? "#ef4444" : colors.borderColor};
  border-radius: 7px;
  padding: 6px 10px;
  font-size: ${fontSize.general};
  color: ${colors.textSecondary};
  outline: none;
  line-height: 1.5;
  box-sizing: border-box;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus {
    border-color: ${({ $error }) => $error ? "#ef4444" : "#3796BF"};
    box-shadow: 0 0 0 3px ${({ $error }) => $error ? "rgba(239,68,68,0.12)" : "rgba(55,150,191,0.12)"};
  }

  &::placeholder {
    color: #d1d5db;
  }
`;

export const CommentError = styled.span`
  font-size: ${fontSize.subtitle};
  color: #ef4444;
  margin-top: 3px;
  display: block;
`;

// ── Footer (ModalFooter, FooterButtons, CancelBtn, SaveBtn → ModalShell) ─────

export const FooterTotals = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FooterToday = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 700;
  color: ${({ $over }) => $over ? "#ef4444" : colors.textPrimary};
`;

export const FooterSep = styled.span`
  font-size: ${fontSize.general};
  color: ${colors.borderColor};
`;

export const FooterError = styled.span`
  font-size: ${fontSize.subtitle};
  font-weight: 500;
  color: #ef4444;
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const FooterWeek = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};

  strong {
    color: ${({ $over }) => $over ? "#ef4444" : colors.textPrimary};
    font-weight: 600;
  }
`;

// ── New entry section header ──────────────────────────────────────────────────

export const NewEntryHeader = styled.div`
  padding: 10px 20px 0;
  flex-shrink: 0;
`;

export const NewEntryTitle = styled.p`
  font-size: ${fontSize.subtitle};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${colors.textMuted};
  margin: 0;
`;

// ── Task search bar ───────────────────────────────────────────────────────────

export const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  border-bottom: 1px solid ${colors.borderLight};
  flex-shrink: 0;
  background: #fff;
`;

export const SearchIcon = styled.i`
  font-size: 13px;
  color: ${colors.textMuted};
  flex-shrink: 0;
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: ${fontSize.general};
  color: ${colors.textPrimary};
  background: transparent;

  &::placeholder {
    color: #d1d5db;
  }
`;

export const SearchClear = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${colors.textMuted};
  font-size: 13px;
  line-height: 1;
  display: flex;
  align-items: center;

  &:hover { color: ${colors.textPrimary}; }
`;

// ── Existing entries (already logged today) ───────────────────────────────────

export const ExistingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 20px 12px;
  border-top: 2px solid ${colors.borderLight};
  border-bottom: 1px solid ${colors.borderLight};
  flex-shrink: 0;
  background: #fff;
`;

export const ExistingSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const ExistingSectionRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

export const ExistingSectionTitle = styled.p`
  font-size: ${fontSize.subtitle};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${colors.textMuted};
  margin: 0;
  flex-shrink: 0;
`;

export const TodayMiniBarTrack = styled.div`
  width: 80px;
  flex-shrink: 0;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
`;

export const TodayMiniBarFill = styled.div`
  height: 100%;
  border-radius: 2px;
  width: ${({ $pct }) => Math.min($pct, 100)}%;
  background: ${({ $pct }) =>
    $pct >= 100 ? "#22c55e" :
    $pct >= 75  ? "#f59e0b" : "#3796BF"};
  transition: width 0.3s ease;
`;

export const TodayMiniBarLabel = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textPrimary};
  white-space: nowrap;
  flex-shrink: 0;
`;

export const ExistingEntriesBox = styled.div`
  border: 1px solid ${colors.borderColor};
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
`;

export const ExistingEntryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  background: #fff;

  & + & {
    border-top: 1px solid ${colors.borderLight};
  }
`;

export const ExistingEntryAccent = styled.div`
  width: 3px;
  align-self: stretch;
  background: #3796BF;
  flex-shrink: 0;
`;

export const ExistingEntryBody = styled.div`
  display: flex;
  align-items: stretch;
  gap: 12px;
  padding: 7px 12px;
  flex: 1;
  min-width: 0;
`;

export const ExistingEntryLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
  flex: 1;
  min-width: 0;
`;

export const ExistingEntryRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 3px;
  flex-shrink: 0;
`;

export const ExistingEntryText = styled.span`
  font-size: ${fontSize.highlight};
  color: ${colors.textPrimary};
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ExistingEntryHours = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 700;
  color: ${colors.textPrimary};
  white-space: nowrap;
`;

export const ExistingEntryTaskLine = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
`;

export const ExistingEntryTask = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textSecondary};
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
  min-width: 0;
`;

export const ExistingEntryBudget = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  white-space: nowrap;
  flex-shrink: 0;
`;

export const ExistingEntryComment = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  font-style: italic;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
  text-align: right;
`;

export const ExistingEntryActSep = styled.div`
  width: 1px;
  background: ${colors.borderLight};
  flex-shrink: 0;
  margin: 2px 0;
`;

export const ExistingEntryActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  flex-shrink: 0;
  padding: 0 2px;
`;

export const ExistingEntryActionBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  background: ${({ $variant, $active }) =>
    $active
      ? $variant === "delete" ? "#fee2e2" : "#dbeafe"
      : "none"};
  border-radius: 5px;
  cursor: pointer;
  color: ${({ $variant, $active }) =>
    $active
      ? $variant === "delete" ? "#ef4444" : "#3796BF"
      : colors.textMuted};
  font-size: 11px;
  padding: 0;
  transition: background 0.13s, color 0.13s;

  &:hover {
    background: ${({ $variant }) => $variant === "delete" ? "#fee2e2" : "#dbeafe"};
    color: ${({ $variant }) => $variant === "delete" ? "#ef4444" : "#3796BF"};
  }
`;
