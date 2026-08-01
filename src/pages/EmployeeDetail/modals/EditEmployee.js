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
import { FormGrid } from "./editEmployee.styles";

const RULES = {
  firstName:  { required: true, label: "First Name" },
  lastName:   { required: true, label: "Last Name"  },
  phone:      { required: true, label: "Phone", type: "phone" },
  jobTitleId: { required: true, label: "Job Title"  },
  location:   { required: true, label: "Location"   },
};

// Editing your own profile (via /employees/me/profile) only allows
// name/phone — job title, location and billing are admin-managed fields.
const OWN_PROFILE_RULES = {
  firstName: { required: true, label: "First Name" },
  lastName:  { required: true, label: "Last Name"  },
  phone:     { required: true, label: "Phone", type: "phone" },
};

function employeeToValues(employee = {}, jobTitles = []) {
  const matchedJobTitle = jobTitles.find((j) => j.jobTitleName === employee.role);
  return {
    firstName:    employee.firstName || "",
    lastName:     employee.lastName  || "",
    email:        employee.email     || "",
    phone:        employee.phone     || "",
    jobTitleId:   matchedJobTitle?.jobTitleId || "",
    location:     employee.locationId ?? "",
    billable:     employee.billable ?? 0,
    billableRate: employee.billableRate ?? "",
  };
}

export default function EditEmployee({ employee = {}, isOwnProfile = false, onClose }) {
  const dispatch = useDispatch();
  const { officeLocations, jobTitles } = useSelector((state) => state.metadata);
  const locationOptions = officeLocations.map((l) => ({ value: l.locationId, label: l.officeLocation }));
  const jobTitleOptions = jobTitles.map((j) => ({ value: j.jobTitleId, label: j.jobTitleName }));
  const { values, errors, handleChange, validate, reset } = useFormValidation(
    employeeToValues(employee, jobTitles),
    isOwnProfile ? OWN_PROFILE_RULES : RULES
  );
  const [billableRateError, setBillableRateError] = useState("");
  const isBillable = values.billable === 1;

  function handleSubmit() {
    if (!validate()) return;

    if (isOwnProfile) {
      dispatch(employeesAction.updateMyProfileStart({
        firstName: values.firstName,
        lastName:  values.lastName,
        phone:     values.phone,
      }));
      reset();
      onClose();
      return;
    }

    if (isBillable && !String(values.billableRate || "").trim()) {
      setBillableRateError("Billable Rate is required");
      return;
    }

    const payload = {
      firstName:  values.firstName,
      lastName:   values.lastName,
      phone:      values.phone,
      jobTitleId: values.jobTitleId,
      locationId: values.location,
      billable:   values.billable,
    };
    if (isBillable) payload.billableRate = Number(values.billableRate);

    dispatch(employeesAction.updateEmployeeStart({ employeeId: employee.id, values: payload }));
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
          <ModalTitle>{isOwnProfile ? "Edit Profile" : "Edit Employee"}</ModalTitle>
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

            <FormField label="Email">
              <FormInput type="email" value={values.email} readOnly />
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

            <FormField label="Job Title" required={!isOwnProfile} error={errors.jobTitleId}>
              <FormSearchDropdown
                value={values.jobTitleId}
                $error={!!errors.jobTitleId}
                onChange={(val) => handleChange("jobTitleId", val)}
                placeholder="Select job title"
                options={jobTitleOptions}
                disabled={isOwnProfile}
              />
            </FormField>

            <FormField label="Location" required={!isOwnProfile} error={errors.location}>
              <FormSearchDropdown
                value={values.location}
                $error={!!errors.location}
                onChange={(val) => handleChange("location", val)}
                placeholder="Select location"
                options={locationOptions}
                disabled={isOwnProfile}
              />
            </FormField>

            <ToggleSwitch
              label="Billable"
              checked={isBillable}
              onChange={(checked) => handleChange("billable", checked ? 1 : 0)}
              disabled={isOwnProfile}
            />

            {isBillable && (
              <FormField label="Billable Rate" required={!isOwnProfile} error={billableRateError}>
                <FormInput
                  type="number"
                  placeholder="e.g. 150"
                  value={values.billableRate}
                  $error={!!billableRateError}
                  disabled={isOwnProfile}
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
            <SaveBtn onClick={handleSubmit}>Save Changes</SaveBtn>
          </FooterButtons>
        </ModalFooter>

      </ModalBox>
    </Overlay>
  );
}
