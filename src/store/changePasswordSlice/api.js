import { CHANGE_PASSWORD } from "../../config/apiPath";
import { postRequest } from "../../config/authAxios";

export const changePasswordApi = (current, newPassword) =>
  postRequest(CHANGE_PASSWORD, {
    currentPassword: current,
    newPassword: newPassword,
  });
