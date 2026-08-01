import { useState } from "react";
import { useDispatch } from "react-redux";
import { pdf } from "@react-pdf/renderer";
import InvoicePdfDocument from "../pdf/InvoicePdfDocument";
import OptionsMenu from "../../../components/OptionsMenu";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { usePermission } from "../../../hooks/usePermission";
import { IS_SANDBOX } from "../../../config/environment";
import { invoiceAction } from "../../../store/invoiceSlice";
import { getInvoicePaymentNote, getInvoicePaymentState } from "../invoicePaymentNote";
import gdcLogo from "../../../assets/gdc-logo.png";
import {
  Overlay, ModalBox,
  DocHeader, HeaderTopBar, HeaderBtn, HeaderOptionsWrap, HeaderContent,
  CompanyBlock, CompanyLogo, CompanyMeta,
  InvoiceBadgeBlock, InvoiceWord, InvoiceNumber, StatusPill,
  DocBody,
  BillRow, BillToBlock, SectionLabel, ClientName, ClientContact,
  InvoiceMetaBlock, MetaItem, MetaLabel, MetaValue, DueDateValue,
  DescriptionNote, DescriptionProjectLine,
  ItemsTable, ItemsTableHead, ItemsHeadCell, ItemRow, ItemIndex,
  ItemDescBlock, ItemCode, ItemDescText, ItemAmount,
  StatusTagLine, PaymentStatusNote,
  PaymentBreakdown, PaymentBreakdownTitle,
  PaymentEntry, PaymentEntryDate, PaymentEntryAmount, PaymentEntryNote, NoPayments,
  BottomRow, InvoiceActionBtns, InvoiceActionBtn,
  TotalsBlock, TotalLine, TotalLineLabel, TotalLineValue,
  TotalsDivider, GrandTotalLine, GrandTotalLabel, GrandTotalValue,
  DocFooter, FooterNote, FooterRef,
} from "./invoiceDetail.styles";

const COMPANY = {
  name:    "GDC Consultants Ltd",
  phone:   "07 838 0090",
  email:   "hamilton@gdcgroup.co.nz",
  website: "www.gdcgroup.co.nz",
  gst:     "103-298-369",
  address: "89 Church Road, Pukete, Hamilton 3200, New Zealand",
  bank:    "ANZ Bank - 06-0317-0939366-00 - GDC Consultants Ltd",
};

const STATUS_MAP = {
  // numeric keys: legacy invoice_status workflow stage (mock-data callers)
  0: { label: "Draft",     color: "#6B7280", bg: "#F3F4F6" },
  1: { label: "Submitted", color: "#92400E", bg: "#FEF3C7" },
  2: { label: "Approved",  color: "#166534", bg: "#DCFCE7" },
  // string keys: real backend-resolved status (already computed server-side)
  "Draft":                  { label: "Draft",     color: "#6B7280", bg: "#F3F4F6" },
  "Submitted for approval": { label: "Submitted", color: "#92400E", bg: "#FEF3C7" },
  "Void":                   { label: "Void",      color: "#6B7280", bg: "#F3F4F6" },
  "Approved":               { label: "Approved",  color: "#166534", bg: "#DCFCE7" },
  "Paid":                   { label: "Paid",      color: "#166534", bg: "#DCFCE7" },
  "Pending":                { label: "Pending",   color: "#92400E", bg: "#FEF3C7" },
  "Overdue":                { label: "Overdue",   color: "#991B1B", bg: "#FEE2E2" },
};

const CONFIRM_CONFIG = {
  submit: {
    title:        "Submit Invoice",
    message:      "Submit this invoice for approval?",
    confirmLabel: "Submit",
    variant:      "info",
  },
  approve: {
    title:        "Approve & Send Invoice",
    message:      "Approve this invoice? It will be sent to the client via Xero and you won't be able to make further changes.",
    confirmLabel: "Approve & Send",
    variant:      "success",
  },
  delete: {
    title:        "Delete Invoice",
    message:      "Permanently delete this invoice? This cannot be undone.",
    confirmLabel: "Delete",
    variant:      "danger",
  },
};

const fmt = (v) =>
  "$" + Number(v || 0).toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function InvoiceDetail({ invoice, loading, error, onClose, showOptionsMenu = true, onEdit, onAction }) {
  const dispatch  = useDispatch();
  const inv       = invoice || {};
  const status       = inv.status;
  const statusDisplay = STATUS_MAP[status] || STATUS_MAP[0];
  const isDraft     = status === "Draft" || status === 0;
  const isSubmitted = status === "Submitted for approval" || status === 1;
  const canInvoiceUpdate  = usePermission("canInvoiceUpdate");
  const canInvoiceDelete  = usePermission("canInvoiceDelete");
  const canInvoiceApprove = usePermission("canInvoiceApprove");
  const canEdit   = (isDraft || isSubmitted) && canInvoiceUpdate;
  const canDelete = (isDraft || isSubmitted) && canInvoiceDelete;

  const subTotal = Number(inv.amount || inv.sub_total || 0);
  const gstRate  = Number(inv.gst || 0.15);
  const gstAmt   = subTotal * gstRate;
  const total    = Number(inv.total || subTotal + gstAmt);
  const gstPct   = Math.round(gstRate * 100);

  const items          = Array.isArray(inv.invoice_items)   ? inv.invoice_items   : [];
  const payments       = Array.isArray(inv.payment_history) ? inv.payment_history : [];
  const { isFullyPaid, isPartialPaid } = getInvoicePaymentState(inv);
  const isOverdue      = !isFullyPaid && inv.due_date && new Date(inv.due_date) < new Date();
  const payStatusLabel = isFullyPaid ? "Paid Invoice" : isPartialPaid ? "Partially Paid" : null;
  const paymentNote = getInvoicePaymentNote({ dueDate: inv.due_date, isFullyPaid, isPartialPaid, payments });

  const [confirmAction,  setConfirmAction]  = useState(null); // "submit" | "approve" | "send" | "delete"
  const [downloading,    setDownloading]    = useState(false);

  const fetchLogoAsDataUri = () =>
    fetch("/assets/images/gdc-logo.png")
      .then((r) => r.blob())
      .then(
        (blob) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          })
      )
      .catch(() => null);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const logoSrc = await fetchLogoAsDataUri();
      const blob = await pdf(
        <InvoicePdfDocument invoice={inv} company={COMPANY} logoSrc={logoSrc} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a   = document.createElement("a");
      a.href     = url;
      const filenameParts = [inv.xero_no, inv.project_no, inv.invoice_date].filter(Boolean);
      a.download = `${filenameParts.join("_") || "invoice"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  const handleConfirm = () => {
    if (confirmAction === "approve") {
      dispatch(invoiceAction.updateInvoiceStatusStart({
        invoiceId: inv.invoiceId,
        action:    "approve",
      }));
      onAction?.("approve");
      setConfirmAction(null);
      onClose?.();
      return;
    }
    if (confirmAction === "submit") {
      dispatch(invoiceAction.submitInvoiceStart({ invoiceId: inv.invoiceId }));
      onAction?.("submit");
      setConfirmAction(null);
      onClose?.();
      return;
    }
    // TODO: dispatch Redux action based on confirmAction
    console.log(`Invoice action: ${confirmAction}`, inv.xero_no || inv.id);
    setConfirmAction(null);
  };

  const menuItems = [
    {
      icon:    "bi-pencil",
      label:   "Edit",
      onClick: () => (typeof onEdit === "function" ? onEdit() : console.log("edit", inv.xero_no)),
      show:    canEdit,
    },
    {
      icon:          "bi-send",
      label:         "Submit",
      onClick:       () => setConfirmAction("submit"),
      show:          isDraft && canInvoiceUpdate,
      dividerBefore: true,
    },
    {
      icon:    "bi-check-circle",
      label:   "Approve & Send",
      onClick: () => setConfirmAction("approve"),
      show:    isSubmitted && canInvoiceApprove,
    },
    {
      icon:    "bi-envelope",
      label:   "Approve & Send",
      onClick: () => setConfirmAction("approve"),
      show:    isDraft && canInvoiceUpdate,
    },
    {
      icon:          "bi-trash",
      label:         "Delete",
      onClick:       () => setConfirmAction("delete"),
      show:          canDelete,
      danger:        true,
      dividerBefore: true,
    },
  ];

  const confirm = confirmAction ? CONFIRM_CONFIG[confirmAction] : null;

  if (loading || (!invoice && !error)) {
    return (
      <Overlay onClick={onClose}>
        <ModalBox onClick={(e) => e.stopPropagation()}>
          <div style={{ padding: 48, textAlign: "center", color: "#6b7280" }}>
            <div className="spinner-border spinner-border-sm text-primary mb-2" role="status" />
            <div>Loading invoice…</div>
          </div>
        </ModalBox>
      </Overlay>
    );
  }

  if (error) {
    return (
      <Overlay onClick={onClose}>
        <ModalBox onClick={(e) => e.stopPropagation()}>
          <div style={{ padding: 48, textAlign: "center", color: "#991B1B" }}>
            {error}
          </div>
        </ModalBox>
      </Overlay>
    );
  }

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>

        {/* ── Blue header band ──────────────────────────────────────────── */}
        <DocHeader>
          <HeaderTopBar>
            {showOptionsMenu && (
              <HeaderOptionsWrap>
                <OptionsMenu items={menuItems} align="end" />
              </HeaderOptionsWrap>
            )}
            <HeaderBtn title="Download PDF" onClick={handleDownload} disabled={downloading}>
              <i className={downloading ? "bi bi-hourglass-split" : "bi bi-download"} />
            </HeaderBtn>
            <HeaderBtn onClick={onClose} title="Close">
              <i className="bi bi-x-lg" />
            </HeaderBtn>
          </HeaderTopBar>

          <HeaderContent>
            <CompanyBlock>
              <CompanyLogo src={gdcLogo} alt={COMPANY.name} />
              <CompanyMeta>P: {COMPANY.phone}</CompanyMeta>
              <CompanyMeta>W: {COMPANY.website}</CompanyMeta>
              <CompanyMeta>GST # {COMPANY.gst}</CompanyMeta>
            </CompanyBlock>

            <InvoiceBadgeBlock>
              <InvoiceWord>Invoice</InvoiceWord>
              <InvoiceNumber>{inv.xero_no || "DRAFT"}</InvoiceNumber>
              {isFullyPaid ? (
                <StatusPill $color="#166534" $bg="#DCFCE7">
                  ✓ Paid Invoice
                </StatusPill>
              ) : isPartialPaid ? (
                <StatusPill $color="#1D4ED8" $bg="#EFF6FF">
                  Partially Paid
                </StatusPill>
              ) : (
                <StatusPill $color={statusDisplay.color} $bg={statusDisplay.bg}>
                  {statusDisplay.label}
                </StatusPill>
              )}
            </InvoiceBadgeBlock>
          </HeaderContent>
        </DocHeader>

        {/* ── Document body ─────────────────────────────────────────────── */}
        <DocBody>

          {/* Bill To + Invoice meta */}
          <BillRow>
            <BillToBlock>
              <SectionLabel>Bill To</SectionLabel>
              <ClientName>{inv.client_name || "—"}</ClientName>
              {inv.billing_contact && (
                <ClientContact>{inv.billing_contact}</ClientContact>
              )}
            </BillToBlock>

            <InvoiceMetaBlock>
              <MetaItem>
                <MetaLabel>Invoice Date</MetaLabel>
                <MetaValue>{inv.invoice_date || "—"}</MetaValue>
              </MetaItem>
              <MetaItem>
                <MetaLabel>Due Date</MetaLabel>
                <DueDateValue $overdue={isOverdue}>{inv.due_date || "—"}</DueDateValue>
              </MetaItem>
              <MetaItem>
                <MetaLabel>Reference</MetaLabel>
                <MetaValue>{inv.reference || "—"}</MetaValue>
              </MetaItem>
              <MetaItem>
                <MetaLabel>GST</MetaLabel>
                <MetaValue>{gstPct}%</MetaValue>
              </MetaItem>
            </InvoiceMetaBlock>
          </BillRow>

          {/* Description note */}
          {(inv.invoice_title || inv.description) && (
            <DescriptionNote>
              {inv.invoice_title && (
                <DescriptionProjectLine>
                  {inv.invoice_title}
                </DescriptionProjectLine>
              )}
              {inv.description}
            </DescriptionNote>
          )}

          {/* Line items */}
          <ItemsTable>
            <ItemsTableHead>
              <ItemsHeadCell>#</ItemsHeadCell>
              <ItemsHeadCell>Budget</ItemsHeadCell>
              <ItemsHeadCell>Amount</ItemsHeadCell>
            </ItemsTableHead>

            {items.length > 0 ? items.map((item, i) => (
              <ItemRow key={i}>
                <ItemIndex>{i + 1}</ItemIndex>
                <ItemDescBlock>
                  <ItemCode>BD{item.budget_id}</ItemCode>
                  <ItemDescText>{item.budget_name}</ItemDescText>
                </ItemDescBlock>
                <ItemAmount>{fmt(item.amount)}</ItemAmount>
              </ItemRow>
            )) : (
              <ItemRow>
                <ItemIndex>—</ItemIndex>
                <ItemDescBlock>
                  <ItemDescText style={{ color: "#9ca3af", fontStyle: "italic" }}>
                    No line items
                  </ItemDescText>
                </ItemDescBlock>
                <ItemAmount>—</ItemAmount>
              </ItemRow>
            )}
          </ItemsTable>

          {/* Bottom row: payment breakdown + totals */}
          <BottomRow>
            <PaymentBreakdown>
              <PaymentBreakdownTitle>Payment Breakdown</PaymentBreakdownTitle>
              {payments.length > 0 ? payments.map((p, i) => (
                <PaymentEntry key={i}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    
                    <PaymentEntryDate>{p.date}</PaymentEntryDate>
                    
                  </div>
                  <PaymentEntryAmount>{fmt(p.amount)}</PaymentEntryAmount>
                </PaymentEntry>
              )) : (
                <NoPayments>No payments recorded</NoPayments>
              )}
            </PaymentBreakdown>

            <TotalsBlock>
              <TotalLine>
                <TotalLineLabel>Sub Total</TotalLineLabel>
                <TotalLineValue>{fmt(subTotal)}</TotalLineValue>
              </TotalLine>
              <TotalLine>
                <TotalLineLabel>GST {gstPct}%</TotalLineLabel>
                <TotalLineValue>{fmt(gstAmt)}</TotalLineValue>
              </TotalLine>
              <TotalsDivider />
              <GrandTotalLine>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  {isFullyPaid && (
                    <i className="bi bi-check-circle-fill" style={{ color: "#4ade80", fontSize: 15 }} />
                  )}
                  <GrandTotalLabel>Total (NZD)</GrandTotalLabel>
                </div>
                <GrandTotalValue>{fmt(total)}</GrandTotalValue>
              </GrandTotalLine>
            </TotalsBlock>
          </BottomRow>

          {paymentNote && (
            <PaymentStatusNote $variant={paymentNote.variant}>
              <i className={paymentNote.variant === "paid" ? "bi bi-check-circle-fill" : "bi bi-exclamation-circle-fill"} />
              {paymentNote.text}
            </PaymentStatusNote>
          )}

          {/* Action buttons at bottom */}
          
          <InvoiceActionBtns>
            {isDraft && canInvoiceUpdate && (
            <InvoiceActionBtn
              onClick={() => setConfirmAction("submit")}
              disabled={IS_SANDBOX}
              title={IS_SANDBOX ? "Disabled in the sandbox environment" : undefined}
            >
              <i className="bi bi-send" />
              Submit for Approval
            </InvoiceActionBtn>
             )}
             {isDraft && canInvoiceUpdate && (
            <InvoiceActionBtn onClick={() => setConfirmAction("approve")}>
              <i className="bi bi-envelope" />
              Approve & Send
            </InvoiceActionBtn>
             )}
             {isSubmitted && canInvoiceApprove && (
            <InvoiceActionBtn $variant="success" onClick={() => setConfirmAction("approve")}>
              <i className="bi bi-check-circle" />
              Approve & Send
            </InvoiceActionBtn>
          )}
          </InvoiceActionBtns>
       
        </DocBody>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <DocFooter>
          <FooterNote>
            {inv.due_date ? `Payment due by ${inv.due_date}` : "Thank you for your business"}
          </FooterNote>
          <FooterRef>Ref: {inv.reference || inv.xero_no || "—"}</FooterRef>
        </DocFooter>

      </ModalBox>

      {/* Confirm dialogs */}
      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          variant={confirm.variant}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

    </Overlay>
  );
}
