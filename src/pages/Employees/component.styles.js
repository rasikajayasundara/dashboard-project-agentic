import styled from "styled-components";
import { colors, fontSize } from "../../constants/common";

export const PageWrapper = styled.div`
  background: ${colors.backgroundGray};
  min-height: 100%;
  padding: 16px 32px 32px;
  font-family: "Inter", "Segoe UI", sans-serif;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin: 0;
  line-height: 28px;
`;

export const TitleBadge = styled.span`
  background: ${colors.accentBlueLight};
  color: ${colors.accentBlue};
  font-size: ${fontSize.subtitle};
  font-weight: 600;
  border-radius: 9999px;
  padding: 2px 10px;
`;

export const Subtitle = styled.p`
  font-size: ${fontSize.general};
  color: ${colors.textSecondary};
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;
