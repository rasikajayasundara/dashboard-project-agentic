import { call, put, select, takeLatest, takeEvery } from "redux-saga/effects";
import { fetchBudgetsByProjectApi, updateBudgetStatusApi, addBudgetApi, updateBudgetApi, deleteBudgetApi } from "./api";
import { getApiErrorMessage } from "../../config/errorCodes";
import { projectBudgetAction } from ".";
import { SNACKBAR_TYPES, snackbarAction } from "../snackbarSlice";

function* fetchBudgetsByProjectSaga({ payload }) {
  try {
    const { data } = yield call(fetchBudgetsByProjectApi, payload);
    yield put(projectBudgetAction.fetchBudgetsSuccess(data));
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(projectBudgetAction.fetchBudgetsFail(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* updateBudgetStatusSaga({ payload: { budgetId, status } }) {
  // Store the previous status before the optimistic update, so we can rollback
  const budgets = yield select(state => state.projectBudget.budgets);
  const budget = budgets.find(b => b.budgetId === budgetId);
  const previousStatus = budget?.status;

  try {
    yield call(updateBudgetStatusApi, budgetId, status);
    yield put(projectBudgetAction.updateBudgetStatusSuccess({ budgetId }));
    const msg = status === "active" ? "Budget activated" : "Budget deactivated";
    yield put(snackbarAction.showSnackbar({ message: msg, type: SNACKBAR_TYPES.SUCCESS }));
  } catch (error) {
    const message = getApiErrorMessage(error);
    // Rollback: pass the previous status so reducer can restore it
    yield put(projectBudgetAction.updateBudgetStatusFail({ budgetId, previousStatus }));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* addBudgetSaga({ payload }) {
  const { projectId, budgetName, budgetType, budgetAmount, onSuccess } = payload;
  try {
    const { data } = yield call(addBudgetApi, projectId, budgetName, budgetType, budgetAmount);
    yield put(projectBudgetAction.addBudgetSuccess(data));
    yield put(snackbarAction.showSnackbar({ message: "Budget added successfully", type: SNACKBAR_TYPES.SUCCESS }));
    if (onSuccess) onSuccess();
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(projectBudgetAction.addBudgetFail(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* updateBudgetSaga({ payload }) {
  const { budgetId, budgetName, budgetType, budgetAmount, onSuccess } = payload;
  try {
    const { data } = yield call(updateBudgetApi, budgetId, budgetName, budgetType, budgetAmount);
    yield put(projectBudgetAction.updateBudgetSuccess(data));
    yield put(snackbarAction.showSnackbar({ message: "Budget updated successfully", type: SNACKBAR_TYPES.SUCCESS }));
    if (onSuccess) onSuccess();
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(projectBudgetAction.updateBudgetFail(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* deleteBudgetSaga({ payload }) {
  const budgetId = payload;
  try {
    yield call(deleteBudgetApi, budgetId);
    yield put(projectBudgetAction.deleteBudgetSuccess(budgetId));
    yield put(snackbarAction.showSnackbar({ message: "Budget deleted successfully", type: SNACKBAR_TYPES.SUCCESS }));
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(projectBudgetAction.deleteBudgetFail(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

export default function* projectBudgetSaga() {
  yield takeLatest(
    projectBudgetAction.fetchBudgetsStart.type,
    fetchBudgetsByProjectSaga
  );
  yield takeEvery(
    projectBudgetAction.updateBudgetStatusStart.type,
    updateBudgetStatusSaga
  );
  yield takeLatest(projectBudgetAction.addBudgetStart.type, addBudgetSaga);
  yield takeLatest(projectBudgetAction.updateBudgetStart.type, updateBudgetSaga);
  yield takeLatest(projectBudgetAction.deleteBudgetStart.type, deleteBudgetSaga);
}
