import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  addingTask: false,
  editingTaskId: null,
  deletingTaskId: null,
  error: "",
  tasks: [],
  employees: [],
  fetchingEmployees: false,
  addingAssignment: false,
  assignmentError: "",
  deletingAssignmentId: null,
  updatingAssignmentId: null,
};

const projectTaskSlice = createSlice({
  name: "projectTask",
  initialState,
  reducers: {
    fetchTasksStart(state) {
      state.isLoading = true;
      state.error = "";
    },
    fetchTasksSuccess(state, action) {
      state.isLoading = false;
      state.tasks = action.payload || [];
    },
    fetchTasksFail(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    addTaskStart(state) {
      state.addingTask = true;
      state.error = "";
    },
    addTaskSuccess(state, action) {
      state.addingTask = false;
      const newTask = action.payload;
      const budget = state.tasks.find(b => b.budgetId === newTask.budgetId);
      if (budget && budget.tasks) {
        const existingIdx = budget.tasks.findIndex(t => t.taskId === newTask.taskId);
        if (existingIdx >= 0) {
          budget.tasks[existingIdx] = newTask;
        } else {
          budget.tasks.push(newTask);
        }
      }
    },
    addTaskFail(state, action) {
      state.addingTask = false;
      state.error = action.payload;
    },
    updateTaskStart(state, action) {
      state.editingTaskId = action.payload;
      state.error = "";
    },
    updateTaskSuccess(state, action) {
      state.editingTaskId = null;
      const updatedTask = action.payload;
      for (const budget of state.tasks) {
        const taskIdx = budget.tasks?.findIndex(t => t.taskId === updatedTask.taskId);
        if (taskIdx >= 0) {
          budget.tasks[taskIdx] = updatedTask;
          break;
        }
      }
    },
    updateTaskFail(state, action) {
      state.editingTaskId = null;
      state.error = action.payload;
    },
    deleteTaskStart(state, action) {
      state.deletingTaskId = action.payload;
      state.error = "";
    },
    deleteTaskSuccess(state, action) {
      const taskIdToDelete = action.payload;
      state.deletingTaskId = null;
      for (const budget of state.tasks) {
        const taskIdx = budget.tasks?.findIndex(t => t.taskId === taskIdToDelete);
        if (taskIdx >= 0) {
          budget.tasks.splice(taskIdx, 1);
          break;
        }
      }
    },
    deleteTaskFail(state, action) {
      state.deletingTaskId = null;
      state.error = action.payload;
    },
    fetchEmployeesStart(state) {
      state.fetchingEmployees = true;
      state.assignmentError = "";
    },
    fetchEmployeesSuccess(state, action) {
      state.fetchingEmployees = false;
      state.employees = action.payload || [];
    },
    fetchEmployeesFail(state, action) {
      state.fetchingEmployees = false;
      state.assignmentError = action.payload;
    },
    addAssignmentStart(state) {
      state.addingAssignment = true;
      state.assignmentError = "";
    },
    addAssignmentSuccess(state, action) {
      state.addingAssignment = false;
      const newAssignment = action.payload;
      for (const budget of state.tasks) {
        const task = budget.tasks?.find(t => t.taskId === newAssignment.taskId);
        if (task) {
          if (!task.assignments) {
            task.assignments = [];
          }
          const existingIdx = task.assignments.findIndex(a => a.assignmentId === newAssignment.assignmentId);
          if (existingIdx >= 0) {
            task.assignments[existingIdx] = newAssignment;
          } else {
            task.assignments.push(newAssignment);
          }
          break;
        }
      }
    },
    addAssignmentFail(state, action) {
      state.addingAssignment = false;
      state.assignmentError = action.payload;
    },
    deleteAssignmentStart(state, action) {
      state.deletingAssignmentId = action.payload;
      state.assignmentError = "";
    },
    deleteAssignmentSuccess(state, action) {
      const assignmentId = action.payload;
      state.deletingAssignmentId = null;
      for (const budget of state.tasks) {
        for (const task of budget.tasks || []) {
          const idx = task.assignments?.findIndex(a => a.assignmentId === assignmentId);
          if (idx >= 0) {
            task.assignments.splice(idx, 1);
            return;
          }
        }
      }
    },
    deleteAssignmentFail(state, action) {
      state.deletingAssignmentId = null;
      state.assignmentError = action.payload;
    },
    updateAssignmentStart(state, action) {
      state.updatingAssignmentId = action.payload.assignmentId;
      state.assignmentError = "";
    },
    updateAssignmentSuccess(state, action) {
      const { assignmentId, allocatedHours, allocatedRate } = action.payload;
      state.updatingAssignmentId = null;
      for (const budget of state.tasks) {
        for (const task of budget.tasks || []) {
          const a = task.assignments?.find(a => a.assignmentId === assignmentId);
          if (a) {
            a.assignmentAllocatedHours = allocatedHours;
            a.assignmentAllocatedRate = allocatedRate;
            return;
          }
        }
      }
    },
    updateAssignmentFail(state, action) {
      state.updatingAssignmentId = null;
      state.assignmentError = action.payload;
    },
  },
});

export const { actions: projectTaskAction, reducer: projectTaskReducer } = projectTaskSlice;
