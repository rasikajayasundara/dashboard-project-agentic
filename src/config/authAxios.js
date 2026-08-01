import axios from "axios";

import store from "../store/store";
import { AUTH_LOGIN, AUTH_REFRESH_TOKEN } from "./apiPath";
import { API_BASE_URL } from "./api";
import { loginAction } from "../store/LoginSlice";
import { getPermissionFlags } from "./permissionHandler";
import { authAction } from "../store/authSlice";
import { secureStorage } from "../utils/encryptedStorage";
import { snackbarAction, SNACKBAR_TYPES } from "../store/snackbarSlice";

const SESSION_EXPIRED_REDIRECT_DELAY_MS = 2500;

let failedRequestsQueue = [];
let isRefreshing = false;

const ignoreURLS = [AUTH_REFRESH_TOKEN, AUTH_LOGIN];

const authAxios = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
    "Cache-Control": "no-cache",
  },
});

authAxios.interceptors.request.use(async (config) => {
  const token = await store.getState().auth.accessToken;

  config.headers = {
    ...config.headers,
  };

  if (!ignoreURLS.includes(config.url) && !config.headers?.retry) {
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

authAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !ignoreURLS.includes(originalRequest.url)
    ) {
      originalRequest._retry = true;
      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({ config: originalRequest, resolve, reject });
        if (!isRefreshing) {
          isRefreshing = true;
          refreshToken()
            .then((newToken) => {
              failedRequestsQueue.forEach(({ config, resolve, reject }) => {
                config.headers = {
                  ...config.headers,
                  Authorization: `Bearer ${newToken}`,
                  retry: true,
                };
                authAxios(config).then(resolve).catch(reject);
              });
              failedRequestsQueue = [];
              isRefreshing = false;
            })
            .catch((err) => {
              failedRequestsQueue.forEach(({ reject }) => reject(err));
              failedRequestsQueue = [];
              isRefreshing = false;

              secureStorage().removeItem("hasSession");
              store.dispatch(authAction.clearTokens());
              store.dispatch(loginAction.loginReset());

              if (window.location.pathname.toLowerCase() !== "/login") {
                store.dispatch(
                  snackbarAction.showSnackbar({
                    message: "Your session has expired. Redirecting to login...",
                    type: SNACKBAR_TYPES.ERROR,
                  })
                );
                setTimeout(() => {
                  window.location.href = "/login";
                }, SESSION_EXPIRED_REDIRECT_DELAY_MS);
              }
            });
        }
      });
    }

    return Promise.reject(error);
  }
);

export async function refreshToken() {
  store.dispatch(loginAction.loginAuthenticating());
  try {
    // refreshToken cookie is httpOnly — sent automatically via withCredentials,
    // never read or written from JS. The backend returns profileData/modules
    // here the same way it does on login, since no client-side cache backs this anymore.
    // X-Requested-With is required by the backend's CSRF check on this endpoint (and /v2/auth/logout).
    const response = await authAxios.post(AUTH_REFRESH_TOKEN, undefined, {
      headers: { "X-Requested-With": "XMLHttpRequest" },
    });

    if (response.status === 200) {
      const newToken = response.data?.data?.accessToken;
      const profileData = response.data?.data?.profileData;
      const permissions = getPermissionFlags(response.data?.data?.modules);

      store.dispatch(authAction.setTokens({ accessToken: newToken }));
      store.dispatch(
        loginAction.loginSuccess({
          profileData,
          permissions,
        })
      );
      secureStorage().setItem("hasSession", true);
      return newToken;
    }

    throw new Error("Invalid refresh response");
  } catch (error) {
    throw error;
  }
}

export const getRequest = (url, headers) =>
  authAxios.get(url, headers).then((data) => data.data);

export const postRequest = (url, data, headers) =>
  authAxios.post(url, data, headers).then((data) => data.data);

export const putRequest = (url, data, headers) =>
  authAxios.put(url, data, headers).then((data) => data.data);

export const patchRequest = (url, data, headers) =>
  authAxios.patch(url, data, headers).then((data) => data.data);

export const deleteRequest = (url, headers) =>
  authAxios.delete(url, headers).then((data) => data.data);

export default authAxios;
