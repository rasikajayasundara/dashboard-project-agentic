import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { colors } from "../../constants/common";
import Layout from "../../components/Layout";
import Card from "../../components/Card";
import StatCard from "../../components/Statcard";
import { StatsGrid } from "../../components/Statcard/component.styles";
import { TabBarContainer, TabButton, TabBadge } from "../../components/TabBar";
import FilterBar from "../../components/FilterBar";
import ConfirmDialog from "../../components/ConfirmDialog";
import ApprovalsTable from "./ApprovalsTable";
import { timesheetApprovalsAction } from "../../store/timesheetApprovalsSlice";
import {
  PageWrapper, PageHeader, TitleRow, Title, TitleBadge, Subtitle,
  ToolbarWrapper,
} from "./component.styles";

// Local, page-only styled bit (loading state) — mirrors the pattern already
// used by src/pages/Projects/index.js for the same purpose.
const LoadingWrapper = styled.div`
  display: flex; justify-content: center; align-items: center; height: 40vh;
`;

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { key: "all",      label: "All" },
  { key: "pending",  label: "Pending Approval" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const matchesTab = (record, tab) => {
  if (tab === "all") return true;
  if (tab === "pending") return record.status === "Pending Approval";
  if (tab === "approved") return record.status === "Approved";
  if (tab === "rejected") return record.status === "Rejected";
  return true;
};

const getTabCount = (records, tab) => records.filter((r) => matchesTab(r, tab)).length;

// ── Week date-range filtering ────────────────────────────────────────────────
const MONTH_IDX = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

// Resolves a week label to the ISO date of its first (Monday) day, so it can
// be compared against a FilterBar dateRange value.
//
// Real API format (from timesheetName) is an UNSPACED en-dash range with the
// month appearing once, at the end — e.g. "13–19 Jul 2026", "9–15 Mar 2026".
// A cross-month week may repeat the month on the start side too, e.g.
// "29 Jun–5 Jul 2026" — handled defensively below. Returns null (rather than
// throwing) if the label doesn't match the expected pattern.
function weekStartISO(weekLabel) {
  if (typeof weekLabel !== "string") return null;

  // The trailing "Mon YYYY" is always present at the end of the label.
  const trailingMatch = weekLabel.match(/([A-Za-z]{3})\s+(\d{4})\s*$/);
  if (!trailingMatch) return null;

  const [fullTrailingMatch, endMonthAbbr, yearStr] = trailingMatch;
  const endMonth = MONTH_IDX[endMonthAbbr];
  if (endMonth === undefined) return null;

  // Whatever precedes the trailing "Mon YYYY" holds the day range, e.g.
  // "13–19" or "29 Jun–5" (cross-month case).
  const rangePart = weekLabel.slice(0, weekLabel.length - fullTrailingMatch.length).trim();
  if (!rangePart) return null;

  const [startToken] = rangePart.split(/[–-]/);
  if (!startToken) return null;

  const startTokens = startToken.trim().split(/\s+/);
  const startDay = parseInt(startTokens[0], 10);
  if (!Number.isFinite(startDay)) return null;

  const startMonthAbbr = startTokens.length > 1 ? startTokens[1] : endMonthAbbr;
  const startMonth = MONTH_IDX[startMonthAbbr];
  if (startMonth === undefined) return null;

  const year = parseInt(yearStr, 10);
  if (!Number.isFinite(year)) return null;
  const startYear = startMonth > endMonth ? year - 1 : year;

  const m = String(startMonth + 1).padStart(2, "0");
  const d = String(startDay).padStart(2, "0");
  return `${startYear}-${m}-${d}`;
}

const weekInDateRange = (record, range) => {
  if (!range || (!range.from && !range.to)) return true;
  const start = weekStartISO(record.weekLabel);
  // Unparseable label — don't let the week filter exclude the record.
  if (!start) return true;
  if (range.from && start < range.from) return false;
  if (range.to && start > range.to) return false;
  return true;
};

export default function TimesheetApprovals() {
  const dispatch = useDispatch();
  const records   = useSelector((state) => state.timesheetApprovals.records);
  const stats     = useSelector((state) => state.timesheetApprovals.stats);
  const isLoading = useSelector((state) => state.timesheetApprovals.isLoading);

  const [activeTab, setActiveTab]         = useState("all");
  const [search, setSearch]               = useState("");
  const [activeFilters, setActiveFilters] = useState({});

  // { id, action: "approve" | "reject" } | null — drives the ConfirmDialog gate.
  const [reviewAction, setReviewAction]   = useState(null);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    dispatch(timesheetApprovalsAction.getForReviewStart());
  }, [dispatch]);

  const handleFilterChange = (key, value) =>
    setActiveFilters((prev) => ({ ...prev, [key]: value }));

  const handleApprove = (id) => {
    setReviewAction({ id, action: "approve" });
    setReviewComment("");
  };

  const handleReject = (id) => {
    setReviewAction({ id, action: "reject" });
    setReviewComment("");
  };

  const handleReviewCancel = () => {
    setReviewAction(null);
    setReviewComment("");
  };

  const handleReviewConfirm = () => {
    if (!reviewAction) return;
    if (reviewAction.action === "reject" && !reviewComment.trim()) return;
    dispatch(timesheetApprovalsAction.reviewTimesheetStart({
      timesheetId: reviewAction.id,
      action: reviewAction.action,
      comment: reviewComment,
    }));
    setReviewAction(null);
    setReviewComment("");
  };

  const reviewRecord = useMemo(
    () => (reviewAction ? records.find((r) => r.id === reviewAction.id) : null),
    [reviewAction, records]
  );

  const employeeOptions = useMemo(() => {
    const names = new Set(records.map((r) => r.employeeName));
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [records]);

  const FILTERS = useMemo(() => [
    {
      key: "employee",
      label: "Employee",
      icon: "bi-person",
      options: employeeOptions.map((n) => ({ value: n, label: n })),
    },
    {
      key: "week",
      label: "Week",
      icon: "bi-calendar-range",
      type: "dateRange",
    },
  ], [employeeOptions]);

  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase();
    return records.filter((r) => {
      if (!matchesTab(r, activeTab)) return false;
      if (activeFilters.employee && r.employeeName !== activeFilters.employee) return false;
      if (!weekInDateRange(r, activeFilters.week)) return false;
      if (!term) return true;
      return r.employeeName.toLowerCase().includes(term);
    });
  }, [records, activeTab, search, activeFilters]);

  const totalSubmitted = stats.totalSubmitted;
  const pendingCount   = stats.pendingApproval;
  const approvedCount  = stats.approved;
  const rejectedCount  = stats.rejected;

  return (
    <Layout>
      <PageWrapper>
        <PageHeader>
          <TitleRow>
            <Title>
              Timesheet Approvals
              <TitleBadge>{totalSubmitted} submitted</TitleBadge>
            </Title>
            <Subtitle>Review and approve time your team has submitted this period</Subtitle>
          </TitleRow>
        </PageHeader>

        <StatsGrid>
          <StatCard
            index={0}
            label="Total Submitted"
            value={String(totalSubmitted)}
            icon={<i className="bi bi-clipboard-check" />}
            iconColor={colors.accentBlue}
          />
          <StatCard
            index={1}
            label="Pending Approval"
            value={String(pendingCount)}
            icon={<i className="bi bi-hourglass-split" />}
            iconColor={colors.accentAmber}
          />
          <StatCard
            index={2}
            label="Approved"
            value={String(approvedCount)}
            icon={<i className="bi bi-check-circle" />}
            iconColor={colors.accentGreen}
          />
          <StatCard
            index={3}
            label="Rejected"
            value={String(rejectedCount)}
            icon={<i className="bi bi-x-circle" />}
            iconColor={colors.accentRed}
          />
        </StatsGrid>

        <ToolbarWrapper>
          <Card
            content={
              <>
                <TabBarContainer>
                  {TABS.map((t) => (
                    <TabButton key={t.key} $active={activeTab === t.key} onClick={() => setActiveTab(t.key)}>
                      {t.label}
                      <TabBadge $active={activeTab === t.key}>{getTabCount(records, t.key)}</TabBadge>
                    </TabButton>
                  ))}
                </TabBarContainer>
                <FilterBar
                  filters={FILTERS}
                  searchPlaceholder="Search by employee name..."
                  searchValue={search}
                  onSearchChange={setSearch}
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                />
              </>
            }
          />
        </ToolbarWrapper>

        {isLoading && records.length === 0 ? (
          <LoadingWrapper>
            <div className="spinner-border text-secondary" role="status" />
          </LoadingWrapper>
        ) : (
          <ApprovalsTable
            records={filteredRecords}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}

        {reviewAction && (
          <ConfirmDialog
            title={reviewAction.action === "approve" ? "Approve timesheet?" : "Reject timesheet?"}
            message={
              reviewAction.action === "approve"
                ? `Approve ${reviewRecord?.employeeName ?? "this employee"}'s timesheet for ${reviewRecord?.weekLabel ?? "this week"}.`
                : `Reject ${reviewRecord?.employeeName ?? "this employee"}'s timesheet for ${reviewRecord?.weekLabel ?? "this week"}.`
            }
            variant={reviewAction.action === "approve" ? "success" : "danger"}
            confirmLabel={reviewAction.action === "approve" ? "Approve" : "Reject"}
            showComment
            commentValue={reviewComment}
            onCommentChange={setReviewComment}
            commentPlaceholder={reviewAction.action === "approve" ? "Add a comment (optional)..." : "Reason for rejection..."}
            commentRequired={reviewAction.action === "reject"}
            onConfirm={handleReviewConfirm}
            onCancel={handleReviewCancel}
          />
        )}
      </PageWrapper>
    </Layout>
  );
}
