import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoadingInvoiceDetail: false,
  invoiceDetail: {},
  isLoadingInvoiceList: false,
  invoiceList: [],
  invoiceStats: {},
  lastXeroSync: null,
  error: "",
  createInvoiceLoading: false,
  createInvoiceError: "",
  updatingInvoiceStatus: false,
  updateInvoiceStatusError: "",
  updateInvoiceLoading: false,
  updateInvoiceError: "",
  deleteInvoiceLoading: false,
};

const invoiceSlice = createSlice({
  name: "invoiceDetail",
  initialState,
  reducers: {
    invoiceDetailStart(state) {
      state.isLoadingInvoiceDetail = true;
      state.error = "";
      state.invoiceDetail = {};
    },
    invoiceDetailSuccess(state, action) {
      state.isLoadingInvoiceDetail = false;
      state.invoiceDetail = action.payload;
    },
    invoiceDetailFailed(state, action) {
      state.isLoadingInvoiceDetail = false;
      state.error = action.payload;
    },
    clearInvoiceDetail(state) {
      state.invoiceDetail = {};
    },
    getInvoiceListStart(state) {
      state.isLoadingInvoiceList = true;
      state.error = "";
    },
    getInvoiceListSuccess(state, action) {
      state.isLoadingInvoiceList = false;
      state.invoiceList = action.payload.invoices || [];
      state.invoiceStats = action.payload.stats || {};
      state.lastXeroSync = action.payload.lastXeroSync || null;
    },
    getInvoiceListFailed(state, action) {
      state.isLoadingInvoiceList = false;
      state.error = action.payload;
    },
    createInvoiceStart(state) {
      state.createInvoiceLoading = true;
      state.createInvoiceError = "";
    },
    createInvoiceSuccess(state) {
      state.createInvoiceLoading = false;
    },
    createInvoiceFail(state, action) {
      state.createInvoiceLoading = false;
      state.createInvoiceError = action.payload;
    },
    updateInvoiceStatusStart(state) {
      state.updatingInvoiceStatus = true;
      state.updateInvoiceStatusError = "";
    },
    updateInvoiceStatusSuccess(state) {
      state.updatingInvoiceStatus = false;
    },
    updateInvoiceStatusFail(state, action) {
      state.updatingInvoiceStatus = false;
      state.updateInvoiceStatusError = action.payload;
    },
    updateInvoiceStart(state) {
      state.updateInvoiceLoading = true;
      state.updateInvoiceError = "";
    },
    updateInvoiceSuccess(state) {
      state.updateInvoiceLoading = false;
    },
    updateInvoiceFail(state, action) {
      state.updateInvoiceLoading = false;
      state.updateInvoiceError = action.payload;
    },
    submitInvoiceStart(state) {
      state.updateInvoiceLoading = true;
      state.updateInvoiceError = "";
    },
    deleteInvoiceStart(state) {
      state.deleteInvoiceLoading = true;
    },
    deleteInvoiceSuccess(state, action) {
      state.deleteInvoiceLoading = false;
      state.invoiceList = state.invoiceList.filter((invoice) => {
        const id = invoice.id ?? invoice.invoiceId ?? invoice.invoice_id;
        return String(id) !== String(action.payload);
      });
    },
    deleteInvoiceFail(state) {
      state.deleteInvoiceLoading = false;
    },
  },
});

export const { actions: invoiceAction, reducer: invoiceDetailReducer } = invoiceSlice;
