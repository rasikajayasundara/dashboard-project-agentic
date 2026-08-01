import styled, { keyframes } from "styled-components";
import { colors, fontSize } from "../../../constants/common";
import PanelBase from "../../../components/Panel";

const skeletonPulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

export const TimesheetsLayout = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
`;

export const TableSection = styled.div`
  flex: 3;
  min-width: 0;
`;

export const RightPanel = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ChartCard = styled(PanelBase)`
  padding: 16px;
`;

export const ChartTitle = styled.p`
  font-size: ${fontSize.subtitle};
  font-weight: 600;
  color: ${colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 14px;
`;

export const LegendList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const LegendDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const LegendName = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textSecondary};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const LegendHours = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textPrimary};
  white-space: nowrap;
`;

export const BarArea = styled.div`
  position: relative;
  height: 100px;
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;

export const BarCol = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: flex-end;
`;

export const TargetLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: ${({ $pct }) => $pct}%;
  border-top: 1.5px dashed #d1d5db;
  pointer-events: none;
`;

export const TargetLineLabel = styled.span`
  position: absolute;
  right: 0;
  top: -14px;
  font-size: ${fontSize.subtitle};
  font-weight: 600;
  color: #9ca3af;
`;

export const StackedBarWrap = styled.div`
  width: 100%;
  height: ${({ $pct }) => $pct}%;
  min-height: 3px;
  border-radius: 4px 4px 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  outline: ${({ $current }) => ($current ? "2px solid #3796BF" : "none")};
  outline-offset: 1px;
  transition: height 0.7s ease;
`;

export const BarSegment = styled.div`
  width: 100%;
  flex: ${({ $ratio }) => $ratio} 0 0;
  background: ${({ $color }) => $color};
`;

export const TrendLegend = styled.div`
  display: flex;
  gap: 14px;
  margin-top: 10px;
  justify-content: center;
`;

export const XLabels = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 6px;
`;

export const XLabel = styled.span`
  flex: 1;
  text-align: center;
  font-size: ${fontSize.subtitle};
  color: ${({ $current }) => ($current ? "#3796BF" : colors.textMuted)};
  font-weight: ${({ $current }) => ($current ? "600" : "400")};
  white-space: nowrap;
`;

export const SkeletonCircle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${colors.borderLight};
  margin: 0 auto 14px;
  animation: ${skeletonPulse} 1.4s ease-in-out infinite;
`;

export const SkeletonDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: ${colors.borderLight};
  flex-shrink: 0;
  animation: ${skeletonPulse} 1.4s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay || "0s"};
`;

export const SkeletonLine = styled.span`
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: ${colors.borderLight};
  animation: ${skeletonPulse} 1.4s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay || "0s"};
`;

export const SkeletonBarArea = styled.div`
  height: 100px;
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;

export const SkeletonBar = styled.div`
  flex: 1;
  height: ${({ $h }) => $h}%;
  border-radius: 4px 4px 0 0;
  background: ${colors.borderLight};
  animation: ${skeletonPulse} 1.4s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay || "0s"};
`;
