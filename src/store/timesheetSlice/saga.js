import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import { fetchTimesheetsByEmployeeApi, fetchTimeEntriesApi, fetchLogTimeTasksApi, saveTimeEntriesApi, deleteTimeEntryApi, submitTimesheetApi, fetchMyTimesheetsApi, fetchMyTimeEntriesApi, fetchMyLogTimeTasksApi, fetchMyTimesheetGraphApi, fetchTimesheetGraphApi } from "./api";
import { timesheetAction } from ".";
import { getApiErrorMessage } from "../../config/errorCodes";
import { SNACKBAR_TYPES, snackbarAction } from "../snackbarSlice";

const DAY_ABBR  = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MON_ABBR  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function isoToLabel(isoDate) {
  // Handles both "2026-02-09" and "2026-02-08T11:00:00.000Z"
  const d = new Date(isoDate.length === 10 ? isoDate + "T00:00:00Z" : isoDate);
  return `${DAY_ABBR[d.getUTCDay()]} ${d.getUTCDate()} ${MON_ABBR[d.getUTCMonth()]}`;
}

function* fetchTimesheetsByEmployee({ payload }) {
  const { employeeId, myProfile } = payload;
  try {
    const { data } = myProfile
      ? yield call(fetchMyTimesheetsApi)
      : yield call(fetchTimesheetsByEmployeeApi, employeeId);
    yield put(timesheetAction.getTimesheetsSuccess(data ?? []));
  } catch (error) {
    yield put(timesheetAction.getTimesheetsFailed(getApiErrorMessage(error)));
  }
}

function* fetchTimeEntries({ payload }) {
  const { cacheKey, timesheetId, weekStart, employeeId, myProfile } = payload;
  try {
    const { data } = myProfile
      ? yield call(fetchMyTimeEntriesApi, weekStart, timesheetId)
      : yield call(fetchTimeEntriesApi, weekStart, employeeId, timesheetId);

    const entries = (data.entries ?? []).map((e) => ({
      id:          e.entryId,
      date:        isoToLabel(e.date),
      projectNo:   e.projectNo,
      projectName: e.projectName,
      budgetName:  e.budgetName,
      taskName:    e.taskName,
      allocated:   Number(e.allocatedHours),
      worked:      Number(e.workedHours),
      hours:       Number(e.entryHours),
      comment:     e.comment,
    }));

    const leaveDates = (data.leaves   ?? []).map((l) => isoToLabel(l.leaveDate));
    const holidays   = (data.holidays ?? []).map((h) => ({
      date: isoToLabel(h.holidayDate),
      name: h.holidayType ?? "Public Holiday",
    }));

    yield put(timesheetAction.getTimeEntriesSuccess({ cacheKey, entries, leaveDates, holidays }));
  } catch (error) {
    yield put(timesheetAction.getTimeEntriesFailed({ cacheKey, error: getApiErrorMessage(error) }));
  }
}

function* fetchLogTimeTasks({ payload }) {
  const { employeeId, date, myProfile } = payload;
  try {
    const { data } = myProfile
      ? yield call(fetchMyLogTimeTasksApi, date)
      : yield call(fetchLogTimeTasksApi, employeeId, date);
    yield put(timesheetAction.getLogTimeTasksSuccess({
      loggedEntries: data.loggedEntries ?? [],
      projects:      data.projects      ?? [],
    }));
  } catch (error) {
    yield put(timesheetAction.getLogTimeTasksFailed(getApiErrorMessage(error)));
  }
}

function* saveTimeEntries({ payload }) {
  try {
    yield call(saveTimeEntriesApi, payload);
    yield put(timesheetAction.saveTimeEntriesSuccess());
    yield put(snackbarAction.showSnackbar({ message: "Time entries saved successfully", type: SNACKBAR_TYPES.SUCCESS }));
    yield put(timesheetAction.getTimesheetsStart({ employeeId: payload.employeeId, myProfile: payload.myProfile }));
    if (payload.cacheKey) {
      yield put(timesheetAction.getTimeEntriesStart({
        cacheKey:    payload.cacheKey,
        timesheetId: payload.timesheetId,
        weekStart:   payload.weekStartDate,
        employeeId:  payload.employeeId,
        myProfile:   payload.myProfile,
      }));
    }
  } catch (error) {
    yield put(timesheetAction.saveTimeEntriesFailed(getApiErrorMessage(error)));
    yield put(snackbarAction.showSnackbar({ message: getApiErrorMessage(error), type: SNACKBAR_TYPES.ERROR }));
  }
}

function* deleteTimeEntry({ payload }) {
  const { entryId, employeeId, cacheKey, weekStart, timesheetId, myProfile, date } = payload;
  try {
    yield call(deleteTimeEntryApi, entryId);
    yield put(timesheetAction.deleteTimeEntrySuccess(entryId));
    yield put(snackbarAction.showSnackbar({ message: "Time entry deleted", type: SNACKBAR_TYPES.SUCCESS }));
    yield put(timesheetAction.getTimesheetsStart({ employeeId, myProfile }));
    if (date) {
      yield put(timesheetAction.getLogTimeTasksStart({ employeeId, date, myProfile }));
    }
    if (cacheKey) {
      yield put(timesheetAction.getTimeEntriesStart({
        cacheKey,
        timesheetId,
        weekStart,
        employeeId,
        myProfile,
      }));
    }
  } catch (error) {
    yield put(timesheetAction.deleteTimeEntryFailed(getApiErrorMessage(error)));
    yield put(snackbarAction.showSnackbar({ message: getApiErrorMessage(error), type: SNACKBAR_TYPES.ERROR }));
  }
}

function* submitTimesheet({ payload }) {
  const { timesheetId, employeeId, myProfile } = payload;
  try {
    yield call(submitTimesheetApi, timesheetId);
    yield put(timesheetAction.submitTimesheetSuccess());
    yield put(snackbarAction.showSnackbar({ message: "Timesheet submitted successfully", type: SNACKBAR_TYPES.SUCCESS }));
    yield put(timesheetAction.getTimesheetsStart({ employeeId, myProfile }));
  } catch (error) {
    yield put(timesheetAction.submitTimesheetFailed(getApiErrorMessage(error)));
    yield put(snackbarAction.showSnackbar({ message: getApiErrorMessage(error), type: SNACKBAR_TYPES.ERROR }));
  }
}

function* fetchTimesheetGraph({ payload }) {
  const { employeeId, myProfile } = payload;
  try {
    const { data } = myProfile
      ? yield call(fetchMyTimesheetGraphApi)
      : yield call(fetchTimesheetGraphApi, employeeId);
    yield put(timesheetAction.getTimesheetGraphSuccess({
      hoursByProject: data.hoursByProject ?? [],
      weeklyTrend:    data.weeklyTrend ?? [],
    }));
  } catch (error) {
    yield put(timesheetAction.getTimesheetGraphFailed(getApiErrorMessage(error)));
  }
}

export default function* timesheetSaga() {
  yield takeLatest(timesheetAction.getTimesheetsStart.type, fetchTimesheetsByEmployee);
  yield takeEvery(timesheetAction.getTimeEntriesStart.type, fetchTimeEntries);
  yield takeLatest(timesheetAction.getLogTimeTasksStart.type, fetchLogTimeTasks);
  yield takeLatest(timesheetAction.saveTimeEntriesStart.type, saveTimeEntries);
  yield takeLatest(timesheetAction.deleteTimeEntryStart.type, deleteTimeEntry);
  yield takeEvery(timesheetAction.submitTimesheetStart.type, submitTimesheet);
  yield takeLatest(timesheetAction.getTimesheetGraphStart.type, fetchTimesheetGraph);
}
