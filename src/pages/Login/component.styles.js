import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { fontSize } from "../../constants/common";
import { FormInput } from "../../components/FormField/index.js";
import ButtonStyled from "../../components/ButtonStyled/index.js";

// ── Keyframes ──────────────────────────────────────────────────────────────────

export const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-28px); }
  to   { opacity: 1; transform: translateX(0); }
`;

// ── Layout ─────────────────────────────────────────────────────────────────────

export const Page = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

export const LeftPanel = styled.aside`
  flex: 0 0 58%;
  position: relative;
  overflow: hidden;
  margin: 20px 0;
  background: linear-gradient(135deg, #5abdb5 0%, #496c83 38%, #26253e 68%, #02091e 100%);
  border-radius: 0 32px 32px 0;
  box-shadow: 12px 0 40px rgba(17, 34, 84, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 48px;
  color: #fff;

  @media (max-width: 991px) {
    display: none;
  }
`;

// z-index: 1 lifts text above the bubble canvas (z-index: 0)
export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 100px;
`;

export const HeroHeading = styled.h1`
  font-size: clamp(2.4rem, 4vw, 3.4rem);
  font-weight: 100;
  margin: 0;
  opacity: 0;
  animation: ${fadeInUp} 1.2s ease-out 0.3s forwards;
`;

// Subtitle sits at the bottom, absolutely positioned, fades between texts
export const HeroSubtitle = styled.p`
  position: absolute;
  bottom: 26%;
  left: 0;
  right: 0;
  z-index: 1;
  padding: 0 48px;
  text-align: center;
  margin: 0;
  font-weight: 100;
  font-size: clamp(1rem, 1.8vw, 1.5rem);
  color: rgba(255, 255, 255, 0.82);
  transition: opacity 0.55s ease;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
`;

export const RightPanel = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  min-width: 0;
`;

export const FormBox = styled.div`
  width: 75%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 24px;
`;

// Heading + subheading grouped as one tight cell, sized against the logo cell next to it
export const HeadingCell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
`;

// Slides in from the same side the heading sits on
export const LogoImg = styled.img`
  height: 78px;
  width: auto;
  flex-shrink: 0;
  opacity: 0;
  animation: ${slideInLeft} 0.55s ease-out 0.25s forwards;
`;

// Everything under the header — waits for the header's slide-in to finish before loading in
export const BelowContent = styled.div`
  opacity: 0;
  animation: ${fadeInUp} 0.5s ease-out 0.55s forwards;
`;

export const PageHeading = styled.h2`
  font-size: 1.5rem;
  font-weight: 300;
  color: #6b7280;
  text-align: left;
  margin: 0 0 2px;
`;

export const PageSubHeading = styled.p`
  font-size: 13px;
  font-weight: 300;
  color: #9ca3af;
  text-align: left;
  margin: 0;
`;

// Placeholder-style label — sits inside the input at rest, hides once focused or filled
export const FieldLabel = styled.label`
  position: absolute;
  left: 36px;
  top: 50%;
  transform: translateY(-50%);
  font-size: ${fontSize.general};
  color: #9ca3af;
  pointer-events: none;
  transition: opacity 0.15s ease;
`;

export const FloatingInput = styled(FormInput)`
  &:focus + label,
  &:not(:placeholder-shown) + label {
    opacity: 0;
  }
`;

export const FieldGroup = styled.div`
  margin-bottom: 14px;
`;

export const ForgotRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
`;

export const ForgotLink = styled(Link)`
  font-size: ${fontSize.general};
  color: #37579d;
  text-decoration: none;

  &:hover { text-decoration: underline; }
`;

export const RememberRow = styled.div`
  margin: 10px 0 20px;
`;

// Gradient variant of the shared PrimaryButton, scoped to the login screen
export const LoginButton = styled(ButtonStyled)`
  background: linear-gradient(120deg, #686782, #071235) !important;
  box-shadow: 0 10px 24px -10px rgba(58, 82, 156, 0.5);

  &:hover:not(:disabled) {
    filter: brightness(1.08);
    box-shadow: 0 10px 24px -10px rgba(58, 82, 156, 0.6);
  }
`;

export const ErrorAlert = styled.div`
  padding: 12px 16px;
  font-size: ${fontSize.general};
  color: #e03e4e;
  background: #fff2f3;
  border: 1px solid #ffd8db;
  border-radius: 8px;
  text-align: center;
  margin-top: 14px;
`;

export const LoadingWrap = styled.div`
  margin-top: 10px;
  text-align: center;
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const LoadingSpinner = styled.div`
  width: 36px;
  height: 36px;
  margin: 0 auto;
  border: 3px solid #dee2e6;
  border-top-color: #6c757d;
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;
`;

export const FooterDivider = styled.div`
  border-top: 1px solid #e5e7eb;
  margin-top: 36px;
  margin-bottom: 12px;
`;

export const FooterText = styled.span`
  display: block;
  font-size: ${fontSize.subtitle};
  color: #9ca3af;
  text-align: center;
  white-space: nowrap;
`;
