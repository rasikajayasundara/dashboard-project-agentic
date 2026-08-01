import styled, { keyframes } from "styled-components";
import { colors, fontSize } from "../../../constants/common";

export const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Page = styled.div`
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

export const AuthBox = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  animation: ${fadeInUp} 0.5s ease-out both;
`;

export const Heading = styled.h2`
  font-size: 1.4rem;
  font-weight: 300;
  color: #6b7280;
  text-align: center;
  margin: 0 0 8px;
`;

export const SubText = styled.p`
  font-size: 13px;
  color: #9ca3af;
  text-align: center;
  margin: 0 0 24px;
`;

export const ErrorAlert = styled.div`
  padding: 12px 16px;
  font-size: ${fontSize.general};
  color: #e03e4e;
  background: #fff2f3;
  border: 1px solid #ffd8db;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 14px;
`;

export const LoadingWrap = styled.div`
  margin-top: 10px;
  text-align: center;
`;

export const LoadingImg = styled.img`
  width: 100px;
`;

export const FooterDivider = styled.div`
  border-top: 1px solid #e5e7eb;
  margin-top: 32px;
  margin-bottom: 12px;
`;

export const FooterText = styled.span`
  display: block;
  font-size: ${fontSize.subtitle};
  color: #9ca3af;
  text-align: center;
`;

export const OtpRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 8px;
`;

export const OtpBox = styled.input`
  width: 48px;
  height: 56px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  border: 1.5px solid ${({ $error }) => ($error ? colors.accentAmber : colors.borderColor)};
  border-radius: 8px;
  outline: none;
  color: ${colors.textPrimary};
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus {
    border-color: #3796bf;
    box-shadow: 0 0 0 3px rgba(55, 150, 191, 0.12);
  }

  &::placeholder {
    color: #d1d5db;
    font-size: 24px;
    line-height: 1;
  }
`;
