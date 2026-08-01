import styled from "styled-components";
import { colors, fontSize } from "../../constants/common";

export const TooltipWrapper = styled.span`
  position: relative;
  display: inline-flex;

  /* Arrow — rotated white square, only right+bottom borders visible (forms downward tip) */
  &::before {
    content: "";
    position: absolute;
    width: 8px;
    height: 8px;
    background: ${colors.white};
    border-right: 1px solid ${colors.borderColor};
    border-bottom: 1px solid ${colors.borderColor};
    bottom: calc(100% + 5px);
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease;
    z-index: 99;
  }

  /* Tooltip box */
  &::after {
    content: attr(data-tip);
    position: absolute;
    bottom: calc(100% + 9px);
    left: 50%;
    transform: translateX(-50%);
    background: ${colors.white};
    border: 1px solid ${colors.borderColor};
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.10);
    color: ${colors.textSecondary};
    font-size: ${fontSize.subtitle};
    font-weight: 500;
    padding: 5px 10px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease;
    z-index: 100;
  }

  &:hover::before,
  &:hover::after {
    opacity: 1;
  }
`;

export const RichWrapper = styled.span`
  position: relative;
  display: inline-flex;
`;

export const RichBox = styled.span`
  position: absolute;
  bottom: calc(100% + 9px);
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  background: ${colors.sidebarBg};
  border-radius: 10px;
  padding: 12px 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.28);
  text-align: left;
  white-space: normal;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
  z-index: 100;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${colors.sidebarBg};
  }

  ${RichWrapper}:hover &,
  ${RichWrapper}:focus-within & {
    opacity: 1;
  }
`;

export const CompactBox = styled.span`
  position: absolute;
  bottom: calc(100% + 9px);
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  max-width: 260px;
  background: ${colors.sidebarBg};
  border-radius: 8px;
  padding: 5px 10px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.24);
  color: ${colors.white};
  font-size: ${fontSize.subtitle};
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
  z-index: 100;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: ${colors.sidebarBg};
  }

  ${RichWrapper}:hover &,
  ${RichWrapper}:focus-within & {
    opacity: 1;
  }
`;

export const FloatingBox = styled.span`
  position: absolute;
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  transform: translate(-50%, calc(-100% - 10px));
  background: ${colors.sidebarBg};
  border-radius: 10px;
  padding: 8px 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.28);
  white-space: nowrap;
  pointer-events: none;
  z-index: 100;
`;

export const PortalTrigger = styled.span`
  position: relative;
  display: inline-flex;
`;

export const PortalBox = styled.div`
  position: fixed;
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  transform: translate(-50%, calc(-100% - 9px));
  width: 220px;
  background: ${colors.sidebarBg};
  border-radius: 10px;
  padding: 12px 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.28);
  text-align: left;
  pointer-events: none;
  z-index: 1000;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 65%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${colors.sidebarBg};
  }
`;

export const RichTitle = styled.span`
  display: block;
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.white};
  margin-bottom: 3px;
`;

export const RichDescription = styled.span`
  display: block;
  font-size: ${fontSize.subtitle};
  line-height: 1.5;
  color: ${colors.sidebarText};
`;
