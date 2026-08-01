import React from "react";
import {
  Container,
  SidebarWrapper,
  Main,
  HeaderWrapper,
  Content,
} from "./component.styles";
import Sidebar from "../AppSidebar";
import Nav from "../AppNav";
import EnvironmentNotice from "../EnvironmentNotice";

const Layout = ({ children }) => {
  return (
    <Container>
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>

      <Main>
        <HeaderWrapper>
          <Nav />
          <EnvironmentNotice />
        </HeaderWrapper>

        <Content>{children}</Content>
      </Main>
    </Container>
  );
};

export default Layout;
