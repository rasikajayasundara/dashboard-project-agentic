import styled, { keyframes, css } from "styled-components";
import { colors, fontSize } from "../../constants/common";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.97) translateY(-8px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);    }
`;

const nudge = keyframes`
  0%   { transform: scale(1);    }
  30%  { transform: scale(0.98); }
  60%  { transform: scale(1.01); }
  100% { transform: scale(1);    }
`;

// ── Shell ─────────────────────────────────────────────────────────────────────

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1055;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

// $maxWidth — e.g. "960px", "560px" (default: "720px")
// $height   — e.g. "85vh" (optional; omit for auto height)
export const ModalBox = styled.div`
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth || "720px"};
  ${({ $height }) => $height ? `height: ${$height};` : ""}
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);

  ${({ $shake, $hasShaken }) =>
    $shake
      ? css`animation: ${nudge} 0.28s cubic-bezier(.34, 1.56, .64, 1);`
      : $hasShaken
      ? css`animation: none;`
      : css`animation: ${fadeIn} 0.2s ease both;`}
`;

// ── Body ──────────────────────────────────────────────────────────────────────

export const ModalBody = styled.div`
  padding: 20px;
  overflow-y: auto;
`;

// ── Header ────────────────────────────────────────────────────────────────────

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px 12px;
  border-bottom: 1px solid ${colors.borderLight};
  flex-shrink: 0;
`;

export const ModalTitle = styled.h5`
  font-size: ${fontSize.header};
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0;
  letter-spacing: -0.2px;
`;

export const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  color: ${colors.textMuted};
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  line-height: 1;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${colors.borderLight};
    color: ${colors.textPrimary};
  }
`;

// ── Footer ────────────────────────────────────────────────────────────────────

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-top: 1px solid ${colors.borderLight};
  background: ${colors.backgroundGray};
  flex-shrink: 0;
`;

export const FooterButtons = styled.div`
  display: flex;
  gap: 10px;
`;

export const CancelBtn = styled.button`
  padding: 8px 20px;
  border: 1.5px solid ${colors.borderColor};
  border-radius: 8px;
  background: #fff;
  font-size: ${fontSize.general};
  font-weight: 500;
  color: ${colors.textSecondary};
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: ${colors.backgroundGray};
    border-color: ${colors.textMuted};
  }
`;

export const SaveBtn = styled.button`
  padding: 8px 22px;
  border: none;
  border-radius: 8px;
  background: ${({ disabled }) => (disabled ? colors.borderLight : colors.sidebarBg)};
  color: ${({ disabled }) => (disabled ? colors.textMuted : "#fff")};
  font-size: ${fontSize.general};
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: filter 0.15s;

  &:hover:not(:disabled) {
    filter: brightness(1.15);
  }

  &:disabled {
    background: ${colors.borderLight};
    color: ${colors.textMuted};
    cursor: not-allowed;
  }
`;
