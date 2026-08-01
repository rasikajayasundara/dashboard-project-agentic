import {
  EXPENSES_BY_PROJECT_PREFIX, EXPENSES_BY_PROJECT_SUFFIX,
  ADD_EXPENSE, UPDATE_EXPENSE_PREFIX, DELETE_EXPENSE_PREFIX,
  STORAGE_UPLOAD,
} from "../../config/apiPath";
import { getRequest, postRequest, putRequest, deleteRequest } from "../../config/authAxios";

export const fetchExpensesByProjectApi = (pid) => {
  return getRequest(`${EXPENSES_BY_PROJECT_PREFIX}${pid}${EXPENSES_BY_PROJECT_SUFFIX}`, {});
};

export const addExpenseApi = (payload) => {
  return postRequest(ADD_EXPENSE, payload);
};

export const updateExpenseApi = (expenseId, payload) => {
  return putRequest(`${UPDATE_EXPENSE_PREFIX}${expenseId}`, payload);
};

export const deleteExpenseApi = (expenseId) => {
  return deleteRequest(`${DELETE_EXPENSE_PREFIX}${expenseId}`);
};

// Called directly from the AddExpense/EditExpense modal components (not dispatched
// through the saga) because it needs the raw axios onUploadProgress callback to drive
// the in-modal progress bar — mirrors uploadDocumentApi in src/store/projectSlice/api.js,
// just with section: "expense" instead of "project".
export const uploadExpenseAttachmentApi = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);
  formData.append("section", "expense");
  return postRequest(STORAGE_UPLOAD, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
};
