import { call, put, takeLatest } from "redux-saga/effects";

import {
  fetchClientListApi,
  addClientApi,
  fetchClientDetailApi,
  updateClientApi,
  deleteClientApi,
  fetchClientProjectsApi,
  fetchClientInvoicesApi,
} from "./api";
import { clientAction } from ".";
import { getApiErrorMessage } from "../../config/errorCodes";
import { SNACKBAR_TYPES, snackbarAction } from "../snackbarSlice";

function* fetchClientList() {
  try {
    const { data } = yield call(fetchClientListApi);
    yield put(
      clientAction.clientListSuccess({
        clients: data.clients ?? [],
        stats: data.stats ?? {},
      })
    );
  } catch (error) {
    yield put(clientAction.clientListFailed(getApiErrorMessage(error)));
  }
}

function* addClient({ payload }) {
  try {
    const { data, message } = yield call(addClientApi, payload);
    yield put(
      clientAction.addClientSuccess({
        clients: data.clients ?? [],
        stats: data.stats ?? {},
      })
    );
    yield put(
      snackbarAction.showSnackbar({
        message: message || "Client added successfully",
        type: SNACKBAR_TYPES.SUCCESS,
      })
    );
  } catch (error) {
    const errorMsg = getApiErrorMessage(error);
    yield put(clientAction.addClientFailed(errorMsg));
    yield put(
      snackbarAction.showSnackbar({
        message: errorMsg,
        type: SNACKBAR_TYPES.ERROR,
      })
    );
  }
}

function* updateClient({ payload: { clientId, values } }) {
  try {
    yield call(updateClientApi, clientId, values);
    const { data } = yield call(fetchClientDetailApi, clientId);
    yield put(
      clientAction.updateClientSuccess({
        clientInfo: data.clientInfo ?? {},
        stat: data.stat ?? {},
      })
    );
    yield put(
      snackbarAction.showSnackbar({
        message: "Client updated successfully",
        type: SNACKBAR_TYPES.SUCCESS,
      })
    );
  } catch (error) {
    const errorMsg = getApiErrorMessage(error);
    yield put(clientAction.updateClientFailed(errorMsg));
    yield put(
      snackbarAction.showSnackbar({
        message: errorMsg,
        type: SNACKBAR_TYPES.ERROR,
      })
    );
  }
}

function* deleteClient({ payload: clientId }) {
  try {
    const { data } = yield call(deleteClientApi, clientId);
    yield put(
      clientAction.deleteClientSuccess({
        clients: data.clients ?? [],
        stats: data.stats ?? {},
      })
    );
    yield put(
      snackbarAction.showSnackbar({
        message: "Client deleted successfully",
        type: SNACKBAR_TYPES.SUCCESS,
      })
    );
  } catch (error) {
    const errorMsg = getApiErrorMessage(error);
    yield put(clientAction.deleteClientFailed(errorMsg));
    yield put(
      snackbarAction.showSnackbar({
        message: errorMsg,
        type: SNACKBAR_TYPES.ERROR,
      })
    );
  }
}

function* fetchClientDetail({ payload: clientId }) {
  try {
    const { data } = yield call(fetchClientDetailApi, clientId);
    yield put(
      clientAction.clientDetailSuccess({
        clientInfo: data.clientInfo ?? {},
        stat: data.stat ?? {},
      })
    );
  } catch (error) {
    yield put(clientAction.clientDetailFailed(getApiErrorMessage(error)));
  }
}

function* fetchClientProjects({ payload: clientId }) {
  try {
    const { data } = yield call(fetchClientProjectsApi, clientId);
    yield put(clientAction.clientProjectsSuccess(data.projects ?? []));
  } catch (error) {
    yield put(clientAction.clientProjectsFailed(getApiErrorMessage(error)));
  }
}

function* fetchClientInvoices({ payload: clientId }) {
  try {
    const { data } = yield call(fetchClientInvoicesApi, clientId);
    yield put(clientAction.clientInvoicesSuccess(data.invoices ?? []));
  } catch (error) {
    yield put(clientAction.clientInvoicesFailed(getApiErrorMessage(error)));
  }
}

export default function* clientSaga() {
  yield takeLatest(clientAction.clientListStart.type, fetchClientList);
  yield takeLatest(clientAction.addClientStart.type, addClient);
  yield takeLatest(clientAction.updateClientStart.type, updateClient);
  yield takeLatest(clientAction.deleteClientStart.type, deleteClient);
  yield takeLatest(clientAction.clientDetailStart.type, fetchClientDetail);
  yield takeLatest(clientAction.clientProjectsStart.type, fetchClientProjects);
  yield takeLatest(clientAction.clientInvoicesStart.type, fetchClientInvoices);
}
