import { all, fork } from "redux-saga/effects";

import { forgotPasswordSaga } from "./forgotPasswordSlice/saga";
import loginSaga from "./LoginSlice/saga";
import authSaga from "./authSlice/saga";
import projectSaga from "./projectSlice/saga";
import employeesSaga from "./employeesSlice/saga";
import projectDetailSagas from "./projectDetailSlice/saga";
import clientSaga from "./clientSlice/saga";
import invoiceDetailSaga from "./invoiceSlice/saga";
import metadataSaga from "./metadataSlice/saga";
import timesheetSaga from "./timesheetSlice/saga";
import timesheetApprovalsSaga from "./timesheetApprovalsSlice/saga";
import projectBudgetSaga from "./projectBudgetSlice/saga";
import projectExpenseSaga from "./projectExpenseSlice/saga";
import projectTaskSaga from "./projectTaskSlice/saga";
import projectTeamSaga from "./projectTeamSlice/saga";
import rolesPermissionsSaga from "./rolesPermissionsSlice/saga";
import watchChangePassword from "./changePasswordSlice/saga";
import notificationSaga from "./notificationSlice/saga";

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(loginSaga),
    fork(projectSaga),
    fork(projectDetailSagas),
    fork(employeesSaga),
    fork(clientSaga),
    fork(invoiceDetailSaga),
    fork(metadataSaga),
    fork(forgotPasswordSaga),
    fork(watchChangePassword),
    fork(timesheetSaga),
    fork(timesheetApprovalsSaga),
    fork(projectBudgetSaga),
    fork(projectExpenseSaga),
    fork(projectTaskSaga),
    fork(projectTeamSaga),
    fork(rolesPermissionsSaga),
    fork(notificationSaga),
  ]);
}
