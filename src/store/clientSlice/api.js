import {
  CLIENTS_DETAILS_LIST,
  ADD_CLIENT,
  CLIENT_DETAILS,
  PROJECTS_BY_CLIENT_PREFIX,
  PROJECTS_BY_CLIENT_SUFFIX,
  INVOICES_BY_CLIENT_PREFIX,
  INVOICES_BY_CLIENT_SUFFIX,
} from "../../config/apiPath";
import { getRequest, postRequest, putRequest, deleteRequest } from "../../config/authAxios";

export const fetchClientListApi = () => getRequest(CLIENTS_DETAILS_LIST, {});

export const addClientApi = (payload) => postRequest(ADD_CLIENT, payload, {});

export const fetchClientDetailApi = (clientId) =>
  getRequest(`${CLIENT_DETAILS}${clientId}`, {});

export const updateClientApi = (clientId, payload) =>
  putRequest(`${CLIENT_DETAILS}${clientId}`, payload, {});

export const deleteClientApi = (clientId) =>
  deleteRequest(`${CLIENT_DETAILS}${clientId}`, {});

export const fetchClientProjectsApi = (clientId) =>
  getRequest(`${PROJECTS_BY_CLIENT_PREFIX}${clientId}${PROJECTS_BY_CLIENT_SUFFIX}`, {});

export const fetchClientInvoicesApi = (clientId) =>
  getRequest(`${INVOICES_BY_CLIENT_PREFIX}${clientId}${INVOICES_BY_CLIENT_SUFFIX}`, {});
