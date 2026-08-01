import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  error: "",
  members: [],
};

const projectTeamSlice = createSlice({
  name: "projectTeam",
  initialState,
  reducers: {
    fetchTeamStart(state) {
      state.isLoading = true;
      state.error = "";
    },
    fetchTeamSuccess(state, action) {
      state.isLoading = false;
      state.members = action.payload || [];
    },
    fetchTeamFail(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { actions: projectTeamAction, reducer: projectTeamReducer } = projectTeamSlice;
