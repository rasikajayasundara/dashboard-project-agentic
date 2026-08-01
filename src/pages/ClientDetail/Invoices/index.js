import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../../components/DataTable";
import FilterBar from "../../../components/FilterBar";
import { formatCurrency, formatDateOnly } from "../../../utils/format";
import { invoiceAction } from "../../../store/invoiceSlice";
import InvoiceDetail from "../../Invoices/modals/InvoiceDetail";

// ── Column definitions ────────────────────────────────────────────────────────

const INVOICE_COLUMNS = [
  { key: "invoice",  label: "#",        sortable: true,  index: 0 },
  { key: "project",  label: "Project",  sortable: true,  index: 1 },
  { key: "location", label: "Location", sortable: true,  index: 2 },
  { key: "issued",   label: "Issued",   sortable: true,  index: 3 },
  { key: "due",      label: "Due",      sortable: true,  index: 4 },
  { key: "amount",   label: "Amount",   sortable: true,  index: 5 },
  { key: "status",   label: "Status",   sortable: false, index: 6 },
];

const STATUS_FILTER = {
  key: "status",
  label: "Status",
  icon: "bi-circle-half",
  options: [
    { value: "Paid",    label: "Paid"    },
    { value: "Pending", label: "Pending" },
    { value: "Overdue", label: "Overdue" },
  ],
};

// ── Data converter ────────────────────────────────────────────────────────────

function toTableData(invoices) {
  return invoices.map((inv) => ({
    rowId: inv.invoiceId,
    row: [
      { value: inv.invoiceNo,                 type: "text"  },
      { value: inv.projectNo + ` - ` + inv.projectName, type: "text"  },
      { value: inv.location,                   type: "text"  },
      { value: formatDateOnly(inv.invoiceDate), type: "text"  },
      { value: formatDateOnly(inv.dueDate),     type: "text"  },
      { value: inv.amount ? formatCurrency(inv.amount) : "", type: "text" },
      { value: inv.status,              type: "badge" },
    ],
  }));
}

// Maps the real GET /invoices/{invoiceId} response onto the snake_case
// shape InvoiceDetail.js expects (it's shared with ProjectDetail's invoice
// table, so it isn't changed to read camelCase directly).
function mapInvoiceDetail(data) {
  return {
    xero_no:         data.invoiceNo,
    invoice_title:   data.invoiceTitle,
    project_name:    data.projectName,
    project_no:          data.projectNo,
    client_name:     data.clientName,
    billing_contact: data.billingContact,
    invoice_date:    data.invoiceDate,
    due_date:        data.dueDate,
    reference:       data.reference,
    description:     data.description,
    status:          data.status,
    paid_full:       data.paidFull,
    payment_status_label: data.paymentStatus,
    amount:          data.amount,
    sub_total:       data.subTotal,
    total:           data.total,
    gst:             data.gst,
    invoice_items: (data.invoiceItems || []).map((item) => ({
      budget_name: item.budgetName,
      budget_id:   item.budgetId,
      amount:      item.amount,
    })),
    payment_history: (data.payments || []).map((p) => ({
      date:   p.date,
      amount: p.amount,
    })),
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ClientInvoices() {
  const dispatch = useDispatch();
  // Fetched once by the parent ClientDetail page and shared across all three
  // tabs — this tab only reads the already-loaded state.
  const { clientInvoices: invoices } = useSelector((state) => state.clients);
  const { invoiceDetail, isLoadingInvoiceDetail } = useSelector((state) => state.invoiceDetail);

  const [search,        setSearch]        = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const handleFilterChange = (key, value) =>
    setActiveFilters((prev) => ({ ...prev, [key]: value }));

  const handleRowClick = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    dispatch(invoiceAction.invoiceDetailStart(invoiceId));
  };

  const handleCloseDetail = () => {
    setSelectedInvoiceId(null);
    dispatch(invoiceAction.clearInvoiceDetail());
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return invoices.filter((inv) => {
      if (activeFilters.status && inv.status !== activeFilters.status) return false;
      if (!term) return true;
      return (
        String(inv.invoiceNo ?? "").toLowerCase().includes(term) ||
        (inv.projectName || "").toLowerCase().includes(term)
      );
    });
  }, [invoices, search, activeFilters]);

  const tableData = useMemo(() => toTableData(filtered), [filtered]);

  return (
    <>
      <DataTable
        columns={INVOICE_COLUMNS}
        data={tableData}
        onClickRow={handleRowClick}
        hideActionCol
        filterBarSlot={
          <FilterBar
            filters={[STATUS_FILTER]}
            searchPlaceholder="Search invoices…"
            searchValue={search}
            onSearchChange={setSearch}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />
        }
      />

      {selectedInvoiceId && isLoadingInvoiceDetail && (
        <div
          style={{
            position: "fixed", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.2)", zIndex: 1000,
          }}
        >
          <div className="spinner-border text-light" role="status" />
        </div>
      )}

      {selectedInvoiceId && !isLoadingInvoiceDetail && invoiceDetail?.invoiceId && (
        <InvoiceDetail invoice={mapInvoiceDetail(invoiceDetail)} onClose={handleCloseDetail} />
      )}
    </>
  );
}
