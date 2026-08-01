import { call, put, takeLatest } from "redux-saga/effects";

import { fetchPermissionsApi, fetchRolesApi, updateRolePermissionsApi } from "./api";
import { rolesPermissionsAction } from ".";
import { getApiErrorMessage } from "../../config/errorCodes";
import { SNACKBAR_TYPES, snackbarAction } from "../snackbarSlice";

function* fetchPermissions() {
  try {
    const { data } = yield call(fetchPermissionsApi);
    yield put(rolesPermissionsAction.fetchPermissionsSuccess(data ?? {}));
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(rolesPermissionsAction.fetchPermissionsFailed(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* fetchRoles() {
  try {
    const { data } = yield call(fetchRolesApi);
    yield put(rolesPermissionsAction.fetchRolesSuccess(data ?? []));
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(rolesPermissionsAction.fetchRolesFailed(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* updateRolePermissions({ payload }) {
  try {
    const { roleId, permissionIds } = payload;
    const { data } = yield call(updateRolePermissionsApi, roleId, permissionIds);
    yield put(rolesPermissionsAction.updateRolePermissionsSuccess(data));
    yield put(snackbarAction.showSnackbar({ message: "Permissions updated successfully", type: SNACKBAR_TYPES.SUCCESS }));
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(rolesPermissionsAction.updateRolePermissionsFailed(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

export default function* rolesPermissionsSaga() {
  yield takeLatest(rolesPermissionsAction.fetchPermissionsStart.type, fetchPermissions);
  yield takeLatest(rolesPermissionsAction.fetchRolesStart.type, fetchRoles);
  yield takeLatest(rolesPermissionsAction.updateRolePermissionsStart.type, updateRolePermissions);
}
