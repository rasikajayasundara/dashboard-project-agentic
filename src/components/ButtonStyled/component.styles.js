import styled from "styled-components";
import { colors, fontSize } from "../../constants/common";

export const BaseButton = styled.button`
  padding: 10px 18px;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  border-radius: 8px;
  transition: all 0.2s ease;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-size: ${fontSize.general};
  font-weight: 500;
  cursor: pointer;

  &:active { transform: scale(0.97); }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const PrimaryButton = styled(BaseButton)`
  background: ${colors.sidebarBg};
  color: #ffffff;

  &:hover:not(:disabled) {
    filter: brightness(1.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    transform: translateY(-1px);
  }
`;

export const SecondaryButton = styled(BaseButton)`
  background: #ffffff;
  color: #374151;
  border: 1px solid #E5E7EB;

  &:hover:not(:disabled) {
    background: #F9FAFB;
    border-color: #D1D5DB;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
`;

export const OutlineButton = styled(BaseButton)`
  background: #ffffff;
  color: #3796BF;
  border: 1.5px solid #3796BF;

  &:hover:not(:disabled) {
    background: #DBEAF7;
    transform: translateY(-1px);
  }
`;
