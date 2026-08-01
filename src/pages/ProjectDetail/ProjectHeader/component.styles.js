import styled from "styled-components";
import { colors, fontSize } from "../../../constants/common";
import { colorOpacity } from "../../../utils/common";
import PanelBase from "../../../components/Panel";

export const HeaderCard = styled(PanelBase)`
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  position: relative;
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
`;

export const ProjectNoBox = styled.div`
  flex-shrink: 0;
  width: 96px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
  padding: 10px 8px;
  border-radius: 12px;
  background: ${colorOpacity(colors.accentAmber, 0.12)};
  border: 1.5px solid ${colors.accentAmber};
`;

export const ProjectNoLabel = styled.span`
  font-size: ${fontSize.badge};
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${colors.warningColor};
  opacity: 0.85;
  white-space: nowrap;
`;

export const ProjectNoValue = styled.span`
  font-size: ${fontSize.header};
  font-weight: 700;
  color: ${colors.warningColor};
  white-space: nowrap;
`;

export const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Name = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.textPrimary};
`;

export const ContactRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`;

export const ContactChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: ${fontSize.subtitle};
  color: ${colors.textSecondary};

  i {
    color: ${colors.textMuted};
    font-size: 13px;
  }
`;

export const Divider = styled.div`
  width: 1px;
  height: 40px;
  background: ${colors.borderColor};
  flex-shrink: 0;
  margin: 0 4px;
`;

export const MetricsSection = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
  flex-shrink: 0;
`;

export const MetricItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

export const MetricLabel = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  text-align: center;
  white-space: nowrap;
`;

export const HeaderActions = styled.div`
  align-self: flex-start;
  margin-left: auto;
  flex-shrink: 0;
`;
