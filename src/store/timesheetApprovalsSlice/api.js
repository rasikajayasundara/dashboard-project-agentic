import { TIMESHEETS_FOR_REVIEW, REVIEW_TIMESHEET } from "../../config/apiPath";
import { getRequest, putRequest } from "../../config/authAxios";

export const fetchTimesheetsForReviewApi = () =>
  getRequest(TIMESHEETS_FOR_REVIEW, {});

export const reviewTimesheetApi = ({ timesheetId, action, comment }) =>
  putRequest(REVIEW_TIMESHEET, { timesheetId, action, comment });
