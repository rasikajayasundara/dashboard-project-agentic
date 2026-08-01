import { call, put, takeLatest } from "redux-saga/effects";

import { changePasswordApi } from "./api";
import { changePasswordAction } from ".";
import { getApiErrorMessage } from "../../config/errorCodes";

function* changePasswordSaga({ payload }) {
  try {
    const { message } = yield call(changePasswordApi, payload.current, payload.new);
    yield put(changePasswordAction.changePasswordSuccess(message || "Password changed successfully"));
  } catch (error) {
    yield put(changePasswordAction.changePasswordFailed(getApiErrorMessage(error)));
  }
}

export default function* watchChangePassword() {
  yield takeLatest(changePasswordAction.changePasswordStart.type, changePasswordSaga);
}
