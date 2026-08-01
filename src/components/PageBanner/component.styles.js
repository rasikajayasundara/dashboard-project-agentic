import styled from "styled-components";
import { colors, fontSize } from "../../constants/common";

const ACCENT = {
  info: colors.accentBlue,
  warning: colors.accentAmber,
  error: colors.accentRed,
  sandbox: colors.accentOrange,
};

export const BannerBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid ${({ $type }) => ACCENT[$type] || ACCENT.info};
  margin-bottom: 16px;
`;

export const IconWrap = styled.span`
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-top: 1px;
  display: flex;
  color: ${({ $type }) => ACCENT[$type] || ACCENT.info};
`;

export const BannerText = styled.div`
  flex: 1;
  min-width: 0;
  font-size: ${fontSize.general};
  color: ${colors.textPrimary};
  line-height: 1.5;
`;

export const BannerTitle = styled.span`
  font-weight: 700;
  margin-right: 4px;
`;

export const CloseBtn = styled.button`
  background: transparent;
  border: none;
  padding: 3px;
  cursor: pointer;
  color: ${colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 6px;
  margin-top: -1px;
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: ${colors.textPrimary};
    background: ${colors.borderLight};
  }
`;
