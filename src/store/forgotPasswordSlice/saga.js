// projectSaga.js
import { call, put, select, takeLatest } from "redux-saga/effects";
import {
  changePasswordApi,
  forgotPassAuthApi,
  forgotPasswordEmailApi,
} from "./api";
import { forgotPasswordAction } from ".";
import { getApiErrorMessage } from "../../config/errorCodes";

function* requestForgotPasswordEmail({ payload }) {
  try {
    const { data } = yield call(forgotPasswordEmailApi, payload);
    yield put(forgotPasswordAction.emailOtpSuccess(data?.serverRef));
  } catch (error) {
    yield put(forgotPasswordAction.emailOtpFail(getApiErrorMessage(error)));
  }
}

function* requestForgotPassAuth({ payload }) {
  try {
    const { serverRef } = yield select((state) => state.forgotPassword);
    const { data } = yield call(forgotPassAuthApi, {
      otp: Number(payload.otp),
      serverRef,
    });
    yield put(
      forgotPasswordAction.authSuccess({ ...data, otp: Number(payload.otp) })
    );
  } catch (error) {
    yield put(forgotPasswordAction.authFail(getApiErrorMessage(error)));
  }
}

function* changePasswordUser({ payload }) {
  try {
    const { forgotAuthData, serverRef } = yield select(
      (state) => state.forgotPassword
    );
    const { message } = yield call(changePasswordApi, {
      ...payload,
      serverRef,
      otp: forgotAuthData.otp,
    });
    yield put(forgotPasswordAction.changePasswordSuccess(message));
  } catch (error) {
    yield put(forgotPasswordAction.changePasswordFail(getApiErrorMessage(error)));
  }
}

export function* forgotPasswordSaga() {
  yield takeLatest(
    forgotPasswordAction.emailOtpStart.type,
    requestForgotPasswordEmail
  );
  yield takeLatest(
    forgotPasswordAction.changePasswordStart.type,
    changePasswordUser
  );
  yield takeLatest(forgotPasswordAction.authStart.type, requestForgotPassAuth);
}
