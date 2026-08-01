/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import validateForm from "../../../utils/validation";
import { useDispatch, useSelector } from "react-redux";
import { authAction } from "../../../store/authSlice";
import { SNACKBAR_TYPES, snackbarAction } from "../../../store/snackbarSlice";
import ButtonStyled from "../../../components/ButtonStyled";
import { FormInput, InputWrapper, InputSlot, FieldError } from "../../../components/FormField";
import {
  Page, AuthBox, Heading, SubText, FieldGroup, FieldLabel,
  LoadingWrap, LoadingImg, FooterDivider, FooterText,
  FormSection, ValidatingText,
} from "./component.styles";

function SetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { isLoading, isValidating, validateData, newPasswordCreated, error, message } =
    useSelector((state) => state.auth);

  useEffect(() => { validateToken(); }, []);

  useEffect(() => {
    error && dispatch(snackbarAction.showSnackbar({ message: error, type: SNACKBAR_TYPES.ERROR }));
  }, [error]);

  const validateToken = async () => {
    const payload = { token: new URLSearchParams(window.location.search).get("plr") };
    dispatch(authAction.validateTokenStart(payload));
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    const formData = e.target;
    const payload = {
      token: new URLSearchParams(window.location.search).get("plr"),
      newPassword: formData.newPassword.value,
      cnfPassword: formData.cnfPassword.value,
    };
    const errors = validateForm(payload, ["token", "newPassword", "cnfPassword"]);
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    if (formData.newPassword.value !== formData.cnfPassword.value) {
      setFormErrors({ cnfPassword: "Passwords do not match" });
      return;
    }
    dispatch(authAction.addNewPasswordStart({ password: payload.newPassword, token: payload.token }));
  };

  useEffect(() => {
    if (newPasswordCreated || validateData?.success) {
      dispatch(snackbarAction.showSnackbar({ message }));
    }
  }, [newPasswordCreated, validateData?.success]);

  useEffect(() => { if (newPasswordCreated) navigate("/login"); }, [newPasswordCreated]);

  return (
    <Page>
      <AuthBox>
        <Heading>Welcome to demo-dash</Heading>

        {validateData?.success && (
          <FormSection>
            <SubText>Please set your password to activate your account.</SubText>
            <form onSubmit={handleSetPassword}>
              <FieldGroup>
                <FieldLabel>New Password</FieldLabel>
                <InputWrapper>
                  <InputSlot><i className="bi bi-lock" /></InputSlot>
                  <FormInput
                    type={showNew ? "text" : "password"}
                    name="newPassword"
                    placeholder="Enter new password"
                    $error={!!formErrors.newPassword}
                    $hasStart
                    $hasEnd
                  />
                  <InputSlot $end $clickable onClick={() => setShowNew((p) => !p)}>
                    <i className={`bi bi-eye${showNew ? "" : "-slash"}`} />
                  </InputSlot>
                </InputWrapper>
                {formErrors.newPassword && <FieldError $error>{formErrors.newPassword}</FieldError>}
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Confirm Password</FieldLabel>
                <InputWrapper>
                  <InputSlot><i className="bi bi-lock" /></InputSlot>
                  <FormInput
                    type={showConfirm ? "text" : "password"}
                    name="cnfPassword"
                    placeholder="Confirm your password"
                    $error={!!formErrors.cnfPassword}
                    $hasStart
                    $hasEnd
                  />
                  <InputSlot $end $clickable onClick={() => setShowConfirm((p) => !p)}>
                    <i className={`bi bi-eye${showConfirm ? "" : "-slash"}`} />
                  </InputSlot>
                </InputWrapper>
                {formErrors.cnfPassword && <FieldError $error>{formErrors.cnfPassword}</FieldError>}
              </FieldGroup>

              <ButtonStyled fullWidth type="submit">
                Set Password
              </ButtonStyled>
            </form>
          </FormSection>
        )}

        {(isLoading || isValidating) && (
          <LoadingWrap>
            <ValidatingText>
              {isValidating ? "Validating the request ..." : "Setting password ..."}
            </ValidatingText>
            <LoadingImg src="/assets/images/loading-spinner.gif" alt="Loading" />
          </LoadingWrap>
        )}

        <FooterDivider />
        <FooterText>© {new Date().getFullYear()} demo-dash. All rights reserved.</FooterText>
      </AuthBox>
    </Page>
  );
}

export default SetPassword;
