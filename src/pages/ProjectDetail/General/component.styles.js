import styled from "styled-components";
import { colors, fontSize } from "../../../constants/common";
import PanelBase from "../../../components/Panel";

// Layout
export const GeneralGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const TwoCol = styled.div`
  display: grid;
  grid-template-columns: ${({ $split }) => $split || "1fr 1fr"};
  gap: 20px;
  align-items: ${({ $stretch }) => ($stretch ? "stretch" : "start")};
`;

// Section card
export const SectionCard = styled(PanelBase)`
  padding: 20px 24px;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h3`
  font-size: ${fontSize.subtitle};
  font-weight: 600;
  color: ${colors.textSecondary};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

export const SectionAmount = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${colors.textPrimary};
`;

// Summary rows (right of donut)
export const SummaryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const SummaryRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const SummaryRowHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SummaryRowLabel = styled.span`
  font-size: ${fontSize.general};
  color: ${colors.textSecondary};
`;

export const SummaryRowValue = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 700;
  color: ${colors.textPrimary};
`;

// Stacked bar
export const StackedBarWrapper = styled.div`
  position: relative;
`;

export const StackedBarTrack = styled.div`
  height: 12px;
  background: ${colors.borderLight};
  border-radius: 9999px;
  overflow: hidden;
  display: flex;
  margin-bottom: 12px;
`;

export const StackedBarSegment = styled.div`
  height: 100%;
  background: ${({ $color }) => $color};
  width: ${({ $pct }) => $pct}%;
  transition: width 0.4s ease;
`;

export const BreakdownLegend = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

export const BreakdownLegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const LegendDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const LegendLabel = styled.span`
  font-size: ${fontSize.general};
  color: ${colors.textSecondary};
`;

export const LegendValue = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textPrimary};
  margin-left: 2px;
`;

export const BreakdownStatus = styled.p`
  font-size: ${fontSize.subtitle};
  color: ${({ $good }) => ($good ? colors.accentGreen : colors.accentRed)};
  margin: 6px 0 0;
  display: flex;
  align-items: center;
  gap: 4px;
`;

// Budget items
export const BudgetItemList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const BudgetItemRow = styled.div`
  border-bottom: 1px solid ${colors.borderLight};
  padding: 14px 0;
  &:last-child { border-bottom: none; }
`;

export const BudgetItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  cursor: pointer;
  user-select: none;
`;

export const BudgetItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

export const BudgetItemId = styled.span`
  font-size: ${fontSize.badge};
  font-weight: 600;
  color: ${colors.textMuted};
  background: ${colors.bgHover};
  border: 1px solid ${colors.borderLight};
  border-radius: 4px;
  padding: 2px 6px;
  white-space: nowrap;
`;

export const BudgetItemName = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 500;
  color: ${colors.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const BudgetItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

export const BudgetItemAmount = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 700;
  color: ${colors.textPrimary};
`;

export const BudgetItemChevron = styled.i`
  font-size: 12px;
  color: ${colors.textMuted};
  transition: transform 0.2s;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};
`;

export const BudgetItemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  margin-top: 4px;
`;

export const TaskTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  font-size: ${fontSize.general};
`;

export const TaskTableHead = styled.thead`
  background: ${colors.bgTableHead};
`;

export const TaskTableTh = styled.th`
  padding: 8px 12px;
  font-size: ${fontSize.subtitle};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${colors.textMuted};
  text-align: left;
`;

export const TaskTableTd = styled.td`
  padding: 8px 12px;
  color: ${colors.textPrimary};
  border-bottom: 1px solid ${colors.borderLight};
`;

export const InitialChip = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  background: ${colors.accentBlueLight};
  color: ${colors.accentBlue};
  font-size: 10px;
  font-weight: 700;
  margin-right: 3px;
`;

// Timeline / Gantt
export const TimelineWrapper = styled.div`
  overflow-x: auto;
`;

export const TimelineHeaderRow = styled.div`
  display: flex;
  padding-left: 152px;
  margin-bottom: 6px;
`;

export const TimelineHeaderCell = styled.span`
  flex: 1;
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  font-weight: 500;
`;

export const TimelineRow = styled.div`
  display: flex;
  align-items: center;
  height: 34px;
  margin-bottom: 4px;
`;

export const TimelineLabel = styled.span`
  width: 152px;
  flex-shrink: 0;
  font-size: ${fontSize.general};
  color: ${colors.textPrimary};
  padding-right: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TimelineBarWrapper = styled.div`
  flex: 1;
  position: relative;
`;

export const TimelineBarTrack = styled.div`
  height: 20px;
  background: ${colors.borderLight};
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

export const TimelineBarFill = styled.div`
  position: absolute;
  left: ${({ $start }) => $start}%;
  width: ${({ $width }) => $width}%;
  top: 50%;
  transform: translateY(-50%);
  height: 8px;
  border-radius: 4px;
  background: ${colors.borderColor};
  overflow: hidden;
`;

export const TimelineProgressFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: ${({ $pct }) => $pct}%;
  height: 100%;
  border-radius: 3px;
  background: ${({ $color }) => $color};
`;

export const TimelineGroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 14px 0 6px;
  &:first-child { margin-top: 0; }
`;

export const TimelineGroupDot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 2px;
  flex-shrink: 0;
  background: ${({ $color }) => $color};
`;

export const TimelineGroupName = styled.span`
  font-size: ${fontSize.subtitle};
  font-weight: 700;
  color: ${colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const TodayMarker = styled.div`
  position: absolute;
  left: ${({ $pct }) => $pct}%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: ${colors.accentRed};
  opacity: 0.7;
  z-index: 2;
`;

export const TimelinePct = styled.span`
  width: 38px;
  flex-shrink: 0;
  text-align: right;
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textSecondary};
  margin-left: 10px;
`;

// Team this week
export const TeamList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TeamMemberRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const MemberAvatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  border: 1px solid ${({ $border }) => $border};
`;

export const MemberMeta = styled.div`
  flex: 1;
  min-width: 0;
`;

export const MemberName = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textPrimary};
  display: block;
  line-height: 18px;
`;

export const MemberRole = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
`;

export const MemberHoursCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
  min-width: 80px;
`;

export const HoursLabel = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textSecondary};
`;

export const TeamCapacity = styled.p`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  margin: 14px 0 0;
  font-style: italic;
`;

// Combined budget card
export const BudgetSummaryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

export const DonutChartWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const BudgetVertDivider = styled.div`
  width: 1px;
  align-self: stretch;
  background: ${colors.borderLight};
  flex-shrink: 0;
  margin: 4px 0;
`;

// Budget split
export const BudgetSplitWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

export const BudgetSplitCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

export const BudgetSplitTotal = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${colors.textPrimary};
`;

export const BudgetSplitSub = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
`;

export const BudgetSplitLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  flex: 1;
`;

export const BudgetSplitRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const BudgetSplitLabelText = styled.span`
  font-size: ${fontSize.general};
  color: ${colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const BudgetSplitPct = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textPrimary};
`;

// Burndown
export const BurndownWrap = styled.div``;

export const BurndownLegend = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  justify-content: flex-end;
`;

export const BurndownLegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: ${fontSize.general};
  color: ${colors.textSecondary};
`;

export const BurndownLineSwatch = styled.span`
  display: inline-block;
  width: 20px;
  height: 2px;
  background: ${({ $color }) => $color};
  border-radius: 1px;
  opacity: ${({ $dashed }) => ($dashed ? 0.6 : 1)};
`;

export const BurndownNote = styled.p`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  margin: 8px 0 0;
  font-style: italic;
`;

// Decisions & Comments
export const CommentFeed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const CommentItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

export const CommentAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  border: 1px solid ${({ $border }) => $border};
`;

export const CommentBody = styled.div`
  flex: 1;
`;

export const CommentMeta = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 4px;
  flex-wrap: wrap;
`;

export const CommentName = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textPrimary};
`;

export const CommentRole = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
`;

export const CommentTime = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  margin-left: auto;
`;

export const CommentBubble = styled.div`
  background: ${({ $bg }) => $bg || colors.bgHover};
  border: 1px solid ${colors.borderLight};
  border-radius: 0 8px 8px 8px;
  padding: 10px 14px;
  font-size: ${fontSize.general};
  color: ${colors.textPrimary};
  line-height: 1.6;
`;

export const CommentInputRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
  align-items: flex-end;
`;

export const CommentInput = styled.textarea`
  flex: 1;
  border: 1px solid ${colors.borderLight};
  border-radius: 8px;
  padding: 10px 14px;
  font-size: ${fontSize.general};
  color: ${colors.textPrimary};
  resize: none;
  outline: none;
  min-height: 40px;
  max-height: 100px;
  background: ${colors.white};
  &::placeholder { color: ${colors.textMuted}; }
  &:focus { border-color: ${colors.accentBlue}; }
`;

export const PostButton = styled.button`
  background: ${colors.textPrimary};
  color: ${colors.white};
  border: none;
  border-radius: 8px;
  padding: 9px 20px;
  font-size: ${fontSize.general};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: ${colors.accentBlue}; }
`;

export const TotalLabel = styled.p`font-size: ${fontSize.general}; color: #8a94a6; margin: 0 0 4px;`;
export const TotalAmount = styled.p`font-size: 28px; font-weight: 600; color: #1a1a2e; margin: 0 0 1.25rem; letter-spacing: -0.5px;`;
export const LegendRow = styled.div`display: flex; gap: 2rem;`;
export const LegendItem = styled.div``;
export const LegendDotRow = styled.div`display: flex; align-items: center; gap: 6px; margin-bottom: 4px;`;
export const Dot = styled.span`width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; background: ${({ color }) => color};`;
export const LegendName = styled.span`font-size: ${fontSize.general}; color: #8a94a6;`;
export const LegendAmount = styled.p`font-size: ${fontSize.highlight}; font-weight: 600; color: #1a1a2e; margin: 0;`;
export const CardWrapper = styled.div`margin-bottom: 20px;`;
