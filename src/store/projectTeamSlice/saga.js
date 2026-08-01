import { call, put, takeLatest } from "redux-saga/effects";
import { fetchProjectTeamApi } from "./api";
import { getApiErrorMessage } from "../../config/errorCodes";
import { projectTeamAction } from ".";
import { SNACKBAR_TYPES, snackbarAction } from "../snackbarSlice";

function* fetchProjectTeamSaga({ payload }) {
  try {
    const { data } = yield call(fetchProjectTeamApi, payload);
    yield put(projectTeamAction.fetchTeamSuccess(data));
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(projectTeamAction.fetchTeamFail(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

export default function* projectTeamSaga() {
  yield takeLatest(projectTeamAction.fetchTeamStart.type, fetchProjectTeamSaga);
}
