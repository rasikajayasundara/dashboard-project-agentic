import styled from "styled-components";
import { colors } from "../../constants/common";

export const Container = styled.div`
  display: flex;
  gap: 5px;
  height: 100vh;
`;

export const SidebarWrapper = styled.div`
  width: 240px;
  min-width: 240px;
  height: 100vh;
  @media (max-width: 768px) {
    width: 0;
    min-width: 0;
  }
`;

export const Main = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
`;

export const HeaderWrapper = styled.div`
  z-index: 1000;
  background: #ffffff;
  flex-shrink: 0;
`;

export const Content = styled.div`
  background-color: ${colors.backgroundGray};
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0;

  /* scrollable, but the scrollbar itself stays hidden */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
