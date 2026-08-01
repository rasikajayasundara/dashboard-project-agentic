import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  error: "",
  projectDocs: [],
  projectDetails: undefined,
  generalStats: null,
  generalStatsLoading: false,
  generalStatsError: "",
};

const projectDetailSlice = createSlice({
  name: "projectDetails",
  initialState,
  reducers: {
    fetchProjectDetailStart(state) {
      state.isLoading = true;
      state.error = "";
    },
    fetchProjectDetailSuccess(state, action) {
      state.isLoading = false;
      state.projectDetails = action.payload.projectDetails;
      state.projectDocs = action.payload.projectDocs || [];
    },
    fetchProjectDetailFail(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchGeneralStatsStart(state) {
      state.generalStatsLoading = true;
      state.generalStatsError = "";
      state.generalStats = null;
    },
    fetchGeneralStatsSuccess(state, action) {
      state.generalStatsLoading = false;
      state.generalStats = action.payload;
    },
    fetchGeneralStatsFail(state, action) {
      state.generalStatsLoading = false;
      state.generalStatsError = action.payload;
    },
  },
});

export const { actions: projectDetailAction, reducer: projectDetailReducer } =
  projectDetailSlice;
