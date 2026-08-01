import { call, put, takeLatest } from "redux-saga/effects";
import { fetchTimesheetsForReviewApi, reviewTimesheetApi } from "./api";
import { timesheetApprovalsAction } from ".";
import { getApiErrorMessage } from "../../config/errorCodes";
import { SNACKBAR_TYPES, snackbarAction } from "../snackbarSlice";
import { toDisplayDate } from "../../utils/dateMaker";

const DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MON_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function isoToLabel(isoDate) {
  // Handles both "2026-02-09" and "2026-02-08T11:00:00.000Z"
  const d = new Date(isoDate.length === 10 ? isoDate + "T00:00:00Z" : isoDate);
  return `${DAY_ABBR[d.getUTCDay()]} ${d.getUTCDate()} ${MON_ABBR[d.getUTCMonth()]}`;
}

const STATUS_LABELS = { 1: "Pending Approval", 2: "Approved", 3: "Rejected" };

// Defensive — the OpenAPI spec's example for a related endpoint shows an
// inconsistent nested shape for what should be the same entry format, so
// this must not throw on missing/malformed timeEntries. Default to [].
function mapEntries(timeEntries) {
  if (!Array.isArray(timeEntries)) return [];
  return timeEntries
    .map((e) => {
      if (!e || typeof e !== "object" || !e.date) return null;
      return {
        id: e.entryId,
        date: isoToLabel(e.date),
        projectNo: e.projectNo,
        projectName: e.projectName,
        taskName: e.taskName,
        hours: Number(e.entryHours),
        comment: e.comment ?? undefined,
      };
    })
    .filter(Boolean);
}

function mapRecord(t) {
  return {
    id: t.timesheetId,
    employeeName: t.employeeName,
    role: t.jobTitle,
    weekLabel: t.timesheetName,
    totalHours: Number(t.workedHours),
    status: STATUS_LABELS[t.status] ?? "Pending Approval",
    reviewedDate: t.reviewedAt ? toDisplayDate(t.reviewedAt) : undefined,
    reason: t.reviewComments ?? undefined,
    entries: mapEntries(t.timeEntries),
  };
}

function* fetchForReview() {
  try {
    const { data } = yield call(fetchTimesheetsForReviewApi);
    const timesheets = Array.isArray(data?.timesheets) ? data.timesheets : [];
    const records = timesheets.map(mapRecord);
    const stats = {
      totalSubmitted: Number(data?.stats?.totalSubmitted ?? 0),
      pendingApproval: Number(data?.stats?.pendingApproval ?? 0),
      approved: Number(data?.stats?.approved ?? 0),
      rejected: Number(data?.stats?.rejected ?? 0),
    };
    yield put(timesheetApprovalsAction.getForReviewSuccess({ records, stats }));
  } catch (error) {
    yield put(timesheetApprovalsAction.getForReviewFailed(getApiErrorMessage(error)));
  }
}

function* reviewTimesheet({ payload }) {
  const { timesheetId, action, comment } = payload;
  try {
    yield call(reviewTimesheetApi, { timesheetId, action, comment });
    yield put(timesheetApprovalsAction.reviewTimesheetSuccess());
    yield put(snackbarAction.showSnackbar({
      message: action === "approve" ? "Timesheet approved" : "Timesheet rejected",
      type: SNACKBAR_TYPES.SUCCESS,
    }));
    yield put(timesheetApprovalsAction.getForReviewStart());
  } catch (error) {
    yield put(timesheetApprovalsAction.reviewTimesheetFailed(getApiErrorMessage(error)));
    yield put(snackbarAction.showSnackbar({ message: getApiErrorMessage(error), type: SNACKBAR_TYPES.ERROR }));
  }
}

export default function* timesheetApprovalsSaga() {
  yield takeLatest(timesheetApprovalsAction.getForReviewStart.type, fetchForReview);
  yield takeLatest(timesheetApprovalsAction.reviewTimesheetStart.type, reviewTimesheet);
}
