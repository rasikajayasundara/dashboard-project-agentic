import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useFormValidation from "../../../../hooks/useFormValidation";
import FormField, { FormInput, FormSelectDropdown, FormDatePicker } from "../../../../components/FormField";
import PageBanner from "../../../../components/PageBanner";
import {
  Overlay, ModalBox, ModalBody,
  ModalHeader, ModalTitle, CloseBtn,
  ModalFooter, FooterButtons, CancelBtn, SaveBtn,
} from "../../../../components/ModalShell";
import { formatBytes } from "../../../../utils/common";
import { formatCurrency } from "../../../../utils/format";
import { projectExpenseAction } from "../../../../store/projectExpenseSlice";
import { uploadExpenseAttachmentApi } from "../../../../store/projectExpenseSlice/api";
import { DEFAULT_MILEAGE_RATE, calcMileageCost, isPdfAttachment } from "../constants";
import {
  BodyStack, FormTextarea, SegToggle, SegOption,
  MileageRow, TwoColRow, CalcDisplay, CalcFormula, CalcTotal,
  Dropzone, DropzoneIcon, DropzoneText, DropzoneSubtext,
  PickedFileMeta, PickedFileName, PickedFileSize, HiddenFileInput,
  DropzoneRemoveBtn, OptionalTag,
  SubmittingOverlay, SubmittingText, ProgressBlock, ProgressTopRow,
  ProgressStatus, ProgressPct, ProgressTrack, ProgressFill, ErrorText,
} from "./form.styles";

// Local "today" in YYYY-MM-DD, using local getters (not toISOString) so the date
// doesn't shift a day in UTC+ timezones like NZ.
function todayLocalISO() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export default function AddExpense({ budgets = [], onUploaded, onClose }) {
  const dispatch = useDispatch();
  const isSubmitting = useSelector((s) => s?.projectExpense?.isSubmitting ?? false);
  const mileageRate = useSelector((s) => Number(s?.metadata?.settings?.EXPENSE_MILEAGE_RATE_PER_KM) || DEFAULT_MILEAGE_RATE);

  const [type, setType] = useState("mileage");
  const [attachment, setAttachment] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const [phase, setPhase] = useState("idle"); // idle | uploading-file | creating-expense | error
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const busy = phase === "uploading-file" || phase === "creating-expense" || isSubmitting;
  const noExpenseBudgets = budgets.length === 0;

  // If the create call fails, isSubmitting flips back to false (the saga's own snackbar
  // already surfaces the error) — reset phase so the form unlocks for a retry.
  const prevSubmittingRef = useRef(false);
  useEffect(() => {
    if (prevSubmittingRef.current && !isSubmitting && phase === "creating-expense") {
      setPhase("idle");
    }
    prevSubmittingRef.current = isSubmitting;
  }, [isSubmitting, phase]);

  const budgetOptions = budgets.map((b) => ({ label: b.budgetName, value: b.budgetId }));

  const RULES = {
    title: { required: true, label: "Expense title" },
    budgetId: { required: true, label: "Budget" },
    date: { required: true, label: "Date" },
    ...(type === "mileage"
      ? { km: { required: true, label: "Distance" } }
      : { cost: { required: true, label: "Amount" } }),
  };

  const { values, errors, handleChange, validate } = useFormValidation(
    { title: "", description: "", budgetId: "", km: "", cost: "", date: todayLocalISO() },
    RULES
  );

  function applyPickedFile(file) {
    setAttachment({ file, url: URL.createObjectURL(file), name: file.name, size: file.size });
  }

  function handleDropzoneClick() {
    if (busy) return;
    fileInputRef.current?.click();
  }

  function handleFileInputChange(e) {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (picked) applyPickedFile(picked);
  }

  function handleDragOver(e) {
    e.preventDefault();
    if (!busy) setDragActive(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setDragActive(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    if (busy) return;
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) applyPickedFile(dropped);
  }

  async function handleSubmit() {
    if (!validate() || busy) return;
    setErrorMessage("");

    let documentId = null;
    if (attachment?.file) {
      setPhase("uploading-file");
      setProgress(0);
      try {
        const { data } = await uploadExpenseAttachmentApi(attachment.file, (e) => {
          const pct = e.total ? Math.round((e.loaded / e.total) * 100) : 0;
          setProgress(pct);
        });
        documentId = data.documentId;
        onUploaded?.(documentId, {
          documentId,
          name: data.documentName,
          size: data.fileSize,
          url: data.url,
        });
      } catch {
        setPhase("error");
        setErrorMessage("File upload failed. Please try again.");
        return;
      }
    }

    setPhase("creating-expense");
    dispatch(projectExpenseAction.addExpenseStart({
      budgetId: Number(values.budgetId),
      expenseName: values.title.trim(),
      description: values.description.trim(),
      type,
      value: Number(type === "mileage" ? values.km : values.cost),
      attachments: documentId ? [documentId] : [],
      date: values.date,
      onSuccess: onClose,
    }));
  }

  return (
    <Overlay onClick={busy ? undefined : onClose}>
      <ModalBox $maxWidth="560px" style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
        {busy && (
          <SubmittingOverlay>
            <div className="spinner-border text-secondary" role="status" />
            <SubmittingText>
              {phase === "uploading-file" ? `Uploading file… ${progress}%` : "Saving expense…"}
            </SubmittingText>
          </SubmittingOverlay>
        )}

        <ModalHeader>
          <ModalTitle>Add Expense</ModalTitle>
          <CloseBtn onClick={onClose} disabled={busy}><i className="bi bi-x-lg" /></CloseBtn>
        </ModalHeader>

        <ModalBody>
          {noExpenseBudgets ? (
            <PageBanner
              type="warning"
              title="No expense budget available"
              message='This project has no budget set up with type "Expenses". Create one from the Budget tab before logging an expense.'
            />
          ) : (
          <BodyStack>
            <FormField label="Expense Title" required error={errors.title}>
              <FormInput
                placeholder="e.g. Site visit — Downtown office"
                value={values.title}
                disabled={busy}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </FormField>

            <FormField label="Description">
              <FormTextarea
                placeholder="Optional details about this expense"
                value={values.description}
                disabled={busy}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </FormField>

            <TwoColRow>
              <FormField label="Budget" required error={errors.budgetId}>
                <FormSelectDropdown
                  options={budgetOptions}
                  value={values.budgetId}
                  placeholder="Select budget"
                  $error={!!errors.budgetId}
                  disabled={busy}
                  onChange={(val) => handleChange("budgetId", val)}
                />
              </FormField>
              <FormField label="Date" required error={errors.date}>
                <FormDatePicker
                  value={values.date}
                  onChange={(str) => handleChange("date", str)}
                  disabled={busy}
                />
              </FormField>
            </TwoColRow>

            <FormField label="Type" required>
              <SegToggle>
                <SegOption type="button" $selected={type === "mileage"} disabled={busy} onClick={() => !busy && setType("mileage")}>
                  <i className="bi bi-signpost-split" />
                  Mileage
                </SegOption>
                <SegOption type="button" $selected={type === "cost"} disabled={busy} onClick={() => !busy && setType("cost")}>
                  <i className="bi bi-currency-dollar" />
                  Cost
                </SegOption>
              </SegToggle>
            </FormField>

            {type === "mileage" ? (
              <MileageRow>
                <FormField label="Distance (km)" required error={errors.km}>
                  <FormInput
                    type="number"
                    placeholder="e.g. 12"
                    value={values.km}
                    disabled={busy}
                    onChange={(e) => handleChange("km", e.target.value)}
                  />
                </FormField>
                <FormField label="Total Cost">
                  <CalcDisplay>
                    <CalcFormula>{Number(values.km) || 0} km × ${mileageRate.toFixed(2)}/km</CalcFormula>
                    <CalcTotal>{formatCurrency(calcMileageCost(values.km, mileageRate))}</CalcTotal>
                  </CalcDisplay>
                </FormField>
              </MileageRow>
            ) : (
              <FormField label="Amount ($)" required error={errors.cost}>
                <FormInput
                  type="number"
                  placeholder="e.g. 86.50"
                  value={values.cost}
                  disabled={busy}
                  onChange={(e) => handleChange("cost", e.target.value)}
                />
              </FormField>
            )}

            <FormField label={<>Attachment <OptionalTag>(optional)</OptionalTag></>}>
              <HiddenFileInput ref={fileInputRef} type="file" accept="image/*,application/pdf" onChange={handleFileInputChange} />
              <Dropzone
                $hasFile={!!attachment}
                $dragActive={dragActive}
                onClick={handleDropzoneClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {!attachment ? (
                  <>
                    <DropzoneIcon className="bi bi-cloud-arrow-up" />
                    <div>
                      <DropzoneText>Drag &amp; drop a receipt image here</DropzoneText>
                      <DropzoneSubtext>or click to browse — PNG, JPG, PDF</DropzoneSubtext>
                    </div>
                  </>
                ) : (
                  <>
                    <DropzoneIcon className={isPdfAttachment(attachment) ? "bi bi-file-earmark-pdf" : "bi bi-file-earmark-image"} style={{ fontSize: 18 }} />
                    <PickedFileMeta>
                      <PickedFileName title={attachment.name}>{attachment.name}</PickedFileName>
                      <PickedFileSize>{formatBytes(attachment.size)}</PickedFileSize>
                    </PickedFileMeta>
                    <DropzoneRemoveBtn
                      type="button"
                      disabled={busy}
                      onClick={(e) => { e.stopPropagation(); setAttachment(null); }}
                    >
                      <i className="bi bi-x" />
                    </DropzoneRemoveBtn>
                  </>
                )}
              </Dropzone>
            </FormField>

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
          </BodyStack>
          )}
        </ModalBody>

        <ModalFooter>
          <FooterButtons>
            <CancelBtn onClick={onClose} disabled={busy}>Cancel</CancelBtn>
            <SaveBtn onClick={handleSubmit} disabled={busy || noExpenseBudgets}>Add Expense</SaveBtn>
          </FooterButtons>
        </ModalFooter>
      </ModalBox>
    </Overlay>
  );
}
