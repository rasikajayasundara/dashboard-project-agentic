import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchExpensesByProjectApi, addExpenseApi, updateExpenseApi, deleteExpenseApi,
} from "./api";
import { getApiErrorMessage } from "../../config/errorCodes";
import { projectExpenseAction } from ".";
import { SNACKBAR_TYPES, snackbarAction } from "../snackbarSlice";

function* fetchExpensesByProjectSaga({ payload }) {
  try {
    const { data } = yield call(fetchExpensesByProjectApi, payload);
    yield put(projectExpenseAction.fetchExpensesSuccess(data));
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(projectExpenseAction.fetchExpensesFail(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* addExpenseSaga({ payload }) {
  const { onSuccess, ...body } = payload;
  try {
    const { data } = yield call(addExpenseApi, body);
    yield put(projectExpenseAction.addExpenseSuccess(data));
    yield put(snackbarAction.showSnackbar({ message: "Expense added successfully", type: SNACKBAR_TYPES.SUCCESS }));
    if (onSuccess) onSuccess();
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(projectExpenseAction.addExpenseFail(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* updateExpenseSaga({ payload }) {
  const { expenseId, onSuccess, ...body } = payload;
  try {
    const { data } = yield call(updateExpenseApi, expenseId, body);
    yield put(projectExpenseAction.updateExpenseSuccess(data));
    yield put(snackbarAction.showSnackbar({ message: "Expense updated successfully", type: SNACKBAR_TYPES.SUCCESS }));
    if (onSuccess) onSuccess();
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(projectExpenseAction.updateExpenseFail(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* deleteExpenseSaga({ payload }) {
  const expenseId = payload;
  try {
    yield call(deleteExpenseApi, expenseId);
    yield put(projectExpenseAction.deleteExpenseSuccess(expenseId));
    yield put(snackbarAction.showSnackbar({ message: "Expense deleted successfully", type: SNACKBAR_TYPES.SUCCESS }));
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(projectExpenseAction.deleteExpenseFail(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

export default function* projectExpenseSaga() {
  yield takeLatest(projectExpenseAction.fetchExpensesStart.type, fetchExpensesByProjectSaga);
  yield takeLatest(projectExpenseAction.addExpenseStart.type, addExpenseSaga);
  yield takeLatest(projectExpenseAction.updateExpenseStart.type, updateExpenseSaga);
  yield takeLatest(projectExpenseAction.deleteExpenseStart.type, deleteExpenseSaga);
}
