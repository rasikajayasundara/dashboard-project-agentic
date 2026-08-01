import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { colors, fontSize } from "../../../constants/common";
import WeeklyTimesheetTable from "../../../components/WeeklyTimesheetTable";
import LogTimeModal from "../modals/LogTimeModal";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { timesheetAction } from "../../../store/timesheetSlice";
import { snackbarAction, SNACKBAR_TYPES } from "../../../store/snackbarSlice";
import {
  TimesheetsLayout, TableSection, RightPanel,
  ChartCard, ChartTitle,
  LegendList, LegendRow, LegendDot, LegendName, LegendHours,
  BarArea, BarCol, TargetLine, TargetLineLabel, XLabels, XLabel,
  StackedBarWrap, BarSegment, TrendLegend,
  SkeletonCircle, SkeletonDot, SkeletonLine, SkeletonBarArea, SkeletonBar,
} from "./component.styles";

// ── Chart color helper ────────────────────────────────────────────────────────

const ACCENT_COLORS = ["#3796BF", "#22c55e", "#f97316", "#a855f7", "#14b8a6", "#f59e0b"];

function getAccent(key = "") {
  const code = [...key].reduce((a, c) => a + c.charCodeAt(0), 0);
  return ACCENT_COLORS[code % ACCENT_COLORS.length];
}

// Renders false on mount/dep-change, then flips true a frame later so chart
// fills animate from 0 instead of popping in at full size on the first paint.
function useEnterAnimation(dep) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(false);
    let raf2;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setReady(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [dep]);
  return ready;
}

// ── Chart loading skeletons ───────────────────────────────────────────────────

function DonutSkeleton() {
  return (
    <>
      <SkeletonCircle />
      <LegendList>
        {[0, 1, 2].map((i) => (
          <LegendRow key={i}>
            <SkeletonDot $delay={`${i * 0.15}s`} />
            <SkeletonLine $delay={`${i * 0.15}s`} />
          </LegendRow>
        ))}
      </LegendList>
    </>
  );
}

function TrendSkeleton() {
  const heights = [35, 65, 50, 85, 45];
  return (
    <SkeletonBarArea>
      {heights.map((h, i) => (
        <BarCol key={i}>
          <SkeletonBar $h={h} $delay={`${i * 0.1}s`} />
        </BarCol>
      ))}
    </SkeletonBarArea>
  );
}

// ── ProjectDonut ──────────────────────────────────────────────────────────────

function ProjectDonut({ projects }) {
  const animated = useEnterAnimation(projects);
  const total  = projects.reduce((s, p) => s + p.hrs, 0);
  if (total === 0) {
    return (
      <div style={{ textAlign: "center", padding: "20px 0", color: "#6b7280", fontSize: fontSize.subtitle }}>
        No hours logged
      </div>
    );
  }
  const size   = 100;
  const sw     = 10;
  const r      = 60 - sw / 2 - 2;
  const circ   = 2 * Math.PI * r;
  let   offset = 0;

  const segments = projects.map((p) => {
    const len = animated ? (p.hrs / total) * circ : 0;
    const seg = { ...p, len, offset };
    offset += len;
    return seg;
  });

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
        <svg viewBox="0 0 120 120" width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* track */}
          <circle cx="60" cy="60" r={r} fill="none" stroke="#f3f4f6" strokeWidth={sw} />
          {segments.map((seg) => (
            <circle
              key={seg.no}
              cx="60" cy="60" r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={sw}
              strokeDasharray={`${Math.max(seg.len - 2, 0)} ${circ}`}
              strokeDashoffset={-seg.offset}
              strokeLinecap="butt"
              style={{ transition: "stroke-dasharray 0.7s ease, stroke-dashoffset 0.7s ease" }}
            />
          ))}
        </svg>
      </div>
      <LegendList>
        {projects.map((p) => (
          <LegendRow key={p.no}>
            <LegendDot $color={p.color} />
            <LegendName>{p.name}</LegendName>
            <LegendHours>{p.hrs}h</LegendHours>
          </LegendRow>
        ))}
      </LegendList>
    </>
  );
}

// ── WeeklyTrend ───────────────────────────────────────────────────────────────

function WeeklyTrend({ weeklyTrend = [], targetHours = 40 }) {
  const animated = useEnterAnimation(weeklyTrend);
  const maxH = targetHours * 1.25;
  const targetPct = (targetHours / maxH) * 100;
  const thisMonday = currentWeekMonday();

  return (
    <div>
      <BarArea>
        <TargetLine $pct={targetPct}>
          <TargetLineLabel>{targetHours}h</TargetLineLabel>
        </TargetLine>
        {weeklyTrend.map((w) => {
          const billable    = Number(w.billableHours) || 0;
          const nonBillable = Number(w.nonBillableHours) || 0;
          const total       = Number(w.totalHours) || (billable + nonBillable);
          const totalPct    = animated ? Math.min((total / maxH) * 100, 100) : 0;
          const isCurrent   = w.weekStart === thisMonday;
          return (
            <BarCol key={w.weekStart}>
              <StackedBarWrap $pct={totalPct} $current={isCurrent}>
                {nonBillable > 0 && <BarSegment $ratio={nonBillable} $color={colors.textMuted} />}
                <BarSegment $ratio={billable || 0.0001} $color={colors.accentBlue} />
              </StackedBarWrap>
            </BarCol>
          );
        })}
      </BarArea>
      <XLabels>
        {weeklyTrend.map((w) => (
          <XLabel key={w.weekStart} $current={w.weekStart === thisMonday}>
            {formatShortDate(w.weekStart)}
          </XLabel>
        ))}
      </XLabels>
      <TrendLegend>
        <LegendRow>
          <LegendDot $color={colors.accentBlue} />
          <LegendName>Billable</LegendName>
        </LegendRow>
        <LegendRow>
          <LegendDot $color={colors.textMuted} />
          <LegendName>Non-billable</LegendName>
        </LegendRow>
      </TrendLegend>
    </div>
  );
}

// ── Week normalizer ───────────────────────────────────────────────────────────

const MONTH_ABBR = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const TIMESHEET_STATUS = { 0: "Not Submitted", 1: "Submitted", 2: "Approved", 3: "Rejected" };

function formatShortDate(dateStr) {
  // dateStr is "YYYY-MM-DD"
  const d = new Date(dateStr + "T00:00:00Z");
  return `${d.getUTCDate()} ${MONTH_ABBR[d.getUTCMonth()]}`;
}

function computeWeekLabel(weekStartDate) {
  // weekStartDate is "YYYY-MM-DD" (Monday)
  const start = new Date(weekStartDate + "T00:00:00Z");
  const end   = new Date(start.getTime() + 6 * 86400000);
  const sd = start.getUTCDate(), sm = start.getUTCMonth();
  const ed = end.getUTCDate(),   em = end.getUTCMonth(), ey = end.getUTCFullYear();
  return sm === em
    ? `${sd} – ${ed} ${MONTH_ABBR[em]} ${ey}`
    : `${sd} ${MONTH_ABBR[sm]} – ${ed} ${MONTH_ABBR[em]} ${ey}`;
}

function currentWeekMonday() {
  const now = new Date();
  const d   = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const day = d.getUTCDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10);
}

function normalizeWeeks(apiTimesheets, weeklyMaxHours = 40) {
  const thisMonday = currentWeekMonday();
  return apiTimesheets.map((t) => ({
    id:            t.timesheetId ?? t.weekStartDate,
    timesheetId:   t.timesheetId,
    weekStartDate: t.weekStartDate,
    weekLabel:     computeWeekLabel(t.weekStartDate),
    isCurrentWeek: t.weekStartDate === thisMonday,
    totalHours:    Number(t.workedHours) || 0,
    targetHours:   weeklyMaxHours,
    status:        TIMESHEET_STATUS[t.status] ?? "Not Submitted",
    reason:        t.reviewComments || null,
    entries:       [],
  }));
}

// ── Main ──────────────────────────────────────────────────────────────────────

function getTodayLabel() {
  const d      = new Date();
  const days   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

export default function EmployeeTimesheets({ myProfile = false }) {
  const { id: urlId }   = useParams();
  const dispatch        = useDispatch();
  const { employeeDetail }             = useSelector((s) => s.employees);
  const { timesheets, isLoadingTimesheets, timeEntriesByWeek, saveTimeEntries, deleteTimeEntry, submitTimesheet, graph } = useSelector((s) => s.timesheets);
  const { timesheetConfig } = useSelector((s) => s.metadata);
  const employeeId = Number(urlId) || employeeDetail?.empInfo?.employeeId;

  useEffect(() => {
    if (employeeId) dispatch(timesheetAction.getTimesheetsStart({ employeeId, myProfile }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, myProfile]);

  useEffect(() => {
    if (employeeId) dispatch(timesheetAction.getTimesheetGraphStart({ employeeId, myProfile }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, myProfile]);

  const weeks = useMemo(
    () => normalizeWeeks(timesheets, timesheetConfig.weeklyMaxHours),
    [timesheets, timesheetConfig.weeklyMaxHours]
  );

  useEffect(() => {
    const currentWeekData = weeks.find((w) => w.isCurrentWeek);
    if (!currentWeekData || timeEntriesByWeek[currentWeekData.id]) return;
    dispatch(timesheetAction.getTimeEntriesStart({
      cacheKey:    currentWeekData.id,
      timesheetId: currentWeekData.timesheetId,
      weekStart:   currentWeekData.weekStartDate,
      employeeId,
      myProfile,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeks, employeeId, myProfile]);

  const handleWeekExpand = useCallback((week) => {
    dispatch(timesheetAction.getTimeEntriesStart({
      cacheKey:    week.id,
      timesheetId: week.timesheetId,
      weekStart:   week.weekStartDate,
      employeeId,
      myProfile,
    }));
  }, [dispatch, employeeId, myProfile]);

  const projectHours = useMemo(
    () => graph.hoursByProject.map((p) => ({
      no:    String(p.projectId),
      hrs:   Number(p.hours) || 0,
      color: getAccent(String(p.projectId)),
      name:  p.projectName,
    })).sort((a, b) => b.hrs - a.hrs),
    [graph.hoursByProject]
  );

  const [showModal,         setShowModal]         = useState(false);
  const [modalEntries,      setModalEntries]      = useState({});
  const [selectedDay,       setSelectedDay]       = useState(null);
  const [confirmSubmitWeek, setConfirmSubmitWeek] = useState(null);
  const [confirmDeleteEntry, setConfirmDeleteEntry] = useState(null);

  const openModalForDay = (day) => {
    setSelectedDay(day);
    setModalEntries({});
    setShowModal(true);
    if (day?.isoDate) {
      dispatch(timesheetAction.getLogTimeTasksStart({ employeeId, date: day.isoDate, myProfile }));
    }
  };

  const handleEntryChange = useCallback((taskId, field, value) => {
    setModalEntries((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], [field]: value },
    }));
  }, []);

  useEffect(() => {
    if (saveTimeEntries.savedAt && showModal) {
      setShowModal(false);
      setModalEntries({});
      setSelectedDay(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveTimeEntries.savedAt]);

  const handleSave = (entryList) => {
    dispatch(timesheetAction.saveTimeEntriesStart({
      employeeId,
      timesheetId:   selectedDay?.week?.timesheetId ?? null,
      weekStartDate: selectedDay?.week?.weekStartDate ?? "",
      date:          selectedDay?.isoDate ?? "",
      cacheKey:      selectedDay?.week?.id ?? null,
      myProfile,
      entries: entryList.map((e) => ({
        assignmentId: e.assignmentId,
        hours:        e.hours,
        comment:      e.comment,
      })),
    }));
  };

  const currentWeek  = weeks.find((w) => w.isCurrentWeek) ?? weeks[0];
  const todayLabel   = getTodayLabel();
  const todayEntries = currentWeek?.entries?.filter((e) => e.date === todayLabel) ?? [];

  // selectedDay.week is a snapshot from when the modal was opened — look up the
  // live week by id so totals (e.g. after a delete) stay in sync while the modal is open
  const selectedWeek = selectedDay?.week
    ? weeks.find((w) => w.id === selectedDay.week.id) ?? selectedDay.week
    : currentWeek;

  const submitWeek = weeks.find((w) => w.id === confirmSubmitWeek);
  const submitPct = submitWeek && submitWeek.targetHours > 0
    ? Math.round((submitWeek.totalHours / submitWeek.targetHours) * 100)
    : 0;

  return (
    <TimesheetsLayout>
      <TableSection>
        {isLoadingTimesheets && weeks.length === 0 ? (
          <div style={{ padding: "40px 24px", textAlign: "center", color: "#6b7280" }}>
            <div className="spinner-border spinner-border-sm text-primary mb-2" role="status" />
            <div>Loading timesheets...</div>
          </div>
        ) : (
          <WeeklyTimesheetTable
            weeks={weeks}
            timeEntriesByWeek={timeEntriesByWeek}
            weekendsAllowed={timesheetConfig.weekendsAllowed}
            isSubmitting={submitTimesheet.isLoading}
            onWeekExpand={handleWeekExpand}
            onDelete={(weekId) => console.log("Delete week:", weekId)}
            onSubmit={myProfile ? (weekId) => setConfirmSubmitWeek(weekId) : undefined}
            onAddToday={myProfile ? () => {
                const now = new Date();
                const iso = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
                openModalForDay({ date: todayLabel, isoDate: iso, items: todayEntries, week: currentWeek });
              } : undefined}
            onDayClick={myProfile ? (day) => openModalForDay(day) : undefined}
          />
        )}
      </TableSection>
      <RightPanel>
        <ChartCard>
          <ChartTitle>Hours by Project (Last 30 Days)</ChartTitle>
          {graph.isLoading && graph.hoursByProject.length === 0 ? (
            <DonutSkeleton />
          ) : graph.error ? (
            <div style={{ textAlign: "center", padding: "20px 0", color: "#6b7280", fontSize: fontSize.subtitle }}>
              Couldn't load chart data
            </div>
          ) : (
            <ProjectDonut projects={projectHours} />
          )}
        </ChartCard>
        <ChartCard>
          <ChartTitle>Weekly Trend (Last 30 Days)</ChartTitle>
          {graph.isLoading && graph.weeklyTrend.length === 0 ? (
            <TrendSkeleton />
          ) : graph.error ? (
            <div style={{ textAlign: "center", padding: "20px 0", color: "#6b7280", fontSize: fontSize.subtitle }}>
              Couldn't load chart data
            </div>
          ) : (
            <WeeklyTrend weeklyTrend={graph.weeklyTrend} targetHours={timesheetConfig.weeklyMaxHours} />
          )}
        </ChartCard>
      </RightPanel>

      {confirmSubmitWeek && submitWeek && (
        <ConfirmDialog
          title="Submit Timesheet"
          message={`You've logged ${submitWeek.totalHours}/${submitWeek.targetHours} hrs (${submitPct}%) this week. Submit for approval?`}
          confirmLabel="Submit"
          variant="success"
          onConfirm={() => {
            if (!submitWeek.timesheetId) {
              dispatch(snackbarAction.showSnackbar({ message: "Cannot submit — timesheet not yet initialized", type: SNACKBAR_TYPES.ERROR }));
              setConfirmSubmitWeek(null);
              return;
            }
            dispatch(timesheetAction.submitTimesheetStart({ timesheetId: submitWeek.timesheetId, employeeId, myProfile }));
            setConfirmSubmitWeek(null);
          }}
          onCancel={() => setConfirmSubmitWeek(null)}
        />
      )}

      {confirmDeleteEntry && (
        <ConfirmDialog
          title="Delete Time Entry"
          message={`Delete ${Number(confirmDeleteEntry.loggedHours)}h logged for "${confirmDeleteEntry.taskName}"? This cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={() => {
            dispatch(timesheetAction.deleteTimeEntryStart({
              entryId:     confirmDeleteEntry.entryId,
              employeeId,
              cacheKey:    selectedDay?.week?.id ?? null,
              weekStart:   selectedDay?.week?.weekStartDate ?? "",
              timesheetId: selectedDay?.week?.timesheetId ?? null,
              date:        selectedDay?.isoDate ?? "",
              myProfile,
            }));
            setConfirmDeleteEntry(null);
          }}
          onCancel={() => setConfirmDeleteEntry(null)}
        />
      )}

      <LogTimeModal
        show={showModal}
        onClose={() => { setShowModal(false); setModalEntries({}); setSelectedDay(null); }}
        onSave={handleSave}
        isSaving={saveTimeEntries.isLoading}
        onDeleteEntry={(entry) => setConfirmDeleteEntry(entry)}
        isDeleting={deleteTimeEntry.isLoading}
        todayLabel={selectedDay?.date ?? todayLabel}
        isoDate={selectedDay?.isoDate}
        weekLabel={selectedWeek?.weekLabel ?? ""}
        weekHoursLogged={selectedWeek?.totalHours ?? 0}
        targetHours={timesheetConfig.weeklyMaxHours}
        entries={modalEntries}
        onEntryChange={handleEntryChange}
      />
    </TimesheetsLayout>
  );
}
