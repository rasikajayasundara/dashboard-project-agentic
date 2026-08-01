import { call, put, takeLatest } from "redux-saga/effects";
import { fetchProjectDetailsApi, fetchProjectGeneralStatsApi } from "./api";
import { getApiErrorMessage } from "../../config/errorCodes";
import { projectDetailAction } from ".";
import { SNACKBAR_TYPES, snackbarAction } from "../snackbarSlice";

function* fetchProjectDetailsSaga({ payload }) {
  try {
    const { data } = yield call(fetchProjectDetailsApi, payload);
    yield put(projectDetailAction.fetchProjectDetailSuccess(data));
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(projectDetailAction.fetchProjectDetailFail(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* fetchProjectGeneralStatsSaga({ payload }) {
  try {
    const { data } = yield call(fetchProjectGeneralStatsApi, payload);
    yield put(projectDetailAction.fetchGeneralStatsSuccess(data));
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(projectDetailAction.fetchGeneralStatsFail(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

export default function* projectDetailSagas() {
  yield takeLatest(
    projectDetailAction.fetchProjectDetailStart.type,
    fetchProjectDetailsSaga
  );
  yield takeLatest(
    projectDetailAction.fetchGeneralStatsStart.type,
    fetchProjectGeneralStatsSaga
  );
}
