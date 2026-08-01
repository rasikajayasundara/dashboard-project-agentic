import {
  PROJECT_DETAILS,
  PROJECT_GENERAL_STATS_PREFIX,
  PROJECT_GENERAL_STATS_SUFFIX,
} from "../../config/apiPath";
import { getRequest } from "../../config/authAxios";

export const fetchProjectDetailsApi = (payload) => {
  return getRequest(`${PROJECT_DETAILS}${payload}`, {});
};

export const fetchProjectGeneralStatsApi = (projectId) => {
  return getRequest(
    `${PROJECT_GENERAL_STATS_PREFIX}${projectId}${PROJECT_GENERAL_STATS_SUFFIX}`,
    {}
  );
};
