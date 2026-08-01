import styled from "styled-components";
import { colors, fontSize } from "../../../constants/common";

// Custom Overlay + ModalBox pattern (per UI-builder Section 3) — no Bootstrap
// Modal. Overlay click closes; ModalBox click stops propagation.
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

export const ModalBox = styled.div`
  background: ${colors.white};
  border-radius: 12px;
  width: 100%;
  max-width: 640px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${colors.borderLight};
  flex-shrink: 0;
`;

export const ModalTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin: 0;
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

export const ModalBody = styled.div`
  padding: 20px 24px;
  overflow-y: auto;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 20px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  ${({ $span2 }) => ($span2 ? "grid-column: 1 / -1;" : "")}
`;

export const FieldLabel = styled.label`
  font-size: ${fontSize.general};
  font-weight: 500;
  color: ${colors.textPrimary};
`;

export const RequiredMark = styled.span`
  color: ${colors.accentAmber};
  margin-left: 2px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 9px 12px;
  border: 1px solid ${colors.borderLight};
  border-radius: 8px;
  font-size: ${fontSize.general};
  font-family: "Inter", "Segoe UI", sans-serif;
  color: ${colors.textPrimary};
  background: ${colors.white};
  transition: border-color 0.15s, box-shadow 0.15s;

  &::placeholder {
    color: ${colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${colors.accentBlue};
    box-shadow: 0 0 0 3px ${colors.accentBlueLight};
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 9px 12px;
  border: 1px solid ${colors.borderLight};
  border-radius: 8px;
  font-size: ${fontSize.general};
  font-family: "Inter", "Segoe UI", sans-serif;
  color: ${colors.textPrimary};
  background: ${colors.white};
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus {
    outline: none;
    border-color: ${colors.accentBlue};
    box-shadow: 0 0 0 3px ${colors.accentBlueLight};
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid ${colors.borderLight};
  background: ${colors.backgroundGray};
  flex-shrink: 0;
`;

export const CancelBtn = styled.button`
  padding: 9px 18px;
  border: 1px solid ${colors.borderLight};
  border-radius: 8px;
  background: ${colors.white};
  font-size: ${fontSize.general};
  font-weight: 500;
  color: ${colors.textSecondary};
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: ${colors.bgHover};
    border-color: ${colors.textMuted};
  }
`;

export const SubmitBtn = styled.button`
  padding: 9px 20px;
  border: none;
  border-radius: 8px;
  background: ${colors.accentBlue};
  color: ${colors.white};
  font-size: ${fontSize.general};
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.15s;

  &:hover {
    filter: brightness(1.1);
  }
`;
