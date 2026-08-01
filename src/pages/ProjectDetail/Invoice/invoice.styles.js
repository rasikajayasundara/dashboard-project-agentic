import styled from "styled-components";
import { colors, fontSize } from "../../../constants/common";
import { colorOpacity } from "../../../utils/common";

/* ── Stat cards row ───────────────────────────────────────────────────────── */

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
`;

/* ── Table card ───────────────────────────────────────────────────────────── */

export const InvoiceCard = styled.div`
  background: ${colors.white};
  border: 1px solid ${colors.borderLight};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

export const InvoiceHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid ${colors.borderLight};
`;

export const LastSyncedText = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};

  strong {
    color: ${colors.textSecondary};
    font-weight: 500;
  }
`;

export const NewInvoiceBtn = styled.button`
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

  i { font-size: 13px; }

  &:hover { opacity: 0.88; }
  &:disabled { opacity: 0.55; cursor: not-allowed; }
`;

/* ── Table ────────────────────────────────────────────────────────────────── */

export const ITable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const IThead = styled.thead`
  background: ${colors.bgTableHead};
  border-bottom: 1px solid ${colors.borderLight};
`;

export const ITh = styled.th`
  padding: 11px 16px;
  font-size: ${fontSize.subtitle};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${colors.textMuted};
  text-align: left;
  white-space: nowrap;
`;

export const ITr = styled.tr`
  border-bottom: 1px solid ${colors.borderLight};
  transition: background 0.15s;
  cursor: pointer;
  &:last-child { border-bottom: none; }
  &:hover { background: ${colors.bgHover}; }
`;

export const ITd = styled.td`
  padding: 13px 16px;
  font-size: ${fontSize.general};
  color: ${colors.textPrimary};
  vertical-align: middle;
`;

/* ── Cell components ──────────────────────────────────────────────────────── */

export const InvoiceIdBtn = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.accentBlue};
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

export const InvoiceTitleBtn = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: ${fontSize.highlight};
  color: ${colors.textPrimary};
  cursor: pointer;
  text-align: left;
  line-height: 1.4;
  &:hover { color: ${colors.accentBlue}; }
`;

export const AmountText = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 500;
  color: ${colors.textPrimary};
  font-variant-numeric: tabular-nums;
`;

/* ── Status badges ────────────────────────────────────────────────────────── */

const INV_STATUS = {
  0: { bg: "#F3F4F6", color: "#6B7280" },
  1: { bg: "#FEF9C3", color: "#92400E" },
  2: { bg: "#DCFCE7", color: "#166534" },
};

export const InvoiceStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: ${fontSize.badge};
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 9999px;
  white-space: nowrap;
  background: ${({ $s }) => INV_STATUS[$s]?.bg ?? "#F3F4F6"};
  color: ${({ $s }) => INV_STATUS[$s]?.color ?? "#6B7280"};

  &::before {
    content: "";
    width: 5px;
    height: 5px;
    border-radius: 9999px;
    background: currentColor;
    flex-shrink: 0;
  }
`;

const PAY_STATUS = {
  paid:    { bg: "#DCFCE7", color: "#166534" },
  partial: { bg: "#EFF6FF", color: "#1D4ED8" },
  pending: { bg: "#FEF9C3", color: "#92400E" },
  overdue: { bg: "#FEE2E2", color: "#991B1B" },
};

export const PaymentBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: ${fontSize.badge};
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 9999px;
  white-space: nowrap;
  background: ${({ $type }) => PAY_STATUS[$type]?.bg ?? "#F3F4F6"};
  color: ${({ $type }) => PAY_STATUS[$type]?.color ?? "#6B7280"};

  &::before {
    content: "";
    width: 5px;
    height: 5px;
    border-radius: 9999px;
    background: currentColor;
    flex-shrink: 0;
  }
`;

/* ── Download button ──────────────────────────────────────────────────────── */

export const DownloadBtn = styled.button`
  background: transparent;
  border: none;
  padding: 5px 7px;
  cursor: pointer;
  color: ${colors.accentBlue};
  font-size: 15px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;

  &:hover { background: ${colorOpacity(colors.accentBlue, 0.08)}; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

/* ── Empty / loading states ───────────────────────────────────────────────── */

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${colors.textMuted};
  font-size: ${fontSize.general};

  i {
    font-size: 32px;
    display: block;
    margin-bottom: 10px;
    opacity: 0.3;
  }
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${colors.textMuted};
  font-size: ${fontSize.general};
`;

/* ── Table footer (page size) ─────────────────────────────────────────────── */

export const TableFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid ${colors.borderLight};
  gap: 8px;
`;

export const FooterLabel = styled.span`
  font-size: ${fontSize.general};
  color: ${colors.textMuted};
`;

export const PageSizeSelect = styled.select`
  font-size: ${fontSize.general};
  padding: 4px 8px;
  border: 1px solid ${colors.borderLight};
  border-radius: 6px;
  background: ${colors.white};
  color: ${colors.textSecondary};
  cursor: pointer;
  outline: none;

  &:focus { border-color: ${colors.accentBlue}; }
`;

/* ── Stat card footer text ────────────────────────────────────────────────── */

export const StatFooter = styled.span`
  font-size: ${fontSize.subtitle};
  color: #9ca3af;
  margin-top: 1px;
  line-height: 16px;
`;

export const FooterTotal = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

export const FooterTotalLabel = styled.span`
  font-size: ${fontSize.subtitle};
  font-weight: 400;
  color: ${colors.textMuted};
  &::after { content: ":"; }
`;

export const FooterTotalValue = styled.span`
  font-size: ${fontSize.general};
  color: ${colors.textPrimary};
`;
