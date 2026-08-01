import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import { fetchTasksByProjectApi, addTaskApi, updateTaskApi, deleteTaskApi, fetchEmployeesBasicApi, addTaskAssignmentApi, deleteTaskAssignmentApi, updateTaskAssignmentApi } from "./api";
import { getApiErrorMessage } from "../../config/errorCodes";
import { projectTaskAction } from ".";
import { SNACKBAR_TYPES, snackbarAction } from "../snackbarSlice";

function* fetchTasksByProjectSaga({ payload }) {
  try {
    const { data } = yield call(fetchTasksByProjectApi, payload);
    yield put(projectTaskAction.fetchTasksSuccess(data));
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(projectTaskAction.fetchTasksFail(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* addTaskSaga({ payload }) {
  const { budgetId, taskName, taskStartDate, taskEndDate, onSuccess } = payload;
  try {
    const { data } = yield call(addTaskApi, budgetId, taskName, taskStartDate, taskEndDate);
    yield put(projectTaskAction.addTaskSuccess(data));
    yield put(snackbarAction.showSnackbar({ message: "Task added successfully", type: SNACKBAR_TYPES.SUCCESS }));
    if (onSuccess) onSuccess();
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(projectTaskAction.addTaskFail(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* updateTaskSaga({ payload }) {
  const { taskId, taskName, taskStartDate, taskEndDate, onSuccess } = payload;
  try {
    const { data } = yield call(updateTaskApi, taskId, taskName, taskStartDate, taskEndDate);
    yield put(projectTaskAction.updateTaskSuccess(data));
    yield put(snackbarAction.showSnackbar({ message: "Task updated successfully", type: SNACKBAR_TYPES.SUCCESS }));
    if (onSuccess) onSuccess();
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(projectTaskAction.updateTaskFail(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* deleteTaskSaga({ payload: taskId }) {
  try {
    yield call(deleteTaskApi, taskId);
    yield put(projectTaskAction.deleteTaskSuccess(taskId));
    yield put(snackbarAction.showSnackbar({ message: "Task Deleted Successfully!", type: SNACKBAR_TYPES.SUCCESS }));
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(projectTaskAction.deleteTaskFail(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* fetchEmployeesBasicSaga() {
  try {
    const { data } = yield call(fetchEmployeesBasicApi);
    yield put(projectTaskAction.fetchEmployeesSuccess(data));
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(projectTaskAction.fetchEmployeesFail(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* addTaskAssignmentSaga({ payload }) {
  const { taskId, employeeId, allocatedHours, allocatedRate, projectId } = payload;
  try {
    const { data } = yield call(addTaskAssignmentApi, taskId, employeeId, allocatedHours, allocatedRate);
    yield put(projectTaskAction.addAssignmentSuccess(data));
    yield put(snackbarAction.showSnackbar({ message: "Assignment added successfully", type: SNACKBAR_TYPES.SUCCESS }));
    if (projectId) {
      yield put(projectTaskAction.fetchTasksStart(projectId));
    }
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(projectTaskAction.addAssignmentFail(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* deleteTaskAssignmentSaga({ payload }) {
  const { assignmentId, projectId } = payload;
  try {
    yield call(deleteTaskAssignmentApi, assignmentId);
    yield put(projectTaskAction.deleteAssignmentSuccess(assignmentId));
    yield put(snackbarAction.showSnackbar({ message: "Assignment removed successfully", type: SNACKBAR_TYPES.SUCCESS }));
    if (projectId) {
      yield put(projectTaskAction.fetchTasksStart(projectId));
    }
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(projectTaskAction.deleteAssignmentFail(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* updateTaskAssignmentSaga({ payload }) {
  const { assignmentId, allocatedHours, allocatedRate, projectId } = payload;
  try {
    yield call(updateTaskAssignmentApi, assignmentId, allocatedHours, allocatedRate);
    yield put(projectTaskAction.updateAssignmentSuccess({ assignmentId, allocatedHours, allocatedRate }));
    yield put(snackbarAction.showSnackbar({ message: "Assignment updated successfully", type: SNACKBAR_TYPES.SUCCESS }));
    if (projectId) {
      yield put(projectTaskAction.fetchTasksStart(projectId));
    }
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(projectTaskAction.updateAssignmentFail(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

export default function* projectTaskSaga() {
  yield takeLatest(projectTaskAction.fetchTasksStart.type, fetchTasksByProjectSaga);
  yield takeLatest(projectTaskAction.addTaskStart.type, addTaskSaga);
  yield takeLatest(projectTaskAction.updateTaskStart.type, updateTaskSaga);
  yield takeLatest(projectTaskAction.deleteTaskStart.type, deleteTaskSaga);
  yield takeLatest(projectTaskAction.fetchEmployeesStart.type, fetchEmployeesBasicSaga);
  yield takeEvery(projectTaskAction.addAssignmentStart.type, addTaskAssignmentSaga);
  yield takeLatest(projectTaskAction.deleteAssignmentStart.type, deleteTaskAssignmentSaga);
  yield takeLatest(projectTaskAction.updateAssignmentStart.type, updateTaskAssignmentSaga);
}
