import { getRequest, patchRequest } from "../../config/authAxios";
import {
  NOTIFICATIONS_LIST,
  NOTIFICATIONS_RECENT,
  NOTIFICATION_MARK_READ_PREFIX,
  NOTIFICATION_MARK_READ_SUFFIX,
} from "../../config/apiPath";

export const fetchNotificationsApi = () => getRequest(NOTIFICATIONS_LIST, {});

export const fetchRecentNotificationsApi = () =>
  getRequest(NOTIFICATIONS_RECENT, {});

export const markNotificationReadApi = (id) =>
  patchRequest(`${NOTIFICATION_MARK_READ_PREFIX}${id}${NOTIFICATION_MARK_READ_SUFFIX}`, {});
