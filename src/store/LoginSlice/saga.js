import { call, put, takeLatest } from "redux-saga/effects";

import { getApiErrorMessage } from "../../config/errorCodes";
import { getPermissionFlags } from "../../config/permissionHandler";
import { authLoginApi } from "./api";
import { authAction } from "../authSlice";
import { loginAction } from ".";
import { secureStorage } from "../../utils/encryptedStorage";

function* loginUser(action) {
  try {
    const { data } = yield call(authLoginApi, action.payload);
    const profileData = data.profileData;
    const permissions = getPermissionFlags(data.modules);

    // refreshToken arrives via an httpOnly Set-Cookie header — never in the body.
    yield put(authAction.setTokens({ accessToken: data.accessToken }));

    yield put(
      loginAction.loginSuccess({
        profileData,
        permissions,
      })
    );
    secureStorage().setItem("hasSession", true);
  } catch (error) {
    yield put(loginAction.loginFail(getApiErrorMessage(error)));
  }
}

export default function* loginSaga() {
  yield takeLatest(loginAction.loginStart.type, loginUser);
}
