import { all, fork } from "redux-saga/effects";

import { forgotPasswordSaga } from "./forgotPasswordSlice/saga";
import loginSaga from "./LoginSlice/saga";
import authSaga from "./authSlice/saga";
import projectSaga from "./projectSlice/saga";
import employeesSaga from "./employeesSlice/saga";
import clientSaga from "./clientSlice/saga";
import metadataSaga from "./metadataSlice/saga";
import timesheetSaga from "./timesheetSlice/saga";
import rolesPermissionsSaga from "./rolesPermissionsSlice/saga";
import watchChangePassword from "./changePasswordSlice/saga";
import notificationSaga from "./notificationSlice/saga";

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(loginSaga),
    fork(projectSaga),
    fork(employeesSaga),
    fork(clientSaga),
    fork(metadataSaga),
    fork(forgotPasswordSaga),
    fork(watchChangePassword),
    fork(timesheetSaga),
    fork(rolesPermissionsSaga),
    fork(notificationSaga),
  ]);
}
