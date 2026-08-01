import { call, put, takeLatest } from "redux-saga/effects";

import {
  fetchInvoiceDetailApi,
  fetchInvoiceListApi,
  fetchInvoicesByProjectApi,
  createInvoiceApi,
  updateInvoiceStatusApi,
  updateInvoiceApi,
  deleteInvoiceApi,
} from "./api";
import { invoiceAction } from ".";
import { getApiErrorMessage } from "../../config/errorCodes";
import { SNACKBAR_TYPES, snackbarAction } from "../snackbarSlice";

// The by-project endpoint's response envelope isn't fully pinned down, so
// defensively unwrap whichever shape it comes back as.
function extractInvoiceArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.invoices)) return data.invoices;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.invoices)) return data.data.invoices;
  if (Array.isArray(data?.result)) return data.result;
  return [];
}

function* fetchInvoiceDetail({ payload: invoiceId }) {
  try {
    const { data } = yield call(fetchInvoiceDetailApi, invoiceId);
    yield put(invoiceAction.invoiceDetailSuccess(data));
  } catch (error) {
    yield put(invoiceAction.invoiceDetailFailed(getApiErrorMessage(error)));
  }
}

function* fetchInvoiceList({ payload }) {
  const projectId = payload?.projectId;
  try {
    if (projectId) {
      const { data } = yield call(fetchInvoicesByProjectApi, projectId);
      yield put(invoiceAction.getInvoiceListSuccess({ invoices: extractInvoiceArray(data) }));
    } else {
      const { data } = yield call(fetchInvoiceListApi);
      yield put(invoiceAction.getInvoiceListSuccess(data ?? {}));
    }
  } catch (error) {
    yield put(invoiceAction.getInvoiceListFailed(getApiErrorMessage(error)));
  }
}

function* createInvoiceSaga({ payload }) {
  try {
    const { data } = yield call(createInvoiceApi, payload);
    yield put(invoiceAction.createInvoiceSuccess(data));
    yield put(snackbarAction.showSnackbar({
      message: payload.status === "submitForApproval" ? "Invoice submitted for approval" : "Invoice saved as draft",
      type: SNACKBAR_TYPES.SUCCESS,
    }));
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(invoiceAction.createInvoiceFail(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* updateInvoiceStatusSaga({ payload }) {
  const { invoiceId, action } = payload;
  const status = action === "approve" ? "approved" : "rejected";
  try {
    yield call(updateInvoiceStatusApi, invoiceId, { status });
    yield put(invoiceAction.updateInvoiceStatusSuccess());
    yield put(snackbarAction.showSnackbar({
      message: action === "approve" ? "Invoice approved and sent to Xero" : "Invoice rejected",
      type: SNACKBAR_TYPES.SUCCESS,
    }));
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(invoiceAction.updateInvoiceStatusFail(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* updateInvoiceSaga({ payload }) {
  const { invoiceId, payload: body } = payload;
  try {
    yield call(updateInvoiceApi, invoiceId, body);
    yield put(invoiceAction.updateInvoiceSuccess());
    yield put(snackbarAction.showSnackbar({
      message: body.status === "submitForApproval" ? "Invoice submitted for approval" : "Invoice updated successfully",
      type: SNACKBAR_TYPES.SUCCESS,
    }));
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(invoiceAction.updateInvoiceFail(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* submitInvoiceSaga({ payload }) {
  const { invoiceId } = payload;
  try {
    const { data: detail } = yield call(fetchInvoiceDetailApi, invoiceId);
    const body = {
      projectId: detail.projectId,
      clientId: detail.clientId,
      invoiceDate: detail.invoiceDate,
      dueDate: detail.dueDate,
      invoiceTitle: detail.invoiceTitle,
      billingContact: detail.billingContact || "",
      reference: detail.reference || "",
      description: detail.description || "",
      gst: Number(detail.gst),
      status: "submitForApproval",
      invoiceItems: (detail.invoiceItems || []).map((item) => ({
        budgetId: item.budgetId,
        amount: Number(item.amount),
      })),
    };
    yield call(updateInvoiceApi, invoiceId, body);
    yield put(invoiceAction.updateInvoiceSuccess());
    yield put(snackbarAction.showSnackbar({ message: "Invoice submitted for approval", type: SNACKBAR_TYPES.SUCCESS }));
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(invoiceAction.updateInvoiceFail(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* deleteInvoiceSaga({ payload: invoiceId }) {
  try {
    const response = yield call(deleteInvoiceApi, invoiceId);
    yield put(invoiceAction.deleteInvoiceSuccess(invoiceId));
    yield put(snackbarAction.showSnackbar({
      message: response?.message || "Invoice deleted successfully",
      type: SNACKBAR_TYPES.SUCCESS,
    }));
  } catch (error) {
    yield put(invoiceAction.deleteInvoiceFail());
    yield put(snackbarAction.showSnackbar({ message: getApiErrorMessage(error), type: SNACKBAR_TYPES.ERROR }));
  }
}

export default function* invoiceSaga() {
  yield takeLatest(invoiceAction.invoiceDetailStart.type, fetchInvoiceDetail);
  yield takeLatest(invoiceAction.getInvoiceListStart.type, fetchInvoiceList);
  yield takeLatest(invoiceAction.createInvoiceStart.type, createInvoiceSaga);
  yield takeLatest(invoiceAction.updateInvoiceStatusStart.type, updateInvoiceStatusSaga);
  yield takeLatest(invoiceAction.updateInvoiceStart.type, updateInvoiceSaga);
  yield takeLatest(invoiceAction.submitInvoiceStart.type, submitInvoiceSaga);
  yield takeLatest(invoiceAction.deleteInvoiceStart.type, deleteInvoiceSaga);
}
