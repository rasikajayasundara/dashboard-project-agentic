import { call, put, takeLatest, takeEvery } from "redux-saga/effects";

import { notificationAction } from ".";
import {
  fetchNotificationsApi,
  fetchRecentNotificationsApi,
  markNotificationReadApi,
} from "./api";
import { loginAction } from "../LoginSlice";
import { getApiErrorMessage } from "../../config/errorCodes";
import socket from "../../utils/socket";

function* fetchNotifications() {
  try {
    const { data } = yield call(fetchNotificationsApi);
    yield put(notificationAction.getNotificationsSuccess(data ?? []));
  } catch (error) {
    yield put(notificationAction.getNotificationsFailed(getApiErrorMessage(error)));
  }
}

function* fetchRecentNotifications() {
  try {
    const { data } = yield call(fetchRecentNotificationsApi);
    yield put(notificationAction.getRecentNotificationsSuccess(data ?? []));
  } catch (error) {
    yield put(notificationAction.getRecentNotificationsFailed(getApiErrorMessage(error)));
  }
}

function* markNotificationRead({ payload }) {
  try {
    const { id } = payload;
    const { data } = yield call(markNotificationReadApi, id);
    yield put(notificationAction.markNotificationReadSuccess(data));
  } catch (error) {
    yield put(notificationAction.markNotificationReadFailed(getApiErrorMessage(error)));
  }
}

function* connectNotificationSocket() {
  yield call([socket, socket.connect]);
}

export default function* notificationSaga() {
  yield takeLatest(notificationAction.getNotificationsStart.type, fetchNotifications);
  yield takeLatest(notificationAction.getRecentNotificationsStart.type, fetchRecentNotifications);
  yield takeLatest(loginAction.loginSuccess.type, fetchRecentNotifications);
  yield takeLatest(loginAction.loginSuccess.type, connectNotificationSocket);
  yield takeEvery(notificationAction.markNotificationReadStart.type, markNotificationRead);
}
