import { BUDGETS_BY_PROJECT_PREFIX, BUDGETS_BY_PROJECT_SUFFIX, BUDGET_STATUS_UPDATE_PREFIX, BUDGET_STATUS_UPDATE_SUFFIX, ADD_BUDGET, UPDATE_BUDGET_PREFIX, UPDATE_BUDGET_SUFFIX, DELETE_BUDGET_PREFIX, DELETE_BUDGET_SUFFIX } from "../../config/apiPath";
import { getRequest, putRequest, postRequest, deleteRequest } from "../../config/authAxios";

export const fetchBudgetsByProjectApi = (pid) => {
  return getRequest(`${BUDGETS_BY_PROJECT_PREFIX}${pid}${BUDGETS_BY_PROJECT_SUFFIX}`, {});
};

export const updateBudgetStatusApi = (budgetId, status) => {
  return putRequest(`${BUDGET_STATUS_UPDATE_PREFIX}${budgetId}${BUDGET_STATUS_UPDATE_SUFFIX}`, { status });
};

export const addBudgetApi = (projectId, budgetName, budgetType, budgetAmount) => {
  return postRequest(ADD_BUDGET, {
    projectId,
    budgetName,
    budgetType,
    budgetAmount: String(budgetAmount),
  });
};

export const updateBudgetApi = (budgetId, budgetName, budgetType, budgetAmount) => {
  return putRequest(`${UPDATE_BUDGET_PREFIX}${budgetId}${UPDATE_BUDGET_SUFFIX}`, {
    budgetName,
    budgetType,
    budgetAmount: String(budgetAmount),
  });
};

export const deleteBudgetApi = (budgetId) => {
  return deleteRequest(`${DELETE_BUDGET_PREFIX}${budgetId}${DELETE_BUDGET_SUFFIX}`);
};
