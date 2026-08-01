import styled from "styled-components";
import { colors } from "../../constants/common";

export const PageWrapper = styled.div`
  background: ${colors.backgroundGray};
  min-height: 100%;
  padding: 24px 32px 32px;
`;

export const TabContent = styled.div`
  padding-top: 20px;
`;

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
`;
