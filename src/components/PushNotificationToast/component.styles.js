import styled, { keyframes } from "styled-components";
import { colors, fontSize } from "../../constants/common";

const slideIn = keyframes`
  from { transform: translateX(120%); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
`;

// Icon circle background per toast type — accent tokens only, no hardcoded hex.
export const TYPE_COLOR = {
  success: colors.accentGreen,
  error: colors.accentRed,
  warning: colors.accentAmber,
  info: colors.accentBlue,
};

export const Stack = styled.div`
  position: fixed;
  top: 72px;
  right: 24px;
  z-index: 1300;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 340px;
`;

export const ToastCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  background: ${colors.sidebarBg};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 12px 28px rgba(0, 0, 0, 0.22);
  animation: ${slideIn} 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
`;

export const IconCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  background: ${({ $type }) => TYPE_COLOR[$type] || TYPE_COLOR.success};
  color: ${colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
`;

export const Body = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const Title = styled.div`
  font-size: ${fontSize.header};
  font-weight: 700;
  color: ${colors.white};
  word-break: break-word;
`;

export const Subtitle = styled.div`
  font-size: ${fontSize.subtitle};
  color: ${colors.white};
  opacity: 0.6;
  line-height: 1.4;
  word-break: break-word;
`;

export const CloseBtn = styled.button`
  background: transparent;
  border: none;
  padding: 2px;
  cursor: pointer;
  color: ${colors.white};
  opacity: 0.55;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: opacity 0.15s;

  &:hover {
    opacity: 1;
  }
`;
