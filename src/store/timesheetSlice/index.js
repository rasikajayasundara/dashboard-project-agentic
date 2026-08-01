import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoadingTimesheets: false,
  timesheets: [],
  timeEntriesByWeek: {},
  logTimeTasks: { isLoading: false, loggedEntries: [], projects: [], error: "" },
  saveTimeEntries: { isLoading: false, error: "", savedAt: null },
  deleteTimeEntry: { isLoading: false, error: "" },
  submitTimesheet: { isLoading: false, error: "" },
  graph: { isLoading: false, hoursByProject: [], weeklyTrend: [], error: "" },
  error: "",
};

const timesheetSlice = createSlice({
  name: "timesheets",
  initialState,
  reducers: {
    getTimesheetsStart(state) {
      state.isLoadingTimesheets = true;
      state.error = "";
    },
    getTimesheetsSuccess(state, action) {
      state.isLoadingTimesheets = false;
      state.timesheets = action.payload;
    },
    getTimesheetsFailed(state, action) {
      state.isLoadingTimesheets = false;
      state.error = action.payload;
    },
    getTimeEntriesStart(state, action) {
      const { cacheKey } = action.payload;
      state.timeEntriesByWeek[cacheKey] = {
        isLoading: true,
        entries: [],
        leaveDates: [],
        holidays: [],
        error: "",
      };
    },
    getTimeEntriesSuccess(state, action) {
      const { cacheKey, entries, leaveDates, holidays } = action.payload;
      state.timeEntriesByWeek[cacheKey] = {
        isLoading: false,
        entries,
        leaveDates,
        holidays,
        error: "",
      };
    },
    getTimeEntriesFailed(state, action) {
      const { cacheKey, error } = action.payload;
      state.timeEntriesByWeek[cacheKey] = {
        isLoading: false,
        entries: [],
        leaveDates: [],
        holidays: [],
        error,
      };
    },
    getLogTimeTasksStart(state) {
      state.logTimeTasks = { isLoading: true, loggedEntries: [], projects: [], error: "" };
    },
    getLogTimeTasksSuccess(state, action) {
      state.logTimeTasks = { isLoading: false, ...action.payload, error: "" };
    },
    getLogTimeTasksFailed(state, action) {
      state.logTimeTasks = { isLoading: false, loggedEntries: [], projects: [], error: action.payload };
    },
    saveTimeEntriesStart(state) {
      state.saveTimeEntries = { isLoading: true, error: "", savedAt: null };
    },
    saveTimeEntriesSuccess(state) {
      state.saveTimeEntries = { isLoading: false, error: "", savedAt: Date.now() };
    },
    saveTimeEntriesFailed(state, action) {
      state.saveTimeEntries = { isLoading: false, error: action.payload, savedAt: null };
    },
    deleteTimeEntryStart(state) {
      state.deleteTimeEntry = { isLoading: true, error: "" };
    },
    deleteTimeEntrySuccess(state, action) {
      state.deleteTimeEntry = { isLoading: false, error: "" };
      state.logTimeTasks.loggedEntries = state.logTimeTasks.loggedEntries.filter(
        (e) => e.entryId !== action.payload
      );
    },
    deleteTimeEntryFailed(state, action) {
      state.deleteTimeEntry = { isLoading: false, error: action.payload };
    },
    submitTimesheetStart(state) {
      state.submitTimesheet = { isLoading: true, error: "" };
    },
    submitTimesheetSuccess(state) {
      state.submitTimesheet = { isLoading: false, error: "" };
    },
    submitTimesheetFailed(state, action) {
      state.submitTimesheet = { isLoading: false, error: action.payload };
    },
    getTimesheetGraphStart(state) {
      state.graph.isLoading = true;
      state.graph.error = "";
      state.graph.hoursByProject = [];
      state.graph.weeklyTrend = [];
    },
    getTimesheetGraphSuccess(state, action) {
      const { hoursByProject, weeklyTrend } = action.payload;
      state.graph.isLoading = false;
      state.graph.hoursByProject = hoursByProject;
      state.graph.weeklyTrend = weeklyTrend;
    },
    getTimesheetGraphFailed(state, action) {
      state.graph.isLoading = false;
      state.graph.error = action.payload;
    },
  },
});

export const { actions: timesheetAction, reducer: timesheetReducer } = timesheetSlice;
