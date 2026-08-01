import { call, put, takeLatest } from "redux-saga/effects";

import { employeesAction } from ".";
import { fetchEmployeeByTypeApi, fetchEmployeeListApi, fetchEmployeeDetailApi, addEmployeeApi, updateEmployeeApi, deleteEmployeeApi, fetchEmployeeProjectsApi, fetchMyProjectsApi, fetchEmployeeTasksApi, fetchMyTasksApi, updateTaskAssignmentStatusApi, fetchMyProfileApi, updateMyProfileApi, resendActivationApi } from "./api";
import { getApiErrorMessage } from "../../config/errorCodes";
import { SNACKBAR_TYPES, snackbarAction } from "../snackbarSlice";

function* fetchEmployeeByType({ payload }) {
  try {
    const  {data} = yield call(fetchEmployeeByTypeApi, payload.type);
    yield put(employeesAction.getEmployeeByTypeSuccess(data));
  } catch (error) {
    const status = error.response?.status || error.status;
    const errorMsg = status === 404 ? "No employees found" : getApiErrorMessage(error);
    yield put(employeesAction.getEmployeeByTypeFail(errorMsg));
  }
}

function* fetchEmployeeList() {
  try {
    const { data } = yield call(fetchEmployeeListApi);
    yield put(employeesAction.getEmployeeListSuccess(data));
  } catch (error) {
    const status = error.response?.status || error.status;
    const errorMsg = status === 404 ? "No employees found" : getApiErrorMessage(error);
    yield put(employeesAction.getEmployeeListFailed(errorMsg));
  }
}

function* fetchEmployeeDetail({ payload: employeeId }) {
  try {
    const { data } = yield call(fetchEmployeeDetailApi, employeeId);
    yield put(employeesAction.getEmployeeDetailSuccess(data));
  } catch (error) {
    const status = error.response?.status || error.status;
    const errorMsg = status === 404 ? "Employee not found" : getApiErrorMessage(error);
    yield put(employeesAction.getEmployeeDetailFailed(errorMsg));
  }
}

function* fetchEmployeeTasks({ payload }) {
  const { employeeId, myProfile } = payload;
  try {
    const { data } = myProfile
      ? yield call(fetchMyTasksApi)
      : yield call(fetchEmployeeTasksApi, employeeId);
    yield put(employeesAction.getEmployeeTasksSuccess(data ?? []));
  } catch (error) {
    yield put(employeesAction.getEmployeeTasksFailed(getApiErrorMessage(error)));
  }
}

function* updateTaskAssignmentStatus({ payload: { assignmentId, status } }) {
  try {
    yield call(updateTaskAssignmentStatusApi, assignmentId, status);
    yield put(employeesAction.updateTaskAssignmentStatusSuccess({ assignmentId }));
    yield put(
      snackbarAction.showSnackbar({
        message: "Task marked as completed",
        type: SNACKBAR_TYPES.SUCCESS,
      })
    );
  } catch (error) {
    const errorMsg = getApiErrorMessage(error);
    yield put(employeesAction.updateTaskAssignmentStatusFailed(errorMsg));
    yield put(
      snackbarAction.showSnackbar({
        message: errorMsg,
        type: SNACKBAR_TYPES.ERROR,
      })
    );
  }
}

function* fetchMyProfile() {
  try {
    const { data } = yield call(fetchMyProfileApi);
    yield put(employeesAction.getEmployeeDetailSuccess(data));
  } catch (error) {
    yield put(employeesAction.getEmployeeDetailFailed(getApiErrorMessage(error)));
  }
}

function* addEmployee({ payload }) {
  try {
    yield call(addEmployeeApi, payload);
    yield put(employeesAction.addEmployeeSuccess());
    yield put(
      snackbarAction.showSnackbar({
        message: "Employee added successfully",
        type: SNACKBAR_TYPES.SUCCESS,
      })
    );
    yield put(employeesAction.getEmployeeListStart());
  } catch (error) {
    const errorMsg = getApiErrorMessage(error);
    yield put(employeesAction.addEmployeeFailed(errorMsg));
    yield put(
      snackbarAction.showSnackbar({
        message: errorMsg,
        type: SNACKBAR_TYPES.ERROR,
      })
    );
  }
}

function* updateEmployee({ payload: { employeeId, values } }) {
  try {
    yield call(updateEmployeeApi, employeeId, values);
    const { data } = yield call(fetchEmployeeDetailApi, employeeId);
    yield put(employeesAction.updateEmployeeSuccess(data));
    yield put(
      snackbarAction.showSnackbar({
        message: "Employee updated successfully",
        type: SNACKBAR_TYPES.SUCCESS,
      })
    );
  } catch (error) {
    const errorMsg = getApiErrorMessage(error);
    yield put(employeesAction.updateEmployeeFailed(errorMsg));
    yield put(
      snackbarAction.showSnackbar({
        message: errorMsg,
        type: SNACKBAR_TYPES.ERROR,
      })
    );
  }
}

function* updateMyProfile({ payload: values }) {
  try {
    yield call(updateMyProfileApi, values);
    const { data } = yield call(fetchMyProfileApi);
    yield put(employeesAction.updateMyProfileSuccess(data));
    yield put(
      snackbarAction.showSnackbar({
        message: "Profile updated successfully",
        type: SNACKBAR_TYPES.SUCCESS,
      })
    );
  } catch (error) {
    const errorMsg = getApiErrorMessage(error);
    yield put(employeesAction.updateMyProfileFailed(errorMsg));
    yield put(
      snackbarAction.showSnackbar({
        message: errorMsg,
        type: SNACKBAR_TYPES.ERROR,
      })
    );
  }
}

function* deleteEmployee({ payload: employeeId }) {
  try {
    yield call(deleteEmployeeApi, employeeId);
    yield put(employeesAction.deleteEmployeeSuccess());
    yield put(
      snackbarAction.showSnackbar({
        message: "Employee deleted successfully",
        type: SNACKBAR_TYPES.SUCCESS,
      })
    );
  } catch (error) {
    const errorMsg = getApiErrorMessage(error);
    yield put(employeesAction.deleteEmployeeFailed(errorMsg));
    yield put(
      snackbarAction.showSnackbar({
        message: errorMsg,
        type: SNACKBAR_TYPES.ERROR,
      })
    );
  }
}

function* fetchEmployeeProjects({ payload }) {
  const { employeeId, myProfile } = payload;
  try {
    const { data } = myProfile
      ? yield call(fetchMyProjectsApi)
      : yield call(fetchEmployeeProjectsApi, employeeId);
    yield put(employeesAction.getEmployeeProjectsSuccess(data.projects ?? []));
  } catch (error) {
    yield put(employeesAction.getEmployeeProjectsFailed(getApiErrorMessage(error)));
  }
}

function* resendActivation({ payload: employeeId }) {
  try {
    yield call(resendActivationApi, employeeId);
    yield put(employeesAction.resendActivationSuccess());
    yield put(
      snackbarAction.showSnackbar({
        message: "Activation email resent",
        type: SNACKBAR_TYPES.SUCCESS,
      })
    );
  } catch (error) {
    const errorMsg = getApiErrorMessage(error);
    yield put(employeesAction.resendActivationFailed(errorMsg));
    yield put(
      snackbarAction.showSnackbar({
        message: errorMsg,
        type: SNACKBAR_TYPES.ERROR,
      })
    );
  }
}

export default function* employeesSaga() {
  yield takeLatest(
    employeesAction.getEmployeeByTypeStart.type,
    fetchEmployeeByType
  );
  yield takeLatest(employeesAction.getEmployeeListStart.type, fetchEmployeeList);
  yield takeLatest(employeesAction.getEmployeeDetailStart.type, fetchEmployeeDetail);
  yield takeLatest(employeesAction.getMyProfileStart.type, fetchMyProfile);
  yield takeLatest(employeesAction.addEmployeeStart.type, addEmployee);
  yield takeLatest(employeesAction.updateEmployeeStart.type, updateEmployee);
  yield takeLatest(employeesAction.updateMyProfileStart.type, updateMyProfile);
  yield takeLatest(employeesAction.deleteEmployeeStart.type, deleteEmployee);
  yield takeLatest(employeesAction.getEmployeeProjectsStart.type, fetchEmployeeProjects);
  yield takeLatest(employeesAction.getEmployeeTasksStart.type, fetchEmployeeTasks);
  yield takeLatest(employeesAction.updateTaskAssignmentStatusStart.type, updateTaskAssignmentStatus);
  yield takeLatest(employeesAction.resendActivationStart.type, resendActivation);
}
