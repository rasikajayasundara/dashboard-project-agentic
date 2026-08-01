import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { colors, fontSize } from "../../../../constants/common";
import useFormValidation from "../../../../hooks/useFormValidation";
import FormField, { FormInput } from "../../../../components/FormField";
import {
  Overlay, ModalBox, ModalBody,
  ModalHeader, ModalTitle, CloseBtn,
  ModalFooter, FooterButtons, CancelBtn, SaveBtn,
} from "../../../../components/ModalShell";
import { formatBytes } from "../../../../utils/common";
import { projectAction } from "../../../../store/projectSlice";
import { uploadDocumentApi } from "../../../../store/projectSlice/api";
import buildProjectAttachmentsPayload from "../projectAttachmentsPayload";
import {
  Dropzone, DropzoneIcon, DropzoneText, DropzoneSubtext, HiddenFileInput, BodyStack,
  PickedFileMeta, PickedFileName, PickedFileSize,
  ProgressBlock, ProgressTopRow, ProgressStatus, ProgressPct, ProgressTrack, ProgressFill,
  ErrorText, SubmittingOverlay, SubmittingText,
} from "./uploadDocument.styles";

const RULES = {
  fileName: { required: true, label: "File name" },
};

export default function UploadDocument({ project, existingDocumentIds = [], onClose }) {
  const dispatch = useDispatch();

  const { values, errors, handleChange, validate } = useFormValidation({ fileName: "" }, RULES);

  const { editProject } = useSelector((s) => s?.project) || {};
  const { savedAt } = editProject || {};

  const [file, setFile] = useState(null);
  const [phase, setPhase] = useState("idle"); // idle | uploading-file | updating-project | error
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const isSubmitting = phase === "uploading-file" || phase === "updating-project";

  useEffect(() => {
    if (savedAt) {
      onClose();
      dispatch(projectAction.resetEditProject());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedAt]);

  function applyPickedFile(picked) {
    if (!values.fileName.trim()) handleChange("fileName", picked.name);
    setFile(picked);
    setErrorMessage("");
  }

  function handleDropzoneClick() {
    if (isSubmitting) return;
    fileInputRef.current?.click();
  }

  function handleFileInputChange(e) {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (picked) applyPickedFile(picked);
  }

  function handleDragOver(e) {
    e.preventDefault();
    if (!isSubmitting) setDragActive(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setDragActive(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    if (isSubmitting) return;
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) applyPickedFile(dropped);
  }

  // Single click drives both calls in sequence: upload the file to storage,
  // then attach the returned documentId to the project.
  async function handleSubmit() {
    if (!validate() || !file || isSubmitting) return;
    setErrorMessage("");
    setPhase("uploading-file");
    setProgress(0);

    let documentId;
    try {
      const { data } = await uploadDocumentApi(file, values.fileName.trim(), (e) => {
        const pct = e.total ? Math.round((e.loaded / e.total) * 100) : 0;
        setProgress(pct);
      });
      documentId = data.documentId;
    } catch {
      setPhase("error");
      setErrorMessage("File upload failed. Please try again.");
      return;
    }

    setPhase("updating-project");
    dispatch(projectAction.updateProjectStart(
      buildProjectAttachmentsPayload(
        project,
        [...existingDocumentIds, documentId],
        "Document uploaded successfully"
      )
    ));
  }

  const uploadDisabled = !file || !values.fileName.trim() || isSubmitting;

  return (
    <Overlay onClick={isSubmitting ? undefined : onClose}>
      <ModalBox $maxWidth="460px" style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
        {isSubmitting && (
          <SubmittingOverlay>
            <div className="spinner-border text-secondary" role="status" />
            <SubmittingText>
              {phase === "uploading-file" ? `Uploading file… ${progress}%` : "Saving to project…"}
            </SubmittingText>
          </SubmittingOverlay>
        )}

        <ModalHeader>
          <ModalTitle>Upload Document</ModalTitle>
          <CloseBtn onClick={onClose} disabled={isSubmitting}><i className="bi bi-x-lg" /></CloseBtn>
        </ModalHeader>

        <ModalBody>
          <HiddenFileInput ref={fileInputRef} type="file" onChange={handleFileInputChange} />

          <BodyStack>
            <Dropzone
              $hasFile={!!file}
              $dragActive={dragActive}
              onClick={handleDropzoneClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!file ? (
                <>
                  <DropzoneIcon className="bi bi-cloud-arrow-up" />
                  <DropzoneText>Drag & drop a file here</DropzoneText>
                  <DropzoneSubtext>or click to browse</DropzoneSubtext>
                </>
              ) : (
                <>
                  <DropzoneIcon className="bi bi-file-earmark-arrow-up" style={{ fontSize: 18 }} />
                  <PickedFileMeta>
                    <PickedFileName title={file.name}>{file.name}</PickedFileName>
                    <PickedFileSize>{formatBytes(file.size)}</PickedFileSize>
                  </PickedFileMeta>
                </>
              )}
            </Dropzone>

            {phase === "uploading-file" && (
              <ProgressBlock>
                <ProgressTopRow>
                  <ProgressStatus $status={phase}>Uploading…</ProgressStatus>
                  <ProgressPct>{progress}%</ProgressPct>
                </ProgressTopRow>
                <ProgressTrack>
                  <ProgressFill $pct={progress} $status={phase} />
                </ProgressTrack>
              </ProgressBlock>
            )}

            {phase === "error" && errorMessage && <ErrorText>{errorMessage}</ErrorText>}

            <FormField label="File Name" required error={errors.fileName}>
              <FormInput
                placeholder="e.g. Site survey report"
                value={values.fileName}
                disabled={isSubmitting}
                $error={!!errors.fileName}
                onChange={(e) => handleChange("fileName", e.target.value)}
              />
            </FormField>
          </BodyStack>
        </ModalBody>

        <ModalFooter>
          <span style={{ fontSize: fontSize.subtitle, color: colors.textMuted }}>* File name required</span>
          <FooterButtons>
            <CancelBtn onClick={onClose} disabled={isSubmitting}>Cancel</CancelBtn>
            <SaveBtn onClick={handleSubmit} disabled={uploadDisabled}>
              {phase === "uploading-file" ? "Uploading…" : phase === "updating-project" ? "Saving…" : "Upload"}
            </SaveBtn>
          </FooterButtons>
        </ModalFooter>
      </ModalBox>
    </Overlay>
  );
}
