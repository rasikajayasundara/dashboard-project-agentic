import { useDispatch, useSelector } from "react-redux";
import { colors, fontSize } from "../../../constants/common";
import useFormValidation from "../../../hooks/useFormValidation";
import { clientAction } from "../../../store/clientSlice";
import FormField, { FormInput, FormSearchDropdown } from "../../../components/FormField";
import {
  Overlay, ModalBox,
  ModalHeader, ModalTitle, CloseBtn,
  ModalFooter, FooterButtons, CancelBtn, SaveBtn,
  ModalBody,
} from "../../../components/ModalShell";
import { FormGrid } from "./editClient.styles";

const RULES = {
  clientName:  { required: true, label: "Client Name"    },
  contactName: { required: true, label: "Contact Person" },
  email:       { required: true, label: "Email", type: "email" },
  phone:       { required: true, label: "Phone"          },
  location:    { required: true, label: "Location"       },
  address:     { label: "Address"        },
};

function clientToValues(client = {}) {
  return {
    clientName:  client.name        || "",
    contactName: client.contactName || "",
    phone:       client.phone       || "",
    location:    client.locationId ?? "",
    address:     client.address     || "",
    email:       client.email       || "",
  };
}

export default function EditClient({ client = {}, onClose }) {
  const dispatch = useDispatch();
  const { officeLocations } = useSelector((state) => state.metadata);
  const locationOptions = officeLocations.map((l) => ({ value: l.locationId, label: l.officeLocation }));
  const initialValues = clientToValues(client);
  const { values, errors, handleChange, validate, reset } = useFormValidation(initialValues, RULES);

  function handleSubmit() {
    if (!validate()) return;
    dispatch(clientAction.updateClientStart({
      clientId: client.id,
      values: {
        clientName:  values.clientName,
        contactName: values.contactName,
        email:       values.email,
        phone:       values.phone,
        address:     values.address,
        locationId:  values.location,
      },
    }));
    reset();
    onClose();
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <Overlay onClick={handleClose}>
      <ModalBox $maxWidth="560px" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <ModalHeader>
          <ModalTitle>Edit Client</ModalTitle>
          <CloseBtn onClick={handleClose}><i className="bi bi-x-lg" /></CloseBtn>
        </ModalHeader>

        {/* ── Body ── */}
        <ModalBody>
          <FormGrid>

            <FormField label="Client Name" required error={errors.clientName}>
              <FormInput
                type="text"
                placeholder="e.g. Harbour Point Ltd"
                value={values.clientName}
                $error={!!errors.clientName}
                onChange={(e) => handleChange("clientName", e.target.value)}
              />
            </FormField>

            <FormField label="Contact Person" required error={errors.contactName}>
              <FormInput
                type="text"
                placeholder="Full name"
                value={values.contactName}
                $error={!!errors.contactName}
                onChange={(e) => handleChange("contactName", e.target.value)}
              />
            </FormField>

            <FormField label="Email" required error={errors.email}>
              <FormInput
                type="email"
                placeholder="contact@company.co.nz"
                value={values.email}
                $error={!!errors.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </FormField>

            <FormField label="Phone" required error={errors.phone}>
              <FormInput
                type="tel"
                placeholder="+64 9 000 0000"
                value={values.phone}
                $error={!!errors.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
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

            <FormField label="Address" error={errors.address}>
              <FormInput
                type="text"
                placeholder="e.g. 12 Lambton Quay, Wellington"
                value={values.address}
                $error={!!errors.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </FormField>

          </FormGrid>
        </ModalBody>

        {/* ── Footer ── */}
        <ModalFooter>
          <span style={{ fontSize: fontSize.subtitle, color: colors.textMuted }}>* Required fields</span>
          <FooterButtons>
            <CancelBtn onClick={handleClose}>Cancel</CancelBtn>
            <SaveBtn onClick={handleSubmit}>Save Changes</SaveBtn>
          </FooterButtons>
        </ModalFooter>

      </ModalBox>
    </Overlay>
  );
}
