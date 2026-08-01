import styled, { keyframes } from "styled-components";
import { fontSize } from "../../../constants/common";

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

export const FieldGroup = styled.div`
  margin-bottom: 16px;
`;

export const FieldLabel = styled.label`
  display: block;
  font-size: ${fontSize.general};
  color: #374151;
  margin-bottom: 6px;
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

export const FormSection = styled.div`
  animation: ${fadeInUp} 0.5s ease-out both;
`;

export const ValidatingText = styled.p`
  font-size: ${fontSize.subtitle};
  color: #6b7280;
  text-align: center;
  margin-bottom: 12px;
`;
