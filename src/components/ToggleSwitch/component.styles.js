import styled from "styled-components";
import { colors, fontSize } from "../../constants/common";

export const ToggleWrapper = styled.label`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;

export const ToggleTrack = styled.span`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
  margin-top: 2px;
`;

export const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`;

export const ToggleSlider = styled.span`
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: ${({ $checked, $color }) => ($checked ? ($color || colors.accentBlue) : "#D1D5DB")};
  transition: background 0.2s;

  &::before {
    content: "";
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 9999px;
    background: ${colors.white};
    top: 3px;
    left: ${({ $checked }) => ($checked ? "23px" : "3px")};
    transition: left 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
`;

export const ToggleText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ToggleLabel = styled.span`
  font-size: ${fontSize.general};
  font-weight: 500;
  color: ${colors.textPrimary};
  line-height: 20px;
`;

export const ToggleDescription = styled.span`
  font-size: ${fontSize.subtitle};
  font-weight: 400;
  color: ${colors.textSecondary};
  line-height: 18px;
`;
