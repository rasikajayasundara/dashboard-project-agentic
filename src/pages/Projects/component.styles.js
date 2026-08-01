import styled from "styled-components";
import { colors, fontSize } from "../../constants/common";
import PanelBase from "../../components/Panel";

export const PageWrapper = styled.div`
  background: ${colors.backgroundGray};
  min-height: 100%;
  padding: 24px 32px 32px;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const Title = styled.h1`
  font-size: 19px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin: 0;
  line-height: 28px;
`;

export const TitleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  background: ${colors.accentBlueLight};
  color: ${colors.accentBlue};
  font-size: 11px;
  font-weight: 600;
  border-radius: 9999px;
  padding: 2px 10px;
  margin-left: 10px;
  vertical-align: middle;
`;

export const Subtitle = styled.p`
  font-size: ${fontSize.general};
  color: ${colors.textSecondary};
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
`;

export const EmptyStatCard = styled(PanelBase)`
  border: 1px dashed ${colors.borderLight};
  padding: 20px 22px;
`;

export const FooterBudget = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

export const FooterBudgetLabel = styled.span`
  font-size: ${fontSize.subtitle};
  font-weight: 400;
  color: ${colors.textMuted};

  &::after { content: ":"; }
`;

export const FooterBudgetValue = styled.span`
  font-size: ${fontSize.general};
  color: ${colors.textPrimary};
`;

