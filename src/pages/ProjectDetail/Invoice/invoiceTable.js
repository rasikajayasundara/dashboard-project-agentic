import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { createGlobalStyle } from "styled-components";
import StatCard from "../../../components/Statcard";
import DataTable from "../../../components/DataTable";
import FilterBar from "../../../components/FilterBar";
import OptionsMenu from "../../../components/OptionsMenu";
import ConfirmDialog from "../../../components/ConfirmDialog";
import PermissionGate from "../../../components/PermissionGate";
import EmptyState from "../../../components/EmptyState";
import PageBanner from "../../../components/PageBanner";
import { usePermission } from "../../../hooks/usePermission";
import { colors } from "../../../constants/common";
import { StatsRow, NewInvoiceBtn, LoadingState, StatFooter, LastSyncedText, FooterTotal, FooterTotalLabel, FooterTotalValue } from "./invoice.styles";
import InvoiceDetail from "../../Invoices/modals/InvoiceDetail";
import AddInvoice from "../../Invoices/modals/AddInvoice";
import EditInvoice from "../../Invoices/modals/EditInvoice";
import { toISODateOnly, toDisplayDate } from "../../../utils/dateMaker";
import { normalizeInvoiceDetail } from "../../../utils/normalizeInvoice";
import { snackbarAction } from "../../../store/snackbarSlice";
import { invoiceAction } from "../../../store/invoiceSlice";
import { projectBudgetAction } from "../../../store/projectBudgetSlice";

const InvoiceTableStyles = createGlobalStyle`
  .invoice-page-root { background-color: transparent; }
  .invoice-card { border: 1px solid #e6e9ef; border-radius: 12px; max-width: none; width: 100%; margin: 0; padding: 0; overflow: visible; }
  .table-wrap { padding: 10px 20px; overflow: visible; }
  .invoice-table thead { background-color: #fbfbfc; }
  .invoice-table th { text-align: left; padding: 10px 14px; font-size: 13px; font-weight: 700; color: #8b90a0; letter-spacing: 0.06em; border-bottom: 1px solid #eef1f6; vertical-align: middle; }
  .invoice-table th .dropdown-toggle { cursor: pointer; }
  .invoice-table th .dropdown-toggle::after { display: none; }
  .invoice-table th .btn-link { color: inherit; text-decoration: none; border: none; background: transparent; padding: 0; font-size: inherit; font-weight: inherit; white-space: nowrap; display: flex; align-items: center; gap: 6px; }
  .invoice-table th .btn-link:hover { color: #2563eb; text-decoration: none; }
  .invoice-table th .btn-link:hover i { color: #2563eb; }
  .invoice-table th i { font-size: 12px; color: #8b90a0; transition: color 0.2s; }
  .invoice-table th .dropdown-menu { min-width: auto; font-size: 13px; }
  .invoice-table tbody tr { border-bottom: 1px solid #f3f5f8; transition: background-color 0.15s; }
  .invoice-table tbody tr:hover { background-color: #fafbfd; }
  .invoice-table td { padding: 12px 14px; font-size: 13px; color: #0f1724; vertical-align: middle; }
  .client-name { font-weight: 500; }
  .project-name { color: #6b7280; }
  .amount { text-align: right; white-space: nowrap; }
  .actions-btn { background: transparent !important; border: none !important; padding: 4px 6px !important; cursor: pointer !important; font-size: 18px !important; color: #6b7280 !important; line-height: 1 !important; }
  .dropdown-toggle.actions-btn::after { display: none; }
  .dropdown-toggle.actions-btn:hover, .dropdown-toggle.actions-btn:focus { background: transparent !important; box-shadow: none !important; }
  .new-invoice-btn { color: white; border: none; padding: 8px 16px; font-size: 14px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 10px; transition: transform 0.12s ease, box-shadow 0.12s ease; border-radius: 999px; }
  .new-invoice-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(37,99,235,0.14); }
  .new-invoice-icon { width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center; line-height: 0; }
  .border-radius-40 { border-radius: 999px !important; }
  .new-invoice-text { display: inline-block; margin-left: 2px; }
  .text-right { text-align: right; }
  .invoice-table .dropdown-menu .dropdown-item.text-danger:hover, .invoice-table .dropdown-menu .dropdown-item.text-danger:focus { color: #ffffff !important; background-color: #dc3545 !important; }
  .invoice-table .dropdown-menu .dropdown-item.text-danger:active { color: #ffffff !important; background-color: #dc3545 !important; }
  .status-pill { display: inline-flex; align-items: center; text-transform: capitalize; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; background: rgba(99,102,241,0.1); color: #4338ca; }
  .status-pill.status-pending { background: rgba(239,68,68,0.12); color: #b91c1c; }
  .status-pill.status-paid { background: rgba(16,185,129,0.12); color: #047857; }
  .status-pill.status-partially-paid { background: rgba(59,130,246,0.12); color: #d8651d; }
`;

/* ── Filters ──────────────────────────────────────────────────────────────── */

// Case-insensitive, trimmed, either-contains-the-other match
// (handles "Hamilton" vs "Hamilton (Head Office)" and exact matches like
// "Wellington Office" vs "Wellington Office")
const locationMatches = (invoiceLocation, officeLocationName) => {
  const a = String(invoiceLocation || "").trim().toLowerCase();
  const b = String(officeLocationName || "").trim().toLowerCase();
  if (!a || !b) return false;
  return a.includes(b) || b.includes(a);
};

// True when the invoice's invoice_date falls within the selected [from, to]
// range — either side of the range may be open-ended.
const invoiceInDateRange = (invoice, range) => {
  if (!range || (!range.from && !range.to)) return true;
  const date = toISODateOnly(invoice.invoice_date || invoice.invoiceDate);
  if (!date) return false;
  if (range.from && date < range.from) return false;
  if (range.to   && date > range.to)   return false;
  return true;
};

const STATUS_FILTER_OPTIONS = [
  { value: "Draft",     label: "Draft"     },
  { value: "Submitted", label: "Submitted" },
  { value: "Approved",  label: "Approved"  },
];

const PAYMENT_FILTER_OPTIONS = [
  { value: "Paid",           label: "Paid"           },
  { value: "Partially Paid", label: "Partially Paid" },
  { value: "Pending",        label: "Pending"        },
  { value: "Overdue",        label: "Overdue"        },
  { value: "Refused",        label: "Refused"        },
];

/* ── Table columns ────────────────────────────────────────────────────────── */

const INVOICE_COLUMNS = [
  { key: "invoiceId", label: "Invoice ID",    sortable: true,  index: 0 },
  { key: "title",     label: "Invoice Title", sortable: false, index: 1 },
  { key: "location",  label: "Location",      sortable: true,  index: 2 },
  { key: "invDate",   label: "Invoice Date",  sortable: true,  index: 3 },
  { key: "dueDate",   label: "Due Date",      sortable: true,  index: 4 },
  { key: "status",    label: "Status",        sortable: false, index: 5 },
  { key: "beforeTax", label: "Before Tax",    sortable: false, index: 6, align: "right" },
  { key: "total",     label: "Total",         sortable: false, index: 7, align: "right" },
  { key: "payment",   label: "Payment",       sortable: false, index: 8 },
  { key: "actions",   label: "",              sortable: false, index: 9 },
];

/* ── Helpers ──────────────────────────────────────────────────────────────── */

const formatCurrency = (v) =>
  "$" + Number(v || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatSyncTime = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}.${mm} ${toDisplayDate(value)}`;
};

const getPayLabel = (invoice) => {
  if (invoice.payment_status_label) return invoice.payment_status_label;
  if (invoice.xero_status === 1 && invoice.paid_full === 1) return "Paid";
  if (invoice.xero_status === 1 && invoice.paid_full === 0) return "Partially Paid";
  const isPast = new Date(invoice.due_date || invoice.dueDate || 0) < new Date();
  return isPast ? "Overdue" : "Pending";
};

// Maps GET /invoices list items (camelCase) onto the snake_case shape this
// table/its modals already read (mock data + the project-scoped fetch use it).
const normalizeInvoice = (invoice) => ({
  ...invoice,
  id: invoice.invoiceId,
  xero_no: invoice.invoiceNo,
  invoice_title: invoice.invoiceTitle,
  invoice_date: invoice.invoiceDate,
  due_date: invoice.dueDate,
  status: invoice.invoiceStatus,
  client_name: invoice.clientName,
  project_name: invoice.projectName,
  payment_status_label: invoice.paymentStatus,
});

/* ── Component ────────────────────────────────────────────────────────────── */

const STATUS_BY_ACTION = { draft: "draft", submit: "submitForApproval" };

const InvoiceTable = ({
  invoicesProp,
  onNewInvoice,
  clientId,
  projectId,
  clientName: clientNameProp,
  billingContact,
  projectNo,
  projectName: projectNameProp,
  budgets = [],
  onSwitchTab,
}) => {
  const STATUS_LABELS = { 0: "Draft", 1: "Submitted", 2: "Approved" };

  const dispatch = useDispatch();
  const {
    invoiceList,
    lastXeroSync,
    isLoadingInvoiceList,
    error: invoiceListError,
    createInvoiceLoading,
    createInvoiceError,
    updatingInvoiceStatus,
    updateInvoiceLoading,
    updateInvoiceError,
    invoiceDetail,
    isLoadingInvoiceDetail,
  } = useSelector((state) => state.invoiceDetail);

  const { officeLocations } = useSelector((state) => state?.metadata) || {};

  const selectedInvoice = useMemo(() => normalizeInvoiceDetail(invoiceDetail), [invoiceDetail]);

  const canInvoiceUpdate  = usePermission("canInvoiceUpdate");
  const canInvoiceDelete  = usePermission("canInvoiceDelete");
  const canInvoiceApprove = usePermission("canInvoiceApprove");

  const [detailModalOpen,       setDetailModalOpen]       = useState(false);
  const [editInvoiceId,         setEditInvoiceId]         = useState(null);
  const [newInvoiceModalOpen,   setNewInvoiceModalOpen]   = useState(false);
  const [deletePrompt,          setDeletePrompt]          = useState(null);
  const [actionPrompt,          setActionPrompt]          = useState(null); // { action: "submit"|"approve", invoice }
  const [createRequested,       setCreateRequested]       = useState(false);
  const [statusUpdateRequested, setStatusUpdateRequested] = useState(false);
  const [updateRequested,       setUpdateRequested]       = useState(false);

  const showToast = (message, type) => dispatch(snackbarAction.showSnackbar({ message, type }));

  const fetchInvoices = () =>
    dispatch(invoiceAction.getInvoiceListStart(projectId ? { projectId } : undefined));

  /* ── Fetch invoice list (global, or by project) ───────────────────────── */

  useEffect(() => {
    fetchInvoices();
  }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Invoice list ─────────────────────────────────────────────────────── */

  const displayInvoices = useMemo(() => invoiceList.map(normalizeInvoice), [invoiceList]);

  /* ── Stat card totals ─────────────────────────────────────────────────── */

  const clientComputedStats = useMemo(() => {
    const all      = displayInvoices;
    // Total Invoiced only counts Approved invoices — Draft and Submitted
    // for approval aren't real invoiced amounts yet.
    const approved = all.filter((inv) => Number(inv.status ?? inv.invoice_status ?? 0) === 2);
    const paid     = all.filter((inv) => getPayLabel(inv) === "Paid");
    const overdue  = all.filter((inv) => getPayLabel(inv) === "Overdue");
    const pending  = all.filter((inv) => getPayLabel(inv) === "Pending");
    return {
      totalInvoiced: approved.reduce((s, inv) => s + Number(inv.total || 0), 0),
      paidAmount:    paid.reduce((s, inv) => s + Number(inv.total || 0), 0),
      paidCount:     paid.length,
      overdueAmount: overdue.reduce((s, inv) => s + Number(inv.total || 0), 0),
      overdueCount:  overdue.length,
      pendingAmount: pending.reduce((s, inv) => s + Number(inv.total || 0), 0),
      pendingCount:  pending.length,
    };
  }, [displayInvoices]);

  // Computed client-side (not the server's `stats` block) for both the global
  // list and a single project's list, so "Total Invoiced" consistently means
  // Approved-only everywhere, and amounts aren't pre-rounded by the API.
  const invoiceStats = clientComputedStats;

  /* ── Filter / search ──────────────────────────────────────────────────── */

  const [search,        setSearch]        = useState("");
  const [activeFilters, setActiveFilters] = useState({});

  const handleFilterChange = (key, value) =>
    setActiveFilters((prev) => ({ ...prev, [key]: value }));

  const locationOptions = useMemo(
    () => (officeLocations || []).map((loc) => loc.officeLocation),
    [officeLocations]
  );

  const INVOICE_FILTERS = useMemo(() => [
    {
      key: "status",
      label: "Invoice Status",
      icon: "bi-file-earmark-text",
      options: STATUS_FILTER_OPTIONS,
    },
    {
      key: "payment",
      label: "Payment Status",
      icon: "bi-credit-card",
      options: PAYMENT_FILTER_OPTIONS,
    },
    {
      key: "location",
      label: "Location",
      icon: "bi-geo-alt",
      options: locationOptions.map((l) => ({ value: l, label: l })),
    },
    {
      key: "dateRange",
      label: "Date Range",
      icon: "bi-calendar-range",
      type: "dateRange",
    },
  ], [locationOptions]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return displayInvoices.filter((inv) => {
      if (activeFilters.status) {
        const statusLabel = STATUS_LABELS[Number(inv.status ?? inv.invoice_status ?? 0)] ?? "Draft";
        if (statusLabel !== activeFilters.status) return false;
      }
      if (activeFilters.payment  && getPayLabel(inv) !== activeFilters.payment)    return false;
      if (activeFilters.location && !locationMatches(inv.location, activeFilters.location)) return false;
      if (!invoiceInDateRange(inv, activeFilters.dateRange)) return false;
      if (!term) return true;
      return (
        (inv.xero_no       || "").toLowerCase().includes(term) ||
        (inv.invoice_title || "").toLowerCase().includes(term) ||
        (inv.client_name   || "").toLowerCase().includes(term)
      );
    });
  }, [displayInvoices, search, activeFilters]);

  /* ── Handlers ─────────────────────────────────────────────────────────── */

  const handleRowClick = (rowId) => {
    setDetailModalOpen(true);
    dispatch(invoiceAction.invoiceDetailStart(rowId));
  };

  // The invoice list endpoint returns summary fields only (no line items), so
  // Edit needs the same full-detail fetch View uses — otherwise every budget
  // checkbox opens unchecked with a 0.00 amount regardless of what was saved.
  const handleEditInvoice = (invoice) => {
    const id = invoice.id || invoice.invoice_id || invoice.invoiceId;
    setEditInvoiceId(id);
    dispatch(invoiceAction.invoiceDetailStart(id));
    if (projectId) dispatch(projectBudgetAction.fetchBudgetsStart(projectId));
  };

  const handleDeleteInvoice = (invoice) => setDeletePrompt(invoice);

  const confirmDelete = () => {
    if (!deletePrompt) return;
    const id = deletePrompt.id || deletePrompt.invoice_id;
    dispatch(invoiceAction.deleteInvoiceStart(id));
    setDeletePrompt(null);
  };

  useEffect(() => {
    if (createRequested && !createInvoiceLoading) {
      if (createInvoiceError) {
        showToast(createInvoiceError, "error");
      } else {
        onSuccessInvoiceModal();
      }
      setCreateRequested(false);
    }
  }, [createInvoiceLoading, createInvoiceError, createRequested]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (statusUpdateRequested && !updatingInvoiceStatus) {
      fetchInvoices();
      setStatusUpdateRequested(false);
    }
  }, [updatingInvoiceStatus, statusUpdateRequested]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (updateRequested && !updateInvoiceLoading) {
      if (!updateInvoiceError) {
        setEditInvoiceId(null);
        onSuccessInvoiceModal();
      }
      setUpdateRequested(false);
    }
  }, [updateInvoiceLoading, updateInvoiceError, updateRequested]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNewInvoice = () => {
    setNewInvoiceModalOpen(true);
    if (projectId) dispatch(projectBudgetAction.fetchBudgetsStart(projectId));
    if (typeof onNewInvoice === "function") onNewInvoice();
  };

  // Toast messaging for create/update/submit is handled by invoiceSlice/saga.js,
  // which already dispatches an accurate, action-specific snackbar
  // ("Invoice saved as draft" / "submitted for approval" / "updated successfully").
  // This just closes the modal and refetches the list.
  const onSuccessInvoiceModal = () => {
    setNewInvoiceModalOpen(false);
    fetchInvoices();
  };

  /* ── Table data ───────────────────────────────────────────────────────── */

  const { totalBeforeTax, totalAmt } = useMemo(
    () => filtered.reduce(
      (acc, inv) => ({
        totalBeforeTax: acc.totalBeforeTax + Number(inv.amount || 0),
        totalAmt:       acc.totalAmt       + Number(inv.total  || 0),
      }),
      { totalBeforeTax: 0, totalAmt: 0 }
    ),
    [filtered]
  );

  const tableData = filtered.map((invoice) => {
    const rawStatus = invoice.status ?? invoice.invoice_status ?? 0;
    const invStatus = Number(rawStatus);
    const isDraft     = invStatus === 0;
    const isSubmitted = invStatus === 1;
    const canEdit   = (isDraft || isSubmitted) && canInvoiceUpdate;
    const canDelete = (isDraft || isSubmitted) && canInvoiceDelete;
    const invoiceId = invoice.id || invoice.invoice_id;

    return {
      rowId: invoiceId,
      row: [
        { value: invoice.xero_no || "—",                                    type: "text"  },
        { value: invoice.invoice_title || "",                                type: "text"  },
        { value: invoice.location || "—",                                    type: "text"  },
        { value: toISODateOnly(invoice.invoice_date || invoice.invoiceDate), type: "text"  },
        { value: toISODateOnly(invoice.due_date     || invoice.dueDate),     type: "text"  },
        { value: STATUS_LABELS[invStatus] ?? "Draft",                        type: "badge" },
        { value: formatCurrency(invoice.amount),                             type: "text"  },
        { value: formatCurrency(invoice.total),                              type: "text"  },
        { value: getPayLabel(invoice),                                       type: "badge" },
        {
          value: (
            <div
              style={{ display: "flex", alignItems: "center", gap: 4 }}
              onClick={(e) => e.stopPropagation()}
            >
              <OptionsMenu
                items={[
                  {
                    icon:    "bi-eye",
                    label:   "View Invoice",
                    onClick: () => handleRowClick(invoiceId),
                  },
                  {
                    icon:    "bi-pencil",
                    label:   "Edit",
                    onClick: () => handleEditInvoice(invoice),
                    show:    !!projectId && canEdit,
                  },
                  {
                    icon:          "bi-send",
                    label:         "Submit for Approval",
                    onClick:       () => setActionPrompt({ action: "submit", invoice }),
                    show:          !!projectId && isDraft && canInvoiceUpdate,
                    dividerBefore: true,
                  },
                  {
                    icon:    "bi-check-circle",
                    label:   "Approve & Send",
                    onClick: () => setActionPrompt({ action: "approve", invoice }),
                    show:    isSubmitted && canInvoiceApprove,
                  },
                  {
                    icon:    "bi-envelope",
                    label:   "Approve & Send",
                    onClick: () => setActionPrompt({ action: "approve", invoice }),
                    show:    isDraft && canInvoiceUpdate,
                  },
                  {
                    icon:          "bi-trash",
                    label:         "Delete",
                    onClick:       () => handleDeleteInvoice(invoice),
                    show:          canDelete,
                    danger:        true,
                    dividerBefore: true,
                  },
                ]}
              />
            </div>
          ),
          type: "text",
        },
      ],
    };
  });

  /* ── Helpers ──────────────────────────────────────────────────────────── */

  const fmtAmt = (v) =>
    "$" + Number(v || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtN = (n, word) => `${n} ${n === 1 ? word : word + "s"}`;

  /* ── Render ───────────────────────────────────────────────────────────── */

  return (
    <div>
      <InvoiceTableStyles />
      {/* Stat cards */}
      <StatsRow>
        <StatCard
          label="Total Invoiced"
          value={fmtAmt(invoiceStats.totalInvoiced)}
          icon={<i className="bi bi-receipt" />}
          iconColor={colors.accentBlue}
          footer={<StatFooter>{fmtN(displayInvoices.length, "invoice")}</StatFooter>}
          index={0}
        />
        <StatCard
          label="Pending"
          value={fmtAmt(invoiceStats.pendingAmount)}
          icon={<i className="bi bi-hourglass-split" />}
          iconColor="#F59E0B"
          footer={<StatFooter>{fmtN(invoiceStats.pendingCount, "invoice")}</StatFooter>}
          index={1}
        />
        <StatCard
          label="Overdue"
          value={fmtAmt(invoiceStats.overdueAmount)}
          icon={<i className="bi bi-exclamation-circle" />}
          iconColor="#EF4444"
          footer={<StatFooter>{fmtN(invoiceStats.overdueCount, "invoice")}</StatFooter>}
          index={2}
        />
        <StatCard
          label="Paid"
          value={fmtAmt(invoiceStats.paidAmount)}
          icon={<i className="bi bi-check-circle" />}
          iconColor="#22C55E"
          footer={<StatFooter>{fmtN(invoiceStats.paidCount, "invoice")}</StatFooter>}
          index={3}
        />
      </StatsRow>

      {/* Error banner */}
      {invoiceListError && (
        <PageBanner type="error" title="Error loading invoices:" message={invoiceListError} />
      )}

      {/* Table */}
      {isLoadingInvoiceList ? (
        <LoadingState>
          <div className="spinner-border spinner-border-sm text-primary mb-2" role="status" />
          <div>Loading invoices...</div>
        </LoadingState>
      ) : (
        <DataTable
          filterBarSlot={
            <FilterBar
              filters={INVOICE_FILTERS}
              searchPlaceholder="Search invoices..."
              searchValue={search}
              onSearchChange={setSearch}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              rightSlot={
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  {lastXeroSync && (
                    <LastSyncedText>
                      Last sync at <strong>{formatSyncTime(lastXeroSync)}</strong> with Xero
                    </LastSyncedText>
                  )}
                  {projectId && (
                    <PermissionGate can="canInvoiceAdd">
                      <NewInvoiceBtn onClick={handleNewInvoice} disabled={createInvoiceLoading}>
                        <i className="bi bi-plus-lg" />
                        {createInvoiceLoading ? "Creating..." : "New Invoice"}
                      </NewInvoiceBtn>
                    </PermissionGate>
                  )}
                </div>
              }
            />
          }
          footerSlot={
            <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
              <FooterTotal>
                <FooterTotalLabel>Before Tax</FooterTotalLabel>
                <FooterTotalValue>{formatCurrency(totalBeforeTax)}</FooterTotalValue>
              </FooterTotal>
              <FooterTotal>
                <FooterTotalLabel>Total</FooterTotalLabel>
                <FooterTotalValue>{formatCurrency(totalAmt)}</FooterTotalValue>
              </FooterTotal>
            </div>
          }
          columns={INVOICE_COLUMNS}
          data={tableData}
          onClickRow={handleRowClick}
          hideActionCol
          emptyState={projectId ? (
            <EmptyState
              icon="bi-receipt"
              title="No invoices yet"
              subtitle="Create an invoice from this project's budgets to bill your client."
            />
          ) : undefined}
        />
      )}

      {/* Invoice detail modal */}
      {detailModalOpen && (
        <InvoiceDetail
          invoice={selectedInvoice}
          loading={isLoadingInvoiceDetail}
          error={invoiceListError}
          onClose={() => setDetailModalOpen(false)}
          showOptionsMenu={!!projectId}
          onEdit={() => {
            setDetailModalOpen(false);
            handleEditInvoice(selectedInvoice);
          }}
          onAction={(action) => {
            if (action === "approve") setStatusUpdateRequested(true);
            if (action === "submit") setUpdateRequested(true);
          }}
        />
      )}

      {/* Edit invoice modal — waits for the full-detail fetch (with real line
          items) to resolve and match the requested id before rendering, so it
          never flashes open with stale or empty data from a previous fetch */}
      {editInvoiceId && selectedInvoice && String(selectedInvoice.invoiceId) === String(editInvoiceId) && (
        <EditInvoice
          invoice={selectedInvoice}
          budgets={budgets}
          submitting={updateInvoiceLoading}
          onClose={() => setEditInvoiceId(null)}
          onSave={(payload) => {
            const apiPayload = {
              projectId: Number(payload.project_id),
              clientId: Number(payload.client_id),
              invoiceDate: payload.invoice_date,
              dueDate: payload.due_date,
              invoiceTitle: payload.invoice_title,
              billingContact: payload.billing_contact,
              reference: payload.reference,
              description: payload.description,
              gst: Number(payload.gst),
              status: STATUS_BY_ACTION[payload.action] || "draft",
              invoiceItems: payload.invoice_items.map((item) => ({
                budgetId: item.budget_id,
                amount: Number(item.amount),
              })),
            };
            setUpdateRequested(true);
            dispatch(invoiceAction.updateInvoiceStart({ invoiceId: payload.id, payload: apiPayload }));
          }}
        />
      )}

      {/* New invoice modal */}
      {newInvoiceModalOpen && (
        <AddInvoice
          clientId={clientId}
          projectId={projectId}
          clientName={clientNameProp}
          billingContact={billingContact}
          projectNo={projectNo}
          projectName={projectNameProp}
          budgets={budgets}
          submitting={createInvoiceLoading}
          onClose={() => setNewInvoiceModalOpen(false)}
          onSave={(payload) => {
            const apiPayload = {
              projectId: Number(payload.project_id),
              clientId: Number(payload.client_id),
              invoiceDate: payload.invoice_date,
              dueDate: payload.due_date,
              invoiceTitle: payload.invoice_title,
              billingContact: payload.billing_contact,
              reference: payload.reference,
              description: payload.description,
              gst: Number(payload.gst),
              status: STATUS_BY_ACTION[payload.action] || "draft",
              invoiceItems: payload.invoice_items.map((item) => ({
                budgetId: item.budget_id,
                amount: Number(item.amount),
              })),
            };
            setCreateRequested(true);
            dispatch(invoiceAction.createInvoiceStart(apiPayload));
          }}
        />
      )}

      {/* Delete confirmation */}
      {deletePrompt && (
        <ConfirmDialog
          title="Delete Invoice"
          message={`Delete "${deletePrompt.xero_no || deletePrompt.invoice_title || "this invoice"}"? This cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeletePrompt(null)}
        />
      )}

      {/* Submit / Approve confirmation */}
      {actionPrompt?.action === "submit" && (
        <ConfirmDialog
          title="Submit Invoice"
          message="Submit this invoice for approval?"
          confirmLabel="Submit"
          variant="info"
          onConfirm={() => {
            const id = actionPrompt.invoice.id || actionPrompt.invoice.invoice_id || actionPrompt.invoice.invoiceId;
            dispatch(invoiceAction.submitInvoiceStart({ invoiceId: id }));
            setUpdateRequested(true);
            setActionPrompt(null);
          }}
          onCancel={() => setActionPrompt(null)}
        />
      )}

      {actionPrompt?.action === "approve" && (
        <ConfirmDialog
          title="Approve & Send Invoice"
          message={`Approve "${actionPrompt.invoice.xero_no || actionPrompt.invoice.invoice_title || "this invoice"}"? It will be sent to the client via Xero and you won't be able to make further changes.`}
          confirmLabel="Approve & Send"
          variant="success"
          onConfirm={() => {
            dispatch(invoiceAction.updateInvoiceStatusStart({
              invoiceId: actionPrompt.invoice.invoiceId,
              action:    "approve",
            }));
            setStatusUpdateRequested(true);
            setActionPrompt(null);
          }}
          onCancel={() => setActionPrompt(null)}
        />
      )}

    </div>
  );
};

export default InvoiceTable;
