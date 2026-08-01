import styled from "styled-components";
import { colors, fontSize } from "../../constants/common";
import PanelBase from "../../components/Panel";

// ── Page shell ────────────────────────────────────────────────────────────────

export const PageWrapper = styled.div`
  background: ${colors.backgroundGray};
  min-height: 100%;
  padding: 16px 32px 32px;
`;

// ── Page header ───────────────────────────────────────────────────────────────

export const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin: 0;
  line-height: 28px;
`;

export const Subtitle = styled.p`
  font-size: ${fontSize.general};
  color: ${colors.textSecondary};
  margin: 0;
  line-height: 20px;
`;

// ── Empty state ───────────────────────────────────────────────────────────────

export const EmptyState = styled(PanelBase)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 8px;
  padding: 64px 32px;
`;

export const EmptyIcon = styled.div`
  font-size: 40px;
  color: ${colors.textMuted};
  margin-bottom: 8px;
`;

export const EmptyTitle = styled.h2`
  font-size: ${fontSize.header};
  font-weight: 600;
  color: ${colors.textPrimary};
  margin: 0;
  line-height: 24px;
`;

export const EmptyText = styled.p`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  margin: 0;
  line-height: 18px;
`;
