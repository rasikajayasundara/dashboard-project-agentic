import {
  INVOICE_DETAIL,
  INVOICES_LIST,
  CREATE_INVOICE,
  INVOICE_STATUS_PREFIX,
  INVOICE_STATUS_SUFFIX,
  INVOICES_BY_PROJECT_PREFIX,
  INVOICES_BY_PROJECT_SUFFIX,
  DELETE_INVOICE,
} from "../../config/apiPath";
import { getRequest, postRequest, putRequest, deleteRequest } from "../../config/authAxios";

export const fetchInvoiceDetailApi = (invoiceId) =>
  getRequest(`${INVOICE_DETAIL}${invoiceId}`, {});

export const fetchInvoiceListApi = () => getRequest(INVOICES_LIST, {});

export const fetchInvoicesByProjectApi = (projectId) =>
  getRequest(`${INVOICES_BY_PROJECT_PREFIX}${projectId}${INVOICES_BY_PROJECT_SUFFIX}`, {});

export const deleteInvoiceApi = (invoiceId) =>
  deleteRequest(`${DELETE_INVOICE}${invoiceId}`, {});

export const createInvoiceApi = (payload) => postRequest(CREATE_INVOICE, payload);

export const updateInvoiceStatusApi = (invoiceId, payload) =>
  putRequest(`${INVOICE_STATUS_PREFIX}${invoiceId}${INVOICE_STATUS_SUFFIX}`, payload, {});

// GET/PUT/DELETE all hit invoices/{invoiceId} - same path, different verb.
export const updateInvoiceApi = (invoiceId, payload) =>
  putRequest(`${INVOICE_DETAIL}${invoiceId}`, payload, {});
