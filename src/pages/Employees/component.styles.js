import styled from "styled-components";
import { fontSize } from "../../constants/common";

// ── Page shell ────────────────────────────────────────────────────────────────

export const PageWrapper = styled.div`
  background: #f7f9fb;
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
  color: #686868;
  margin: 0;
  line-height: 28px;
`;

export const TitleBadge = styled.span`
  background: #dbeaf7;
  color: #3796bf;
  font-size: 12px;
  font-weight: 600;
  border-radius: 9999px;
  padding: 2px 10px;
  line-height: 16px;
`;

export const Subtitle = styled.p`
  font-size: ${fontSize.general};
  color: #6b7280;
  margin: 0;
  line-height: 20px;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

// TabBar   → src/components/TabBar
// FilterBar → src/components/FilterBar
// Cell styles → src/components/DataTable
