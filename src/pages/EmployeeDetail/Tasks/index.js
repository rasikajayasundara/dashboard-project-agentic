import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../../components/DataTable";
import FilterBar from "../../../components/FilterBar";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { employeesAction } from "../../../store/employeesSlice";
import { toDisplayDate } from "../../../utils/dateMaker";
import { DueTag, TaskIdChip } from "./component.styles";

const BASE_TASK_COLUMNS = [
  { key: "task",     label: "Task",        sortable: true,  index: 0 },
  { key: "project",  label: "Project",     sortable: true,  index: 1 },
  { key: "hours",    label: "Hours",       sortable: false, index: 2 },
  { key: "due",      label: "Due / Start", sortable: true,  index: 3, align: "right" },
  { key: "status",   label: "Status",      sortable: true,  index: 4 },
];

const COMPLETE_COLUMN = { key: "complete", label: "", sortable: false, index: 5 };

// status: 0 = To Do, 1 = In Progress, 2 = Completed
const STATUS_KEYS = { "In Progress": 1, "Completed": 2 };
const STATUS_LABELS = { 0: "Not Started", 1: "In Progress", 2: "Complete" };

const STATUS_FILTER_OPTIONS = [
  { value: "In Progress", label: "In Progress" },
  { value: "Completed",   label: "Completed"   },
];

function toTasks(employeeTasks) {
  return employeeTasks.map((t) => ({
    id: t.assignmentId,
    taskId: t.taskId,
    name: t.taskName,
    budgetName: t.budgetName,
    start: toDisplayDate(t.taskStartDate),
    due: toDisplayDate(t.taskEndDate),
    dueRaw: t.taskEndDate,
    workedHrs: t.assignmentWorkedHours,
    allocatedHrs: t.assignmentAllocatedHours,
    status: t.assignmentStatus,
    projectNo: t.projectNo,
    projectName: t.projectName,
  }));
}

export default function EmployeeTasks({ myProfile = false }) {
  const { id: urlId } = useParams();
  const dispatch = useDispatch();
  const { employeeTasks, employeeDetail } = useSelector((state) => state.employees);
  const employeeId = urlId || employeeDetail.empInfo.employeeId;

  const [search,        setSearch]        = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [completedIds,  setCompletedIds]  = useState(new Set());
  const [confirmTask,   setConfirmTask]   = useState(null); // { id, name }

  useEffect(() => {
    if (employeeId) dispatch(employeesAction.getEmployeeTasksStart({ employeeId, myProfile }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, myProfile]);

  const tasks = useMemo(() => toTasks(employeeTasks), [employeeTasks]);

  const taskFilters = useMemo(() => {
    const seen = new Map();
    tasks.forEach((t) => {
      if (t.projectNo && !seen.has(t.projectNo)) seen.set(t.projectNo, t.projectName);
    });
    return [
      {
        key: "status",
        label: "Status",
        icon: "bi-circle-half",
        options: STATUS_FILTER_OPTIONS,
      },
      {
        key: "project",
        label: "Project",
        icon: "bi-folder",
        options: Array.from(seen, ([value, label]) => ({ value, label })),
      },
    ];
  }, [tasks]);

  const handleFilterChange = (key, value) =>
    setActiveFilters((prev) => ({ ...prev, [key]: value }));

  function getStatus(task) {
    return completedIds.has(task.id) ? 2 : task.status;
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return tasks.filter((t) => {
      if (activeFilters.status && getStatus(t) !== STATUS_KEYS[activeFilters.status]) return false;
      if (activeFilters.project && t.projectNo !== activeFilters.project) return false;
      if (!term) return true;
      return (
        (t.name        || "").toLowerCase().includes(term) ||
        (t.budgetName  || "").toLowerCase().includes(term) ||
        (t.projectName || "").toLowerCase().includes(term)
      );
    });
  }, [tasks, search, activeFilters, completedIds]);

  function toTableData(tasks) {
    return tasks.map((t) => {
      const status = getStatus(t);
      const showComplete = status !== STATUS_KEYS["Completed"];
      const isOverdue = !!t.dueRaw && status !== STATUS_KEYS["Completed"] && new Date(t.dueRaw) < new Date();
      const dueValue = (
        <>
          {t.due}
          {isOverdue && <DueTag>Due</DueTag>}
        </>
      );
      const taskValue = (
        <>
          {t.taskId != null && <TaskIdChip>T{String(t.taskId).padStart(5, "0")}</TaskIdChip>}
          {t.name}
        </>
      );
      const row = [
        { value: taskValue,   type: "stacked",     subLabel: t.budgetName                                                        },
        { value: t.projectNo, type: "stacked",     subLabel: t.projectName                                                       },
        { value: null,        type: "hours",        meta: { worked: t.workedHrs, allocated: t.allocatedHrs, showRemaining: true, showAllocated: true } },
        { value: dueValue,    sortValue: t.dueRaw, type: "stacked",     subLabel: `From ${t.start}`                                                   },
        { value: STATUS_LABELS[status] || STATUS_LABELS[0], sortValue: status, type: "status" },
      ];

      if (myProfile) {
        row.push({
          value: null,
          type: "completeStatus",
          meta: { showComplete, onClick: () => setConfirmTask({ id: t.id, name: t.name, status }) },
        });
      }

      return { rowId: String(t.id), row };
    });
  }

  const tableData = useMemo(() => toTableData(filtered), [filtered]);
  const columns = useMemo(
    () => (myProfile ? [...BASE_TASK_COLUMNS, COMPLETE_COLUMN] : BASE_TASK_COLUMNS),
    [myProfile]
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={tableData}
        defaultSortKey="due"
        defaultSortDir="desc"
        hideActionCol
        filterBarSlot={
          <FilterBar
            filters={taskFilters}
            searchPlaceholder="Search task, budget, project..."
            searchValue={search}
            onSearchChange={setSearch}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />
        }
      />

      {confirmTask && (
        <ConfirmDialog
          title="Mark as Completed"
          message={`Mark "${confirmTask.name}" as completed?`}
          confirmLabel="Mark Complete"
          variant="success"
          requireCheckbox
          checkboxLabel="I confirm all reports for this task have been sent to accounts for invoicing"
          onConfirm={() => {
            if (confirmTask.status === STATUS_KEYS["In Progress"]) {
              dispatch(
                employeesAction.updateTaskAssignmentStatusStart({
                  assignmentId: confirmTask.id,
                  status: "completed",
                })
              );
            } else {
              // TODO: dispatch store.tasks.completeTask
              setCompletedIds((prev) => new Set([...prev, confirmTask.id]));
            }
            setConfirmTask(null);
          }}
          onCancel={() => setConfirmTask(null)}
        />
      )}
    </>
  );
}
