import styled, { keyframes, css } from "styled-components";
import { colors, fontSize } from "../../constants/common";
import PanelBase from "../Panel";

const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const CardWrapper = styled(PanelBase)`
  overflow: hidden;
  animation: ${fadeSlideIn} 0.4s ease both;
  ${({ $hideBg }) =>
    $hideBg &&
    `
    background: transparent;
    border-color: transparent;
    box-shadow: none;
  `}
`;

export const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  ${({ $hideBorder }) =>
    !$hideBorder &&
    `
    padding: 20px 24px 16px;
    border-bottom: 1.5px solid ${colors.borderColor};
  `}
`;

export const TableTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${colors.textGrayColor};
  margin: 0 0 2px 0;
  letter-spacing: -0.3px;
`;

export const TableSubtitle = styled.p`
  font-size: ${fontSize.subtitle};
  color: ${colors.textLightGrayColor};
  margin: 0;
`;

export const EndSlotCol = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

/* ── Table ──────────────────────────────────────────────────────────── */
export const ContentWrapper = styled.div`
  width: 100%;
  padding: 10px 0;
`;

/* ── Footer ─────────────────────────────────────────────────────────── */
export const FooterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  border-top: 1.5px solid ${colors.borderColor};
  flex-wrap: wrap;
  gap: 10px;
`;

export const FooterInfo = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textLightGrayColor};
`;

export const PaginationGroup = styled.div`
  display: flex;
  gap: 4px;
`;
