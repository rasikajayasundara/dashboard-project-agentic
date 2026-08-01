import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  error: "",
  projectManagesList: [],
  isLoadingEmployeeList: false,
  employeeList: [],
  employeeStats: {},
  isLoadingEmployeeDetail: false,
  employeeDetail: { empInfo: {}, stat: {} },
  isSubmitting: false,
  employeeProjects: [],
  isLoadingEmployeeTasks: false,
  employeeTasks: [],
  isUpdatingTaskStatus: false,
};

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    getEmployeeByTypeStart(state) {
      state.isLoading = true;
    },
    getEmployeeByTypeSuccess(state, action) {
      state.isLoading = false;
      state.projectManagesList = action.payload;
    },
    getEmployeeByTypeFail(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getEmployeeListStart(state) {
      state.isLoadingEmployeeList = true;
    },
    getEmployeeListSuccess(state, action) {
      state.isLoadingEmployeeList = false;
      state.employeeList = action.payload.employees || [];
      state.employeeStats = action.payload.stats || {};
    },
    getEmployeeListFailed(state, action) {
      state.isLoadingEmployeeList = false;
      state.error = action.payload;
    },
    getEmployeeDetailStart(state) {
      state.isLoadingEmployeeDetail = true;
      state.employeeProjects = [];
      state.employeeTasks = [];
    },
    getEmployeeDetailSuccess(state, action) {
      state.isLoadingEmployeeDetail = false;
      state.employeeDetail = {
        empInfo: action.payload.empInfo || {},
        stat: action.payload.stat || {},
      };
    },
    getEmployeeDetailFailed(state, action) {
      state.isLoadingEmployeeDetail = false;
      state.error = action.payload;
    },
    getMyProfileStart(state) {
      state.isLoadingEmployeeDetail = true;
      state.employeeProjects = [];
      state.employeeTasks = [];
    },
    addEmployeeStart(state) {
      state.isSubmitting = true;
    },
    addEmployeeSuccess(state) {
      state.isSubmitting = false;
    },
    addEmployeeFailed(state, action) {
      state.isSubmitting = false;
      state.error = action.payload;
    },
    updateEmployeeStart(state) {
      state.isSubmitting = true;
    },
    updateEmployeeSuccess(state, action) {
      state.isSubmitting = false;
      state.employeeDetail = {
        empInfo: action.payload.empInfo || {},
        stat: action.payload.stat || {},
      };
    },
    updateEmployeeFailed(state, action) {
      state.isSubmitting = false;
      state.error = action.payload;
    },
    updateMyProfileStart(state) {
      state.isSubmitting = true;
    },
    updateMyProfileSuccess(state, action) {
      state.isSubmitting = false;
      state.employeeDetail = {
        empInfo: action.payload.empInfo || {},
        stat: action.payload.stat || {},
      };
    },
    updateMyProfileFailed(state, action) {
      state.isSubmitting = false;
      state.error = action.payload;
    },
    deleteEmployeeStart(state) {
      state.isSubmitting = true;
    },
    deleteEmployeeSuccess(state) {
      state.isSubmitting = false;
    },
    deleteEmployeeFailed(state, action) {
      state.isSubmitting = false;
      state.error = action.payload;
    },
    resendActivationStart(state) {
      state.isSubmitting = true;
    },
    resendActivationSuccess(state) {
      state.isSubmitting = false;
    },
    resendActivationFailed(state, action) {
      state.isSubmitting = false;
      state.error = action.payload;
    },
    getEmployeeProjectsStart(state) {
      state.error = "";
    },
    getEmployeeProjectsSuccess(state, action) {
      state.employeeProjects = action.payload;
    },
    getEmployeeProjectsFailed(state, action) {
      state.error = action.payload;
    },
    getEmployeeTasksStart(state) {
      state.isLoadingEmployeeTasks = true;
    },
    getEmployeeTasksSuccess(state, action) {
      state.isLoadingEmployeeTasks = false;
      state.employeeTasks = action.payload;
    },
    getEmployeeTasksFailed(state, action) {
      state.isLoadingEmployeeTasks = false;
      state.error = action.payload;
    },
    updateTaskAssignmentStatusStart(state) {
      state.isUpdatingTaskStatus = true;
    },
    updateTaskAssignmentStatusSuccess(state, action) {
      state.isUpdatingTaskStatus = false;
      const task = state.employeeTasks.find(
        (t) => t.assignmentId === action.payload.assignmentId
      );
      if (task) task.assignmentStatus = 2;
    },
    updateTaskAssignmentStatusFailed(state, action) {
      state.isUpdatingTaskStatus = false;
      state.error = action.payload;
    },
  },
});

export const { actions: employeesAction, reducer: employeesReducer } =
  employeesSlice;
