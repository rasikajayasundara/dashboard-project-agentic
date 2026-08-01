import styled from "styled-components";
import { colors, fontSize } from "../../constants/common";
import PanelBase from "../Panel";

export const Page = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${colors.bgPage};
  padding: 24px;
`;

export const Card = styled(PanelBase)`
  padding: 56px 48px;
  max-width: 480px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

export const IconCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: ${colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: ${colors.primaryColor};
  font-size: 30px;
`;

export const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0;
`;

export const Description = styled.p`
  font-size: ${fontSize.general};
  color: ${colors.textMuted};
  margin: 0;
  line-height: 1.6;
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 8px;
`;

export const PrimaryBtn = styled.button`
  padding: 10px 24px;
  background: ${colors.primaryColor};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: ${fontSize.general};
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover { opacity: 0.88; }
`;

export const FooterNote = styled.p`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  margin: 0;
  margin-top: 16px;

  a {
    color: ${colors.accentBlue};
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`;
