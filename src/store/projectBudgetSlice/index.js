import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  error: "",
  budgets: [],
  statusUpdatingIds: [],
  isSubmitting: false,
  deletingBudgetId: null,
};

const projectBudgetSlice = createSlice({
  name: "projectBudget",
  initialState,
  reducers: {
    fetchBudgetsStart(state) {
      state.isLoading = true;
      state.error = "";
    },
    fetchBudgetsSuccess(state, action) {
      state.isLoading = false;
      state.budgets = action.payload || [];
    },
    fetchBudgetsFail(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateBudgetStatusStart(state, action) {
      const { budgetId, status } = action.payload;
      state.statusUpdatingIds.push(budgetId);
      // Optimistic: immediately flip the status in the store
      const idx = state.budgets.findIndex(b => b.budgetId === budgetId);
      if (idx >= 0) {
        state.budgets[idx].status = status === "active" ? 1 : 0;
      }
    },
    updateBudgetStatusSuccess(state, action) {
      const { budgetId } = action.payload;
      state.statusUpdatingIds = state.statusUpdatingIds.filter(id => id !== budgetId);
      // Status is already updated optimistically; nothing more to do
    },
    updateBudgetStatusFail(state, action) {
      const { budgetId, previousStatus } = action.payload;
      state.statusUpdatingIds = state.statusUpdatingIds.filter(id => id !== budgetId);
      // Rollback: revert to the previous status
      const idx = state.budgets.findIndex(b => b.budgetId === budgetId);
      if (idx >= 0) {
        state.budgets[idx].status = previousStatus;
      }
    },
    addBudgetStart(state) {
      state.isSubmitting = true;
      state.error = "";
    },
    addBudgetSuccess(state, action) {
      state.isSubmitting = false;
      state.budgets.push({ status: 1, ...action.payload });
    },
    addBudgetFail(state, action) {
      state.isSubmitting = false;
      state.error = action.payload;
    },
    updateBudgetStart(state) {
      state.isSubmitting = true;
      state.error = "";
    },
    updateBudgetSuccess(state, action) {
      state.isSubmitting = false;
      const idx = state.budgets.findIndex(b => b.budgetId === action.payload.budgetId);
      if (idx >= 0) {
        state.budgets[idx] = action.payload;
      }
    },
    updateBudgetFail(state, action) {
      state.isSubmitting = false;
      state.error = action.payload;
    },
    deleteBudgetStart(state, action) {
      state.deletingBudgetId = action.payload;
      state.error = "";
    },
    deleteBudgetSuccess(state, action) {
      state.deletingBudgetId = null;
      const budgetId = action.payload;
      state.budgets = state.budgets.filter(b => b.budgetId !== budgetId);
    },
    deleteBudgetFail(state, action) {
      state.deletingBudgetId = null;
      state.error = action.payload;
    },
  },
});

export const { actions: projectBudgetAction, reducer: projectBudgetReducer } =
  projectBudgetSlice;
