import React, { useState } from "react";
import {
  Overlay,
  ModalBox,
  ModalHeader,
  ModalTitle,
  CloseBtn,
  ModalBody,
  FormGrid,
  FieldGroup,
  FieldLabel,
  RequiredMark,
  Input,
  Select,
  ModalFooter,
  CancelBtn,
  SubmitBtn,
} from "./addEmployee.styles";

const DEPARTMENT_OPTIONS = ["Engineering", "Design", "Product", "Sales", "Marketing", "Operations"];
const MANAGER_OPTIONS = ["David Kim", "Lisa Wong", "Michael Brown", "Karen Lee", "Robert Nguyen"];
const OFFICE_OPTIONS = ["New York", "San Francisco", "London", "Remote"];

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  jobTitle: "",
  department: "",
  manager: "",
  office: "",
  startDate: "",
  billableRate: "",
};

export default function AddEmployee({ show, onClose }) {
  const [form, setForm] = useState(INITIAL_FORM);

  if (!show) return null;

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleClose = () => {
    setForm(INITIAL_FORM);
    onClose?.();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to employeesSlice.addEmployeeStart
    handleClose();
  };

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Add Employee</ModalTitle>
          <CloseBtn type="button" onClick={handleClose} aria-label="Close">
            <i className="bi bi-x-lg" />
          </CloseBtn>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGrid>
              <FieldGroup>
                <FieldLabel htmlFor="firstName">First Name<RequiredMark>*</RequiredMark></FieldLabel>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Jane"
                  value={form.firstName}
                  onChange={handleChange("firstName")}
                  required
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="lastName">Last Name<RequiredMark>*</RequiredMark></FieldLabel>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={handleChange("lastName")}
                  required
                />
              </FieldGroup>

              <FieldGroup $span2>
                <FieldLabel htmlFor="email">Email<RequiredMark>*</RequiredMark></FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane.doe@company.com"
                  value={form.email}
                  onChange={handleChange("email")}
                  required
                />
              </FieldGroup>

              <FieldGroup $span2>
                <FieldLabel htmlFor="jobTitle">Job Title<RequiredMark>*</RequiredMark></FieldLabel>
                <Input
                  id="jobTitle"
                  type="text"
                  placeholder="Senior Software Engineer"
                  value={form.jobTitle}
                  onChange={handleChange("jobTitle")}
                  required
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="department">Department<RequiredMark>*</RequiredMark></FieldLabel>
                <Select
                  id="department"
                  value={form.department}
                  onChange={handleChange("department")}
                  required
                >
                  <option value="" disabled>Select department</option>
                  {DEPARTMENT_OPTIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </Select>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="manager">Manager</FieldLabel>
                <Select
                  id="manager"
                  value={form.manager}
                  onChange={handleChange("manager")}
                >
                  <option value="" disabled>Select manager</option>
                  {MANAGER_OPTIONS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </Select>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="office">Office</FieldLabel>
                <Select
                  id="office"
                  value={form.office}
                  onChange={handleChange("office")}
                >
                  <option value="" disabled>Select office</option>
                  {OFFICE_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </Select>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="startDate">Start Date<RequiredMark>*</RequiredMark></FieldLabel>
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange("startDate")}
                  required
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="billableRate">Billable Rate (%)</FieldLabel>
                <Input
                  id="billableRate"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="75"
                  value={form.billableRate}
                  onChange={handleChange("billableRate")}
                />
              </FieldGroup>
            </FormGrid>
          </ModalBody>

          <ModalFooter>
            <CancelBtn type="button" onClick={handleClose}>Cancel</CancelBtn>
            <SubmitBtn type="submit">Add Employee</SubmitBtn>
          </ModalFooter>
        </form>
      </ModalBox>
    </Overlay>
  );
}
