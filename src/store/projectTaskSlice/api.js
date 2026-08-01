import { getRequest, postRequest, putRequest, deleteRequest } from "../../config/authAxios";
import { TASKS_BY_PROJECT_PREFIX, TASKS_BY_PROJECT_SUFFIX, ADD_TASK_NEW, UPDATE_TASK_PREFIX, UPDATE_TASK_SUFFIX, DELETE_TASK_PREFIX, DELETE_TASK_SUFFIX, FETCH_EMPLOYEES_BASIC, ADD_TASK_ASSIGNMENT, TASK_ASSIGNMENT_PREFIX } from "../../config/apiPath";

export const fetchTasksByProjectApi = (projectId) => {
  return getRequest(`${TASKS_BY_PROJECT_PREFIX}${projectId}${TASKS_BY_PROJECT_SUFFIX}`, {});
};

export const addTaskApi = (budgetId, taskName, taskStartDate, taskEndDate) => {
  return postRequest(ADD_TASK_NEW, {
    budgetId,
    taskName,
    taskStartDate,
    taskEndDate
  });
};

export const updateTaskApi = (taskId, taskName, taskStartDate, taskEndDate) => {
  return putRequest(`${UPDATE_TASK_PREFIX}${taskId}${UPDATE_TASK_SUFFIX}`, {
    taskName,
    taskStartDate,
    taskEndDate
  });
};

export const deleteTaskApi = (taskId) => {
  return deleteRequest(`${DELETE_TASK_PREFIX}${taskId}${DELETE_TASK_SUFFIX}`, {});
};

export const fetchEmployeesBasicApi = () => {
  return getRequest(FETCH_EMPLOYEES_BASIC, {});
};

export const addTaskAssignmentApi = (taskId, employeeId, allocatedHours, allocatedRate) => {
  return postRequest(ADD_TASK_ASSIGNMENT, {
    taskId,
    employeeId,
    allocatedHours: Number(allocatedHours),
    allocatedRate: Number(allocatedRate),
  });
};

export const deleteTaskAssignmentApi = (assignmentId) => {
  return deleteRequest(`${TASK_ASSIGNMENT_PREFIX}${assignmentId}`, {});
};

export const updateTaskAssignmentApi = (assignmentId, allocatedHours, allocatedRate) => {
  return putRequest(`${TASK_ASSIGNMENT_PREFIX}${assignmentId}`, {
    allocatedHours: Number(allocatedHours),
    allocatedRate: Number(allocatedRate),
  });
};
