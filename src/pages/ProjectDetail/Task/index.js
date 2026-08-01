import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { colors, AVATAR_PALETTES, fontSize } from "../../../constants/common";
import { toDisplayDate } from "../../../utils/dateMaker";
import { projectTaskAction } from "../../../store/projectTaskSlice";
import ProgressBar from "../../../components/Progressbar";
import OptionsMenu from "../../../components/OptionsMenu";
import StatusBadge from "../../../components/StatusBadge";
import ConfirmDialog from "../../../components/ConfirmDialog";
import PermissionGate from "../../../components/PermissionGate";
import EmptyState from "../../../components/EmptyState";
import { usePermission } from "../../../hooks/usePermission";
import AddTask from "./modals/AddTask";
import EditTask from "./modals/EditTask";
import TaskDetail from "./modals/TaskDetail";
import {
  TaskWrapper,
  EmptyStateCard,
  BudgetCard, BudgetCardHeader, BudgetHeaderTop,
  BudgetHeaderLeft, BudgetIdBadge, BudgetTitle,
  BudgetHeaderRight, TaskCountChip, HeaderStat,
  BudgetProgressWrap, BudgetProgressMeta,
  TaskTable, Thead, Th,
  Tr, Td, TaskCell, TaskTopRow, TaskDateRange, TaskIdChip, TaskNameText,
  AvatarRow, AvatarChip,
  ProgressCell, ProgressMeta, EmptyCell,
  TotalRow, TotalLabelTd, TotalValueTd,
  AddTaskRow, AddTaskCell, AddTaskLink,
} from "./component.styles";
import Tooltip from "../../../components/Tooltip";

const fmt = (v) =>
  `$${Number(v || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const fmtTaskDateRange = (start, end) => {
  const s = toDisplayDate(start);
  const e = toDisplayDate(end);
  if (s && e) return `${s} – ${e}`;
  return s || e || "";
};

const getPalette = (name = "") =>
  AVATAR_PALETTES[(name.charCodeAt(0) || 0) % AVATAR_PALETTES.length];

const getTaskAssignmentTotals = (task) =>
  (task?.assignments || []).reduce(
    (acc, a) => {
      const hrs      = parseFloat(a.assignmentAllocatedHours || a.allocatedHours || 0);
      const rate     = parseFloat(a.assignmentAllocatedRate || a.rate || 0);
      const spentHrs = parseFloat(a.assignmentWorkedHours || a.hoursSpent || 0);
      return {
        allocHours: acc.allocHours + hrs,
        spentHours: acc.spentHours + spentHrs,
        allocCost:  acc.allocCost  + rate * hrs,
        spentCost:  acc.spentCost  + rate * spentHrs,
      };
    },
    { allocHours: 0, spentHours: 0, allocCost: 0, spentCost: 0 }
  );

function Task({ data, refreshProjectData, focusBudgetId }) {
  const dispatch = useDispatch();
  const { id: pid } = useParams();

  const budgetRefs = useRef({});
  const [highlightedBudgetId, setHighlightedBudgetId] = useState(null);

  const [showModalAdd,    setShowModalAdd]    = useState(false);
  const [showModalEdit,   setShowModalEdit]   = useState(false);
  const [showModalRemove, setShowModalRemove] = useState(false);
  const [addBudgetId,     setAddBudgetId]     = useState(null);
  const [addBudgetName,   setAddBudgetName]   = useState("");
  const [showTaskDetail,  setShowTaskDetail]  = useState(false);
  const [selectedTaskId,   setSelectedTaskId]   = useState(null);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);
  const [selectedTaskIdRemove, setSelectedTaskIdRemove] = useState(null);
  const [editData, setEditData] = useState({
    budget_id: "", budget_name: "", task_id: "", task_name: "", task_type: "", start_date: "", end_date: "",
  });

  const canEditTask   = usePermission("canTaskUpdate");
  const canDeleteTask = usePermission("canTaskDelete");
  const canViewAssignments = usePermission("canTaskAssRead");

  // GET responses return display strings ("Billable", "Non-Billable") — same check as EditProject.js
  const isBillable = /billable/i.test(data?.projectType || "") && !/non/i.test(data?.projectType || "");

  const { tasks: budgets, deletingTaskId } = useSelector((s) => s?.projectTask) || { tasks: [], deletingTaskId: null };

  useEffect(() => {
    if (pid) {
      dispatch(projectTaskAction.fetchTasksStart(pid));
    }
  }, [dispatch, pid]);

  // Close modal when deletion completes (deletingTaskId returns to null after being set)
  const prevDeletingTaskIdRef = useRef(null);
  useEffect(() => {
    if (prevDeletingTaskIdRef.current !== null && deletingTaskId === null && showModalRemove) {
      setShowModalRemove(false);
      setSelectedTaskIdRemove(null);
    }
    prevDeletingTaskIdRef.current = deletingTaskId;
  }, [deletingTaskId, showModalRemove]);

  const openAdd = (bid, budgetName) => { setAddBudgetId(bid); setAddBudgetName(budgetName || ""); setShowModalAdd(true); };

  const openTaskDetail = (task, budget) => { setSelectedTaskId(task.taskId); setSelectedBudgetId(budget.budgetId); setShowTaskDetail(true); };

  const selectedBudget = budgets.find((b) => b.budgetId === selectedBudgetId) || null;
  const selectedTask   = selectedBudget?.tasks?.find((t) => t.taskId === selectedTaskId) || null;

  const openEdit = (taskId, budgetId, taskName, taskType, startDate, endDate) => {
    const budgetName = budgets.find((b) => b.budgetId === budgetId)?.budgetName || "";
    setEditData({ budget_id: budgetId ?? "", budget_name: budgetName, task_id: taskId ?? "", task_name: taskName || "", task_type: taskType || "", start_date: startDate || "", end_date: endDate || "" });
    setShowModalEdit(true);
  };

  const openRemove = (tid) => { setSelectedTaskIdRemove(tid); setShowModalRemove(true); };

  useEffect(() => {
    if (!focusBudgetId || budgets.length === 0) return;
    const targetId = Number(focusBudgetId);
    const node = budgetRefs.current[targetId];
    if (!node) return;

    node.scrollIntoView({ behavior: "smooth", block: "start" });
    setHighlightedBudgetId(targetId);
    const timer = setTimeout(() => setHighlightedBudgetId(null), 2000);
    return () => clearTimeout(timer);
  }, [focusBudgetId, budgets]);

  const handleRemoveTask = () => {
    dispatch(projectTaskAction.deleteTaskStart(selectedTaskIdRemove));
  };


  return (
    <div>
      <TaskWrapper>
        {budgets.length > 0 ? budgets.map((budget) => {
          const tasks           = budget?.tasks || [];
          const totalHours      = tasks.reduce((s, t) => s + getTaskAssignmentTotals(t).spentHours, 0);
          const totalAllocHours = tasks.reduce((s, t) => s + getTaskAssignmentTotals(t).allocHours, 0);
          const budgetAmount    = Number(budget?.budgetAmount || 0);
          const burntAmount     = Number(budget?.burntAmount || 0);
          const spentPct        = Number(budget?.spentPercentage || 0);

          return (
            <BudgetCard
              key={budget.budgetId}
              ref={(el) => { budgetRefs.current[budget.budgetId] = el; }}
              $focused={highlightedBudgetId === budget.budgetId}
            >
              <BudgetCardHeader>
                <BudgetHeaderTop>
                  <BudgetHeaderLeft>
                    <BudgetIdBadge>BD{String(budget.budgetId).padStart(5, "0")}</BudgetIdBadge>
                    <BudgetTitle>{budget.budgetName}</BudgetTitle>
                  </BudgetHeaderLeft>
                  <BudgetHeaderRight>
                    <TaskCountChip>
                      <i className="bi bi-list-check" />
                      {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
                    </TaskCountChip>
                    {budgetAmount > 0 && (
                      <HeaderStat><strong>{fmt(burntAmount)}</strong> / {fmt(budgetAmount)}</HeaderStat>
                    )}
                  </BudgetHeaderRight>
                </BudgetHeaderTop>
                {budgetAmount > 0 && (
                  <BudgetProgressWrap>
                    <div style={{ flex: 1 }}>
                      <ProgressBar value={spentPct} showLabel={false} height={5} />
                    </div>
                    <BudgetProgressMeta>{spentPct}% of budget amount used</BudgetProgressMeta>
                  </BudgetProgressWrap>
                )}
              </BudgetCardHeader>

              <TaskTable>
                <Thead>
                  <tr>
                    <Th>Task</Th>
                    <Th>Allocations</Th>
                    <Th>Hours Progress</Th>
                    <Th>Cost Progress</Th>
                    <Th style={{ textAlign: 'right' }}>Status</Th>
                    <Th style={{ textAlign: 'right' }} />
                  </tr>
                </Thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr>
                      <EmptyCell colSpan={6}>
                        <EmptyState
                          icon="bi-list-check"
                          title="No tasks yet"
                          subtitle="Add a task to this budget to start tracking work."
                        />
                      </EmptyCell>
                    </tr>
                  ) : tasks.map((task) => {
                    const { allocHours, spentHours, allocCost, spentCost } = getTaskAssignmentTotals(task);
                    const hPct = allocHours > 0 ? Math.round((spentHours / allocHours) * 100) : 0;
                    const cPct = allocCost > 0 ? Math.round((spentCost / allocCost) * 100) : 0;

                    return (
                      <Tr
                        key={`task-${task.taskId}`}
                        onClick={canViewAssignments ? () => openTaskDetail(task, budget) : undefined}
                        style={canViewAssignments ? undefined : { cursor: "default" }}
                      >
                        <Td style={{ minWidth: 200 }}>
                          <TaskCell>
                            <TaskTopRow>
                              <TaskIdChip>T{String(task.taskId).padStart(5, "0")}</TaskIdChip>
                              {(task.taskStartDate || task.taskEndDate) && (
                                <TaskDateRange>
                                  {fmtTaskDateRange(task.taskStartDate, task.taskEndDate)}
                                </TaskDateRange>
                              )}
                            </TaskTopRow>
                            <TaskNameText>{task.taskName}</TaskNameText>
                          </TaskCell>
                        </Td>
                        <Td>
                          <AvatarRow>
                            {task.assignments?.length > 0
                              ? task.assignments.map((a, i) => {
                                  const p    = getPalette(a.employee?.firstName || "");
                                  const name = `${a.employee?.firstName || ""} ${a.employee?.lastName || ""}`.trim();
                                  return (
                                    <Tooltip key={i} title={name}>
                                      <AvatarChip $bg={p.bg} $color={p.color}>
                                        {((a.employee?.firstName?.[0] || "") + (a.employee?.lastName?.[0] || "")).toUpperCase()}
                                      </AvatarChip>
                                    </Tooltip>
                                  );
                                })
                              : <span style={{ fontSize: fontSize.subtitle, color: colors.textMuted }}>Unassigned</span>
                            }
                          </AvatarRow>
                        </Td>
                        <Td>
                          <ProgressCell>
                            <ProgressBar value={hPct} showLabel={false} height={6} />
                            <ProgressMeta>
                              <span>{spentHours.toFixed(1)}h of {allocHours.toFixed(1)}h</span>
                              <span>{hPct}%</span>
                            </ProgressMeta>
                          </ProgressCell>
                        </Td>
                        <Td>
                          <ProgressCell>
                            <ProgressBar value={cPct} showLabel={false} height={6} />
                            <ProgressMeta>
                              <span>{fmt(spentCost)} of {fmt(allocCost)}</span>
                              <span>{cPct}%</span>
                            </ProgressMeta>
                          </ProgressCell>
                        </Td>
                        <Td><StatusBadge status={task.status} /></Td>
                        <Td onClick={(e) => e.stopPropagation()}>
                          <OptionsMenu
                            items={[
                              { icon: "bi-pencil", label: "Edit Task",   onClick: () => openEdit(task.taskId, budget.budgetId, task.taskName, task.taskType, task.taskStartDate, task.taskEndDate), show: canEditTask },
                              { icon: "bi-trash",  label: "Remove Task", onClick: () => openRemove(task.taskId), show: canDeleteTask, danger: true, dividerBefore: true },
                            ]}
                          />
                        </Td>
                      </Tr>
                    );
                  })}
                  <AddTaskRow>
                    <AddTaskCell colSpan={6}>
                      <PermissionGate can="canTaskAdd">
                        <AddTaskLink onClick={() => openAdd(budget.budgetId, budget.budgetName)}>
                          <i className="bi bi-plus-circle" /> Add task
                        </AddTaskLink>
                      </PermissionGate>
                    </AddTaskCell>
                  </AddTaskRow>
                  <TotalRow>
                    <TotalLabelTd colSpan={2}>Total</TotalLabelTd>
                    <TotalValueTd>{totalHours.toFixed(1)}/{totalAllocHours.toFixed(1)} hrs</TotalValueTd>
                    <TotalValueTd>{fmt(burntAmount)}/{fmt(budgetAmount)}</TotalValueTd>
                    <TotalValueTd />
                    <TotalValueTd />
                  </TotalRow>
                </tbody>
              </TaskTable>
            </BudgetCard>
          );
        }) : (
          <EmptyStateCard>
            <EmptyState
              icon="bi-list-check"
              title="No tasks yet"
              subtitle="Add a budget first, then break it into tasks to start tracking work."
            />
          </EmptyStateCard>
        )}
      </TaskWrapper>

      {showTaskDetail && selectedTask && (
        <TaskDetail
          task={selectedTask}
          budget={selectedBudget}
          isBillable={isBillable}
          onClose={() => setShowTaskDetail(false)}
        />
      )}

      {showModalAdd && (
        <AddTask budgetId={addBudgetId} budgetName={addBudgetName} onClose={() => setShowModalAdd(false)} />
      )}
      {showModalEdit && (
        <EditTask editData={editData} onClose={() => setShowModalEdit(false)} />
      )}
      {showModalRemove && (
        <ConfirmDialog
          title="Delete Task"
          message="Permanently delete this task? This action cannot be undone."
          confirmLabel="Delete"
          variant="danger"
          onConfirm={handleRemoveTask}
          onCancel={() => setShowModalRemove(false)}
        />
      )}
    </div>
  );
}

export default Task;
