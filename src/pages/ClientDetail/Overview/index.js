import { useMemo } from "react";
import { useSelector } from "react-redux";
import { colors } from "../../../constants/common";
import DonutChart from "../../../components/DonutChart";
import Progressbar from "../../../components/Progressbar";
import { formatCurrency, formatDateOnly } from "../../../utils/format";
import {
  TopGrid, BottomGrid,
  Panel, PanelTitle, PanelHeaderRow, PanelHeaderMeta,
  DonutRow, DonutSide, LegendSide, LegendRow, LegendDot, LegendLabel, LegendAmount,
  CompletionRow, CompletionName, CompletionPct, ProgressWrap,
  MiniColHeader, ColHeadCell, MiniRow, MiniCell, StatusPill,
} from "./component.styles";

// status: 1=Ongoing, 2=Completed, 3=Archived, 4=On Hold (confirmed by backend)
const STATUS_LABELS = { 1: "Ongoing", 2: "Completed", 3: "Archived", 4: "On Hold" };
const mapStatus = (status) => STATUS_LABELS[status] ?? "";

// Project status badge colours
const PROJECT_STATUS_STYLES = {
  Ongoing:     { bg: "#DCFCE7", text: "#166534" },
  Completed:   { bg: "#F3F4F6", text: "#374151" },
  Archived:    { bg: "#E5E7EB", text: "#4B5563" },
  "On Hold":   { bg: "#FEF3C7", text: "#92400E" },
};

// Invoice status badge colours
const INVOICE_STATUS_STYLES = {
  Paid:                       { bg: "#DCFCE7", text: "#166534" },
  Pending:                    { bg: "#FEF3C7", text: "#92400E" },
  Overdue:                    { bg: "#FEE2E2", text: "#991B1B" },
  Draft:                      { bg: "#F3F4F6", text: "#374151" },
  "Submitted for approval":   { bg: "#DBEAFE", text: "#1E40AF" },
  Void:                       { bg: "#E5E7EB", text: "#6B7280" },
};

// per-project completion % — guard div by zero, cap at 100
const projectPct = (p) => {
  if (!p.totalBudget || p.totalBudget <= 0) return 0;
  return Math.min(100, Math.round((p.totalBurnt / p.totalBudget) * 100));
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ClientOverview() {
  // Projects/invoices are fetched once by the parent ClientDetail page and
  // shared across all three tabs — this tab only reads the already-loaded state.
  const { clientProjects: projects, clientInvoices: invoices } = useSelector((state) => state.clients);

  // Project completion panel: avg %, done count, active count
  const completionStats = useMemo(() => {
    const pcts = projects.map(projectPct);
    const avg = pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : 0;
    const done = projects.filter((p) => p.status === 2).length;
    const active = projects.filter((p) => p.status === 1).length;
    return { avg, done, active };
  }, [projects]);

  // Invoices mini panel only ever lists strict Pending invoices (Draft/Submitted
  // for approval/Void/Paid/Overdue are hidden here — those are visible on the
  // full Invoices tab instead).
  const pendingInvoices = useMemo(
    () => invoices.filter((inv) => inv.status === "Pending"),
    [invoices]
  );

  // Invoices donut + legend: strict Paid / Pending / Overdue buckets only, so
  // the ring and legend reconcile to each other (Draft/Submitted for
  // approval/Void are excluded from this panel entirely).
  const invoiceSummary = useMemo(() => {
    const sumBy = (status) =>
      invoices
        .filter((inv) => inv.status === status)
        .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
    const paid = sumBy("Paid");
    const overdue = sumBy("Overdue");
    const pending = sumBy("Pending");
    const total = paid + overdue + pending;
    const percent = total > 0 ? Math.round((paid / total) * 100) : 0;
    return { total, paid, overdue, pending, percent };
  }, [invoices]);

  return (
    <>
      {/* ── Top row: 2 equal panels ───────────────────────────────────────── */}
      <TopGrid>
        {/* Panel 1 — Invoices donut */}
        <Panel>
          <PanelTitle>Invoices</PanelTitle>
          <DonutRow>
            <DonutSide>
              <DonutChart
                percent={invoiceSummary.percent}
                size={130}
                strokeWidth={12}
                spentColor="#22c55e"
                remainingColor="#e5e7eb"
                label={`of ${formatCurrency(invoiceSummary.total)}`}
              />
            </DonutSide>
            <LegendSide>
              <LegendRow>
                <LegendDot $color="#22c55e" />
                <LegendLabel>Paid</LegendLabel>
                <LegendAmount>{formatCurrency(invoiceSummary.paid)}</LegendAmount>
              </LegendRow>
              <LegendRow>
                <LegendDot $color="#f59e0b" />
                <LegendLabel>Pending</LegendLabel>
                <LegendAmount>{formatCurrency(invoiceSummary.pending)}</LegendAmount>
              </LegendRow>
              <LegendRow $last>
                <LegendDot $color="#ef4444" />
                <LegendLabel>Overdue</LegendLabel>
                <LegendAmount>{formatCurrency(invoiceSummary.overdue)}</LegendAmount>
              </LegendRow>
            </LegendSide>
          </DonutRow>
        </Panel>

        {/* Panel 2 — Project completion */}
        <Panel>
          <PanelHeaderRow>
            <PanelTitle style={{ margin: 0 }}>Project completion</PanelTitle>
            <PanelHeaderMeta>{`avg ${completionStats.avg}% · ${completionStats.done} done · ${completionStats.active} active`}</PanelHeaderMeta>
          </PanelHeaderRow>
          {projects.map((p, i) => (
            <CompletionRow key={p.projectId} $last={i === projects.length - 1}>
              <CompletionName title={p.projectName}>{p.projectName}</CompletionName>
              <ProgressWrap>
                <Progressbar value={projectPct(p)} height={6} showLabel={false} />
              </ProgressWrap>
              <CompletionPct>{projectPct(p)}%</CompletionPct>
            </CompletionRow>
          ))}
        </Panel>
      </TopGrid>

      {/* ── Bottom row: 2 panels side by side ────────────────────────────── */}
      <BottomGrid>
        {/* Bottom Panel 1 — Projects mini list */}
        <Panel>
          <PanelHeaderRow>
            <PanelTitle style={{ margin: 0 }}>{`Projects (${projects.length})`}</PanelTitle>
          </PanelHeaderRow>

          <MiniColHeader>
            <ColHeadCell $flex={2}>Project</ColHeadCell>
            <ColHeadCell $flex={1}>Status</ColHeadCell>
            <ColHeadCell $flex={1.5}>Progress</ColHeadCell>
            <ColHeadCell $flex={1}>Budget</ColHeadCell>
            <ColHeadCell $flex={1}>Deadline</ColHeadCell>
          </MiniColHeader>

          {projects.map((p, i) => {
            const status = mapStatus(p.status);
            const statusStyle = PROJECT_STATUS_STYLES[status] || { bg: "#F3F4F6", text: "#374151" };
            return (
              <MiniRow key={p.projectId} $last={i === projects.length - 1}>
                <MiniCell $flex={2} $clip title={p.projectName}>{p.projectName}</MiniCell>
                <StatusPill $flex={1} $bg={statusStyle.bg} $text={statusStyle.text}>
                  {status}
                </StatusPill>
                <ProgressWrap style={{ flex: 1.5 }}>
                  <Progressbar value={projectPct(p)} height={4} showLabel={false} />
                </ProgressWrap>
                <MiniCell $flex={1} $color={colors.textSecondary}>{p.totalBudget != null ? formatCurrency(p.totalBudget) : ""}</MiniCell>
                <MiniCell $flex={1} $color={colors.textMuted}>{formatDateOnly(p.endDate)}</MiniCell>
              </MiniRow>
            );
          })}
        </Panel>

        {/* Bottom Panel 2 — Invoices mini list */}
        <Panel>
          <PanelHeaderRow>
            <PanelTitle style={{ margin: 0 }}>{`Invoices (${pendingInvoices.length})`}</PanelTitle>
          </PanelHeaderRow>

          <MiniColHeader>
            <ColHeadCell $flex={1}>#</ColHeadCell>
            <ColHeadCell $flex={2}>Project</ColHeadCell>
            <ColHeadCell $flex={1.5}>Issued</ColHeadCell>
            <ColHeadCell $flex={1.5}>Due</ColHeadCell>
            <ColHeadCell $flex={1}>Amount</ColHeadCell>
            <ColHeadCell $flex={1}>Status</ColHeadCell>
          </MiniColHeader>

          {pendingInvoices.map((inv, i) => {
            const statusStyle = INVOICE_STATUS_STYLES[inv.status] || { bg: "#F3F4F6", text: "#374151" };
            const dueColor = inv.status === "Overdue" ? "#ef4444" : colors.textMuted;
            return (
              <MiniRow key={inv.invoiceId} $last={i === pendingInvoices.length - 1}>
                <MiniCell $flex={1} $color={colors.textMuted}>{inv.invoiceNo}</MiniCell>
                <MiniCell $flex={2} $clip title={inv.projectName}>{inv.projectName}</MiniCell>
                <MiniCell $flex={1.5} $color={colors.textMuted}>{formatDateOnly(inv.invoiceDate)}</MiniCell>
                <MiniCell $flex={1.5} $color={dueColor}>{formatDateOnly(inv.dueDate)}</MiniCell>
                <MiniCell $flex={1} $bold>{inv.amount != null ? formatCurrency(inv.amount) : ""}</MiniCell>
                <StatusPill $flex={1} $bg={statusStyle.bg} $text={statusStyle.text}>
                  {inv.status}
                </StatusPill>
              </MiniRow>
            );
          })}
        </Panel>
      </BottomGrid>
    </>
  );
}
