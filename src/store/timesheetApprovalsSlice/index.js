import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  records: [],
  stats: { totalSubmitted: 0, pendingApproval: 0, approved: 0, rejected: 0 },
  error: "",
  reviewTimesheet: { isLoading: false, error: "" },
};

const timesheetApprovalsSlice = createSlice({
  name: "timesheetApprovals",
  initialState,
  reducers: {
    getForReviewStart(state) {
      state.isLoading = true;
      state.error = "";
    },
    getForReviewSuccess(state, action) {
      state.isLoading = false;
      state.records = action.payload.records;
      state.stats = action.payload.stats;
    },
    getForReviewFailed(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    reviewTimesheetStart(state) {
      state.reviewTimesheet = { isLoading: true, error: "" };
    },
    reviewTimesheetSuccess(state) {
      state.reviewTimesheet = { isLoading: false, error: "" };
    },
    reviewTimesheetFailed(state, action) {
      state.reviewTimesheet = { isLoading: false, error: action.payload };
    },
  },
});

export const { actions: timesheetApprovalsAction, reducer: timesheetApprovalsReducer } = timesheetApprovalsSlice;
