import {
  SETTINGS_METADATA,
  JOB_TITLE_ROLE_UPDATE_PREFIX,
  JOB_TITLE_ROLE_UPDATE_SUFFIX,
} from "../../config/apiPath";
import { getRequest, putRequest } from "../../config/authAxios";

export const fetchMetadataApi = () => getRequest(SETTINGS_METADATA, {});

export const updateJobTitleRoleApi = (jobTitleId, roleId) =>
  putRequest(`${JOB_TITLE_ROLE_UPDATE_PREFIX}${jobTitleId}${JOB_TITLE_ROLE_UPDATE_SUFFIX}`, { roleId });
