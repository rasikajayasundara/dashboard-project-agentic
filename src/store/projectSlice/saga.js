import { call, put, takeLatest } from "redux-saga/effects";
import {
  addNewProjectApi,
  deleteProjectApi,
  fetchClientsProjectsApi,
  fetchProjectByFiltersApi,
  fetchProjectListApi,
  updateProjectApi,
  updateProjectStatusApi,
} from "./api";
import { projectAction } from ".";
import { getApiErrorMessage } from "../../config/errorCodes";
import { SNACKBAR_TYPES, snackbarAction } from "../snackbarSlice";

function* fetchProjects({ payload }) {
  try {
    if (payload?.empid) {
      const response = yield call(fetchClientsProjectsApi, payload?.empid);

      const projects = response.data.data.list || [];
      yield put(projectAction.projectListSuccess(projects));
    } else {
      const { data } = yield call(fetchProjectListApi);
      yield put(
        projectAction.projectListSuccess({
          projects: data.projects || [],
          stats: data.stats || { active: 0, overdue: 0, atRisk: 0 },
        })
      );
    }
  } catch (error) {
    yield put(projectAction.projectFailed(getApiErrorMessage(error)));
  }
}
function* fetchProjectByFilter({ payload }) {
  try {
    const { data } = yield call(fetchProjectByFiltersApi, payload);
    const projects = data.list || [];
    yield put(projectAction.projectListSuccess(projects));
  } catch (error) {
    yield put(projectAction.projectFailed(getApiErrorMessage(error)));
  }
}
function* addNewProject({ payload }) {
  try {
    yield call(addNewProjectApi, payload);
    yield put(projectAction.addProjectSuccess());
    yield put(snackbarAction.showSnackbar({ message: "Project created successfully", type: SNACKBAR_TYPES.SUCCESS }));
    yield put(projectAction.projectListStart());
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(projectAction.addProjectFailed(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* updateProject({ payload }) {
  try {
    yield call(updateProjectApi, payload);
    yield put(projectAction.updateProjectSuccess());
    yield put(snackbarAction.showSnackbar({ message: payload.successMessage || "Project updated successfully", type: SNACKBAR_TYPES.SUCCESS }));
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(projectAction.updateProjectFailed(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* deleteProject({ payload }) {
  const { projectId, successMessage } = payload;
  try {
    yield call(deleteProjectApi, projectId);
    yield put(projectAction.deleteProjectSuccess());
    yield put(snackbarAction.showSnackbar({ message: successMessage || "Project deleted successfully", type: SNACKBAR_TYPES.SUCCESS }));
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(projectAction.deleteProjectFailed(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

function* completeProject({ payload }) {
  const { projectId } = payload;
  try {
    yield call(updateProjectStatusApi, projectId, "completed");
    yield put(projectAction.completeProjectSuccess());
    yield put(snackbarAction.showSnackbar({ message: "Project marked as completed", type: SNACKBAR_TYPES.SUCCESS }));
  } catch (error) {
    const message = getApiErrorMessage(error);
    yield put(projectAction.completeProjectFailed(message));
    yield put(snackbarAction.showSnackbar({ message, type: SNACKBAR_TYPES.ERROR }));
  }
}

export default function* projectSaga() {
  yield takeLatest(projectAction.projectListStart.type,         fetchProjects);
  yield takeLatest(projectAction.projectListByFilterStart.type, fetchProjectByFilter);
  yield takeLatest(projectAction.addNewProjectStart.type,       addNewProject);
  yield takeLatest(projectAction.updateProjectStart.type,       updateProject);
  yield takeLatest(projectAction.deleteProjectStart.type,       deleteProject);
  yield takeLatest(projectAction.completeProjectStart.type,     completeProject);
}
