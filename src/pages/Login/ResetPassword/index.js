/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import validateForm from "../../../utils/validation";
import { forgotPasswordAction } from "../../../store/forgotPasswordSlice";
import ButtonStyled from "../../../components/ButtonStyled";
import { FormInput, InputWrapper, InputSlot, FieldError } from "../../../components/FormField";
import {
  Page, AuthBox, Logo, Heading, FieldGroup, FieldLabel,
  LoadingWrap, LoadingImg, FooterDivider, FooterText,
} from "./component.styles";

function ResetPassword() {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { isLoading, resetPass } = useSelector((state) => state?.forgotPassword);
  const dispatch = useDispatch();

  const onSubmitPassword = (e) => {
    e.preventDefault();
    const formData = e.target;
    const payload = {
      newPassword: formData?.newPassword?.value,
      confirm_password: formData?.confirm_password?.value,
    };
    const requiredFields = ["newPassword", "confirm_password"];
    const errors = validateForm(payload, requiredFields);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    dispatch(forgotPasswordAction.changePasswordStart({ password: payload?.newPassword }));
  };

  useEffect(() => {
    return () => dispatch(forgotPasswordAction.forgotPasswordEnd());
  }, []);

  useEffect(() => {
    resetPass && navigate("/login");
  }, [resetPass]);

  return (
    <Page>
      <AuthBox>
        <Logo src="/assets/images/logo-ori.png" alt="ProjeX" />
        <Heading>Change Your Password</Heading>

        <form onSubmit={onSubmitPassword}>
          <FieldGroup>
            <FieldLabel>New Password</FieldLabel>
            <InputWrapper>
              <InputSlot><i className="bi bi-lock" /></InputSlot>
              <FormInput
                type={showNew ? "text" : "password"}
                name="newPassword"
                placeholder="Set your new password"
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
                name="confirm_password"
                placeholder="Re-enter new password"
                $error={!!formErrors.confirm_password}
                $hasStart
                $hasEnd
              />
              <InputSlot $end $clickable onClick={() => setShowConfirm((p) => !p)}>
                <i className={`bi bi-eye${showConfirm ? "" : "-slash"}`} />
              </InputSlot>
            </InputWrapper>
            {formErrors.confirm_password && <FieldError $error>{formErrors.confirm_password}</FieldError>}
          </FieldGroup>

          <ButtonStyled fullWidth type="submit">
            Reset Password
          </ButtonStyled>
        </form>

        {isLoading && (
          <LoadingWrap>
            <LoadingImg src="/assets/images/loading-spinner.gif" alt="Loading" />
          </LoadingWrap>
        )}

        <FooterDivider />
        <FooterText>© {new Date().getFullYear()} ProjeX. All rights reserved.</FooterText>
      </AuthBox>
    </Page>
  );
}

export default ResetPassword;
