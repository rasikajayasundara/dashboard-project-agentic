// Maps GET /invoices/{id} (camelCase) onto the snake_case shape InvoiceDetail/EditInvoice read.
export function normalizeInvoiceDetail(data) {
  if (!data) return data;
  return {
    ...data,
    xero_no:         (data.invoiceNo || "").trim(),
    invoice_title:   data.invoiceTitle,
    invoice_date:    data.invoiceDate,
    due_date:        data.dueDate,
    client_name:     data.clientName,
    billing_contact: data.billingContact,
    reference:       data.reference,
    description:     data.description,
    gst:             Number(data.gst),
    amount:          Number(data.subTotal),
    sub_total:       Number(data.subTotal),
    total:           Number(data.total),
    status:          data.status,
    project_no:      data.projectNo,
    project_name:    data.projectName,
    paid_full:       data.paidFull,
    payment_status_label: data.paymentStatus,
    invoice_items: (data.invoiceItems || []).map((item) => ({
      budget_id:   item.budgetId,
      budget_name: item.budgetName,
      amount:      Number(item.amount),
    })),
    payment_history: (data.payments || []).map((p) => ({
      date:   p.date,
      amount: Number(p.amount),
    })),
  };
}
