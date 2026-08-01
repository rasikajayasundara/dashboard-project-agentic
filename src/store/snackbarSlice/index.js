// store/snackbarSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const SNACKBAR_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
};

const initialState = {
  open: false,
  message: "",
  type: SNACKBAR_TYPES.SUCCESS,
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnackbar: (state, action) => {
      state.open = true;
      state.message = action.payload.message;
      state.type = action.payload.type || "success";
    },
    hideSnackbar: (state) => {
      state.open = false;
      state.message = "";
    },
  },
});

export const { actions: snackbarAction, reducer: snackbarReducer } =
  snackbarSlice;
