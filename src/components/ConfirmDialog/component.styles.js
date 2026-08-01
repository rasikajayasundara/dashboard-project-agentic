import styled, { keyframes, css } from "styled-components";
import { colors, fontSize } from "../../constants/common";
import { colorOpacity } from "../../utils/common";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(-6px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);    }
`;

const nudge = keyframes`
  0%   { transform: scale(1);    }
  30%  { transform: scale(0.98); }
  60%  { transform: scale(1.01); }
  100% { transform: scale(1);    }
`;

const VARIANT = {
  danger:  { accent: colors.accentRed,   icon: "bi-exclamation-triangle" },
  success: { accent: colors.accentGreen, icon: "bi-check-circle"          },
  info:    { accent: colors.accentBlue,  icon: "bi-question-circle"       },
};

export const getVariant = (v) => VARIANT[v] || VARIANT.info;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1060;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

// Same card language as AppSnackbar/PushNotificationToast — dark sidebarBg
// surface instead of a light card with a colored top border.
export const Dialog = styled.div`
  background: ${colors.sidebarBg};
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 28px 26px 22px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35), 0 2px 8px rgba(0, 0, 0, 0.2);
  gap: 8px;

  ${({ $shake, $hasShaken }) =>
    $shake
      ? css`animation: ${nudge} 0.28s cubic-bezier(.34, 1.56, .64, 1);`
      : $hasShaken
      ? css`animation: none;`
      : css`animation: ${fadeIn} 0.18s ease both;`}
`;

export const IconWrap = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 6px;
  background: ${colors.sidebarHoverBg};
  color: ${({ $accent }) => $accent};
`;

export const Title = styled.h5`
  font-size: ${fontSize.header};
  font-weight: 700;
  color: ${colors.white};
  margin: 0;
`;

export const Message = styled.p`
  font-size: ${fontSize.general};
  color: ${colors.white};
  opacity: 0.6;
  margin: 2px 0 14px;
  line-height: 1.5;
`;

export const CheckboxRow = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  margin-bottom: 16px;
  background: ${colors.sidebarHoverBg};
  border-radius: 8px;
  cursor: pointer;
  font-size: ${fontSize.general};
  color: ${colors.white};
  opacity: 0.85;
  line-height: 1.4;

  input {
    margin-top: 2px;
    cursor: pointer;
    flex-shrink: 0;
  }
`;

export const CommentTextarea = styled.textarea`
  width: 100%;
  resize: none;
  margin-bottom: 16px;
  padding: 10px 12px;
  background: ${colors.sidebarHoverBg};
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 8px;
  font-size: ${fontSize.general};
  font-family: inherit;
  color: ${colors.white};

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

export const Buttons = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
`;

export const CancelBtn = styled.button`
  flex: 1;
  padding: 10px 0;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 8px;
  background: transparent;
  font-size: ${fontSize.general};
  font-weight: 600;
  color: ${colors.white};
  opacity: 0.85;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;

  &:hover {
    background: ${colors.sidebarHoverBg};
    opacity: 1;
  }
`;

export const ConfirmBtn = styled.button`
  flex: 1;
  padding: 10px 0;
  border: none;
  border-radius: 8px;
  font-size: ${fontSize.general};
  font-weight: 700;
  cursor: pointer;
  transition: filter 0.15s;
  background: ${({ $accent }) => $accent};
  color: #fff;
  box-shadow: 0 4px 14px ${({ $accent }) => colorOpacity($accent, 0.35)};

  &:hover {
    filter: brightness(1.08);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: none;
    box-shadow: none;
  }
`;
