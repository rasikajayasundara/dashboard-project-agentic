import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { colors, fontSize } from "../../../constants/common";
import useFormValidation from "../../../hooks/useFormValidation";
import { employeesAction } from "../../../store/employeesSlice";
import FormField, { FormInput, FormSearchDropdown } from "../../../components/FormField";
import ToggleSwitch from "../../../components/ToggleSwitch";
import {
  Overlay, ModalBox,
  ModalHeader, ModalTitle, CloseBtn,
  ModalFooter, FooterButtons, CancelBtn, SaveBtn,
  ModalBody,
} from "../../../components/ModalShell";
import { FormGrid } from "./addEmployee.styles";

const INITIAL_VALUES = {
  firstName:    "",
  lastName:     "",
  email:        "",
  phone:        "",
  jobTitleId:   "",
  location:     "",
  billable:     1,
  billableRate: "",
};

const RULES = {
  firstName:    { required: true, label: "First Name"    },
  lastName:     { required: true, label: "Last Name"     },
  email:        { required: true, label: "Email", type: "email" },
  phone:        { required: true, label: "Phone", type: "phone" },
  jobTitleId:   { required: true, label: "Job Title"     },
  location:     { required: true, label: "Location"      },
};

export default function AddEmployee({ onClose }) {
  const dispatch = useDispatch();
  const { officeLocations, jobTitles } = useSelector((state) => state.metadata);
  const locationOptions = officeLocations.map((l) => ({ value: l.locationId, label: l.officeLocation }));
  const jobTitleOptions = jobTitles.map((j) => ({ value: j.jobTitleId, label: j.jobTitleName }));
  const { values, errors, handleChange, validate, reset } = useFormValidation(INITIAL_VALUES, RULES);
  const [billableRateError, setBillableRateError] = useState("");
  const isBillable = values.billable === 1;

  function handleSubmit() {
    if (!validate()) return;
    if (isBillable && !String(values.billableRate || "").trim()) {
      setBillableRateError("Billable Rate is required");
      return;
    }

    const payload = {
      firstName:  values.firstName,
      lastName:   values.lastName,
      email:      values.email,
      phone:      values.phone,
      jobTitleId: values.jobTitleId,
      locationId: values.location,
      billable:   values.billable,
    };
    if (isBillable) payload.billableRate = Number(values.billableRate);

    dispatch(employeesAction.addEmployeeStart(payload));
    reset();
    setBillableRateError("");
    onClose();
  }

  function handleClose() {
    reset();
    setBillableRateError("");
    onClose();
  }

  return (
    <Overlay onClick={handleClose}>
      <ModalBox $maxWidth="560px" onClick={(e) => e.stopPropagation()}>

        <ModalHeader>
          <ModalTitle>Add Employee</ModalTitle>
          <CloseBtn onClick={handleClose}><i className="bi bi-x-lg" /></CloseBtn>
        </ModalHeader>

        <ModalBody>
          <FormGrid>

            <FormField label="First Name" required error={errors.firstName}>
              <FormInput
                type="text"
                placeholder="First name"
                value={values.firstName}
                $error={!!errors.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
            </FormField>

            <FormField label="Last Name" required error={errors.lastName}>
              <FormInput
                type="text"
                placeholder="Last name"
                value={values.lastName}
                $error={!!errors.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </FormField>

            <FormField label="Email" required error={errors.email}>
              <FormInput
                type="email"
                placeholder="name@projex.nz"
                value={values.email}
                $error={!!errors.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </FormField>

            <FormField label="Phone" required error={errors.phone}>
              <FormInput
                type="tel"
                placeholder="+64 21 000 0000"
                value={values.phone}
                $error={!!errors.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </FormField>

            <FormField label="Job Title" required error={errors.jobTitleId}>
              <FormSearchDropdown
                value={values.jobTitleId}
                $error={!!errors.jobTitleId}
                onChange={(val) => handleChange("jobTitleId", val)}
                placeholder="Select job title"
                options={jobTitleOptions}
              />
            </FormField>

            <FormField label="Location" required error={errors.location}>
              <FormSearchDropdown
                value={values.location}
                $error={!!errors.location}
                onChange={(val) => handleChange("location", val)}
                placeholder="Select location"
                options={locationOptions}
              />
            </FormField>

            <ToggleSwitch
              label="Billable"
              checked={isBillable}
              onChange={(checked) => handleChange("billable", checked ? 1 : 0)}
            />

            {isBillable && (
              <FormField label="Billable Rate" required error={billableRateError}>
                <FormInput
                  type="number"
                  placeholder="e.g. 150"
                  value={values.billableRate}
                  $error={!!billableRateError}
                  onChange={(e) => {
                    handleChange("billableRate", e.target.value);
                    setBillableRateError("");
                  }}
                />
              </FormField>
            )}

          </FormGrid>
        </ModalBody>

        <ModalFooter>
          <span style={{ fontSize: fontSize.subtitle, color: colors.textMuted }}>* All fields required</span>
          <FooterButtons>
            <CancelBtn onClick={handleClose}>Cancel</CancelBtn>
            <SaveBtn onClick={handleSubmit}>Add Employee</SaveBtn>
          </FooterButtons>
        </ModalFooter>

      </ModalBox>
    </Overlay>
  );
}
