import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: "",
  isLoading: false,
  isValidating: false,
  validateData: {},
  newPasswordCreated: false,
  message: "",
  error: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens(state, action) {
      state.accessToken = action.payload.accessToken;
    },
    clearTokens(state) {
      state.accessToken = "";
    },
    logoutStart(state) {},

    validateTokenStart(state, action) {
      state.isValidating = true;
    },
    validateTokenSuccess(state, action) {
      state.isValidating = false;
      state.validateData = action.payload;
      state.message = action.payload?.message;
    },
    validateTokenFailed(state, action) {
      state.isValidating = false;
      state.error = action.payload;
    },

    addNewPasswordStart(state, action) {
      state.isLoading = true;
    },
    addNewPasswordSuccess(state, action) {
      state.isLoading = false;
      state.newPasswordCreated = true;
      state.message = action.payload;
    },
    addNewPasswordFailed(state, action) {
      state.isLoading = false;
      state.newPasswordCreated = false;
      state.error = action.payload;
      state.message = "";
      
    },
  },
});

export const { actions: authAction, reducer: authReducer } = authSlice;
