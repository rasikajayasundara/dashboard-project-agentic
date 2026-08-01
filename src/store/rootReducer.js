import { combineReducers } from "redux";

import { snackbarReducer } from "./snackbarSlice";
import { projectReducer } from "./projectSlice";
import { employeesReducer } from "./employeesSlice";
import { loginReducer } from "./LoginSlice";
import { authReducer } from "./authSlice";
import { forgotPasswordReducer } from "./forgotPasswordSlice";
import { clientReducer } from "./clientSlice";
import { metadataReducer } from "./metadataSlice";
import { timesheetReducer } from "./timesheetSlice";
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
  employees: employeesReducer,
  clients: clientReducer,
  metadata: metadataReducer,
  forgotPassword: forgotPasswordReducer,
  changePassword: changePasswordReducer,
  timesheets: timesheetReducer,
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
