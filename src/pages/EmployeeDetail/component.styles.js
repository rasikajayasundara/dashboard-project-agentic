import styled from "styled-components";
import { colors, fontSize } from "../../constants/common";

export const PageWrapper = styled.div`
  background: ${colors.backgroundGray};
  min-height: 100%;
  padding: 24px 32px 32px;
`;


export const TabContent = styled.div`
  padding-top: 20px;
`;

export const ComingSoon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  color: ${colors.textMuted};
  font-size: ${fontSize.subtitle};
`;
