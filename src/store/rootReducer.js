import { combineReducers } from "redux";

import { snackbarReducer } from "./snackbarSlice";
import { projectReducer } from "./projectSlice";
import { employeesReducer } from "./employeesSlice";
import { projectDetailReducer } from "./projectDetailSlice";
import { loginReducer } from "./LoginSlice";
import { authReducer } from "./authSlice";
import { forgotPasswordReducer } from "./forgotPasswordSlice";
import { clientReducer } from "./clientSlice";
import { invoiceDetailReducer } from "./invoiceSlice";
import { metadataReducer } from "./metadataSlice";
import { timesheetReducer } from "./timesheetSlice";
import { timesheetApprovalsReducer } from "./timesheetApprovalsSlice";
import { projectBudgetReducer } from "./projectBudgetSlice";
import { projectExpenseReducer } from "./projectExpenseSlice";
import { projectTaskReducer } from "./projectTaskSlice";
import { projectTeamReducer } from "./projectTeamSlice";
import { rolesPermissionsReducer } from "./rolesPermissionsSlice";
import { changePasswordReducer } from "./changePasswordSlice";
import { notificationReducer } from "./notificationSlice";
import { pushNotificationReducer } from "./pushNotificationSlice";

export const RESET_STATE = "RESET_STATE";

const appReducer = combineReducers({
  auth: authReducer ,
  login: loginReducer,
  snackbar: snackbarReducer,
  project: projectReducer,
  projectDetails: projectDetailReducer,
  employees: employeesReducer,
  clients: clientReducer,
  invoiceDetail: invoiceDetailReducer,
  metadata: metadataReducer,
  forgotPassword: forgotPasswordReducer,
  changePassword: changePasswordReducer,
  timesheets: timesheetReducer,
  timesheetApprovals: timesheetApprovalsReducer,
  projectBudget: projectBudgetReducer,
  projectExpense: projectExpenseReducer,
  projectTask: projectTaskReducer,
  projectTeam: projectTeamReducer,
  rolesPermissions: rolesPermissionsReducer,
  notifications: notificationReducer,
  pushNotifications: pushNotificationReducer,
});

// On logout, wipe every slice back to its initialState rather than only
// the auth/login slices — otherwise stale data from the previous session
// (project lists, employee details, etc.) lingers in memory since this is
// an SPA with no full page reload between users.
const rootReducer = (state, action) => {
  if (action.type === RESET_STATE) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
