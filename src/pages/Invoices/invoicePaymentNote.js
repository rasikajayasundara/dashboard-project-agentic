const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function ordinal(n) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:  return `${n}st`;
    case 2:  return `${n}nd`;
    case 3:  return `${n}rd`;
    default: return `${n}th`;
  }
}

function formatLongDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr.length === 10 ? `${dateStr}T00:00:00Z` : dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${MONTHS_LONG[d.getUTCMonth()]} ${ordinal(d.getUTCDate())}, ${d.getUTCFullYear()}`;
}

// Payment status can show up on either field depending on the endpoint:
// payment_status_label ("Paid" / "Partially Paid" / "Pending" / "Overdue") from
// the list API, or the detail API's own `status` field taking the same values
// (in addition to the Draft/Submitted/Approved workflow stages it usually holds).
// The legacy xero_status/paid_full numeric fields are never actually populated
// by any current API mapper, so they're kept only as a last-resort fallback.
export function getInvoicePaymentState(inv) {
  const label = inv.payment_status_label || inv.status;
  if (label === "Paid" || label === "Partially Paid") {
    return {
      isFullyPaid:   label === "Paid",
      isPartialPaid: label === "Partially Paid",
    };
  }
  return {
    isFullyPaid:   inv.xero_status === 1 && inv.paid_full === 1,
    isPartialPaid: inv.xero_status === 1 && inv.paid_full === 0,
  };
}

// Builds the "Invoice has been paid on ..." / "Payment due on ..." note shown
// on the invoice detail modal and the downloaded PDF, kept in one place so
// both stay in sync.
export function getInvoicePaymentNote({ dueDate, isFullyPaid, isPartialPaid, payments = [] }) {
  const isOverdue = !isFullyPaid && dueDate && new Date(dueDate) < new Date();

  if (isFullyPaid) {
    const paidDate = payments.length > 0 ? payments[payments.length - 1].date : null;
    return {
      variant: "paid",
      text: paidDate ? `Invoice has been paid on ${formatLongDate(paidDate)}` : "Invoice has been paid",
    };
  }

  const dueLabel = formatLongDate(dueDate);
  if (isPartialPaid) {
    return {
      variant: "due",
      text: isOverdue
        ? `Partially paid — remaining balance overdue since ${dueLabel}`
        : `Partially paid — remaining balance due on ${dueLabel}`,
    };
  }

  if (!dueDate) return null;

  return {
    variant: "due",
    text: isOverdue ? `Payment overdue since ${dueLabel}` : `Payment due on ${dueLabel}`,
  };
}
