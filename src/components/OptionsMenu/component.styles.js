import styled from "styled-components";
import { colors, fontSize } from "../../constants/common";

export const Wrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const MenuBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: ${colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 15px;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  line-height: 1;

  &:hover {
    background: ${colors.backgroundGray};
    color: ${colors.textPrimary};
  }
`;

export const Menu = styled.div`
  background: ${colors.white};
  border: 1px solid ${colors.borderColor};
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.10);
  min-width: 170px;
  z-index: 2000;
  overflow: hidden;
`;

export const Divider = styled.hr`
  margin: 4px 0;
  border: none;
  border-top: 1px solid ${colors.borderLight};
`;

export const MenuItem = styled.button`
  width: 100%;
  padding: 9px 14px;
  border: none;
  background: none;
  text-align: left;
  font-size: ${fontSize.general};
  color: ${({ $danger, $disabled }) => ($disabled ? colors.textMuted : $danger ? colors.accentRed : colors.textPrimary)};
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  transition: background 0.12s;

  i {
    font-size: 13px;
    color: ${({ $danger, $disabled }) => ($disabled ? colors.textMuted : $danger ? colors.accentRed : colors.textMuted)};
  }

  &:hover {
    background: ${({ $danger, $disabled }) => ($disabled ? "none" : $danger ? "#FEF2F2" : colors.backgroundGray)};
  }
`;
