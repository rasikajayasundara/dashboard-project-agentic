import styled, { keyframes } from "styled-components";
import { colors, fontSize } from "../../constants/common";

const slideIn = keyframes`
  from { transform: translateX(16px); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
`;

export const TYPE = {
  success: { accent: colors.accentGreen, label: "Success" },
  error:   { accent: colors.accentRed,   label: "Error" },
  warning: { accent: colors.accentAmber, label: "Warning" },
  info:    { accent: colors.accentBlue,  label: "Info" },
};

export const Wrapper = styled.div`
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
`;

export const SnackbarBox = styled.div`
  pointer-events: all;
  position: relative;
  overflow: hidden;
  min-width: 300px;
  max-width: 400px;
  padding: 14px 16px 14px 20px;
  border-radius: 12px;
  background: ${colors.sidebarBg};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.11), 0 2px 8px rgba(0, 0, 0, 0.06);
  animation: ${slideIn} 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

export const AccentBar = styled.span`
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: 6px;
  width: 4px;
  border-radius: 9999px;
  background: ${({ $type }) => TYPE[$type]?.accent || colors.accentBlue};
  box-shadow: 0 0 3px ${({ $type }) => TYPE[$type]?.accent || colors.accentBlue};
`;

export const IconWrap = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${colors.sidebarHoverBg};
  color: ${({ $type }) => TYPE[$type]?.accent || colors.accentBlue};
  box-shadow: 0 0 3px ${({ $type }) => TYPE[$type]?.accent || colors.accentBlue};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const Body = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-top: 1px;
`;

export const Label = styled.div`
  font-size: ${fontSize.header};
  font-weight: 700;
  color: ${colors.white};
  letter-spacing: 0.2px;
`;

export const Message = styled.div`
  font-size: ${fontSize.subtitle};
  font-weight: 400;
  color: ${colors.white};
  opacity: 0.55;
  line-height: 1.5;
`;

export const CloseBtn = styled.button`
  background: transparent;
  border: none;
  padding: 3px;
  cursor: pointer;
  color: ${colors.white};
  opacity: 0.45;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  flex-shrink: 0;
  margin-top: -1px;
  transition: opacity 0.15s;

  &:hover {
    opacity: 1;
  }
`;
