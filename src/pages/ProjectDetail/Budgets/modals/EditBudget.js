import { useDispatch, useSelector } from "react-redux";
import useFormValidation from "../../../../hooks/useFormValidation";
import FormField, { FormInput, FormSelectDropdown } from "../../../../components/FormField";
import {
  Overlay, ModalBox, ModalBody,
  ModalHeader, ModalTitle, CloseBtn,
  ModalFooter, FooterButtons, CancelBtn, SaveBtn,
} from "../../../../components/ModalShell";
import { projectBudgetAction } from "../../../../store/projectBudgetSlice";
import { FormGrid } from "../component.styles";

const BUDGET_TYPE_OPTIONS = [
  { label: "Time",    value: "Time"    },
  { label: "Expenses", value: "Expenses" },
];

const RULES = {
  budget_name:   { required: true, label: "Budget name"   },
  budget_type:   { required: true, label: "Budget type"   },
  budget_amount: { required: true, label: "Budget amount" },
};

export default function EditBudget({ budget, onClose }) {
  const dispatch = useDispatch();
  const isSubmitting = useSelector((s) => s?.projectBudget?.isSubmitting ?? false);

  const { values, errors, handleChange, validate } = useFormValidation(
    {
      budget_name:   budget?.budgetName || "",
      budget_type:   budget?.budgetType || "",
      budget_amount: String(budget?.budgetAmount || ""),
    },
    RULES
  );

  const handleSubmit = () => {
    if (!validate()) return;
    dispatch(projectBudgetAction.updateBudgetStart({
      budgetId: budget.budgetId,
      budgetName: values.budget_name,
      budgetType: values.budget_type,
      budgetAmount: values.budget_amount,
      onSuccess: onClose,
    }));
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox $maxWidth="580px" onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Edit Budget</ModalTitle>
          <CloseBtn onClick={onClose}><i className="bi bi-x-lg" /></CloseBtn>
        </ModalHeader>
        <ModalBody>
          <FormGrid>
            <div style={{ gridColumn: "1 / -1" }}>
              <FormField label="Budget Name" required error={errors.budget_name}>
                <FormInput
                  placeholder="e.g. Foundation Design"
                  value={values.budget_name}
                  onChange={(e) => handleChange("budget_name", e.target.value)}
                />
              </FormField>
            </div>
            <FormField label="Budget Type" required error={errors.budget_type}>
              <FormSelectDropdown
                options={BUDGET_TYPE_OPTIONS}
                value={values.budget_type}
                placeholder="Select type"
                onChange={(val) => handleChange("budget_type", val)}
              />
            </FormField>
            <FormField label="Budget Amount ($)" required error={errors.budget_amount}>
              <FormInput
                type="number"
                placeholder="e.g. 5000"
                value={values.budget_amount}
                onChange={(e) => handleChange("budget_amount", e.target.value)}
              />
            </FormField>
          </FormGrid>
        </ModalBody>
        <ModalFooter>
          <FooterButtons>
            <CancelBtn onClick={onClose} disabled={isSubmitting}>Cancel</CancelBtn>
            <SaveBtn onClick={handleSubmit} disabled={isSubmitting}>Save Changes</SaveBtn>
          </FooterButtons>
        </ModalFooter>
      </ModalBox>
    </Overlay>
  );
}
