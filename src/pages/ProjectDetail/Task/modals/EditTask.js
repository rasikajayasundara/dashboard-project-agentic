import { useDispatch, useSelector } from "react-redux";
import { colors, fontSize } from "../../../../constants/common";
import useFormValidation from "../../../../hooks/useFormValidation";
import FormField, { FormInput, FormDatePicker, parseLocalDate } from "../../../../components/FormField";
import {
  Overlay, ModalBox, ModalBody,
  ModalHeader, ModalTitle, CloseBtn,
  ModalFooter, FooterButtons, CancelBtn, SaveBtn,
} from "../../../../components/ModalShell";
import { FormGrid, GridFullSpan, ReadOnlyInput } from "./form.styles";
import { projectTaskAction } from "../../../../store/projectTaskSlice";

export default function EditTask({ editData, onClose }) {
  const dispatch = useDispatch();

  // Get project dates from Redux (ProjectDetail)
  const { projectDetails: projectData } = useSelector(s => s?.projectDetails || {});
  const projectStart = projectData?.startDate;
  const projectEnd = projectData?.endDate;

  const { editingTaskId } = useSelector(s => s?.projectTask || {});

  const { budget_name: budgetName = "" } = editData || {};
  const taskId = editData?.taskId || editData?.task_id;

  const RULES = {
    task_name:  { required: true, label: "Task name"  },
    start_date: {
      required: true, label: "Start date",
      maxField: "end_date", maxLabel: "the End Date",
      minDate: projectStart, minLabel: "the project start date",
    },
    end_date: {
      required: true, label: "End date",
      minField: "start_date", minLabel: "the Start Date",
      maxDate: projectEnd, maxLabel: "the project end date",
    },
  };

  const { values, errors, handleChange, validate } = useFormValidation(
    {
      task_name:  editData?.taskName || editData?.task_name  || "",
      start_date: editData?.taskStartDate || editData?.start_date || "",
      end_date:   editData?.taskEndDate || editData?.end_date   || "",
    },
    RULES
  );

  const handleSubmit = () => {
    if (!validate()) return;

    dispatch(projectTaskAction.updateTaskStart({
      taskId,
      taskName: values.task_name,
      taskStartDate: values.start_date,
      taskEndDate: values.end_date,
      onSuccess: onClose
    }));
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox $maxWidth="580px" onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Edit Task</ModalTitle>
          <CloseBtn aria-label="Close" onClick={onClose}><i className="bi bi-x-lg" /></CloseBtn>
        </ModalHeader>
        <ModalBody>
          <FormGrid>
            <GridFullSpan>
              <FormField label="Task Name" required error={errors.task_name}>
                <FormInput
                  placeholder="e.g. Site Visit / Report Writing"
                  value={values.task_name}
                  onChange={(e) => handleChange("task_name", e.target.value)}
                />
              </FormField>
            </GridFullSpan>
            <GridFullSpan>
              <FormField label="Budget">
                <ReadOnlyInput value={budgetName} readOnly tabIndex={-1} />
              </FormField>
            </GridFullSpan>
            <FormField label="Start Date" required error={errors.start_date}>
              <FormDatePicker
                value={values.start_date}
                onChange={(str) => handleChange("start_date", str)}
                minDate={parseLocalDate(projectStart)}
                maxDate={parseLocalDate(values.end_date)}
              />
            </FormField>
            <FormField label="End Date" required error={errors.end_date}>
              <FormDatePicker
                value={values.end_date}
                onChange={(str) => handleChange("end_date", str)}
                minDate={parseLocalDate(values.start_date)}
                maxDate={parseLocalDate(projectEnd)}
              />
            </FormField>
          </FormGrid>
        </ModalBody>
        <ModalFooter>
          <span style={{ fontSize: fontSize.subtitle, color: colors.textMuted }}>* Required fields</span>
          <FooterButtons>
            <CancelBtn onClick={onClose}>Cancel</CancelBtn>
            <SaveBtn onClick={handleSubmit} disabled={editingTaskId === taskId}>Save Changes</SaveBtn>
          </FooterButtons>
        </ModalFooter>
      </ModalBox>
    </Overlay>
  );
}
