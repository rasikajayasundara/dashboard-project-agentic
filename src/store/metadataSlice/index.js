import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_TIMESHEET_CONFIG = { weeklyMaxHours: 40, dailyMaxHours: 8, weekendsAllowed: 1 };

const initialState = {
  officeLocations: [],
  departments: [],
  jobTitles: [],
  userRoles: [],
  settings: {},
  timesheetConfig: DEFAULT_TIMESHEET_CONFIG,
  isLoading: false,
  isUpdatingJobTitleRole: false,
  error: "",
};

const metadataSlice = createSlice({
  name: "metadata",
  initialState,
  reducers: {
    metadataStart(state) {
      state.isLoading = true;
      state.error = "";
    },
    metadataSuccess(state, action) {
      state.isLoading = false;
      state.officeLocations = action.payload.officeLocations || [];
      state.departments = action.payload.departments || [];
      state.jobTitles = action.payload.jobTitles || [];
      state.userRoles = action.payload.userRoles || [];
      state.settings = action.payload.settings || {};
      state.timesheetConfig = action.payload.timesheetConfig
        ? { ...DEFAULT_TIMESHEET_CONFIG, ...action.payload.timesheetConfig }
        : DEFAULT_TIMESHEET_CONFIG;
    },
    metadataFailed(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateJobTitleRoleStart(state) {
      state.isUpdatingJobTitleRole = true;
      state.error = "";
    },
    updateJobTitleRoleSuccess(state, action) {
      state.isUpdatingJobTitleRole = false;
      const updated = action.payload;
      state.jobTitles = state.jobTitles.map((jt) =>
        jt.jobTitleId === updated.jobTitleId ? { ...jt, roleId: updated.roleId } : jt
      );
    },
    updateJobTitleRoleFailed(state, action) {
      state.isUpdatingJobTitleRole = false;
      state.error = action.payload;
    },
  },
});

export const { actions: metadataAction, reducer: metadataReducer } = metadataSlice;
