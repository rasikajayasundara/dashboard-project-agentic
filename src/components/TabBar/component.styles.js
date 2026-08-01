import styled from "styled-components";
import { colors } from "../../constants/common";

export const StyledTabBarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: transparent;
  border-bottom: 1px solid ${colors.borderLight};
  padding: 0 4px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const StyledTabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 11px 14px;
  margin-right: 2px;
  background: transparent;
  border: none;
  border-radius: 8px 8px 0 0;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? "700" : "500")};
  color: ${({ $active }) => ($active ? colors.sidebarBg : colors.textSecondary)};
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease, color 0.15s ease;
  flex-shrink: 0;
  outline: none;

  svg,
  i {
    flex-shrink: 0;
    font-size: 14px;
    opacity: ${({ $active }) => ($active ? 1 : 0.8)};
  }

  &:hover {
    background: ${colors.borderLight};
    color: ${({ $active }) => ($active ? colors.sidebarBg : colors.textPrimary)};
  }

  &:focus-visible {
    outline: 2px solid ${colors.sidebarBg};
    outline-offset: -2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:disabled:hover {
    background: transparent;
    color: ${({ $active }) => ($active ? colors.sidebarBg : colors.textSecondary)};
  }
`;

export const TabIndicator = styled.span`
  position: absolute;
  bottom: -1px;
  left: 0;
  height: 2.5px;
  border-radius: 2px 2px 0 0;
  background: ${colors.sidebarBg};
  opacity: 0;
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), width 0.28s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s ease;
  pointer-events: none;
`;

export const TabBadge = styled.span`
  border-radius: 9999px;
  padding: 1px 7px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ $active }) => ($active ? colors.accentBlueLight : colors.borderLight)};
  color: ${({ $active }) => ($active ? colors.accentBlue : colors.textSecondary)};
`;
