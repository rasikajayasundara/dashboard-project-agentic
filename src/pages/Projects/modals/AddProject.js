import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { colors, fontSize } from "../../../constants/common";
import { formatBytes } from "../../../utils/common";
import useFormValidation from "../../../hooks/useFormValidation";
import FormField, { FormInput, FormDatePicker, FormSelectDropdown, FormSearchDropdown, parseLocalDate } from "../../../components/FormField";
import ToggleSwitch from "../../../components/ToggleSwitch";
import {
  Overlay, ModalBox, ModalBody,
  ModalHeader, ModalTitle, CloseBtn,
  ModalFooter, FooterButtons, CancelBtn, SaveBtn,
} from "../../../components/ModalShell";
import {
  FormGrid,
  AttachmentsSection, AttachmentsHeader, AttachmentsTitle, AttachmentsHint,
  AttachmentList, AttachmentRow, FileIcon, FileMeta, FileNameText, FileSize,
  UploadTrack, UploadFill, UploadPct, UploadedCheck, UploadError,
  RowIconBtn, NewAttachmentRow, AttachBtn, HiddenFileInput,
} from "./form.styles";
import { projectAction } from "../../../store/projectSlice";
import { uploadDocumentApi } from "../../../store/projectSlice/api";
import { clientAction } from "../../../store/clientSlice";
import { employeesAction } from "../../../store/employeesSlice";

const now = new Date();
const TODAY = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

const INITIAL_VALUES = {
  projectName:       "",
  clientId:          "",
  projectManagerId:  "",
  feeType:           "1",
  officeLocation:    "",
  marketSegment:     "",
  projectType:       "1",
  startDate:         TODAY,
  endDate:           "",
};

const RULES = {
  projectName:       { required: true, label: "Project Name"     },
  clientId:          { required: true, label: "Client"           },
  projectManagerId:  { required: true, label: "Project Manager"  },
  feeType:           { required: true, label: "Billing Type"     },
  officeLocation:    { required: true, label: "Office Location"  },
  marketSegment:     { required: true, label: "Market Segment"   },
  startDate:         { required: true, label: "Start Date", maxField: "endDate", maxLabel: "the End Date"     },
  endDate:           { required: true, label: "End Date", minField: "startDate", minLabel: "the Start Date"  },
};

const FEE_OPTIONS    = [{ label: "Fixed", value: "1" }, { label: "Hourly", value: "2" }];
const HOURLY_FEE     = "2"; // non-billable projects are always Hourly
const ACTIVE_CLIENT_STATUS = 1;
const SEGMENT_OPTIONS = [
  "Architecture", "Assessment", "Cultural", "Electrical", "Environmental",
  "Flooding", "Geotech", "Heritage", "Infrastructure", "Insurance",
  "Peer Review", "Planning consents", "Seismic", "Structural", "Surveying",
  "Three waters", "Training", "Transport", "Wind Assessment",
];

export default function AddProject({ onClose }) {
  const dispatch = useDispatch();
  const { values, errors, handleChange, validate, reset } = useFormValidation(INITIAL_VALUES, RULES);

  const { clients } = useSelector((state) => state?.clients) || {};
  const { projectManagesList } = useSelector((state) => state?.employees) || {};
  const { officeLocations } = useSelector((state) => state?.metadata) || {};
  const { addProject } = useSelector((state) => state?.project) || {};
  const { isLoading: isSaving, savedAt } = addProject || {};

  useEffect(() => {
    dispatch(clientAction.clientListStart());
    dispatch(employeesAction.getEmployeeByTypeStart({ type: "PM" }));
  }, [dispatch]);

  useEffect(() => {
    if (savedAt) {
      reset();
      onClose();
      dispatch(projectAction.resetAddProject());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedAt]);

  const clientOptions = useMemo(
    () =>
      (clients || [])
        .filter((c) => c.status === ACTIVE_CLIENT_STATUS)
        .map((c) => ({ label: c.name, value: String(c.id) })),
    [clients]
  );

  const managerOptions = useMemo(
    () =>
      (projectManagesList || []).map((pm) => ({
        label: `${pm.firstName} ${pm.lastName}`,
        value: String(pm.employeeId),
      })),
    [projectManagesList]
  );

  const officeOptions = useMemo(
    () => (officeLocations || []).map((loc) => ({ value: loc.locationId, label: loc.officeLocation })),
    [officeLocations]
  );

  const isBillable = values.projectType === "1";

  function handleTypeToggle(checked) {
    handleChange("projectType", checked ? "1" : "2");
    // Non-billable projects are locked to Hourly; going back to billable
    // clears the fee so the user picks one deliberately.
    handleChange("feeType", checked ? "" : HOURLY_FEE);
  }

  // ── Attachments ──
  // Each entry: { key, fileName, size, progress, status: "uploading"|"done"|"error", documentId, file }
  const [attachments, setAttachments] = useState([]);
  const [newFileName, setNewFileName] = useState("");
  const fileInputRef = useRef(null);
  const isUploading = attachments.some((a) => a.status === "uploading");

  const patchAttachment = (key, patch) =>
    setAttachments((prev) => prev.map((a) => (a.key === key ? { ...a, ...patch } : a)));

  function startUpload(entry) {
    uploadDocumentApi(entry.file, entry.fileName, (e) => {
      const pct = e.total ? Math.round((e.loaded / e.total) * 100) : 0;
      patchAttachment(entry.key, { progress: pct });
    })
      .then(({ data }) => {
        patchAttachment(entry.key, { status: "done", progress: 100, documentId: data.documentId });
      })
      .catch(() => {
        patchAttachment(entry.key, { status: "error" });
      });
  }

  function handleFileSelected(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    const fileName = newFileName.trim();
    if (!file || !fileName) return;

    const entry = {
      key: `${Date.now()}-${file.name}`,
      fileName,
      size: file.size,
      progress: 0,
      status: "uploading",
      documentId: null,
      file,
    };
    setAttachments((prev) => [...prev, entry]);
    setNewFileName("");
    startUpload(entry);
  }

  function handleRetry(entry) {
    patchAttachment(entry.key, { status: "uploading", progress: 0 });
    startUpload(entry);
  }

  const removeAttachment = (key) =>
    setAttachments((prev) => prev.filter((a) => a.key !== key));

  function handleSubmit() {
    if (!validate() || isUploading) return;
    dispatch(projectAction.addNewProjectStart({
      projectName:      values.projectName,
      clientId:         parseInt(values.clientId),
      projectManagerId: parseInt(values.projectManagerId),
      projectType:      parseInt(values.projectType),
      locationId:       values.officeLocation,
      marketSegment:    values.marketSegment,
      billingType:      parseInt(values.feeType),
      startDate:        values.startDate,
      endDate:          values.endDate,
      attachments:      attachments.filter((a) => a.status === "done").map((a) => a.documentId),
    }));
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <Overlay onClick={handleClose}>
      <ModalBox $maxWidth="680px" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <ModalHeader>
          <ModalTitle>Add Project</ModalTitle>
          <CloseBtn onClick={handleClose}><i className="bi bi-x-lg" /></CloseBtn>
        </ModalHeader>

        {/* ── Body ── */}
        <ModalBody>
          <FormGrid>

            <FormField label="Project Name" required error={errors.projectName} $full>
              <FormInput
                type="text"
                placeholder="e.g. Wellington Bridge Assessment"
                value={values.projectName}
                $error={!!errors.projectName}
                onChange={(e) => handleChange("projectName", e.target.value)}
              />
            </FormField>

            <FormField label="Client" required error={errors.clientId}>
              <FormSearchDropdown
                value={values.clientId}
                $error={!!errors.clientId}
                onChange={(val) => handleChange("clientId", val)}
                placeholder="Select client"
                options={clientOptions}
              />
            </FormField>

            <FormField label="Project Manager" required error={errors.projectManagerId}>
              <FormSearchDropdown
                value={values.projectManagerId}
                $error={!!errors.projectManagerId}
                onChange={(val) => handleChange("projectManagerId", val)}
                placeholder="Select project manager"
                options={managerOptions}
              />
            </FormField>

            <FormField label="Project Type" required error={errors.projectType}>
              <ToggleSwitch
                checked={isBillable}
                onChange={handleTypeToggle}
                label={isBillable ? "Billable" : "Non-Billable"}
              />
            </FormField>

            <FormField label="Billing Type" required error={errors.feeType}>
              <FormSelectDropdown
                value={values.feeType}
                $error={!!errors.feeType}
                onChange={(val) => handleChange("feeType", val)}
                placeholder="Select billing type"
                options={FEE_OPTIONS}
                disabled={!isBillable}
              />
            </FormField>

            <FormField label="Office Location" required error={errors.officeLocation}>
              <FormSearchDropdown
                value={values.officeLocation}
                $error={!!errors.officeLocation}
                onChange={(val) => handleChange("officeLocation", val)}
                placeholder="Select office location"
                options={officeOptions}
              />
            </FormField>

            <FormField label="Market Segment" required error={errors.marketSegment}>
              <FormSearchDropdown
                value={values.marketSegment}
                $error={!!errors.marketSegment}
                onChange={(val) => handleChange("marketSegment", val)}
                placeholder="Select market segment"
                options={SEGMENT_OPTIONS}
              />
            </FormField>

            <FormField label="Start Date" required error={errors.startDate}>
              <FormDatePicker
                value={values.startDate}
                onChange={(str) => handleChange("startDate", str)}
                $error={!!errors.startDate}
                maxDate={parseLocalDate(values.endDate)}
              />
            </FormField>

            <FormField label="End Date" required error={errors.endDate}>
              <FormDatePicker
                value={values.endDate}
                onChange={(str) => handleChange("endDate", str)}
                $error={!!errors.endDate}
                minDate={parseLocalDate(values.startDate)}
              />
            </FormField>

          </FormGrid>

          {/* ── Attachments ── */}
          <AttachmentsSection>
            <AttachmentsHeader>
              <AttachmentsTitle>Attachments</AttachmentsTitle>
              <AttachmentsHint>Optional — type a file name, then attach the file to start uploading</AttachmentsHint>
            </AttachmentsHeader>

            {attachments.length > 0 && (
              <AttachmentList>
                {attachments.map((a) => (
                  <AttachmentRow key={a.key}>
                    <FileIcon
                      className={a.status === "error" ? "bi bi-file-earmark-x" : "bi bi-file-earmark-text"}
                      $error={a.status === "error"}
                    />
                    <FileMeta>
                      <FileNameText>{a.fileName}</FileNameText>
                      {a.status === "uploading" && (
                        <UploadTrack>
                          <UploadFill $pct={a.progress} />
                        </UploadTrack>
                      )}
                      {a.status === "error" && <UploadError>Upload failed</UploadError>}
                    </FileMeta>
                    <FileSize>{formatBytes(a.size)}</FileSize>
                    {a.status === "uploading" && <UploadPct>{a.progress}%</UploadPct>}
                    {a.status === "done" && (
                      <UploadedCheck>
                        <i className="bi bi-check-circle-fill" />
                        Uploaded
                      </UploadedCheck>
                    )}
                    {a.status === "error" && (
                      <RowIconBtn onClick={() => handleRetry(a)} title="Retry upload">
                        <i className="bi bi-arrow-clockwise" />
                      </RowIconBtn>
                    )}
                    {a.status !== "uploading" && (
                      <RowIconBtn $danger onClick={() => removeAttachment(a.key)} title="Remove">
                        <i className="bi bi-x-lg" />
                      </RowIconBtn>
                    )}
                  </AttachmentRow>
                ))}
              </AttachmentList>
            )}

            <NewAttachmentRow>
              <FormInput
                type="text"
                placeholder="Type a file name, e.g. Site survey report"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
              />
              {newFileName.trim() && (
                <AttachBtn type="button" onClick={() => fileInputRef.current?.click()}>
                  <i className="bi bi-paperclip" />
                  Attach file
                </AttachBtn>
              )}
              <HiddenFileInput ref={fileInputRef} type="file" onChange={handleFileSelected} />
            </NewAttachmentRow>
          </AttachmentsSection>
        </ModalBody>

        {/* ── Footer ── */}
        <ModalFooter>
          <span style={{ fontSize: fontSize.subtitle, color: colors.textMuted }}>* All fields required</span>
          <FooterButtons>
            <CancelBtn onClick={handleClose}>Cancel</CancelBtn>
            <SaveBtn onClick={handleSubmit} disabled={isUploading || isSaving}>
              {isUploading ? "Uploading…" : isSaving ? "Saving…" : "Add Project"}
            </SaveBtn>
          </FooterButtons>
        </ModalFooter>

      </ModalBox>
    </Overlay>
  );
}
