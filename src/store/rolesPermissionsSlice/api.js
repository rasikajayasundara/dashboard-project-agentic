import { getRequest, putRequest } from "../../config/authAxios";
import { PERMISSIONS_LIST, ROLES_LIST, UPDATE_ROLE_PERMISSIONS_PREFIX, UPDATE_ROLE_PERMISSIONS_SUFFIX } from "../../config/apiPath";

export const fetchPermissionsApi = () => getRequest(PERMISSIONS_LIST, {});

export const fetchRolesApi = () => getRequest(ROLES_LIST, {});

export const updateRolePermissionsApi = (roleId, permissionIds) =>
  putRequest(`${UPDATE_ROLE_PERMISSIONS_PREFIX}${roleId}${UPDATE_ROLE_PERMISSIONS_SUFFIX}`, { permissionIds });
