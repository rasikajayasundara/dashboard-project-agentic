// The PUT /projects/{id} endpoint is a full-replace — changing the attached
// documents means resending every project field, mirroring how
// Projects/modals/EditProject.js already persists attachments. Shared by
// UploadDocument.js (add) and index.js (remove) so the mapping can't drift
// between the two call sites.
const mapProjectTypeToValue = (projectType) =>
  String(projectType || "").toLowerCase().includes("billable") &&
  !String(projectType || "").toLowerCase().includes("non")
    ? "1" : "2";

const mapBillingTypeToValue = (billingType) =>
  String(billingType || "").toLowerCase().includes("fixed") ? "1" : "2";

export default function buildProjectAttachmentsPayload(project, attachments, successMessage) {
  return {
    projectId:        project.projectId,
    projectName:      project.projectName,
    clientId:         parseInt(project.clientId),
    projectManagerId: parseInt(project.projectManagerId),
    projectType:      parseInt(mapProjectTypeToValue(project.projectType)),
    locationId:       project.locationId,
    marketSegment:    project.marketSegment,
    billingType:      parseInt(mapBillingTypeToValue(project.billingType)),
    startDate:        project.startDate,
    endDate:          project.endDate || null,
    attachments,
    successMessage,
  };
}
