import { Document, Page, View, Text, StyleSheet, Image } from "@react-pdf/renderer";
import { getInvoicePaymentNote, getInvoicePaymentState } from "../invoicePaymentNote";


const BLUE      = "#3796BF";
const BLUE_DARK = "#2d7eaa";

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

const fmt = (v) =>
  "$" + Number(v || 0).toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const s = StyleSheet.create({
  page: {
    fontFamily:      "Helvetica",
    fontSize:        10,
    color:           "#111827",
    backgroundColor: "#ffffff",
    flexDirection:   "column",
  },

  // ── Blue header ─────────────────────────────────────────────────────────────
  header: {
    backgroundColor: BLUE_DARK,
    padding:         "14 24 16 24",
    flexDirection:   "row",
    justifyContent:  "space-between",
    alignItems:      "flex-start",
  },
  logo: {
    width:        120,
    marginBottom: 8,
  },
  companyName: {
    fontSize:     12,
    fontFamily:   "Helvetica-Bold",
    color:        "#ffffff",
    marginBottom: 5,
  },
  companyMeta: {
    fontSize:     8,
    color:        "rgba(255,255,255,0.82)",
    marginBottom: 2,
  },
  badgeBlock: {
    flexDirection: "column",
    alignItems:    "flex-end",
  },
  invoiceWord: {
    fontSize:      20,
    color:         "rgba(255,255,255,0.88)",
    letterSpacing: 5,
    marginBottom:  6,
  },
  invoiceNumber: {
    fontSize:     10,
    fontFamily:   "Helvetica-Bold",
    color:        "#ffffff",
    marginBottom: 5,
  },
  statusPill: {
    fontSize:        7,
    fontFamily:      "Helvetica-Bold",
    borderRadius:    99,
    paddingVertical: 3,
    paddingLeft:     8,
    paddingRight:    8,
    textTransform:   "uppercase",
    letterSpacing:   0.5,
  },

  // ── Body ────────────────────────────────────────────────────────────────────
  body: {
    flex:          1,
    padding:       "20 28",
    flexDirection: "column",
  },

  // Bill row
  billRow: {
    flexDirection:  "row",
    marginBottom:   18,
  },
  billToBlock: {
    flex:          1,
    paddingRight:  20,
    flexDirection: "column",
  },
  sectionLabel: {
    fontSize:     7,
    fontFamily:   "Helvetica-Bold",
    color:        "#9ca3af",
    letterSpacing:1,
    marginBottom: 5,
  },
  clientName: {
    fontSize:     14,
    fontFamily:   "Helvetica-Bold",
    color:        "#111827",
    marginBottom: 3,
  },
  clientContact: {
    fontSize:     9,
    color:        "#6b7280",
    marginBottom: 2,
  },
  invoiceTitleNote: {
    fontSize:   8,
    color:      "#9ca3af",
    marginTop:  4,
  },

  // Meta card
  metaBlock: {
    width:       190,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius:8,
  },
  metaItem: {
    flexDirection:    "row",
    justifyContent:   "space-between",
    alignItems:       "center",
    paddingVertical:  7,
    paddingLeft:      12,
    paddingRight:     12,
    borderBottomWidth:1,
    borderBottomColor:"#f3f4f6",
  },
  metaLabel: {
    fontSize:  7,
    fontFamily:"Helvetica-Bold",
    color:     "#9ca3af",
  },
  metaValue: {
    fontSize:  8,
    fontFamily:"Helvetica-Bold",
    color:     "#111827",
  },
  metaValueOverdue: {
    fontSize:  8,
    fontFamily:"Helvetica-Bold",
    color:     "#ef4444",
  },

  // Description note
  descBlock: {
    backgroundColor: "#f8fafc",
    borderLeftWidth: 3,
    borderLeftColor: BLUE,
    borderRadius:    4,
    padding:         "9 14",
    marginBottom:    18,
  },
  descText: {
    fontSize:   9,
    color:      "#374151",
    lineHeight: 1.6,
  },

  // Line items
  itemsTable: {
    borderWidth:  1,
    borderColor:  "#e5e7eb",
    borderRadius: 8,
    marginBottom: 18,
  },
  itemsHead: {
    flexDirection:    "row",
    backgroundColor:  "#f9fafb",
    borderBottomWidth:1,
    borderBottomColor:"#e5e7eb",
    paddingVertical:  7,
    paddingLeft:      14,
    paddingRight:     14,
  },
  headCell: {
    fontSize:  7,
    fontFamily:"Helvetica-Bold",
    color:     "#9ca3af",
    letterSpacing: 0.4,
  },
  itemRow: {
    flexDirection:    "row",
    paddingVertical:  10,
    paddingLeft:      14,
    paddingRight:     14,
    borderBottomWidth:1,
    borderBottomColor:"#f3f4f6",
    alignItems:       "flex-start",
  },
  itemIndex: {
    width:     24,
    fontSize:  9,
    color:     "#d1d5db",
    fontFamily:"Helvetica-Bold",
  },
  itemDescWrap: {
    flex:          1,
    flexDirection: "column",
  },
  itemCode: {
    fontSize:        7,
    fontFamily:      "Helvetica-Bold",
    color:           BLUE,
    backgroundColor: "#eff6ff",
    borderRadius:    3,
    paddingVertical: 1,
    paddingLeft:     5,
    paddingRight:    5,
    alignSelf:       "flex-start",
    marginBottom:    3,
  },
  itemDesc: {
    fontSize:   9,
    color:      "#374151",
    lineHeight: 1.4,
  },
  itemAmount: {
    width:     90,
    fontSize:  9,
    fontFamily:"Helvetica-Bold",
    color:     "#111827",
    textAlign: "right",
  },

  // Totals
  totalsWrap: {
    width:         220,
    alignSelf:     "flex-end",
    flexDirection: "column",
    marginBottom:  6,
  },
  totalRow: {
    flexDirection:  "row",
    justifyContent: "space-between",
    marginBottom:   5,
  },
  totalLabel: { fontSize: 9, color: "#6b7280" },
  totalValue: { fontSize: 9, color: "#111827" },
  divider: {
    borderTopWidth: 1.5,
    borderTopColor: "#e5e7eb",
    marginVertical: 4,
  },
  grandBlock: {
    flexDirection:  "row",
    justifyContent: "space-between",
    alignItems:     "center",
    backgroundColor:BLUE_DARK,
    borderRadius:   8,
    paddingVertical:10,
    paddingLeft:    14,
    paddingRight:   14,
    marginTop:      4,
  },
  grandLabel: {
    fontSize:     8,
    fontFamily:   "Helvetica-Bold",
    color:        "rgba(255,255,255,0.85)",
    letterSpacing:0.5,
  },
  grandValue: {
    fontSize:  16,
    fontFamily:"Helvetica-Bold",
    color:     "#ffffff",
  },

  // Payment status note (paid / due)
  paymentNote: {
    marginTop:       16,
    borderRadius:    6,
    borderWidth:     1,
    paddingVertical: 8,
    paddingLeft:     12,
    paddingRight:    12,
    fontSize:        9,
    fontFamily:      "Helvetica-Bold",
  },
  paymentNotePaid: {
    borderColor:     "#bbf7d0",
    backgroundColor: "#f0fdf4",
    color:           "#166534",
  },
  paymentNoteDue: {
    borderColor:     "#fed7aa",
    backgroundColor: "#fff7ed",
    color:           "#c2410c",
  },

  // ── Footer ──────────────────────────────────────────────────────────────────
  footer: {
    backgroundColor: "#f9fafb",
    borderTopWidth:  1,
    borderTopColor:  "#e5e7eb",
    paddingVertical: 12,
    paddingLeft:     28,
    paddingRight:    28,
  },
  footerNote: {
    fontSize:     8,
    color:        "#6b7280",
    lineHeight:   1.6,
    marginBottom: 2,
  },

  // ── Payment Advice ───────────────────────────────────────────────────────────
  payAdvice: {
    borderTopWidth:  2,
    borderTopColor:  "#d1d5db",
    borderTopStyle:  "dashed",
    paddingVertical: 16,
    paddingLeft:     28,
    paddingRight:    28,
  },
  payAdviceTitle: {
    fontSize:     11,
    fontFamily:   "Helvetica-Bold",
    color:        "#111827",
    marginBottom: 12,
  },
  payAdviceGrid: {
    flexDirection: "row",
  },
  payAdviceLeft: {
    flex:          1,
    paddingRight:  24,
    flexDirection: "column",
  },
  payAdviceIntro: {
    fontSize:     8,
    color:        "#6b7280",
    lineHeight:   1.5,
    marginBottom: 6,
  },
  payAdviceAddress: {
    fontSize:  10,
    fontFamily:"Helvetica-Bold",
    color:     "#374151",
    lineHeight:1.6,
  },
  payAdviceRight: {
    flex: 1,
  },
  payFieldRow: {
    flexDirection:    "row",
    justifyContent:   "space-between",
    alignItems:       "center",
    paddingVertical:  5,
    borderBottomWidth:1,
    borderBottomColor:"#f3f4f6",
  },
  payFieldLabel: {
    fontSize:  7,
    fontFamily:"Helvetica-Bold",
    color:     "#6b7280",
    letterSpacing: 0.3,
  },
  payFieldValue: {
    fontSize:  9,
    fontFamily:"Helvetica-Bold",
    color:     "#111827",
  },
  paySignatureLine: {
    width:           110,
    borderBottomWidth:1.5,
    borderBottomColor:"#9ca3af",
    minHeight:       14,
  },
});

export default function InvoicePdfDocument({ invoice, company, logoSrc }) {
  const inv       = invoice || {};
  const { isFullyPaid, isPartialPaid } = getInvoicePaymentState(inv);
  const status = isFullyPaid
    ? { label: "Paid",           color: "#166534", bg: "#DCFCE7" }
    : isPartialPaid
    ? { label: "Partially Paid", color: "#1D4ED8", bg: "#EFF6FF" }
    : (STATUS_MAP[inv.status] || STATUS_MAP[0]);

  const subTotal = Number(inv.amount || inv.sub_total || 0);
  const gstRate  = Number(inv.gst || 0.15);
  const gstAmt   = subTotal * gstRate;
  const total    = Number(inv.total || subTotal + gstAmt);
  const gstPct   = Math.round(gstRate * 100);

  const items    = Array.isArray(inv.invoice_items)   ? inv.invoice_items   : [];
  const payments = Array.isArray(inv.payment_history) ? inv.payment_history : [];
  const isOverdue = !isFullyPaid && inv.due_date && new Date(inv.due_date) < new Date();
  const paymentNote = getInvoicePaymentNote({ dueDate: inv.due_date, isFullyPaid, isPartialPaid, payments });

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ── Blue header ─────────────────────────────────────────────────── */}
        <View style={s.header}>
          <View>
            {logoSrc && <Image src={logoSrc} style={s.logo} />}
            <Text style={s.companyMeta}>P: {company.phone}</Text>
            <Text style={s.companyMeta}>W: {company.website}</Text>
            <Text style={s.companyMeta}>GST # {company.gst}</Text>
          </View>

          <View style={s.badgeBlock}>
            <Text style={s.invoiceWord}>INVOICE</Text>
            <Text style={s.invoiceNumber}>{inv.xero_no || "DRAFT"}</Text>
            <Text style={[s.statusPill, { color: status.color, backgroundColor: status.bg }]}>
              {status.label}
            </Text>
          </View>
        </View>

        {/* ── Body ────────────────────────────────────────────────────────── */}
        <View style={s.body}>

          {/* Bill To + Meta */}
          <View style={s.billRow}>
            <View style={s.billToBlock}>
              <Text style={s.sectionLabel}>BILL TO</Text>
              <Text style={s.clientName}>{inv.client_name || "—"}</Text>
              {inv.billing_contact && (
                <Text style={s.clientContact}>{inv.billing_contact}</Text>
              )}
              {inv.invoice_title && (
                <Text style={s.invoiceTitleNote}>{inv.invoice_title}</Text>
              )}
            </View>

            <View style={s.metaBlock}>
              <View style={s.metaItem}>
                <Text style={s.metaLabel}>Invoice Date</Text>
                <Text style={s.metaValue}>{inv.invoice_date || "—"}</Text>
              </View>
              <View style={s.metaItem}>
                <Text style={s.metaLabel}>Due Date</Text>
                <Text style={isOverdue ? s.metaValueOverdue : s.metaValue}>
                  {inv.due_date || "—"}
                </Text>
              </View>
              <View style={s.metaItem}>
                <Text style={s.metaLabel}>Reference</Text>
                <Text style={s.metaValue}>{inv.reference || "—"}</Text>
              </View>
              <View style={[s.metaItem, { borderBottomWidth: 0 }]}>
                <Text style={s.metaLabel}>GST</Text>
                <Text style={s.metaValue}>{gstPct}%</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          {inv.description ? (
            <View style={s.descBlock}>
              <Text style={s.descText}>{inv.description}</Text>
            </View>
          ) : null}

          {/* Line items */}
          <View style={s.itemsTable}>
            <View style={s.itemsHead}>
              <Text style={[s.headCell, { width: 24 }]}>#</Text>
              <Text style={[s.headCell, { flex: 1 }]}>DESCRIPTION</Text>
              <Text style={[s.headCell, { width: 90, textAlign: "right" }]}>AMOUNT (NZD)</Text>
            </View>

            {items.length > 0 ? items.map((item, i) => (
              <View key={i} style={[s.itemRow, i === items.length - 1 && { borderBottomWidth: 0 }]}>
                <Text style={s.itemIndex}>{String(i + 1).padStart(2, "0")}</Text>
                <View style={s.itemDescWrap}>
                  {item.budget_code ? (
                    <Text style={s.itemCode}>{item.budget_code}</Text>
                  ) : null}
                  <Text style={s.itemDesc}>{item.description || item.budget_name || "—"}</Text>
                </View>
                <Text style={s.itemAmount}>{fmt(item.amount)}</Text>
              </View>
            )) : (
              <View style={[s.itemRow, { borderBottomWidth: 0 }]}>
                <Text style={s.itemIndex}>—</Text>
                <View style={s.itemDescWrap}>
                  <Text style={[s.itemDesc, { color: "#9ca3af" }]}>No line items</Text>
                </View>
                <Text style={s.itemAmount}>—</Text>
              </View>
            )}
          </View>

          {/* Totals */}
          <View style={s.totalsWrap}>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Sub Total</Text>
              <Text style={s.totalValue}>{fmt(subTotal)}</Text>
            </View>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>GST {gstPct}%</Text>
              <Text style={s.totalValue}>{fmt(gstAmt)}</Text>
            </View>
            <View style={s.divider} />
            <View style={s.grandBlock}>
              <Text style={s.grandLabel}>TOTAL (NZD)</Text>
              <Text style={s.grandValue}>{fmt(total)}</Text>
            </View>
          </View>

          {paymentNote && (
            <Text style={[s.paymentNote, paymentNote.variant === "paid" ? s.paymentNotePaid : s.paymentNoteDue]}>
              {paymentNote.text}
            </Text>
          )}

        </View>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <View style={s.footer}>
          <Text style={s.footerNote}>
            Please use the ref {inv.reference || inv.xero_no || "—"} when making payment. Thank you.
          </Text>
          <Text style={s.footerNote}>
            Bank Account Number — {company.bank}
          </Text>
          <Text style={s.footerNote}>
            A late payment fee of 2% per month from the date of the invoice will be added to overdue accounts.
          </Text>
          <Text style={s.footerNote}>
            Prior or Upon Collection of Documents. All reports remain property of {company.name} until paid for in full.
          </Text>
        </View>

        {/* ── Payment Advice ───────────────────────────────────────────────── */}
        <View style={s.payAdvice}>
          <Text style={s.payAdviceTitle}>Payment Advice</Text>
          <View style={s.payAdviceGrid}>
            <View style={s.payAdviceLeft}>
              <Text style={s.payAdviceIntro}>
                Please detach this portion and return with your payment to:
              </Text>
              <Text style={s.payAdviceAddress}>
                {company.name}{"\n"}{company.address}
              </Text>
            </View>

            <View style={s.payAdviceRight}>
              <View style={s.payFieldRow}>
                <Text style={s.payFieldLabel}>Invoice No</Text>
                <Text style={s.payFieldValue}>{inv.xero_no || "DRAFT"}</Text>
              </View>
              <View style={s.payFieldRow}>
                <Text style={s.payFieldLabel}>Amount Due</Text>
                <Text style={s.payFieldValue}>{fmt(total)}</Text>
              </View>
              <View style={s.payFieldRow}>
                <Text style={s.payFieldLabel}>Due Date</Text>
                <Text style={s.payFieldValue}>{inv.due_date || "—"}</Text>
              </View>
              <View style={[s.payFieldRow, { borderBottomWidth: 0 }]}>
                <Text style={s.payFieldLabel}>Amount Paid</Text>
                <View style={s.paySignatureLine} />
              </View>
            </View>
          </View>
        </View>

      </Page>
    </Document>
  );
}
