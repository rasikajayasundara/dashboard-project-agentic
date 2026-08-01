import {
  ADD_NEW_PASSWORD,
  VALIDATE_ACTIVATION_TOKEN,
  AUTH_LOGOUT,
} from "../../config/apiPath";
import { postRequest } from "../../config/authAxios";

export const activationTokenValidateApi = (payload) => {
  return postRequest(VALIDATE_ACTIVATION_TOKEN, payload, {});
};
export const addNewPasswordApi = (payload) => {
  return postRequest(ADD_NEW_PASSWORD, payload, {});
};

export const logoutApi = () =>
  postRequest(AUTH_LOGOUT, undefined, { headers: { "X-Requested-With": "XMLHttpRequest" } });
