import { getRequest } from "../../config/authAxios";
import { PROJECT_TEAM_PREFIX, PROJECT_TEAM_SUFFIX } from "../../config/apiPath";

export const fetchProjectTeamApi = (projectId) => {
  return getRequest(`${PROJECT_TEAM_PREFIX}${projectId}${PROJECT_TEAM_SUFFIX}`, {});
};
