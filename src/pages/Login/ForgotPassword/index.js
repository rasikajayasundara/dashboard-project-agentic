/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordAction } from "../../../store/forgotPasswordSlice";
import ButtonStyled from "../../../components/ButtonStyled";
import { FormInput, InputWrapper, InputSlot, FieldError } from "../../../components/FormField";
import validateForm from "../../../utils/validation";
import {
  Page, AuthBox, Heading, SubText, FieldGroup,
  ErrorAlert, LoadingWrap, LoadingImg, FooterDivider, FooterText,
} from "./component.styles";

function ForgotPassword() {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const dispatch = useDispatch();
  const { isLoading, otpSent, error } = useSelector((state) => state.forgotPassword);

  const onFormSubmit = (e) => {
    e.preventDefault();
    const formData = e.target;
    const payload = { email: formData.email.value };
    const errors = validateForm(payload, ["email"]);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    dispatch(forgotPasswordAction.emailOtpStart(payload));
  };

  useEffect(() => {
    otpSent && navigate("/auth-reset-password");
  }, [otpSent]);

  return (
    <Page>
      <AuthBox>
        <Heading>Forgot Password</Heading>
        <SubText>Please enter your email address to receive a reset code.</SubText>

        <form onSubmit={onFormSubmit}>
          <FieldGroup>
            <InputWrapper>
              <InputSlot><i className="bi bi-envelope" /></InputSlot>
              <FormInput
                type="email"
                name="email"
                placeholder="Email Address"
                $error={!!formErrors.email}
                $hasStart
              />
            </InputWrapper>
            {formErrors.email && <FieldError $error>{formErrors.email}</FieldError>}
          </FieldGroup>

          {error && (
            <ErrorAlert>Something went wrong! Please try again in a moment.</ErrorAlert>
          )}

          <ButtonStyled fullWidth type="submit">
            Confirm
          </ButtonStyled>
        </form>

        {isLoading && (
          <LoadingWrap>
            <LoadingImg src="/assets/images/loading-spinner.gif" alt="Loading" />
          </LoadingWrap>
        )}

        <FooterDivider />
        <FooterText>© {new Date().getFullYear()} demo-dash. All rights reserved.</FooterText>
      </AuthBox>
    </Page>
  );
}

export default ForgotPassword;
