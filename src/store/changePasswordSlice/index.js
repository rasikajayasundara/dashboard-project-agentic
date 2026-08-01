import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  success: null,
  error: null,
};

const changePasswordSlice = createSlice({
  name: "changePassword",
  initialState,
  reducers: {
    changePasswordStart(state) {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    changePasswordSuccess(state, action) {
      state.isLoading = false;
      state.success = action.payload;
      state.error = null;
    },
    changePasswordFailed(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.success = null;
    },
  },
});

export const { actions: changePasswordAction, reducer: changePasswordReducer } =
  changePasswordSlice;
