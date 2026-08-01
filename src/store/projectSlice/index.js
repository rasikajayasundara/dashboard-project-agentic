import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  projects: [],
  stats: { active: 0, overdue: 0, atRisk: 0 },
  error: "",
  success:"",
  addProject: { isLoading: false, error: "", savedAt: null },
  editProject: { isLoading: false, error: "", savedAt: null },
  deleteProject: { isLoading: false, error: "", savedAt: null },
  completeProject: { isLoading: false, error: "", savedAt: null },
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    projectListStart(state) {
      state.isLoading = true;
    },
    addNewProjectStart(state) {
      state.addProject = { isLoading: true, error: "", savedAt: null };
    },
    addProjectSuccess(state) {
      state.addProject = { isLoading: false, error: "", savedAt: Date.now() };
    },
    addProjectFailed(state, action) {
      state.addProject = { isLoading: false, error: action.payload, savedAt: null };
    },
    resetAddProject(state) {
      state.addProject = { isLoading: false, error: "", savedAt: null };
    },
    updateProjectStart(state) {
      state.editProject = { isLoading: true, error: "", savedAt: null };
    },
    updateProjectSuccess(state) {
      state.editProject = { isLoading: false, error: "", savedAt: Date.now() };
    },
    updateProjectFailed(state, action) {
      state.editProject = { isLoading: false, error: action.payload, savedAt: null };
    },
    resetEditProject(state) {
      state.editProject = { isLoading: false, error: "", savedAt: null };
    },
    deleteProjectStart(state) {
      state.deleteProject = { isLoading: true, error: "", savedAt: null };
    },
    deleteProjectSuccess(state) {
      state.deleteProject = { isLoading: false, error: "", savedAt: Date.now() };
    },
    deleteProjectFailed(state, action) {
      state.deleteProject = { isLoading: false, error: action.payload, savedAt: null };
    },
    resetDeleteProject(state) {
      state.deleteProject = { isLoading: false, error: "", savedAt: null };
    },
    completeProjectStart(state) {
      state.completeProject = { isLoading: true, error: "", savedAt: null };
    },
    completeProjectSuccess(state) {
      state.completeProject = { isLoading: false, error: "", savedAt: Date.now() };
    },
    completeProjectFailed(state, action) {
      state.completeProject = { isLoading: false, error: action.payload, savedAt: null };
    },
    resetCompleteProject(state) {
      state.completeProject = { isLoading: false, error: "", savedAt: null };
    },
    projectCUDSuccess(state, action) {
      state.isLoading = false;
      state.success = action.payload;
    },
    projectListByFilterStart(state) {
      state.isLoading = true;
    },
    projectListSuccess(state, action) {
      state.isLoading = false;
      state.projects = action.payload?.projects || [];
      state.stats = action.payload?.stats || state.stats;
    },
    projectFailed(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { actions: projectAction, reducer: projectReducer } = projectSlice;
