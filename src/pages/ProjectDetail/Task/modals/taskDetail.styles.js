import styled from "styled-components";
import { colors, fontSize } from "../../../../constants/common";
import { colorOpacity } from "../../../../utils/common";

export const HeaderMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 3px;
`;

export const HeaderTaskId = styled.span`
  font-size: ${fontSize.badge};
  font-weight: 700;
  color: ${colors.textSecondary};
  background: ${colors.backgroundGray};
  border: 1px solid ${colors.borderLight};
  border-radius: 5px;
  padding: 2px 7px;
  white-space: nowrap;
`;

export const HeaderDot = styled.span`
  color: ${colors.borderColor};
  font-size: ${fontSize.general};
  flex-shrink: 0;
`;

export const HeaderTaskName = styled.span`
  font-size: ${fontSize.subtitle};
  font-weight: 400;
  color: ${colors.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 320px;
`;

/* ── Budget stat tiles ────────────────────────────────────────────────────── */

export const StatSection = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid ${colors.borderLight};
  background: ${colors.backgroundGray};
  flex-shrink: 0;
`;

export const StatSectionBudgetName = styled.div`
  font-size: ${fontSize.subtitle};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: ${colors.textMuted};
  margin-bottom: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StatGrid = styled.div`
  display: flex;
  gap: 0;
`;

export const StatTile = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 0 24px 0 0;
  border-right: 1px solid ${colors.borderColor};

  &:not(:first-child) {
    padding: 0 24px;
  }

  &:last-child {
    border-right: none;
    padding-right: 0;
  }
`;

export const StatTileLabel = styled.span`
  font-size: ${fontSize.subtitle};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${colors.textMuted};
`;

export const StatTileValue = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: ${({ $color }) => $color || colors.textPrimary};
  line-height: 1.2;
`;

export const StatTileSub = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textSecondary};
`;

/* ── Assignment table ────────────────────────────────────────────────────── */

export const AllocTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

export const AllocThead = styled.thead`
  background: ${colors.bgTableHead};
  border-bottom: 1px solid ${colors.borderLight};
`;

export const AllocTh = styled.th`
  padding: 10px 14px;
  font-size: ${fontSize.subtitle};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${colors.textMuted};
  text-align: left;
  white-space: nowrap;
`;

export const AllocTr = styled.tr`
  border-bottom: 1px solid ${colors.borderLight};
  &:last-child { border-bottom: none; }
  &:hover { background: ${colors.bgHover}; }
`;

export const AllocSpacerTr = styled.tr`
  border-bottom: none;
  background: none;
  &:hover { background: none; }
`;

export const AllocTd = styled.td`
  padding: 12px 14px;
  font-size: ${fontSize.general};
  color: ${colors.textPrimary};
  vertical-align: middle;
`;

export const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
`;

export const UserAvatar = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 9999px;
  background: ${({ $bg }) => $bg || colors.backgroundGray};
  color: ${({ $color }) => $color || colors.textSecondary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
`;

export const UserNameText = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 500;
  color: ${colors.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
`;

export const RateChip = styled.span`
  font-size: ${fontSize.badge};
  font-weight: 600;
  color: ${colors.textSecondary};
  background: ${colors.backgroundGray};
  border: 1px solid ${colors.borderLight};
  border-radius: 5px;
  padding: 2px 8px;
  white-space: nowrap;
`;

/* ── Combined hrs + amount cell ───────────────────────────────────────────── */

export const HrsCell = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const HrsPrimary = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textPrimary};
`;

export const HrsSecondary = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  margin-top: 2px;
  font-style: italic;
`;

/* ── Per-row progress ─────────────────────────────────────────────────────── */

export const BurnProgress = styled.div`
  min-width: 110px;
  display: inline-block;
  width: 100%;
`;

export const BurnProgressMeta = styled.div`
  margin-top: 4px;
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  white-space: nowrap;
  text-align: right;
`;

/* ── Total row ────────────────────────────────────────────────────────────── */

export const AllocTotalRow = styled.tr`
  background: ${colors.bgTableHead};
  border-top: 2px solid ${colors.borderLight};
`;

export const AllocTotalTd = styled.td`
  padding: 14px 14px;
  vertical-align: middle;
`;

export const TotalLabel = styled.div`
  font-size: ${fontSize.highlight};
  font-weight: 700;
  color: ${colors.textPrimary};
`;

export const TotalHrs = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${colors.textPrimary};
`;

export const TotalAmtSmall = styled.div`
  font-size: 12px;
  color: ${colors.textSecondary};
  margin-top: 3px;
`;

/* ── Modal footer totals ──────────────────────────────────────────────────── */

export const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const FooterTotalLabel = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 700;
  color: ${colors.textPrimary};
  flex-shrink: 0;
`;

export const FooterDot = styled.span`
  color: ${colors.borderColor};
  font-size: ${fontSize.general};
  line-height: 1;
  flex-shrink: 0;
`;

export const FooterStat = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
`;

export const FooterStatLabel = styled.span`
  font-size: ${fontSize.general};
  font-weight: 400;
  color: ${colors.textMuted};
  white-space: nowrap;
  &::after { content: ":"; }
`;

export const FooterStatHrs = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 700;
  color: ${colors.textPrimary};
  white-space: nowrap;
`;

export const FooterStatAmt = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  font-style: italic;
  white-space: nowrap;
`;

export const FooterProgress = styled.div`
  width: 180px;
  flex-shrink: 0;
`;

export const FooterProgressMeta = styled.div`
  margin-top: 4px;
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  white-space: nowrap;
  text-align: right;
`;

/* ── Inline add-assignment form row ──────────────────────────────────────── */

export const InlineAllocRow = styled.tr`
  background: ${colors.backgroundGray};
  border-top: 1px solid ${colors.borderLight};
  border-bottom: 1px solid ${colors.borderLight};
`;

export const InlineAmount = styled.span`
  display: block;
  margin-top: 4px;
  font-size: ${fontSize.subtitle};
  font-style: italic;
  color: ${colors.textMuted};
`;

export const InlineSaveBtn = styled.button`
  padding: 6px 16px;
  background: ${colors.accentBlue};
  color: ${colors.white};
  border: none;
  border-radius: 8px;
  font-size: ${fontSize.general};
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s ease;

  &:hover { opacity: 0.88; }
  &:disabled { opacity: 0.35; cursor: default; }
`;

export const InlineCancelBtn = styled.button`
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid ${colors.borderColor};
  border-radius: 8px;
  color: ${colors.textMuted};
  cursor: pointer;
  font-size: 15px;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover { background: ${colors.borderLight}; color: ${colors.textPrimary}; }
`;

/* ── Add assignment row ───────────────────────────────────────────────────── */

export const AddAllocRow = styled.tr`
  border-bottom: 1px solid ${colors.borderLight};
  background: ${colors.white};
`;

export const AddAllocCell = styled.td`
  padding: 8px 16px;
`;

export const AddAllocLink = styled.button`
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

/* ── Empty state ──────────────────────────────────────────────────────────── */

export const EmptyTd = styled.td`
  text-align: center;
  padding: 36px 16px;
  color: ${colors.textMuted};
  font-size: ${fontSize.general};

  i {
    font-size: 22px;
    display: block;
    margin-bottom: 6px;
    opacity: 0.35;
  }
`;
