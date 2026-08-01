import styled from "styled-components";
import { colors, fontSize } from "../../constants/common";

export const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background: linear-gradient(135deg, #192929 0%, #364158 38%, #201f3b 68%, #010615 100%);
  display: flex;
  flex-direction: column;
  padding: 20px 15px;
  z-index: 1200;
  transition: transform 0.25s ease;

  @media (max-width: 768px) {
    transform: translateX(${({ $mobileOpen }) => ($mobileOpen ? "0" : "-100%")});
    width: 240px;
  }
`;

export const HamburgerBtn = styled.button`
  display: none;
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 1300;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid ${colors.borderColor};
  background-color: ${colors.white};
  align-items: center;
  justify-content: center;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
  }
`;

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1150;

  @media (min-width: 769px) {
    display: none;
  }
`;


export const NavList = styled.ul`
  list-style: none;
  padding-left: 0;
  padding-top: 20px;
  margin: 0;
  flex: 1;
  min-height: 0;
  overflow-y: auto;

  /* scrollable, but the scrollbar itself stays hidden */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const NavItem = styled.li`
  margin-bottom: 15px;
`;

export const NavAnchor = styled.a`
  display: flex;
  align-items: center;
  color: ${({ $active }) => ($active ? colors.sidebarTextActive : colors.sidebarText)};
  background: ${({ $active }) => ($active ? colors.sidebarActiveBg : "transparent")};
  border-left: 3px solid ${({ $active }) => ($active ? colors.accentBlue : "transparent")};
  text-decoration: none;
  font-size: ${fontSize.general};
  padding: 8px 12px 8px 9px;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ $active }) => ($active ? "" : colors.sidebarHoverBg)};
    color: ${colors.sidebarTextActive};
    text-decoration: none;
  }

  svg {
    font-size: 18px;
    margin-right: 10px;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    padding: 10px 12px 10px 9px;
    font-size: ${fontSize.general};
  }
`;

export const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  color: ${colors.sidebarText};
  font-size: ${fontSize.general};
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;
  border: none;
  background: none;
  width: 100%;
  cursor: pointer;
  font-family: inherit;
  text-align: left;

  &:hover {
    background-color: ${colors.sidebarHoverBg};
    color: ${colors.sidebarTextActive};
  }

  svg {
    font-size: 18px;
    margin-right: 10px;
    flex-shrink: 0;
  }
`;

export const SidebarFooter = styled.footer`
  font-size: ${fontSize.subtitle};
  color: ${colors.sidebarFooterText};
  border-top: 1px solid ${colors.sidebarDivider};
  text-align: center;
  padding-top: 10px;
  margin-top: auto;
`;
