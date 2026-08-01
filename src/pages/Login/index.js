import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFormValidation from "../../hooks/useFormValidation";
import { useDispatch, useSelector } from "react-redux";
import BackgroundBubbles from "../../components/BackgroundBubbles";
import { loginAction } from "../../store/LoginSlice/index.js";
import ToggleSwitch from "../../components/ToggleSwitch/index.js";
import { colors } from "../../constants/common";
import { InputWrapper, InputSlot, FieldError } from "../../components/FormField/index.js";
import {
  Page, LeftPanel, HeroContent, HeroHeading, HeroSubtitle, RightPanel, FormBox,
  LogoImg, HeaderRow, HeadingCell, PageHeading, PageSubHeading, FieldLabel, FloatingInput, FieldGroup,
  ForgotRow, ForgotLink, RememberRow, LoginButton, ErrorAlert, LoadingWrap, LoadingSpinner,
  FooterDivider, FooterText, BelowContent,
} from "./component.styles";

const SUBTITLES = [
  "Manage your work, tasks and timesheets all in one place.",
  "Track your team's progress in real time.",
  "Stay on top of deadlines and deliverables.",
  "One platform for projects, clients and invoices.",
];

const INITIAL_VALUES = {
  username: "",
  password: "",
};

const RULES = {
  username:      { required: true, label: "Username"       },
  password:      { required: true, label: "Password"       },
};

// ── Component ──────────────────────────────────────────────────────────────────

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [subtitleIdx, setSubtitleIdx] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(true);

  const { error: errorMsg, isLoading, isLogInSuccess, user } = useSelector(
    (state) => state.login
  );

  const { values, errors, handleChange, validate, reset } = useFormValidation(INITIAL_VALUES, RULES);

  useEffect(() => {
    if (!isLogInSuccess) return;
    navigate(user?.roleId === 1 ? "/dashboard" : "/profile");
  }, [isLogInSuccess, user, navigate]);

  // Rotate subtitle every 4s with a fade-out → swap → fade-in
  useEffect(() => {
    const timer = setInterval(() => {
      setSubtitleVisible(false);
      setTimeout(() => {
        setSubtitleIdx((i) => (i + 1) % SUBTITLES.length);
        setSubtitleVisible(true);
      }, 580);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(loginAction.loginStart(values));
  };

  return (
    <Page>
      {/* ── Left hero panel ─────────────────────────────────────────────── */}
      <LeftPanel>
        <BackgroundBubbles color="rgba(31, 182, 201, 0.12)" />

        <HeroContent>
          <HeroHeading>Let's Get Things Done!</HeroHeading>
        </HeroContent>

        <HeroSubtitle $visible={subtitleVisible}>
          {SUBTITLES[subtitleIdx]}
        </HeroSubtitle>
      </LeftPanel>

      {/* ── Right form panel ────────────────────────────────────────────── */}
      <RightPanel>
        <FormBox>
          <HeaderRow>
            <HeadingCell>
              <PageHeading>Sign In</PageHeading>
              <PageSubHeading>Access your ProjeX workspace</PageSubHeading>
            </HeadingCell>
            <LogoImg src="/assets/images/logo-ori.png" alt="ProjeX" />
          </HeaderRow>

          <BelowContent>
            <form onSubmit={handleLogin}>
              <FieldGroup>
                <InputWrapper>
                  <InputSlot><i className="bi bi-envelope" /></InputSlot>
                  <FloatingInput
                    type="text"
                    name="username"
                    id="username"
                    value={values.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    placeholder=" "
                    $error={!!errors.username}
                    $hasStart
                  />
                  <FieldLabel htmlFor="username">Email address</FieldLabel>
                </InputWrapper>
                {errors.username && <FieldError $error>{errors.username}</FieldError>}
              </FieldGroup>

              <ForgotRow>
                <ForgotLink to="/forgot-password">Forgot Password?</ForgotLink>
              </ForgotRow>

              <FieldGroup>
                <InputWrapper>
                  <InputSlot><i className="bi bi-lock" /></InputSlot>
                  <FloatingInput
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={values.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder=" "
                    $error={!!errors.password}
                    $hasStart
                    $hasEnd
                  />
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <InputSlot $end $clickable onClick={() => setShowPassword((p) => !p)}>
                    <i className={`bi bi-eye${showPassword ? "" : "-slash"}`} />
                  </InputSlot>
                </InputWrapper>
                {errors.password && <FieldError $error>{errors.password}</FieldError>}
              </FieldGroup>

              <RememberRow>
                <ToggleSwitch checked={rememberMe} onChange={setRememberMe} label="Remember me" color={colors.primaryColor} />
              </RememberRow>

              <LoginButton fullWidth type="submit" endSlot={<i className="bi bi-arrow-right" />}>
                Login
              </LoginButton>

              {isLoading && (
                <LoadingWrap>
                  <LoadingSpinner />
                </LoadingWrap>
              )}

              {errorMsg && <ErrorAlert>{errorMsg}</ErrorAlert>}
            </form>

            <FooterDivider />
            <FooterText>
              © {new Date().getFullYear()} ProjeX. All rights reserved. · Version{" "}
              {process.env.REACT_APP_RELEASE_VERSION}
            </FooterText>
          </BelowContent>
        </FormBox>
      </RightPanel>
    </Page>
  );
}

export default Login;
