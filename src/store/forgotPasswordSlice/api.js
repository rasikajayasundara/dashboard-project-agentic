import { FORGOT_PASS_AUTH_TOKEN, FORGOT_PASS_CHANGE, FORGOT_PASS_REQUEST } from "../../config/apiPath";
import { postRequest } from "../../config/authAxios";

export const forgotPasswordEmailApi = (payload) => {
  return postRequest(FORGOT_PASS_REQUEST, payload, {});
};

export const forgotPassAuthApi = (payload) => {
  return postRequest(FORGOT_PASS_AUTH_TOKEN, payload, {});
};

export const changePasswordApi = (payload) => {
  return postRequest(FORGOT_PASS_CHANGE, payload, {});
};
