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

export default function AddTask({ budgetId, budgetName, onClose }) {
  const dispatch = useDispatch();

  // Get project dates from Redux (ProjectDetail)
  const { projectDetails: projectData } = useSelector(s => s?.projectDetails || {});
  const projectStart = projectData?.startDate;
  const projectEnd = projectData?.endDate;

  const { addingTask } = useSelector(s => s?.projectTask || {});

  // Get today's date in YYYY-MM-DD format (local time, not UTC)
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

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
    { task_name: "", start_date: today, end_date: "" },
    RULES
  );

  const handleSubmit = () => {
    if (!validate()) return;

    dispatch(projectTaskAction.addTaskStart({
      budgetId,
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
          <ModalTitle>Add Task</ModalTitle>
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
                <ReadOnlyInput value={budgetName || ""} readOnly tabIndex={-1} />
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
            <SaveBtn onClick={handleSubmit} disabled={addingTask}>Add Task</SaveBtn>
          </FooterButtons>
        </ModalFooter>
      </ModalBox>
    </Overlay>
  );
}
