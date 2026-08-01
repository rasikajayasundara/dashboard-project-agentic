import { Pill } from "./component.styles";

// Single source of truth for all status colors across the app.
// Add new statuses here — never create local badge color maps elsewhere.
const STATUS_MAP = {
  // ── Project / general ──────────────────────────────────────────────────────
  "Active":          { bg: "#DCFCE7", color: "#16a34a" },
  "Completed":       { bg: "#DCFCE7", color: "#166534" },
  "On Track":        { bg: "#DCFCE7", color: "#166534" },
  "On hold":         { bg: "#FEF3C7", color: "#92400E" },
  "On Hold":         { bg: "#FEF3C7", color: "#92400E" },
  "Late":            { bg: "#FEE2E2", color: "#991B1B" },
  "Planning":        { bg: "#DBEAF7", color: "#3796BF" },
  "Archived":        { bg: "#F3F4F6", color: "#6B7280" },

  // ── Employee / workload ────────────────────────────────────────────────────
  "On track":        { bg: "#DCFCE7", color: "#166534" },
  "Available":       { bg: "#DBEAFE", color: "#1E40AF" },
  "Overloaded":      { bg: "#FEE2E2", color: "#991B1B" },
  "Overrun":         { bg: "#FEF3C7", color: "#92400E" }, // prefix-matched below

  // ── Employee account status ───────────────────────────────────────────────
  "Resigned":        { bg: "#F3F4F6", color: "#6B7280" },
  "Blocked":         { bg: "#FEE2E2", color: "#991B1B" },

  // ── Client health ─────────────────────────────────────────────────────────
  "Good":            { bg: "#DCFCE7", color: "#16a34a" },
  "At Risk":         { bg: "#FEE2E2", color: "#991B1B" },
  "New":             { bg: "#DBEAF7", color: "#3796BF" },
  "Dormant":         { bg: "#F3F4F6", color: "#6B7280" },

  // ── Client tier ───────────────────────────────────────────────────────────
  "PLATINUM":        { bg: "#EDE9FE", color: "#6D28D9" },
  "GOLD":            { bg: "#FEF3C7", color: "#92400E" },
  "SILVER":          { bg: "#F3F4F6", color: "#374151" },
  "BRONZE":          { bg: "#FFEDD5", color: "#9A3412" },

  // ── Invoice approval ──────────────────────────────────────────────────────
  "Draft":           { bg: "#F3F4F6", color: "#6B7280" },
  "Submitted":       { bg: "#FEF9C3", color: "#92400E" },
  "Submitted for approval": { bg: "#FEF9C3", color: "#92400E" },
  "Approved":        { bg: "#DCFCE7", color: "#166534" },
  "Void":            { bg: "#F3F4F6", color: "#6B7280" },

  // ── Payment ───────────────────────────────────────────────────────────────
  "Paid":            { bg: "#DCFCE7", color: "#166534" },
  "Partially Paid":  { bg: "#EFF6FF", color: "#1D4ED8" },
  "Pending":         { bg: "#FEF9C3", color: "#92400E" },
  "Overdue":         { bg: "#FEE2E2", color: "#991B1B" },

  // ── Lead status ───────────────────────────────────────────────────────────
  "Lead":            { bg: "#DBEAF7", color: "#3796BF" },
  "Contributor":     { bg: "#F3F4F6", color: "#374151" },
  "Reviewer":        { bg: "#EDE9FE", color: "#6D28D9" },

  // ── Task priority ─────────────────────────────────────────────────────────
  "High":            { bg: "#FEE2E2", color: "#991B1B" },
  "Medium":          { bg: "#FEF3C7", color: "#92400E" },
  "Low":             { bg: "#F3F4F6", color: "#6B7280" },

  // ── Task status ───────────────────────────────────────────────────────────
  "Complete":        { bg: "#DCFCE7", color: "#166534" },
  "In Progress":     { bg: "#FEF9C3", color: "#92400E" },
  "Not Started":     { bg: "#F3F4F6", color: "#6B7280" },

  // ── Notifications ─────────────────────────────────────────────────────────
  "Unread":          { bg: "#DBEAF7", color: "#3796BF" },

  // ── Timesheet approval ─────────────────────────────────────────────────────
  "Pending Approval": { bg: "#FEF3C7", color: "#92400E" },
  "Rejected":          { bg: "#FEE2E2", color: "#991B1B" },
  // "Approved" already defined above (Invoice approval section) — reused as-is.

  // ── Expense type ──────────────────────────────────────────────────────────
  "Mileage":         { bg: "#DBEAF7", color: "#3796BF" },
  "Cost":            { bg: "#FFEDD5", color: "#9A3412" },
};

const DEFAULT = { bg: "#F3F4F6", color: "#6B7280" };

export default function StatusBadge({ status }) {
  const key = typeof status === "string" && status.startsWith("Overrun") ? "Overrun" : status;
  const { bg, color } = STATUS_MAP[key] || DEFAULT;
  return <Pill $bg={bg} $color={color}>{status}</Pill>;
}
