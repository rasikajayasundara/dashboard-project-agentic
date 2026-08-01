import { TIMESHEETS_BY_EMPLOYEE_PREFIX, TIMESHEETS_BY_EMPLOYEE_SUFFIX, TIME_ENTRIES_PREFIX, LOG_TIME_TASKS_PREFIX, LOG_TIME_TASKS_SUFFIX, SAVE_TIME_ENTRIES, DELETE_TIME_ENTRY_PREFIX, SUBMIT_TIMESHEET, MY_TIMESHEETS, MY_TIME_ENTRIES_PREFIX, MY_LOG_TIME_TASKS_PREFIX, MY_TIMESHEET_GRAPH, TIMESHEET_GRAPH_PREFIX, TIMESHEET_GRAPH_SUFFIX } from "../../config/apiPath";
import { getRequest, postRequest, deleteRequest, putRequest } from "../../config/authAxios";

export const fetchTimesheetsByEmployeeApi = (employeeId) =>
  getRequest(`${TIMESHEETS_BY_EMPLOYEE_PREFIX}${employeeId}${TIMESHEETS_BY_EMPLOYEE_SUFFIX}`, {});

export const fetchLogTimeTasksApi = (employeeId, date) =>
  getRequest(`${LOG_TIME_TASKS_PREFIX}${employeeId}${LOG_TIME_TASKS_SUFFIX}${date}`, {});

export const fetchTimeEntriesApi = (weekStart, employeeId, timesheetId) => {
  const path = timesheetId
    ? `${TIME_ENTRIES_PREFIX}${weekStart}/${employeeId}/${timesheetId}`
    : `${TIME_ENTRIES_PREFIX}${weekStart}/${employeeId}`;
  return getRequest(path, {});
};

export const saveTimeEntriesApi = (payload) =>
  postRequest(SAVE_TIME_ENTRIES, payload);

export const deleteTimeEntryApi = (entryId) =>
  deleteRequest(`${DELETE_TIME_ENTRY_PREFIX}${entryId}`);

export const submitTimesheetApi = (timesheetId) =>
  putRequest(SUBMIT_TIMESHEET, { timesheetId });

export const fetchMyTimesheetsApi = () =>
  getRequest(MY_TIMESHEETS, {});

export const fetchMyTimeEntriesApi = (weekStart, timesheetId) => {
  const path = timesheetId
    ? `${MY_TIME_ENTRIES_PREFIX}${weekStart}/${timesheetId}`
    : `${MY_TIME_ENTRIES_PREFIX}${weekStart}`;
  return getRequest(path, {});
};

export const fetchMyLogTimeTasksApi = (date) =>
  getRequest(`${MY_LOG_TIME_TASKS_PREFIX}${date}`, {});

export const fetchMyTimesheetGraphApi = () =>
  getRequest(MY_TIMESHEET_GRAPH, {});

export const fetchTimesheetGraphApi = (userId) =>
  getRequest(`${TIMESHEET_GRAPH_PREFIX}${userId}${TIMESHEET_GRAPH_SUFFIX}`, {});
