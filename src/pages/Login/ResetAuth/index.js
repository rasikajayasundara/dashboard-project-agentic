/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordAction } from "../../../store/forgotPasswordSlice";
import ButtonStyled from "../../../components/ButtonStyled";
import { FieldError } from "../../../components/FormField";
import {
  Page, AuthBox, Heading, SubText,
  ErrorAlert, LoadingWrap, LoadingImg, FooterDivider, FooterText,
  OtpRow, OtpBox,
} from "./component.styles";

const LENGTH = 6;

function ResetAuth() {
  const navigate = useNavigate();
  const inputsRef = useRef([]);
  const [boxErrors, setBoxErrors] = useState(Array(LENGTH).fill(false));
  const [formError, setFormError] = useState("");
  const dispatch = useDispatch();

  const { error, isLoading, forgotAuthData } = useSelector((state) => state?.forgotPassword);

  useEffect(() => {
    if (forgotAuthData.isValid) navigate("/reset-password");
  }, [forgotAuthData]);

  const handleChange = (idx, e) => {
    e.target.value = (e.target.value || "").replace(/\D/g, "").slice(0, 1);
    setBoxErrors((prev) => {
      const next = [...prev];
      next[idx] = !e.target.value;
      return next;
    });
    if (e.target.value && idx < LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (idx, e) => {
    const text = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, LENGTH);
    if (!text) return;
    e.preventDefault();
    const nextErrors = [...boxErrors];
    for (let i = 0; i < text.length && idx + i < LENGTH; i++) {
      const el = inputsRef.current[idx + i];
      if (el) { el.value = text[i]; nextErrors[idx + i] = false; }
    }
    setBoxErrors(nextErrors);
    inputsRef.current[Math.min(idx + text.length, LENGTH - 1)]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !e.target.value && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const values = inputsRef.current.slice(0, LENGTH).map((el) => (el?.value || "").trim());
    const emptyIdx = values.map((v, i) => (!v ? i : -1)).filter((i) => i !== -1);
    if (emptyIdx.length > 0) {
      setBoxErrors(() => {
        const next = Array(LENGTH).fill(false);
        emptyIdx.forEach((i) => (next[i] = true));
        return next;
      });
      setFormError("Please enter the 6-digit code.");
      inputsRef.current[emptyIdx[0]]?.focus();
      return;
    }
    setFormError("");
    setBoxErrors(Array(LENGTH).fill(false));
    dispatch(forgotPasswordAction.authStart({ otp: values.join("") }));
  };

  return (
    <Page>
      <AuthBox>
        <Heading>Reset Your Password</Heading>
        <SubText>Please enter the OTP sent to your email address.</SubText>

        <form onSubmit={handleSubmit}>
          <OtpRow>
            {Array.from({ length: LENGTH }).map((_, i) => (
              <OtpBox
                key={i}
                type="text"
                inputMode="numeric"
                maxLength={1}
                aria-label={`Digit ${i + 1}`}
                placeholder="•"
                $error={boxErrors[i]}
                ref={(el) => (inputsRef.current[i] = el)}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={(e) => handlePaste(i, e)}
              />
            ))}
          </OtpRow>

          {formError && <FieldError $error style={{ textAlign: "center", marginBottom: 12 }}>{formError}</FieldError>}
          {error && <ErrorAlert>Something went wrong! Please try again in a moment.</ErrorAlert>}

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

export default ResetAuth;
