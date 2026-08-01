import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fontSize } from "../../../constants/common";
import Progressbar from "../../../components/Progressbar";
import {
  Overlay, ModalBox,
  ModalHeader, ModalTitle, CloseBtn,
  WeekStrip, WeekTotalLabel, WeekStripLabel, WeekStripBar, WeekStripHours, AddingBadge,
  ModalBody,
  Sidebar, SidebarLabel, SidebarItem, SidebarDot, SidebarMeta,
  SidebarProjectNo, SidebarProjectName, SidebarHoursBadge,
  MainContent, MainPanel,
  ProjectSection, ProjectHeader, ProjectAccent, ProjectHeaderText,
  ProjectNo, ProjectName, ProjectHoursTotal,
  TaskCard, TaskRow, TaskMeta, TaskNameRow, TaskName, TaskBudget,
  TaskMeta2, TaskProgressTrack, TaskProgressFill, TaskProgressLabel, TaskDateRange,
  HoursWrap, HoursInput, HoursUnit,
  CommentWrap, CommentInput, CommentError,
  ModalFooter, FooterTotals, FooterToday, FooterSep, FooterWeek, FooterError,
  FooterButtons, CancelBtn, SaveBtn,
  ExistingSection, ExistingSectionHeader, ExistingSectionRight, ExistingSectionTitle,
  TodayMiniBarTrack, TodayMiniBarFill, TodayMiniBarLabel,
  ExistingEntriesBox, ExistingEntryRow, ExistingEntryAccent, ExistingEntryBody,
  ExistingEntryLeft, ExistingEntryRight, ExistingEntryText, ExistingEntryHours,
  ExistingEntryTaskLine, ExistingEntryTask, ExistingEntryBudget, ExistingEntryComment,
  ExistingEntryActSep, ExistingEntryActions, ExistingEntryActionBtn,
  NewEntryHeader, NewEntryTitle,
  SearchWrap, SearchIcon, SearchInput, SearchClear,
} from "./logTimeModal.styles";

const ACCENT_COLORS = ["#3796BF", "#22c55e", "#f97316", "#a855f7", "#14b8a6", "#f59e0b"];
function getAccent(projectNo = "") {
  const code = [...projectNo].reduce((a, c) => a + c.charCodeAt(0), 0);
  return ACCENT_COLORS[code % ACCENT_COLORS.length];
}

const MON_ABBR = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function fmtDate(iso) {
  if (!iso) return null;
  const d = new Date(iso + "T00:00:00Z");
  return `${d.getUTCDate()} ${MON_ABBR[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/**
 * LogTimeModal
 *
 * Props:
 *   show             — boolean
 *   onClose          — () => void
 *   onSave           — (entries[]) => void
 *   todayLabel       — "Fri 12 Jun"
 *   weekLabel        — "8 Jun – 14 Jun 2026"
 *   weekHoursLogged  — hours already logged this week (before today)
 *   targetHours      — weekly target (default 40)
 *   entries          — { [taskId]: { hours: string, comment: string } }
 *   onEntryChange    — (taskId, field, value) => void
 */
export default function LogTimeModal({
  show,
  onClose,
  onSave,
  todayLabel,
  isoDate,
  weekLabel,
  weekHoursLogged = 0,
  targetHours = 40,
  entries = {},
  onEntryChange,
  isSaving = false,
  isDeleting = false,
  onDeleteEntry,
}) {
  const sectionRefs = useRef({});
  const taskRefs = useRef({});
  const hoursInputRefs = useRef({});
  const [searchTerm, setSearchTerm] = useState("");
  const [saveAttempted, setSaveAttempted] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState(null);

  useEffect(() => {
    if (show) {
      setSaveAttempted(false);
      setEditingEntryId(null);
    }
  }, [show]);

  const now = new Date();
  const todayIso = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
  const isToday = !isoDate || isoDate === todayIso;
  const { isLoading, loggedEntries, projects } = useSelector((s) => s.timesheets.logTimeTasks);

  // Bring the task being edited into view (only scrolls if it's actually off-screen) and focus its hours field
  useEffect(() => {
    if (!editingEntryId) return;
    const assignmentId = loggedEntries.find((e) => e.entryId === editingEntryId)?.assignmentId;
    if (!assignmentId) return;
    const el    = taskRefs.current[assignmentId];
    const input = hoursInputRefs.current[assignmentId];
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    input?.focus();
    input?.select();
  }, [editingEntryId, loggedEntries]);

  const { timesheetConfig } = useSelector((s) => s.metadata);
  const dailyMaxHours  = timesheetConfig?.dailyMaxHours  ?? 8;
  const weeklyMaxHours = timesheetConfig?.weeklyMaxHours ?? targetHours;

  if (!show) return null;

  const term = searchTerm.trim().toLowerCase();

  const loggedAssignmentIds = new Set(loggedEntries.map((e) => e.assignmentId).filter(Boolean));
  const editingAssignmentId = editingEntryId
    ? (loggedEntries.find((e) => e.entryId === editingEntryId)?.assignmentId ?? null)
    : null;

  const visibleProjects = projects
    .map((proj) => ({
      ...proj,
      tasks: proj.tasks.filter((t) => {
        if (loggedAssignmentIds.has(t.assignmentId) && t.assignmentId !== editingAssignmentId) return false;
        if (term) {
          return (
            t.taskName.toLowerCase().includes(term) ||
            proj.projectNo.toLowerCase().includes(term) ||
            proj.projectName.toLowerCase().includes(term)
          );
        }
        return true;
      }),
    }))
    .filter((proj) => proj.tasks.length > 0);

  const editingEntry    = editingEntryId ? loggedEntries.find((e) => e.entryId === editingEntryId) : null;
  const editingOldHours = editingEntry ? (Number(editingEntry.loggedHours) || 0) : 0;
  const editingNewHours = editingAssignmentId ? (parseFloat(entries[editingAssignmentId]?.hours) || 0) : 0;
  const editingDelta    = editingAssignmentId ? editingNewHours - editingOldHours : 0;

  // "already logged" total, using the live in-progress value for the entry being edited
  const existingTotal = loggedEntries.reduce((s, e) => {
    const hrs = e.entryId === editingEntryId ? editingNewHours : (Number(e.loggedHours) || 0);
    return s + hrs;
  }, 0);
  // genuinely new entries today — excludes the task currently being edited, which is tracked via editingDelta instead
  const newEntriesTotal = Object.entries(entries).reduce((sum, [taskId, e]) => {
    if (editingAssignmentId && String(taskId) === String(editingAssignmentId)) return sum;
    return sum + (parseFloat(e.hours) || 0);
  }, 0);
  const todayTotal = editingDelta + newEntriesTotal;
  const dayTotal   = existingTotal + newEntriesTotal;
  const weekTotal  = weekHoursLogged + todayTotal;
  const weekPct    = Math.min((weekTotal / targetHours) * 100, 100);
  const hasEntries = Object.values(entries).some((e) => (parseFloat(e.hours) || 0) > 0);

  const dayLimitExceeded  = dayTotal > dailyMaxHours;
  const weekLimitExceeded = weekTotal > weeklyMaxHours;
  const anyTaskExceeded   = projects.some((proj) =>
    proj.tasks.some((task) => {
      if (loggedAssignmentIds.has(task.assignmentId) && task.assignmentId !== editingAssignmentId) return false;
      const entryHrs  = parseFloat(entries[task.assignmentId]?.hours) || 0;
      if (entryHrs === 0) return false;
      const allocated = Number(task.allocatedHours);
      const rawWorked = Number(task.workedHours);
      // workedHours already includes this entry's previously-saved hours when editing — exclude them so we don't double-count
      const worked    = task.assignmentId === editingAssignmentId ? Math.max(0, rawWorked - editingOldHours) : rawWorked;
      return allocated > 0 && (worked + entryHrs) > allocated;
    })
  );
  const limitsExceeded = dayLimitExceeded || weekLimitExceeded || anyTaskExceeded;

  const invalidIds = new Set(
    projects.flatMap((proj) =>
      proj.tasks
        .filter((task) => {
          const hrs = parseFloat(entries[task.assignmentId]?.hours) || 0;
          const comment = (entries[task.assignmentId]?.comment ?? "").trim();
          return hrs > 0 && !comment;
        })
        .map((task) => task.assignmentId)
    )
  );

  function projectTotal(proj) {
    return proj.tasks.reduce((s, t) => s + (parseFloat(entries[t.assignmentId]?.hours) || 0), 0);
  }

  function scrollTo(projectNo) {
    sectionRefs.current[projectNo]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleEditEntry(entry) {
    if (editingEntryId === entry.entryId) {
      // cancel edit: clear pre-filled values and hide the task again
      if (entry.assignmentId) {
        onEntryChange(entry.assignmentId, "hours", "");
        onEntryChange(entry.assignmentId, "comment", "");
      }
      setEditingEntryId(null);
      return;
    }
    // switching to a different edit: clear the previous one first
    if (editingAssignmentId && editingAssignmentId !== entry.assignmentId) {
      onEntryChange(editingAssignmentId, "hours", "");
      onEntryChange(editingAssignmentId, "comment", "");
    }
    setEditingEntryId(entry.entryId);
    if (entry.assignmentId) {
      setSearchTerm(""); // clear any filter that could hide the task being edited
      onEntryChange(entry.assignmentId, "hours", String(Number(entry.loggedHours)));
      onEntryChange(entry.assignmentId, "comment", entry.comment ?? "");
    }
  }

  function handleSave() {
    setSaveAttempted(true);
    if (invalidIds.size > 0) return;
    const result = [];
    projects.forEach((proj) =>
      proj.tasks.forEach((task) => {
        // skip tasks hidden by logged entries (not currently being edited)
        if (loggedAssignmentIds.has(task.assignmentId) && task.assignmentId !== editingAssignmentId) return;
        const hrs = parseFloat(entries[task.assignmentId]?.hours) || 0;
        if (hrs > 0) result.push({
          assignmentId: task.assignmentId,
          hours:        hrs,
          comment:      entries[task.assignmentId]?.comment ?? "",
        });
      })
    );
    onSave?.(result);
  }

  return (
    <Overlay onClick={() => { setSearchTerm(""); onClose(); }}>
      <ModalBox $maxWidth="960px" $height="85vh" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <ModalHeader>
          <ModalTitle>Log Timesheet · {todayLabel}</ModalTitle>
          <CloseBtn onClick={onClose}><i className="bi bi-x-lg" /></CloseBtn>
        </ModalHeader>

        {/* ── Week progress strip ── */}
        <WeekStrip>
          <WeekTotalLabel>This week</WeekTotalLabel>
          <WeekStripLabel>{weekLabel}</WeekStripLabel>
          <WeekStripBar>
            <Progressbar value={weekPct} height={6} />
          </WeekStripBar>
          <WeekStripHours>{weekHoursLogged}h / {targetHours}h</WeekStripHours>
          {todayTotal !== 0 && <AddingBadge $over={weekLimitExceeded}>{todayTotal > 0 ? "+" : ""}{todayTotal}h adding</AddingBadge>}
        </WeekStrip>

        {/* ── Body ── */}
        <ModalBody>

          {/* Sidebar — project navigator */}
          <Sidebar>
            <SidebarLabel>Projects</SidebarLabel>
            {projects.map((proj) => {
              const hrs    = projectTotal(proj);
              const accent = getAccent(proj.projectNo);
              return (
                <SidebarItem key={proj.projectNo} $active={hrs > 0} onClick={() => scrollTo(proj.projectNo)}>
                  <SidebarDot $color={accent} />
                  <SidebarMeta>
                    <SidebarProjectNo>{proj.projectNo}</SidebarProjectNo>
                    <SidebarProjectName>{proj.projectName}</SidebarProjectName>
                  </SidebarMeta>
                  <SidebarHoursBadge $hasHours={hrs > 0}>{hrs > 0 ? `${hrs}h` : "—"}</SidebarHoursBadge>
                </SidebarItem>
              );
            })}
          </Sidebar>

          <MainContent>
            {/* Already logged — fixed, does not scroll */}
            {loggedEntries.length > 0 && (() => {
              const dailyTarget = dailyMaxHours;
              const pct         = (existingTotal / dailyTarget) * 100;
              return (
              <ExistingSection>
                <ExistingSectionHeader>
                  <ExistingSectionTitle>{isToday ? "Already logged today" : "Already logged this day"}</ExistingSectionTitle>
                  <ExistingSectionRight>
                    <TodayMiniBarTrack>
                      <TodayMiniBarFill $pct={pct} />
                    </TodayMiniBarTrack>
                    <TodayMiniBarLabel>{existingTotal}h / {dailyTarget}h</TodayMiniBarLabel>
                  </ExistingSectionRight>
                </ExistingSectionHeader>
                <ExistingEntriesBox>
                  {loggedEntries.map((entry) => {
                    const isEditingThis  = entry.entryId === editingEntryId;
                    const displayHours   = isEditingThis ? editingNewHours : Number(entry.loggedHours);
                    const displayComment = isEditingThis ? (entries[entry.assignmentId]?.comment ?? entry.comment) : entry.comment;
                    return (
                    <ExistingEntryRow key={entry.entryId}>
                      <ExistingEntryAccent />
                      <ExistingEntryBody>
                        <ExistingEntryLeft>
                          <ExistingEntryText>{entry.projectNo} · {entry.projectName}</ExistingEntryText>
                          {(entry.taskName || entry.budgetName) && (
                            <ExistingEntryTaskLine>
                              {entry.taskName && <ExistingEntryTask>{entry.taskName}</ExistingEntryTask>}
                              {entry.budgetName && (
                                <ExistingEntryBudget>{entry.taskName ? ` · ${entry.budgetName}` : entry.budgetName}</ExistingEntryBudget>
                              )}
                            </ExistingEntryTaskLine>
                          )}
                        </ExistingEntryLeft>
                        <ExistingEntryRight>
                          <ExistingEntryHours>{displayHours}h</ExistingEntryHours>
                          {displayComment && <ExistingEntryComment>"{displayComment}"</ExistingEntryComment>}
                        </ExistingEntryRight>
                        <ExistingEntryActSep />
                        <ExistingEntryActions>
                          <ExistingEntryActionBtn
                            $variant="delete"
                            disabled={isDeleting}
                            title="Delete entry"
                            onClick={() => onDeleteEntry?.(entry)}
                          >
                            <i className="bi bi-x-lg" />
                          </ExistingEntryActionBtn>
                          <ExistingEntryActionBtn
                            $variant="edit"
                            $active={editingEntryId === entry.entryId}
                            title={editingEntryId === entry.entryId ? "Cancel edit" : "Edit entry"}
                            onClick={() => handleEditEntry(entry)}
                          >
                            <i className={editingEntryId === entry.entryId ? "bi bi-x" : "bi bi-pencil"} />
                          </ExistingEntryActionBtn>
                        </ExistingEntryActions>
                      </ExistingEntryBody>
                    </ExistingEntryRow>
                    );
                  })}
                </ExistingEntriesBox>
              </ExistingSection>
              );
            })()}

            {/* New entry section title */}
            <NewEntryHeader>
              <NewEntryTitle>New Time Entry</NewEntryTitle>
            </NewEntryHeader>

            {/* Task search */}
            <SearchWrap>
              <SearchIcon className="bi bi-search" />
              <SearchInput
                type="text"
                placeholder="Search by project ID or task name…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <SearchClear onClick={() => setSearchTerm("")}>
                  <i className="bi bi-x" />
                </SearchClear>
              )}
            </SearchWrap>

            {/* Scrollable task list */}
            <MainPanel>
            {isLoading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
                <div className="spinner-border spinner-border-sm text-primary mb-2" role="status" />
                <div style={{ fontSize: fontSize.subtitle }}>Loading tasks…</div>
              </div>
            ) : visibleProjects.map((proj) => {
              const accent = getAccent(proj.projectNo);
              const hrs    = projectTotal(proj);
              return (
                <ProjectSection
                  key={proj.projectNo}
                  ref={(el) => { sectionRefs.current[proj.projectNo] = el; }}
                >
                  <ProjectHeader>
                    <ProjectAccent $color={accent} />
                    <ProjectHeaderText>
                      <ProjectNo>{proj.projectNo}</ProjectNo>
                      <ProjectName>{proj.projectName}</ProjectName>
                    </ProjectHeaderText>
                    <ProjectHoursTotal $hasHours={hrs > 0}>
                      {hrs > 0 ? `${hrs}h logged` : "nothing yet"}
                    </ProjectHoursTotal>
                  </ProjectHeader>

                  {proj.tasks.map((task) => {
                    const entry          = entries[task.assignmentId] ?? { hours: "", comment: "" };
                    const active         = (parseFloat(entry.hours) || 0) > 0;
                    const allocated      = Number(task.allocatedHours);
                    const rawWorked      = Number(task.workedHours);
                    // workedHours already includes this entry's previously-saved hours when editing — exclude them so we don't double-count
                    const worked         = task.assignmentId === editingAssignmentId ? Math.max(0, rawWorked - editingOldHours) : rawWorked;
                    const entryHrs       = parseFloat(entry.hours) || 0;
                    const projectedWork  = worked + entryHrs;
                    const taskPct        = allocated > 0 ? (projectedWork / allocated) * 100 : 0;
                    const taskExceeded   = allocated > 0 && entryHrs > 0 && projectedWork > allocated;
                    const startLabel     = fmtDate(task.taskStartDate);
                    const endLabel       = fmtDate(task.taskEndDate);
                    return (
                      <TaskCard
                        key={task.assignmentId}
                        ref={(el) => { taskRefs.current[task.assignmentId] = el; }}
                      >
                        <TaskRow>
                          <TaskMeta>
                            <TaskNameRow>
                              <TaskName>{task.taskName}</TaskName>
                              {allocated > 0 && (
                                <TaskMeta2>
                                  <TaskProgressTrack>
                                    <TaskProgressFill $pct={taskPct} />
                                  </TaskProgressTrack>
                                  <TaskProgressLabel $over={taskExceeded}>
                                    {entryHrs > 0 ? projectedWork : worked}h / {allocated}h
                                    {startLabel && endLabel && ` · ${startLabel} – ${endLabel}`}
                                  </TaskProgressLabel>
                                </TaskMeta2>
                              )}
                            </TaskNameRow>
                            <TaskBudget>{task.budgetName}</TaskBudget>
                          </TaskMeta>
                          <HoursWrap>
                            <HoursInput
                              ref={(el) => { hoursInputRefs.current[task.assignmentId] = el; }}
                              type="number"
                              min="0"
                              max="24"
                              step="0.5"
                              placeholder="0"
                              value={entry.hours}
                              $active={active}
                              onChange={(e) => onEntryChange(task.assignmentId, "hours", e.target.value)}
                            />
                            <HoursUnit>h</HoursUnit>
                          </HoursWrap>
                        </TaskRow>

                        <CommentWrap>
                          <CommentInput
                            rows={2}
                            placeholder="What did you work on?"
                            value={entry.comment ?? ""}
                            $error={saveAttempted && invalidIds.has(task.assignmentId)}
                            onChange={(e) => onEntryChange(task.assignmentId, "comment", e.target.value)}
                          />
                          {saveAttempted && invalidIds.has(task.assignmentId) && (
                            <CommentError>Comment is required when hours are logged</CommentError>
                          )}
                        </CommentWrap>
                      </TaskCard>
                    );
                  })}
                </ProjectSection>
              );
            })}
            </MainPanel>
          </MainContent>
        </ModalBody>

        {/* ── Footer ── */}
        <ModalFooter>
          <FooterTotals>
            <FooterToday $over={dayLimitExceeded}>Total for this day: {dayTotal}h</FooterToday>
            <FooterSep>·</FooterSep>
            <FooterWeek $over={weekLimitExceeded}>
              Week after save: <strong>{weekTotal}h</strong> / {targetHours}h
            </FooterWeek>
          </FooterTotals>
          {limitsExceeded && (
            <FooterError>
              <i className="bi bi-exclamation-circle-fill" />
              {anyTaskExceeded
                ? "Task allocation exceeded"
                : dayLimitExceeded && weekLimitExceeded
                ? `Daily (${dailyMaxHours}h) and weekly (${weeklyMaxHours}h) limits exceeded`
                : dayLimitExceeded
                ? `Daily limit of ${dailyMaxHours}h exceeded`
                : `Weekly limit of ${weeklyMaxHours}h exceeded`}
            </FooterError>
          )}
          <FooterButtons>
            <CancelBtn onClick={onClose}>Cancel</CancelBtn>
            <SaveBtn disabled={!hasEntries || isSaving || limitsExceeded} onClick={handleSave}>
              Save entries
            </SaveBtn>
          </FooterButtons>
        </ModalFooter>

      </ModalBox>
    </Overlay>
  );
}
