import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isLogInSuccess: false,
  isAuthenticating: false,
  user: null,
  permissions: null,
  error: "",
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loginStart(state, action) {
      state.isLoading = true;
    },
    loginSuccess(state, action) {
      state.isLoading = false;
      state.isLogInSuccess = true;
      state.isAuthenticating = false;
      state.user = action.payload?.profileData ?? null;
      state.permissions = action.payload?.permissions ?? {};
    },
    loginAuthenticating(state) {
      state.isAuthenticating = true;
    },
    loginFail(state, action) {
      state.isLogInSuccess = false;
      state.isLoading = false;
      state.error = action.payload;
    },
    loginReset(state, action) {
      state.isLogInSuccess = false;
      state.user = null;
      state.permissions = null;
      state.error = "";
    },
  },
});

export const { actions: loginAction, reducer: loginReducer } = loginSlice;
