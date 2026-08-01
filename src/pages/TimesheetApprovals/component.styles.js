import styled from "styled-components";
import { colors, fontSize } from "../../constants/common";

export const PageWrapper = styled.div`
  background: ${colors.backgroundGray};
  min-height: 100%;
  padding: 24px 32px 32px;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const Title = styled.h1`
  font-size: 19px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin: 0;
  line-height: 28px;
`;

export const TitleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  background: ${colors.accentBlueLight};
  color: ${colors.accentBlue};
  font-size: ${fontSize.badge};
  font-weight: 600;
  border-radius: 9999px;
  padding: 2px 10px;
  margin-left: 10px;
  vertical-align: middle;
`;

export const Subtitle = styled.p`
  font-size: ${fontSize.general};
  color: ${colors.textSecondary};
  margin: 0;
`;

export const ToolbarWrapper = styled.div`
  margin-bottom: 16px;
`;
