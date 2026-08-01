import styled, { keyframes } from "styled-components";
import { colors } from "../../constants/common";
import { colorOpacity } from "../../utils/common";

const fillBar = keyframes`
  from { width: 0; }
  to   { width: var(--w); }
`;

/* ── Styles ──────────────────────────────────────────────────────── */
export const Track = styled.div`
  flex: 1;
  height: ${({ $height }) => $height}px;
  background: ${({ $color }) =>
    $color ? colorOpacity($color, 0.2) : colors.borderLight};
  border-radius: 2px;
  overflow: hidden;
`;

export const Fill = styled.div`
  height: 100%;
  border-radius: 2px;
  --w: ${({ $pct }) => $pct}%;
  animation: ${fillBar} 0.8s ease forwards;
  animation-delay: 0s;
  background: ${({ $late, $color, $pct }) =>
    $late
      ? `linear-gradient(90deg, ${colors.pastelRed}, ${colors.pastelAmber})`
      : $color
      ? $color
      : $pct >= 75
      ? `linear-gradient(90deg, ${colors.pastelBlue}, ${colors.pastelGreen})`
      : $pct >= 40
      ? `linear-gradient(90deg, ${colors.pastelAmber}, ${colors.pastelBlue})`
      : `linear-gradient(90deg, ${colors.pastelRed}, ${colors.pastelAmber})`};
`;

export const Label = styled.span`
  font-size: ${({ $labelSize }) => $labelSize}px;
  font-weight: 600;
  color: ${({ $late }) => ($late ? colors.dangerColor : "#a5a6a8")};
  min-width: 34px;
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: ${({ $width }) => ($width ? `${$width}px` : "100%")};
`;
