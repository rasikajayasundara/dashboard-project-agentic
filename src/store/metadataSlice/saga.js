import { call, put, takeLatest } from "redux-saga/effects";

import { metadataAction } from ".";
import { fetchMetadataApi, updateJobTitleRoleApi } from "./api";
import { loginAction } from "../LoginSlice";
import { getApiErrorMessage } from "../../config/errorCodes";
import { SNACKBAR_TYPES, snackbarAction } from "../snackbarSlice";

function* fetchMetadata() {
  try {
    const { data } = yield call(fetchMetadataApi);
    yield put(metadataAction.metadataSuccess(data));
  } catch (error) {
    yield put(metadataAction.metadataFailed(getApiErrorMessage(error)));
  }
}

function* updateJobTitleRole({ payload }) {
  try {
    const { jobTitleId, roleId } = payload;
    const { data } = yield call(updateJobTitleRoleApi, jobTitleId, roleId);
    yield put(metadataAction.updateJobTitleRoleSuccess(data));
    yield put(snackbarAction.showSnackbar({ message: "Job title role updated successfully", type: SNACKBAR_TYPES.SUCCESS }));
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(metadataAction.updateJobTitleRoleFailed(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

export default function* metadataSaga() {
  yield takeLatest(loginAction.loginSuccess.type, fetchMetadata);
  yield takeLatest(metadataAction.updateJobTitleRoleStart.type, updateJobTitleRole);
}
