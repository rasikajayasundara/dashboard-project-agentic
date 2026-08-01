import {
  CREATE_NEW_PROJECT,
  PROJECT_UPDATE_PREFIX,
  FATCH_CLIENT_PROJECTS,
  FETCH_PROJECTS,
  PROJECT_DETAILS,
  STORAGE_UPLOAD,
  PROJECT_STATUS_UPDATE_PREFIX,
  PROJECT_STATUS_UPDATE_SUFFIX,
} from "../../config/apiPath";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "../../config/authAxios";

export const fetchProjectListApi = () => {
  return getRequest(FETCH_PROJECTS, {});
};

export const fetchClientsProjectsApi = (payload) => {
  return getRequest(
    `${FATCH_CLIENT_PROJECTS}${payload?.empid}`,
    {}
  );
};

export const fetchProjectByFiltersApi = (payload) => {
  const { search, status, client, projectmanager } = payload;
  return getRequest(
    `${FETCH_PROJECTS}?search=${search}&status=${status}&client=${client}&projectManager=${projectmanager}`,
    {}
  );
};

export const fetchProjectDetailsApi = (payload) => {
  return getRequest(`${PROJECT_DETAILS}${payload}`, {});
};

export const addNewProjectApi = (payload) => {
  return postRequest(CREATE_NEW_PROJECT, payload, {});
};

export const updateProjectApi = (payload) => {
  const { projectId, successMessage, ...body } = payload;
  return putRequest(`${PROJECT_UPDATE_PREFIX}${projectId}`, body);
};

export const deleteProjectApi = (projectId) => {
  return deleteRequest(`${PROJECT_UPDATE_PREFIX}${projectId}`, {});
};

export const updateProjectStatusApi = (projectId, status) => {
  return putRequest(`${PROJECT_STATUS_UPDATE_PREFIX}${projectId}${PROJECT_STATUS_UPDATE_SUFFIX}`, { status });
};

// Called directly from components (not via saga) because upload progress
// events must feed per-row local state through onUploadProgress.
export const uploadDocumentApi = (file, fileName, onUploadProgress) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", fileName);
  formData.append("section", "project");
  return postRequest(STORAGE_UPLOAD, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
};
