import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isSubmitting: false,
  clients: [],
  stats: {},
  error: "",

  isLoadingDetail: false,
  clientInfo: {},
  clientStat: {},

  clientProjects: [],
  clientInvoices: [],
};

const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    clientListStart(state) {
      state.isLoading = true;
      state.error = "";
    },
    clientListSuccess(state, action) {
      state.isLoading = false;
      state.clients = action.payload.clients;
      state.stats = action.payload.stats;
    },
    clientListFailed(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    addClientStart(state) {
      state.isSubmitting = true;
    },
    addClientSuccess(state, action) {
      state.isSubmitting = false;
      state.clients = action.payload.clients;
      state.stats = action.payload.stats;
    },
    addClientFailed(state, action) {
      state.isSubmitting = false;
      state.error = action.payload;
    },

    updateClientStart(state) {
      state.isSubmitting = true;
    },
    updateClientSuccess(state, action) {
      state.isSubmitting = false;
      state.clientInfo = action.payload.clientInfo;
      state.clientStat = action.payload.stat;
    },
    updateClientFailed(state, action) {
      state.isSubmitting = false;
      state.error = action.payload;
    },

    deleteClientStart(state) {
      state.isSubmitting = true;
    },
    deleteClientSuccess(state, action) {
      state.isSubmitting = false;
      state.clients = action.payload.clients;
      state.stats = action.payload.stats;
    },
    deleteClientFailed(state, action) {
      state.isSubmitting = false;
      state.error = action.payload;
    },

    clientDetailStart(state) {
      state.isLoadingDetail = true;
      state.error = "";
      // Clear any other client's cached tab data so a tab's "already fetched"
      // guard doesn't skip fetching this client's data on first visit.
      state.clientProjects = [];
      state.clientInvoices = [];
    },
    clientDetailSuccess(state, action) {
      state.isLoadingDetail = false;
      state.clientInfo = action.payload.clientInfo;
      state.clientStat = action.payload.stat;
    },
    clientDetailFailed(state, action) {
      state.isLoadingDetail = false;
      state.error = action.payload;
    },

    clientProjectsStart(state) {
      state.error = "";
    },
    clientProjectsSuccess(state, action) {
      state.clientProjects = action.payload;
    },
    clientProjectsFailed(state, action) {
      state.error = action.payload;
    },

    clientInvoicesStart(state) {
      state.error = "";
    },
    clientInvoicesSuccess(state, action) {
      state.clientInvoices = action.payload;
    },
    clientInvoicesFailed(state, action) {
      state.error = action.payload;
    },
  },
});

export const { actions: clientAction, reducer: clientReducer } = clientSlice;
