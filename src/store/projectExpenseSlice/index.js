import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  error: "",
  expenses: [],
  isSubmitting: false,
  deletingExpenseId: null,
};

const projectExpenseSlice = createSlice({
  name: "projectExpense",
  initialState,
  reducers: {
    fetchExpensesStart(state) {
      state.isLoading = true;
      state.error = "";
    },
    fetchExpensesSuccess(state, action) {
      state.isLoading = false;
      state.expenses = action.payload || [];
    },
    fetchExpensesFail(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    addExpenseStart(state) {
      state.isSubmitting = true;
      state.error = "";
    },
    addExpenseSuccess(state, action) {
      state.isSubmitting = false;
      state.expenses.push(action.payload);
    },
    addExpenseFail(state, action) {
      state.isSubmitting = false;
      state.error = action.payload;
    },
    updateExpenseStart(state) {
      state.isSubmitting = true;
      state.error = "";
    },
    updateExpenseSuccess(state, action) {
      state.isSubmitting = false;
      const idx = state.expenses.findIndex(e => e.expenseId === action.payload.expenseId);
      if (idx >= 0) {
        state.expenses[idx] = action.payload;
      }
    },
    updateExpenseFail(state, action) {
      state.isSubmitting = false;
      state.error = action.payload;
    },
    deleteExpenseStart(state, action) {
      state.deletingExpenseId = action.payload;
      state.error = "";
    },
    deleteExpenseSuccess(state, action) {
      state.deletingExpenseId = null;
      const expenseId = action.payload;
      state.expenses = state.expenses.filter(e => e.expenseId !== expenseId);
    },
    deleteExpenseFail(state, action) {
      state.deletingExpenseId = null;
      state.error = action.payload;
    },
  },
});

export const { actions: projectExpenseAction, reducer: projectExpenseReducer } =
  projectExpenseSlice;
