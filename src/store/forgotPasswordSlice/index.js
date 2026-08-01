import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  serverRef: "",
  otpSent: false,
  forgotAuthData: {},
  resetPass: "",
  error: "",
};

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    emailOtpStart(state, action) {
      state.isLoading = true;
    },
    emailOtpSuccess(state, action) {
      state.isLoading = false;
      state.otpSent = true;
      state.serverRef = action.payload;
    },
    emailOtpFail(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    authStart(state, action) {
      state.isLoading = true;
    },
    authSuccess(state, action) {
      state.isLoading = false;
      state.forgotAuthData = action.payload;
    },
    authFail(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    changePasswordStart(state, action) {
      state.isLoading = true;
    },
    changePasswordSuccess(state, action) {
      state.isLoading = false;
      state.resetPass = action.payload;
    },
    changePasswordFail(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    forgotPasswordEnd(state) {
      state.isLoading = false;
      state.serverRef = "";
      state.otpSent = false;
      state.forgotAuthData = {};
      state.resetPass = "";
      state.error = "";
    },
  },
});

export const { actions: forgotPasswordAction, reducer: forgotPasswordReducer } =
  forgotPasswordSlice;
