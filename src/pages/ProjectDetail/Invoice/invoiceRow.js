import OptionsMenu from "../../../components/OptionsMenu";
import {
  ITr, ITd,
  InvoiceIdBtn, InvoiceTitleBtn,
  InvoiceStatusBadge, PaymentBadge,
  DownloadBtn, AmountText,
} from "./invoice.styles";

const INV_STATUS_LABELS = { 0: "Draft", 1: "Submitted", 2: "Approved" };

const formatCurrency = (value) =>
  "$" + Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const getPayType = (invoice) => {
  if (invoice.xero_status === 1 && invoice.paid_full === 1) return "paid";
  if (invoice.xero_status === 1 && invoice.paid_full === 0) return "partial";
  const isPast = new Date(invoice.due_date || invoice.dueDate || 0) < new Date();
  return isPast ? "overdue" : "pending";
};

const PAY_LABELS = { paid: "Paid", partial: "Partially Paid", pending: "Pending", overdue: "Overdue" };

const InvoiceRow = ({
  invoice,
  toISODateOnly,
  handleViewInvoice,
  handleEditInvoice,
  handleDeleteInvoice,
  handleDownloadInvoice,
  downloadingInvoiceId,
  deleteLoading,
}) => {
  const rawStatus  = invoice.status ?? invoice.invoice_status ?? 0;
  const invStatus  = Number(rawStatus);
  const canEditOrDelete = invStatus === 0;
  const isApproved = invStatus === 2;
  const invoiceId  = invoice.id || invoice.invoice_id;
  const payType    = getPayType(invoice);

  return (
    <ITr onClick={() => handleViewInvoice(invoice)}>
      {/* Invoice ID */}
      <ITd onClick={(e) => e.stopPropagation()}>
        <InvoiceIdBtn onClick={() => handleViewInvoice(invoice)}>
          {invoice.xero_no || "—"}
        </InvoiceIdBtn>
      </ITd>

      {/* Title */}
      <ITd style={{ maxWidth: 280 }}>
        <InvoiceTitleBtn onClick={() => handleViewInvoice(invoice)}>
          {invoice.invoice_title || ""}
        </InvoiceTitleBtn>
      </ITd>

      {/* Invoice date */}
      <ITd>{toISODateOnly(invoice.invoice_date || invoice.invoiceDate)}</ITd>

      {/* Due date */}
      <ITd>{toISODateOnly(invoice.due_date || invoice.dueDate)}</ITd>

      {/* Invoice status */}
      <ITd>
        <InvoiceStatusBadge $s={invStatus}>
          {INV_STATUS_LABELS[invStatus] ?? String(rawStatus)}
        </InvoiceStatusBadge>
      </ITd>

      {/* Before tax */}
      <ITd><AmountText>{formatCurrency(invoice.amount)}</AmountText></ITd>

      {/* Total */}
      <ITd><AmountText>{formatCurrency(invoice.total)}</AmountText></ITd>

      {/* Payment status */}
      <ITd>
        <PaymentBadge $type={payType}>{PAY_LABELS[payType]}</PaymentBadge>
      </ITd>

      {/* Download */}
      <ITd onClick={(e) => e.stopPropagation()}>
        {isApproved && (
          <DownloadBtn
            onClick={() => handleDownloadInvoice(invoice)}
            title="Download Invoice"
            disabled={downloadingInvoiceId === invoiceId}
          >
            {downloadingInvoiceId === invoiceId
              ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              : <i className="bi bi-download" />
            }
          </DownloadBtn>
        )}
      </ITd>

      {/* Actions */}
      <ITd onClick={(e) => e.stopPropagation()}>
        <OptionsMenu
          items={[
            { icon: "bi-eye",    label: "View Invoice",   onClick: () => handleViewInvoice(invoice) },
            { icon: "bi-pencil", label: "Update Invoice", onClick: () => handleEditInvoice(invoice), show: canEditOrDelete },
            { icon: "bi-trash",  label: deleteLoading ? "Deleting..." : "Remove Invoice", onClick: () => handleDeleteInvoice(invoice), show: canEditOrDelete, danger: true, dividerBefore: true },
          ]}
        />
      </ITd>
    </ITr>
  );
};

export default InvoiceRow;
