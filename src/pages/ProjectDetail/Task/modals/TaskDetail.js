import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AVATAR_PALETTES, colors, fontSize } from "../../../../constants/common";
import { FormInput, InputWrapper, InputSlot } from "../../../../components/FormField/component.styles";
import { FormSearchDropdown } from "../../../../components/FormField";
import ProgressBar from "../../../../components/Progressbar";
import OptionsMenu from "../../../../components/OptionsMenu";
import StatusBadge from "../../../../components/StatusBadge";
import ConfirmDialog from "../../../../components/ConfirmDialog";
import PermissionGate from "../../../../components/PermissionGate";
import { usePermission } from "../../../../hooks/usePermission";
import {
  Overlay, ModalBox, ModalBody,
  ModalHeader, ModalTitle, CloseBtn, ModalFooter,
} from "../../../../components/ModalShell";
import {
  HeaderMeta, HeaderTaskId, HeaderDot, HeaderTaskName,
  StatSection, StatSectionBudgetName, StatGrid, StatTile,
  StatTileLabel, StatTileValue, StatTileSub,
  AllocTable, AllocThead, AllocTh, AllocTr, AllocSpacerTr, AllocTd,
  UserCell, UserAvatar, UserNameText, RateChip,
  HrsCell, HrsPrimary, HrsSecondary,
  BurnProgress, BurnProgressMeta,
  InlineAllocRow, InlineAmount, InlineSaveBtn, InlineCancelBtn,
  AddAllocRow, AddAllocCell, AddAllocLink,
  FooterLeft, FooterTotalLabel, FooterDot, FooterStat, FooterStatLabel,
  FooterStatHrs, FooterStatAmt, FooterProgress, FooterProgressMeta,
  EmptyTd,
} from "./taskDetail.styles";
import { projectTaskAction } from "../../../../store/projectTaskSlice";

const STATUS_LABELS = { 0: "Not Started", 1: "In Progress", 2: "Complete" };

const EMPTY_ALLOC = { userId: "", rate: "", expectedHrs: "" };

const fmt = (v) =>
  `$${Number(v || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const getPalette = (name = "") =>
  AVATAR_PALETTES[(name.charCodeAt(0) || 0) % AVATAR_PALETTES.length];

const getBarColor = (pct) =>
  pct >= 100 ? colors.accentRed :
  pct >= 80  ? colors.accentAmber :
  colors.accentBlue;

export default function TaskDetail({ task, budget, isBillable = false, onClose }) {
  const dispatch = useDispatch();
  const { id: pid } = useParams();
  const employees = useSelector(s => s.projectTask.employees);
  const addingAssignment = useSelector(s => s.projectTask.addingAssignment);
  const deletingAssignmentId = useSelector(s => s.projectTask.deletingAssignmentId);
  const updatingAssignmentId = useSelector(s => s.projectTask.updatingAssignmentId);

  const canEditAssignment   = usePermission("canTaskAssUpdate");
  const canDeleteAssignment = usePermission("canTaskAssDelete");

  useEffect(() => {
    dispatch(projectTaskAction.fetchEmployeesStart());
  }, [dispatch]);

  const [showAddAlloc,  setShowAddAlloc]  = useState(false);
  const [allocForm,     setAllocForm]     = useState(EMPTY_ALLOC);
  const [editAllocIdx,  setEditAllocIdx]  = useState(null);
  const [editAllocForm, setEditAllocForm] = useState(EMPTY_ALLOC);
  const [editAllocMinHrs, setEditAllocMinHrs] = useState(0);
  const [removeAllocId, setRemoveAllocId] = useState(null);
  const [attemptedSave, setAttemptedSave] = useState(false);
  const [editAttemptedSave, setEditAttemptedSave] = useState(false);

  const prevAddingAssignmentRef = useRef(false);
  useEffect(() => {
    if (prevAddingAssignmentRef.current && !addingAssignment) {
      setShowAddAlloc(false);
      setAllocForm(EMPTY_ALLOC);
      setAttemptedSave(false);
      setEditAllocIdx(null);
      setEditAllocForm(EMPTY_ALLOC);
    }
    prevAddingAssignmentRef.current = addingAssignment;
  }, [addingAssignment]);

  const prevDeletingAssignmentIdRef = useRef(null);
  useEffect(() => {
    if (prevDeletingAssignmentIdRef.current !== null && deletingAssignmentId === null) {
      setRemoveAllocId(null);
    }
    prevDeletingAssignmentIdRef.current = deletingAssignmentId;
  }, [deletingAssignmentId]);

  const prevUpdatingAssignmentIdRef = useRef(null);
  useEffect(() => {
    if (prevUpdatingAssignmentIdRef.current !== null && updatingAssignmentId === null) {
      setEditAllocIdx(null);
      setEditAllocForm(EMPTY_ALLOC);
      setEditAllocMinHrs(0);
      setEditAttemptedSave(false);
    }
    prevUpdatingAssignmentIdRef.current = updatingAssignmentId;
  }, [updatingAssignmentId]);

  const allocations = task?.assignments || [];

  const editingEmployeeId = editAllocIdx != null
    ? String(allocations[editAllocIdx]?.employee?.employeeId ?? allocations[editAllocIdx]?.employeeId ?? "")
    : null;
  const assignedEmployeeIds = new Set(
    allocations.map((a) => a.employee?.employeeId ?? a.employeeId).filter((id) => id != null).map(String)
  );
  const toOptions = (list) => list.map((e) => ({ label: `${e.firstName} ${e.lastName}`, value: e.employeeId }));
  const USER_OPTIONS = toOptions(employees.filter((e) => !assignedEmployeeIds.has(String(e.employeeId))));
  const EDIT_USER_OPTIONS = toOptions(
    employees.filter((e) => !assignedEmployeeIds.has(String(e.employeeId)) || String(e.employeeId) === editingEmployeeId)
  );

  const setField     = (field, value) => setAllocForm((f) => ({ ...f, [field]: value }));
  const setEditField = (field, value) => setEditAllocForm((f) => ({ ...f, [field]: value }));

  const handleAddUserSelect = (userId) => {
    const emp = employees.find((e) => String(e.employeeId) === String(userId));
    setAllocForm((f) => ({
      ...f,
      userId,
      rate: emp?.billableRate != null ? String(parseFloat(emp.billableRate)) : "",
    }));
  };

  const cancelAdd  = () => { setShowAddAlloc(false); setAllocForm(EMPTY_ALLOC); setAttemptedSave(false); };
  const cancelEdit = () => { setEditAllocIdx(null);  setEditAllocForm(EMPTY_ALLOC); setEditAllocMinHrs(0); setEditAttemptedSave(false); };

  const openEditAlloc = (i, a) => {
    const employeeId = a.employee?.employeeId || a.employeeId;
    setEditAllocIdx(i);
    setEditAllocForm({ userId: employeeId ? String(employeeId) : "", rate: String(parseFloat(a.assignmentAllocatedRate || a.rate || "30")), expectedHrs: String(parseFloat(a.assignmentAllocatedHours || a.allocatedHours || a.expected_hrs || "")) });
    setEditAllocMinHrs(parseFloat(a.assignmentWorkedHours || a.hoursSpent || a.worked_hrs || 0));
    setEditAttemptedSave(false);
  };

  const handleRemoveAssignment = () => {
    dispatch(projectTaskAction.deleteAssignmentStart({ assignmentId: removeAllocId, projectId: pid }));
  };

  const allocAmount     = (parseFloat(allocForm.rate)     || 0) * (parseFloat(allocForm.expectedHrs)     || 0);
  const editAllocAmount = (parseFloat(editAllocForm.rate) || 0) * (parseFloat(editAllocForm.expectedHrs) || 0);

  // User selection is always required; hours are only required for billable projects.
  const userMissing      = !allocForm.userId;
  const hoursMissing      = !(parseFloat(allocForm.expectedHrs) > 0);
  const showUserError    = attemptedSave && userMissing;
  const showHoursError   = attemptedSave && isBillable && hoursMissing;

  const editUserMissing    = !editAllocForm.userId;
  const editHoursMissing   = !(parseFloat(editAllocForm.expectedHrs) > 0);
  const editBelowMinHrs    = parseFloat(editAllocForm.expectedHrs) < editAllocMinHrs;
  const showEditUserError  = editAttemptedSave && editUserMissing;
  const showEditHoursError = editAttemptedSave && ((isBillable && editHoursMissing) || editBelowMinHrs);

  const handleSaveAdd = () => {
    if (userMissing || (isBillable && hoursMissing)) {
      setAttemptedSave(true);
      return;
    }
    dispatch(projectTaskAction.addAssignmentStart({
      taskId: task.taskId,
      employeeId: parseInt(allocForm.userId),
      allocatedHours: hoursMissing ? 0 : parseFloat(allocForm.expectedHrs),
      allocatedRate: parseFloat(allocForm.rate),
      projectId: pid,
    }));
  };

  const handleSaveEdit = (assignmentId) => {
    if (editUserMissing || (isBillable && editHoursMissing) || editBelowMinHrs) {
      setEditAttemptedSave(true);
      return;
    }
    dispatch(projectTaskAction.updateAssignmentStart({
      assignmentId,
      allocatedHours: editHoursMissing ? 0 : parseFloat(editAllocForm.expectedHrs),
      allocatedRate: parseFloat(editAllocForm.rate),
      projectId: pid,
    }));
  };

  const costSpent = parseFloat(task?.costSpent) || 0;
  const hoursSpent = parseFloat(task?.hoursSpent) || 0;

  // overrideIdx/overrideVals let the row currently being edited contribute its live,
  // not-yet-saved hrs/rate to the totals (mirrors the "Add assignment" draft preview below).
  const getAssignmentTotals = (assignments, overrideIdx, overrideVals) =>
    (assignments || []).reduce(
      (acc, a, idx) => {
        const isOverride = overrideIdx != null && idx === overrideIdx;
        const hrs = isOverride
          ? (parseFloat(overrideVals.expectedHrs) || 0)
          : parseFloat(a.assignmentAllocatedHours || a.allocatedHours || a.expected_hrs || 0);
        const rate = isOverride
          ? (parseFloat(overrideVals.rate) || 0)
          : parseFloat(a.assignmentAllocatedRate || a.rate || 0);
        const spentHrs = parseFloat(a.assignmentWorkedHours || a.hoursSpent || a.worked_hrs || 0);
        return {
          expected_hrs:  acc.expected_hrs  + hrs,
          expected_cost: acc.expected_cost + rate * hrs,
          worked_hrs:    acc.worked_hrs    + spentHrs,
          worked_cost:   acc.worked_cost   + rate * spentHrs,
        };
      },
      { expected_hrs: 0, expected_cost: 0, worked_hrs: 0, worked_cost: 0 }
    );

  const totals = getAssignmentTotals(allocations, editAllocIdx, editAllocForm);

  // Live preview while a new assignment is being typed in the "Add assignment" row:
  // expected burn = existing assignments' expected total + the draft row's typed hours.
  const draftExpectedHrs  = showAddAlloc ? (parseFloat(allocForm.expectedHrs) || 0) : 0;
  const draftExpectedCost = draftExpectedHrs * (parseFloat(allocForm.rate) || 0);

  const liveTotals = {
    expected_hrs:  totals.expected_hrs  + draftExpectedHrs,
    expected_cost: totals.expected_cost + draftExpectedCost,
    worked_hrs:    totals.worked_hrs,
    worked_cost:   totals.worked_cost,
  };

  const totalPct = liveTotals.expected_hrs > 0
    ? Math.min(Math.round((liveTotals.worked_hrs / liveTotals.expected_hrs) * 100), 100)
    : 0;

  // Budget-wide totals (the "Total Budget · <name>" section above the table): sum every
  // task in this budget's own allocated/burned figures, substituting the open task's live
  // draft-preview totals so a new assignment being typed here updates the section instantly.
  const budgetTotals = (budget?.tasks || []).reduce(
    (acc, t) => {
      const isCurrent = t.taskId === task?.taskId;
      const tTotals = isCurrent ? liveTotals : getAssignmentTotals(t.assignments);
      const tCostSpent = isCurrent ? costSpent : (parseFloat(t.costSpent) || 0);
      const tHoursSpent = isCurrent ? hoursSpent : (parseFloat(t.hoursSpent) || 0);
      return {
        expected_hrs:  acc.expected_hrs  + tTotals.expected_hrs,
        expected_cost: acc.expected_cost + tTotals.expected_cost,
        cost_spent:    acc.cost_spent    + tCostSpent,
        hours_spent:   acc.hours_spent   + tHoursSpent,
      };
    },
    { expected_hrs: 0, expected_cost: 0, cost_spent: 0, hours_spent: 0 }
  );

  const burnPct = budgetTotals.expected_cost > 0
    ? Math.min(Math.round((budgetTotals.cost_spent / budgetTotals.expected_cost) * 100), 100)
    : 0;

  const remaining     = budgetTotals.expected_cost - budgetTotals.cost_spent;
  const remainingHrs  = budgetTotals.expected_hrs - budgetTotals.hours_spent;
  const isOverrun     = remaining < 0;

  const budgetAmount   = parseFloat(budget?.budgetAmount || budget?.budget || 0);
  const isOverBudget   = budgetTotals.expected_cost > budgetAmount;

  return (
    <>
    <Overlay onClick={onClose}>
      <ModalBox $maxWidth="860px" onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div>
            <ModalTitle>{task.taskName || task.task_name}</ModalTitle>
            <HeaderMeta>
              <HeaderTaskId>T{String(task.taskId || task.task_id).padStart(5, "0")}</HeaderTaskId>
              <HeaderDot>·</HeaderDot>
              <HeaderTaskName>Task Assignments</HeaderTaskName>
              <HeaderDot>·</HeaderDot>
              <StatusBadge status={STATUS_LABELS[task.status ?? 0]} />
            </HeaderMeta>
          </div>
          <CloseBtn aria-label="Close" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </CloseBtn>
        </ModalHeader>

        <StatSection>
          <StatSectionBudgetName>Total Budget · {budget?.budgetName || budget?.budget_name}</StatSectionBudgetName>
          <StatGrid>
            <StatTile>
              <StatTileLabel>Budget</StatTileLabel>
              <StatTileValue $color={colors.accentBlue}>{fmt(budget?.budgetAmount || budget?.budget || 0)}</StatTileValue>
            </StatTile>
            <StatTile>
              <StatTileLabel>Allocated</StatTileLabel>
              <StatTileValue $color={isOverBudget ? colors.accentRed : colors.accentAmber}>
                {fmt(budgetTotals.expected_cost)}
              </StatTileValue>
              <StatTileSub>{budgetTotals.expected_hrs.toFixed(1)} hrs</StatTileSub>
            </StatTile>
            <StatTile>
              <StatTileLabel>Burned</StatTileLabel>
              <StatTileValue $color={burnPct >= 100 ? colors.accentRed : colors.accentAmber}>
                {fmt(budgetTotals.cost_spent)}
              </StatTileValue>
              <StatTileSub>{budgetTotals.hours_spent.toFixed(1)} hrs</StatTileSub>
            </StatTile>
            <StatTile>
              <StatTileLabel>Left to burn</StatTileLabel>
              <StatTileValue $color={isOverrun ? colors.accentRed : colors.accentGreen}>
                {fmt(Math.abs(remaining))}
              </StatTileValue>
              <StatTileSub>{Math.abs(remainingHrs).toFixed(1)} hrs{isOverrun ? " over" : ""}</StatTileSub>
            </StatTile>
          </StatGrid>
        </StatSection>

        <ModalBody style={{ padding: 0 }}>
          {/* Assignment table */}
          <AllocTable>
            <colgroup>
              <col style={{ width: "29%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "19%" }} />
              <col style={{ width: "8%" }} />
            </colgroup>
            <AllocThead>
              <tr>
                <AllocTh>Assigned Users</AllocTh>
                <AllocTh>Billable Rate</AllocTh>
                <AllocTh>Allocated</AllocTh>
                <AllocTh>Burned</AllocTh>
                <AllocTh style={{ textAlign: "right" }}>Progress</AllocTh>
                <AllocTh />
              </tr>
            </AllocThead>
            <tbody>
              {allocations.length === 0 ? (
                <tr>
                  <EmptyTd colSpan={6}>
                    <i className="bi bi-people" />
                    No assignments for this task
                  </EmptyTd>
                </tr>
              ) : allocations.map((a, i) => {
                if (editAllocIdx === i) {
                  return (
                    <InlineAllocRow key={i}>
                      <AllocTd>
                        <FormSearchDropdown
                          value={editAllocForm.userId}
                          onChange={(v) => setEditField("userId", v)}
                          placeholder="Select user…"
                          options={EDIT_USER_OPTIONS}
                          $error={showEditUserError}
                          disabled
                        />
                      </AllocTd>
                      <AllocTd>
                        <InputWrapper>
                          <InputSlot>$</InputSlot>
                          <FormInput
                            type="number"
                            placeholder="0"
                            value={editAllocForm.rate}
                            $hasStart
                            readOnly
                            tabIndex={-1}
                            style={{ cursor: "default", background: colors.backgroundGray }}
                          />
                        </InputWrapper>
                      </AllocTd>
                      <AllocTd>
                        <FormInput
                          type="number"
                          placeholder="0"
                          value={editAllocForm.expectedHrs}
                          $error={showEditHoursError}
                          onChange={(e) => setEditField("expectedHrs", e.target.value)}
                        />
                        {editAllocMinHrs > 0 && editAllocForm.expectedHrs !== "" && parseFloat(editAllocForm.expectedHrs) < editAllocMinHrs && (
                          <div style={{ fontSize: fontSize.subtitle, color: colors.accentRed, marginTop: 2 }}>
                            Can't be less than {editAllocMinHrs.toFixed(1)} hrs already burned
                          </div>
                        )}
                      </AllocTd>
                      <AllocTd>
                        {editAllocAmount > 0 && (
                          <>
                            <InlineAmount style={{ fontSize: fontSize.subtitle, fontStyle: "normal", marginBottom: 1 }}>Expected</InlineAmount>
                            <InlineAmount style={{ fontSize: fontSize.highlight, fontWeight: 600, color: "inherit", fontStyle: "normal" }}>{fmt(editAllocAmount)}</InlineAmount>
                          </>
                        )}
                      </AllocTd>
                      <AllocTd style={{ textAlign: "right" }}>
                        <InlineSaveBtn
                          disabled={updatingAssignmentId === a.assignmentId}
                          onClick={() => handleSaveEdit(a.assignmentId)}
                        >
                          {updatingAssignmentId === a.assignmentId ? "Saving..." : "Save"}
                        </InlineSaveBtn>
                      </AllocTd>
                      <AllocTd style={{ textAlign: "right" }}>
                        <InlineCancelBtn onClick={cancelEdit}>
                          <i className="bi bi-x" />
                        </InlineCancelBtn>
                      </AllocTd>
                    </InlineAllocRow>
                  );
                }

                const firstName = a.employee?.firstName || a.first_name || "";
                const lastName = a.employee?.lastName || a.last_name || "";
                const p        = getPalette(firstName || "U");
                const initials = ((firstName?.[0] || "") + (lastName?.[0] || "")).toUpperCase();
                const allocHrs = parseFloat(a.assignmentAllocatedHours || a.allocatedHours || a.expected_hrs || 0);
                const spentHrs = parseFloat(a.assignmentWorkedHours || a.hoursSpent || a.worked_hrs || 0);
                const rate = parseFloat(a.assignmentAllocatedRate || a.rate || 0);
                const hPct     = allocHrs > 0
                  ? Math.min(Math.round((spentHrs / allocHrs) * 100), 100)
                  : 0;
                const expCost  = rate * allocHrs;
                const wrkCost  = rate * spentHrs;

                return (
                  <AllocTr key={i}>
                    <AllocTd>
                      <UserCell>
                        <UserAvatar $bg={p.bg} $color={p.color}>{initials}</UserAvatar>
                        <UserNameText>{firstName} {lastName}</UserNameText>
                      </UserCell>
                    </AllocTd>
                    <AllocTd><RateChip>${rate.toFixed(2)}/hr</RateChip></AllocTd>
                    <AllocTd>
                      <HrsCell>
                        <HrsPrimary>{allocHrs.toFixed(1)} hrs</HrsPrimary>
                        <HrsSecondary>{fmt(expCost)}</HrsSecondary>
                      </HrsCell>
                    </AllocTd>
                    <AllocTd>
                      <HrsCell>
                        <HrsPrimary>{spentHrs.toFixed(1)} hrs</HrsPrimary>
                        <HrsSecondary>{fmt(wrkCost)}</HrsSecondary>
                      </HrsCell>
                    </AllocTd>
                    <AllocTd style={{ textAlign: "right" }}>
                      <BurnProgress>
                        <ProgressBar value={hPct} showLabel={false} height={5} color={getBarColor(hPct)} />
                        <BurnProgressMeta>{hPct}%</BurnProgressMeta>
                      </BurnProgress>
                    </AllocTd>
                    <AllocTd style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                      <OptionsMenu
                        items={[
                          { icon: "bi-pencil", label: "Edit",   onClick: () => openEditAlloc(i, a), show: canEditAssignment },
                          {
                            icon: "bi-trash",
                            label: "Remove",
                            onClick: () => setRemoveAllocId(a.assignmentId),
                            danger: true,
                            dividerBefore: true,
                            disabled: spentHrs > 0,
                            disabledReason: "Can't remove an assignment with burned hours",
                            show: canDeleteAssignment,
                          },
                        ]}
                      />
                    </AllocTd>
                  </AllocTr>
                );
              })}
              <AllocSpacerTr style={{ height: 72 }}>
                <AllocTd colSpan={6} />
              </AllocSpacerTr>
              {showAddAlloc && (
                <InlineAllocRow>
                  <AllocTd>
                    <FormSearchDropdown
                      value={allocForm.userId}
                      onChange={handleAddUserSelect}
                      placeholder="Select user…"
                      options={USER_OPTIONS}
                      $error={showUserError}
                    />
                  </AllocTd>
                  <AllocTd>
                    <InputWrapper>
                      <InputSlot>$</InputSlot>
                      <FormInput
                        type="number"
                        placeholder="0"
                        value={allocForm.rate}
                        $hasStart
                        readOnly
                        tabIndex={-1}
                        style={{ cursor: "default", background: colors.backgroundGray }}
                      />
                    </InputWrapper>
                  </AllocTd>
                  <AllocTd>
                    <FormInput
                      type="number"
                      placeholder="0"
                      value={allocForm.expectedHrs}
                      $error={showHoursError}
                      onChange={(e) => setField("expectedHrs", e.target.value)}
                    />
                  </AllocTd>
                  <AllocTd>
                    {allocAmount > 0 && (
                      <>
                        <InlineAmount style={{ fontSize: fontSize.subtitle, fontStyle: "normal", marginBottom: 1 }}>Expected</InlineAmount>
                        <InlineAmount style={{ fontSize: fontSize.highlight, fontWeight: 600, color: "inherit", fontStyle: "normal" }}>{fmt(allocAmount)}</InlineAmount>
                      </>
                    )}
                  </AllocTd>
                  <AllocTd style={{ textAlign: "right" }}>
                    <InlineSaveBtn disabled={addingAssignment} onClick={handleSaveAdd}>
                      {addingAssignment ? "Saving..." : "Save"}
                    </InlineSaveBtn>
                  </AllocTd>
                  <AllocTd style={{ textAlign: "right" }}>
                    <InlineCancelBtn onClick={cancelAdd}>
                      <i className="bi bi-x" />
                    </InlineCancelBtn>
                  </AllocTd>
                </InlineAllocRow>
              )}
              <AddAllocRow>
                <AddAllocCell colSpan={6}>
                  <PermissionGate can="canTaskAssAdd">
                    <AddAllocLink onClick={() => setShowAddAlloc(true)}>
                      <i className="bi bi-plus-circle" /> Add assignment
                    </AddAllocLink>
                  </PermissionGate>
                </AddAllocCell>
              </AddAllocRow>
            </tbody>
          </AllocTable>
        </ModalBody>

        <ModalFooter>
          <FooterLeft>
            <FooterTotalLabel>Total for this task</FooterTotalLabel>
            <FooterDot>·</FooterDot>
            <FooterStat>
              <FooterStatLabel>Expected</FooterStatLabel>
              <FooterStatHrs>{liveTotals.expected_hrs.toFixed(1)} hrs</FooterStatHrs>
              <FooterStatAmt>{fmt(liveTotals.expected_cost)}</FooterStatAmt>
            </FooterStat>
            <FooterDot>·</FooterDot>
            <FooterStat>
              <FooterStatLabel>Burned</FooterStatLabel>
              <FooterStatHrs>{liveTotals.worked_hrs.toFixed(1)} hrs</FooterStatHrs>
              <FooterStatAmt>{fmt(liveTotals.worked_cost)}</FooterStatAmt>
            </FooterStat>
          </FooterLeft>
          <FooterProgress>
            <ProgressBar value={totalPct} showLabel={false} height={5} color={getBarColor(totalPct)} />
            <FooterProgressMeta>
              {liveTotals.worked_hrs.toFixed(1)} / {liveTotals.expected_hrs.toFixed(1)} hrs · {totalPct}%
            </FooterProgressMeta>
          </FooterProgress>
        </ModalFooter>
      </ModalBox>
    </Overlay>

    {removeAllocId != null && (
      <ConfirmDialog
        title="Remove Assignment"
        message="Remove this employee from the task? This action cannot be undone."
        confirmLabel="Remove"
        variant="danger"
        onConfirm={handleRemoveAssignment}
        onCancel={() => setRemoveAllocId(null)}
      />
    )}
    </>
  );
}
