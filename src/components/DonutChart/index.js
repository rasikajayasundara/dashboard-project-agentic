import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.85); }
  to   { opacity: 1; transform: scale(1); }
`;

const DonutWrap = styled.div`
  position: relative;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  flex-shrink: 0;
  animation: ${fadeIn} 0.4s ease both;
`;

const DonutSvg = styled.svg`
  transform: rotate(-90deg);
  display: block;
`;

const TrackCircle = styled.circle`
  transition: r 0.3s ease, stroke-width 0.3s ease;
`;

const ArcCircle = styled.circle`
  transition: stroke-dasharray 0.5s cubic-bezier(0.4, 0, 0.2, 1), r 0.3s ease,
    stroke-width 0.3s ease;
`;

const DonutLabel = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  pointer-events: none;
`;

const PercentText = styled.span`
  font-size: ${({ $size }) => Math.max(11, Math.round($size * 0.2))}px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  line-height: 1;
  letter-spacing: -0.5px;
  transition: font-size 0.3s ease, color 0.3s ease;
`;

const SubText = styled.span`
  font-size: ${({ $size }) => Math.max(9, Math.round($size * 0.1))}px;
  color: #9ca3af;
  line-height: 1;
  transition: font-size 0.3s ease;
`;

const DonutChart = ({
  percent = 25,
  size = 120,
  strokeWidth,
  spentColor = "#378ADD",
  remainingColor = "#B5D4F4",
  label = "Spent",
  showLabel = true,
}) => {
  const sw = strokeWidth ?? Math.max(6, Math.round(size * 0.1));
  const r = 60 - sw / 2 - 2;
  const circ = 2 * Math.PI * r;
  const spentDash = (Math.min(100, Math.max(0, percent)) / 100) * circ;
  const remainDash = circ - spentDash;

  return (
    <DonutWrap $size={size}>
      <DonutSvg viewBox="0 0 120 120" width={size} height={size}>
        <TrackCircle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={remainingColor}
          strokeWidth={sw}
        />
        <ArcCircle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={spentColor}
          strokeWidth={sw}
          strokeDasharray={`${spentDash} ${remainDash}`}
          strokeLinecap="round"
        />
      </DonutSvg>
      {showLabel && (
        <DonutLabel>
          <PercentText $size={size} $color={spentColor}>
            {Math.round(percent)}%
          </PercentText>
          <SubText $size={size}>{label}</SubText>
        </DonutLabel>
      )}
    </DonutWrap>
  );
};

export default DonutChart;
