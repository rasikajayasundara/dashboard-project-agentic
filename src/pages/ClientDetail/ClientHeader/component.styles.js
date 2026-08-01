import styled from "styled-components";
import { colors, fontSize } from "../../../constants/common";
import PanelBase from "../../../components/Panel";

export const HeaderCard = styled(PanelBase)`
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
`;

export const LogoSquare = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: ${({ $bg }) => $bg};
  border: 2px solid ${({ $border }) => $border};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 18px;
  font-weight: 700;
  color: ${({ $textColor }) => $textColor};
  letter-spacing: 0.5px;
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
  white-space: nowrap;
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
  gap: 32px;
  align-items: center;
  flex-shrink: 0;
`;

export const MetricBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
`;

export const MetricLabel = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
`;

export const MetricValue = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: ${({ $color }) => $color || colors.textPrimary};
`;
