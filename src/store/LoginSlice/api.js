import { AUTH_LOGIN } from "../../config/apiPath";

import { postRequest } from "../../config/authAxios";

export const authLoginApi = (payload) => {
  return postRequest(AUTH_LOGIN, payload, {});
};
