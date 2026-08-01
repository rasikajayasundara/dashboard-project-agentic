import styled from "styled-components";
import { colors, fontSize } from "../../constants/common";

// ── Table shell ───────────────────────────────────────────────────────────────

export const TableScrollWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const THead = styled.thead`
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
  text-align: ${({ $align }) => $align || "left"};
  white-space: nowrap;
  cursor: ${({ $sortable }) => ($sortable ? "pointer" : "default")};
  user-select: none;
  transition: color 0.15s;

  ${({ $sortable }) => $sortable && `&:hover { color: ${colors.textSecondary}; }`}
`;

export const ThInner = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
`;

export const SortIcon = styled.span`
  font-size: 10px;
  opacity: 0.6;
`;

export const TBody = styled.tbody``;

export const Tr = styled.tr`
  border-bottom: 1px solid ${colors.borderLight};
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  transition: background 0.15s;
  background: ${({ $atRisk }) => ($atRisk ? "rgba(239, 68, 68, 0.04)" : "transparent")};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ $atRisk }) => ($atRisk ? "rgba(239, 68, 68, 0.08)" : colors.bgHover)};
  }

`;

export const Td = styled.td`
  padding: 14px 16px;
  font-size: ${fontSize.general};
  color: ${colors.textPrimary};
  vertical-align: middle;
  text-align: ${({ $align }) => $align || "left"};
`;

export const ActionBtn = styled.button`
  background: transparent;
  border: none;
  padding: 4px 6px;
  cursor: pointer;
  color: ${colors.textSecondary};
  font-size: 16px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${colors.borderLight};
    color: #374151;
  }
`;

export const CompletedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 6px;
  background: #f0fdf4;
  color: ${colors.accentGreen};
  font-size: ${fontSize.badge};
  font-weight: 500;
  white-space: nowrap;
`;

export const OngoingBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 6px;
  background: #FEF3C7;
  color: #92400E;
  font-size: ${fontSize.badge};
  font-weight: 500;
  white-space: nowrap;
  grid-area: 1 / 1;
  transition: opacity 0.15s;

  tr:hover & {
    opacity: 0;
  }
`;

// Same colors as OngoingBadge but without the hover-fade tied to the
// "Mark Complete" swap cell — used for a plain, always-visible status chip.
export const OngoingChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 6px;
  background: #FEF3C7;
  color: #92400E;
  font-size: ${fontSize.badge};
  font-weight: 500;
  white-space: nowrap;
  width: fit-content;
`;

export const CompleteBtn = styled.button`
  padding: 5px 12px;
  border: 1.5px solid ${colors.accentGreen};
  border-radius: 6px;
  background: transparent;
  color: ${colors.accentGreen};
  font-size: ${fontSize.general};
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, opacity 0.2s ease, transform 0.2s ease;
  grid-area: 1 / 1;
  opacity: 0;
  pointer-events: none;
  transform: translateX(14px);

  &:hover {
    background: #f0fdf4;
  }

  tr:hover & {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(0);
  }
`;

export const CompleteStatusCell = styled.div`
  display: inline-grid;
  align-items: center;
  justify-items: end;
`;

export const EmptyRow = styled.tr`
  td {
    padding: 48px 16px;
    text-align: center;
    font-size: ${fontSize.subtitle};
    color: ${colors.textMuted};
  }
`;

// ── Avatar cell ───────────────────────────────────────────────────────────────

export const AvatarCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const AvatarCircle = styled.div`
  width: ${({ $size }) => $size || 36}px;
  height: ${({ $size }) => $size || 36}px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $size }) => ($size ? Math.round($size * 0.36) : 13)}px;
  font-weight: 600;
  flex-shrink: 0;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  border: 1px solid ${({ $border }) => $border};
`;

export const AvatarMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

export const AvatarName = styled.span`
  font-size: ${fontSize.general};
  font-weight: ${({ $weight }) => $weight || 600};
  color: ${colors.textPrimary};
  line-height: 20px;
`;

export const AvatarSub = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  line-height: 16px;
`;

// ── Project name cell ─────────────────────────────────────────────────────────

export const ProjectNameCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 180px;
`;

// ── Stacked cell ──────────────────────────────────────────────────────────────

export const StackedCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const StackedPrimary = styled.span`
  font-size: ${fontSize.general};
  color: ${colors.textPrimary};
  line-height: 20px;
`;

export const StackedSub = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  line-height: 16px;
`;

// ── Workload cell ─────────────────────────────────────────────────────────────

export const WorkloadCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 120px;
`;

export const WorkloadTrack = styled.div`
  width: 100%;
  height: 6px;
  background: ${colors.borderLight};
  border-radius: 9999px;
  overflow: hidden;
`;

export const WorkloadFill = styled.div`
  height: 100%;
  border-radius: 9999px;
  width: ${({ $pct }) => Math.min($pct, 100)}%;
  background: ${({ $pct }) =>
    $pct >= 100 ? "#EF4444" : $pct >= 81 ? "#F59E0B" : "#22C55E"};
  transition: width 0.4s ease;
`;

export const WorkloadPct = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${({ $pct }) =>
    $pct >= 100 ? "#EF4444" : $pct >= 81 ? "#F59E0B" : "#22C55E"};
  text-align: right;
`;

// ── Hours cell (progress bar + worked/allocated label) ────────────────────────

export const HoursCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 160px;
`;

export const HoursLabel = styled.span`
  font-size: ${fontSize.general};
  color: ${({ $over }) => ($over ? colors.accentRed : colors.textMuted)};
  font-weight: ${({ $over }) => ($over ? "600" : "400")};
`;

export const HoursAllocatedText = styled.span`
  align-self: flex-end;
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
`;

// ── Badge pill ────────────────────────────────────────────────────────────────

export const BadgePill = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  padding: 4px 10px;
  font-size: ${fontSize.badge};
  font-weight: 600;
  white-space: nowrap;
  background: ${({ $bg }) => $bg || colors.borderLight};
  color: ${({ $color }) => $color || colors.textSecondary};
`;

// ── Billable cell ─────────────────────────────────────────────────────────────

export const BillableText = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${({ $pct }) => ($pct >= 70 ? "#22C55E" : "#F59E0B")};
`;

// ── Outstanding cell ──────────────────────────────────────────────────────────

export const OutstandingText = styled.span`
  font-size: ${fontSize.general};
  font-weight: ${({ $hasValue }) => ($hasValue ? "600" : "400")};
  color: ${({ $hasValue }) => ($hasValue ? "#F59E0B" : colors.textMuted)};
`;

// ── Pagination ────────────────────────────────────────────────────────────────

export const PageBtn = styled.button`
  min-width: 26px;
  height: 26px;
  padding: 0 6px;
  border-radius: 6px;
  border: 1px solid ${({ $active }) => ($active ? colors.sidebarBg : colors.borderLight)};
  background: ${({ $active }) => ($active ? colors.sidebarBg : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : colors.textSecondary)};
  font-size: ${fontSize.general};
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    background: ${({ $active }) => ($active ? colors.sidebarBg : colors.bgHover)};
    filter: ${({ $active }) => ($active ? "brightness(1.15)" : "none")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
