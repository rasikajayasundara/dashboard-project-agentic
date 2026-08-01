import styled from "styled-components";
import { colors, fontSize } from "../../../constants/common";
import PanelBase from "../../../components/Panel";

export const TopGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 16px;
  align-items: stretch;
`;

export const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
  align-items: start;
`;

export const Panel = styled(PanelBase)`
  padding: 20px;
`;

export const PanelTitle = styled.h3`
  font-size: ${fontSize.header};
  font-weight: 600;
  color: ${colors.textPrimary};
  margin: 0 0 12px 0;
`;

export const PanelHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const PanelHeaderMeta = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
`;

export const DonutRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const DonutSide = styled.div`
  flex-shrink: 0;
`;

export const LegendSide = styled.div`
  flex: 1;
  min-width: 0;
`;

export const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid ${({ $last }) => ($last ? "transparent" : colors.borderLight)};
`;

export const LegendDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const LegendLabel = styled.span`
  font-size: ${fontSize.general};
  color: ${colors.textSecondary};
  flex: 1;
`;

export const LegendAmount = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textPrimary};
`;

export const CompletionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid ${({ $last }) => ($last ? "transparent" : colors.borderLight)};
`;

export const CompletionName = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 500;
  color: ${colors.textPrimary};
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 140px;
`;

export const CompletionPct = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  white-space: nowrap;
  min-width: 36px;
  text-align: right;
`;

export const ProgressWrap = styled.div`
  flex: 1;
`;

export const MiniColHeader = styled.div`
  display: flex;
  gap: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid ${colors.borderColor};
  margin-bottom: 4px;
`;

export const ColHeadCell = styled.span`
  font-size: ${fontSize.subtitle};
  font-weight: 600;
  color: ${colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.4px;
  flex: ${({ $flex }) => $flex ?? 1};
`;

export const MiniRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid ${({ $last }) => ($last ? "transparent" : colors.borderLight)};
`;

export const MiniCell = styled.span`
  font-size: ${fontSize.general};
  color: ${({ $color }) => $color || colors.textPrimary};
  font-weight: ${({ $bold }) => ($bold ? 600 : 400)};
  flex: ${({ $flex }) => $flex ?? 1};
  overflow: ${({ $clip }) => ($clip ? "hidden" : "visible")};
  text-overflow: ${({ $clip }) => ($clip ? "ellipsis" : "unset")};
  white-space: ${({ $clip }) => ($clip ? "nowrap" : "normal")};
`;

export const StatusPill = styled.span`
  display: inline-block;
  font-size: ${fontSize.badge};
  font-weight: 500;
  border-radius: 9999px;
  padding: 2px 8px;
  background: ${({ $bg }) => $bg};
  color: ${({ $text }) => $text};
  flex: ${({ $flex }) => $flex ?? 1};
  white-space: nowrap;
`;
