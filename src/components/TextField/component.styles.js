import styled from "styled-components";
import { colors, fontSize } from "../../constants/common";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Label = styled.label`
  font-size: ${fontSize.subtitle};
  font-weight: 600;
  color: ${colors.textSecondary};
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Input = styled.input`
  width: 100%;
  padding: 9px 12px;
  padding-left: ${({ $hasStart }) => ($hasStart ? "36px" : "12px")};
  padding-right: ${({ $hasEnd }) => ($hasEnd ? "36px" : "12px")};
  border-radius: 8px;
  border: 1.5px solid ${({ $error }) => ($error ? colors.accentAmber : colors.borderColor)};
  font-size: ${fontSize.general};
  background: #fff;
  color: ${colors.textPrimary};
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: ${({ $error }) => ($error ? colors.accentAmber : "#3796BF")};
  }

  &:focus {
    border-color: #3796BF;
    box-shadow: 0 0 0 3px rgba(55, 150, 191, 0.12);
  }

  &::placeholder {
    color: #d1d5db;
  }
`;

export const HelperText = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${({ $error }) => ($error ? colors.accentAmber : colors.textLightGrayColor)};
`;

export const Slot = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ position }) => (position === "start" ? "left: 10px;" : "right: 10px;")}
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.textMuted};
  cursor: ${({ clickable }) => (clickable ? "pointer" : "default")};
`;