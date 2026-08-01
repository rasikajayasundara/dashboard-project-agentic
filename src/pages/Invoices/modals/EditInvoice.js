import { useState, useMemo } from "react";
import FormField, { FormInput, FormSelect, FormDatePicker, FieldError } from "../../../components/FormField";
import ConfirmDialog from "../../../components/ConfirmDialog";
import {
  Overlay, ModalBox, ModalHeader, ModalTitle, CloseBtn,
  ModalFooter, FooterButtons, CancelBtn,
  DraftBtn, SubmitBtn,
  TopBar, ModalPanels, LeftPanel, RightPanel, MiniGrid,
  SectionDivider, FormTextarea, BillingNote, BillingWarning, BillingLink,
  LineItemsTable, LineItemsHead, LineItemHeadCell,
  LineItemRow, LineItemInput, LineItemCheckbox, LineItemStatic,
  SummaryBlock, SummaryLine, SummaryDivider, SummaryTotal,
} from "./form.styles";

const fmt = (v) =>
  "$" + Number(v || 0).toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatBudgetCode = (budgetId) => `BD${String(budgetId).padStart(5, "0")}`;

const CONFIRM_CONFIG = {
  submit: {
    title:        "Submit Invoice",
    message:      "Submit this invoice for approval?",
    confirmLabel: "Submit",
    variant:      "info",
  },
};

// Existing invoice_items only carry the budget_id + a saved amount — seed the
// checkbox/amount state so already-selected line items open pre-checked.
const seedFromInvoiceItems = (invoiceItems) => {
  const selected = {};
  const amounts  = {};
  (invoiceItems || []).forEach((item) => {
    if (item.budget_id == null) return;
    selected[item.budget_id] = true;
    amounts[item.budget_id]  = String(item.amount ?? "");
  });
  return { selected, amounts };
};

export default function EditInvoice({ invoice, budgets = [], onClose, onSave, submitting }) {
  const clientId = invoice?.clientId ?? invoice?.client_id;

  const [form, setForm] = useState({
    client_name:     invoice?.client_name     || "",
    billing_contact: invoice?.billing_contact || "",
    invoice_date:    invoice?.invoice_date    || "",
    due_date:        invoice?.due_date        || "",
    gst:             String(invoice?.gst ?? 0.15),
    reference:       invoice?.reference       || "",
    invoice_title:   invoice?.invoice_title   || "",
    description:     invoice?.description     || "",
  });

  const seeded = useMemo(() => seedFromInvoiceItems(invoice?.invoice_items), [invoice]);
  const [selectedBudgets, setSelectedBudgets] = useState(seeded.selected); // budgetId -> true
  const [amounts,         setAmounts]         = useState(seeded.amounts); // budgetId -> string
  const [errors,          setErrors]          = useState({});
  const [pendingAction,   setPendingAction]   = useState(null); // "submit"

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggleBudget = (budgetId) =>
    setSelectedBudgets((prev) => ({ ...prev, [budgetId]: !prev[budgetId] }));

  const updateAmount = (budgetId, value) =>
    setAmounts((prev) => ({ ...prev, [budgetId]: value }));

  const subTotal = useMemo(
    () =>
      budgets.reduce(
        (s, b) => s + (selectedBudgets[b.budgetId] ? (parseFloat(amounts[b.budgetId]) || 0) : 0),
        0
      ),
    [budgets, selectedBudgets, amounts]
  );
  const gstRate = parseFloat(form.gst) || 0;
  const gstAmt  = subTotal * gstRate;
  const total   = subTotal + gstAmt;
  const gstPct  = Math.round(gstRate * 100);

  const validate = () => {
    const e = {};
    if (!form.client_name.trim())     e.client_name     = "Required";
    if (!form.invoice_title.trim())   e.invoice_title   = "Required";
    if (!form.invoice_date)           e.invoice_date    = "Required";
    if (!form.due_date)               e.due_date        = "Required";
    if (!form.reference.trim())       e.reference       = "Required";
    if (!form.billing_contact.trim()) e.billing_contact = "This client has no billing contact on file";

    const checkedBudgetIds = budgets.filter((b) => selectedBudgets[b.budgetId]);
    const hasValidLineItem = checkedBudgetIds.some(
      (b) => (parseFloat(amounts[b.budgetId]) || 0) > 0
    );
    if (checkedBudgetIds.length === 0 || !hasValidLineItem) {
      e.invoice_items = "Select at least one line item with an amount greater than 0";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildPayload = (action) => ({
    ...form,
    id:            invoice?.id || invoice?.invoice_id || invoice?.invoiceId,
    client_id:     invoice?.clientId  ?? invoice?.client_id,
    project_id:    invoice?.projectId ?? invoice?.project_id,
    gst:           gstRate,
    amount:        subTotal,
    total,
    action,
    invoice_items: budgets
      .filter((b) => selectedBudgets[b.budgetId])
      .map((b) => ({
        budget_id:   b.budgetId,
        budget_name: b.budgetName,
        amount:      parseFloat(amounts[b.budgetId]) || 0,
      })),
  });

  const handleSave = (action) => {
    if (!validate()) return;
    if (action === "submit") {
      setPendingAction(action);
      return;
    }
    const payload = buildPayload(action);
    if (typeof onSave === "function") onSave(payload);
    else { console.log("Edit Invoice payload:", payload); onClose?.(); }
  };

  const handleConfirm = () => {
    const payload = buildPayload(pendingAction);
    setPendingAction(null);
    if (typeof onSave === "function") onSave(payload);
    else { console.log("Edit Invoice payload:", payload); onClose?.(); }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox $maxWidth="900px" $height="82vh" onClick={(e) => e.stopPropagation()}>

        <ModalHeader>
          <ModalTitle>Edit Invoice</ModalTitle>
          <CloseBtn onClick={onClose}><i className="bi bi-x-lg" /></CloseBtn>
        </ModalHeader>

        {/* ── Top bar ───────────────────────────────────────────────────────── */}
        <TopBar>
          <FormField label="Invoice To" required error={errors.client_name}>
            <FormInput
              placeholder="Client name"
              value={form.client_name}
              readOnly
              $error={!!errors.client_name}
            />
            {form.billing_contact ? (
              <BillingNote>{form.billing_contact}</BillingNote>
            ) : (
              <BillingWarning>
                <i className="bi bi-exclamation-triangle" />
                <span>
                  No billing contact for this client.{" "}
                  <BillingLink to={`/client/${clientId}`} target="_blank" rel="noopener noreferrer">
                    Add one on the client profile
                  </BillingLink>
                </span>
              </BillingWarning>
            )}
          </FormField>

          <FormField label="Invoice Title" required error={errors.invoice_title}>
            <FormInput
              placeholder="Invoice title"
              value={form.invoice_title}
              onChange={(e) => setField("invoice_title", e.target.value)}
              $error={!!errors.invoice_title}
            />
          </FormField>
        </TopBar>

        <ModalPanels>

          {/* ── Left panel ────────────────────────────────────────────────── */}
          <LeftPanel>

            <MiniGrid>
              <FormField label="Invoice Date" required error={errors.invoice_date}>
                <FormDatePicker
                  value={form.invoice_date}
                  onChange={(v) => setField("invoice_date", v)}
                  $error={!!errors.invoice_date}
                />
              </FormField>

              <FormField label="Due Date" required error={errors.due_date}>
                <FormDatePicker
                  value={form.due_date}
                  onChange={(v) => setField("due_date", v)}
                  $error={!!errors.due_date}
                />
              </FormField>
            </MiniGrid>

            <MiniGrid>
              <FormField label="GST">
                <FormSelect
                  value={form.gst}
                  onChange={(e) => setField("gst", e.target.value)}
                >
                  <option value="0.15">15%</option>
                  <option value="0">0% (exempt)</option>
                </FormSelect>
              </FormField>

              <FormField label="Reference" required error={errors.reference}>
                <FormInput
                  placeholder="e.g. J005118"
                  value={form.reference}
                  onChange={(e) => setField("reference", e.target.value)}
                  $error={!!errors.reference}
                />
              </FormField>
            </MiniGrid>

            <FormField label="Description">
              <FormTextarea
                placeholder="Describe the work covered by this invoice…"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                rows={4}
              />
            </FormField>

          </LeftPanel>

          {/* ── Right panel: line items + totals ───────────────────────────── */}
          <RightPanel>

            <SectionDivider>Line Items</SectionDivider>
            {errors.invoice_items && <FieldError>{errors.invoice_items}</FieldError>}

            <LineItemsTable>
              <LineItemsHead>
                <LineItemHeadCell />
                <LineItemHeadCell>Budget Code</LineItemHeadCell>
                <LineItemHeadCell>Budget Name</LineItemHeadCell>
                <LineItemHeadCell>Amount (NZD)</LineItemHeadCell>
              </LineItemsHead>

              {budgets.length === 0 && (
                <LineItemRow>
                  <LineItemStatic style={{ gridColumn: "1 / span 3", color: "inherit" }}>
                    No budgets available for this project
                  </LineItemStatic>
                </LineItemRow>
              )}

              {budgets.map((b) => {
                const isSelected = !!selectedBudgets[b.budgetId];
                return (
                  <LineItemRow key={b.budgetId} $disabled={!isSelected}>
                    <LineItemCheckbox
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleBudget(b.budgetId)}
                    />
                    <LineItemStatic>{formatBudgetCode(b.budgetId)}</LineItemStatic>
                    <LineItemStatic>{b.budgetName}</LineItemStatic>
                    <LineItemInput
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={amounts[b.budgetId] || ""}
                      onChange={(e) => updateAmount(b.budgetId, e.target.value)}
                      disabled={!isSelected}
                      style={{ textAlign: "right" }}
                    />
                  </LineItemRow>
                );
              })}
            </LineItemsTable>

            <SummaryBlock>
              <SummaryLine>
                <span>Sub Total</span>
                <span>{fmt(subTotal)}</span>
              </SummaryLine>
              <SummaryLine>
                <span>GST {gstPct}%</span>
                <span>{fmt(gstAmt)}</span>
              </SummaryLine>
              <SummaryDivider />
              <SummaryTotal>
                <span>Total (NZD)</span>
                <span>{fmt(total)}</span>
              </SummaryTotal>
            </SummaryBlock>

          </RightPanel>

        </ModalPanels>

        <ModalFooter>
          <CancelBtn type="button" onClick={onClose} disabled={submitting}>Cancel</CancelBtn>
          <FooterButtons>
            <DraftBtn type="button" onClick={() => handleSave("draft")} disabled={submitting}>
              <i className="bi bi-file-earmark" /> Save Changes
            </DraftBtn>
            <SubmitBtn type="button" onClick={() => handleSave("submit")} disabled={submitting}>
              <i className="bi bi-send" /> Submit for Approval
            </SubmitBtn>
          </FooterButtons>
        </ModalFooter>

      </ModalBox>

      {pendingAction && (
        <ConfirmDialog
          title={CONFIRM_CONFIG[pendingAction].title}
          message={CONFIRM_CONFIG[pendingAction].message}
          confirmLabel={CONFIRM_CONFIG[pendingAction].confirmLabel}
          variant={CONFIRM_CONFIG[pendingAction].variant}
          onConfirm={handleConfirm}
          onCancel={() => setPendingAction(null)}
        />
      )}

    </Overlay>
  );
}
