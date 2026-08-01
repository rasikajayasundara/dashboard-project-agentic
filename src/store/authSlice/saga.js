import { call, put, takeLatest } from "redux-saga/effects";

import { activationTokenValidateApi, addNewPasswordApi, logoutApi } from "./api";
import { authAction } from ".";
import { RESET_STATE } from "../rootReducer";
import { secureStorage } from "../../utils/encryptedStorage";
import { getApiErrorMessage } from "../../config/errorCodes";
import socket from "../../utils/socket";

function* validateActivationToken({ payload }) {
  try {
    const data = yield call(activationTokenValidateApi, payload);

    yield put(authAction.validateTokenSuccess(data));
  } catch (error) {
    yield put(authAction.validateTokenFailed(getApiErrorMessage(error)));
  }
}
function* addNewPassword({ payload }) {
  try {
    const { message } = yield call(addNewPasswordApi, payload);
    yield put(authAction.addNewPasswordSuccess(message));
  } catch (error) {
    yield put(authAction.addNewPasswordFailed(getApiErrorMessage(error)));
  }
}

// Best-effort — the backend revokes the refresh token and clears the
// projex_rt cookie via Set-Cookie on this call. It must fire while the
// current accessToken is still in the store (authAxios attaches it from
// state), so RESET_STATE is dispatched here — after the call settles —
// rather than by the component before this saga runs.
function* logout() {
  try {
    yield call(logoutApi);
  } catch (error) {
    // Idempotent/best-effort: even if this fails (expired token, network
    // error), still clear all local state below.
  } finally {
    secureStorage().removeItem("hasSession");
    socket.disconnect();
    yield put({ type: RESET_STATE });
  }
}

export default function* authSaga() {
  yield takeLatest(authAction.validateTokenStart.type, validateActivationToken);
  yield takeLatest(authAction.addNewPasswordStart.type, addNewPassword);
  yield takeLatest(authAction.logoutStart.type, logout);
}
