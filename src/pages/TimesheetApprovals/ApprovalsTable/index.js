import { useState } from "react";
import { colors, AVATAR_PALETTES } from "../../../constants/common";
import StatusBadge from "../../../components/StatusBadge";
import PermissionGate from "../../../components/PermissionGate";
import {
  TableWrapper, TableScrollWrapper, HeaderRow, HeaderCell,
  Row, EmployeeCell, ChevronIcon, AvatarCircle, EmployeeMeta, EmployeeName, EmployeeRole,
  WeekLabel, HoursCell, StatusCell,
  ActionsCell, ApproveBtn, RejectBtn, ReviewedText,
  EntriesWrapper, ReasonBanner, ReasonText,
  DateGroup, DateGroupHeader, DateLabel, DayInfoText,
  EntriesBox, EntryCard, EntryAccent, EntryBody,
  EntryProject, EntryProjectNo, EntryMeta,
  EntryRight, EntryTopRow, EntryHours, EntryComment,
  EmptyEntries,
} from "./component.styles";

const ACCENT_COLORS = [colors.accentBlue, colors.accentGreen, colors.accentAmber, colors.accentRed, colors.accentOrange];

const getAccent = (projectNo = "") => {
  const code = [...projectNo].reduce((a, c) => a + c.charCodeAt(0), 0);
  return ACCENT_COLORS[code % ACCENT_COLORS.length];
};

const getPalette = (name = "") =>
  AVATAR_PALETTES[name.charCodeAt(0) % AVATAR_PALETTES.length];

const getInitials = (name = "") =>
  name.trim().split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

function groupByDate(entries = []) {
  const map = new Map();
  entries.forEach((e) => {
    if (!map.has(e.date)) map.set(e.date, []);
    map.get(e.date).push(e);
  });
  return [...map.entries()].map(([date, items]) => ({
    date,
    items,
    totalHours: items.reduce((sum, e) => sum + e.hours, 0),
  }));
}

function EntryItem({ entry }) {
  return (
    <EntryCard>
      <EntryAccent $color={getAccent(entry.projectNo)} />
      <EntryBody>
        <EntryProject>
          <EntryProjectNo>{entry.projectNo} · {entry.projectName}</EntryProjectNo>
          {entry.taskName && <EntryMeta>{entry.taskName}</EntryMeta>}
        </EntryProject>
        <EntryRight>
          <EntryTopRow>
            <EntryHours>{entry.hours}h</EntryHours>
          </EntryTopRow>
          {entry.comment && <EntryComment>"{entry.comment}"</EntryComment>}
        </EntryRight>
      </EntryBody>
    </EntryCard>
  );
}

function DateGroupItem({ group }) {
  return (
    <DateGroup>
      <DateGroupHeader>
        <DateLabel>{group.date}</DateLabel>
        <DayInfoText>{group.items.length} task{group.items.length !== 1 ? "s" : ""} · {group.totalHours}h</DayInfoText>
      </DateGroupHeader>
      <EntriesBox>
        {group.items.map((entry) => <EntryItem key={entry.id} entry={entry} />)}
      </EntriesBox>
    </DateGroup>
  );
}

function TimesheetRow({ record, open, onToggle, onApprove, onReject }) {
  const palette = getPalette(record.employeeName);
  const isPending = record.status === "Pending Approval";
  const dateGroups = groupByDate(record.entries);

  return (
    <>
      <Row onClick={() => onToggle(record.id)}>
        <EmployeeCell>
          <ChevronIcon className="bi bi-chevron-right" $open={open} />
          <AvatarCircle $bg={palette.bg} $color={palette.textColor} $border={palette.border}>
            {getInitials(record.employeeName)}
          </AvatarCircle>
          <EmployeeMeta>
            <EmployeeName>{record.employeeName}</EmployeeName>
            <EmployeeRole>{record.role}</EmployeeRole>
          </EmployeeMeta>
        </EmployeeCell>

        <WeekLabel>{record.weekLabel}</WeekLabel>

        <HoursCell>{record.totalHours.toFixed(1)} hrs</HoursCell>

        <StatusCell>
          <StatusBadge status={record.status} />
        </StatusCell>

        <ActionsCell onClick={(e) => e.stopPropagation()}>
          {isPending ? (
            <PermissionGate can="canTimesheetReview">
              <ApproveBtn onClick={() => onApprove(record.id)}>
                <i className="bi bi-check-lg" /> Approve
              </ApproveBtn>
              <RejectBtn onClick={() => onReject(record.id)}>
                <i className="bi bi-x-lg" /> Reject
              </RejectBtn>
            </PermissionGate>
          ) : (
            <ReviewedText>Reviewed {record.reviewedDate}</ReviewedText>
          )}
        </ActionsCell>
      </Row>

      {open && (
        <EntriesWrapper>
          {record.status === "Rejected" && record.reason && (
            <ReasonBanner>
              <i className="bi bi-exclamation-triangle" />
              <ReasonText>{record.reason}</ReasonText>
            </ReasonBanner>
          )}
          {dateGroups.length === 0 ? (
            <EmptyEntries>No time entries recorded for this week.</EmptyEntries>
          ) : (
            dateGroups.map((group) => <DateGroupItem key={group.date} group={group} />)
          )}
        </EntriesWrapper>
      )}
    </>
  );
}

/**
 * ApprovalsTable
 *
 * Manager/admin review table — one row per (employee, week) submission
 * across the whole team. Clicking a row expands it into date-grouped entry
 * cards, same visual pattern as WeeklyTimesheetTable's expanded view.
 *
 * Props:
 *   records    — array of timesheet submissions (see record shape below)
 *   onApprove  — (recordId) => void
 *   onReject   — (recordId) => void
 *
 * Record shape:
 *   { id, employeeName, role, weekLabel, totalHours, status,
 *     reviewedDate?, reason?,
 *     entries: [{ id, date, projectNo, projectName, taskName, hours, comment? }] }
 */
export default function ApprovalsTable({ records = [], onApprove, onReject }) {
  const [openId, setOpenId] = useState(null);

  const handleToggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  if (records.length === 0) {
    return (
      <TableWrapper>
        <EmptyEntries>No timesheet submissions found.</EmptyEntries>
      </TableWrapper>
    );
  }

  return (
    <TableWrapper>
      <TableScrollWrapper>
        <HeaderRow>
          <HeaderCell>Employee</HeaderCell>
          <HeaderCell>Week</HeaderCell>
          <HeaderCell>Total Hours</HeaderCell>
          <HeaderCell>Status</HeaderCell>
          <HeaderCell>Actions</HeaderCell>
        </HeaderRow>

        {records.map((record) => (
          <TimesheetRow
            key={record.id}
            record={record}
            open={openId === record.id}
            onToggle={handleToggle}
            onApprove={onApprove}
            onReject={onReject}
          />
        ))}
      </TableScrollWrapper>
    </TableWrapper>
  );
}
