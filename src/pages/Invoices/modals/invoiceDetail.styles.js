import styled from "styled-components";
import { colors, fontSize } from "../../../constants/common";

// ── Shell ─────────────────────────────────────────────────────────────────────

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
`;

export const ModalBox = styled.div`
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 760px;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.22);
`;

// ── Colored header band ───────────────────────────────────────────────────────

export const DocHeader = styled.div`
  background: linear-gradient(135deg, #2d7eaa 0%, #3796BF 60%, #4aa8d0 100%);
  padding: 12px 24px 16px;
  flex-shrink: 0;
`;

export const HeaderTopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 12px;
`;

export const HeaderOptionsWrap = styled.div`
  & > div > button {
    color: #ffffff !important;
    border: 1px solid rgba(255, 255, 255, 0.35) !important;
    background: rgba(255, 255, 255, 0.15) !important;
    border-radius: 8px !important;

    &:hover {
      background: rgba(255, 255, 255, 0.28) !important;
    }
  }
`;

export const HeaderBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.28);
  }
`;

export const HeaderContent = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  align-items: flex-start;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const CompanyBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const CompanyLogo = styled.img`
  height: 34px;
  width: auto;
  max-width: 140px;
  align-self: flex-start;
  object-fit: contain;
  margin-bottom: 8px;
`;

export const CompanyMeta = styled.span`
  font-size: ${fontSize.subtitle};
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.6;
`;

export const InvoiceBadgeBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;

  @media (max-width: 480px) {
    align-items: flex-start;
  }
`;

export const InvoiceWord = styled.div`
  font-size: 28px;
  font-weight: 200;
  color: rgba(255, 255, 255, 0.88);
  letter-spacing: 8px;
  text-transform: uppercase;
  line-height: 1;
`;

export const InvoiceNumber = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.5px;
`;

export const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: ${fontSize.badge};
  font-weight: 700;
  color: ${({ $color }) => $color};
  background: ${({ $bg }) => $bg};
  border-radius: 9999px;
  padding: 3px 10px;
  letter-spacing: 0.6px;
  text-transform: uppercase;
`;

// ── White body ────────────────────────────────────────────────────────────────

export const DocBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// ── Bill To + Invoice meta ────────────────────────────────────────────────────

export const BillRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 32px;
  align-items: flex-start;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const BillToBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const SectionLabel = styled.span`
  font-size: ${fontSize.subtitle};
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin-bottom: 6px;
  display: block;
`;

export const ClientName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
  margin-bottom: 2px;
`;

export const ClientContact = styled.div`
  font-size: ${fontSize.general};
  color: #6b7280;
  line-height: 1.5;
`;

export const InvoiceMetaBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
`;

export const MetaItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 14px;
  border-bottom: 1px solid #f3f4f6;
  gap: 12px;

  &:last-child {
    border-bottom: none;
  }
`;

export const MetaLabel = styled.span`
  font-size: ${fontSize.subtitle};
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  white-space: nowrap;
`;

export const MetaValue = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: #111827;
  text-align: right;
`;

export const DueDateValue = styled(MetaValue)`
  color: ${({ $overdue }) => ($overdue ? "#ef4444" : "#111827")};
`;

// ── Description note ──────────────────────────────────────────────────────────

export const DescriptionNote = styled.div`
  background: #f8fafc;
  border-left: 3px solid #3796BF;
  border-radius: 0 8px 8px 0;
  padding: 12px 16px;
  font-size: ${fontSize.general};
  color: #374151;
  line-height: 1.65;
  white-space: pre-wrap;
`;

export const DescriptionProjectLine = styled.div`
  font-size: ${fontSize.highlight};
  color: #374151;
  font-weight: 600;
`;

// ── Line items ────────────────────────────────────────────────────────────────

export const ItemsTable = styled.div`
  height: auto;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
`;

export const ItemsTableHead = styled.div`
  display: grid;
  grid-template-columns: 28px 1fr 120px;
  gap: 12px;
  padding: 10px 16px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

export const ItemsHeadCell = styled.span`
  font-size: ${fontSize.subtitle};
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.6px;

  &:last-child {
    text-align: right;
  }
`;

export const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 28px 1fr 120px;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #f3f4f6;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

export const ItemIndex = styled.span`
  font-size: ${fontSize.subtitle};
  color: #d1d5db;
  font-weight: 600;
`;

export const ItemDescBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ItemCode = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: ${fontSize.badge};
  font-weight: 700;
  color: #3796BF;
  background: #eff6ff;
  border-radius: 4px;
  padding: 1px 7px;
  width: fit-content;
  letter-spacing: 0.3px;
`;

export const ItemDescText = styled.span`
  font-size: ${fontSize.general};
  color: #374151;
  line-height: 1.4;
`;

export const ItemAmount = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: #111827;
  text-align: right;
`;

// ── Status tagline (under INV number in header) ───────────────────────────────

export const StatusTagLine = styled.div`
  font-size: ${fontSize.subtitle};
  color: rgba(255, 255, 255, 0.72);
  margin-top: 3px;
  letter-spacing: 0.3px;
`;

// ── Payment breakdown card ────────────────────────────────────────────────────

export const PaymentBreakdown = styled.div`
  flex: 1;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  align-self: flex-start;
`;

export const PaymentBreakdownTitle = styled.div`
  font-size: ${fontSize.subtitle};
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 10px;
`;

export const PaymentEntry = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child { border-bottom: none; }
`;

export const PaymentEntryDate = styled.span`
  font-size: ${fontSize.subtitle};
  color: #6b7280;
`;

export const PaymentEntryAmount = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: #111827;
`;

export const PaymentEntryNote = styled.span`
  font-size: ${fontSize.subtitle};
  color: #9ca3af;
`;

export const NoPayments = styled.div`
  font-size: ${fontSize.subtitle};
  color: #9ca3af;
  font-style: italic;
`;

// ── Bottom row (payment breakdown + totals) ───────────────────────────────────

export const BottomRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;
`;

// ── Payment status note (paid / due) ──────────────────────────────────────────

export const PaymentStatusNote = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: ${fontSize.highlight};
  font-weight: 600;
  border: 1px solid ${({ $variant }) => ($variant === "paid" ? "#bbf7d0" : "#fed7aa")};
  background: ${({ $variant }) => ($variant === "paid" ? "#f0fdf4" : "#fff7ed")};
  color: ${({ $variant }) => ($variant === "paid" ? "#166534" : "#c2410c")};

  i {
    font-size: 15px;
  }
`;

// ── Action buttons row (bottom of DocBody) ────────────────────────────────────

export const InvoiceActionBtns = styled.div`
  display: flex;
  gap: 10px;
`;

export const InvoiceActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: ${fontSize.general};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
  border: 1.5px solid ${({ $variant }) =>
    $variant === "danger"  ? "#ef4444" :
    $variant === "success" ? "#22c55e" : "#3796BF"};
  color: ${({ $variant }) =>
    $variant === "danger"  ? "#ef4444" :
    $variant === "success" ? "#22c55e" : "#3796BF"};
  background: transparent;

  &:hover:not(:disabled) {
    background: ${({ $variant }) =>
      $variant === "danger"  ? "#fef2f2" :
      $variant === "success" ? "#f0fdf4" : "#eff6ff"};
  }

  &:disabled {
    border-color: ${colors.borderColor};
    color: ${colors.textMuted};
    cursor: not-allowed;
  }
`;

// ── Totals ────────────────────────────────────────────────────────────────────

export const TotalsBlock = styled.div`
  width: 260px;
  flex-shrink: 0;
  margin-left: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TotalLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TotalLineLabel = styled.span`
  font-size: ${fontSize.general};
  color: #6b7280;
`;

export const TotalLineValue = styled.span`
  font-size: ${fontSize.general};
  color: #111827;
`;

export const TotalsDivider = styled.hr`
  border: none;
  border-top: 1.5px solid #e5e7eb;
  margin: 4px 0;
`;

export const GrandTotalLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #2d7eaa, #3796BF);
  border-radius: 10px;
  padding: 14px 16px;
  margin-top: 4px;
`;

export const GrandTotalLabel = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

export const GrandTotalValue = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
`;

// ── Footer ────────────────────────────────────────────────────────────────────

export const DocFooter = styled.div`
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  padding: 12px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

export const FooterNote = styled.span`
  font-size: ${fontSize.subtitle};
  color: #9ca3af;
`;

export const FooterRef = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: #6b7280;
`;

// ── Payment Advice slip ───────────────────────────────────────────────────────

export const PaymentAdviceSection = styled.div`
  border-top: 2px dashed #d1d5db;
  padding: 18px 32px 22px;
  flex-shrink: 0;
  background: #fff;
`;

export const PaymentAdviceTitle = styled.div`
  font-size: ${fontSize.header};
  font-weight: 700;
  color: #111827;
  margin-bottom: 14px;
`;

export const PaymentAdviceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: flex-start;
`;

export const PaymentAdviceLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PaymentAdviceIntro = styled.div`
  font-size: ${fontSize.subtitle};
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 8px;
`;

export const PaymentAdviceAddress = styled.div`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: #374151;
  line-height: 1.7;
`;

export const PaymentAdviceFieldRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #f3f4f6;
  gap: 16px;

  &:last-child {
    border-bottom: none;
  }
`;

export const PaymentAdviceLabel = styled.span`
  font-size: ${fontSize.subtitle};
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
`;

export const PaymentAdviceValue = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: #111827;
`;

export const PaymentSignatureLine = styled.div`
  width: 130px;
  border-bottom: 1.5px solid #9ca3af;
  min-height: 16px;
`;
