import {
  FETCH_EMPLOYEES_BY_TYPE,
  FETCH_EMPLOYEES_LIST,
  EMPLOYEE_DETAILS,
  ADD_EMPLOYEE,
  PROJECTS_BY_EMPLOYEE_PREFIX,
  PROJECTS_BY_EMPLOYEE_SUFFIX,
  MY_PROJECTS,
  TASKS_BY_EMPLOYEE_PREFIX,
  TASKS_BY_EMPLOYEE_SUFFIX,
  MY_TASK_ASSIGNMENTS,
  TASK_ASSIGNMENT_STATUS_SUFFIX,
  MY_PROFILE,
  RESEND_ACTIVATION,
} from "../../config/apiPath";
import { getRequest, postRequest, putRequest, deleteRequest } from "../../config/authAxios";

export const fetchEmployeeByTypeApi = (type) => {
  return getRequest(`${FETCH_EMPLOYEES_BY_TYPE}${type}`, {});
};

export const fetchEmployeeListApi = () => getRequest(FETCH_EMPLOYEES_LIST, {});

export const fetchEmployeeDetailApi = (employeeId) =>
  getRequest(`${EMPLOYEE_DETAILS}${employeeId}`, {});

export const addEmployeeApi = (payload) => postRequest(ADD_EMPLOYEE, payload, {});

export const updateEmployeeApi = (employeeId, payload) =>
  putRequest(`${EMPLOYEE_DETAILS}${employeeId}`, payload, {});

export const deleteEmployeeApi = (employeeId) =>
  deleteRequest(`${EMPLOYEE_DETAILS}${employeeId}`, {});

export const fetchEmployeeProjectsApi = (employeeId) =>
  getRequest(`${PROJECTS_BY_EMPLOYEE_PREFIX}${employeeId}${PROJECTS_BY_EMPLOYEE_SUFFIX}`, {});

export const fetchMyProjectsApi = () => getRequest(MY_PROJECTS, {});

export const fetchEmployeeTasksApi = (employeeId) =>
  getRequest(`${TASKS_BY_EMPLOYEE_PREFIX}${employeeId}${TASKS_BY_EMPLOYEE_SUFFIX}`, {});

export const fetchMyTasksApi = () => getRequest(MY_TASK_ASSIGNMENTS, {});

export const updateTaskAssignmentStatusApi = (assignmentId, status) =>
  putRequest(`${TASKS_BY_EMPLOYEE_PREFIX}${assignmentId}${TASK_ASSIGNMENT_STATUS_SUFFIX}`, { status }, {});

export const fetchMyProfileApi = () => getRequest(MY_PROFILE, {});

export const updateMyProfileApi = (payload) => putRequest(MY_PROFILE, payload, {});

export const resendActivationApi = (employeeId) =>
  postRequest(RESEND_ACTIVATION, { employeeId }, {});
