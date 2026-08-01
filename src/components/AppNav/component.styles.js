import styled, { keyframes, css } from "styled-components";
import { colors, fontSize } from "../../constants/common";
import { panelShadow } from "../Panel/component.styles";

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// clip-path reveal: shows only the avatar (40px) at start, expands to full pill.
// GPU-composited — no layout recalculation, visually smooth.
const revealPill = keyframes`
  from { clip-path: inset(0 calc(100% - 40px) 0 0 round 999px); }
  to   { clip-path: inset(0 0% 0 0 round 999px); }
`;

// Gentle opacity fade for the name+chevron as the pill reveals them
const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

// Single-overshoot spring — easing handles the bounce, not keyframes
const popInBell = keyframes`
  0%   { opacity: 0; transform: scale(0.5); }
  65%  { opacity: 1; transform: scale(1.12); }
  100% { transform: scale(1); }
`;

const slideInLeftFade = keyframes`
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
`;

export const NavBar = styled.nav`
  height: 56px;
  width: 100%;
  background: ${colors.white};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: ${panelShadow};
  box-sizing: border-box;
  position: relative;
  z-index: 100;
`;

export const Greeting = styled.div`
  font-size: ${fontSize.highlight};
  font-weight: 700;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* lines up with the page content's own left edge below (e.g. the "Dashboard" title) */
  margin-left: 8px;
  transition: opacity 0.4s ease, transform 0.4s ease;

  ${({ $visible }) =>
    $visible
      ? css`opacity: 0; animation: ${slideInLeftFade} 0.4s ease-out 0.1s forwards;`
      : css`opacity: 0; animation: none; transform: translateX(-12px);`}
`;

export const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

export const UserPillBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px 4px 4px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: ${colors.bgHover};
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, border-color 0.15s;
  animation: ${revealPill} 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;

  &:hover {
    background: ${colors.borderLight};
    border-color: #d1d5db;
  }
`;

export const AvatarCircle = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${colors.sidebarBg};
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

// Wraps name + chevron — fades in as the clip-path reveals them,
// keeping ChevronWrap's own rotate transform isolated
export const PillLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  animation: ${fadeIn} 0.35s ease 0.5s both;
`;

export const UserNameText = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 500;
  color: #374151;
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ChevronWrap = styled.span`
  display: flex;
  align-items: center;
  color: ${colors.textMuted};
  margin-left: 2px;
  transition: transform 0.2s;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};
`;

// Wraps NotificationDropdown — springs in after the pill finishes expanding.
// cubic-bezier(0.34, 1.56, 0.64, 1) is a spring curve; the easing provides
// the overshoot so we only need two keyframe states.
export const AnimatedBellWrap = styled.div`
  display: flex;
  align-items: center;
  animation: ${popInBell} 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.82s both;
`;

export const DropdownCard = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 210px;
  background: ${colors.white};
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 6px;
  animation: ${slideDown} 0.18s ease;
  z-index: 200;
`;

export const DropdownHeader = styled.div`
  padding: 10px 10px 10px;
  border-bottom: 1px solid ${colors.borderLight};
  margin-bottom: 4px;
`;

export const DropdownUserName = styled.div`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: #111827;
`;

export const DropdownUserRole = styled.div`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  margin-top: 2px;
`;

export const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: ${fontSize.general};
  font-weight: 500;
  color: ${({ $danger }) => ($danger ? colors.accentRed : "#374151")};
  cursor: pointer;
  text-align: left;
  text-decoration: none;
  font-family: inherit;
  transition: background 0.12s;

  &:hover {
    background: ${({ $danger }) => ($danger ? "#fef2f2" : colors.borderLight)};
    color: ${({ $danger }) => ($danger ? "#dc2626" : "#111827")};
    text-decoration: none;
  }

  svg {
    flex-shrink: 0;
    opacity: 0.7;
  }
`;

export const DropdownDivider = styled.div`
  height: 1px;
  background: ${colors.borderLight};
  margin: 4px 0;
`;
