import { useState } from "react";
import Progressbar from "../Progressbar";
import {
  TableWrapper, HeaderRow, HeaderCell,
  WeekRow, WeekLabelCell, ChevronIcon, WeekLabel, CurrentBadge,
  HoursCell, ProgressCell, StatusCell, StatusText, SubmitBtn,
  EntriesWrapper, ReasonBanner, ReasonText,
  DateGroup, DateGroupHeader, DateLabel, TodayBadge, AddTodayPrompt,
  DayMiniBarWrap, DayMiniBarTrack, DayMiniBarFill, DayInfoText,
  EntriesBox, EntryCard, EntryAccent, EntryBody,
  EntryProject, EntryProjectNo, EntryMeta,
  EntryRight, EntryTopRow, EntryHours, EntryComment, EntrySeparator,
  BudgetWrap, BudgetLabel,
  EmptyEntries,
  EmptyDateGroup, EmptyDateLabel, NoEntriesPrompt, NoRecordsText,
  LeaveSlot,
} from "./component.styles";


// ── Helpers ───────────────────────────────────────────────────────────────────

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

function getTodayLabel() {
  const d      = new Date();
  const days   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

const ACCENT_COLORS = ["#3796BF", "#22c55e", "#f97316", "#a855f7", "#14b8a6", "#f59e0b"];

function getAccent(projectNo = "") {
  const code = [...projectNo].reduce((a, c) => a + c.charCodeAt(0), 0);
  return ACCENT_COLORS[code % ACCENT_COLORS.length];
}

// ── Week date generator ───────────────────────────────────────────────────────

const MONTH_IDX  = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
const DAY_ABBR   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MON_ABBR   = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_FULL   = { Sun:"Sunday",Mon:"Monday",Tue:"Tuesday",Wed:"Wednesday",Thu:"Thursday",Fri:"Friday",Sat:"Saturday" };

function toLocalISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseWeekDates(weekLabel) {
  // e.g. "8 Jun – 14 Jun 2026" or "25 May – 31 May 2026"
  const [startPart, endPart] = weekLabel.split(" – ");
  const endTokens = endPart.trim().split(" ");
  const year      = parseInt(endTokens[endTokens.length - 1]);
  const endDate   = new Date(year, MONTH_IDX[endTokens[1]], parseInt(endTokens[0]));

  const startTokens = startPart.trim().split(" ");
  const startMon    = startTokens.length > 1 ? MONTH_IDX[startTokens[1]] : MONTH_IDX[endTokens[1]];
  const startYear   = startMon > MONTH_IDX[endTokens[1]] ? year - 1 : year;
  const startDate   = new Date(startYear, startMon, parseInt(startTokens[0]));

  const dates = [];
  const cur = new Date(startDate);
  while (cur <= endDate) {
    dates.push({
      label: `${DAY_ABBR[cur.getDay()]} ${cur.getDate()} ${MON_ABBR[cur.getMonth()]}`,
      date:  new Date(cur),
    });
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

// ── Day group wrapper (owns hover state for EntriesBox highlight) ─────────────

function DayGroupItem({ group, dailyTarget, week, onDayClick, isToday, isLocked }) {
  const [hovered, setHovered] = useState(false);
  const dayPct = Math.min((group.totalHours / dailyTarget) * 100, 100);

  return (
    <DateGroup
      $locked={isLocked}
      onClick={isLocked ? undefined : () => onDayClick?.({ ...group, week })}
      onMouseEnter={isLocked ? undefined : () => setHovered(true)}
      onMouseLeave={isLocked ? undefined : () => setHovered(false)}
    >
      <DateGroupHeader>
        <DateLabel $today={isToday}>{group.date}</DateLabel>
        {isToday && <TodayBadge>Today</TodayBadge>}
        <DayMiniBarWrap>
          <DayMiniBarTrack>
            <DayMiniBarFill $pct={dayPct} />
          </DayMiniBarTrack>
          <DayInfoText>{group.items.length} task{group.items.length !== 1 ? "s" : ""} · {group.totalHours}h</DayInfoText>
        </DayMiniBarWrap>
      </DateGroupHeader>
      <EntriesBox $hovered={hovered}>
        {group.items.map((entry) => <EntryItem key={entry.id} entry={entry} />)}
      </EntriesBox>
    </DateGroup>
  );
}

// ── Entry card ────────────────────────────────────────────────────────────────

function EntryItem({ entry }) {
  const allocated = entry.allocated ?? 0;
  const worked    = entry.worked ?? entry.hours;
  const remaining = Math.max(allocated - worked, 0);

  return (
    <EntryCard>
      <EntryAccent $color={getAccent(entry.projectNo)} />
      <EntryBody>
        <EntryProject>
          <EntryProjectNo>{entry.projectNo} · {entry.projectName}</EntryProjectNo>
          {(entry.budgetName || entry.taskName) && (
            <EntryMeta>
              {[entry.budgetName, entry.taskName].filter(Boolean).join(" · ")}
            </EntryMeta>
          )}
        </EntryProject>
        <EntryRight>
          <EntryTopRow>
            {allocated > 0 && (
              <BudgetWrap>
                <BudgetLabel>{worked}h / {allocated}h · {remaining} hours remaining</BudgetLabel>
              </BudgetWrap>
            )}
            <EntrySeparator />
            <EntryHours>{entry.hours}h</EntryHours>
          </EntryTopRow>
          {entry.comment && <EntryComment>"{entry.comment}"</EntryComment>}
        </EntryRight>
      </EntryBody>
    </EntryCard>
  );
}

// ── Week row ──────────────────────────────────────────────────────────────────

const WEEKEND_DAYS = new Set(["Sat", "Sun"]);

function WeekItem({ week, open, onToggle, onDelete, onSubmit, onAddToday, onDayClick, timeEntriesForWeek, onWeekExpand, weekendsAllowed, isSubmitting }) {
  const handleToggle = () => {
    const next = !open;
    if (next) onWeekExpand?.(week);
    onToggle(week.id);
  };

  const pct  = week.targetHours > 0
    ? Math.round((week.totalHours / week.targetHours) * 100)
    : 0;
  const late = pct < 80 && !week.isCurrentWeek;

  const isLocked         = week.status === "Submitted" || week.status === "Approved";
  const dailyTarget      = Math.round((week.targetHours ?? 40) / 5);
  const isLoadingEntries = timeEntriesForWeek?.isLoading ?? false;
  const entries          = timeEntriesForWeek?.entries ?? week.entries ?? [];
  const leaveDates   = new Set(timeEntriesForWeek?.leaveDates ?? []);
  const holidayMap   = new Map((timeEntriesForWeek?.holidays ?? []).map((h) => [h.date, h.name]));

  const todayLabel    = week.isCurrentWeek ? getTodayLabel() : null;
  const todayMidnight = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
  const allGroups     = groupByDate(entries);
  const todayGroup    = todayLabel ? allGroups.find((g) => g.date === todayLabel) : null;
  const entryDateMap  = new Map(allGroups.map((g) => [g.date, g]));
  const weekDates     = parseWeekDates(week.weekLabel);

  return (
    <>
      <WeekRow onClick={handleToggle} $rejected={week.status === "Rejected"}>
        <WeekLabelCell>
          <ChevronIcon className="bi bi-chevron-right" $open={open} />
          <WeekLabel $current={week.isCurrentWeek}>{week.weekLabel}</WeekLabel>
          {week.isCurrentWeek && <CurrentBadge>This Week</CurrentBadge>}
        </WeekLabelCell>

        <HoursCell>{week.totalHours} hrs</HoursCell>

        <ProgressCell>
          <Progressbar value={pct} late={late} height={6} showLabel labelSize={11} />
        </ProgressCell>

        <StatusCell onClick={(e) => e.stopPropagation()}>
          {(week.status !== "Not Submitted" || !onSubmit) && (
            <StatusText $status={week.status}>{week.status}</StatusText>
          )}
          {week.status === "Not Submitted" && onSubmit && (
            <SubmitBtn
              disabled={isSubmitting || !week.timesheetId}
              onClick={(e) => { e.stopPropagation(); onSubmit(week.id); }}
            >
              Submit Now
            </SubmitBtn>
          )}
        </StatusCell>
      </WeekRow>

      {open && (
        <EntriesWrapper>
          {week.status === "Rejected" && week.reason && (
            <ReasonBanner>
              <i className="bi bi-exclamation-triangle" />
              <ReasonText>{week.reason}</ReasonText>
            </ReasonBanner>
          )}
          {isLoadingEntries ? (
            <div style={{ padding: "20px 24px", textAlign: "center", color: "#6b7280" }}>
              <div className="spinner-border spinner-border-sm text-primary" role="status" />
            </div>
          ) : (
            weekDates.map(({ label, date }) => {
              const isToday      = week.isCurrentWeek && label === todayLabel;
              const isFuture     = date > todayMidnight;
              const isLeave      = leaveDates.has(label);
              const holidayName  = holidayMap.get(label);
              const isHoliday    = holidayName !== undefined;
              const dayAbbr      = label.split(" ")[0];
              const isWeekendDay = WEEKEND_DAYS.has(dayAbbr);
              const weekendLocked = isWeekendDay && weekendsAllowed === 0;
              const group     = entryDateMap.get(label);

              if (isLeave || isHoliday) {
                return (
                  <EmptyDateGroup key={label}>
                    <DateGroupHeader>
                      <EmptyDateLabel>{label}</EmptyDateLabel>
                    </DateGroupHeader>
                    <LeaveSlot>
                      <i className={isHoliday ? "bi bi-calendar-event" : "bi bi-umbrella"} />
                      {isHoliday ? holidayName : "On Leave"}
                    </LeaveSlot>
                  </EmptyDateGroup>
                );
              }

              if (group) {
                return (
                  <DayGroupItem key={label} group={group} dailyTarget={dailyTarget} week={week} onDayClick={(day) => onDayClick?.({ ...day, isoDate: toLocalISO(date) })} isToday={isToday} isLocked={isLocked || weekendLocked} />
                );
              }

              if (isToday && !weekendLocked) {
                return (
                  <DateGroup key={label}>
                    <DateGroupHeader>
                      <DateLabel $today>{label}</DateLabel>
                      <TodayBadge>Today</TodayBadge>
                    </DateGroupHeader>
                    {!isLocked && (
                      <AddTodayPrompt onClick={() => onDayClick?.({ date: label, isoDate: toLocalISO(date), items: [], week })}>
                        <i className="bi bi-plus-circle" />
                        Add today's timesheet
                      </AddTodayPrompt>
                    )}
                  </DateGroup>
                );
              }

              return (
                <EmptyDateGroup key={label}>
                  <DateGroupHeader>
                    <EmptyDateLabel>{label}</EmptyDateLabel>
                    {isToday && <TodayBadge>Today</TodayBadge>}
                  </DateGroupHeader>
                  {isLocked || weekendLocked
                    ? <NoRecordsText>{weekendLocked ? "Weekend — not available" : "No time records added"}</NoRecordsText>
                    : (
                      <NoEntriesPrompt
                        $disabled={isFuture}
                        onClick={isFuture ? undefined : () => onDayClick?.({ date: label, isoDate: toLocalISO(date), items: [], week })}
                      >
                        <i className="bi bi-plus-circle" />
                        Add {DAY_FULL[label.split(" ")[0]]}'s timesheet
                      </NoEntriesPrompt>
                    )
                  }
                </EmptyDateGroup>
              );
            })
          )}
        </EntriesWrapper>
      )}
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

/**
 * WeeklyTimesheetTable
 *
 * Props:
 *   weeks      — array of week objects
 *   onDelete   — (weekId) => void
 *   onAddToday — () => void  — called when "Add today's timesheet" is clicked
 *
 * Week shape:
 *   { id, weekLabel, isCurrentWeek, totalHours, targetHours, status, reason?,
 *     entries: [{ id, date, projectNo, projectName, task, hours, comment? }] }
 *   reason — rejection comment, shown as a banner in the expanded view when status is "Rejected"
 */
export default function WeeklyTimesheetTable({ weeks = [], timeEntriesByWeek = {}, weekendsAllowed = 1, isSubmitting = false, onWeekExpand, onDelete, onSubmit, onAddToday, onDayClick }) {
  const defaultOpen = weeks.find((w) => w.isCurrentWeek)?.id ?? null;
  const [openWeekId, setOpenWeekId] = useState(defaultOpen);

  const handleToggle = (id) => setOpenWeekId((prev) => (prev === id ? null : id));

  if (weeks.length === 0) {
    return (
      <TableWrapper>
        <EmptyEntries style={{ padding: "40px 24px", textAlign: "center" }}>
          No timesheet data available.
        </EmptyEntries>
      </TableWrapper>
    );
  }

  return (
    <TableWrapper>
      <HeaderRow>
        <HeaderCell>Week</HeaderCell>
        <HeaderCell>Total Hours</HeaderCell>
        <HeaderCell>Progress</HeaderCell>
        <HeaderCell>Status</HeaderCell>
      </HeaderRow>

      {weeks.map((week) => (
        <WeekItem
          key={week.id}
          week={week}
          open={openWeekId === week.id}
          onToggle={handleToggle}
          timeEntriesForWeek={timeEntriesByWeek[week.id]}
          weekendsAllowed={weekendsAllowed}
          isSubmitting={isSubmitting}
          onWeekExpand={onWeekExpand}
          onDelete={onDelete}
          onSubmit={onSubmit}
          onAddToday={onAddToday}
          onDayClick={onDayClick}
        />
      ))}
    </TableWrapper>
  );
}
