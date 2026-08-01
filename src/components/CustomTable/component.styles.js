import styled, { keyframes, css } from "styled-components";
import { colors, fontSize } from "../../constants/common";

const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ── Table ──────────────────────────────────────────────────────────── */
export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const THead = styled.thead`
  background: ${colors.primaryLight};
`;

export const Th = styled.th`
  padding: 11px 16px;
  text-align: left;
  font-size: ${fontSize.subtitle};
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: ${colors.primaryColor};
  white-space: nowrap;
  cursor: ${({ sortable }) => (sortable ? "pointer" : "default")};
  user-select: none;
  transition: color 0.15s;

  ${({ sortable }) =>
    sortable &&
    css`
      &:hover {
        color: ${colors.secondaryColor};
      }
    `}
`;

export const ThInner = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
`;

export const SortIcon = styled.span`
  font-size: 10px;
  opacity: 0.6;
`;

export const TBody = styled.tbody``;

export const Tr = styled.tr`
  border-bottom: 1px solid ${colors.borderColor};
  animation: ${fadeSlideIn} 0.35s ease both;
  animation-delay: ${({ index }) => index * 0.05}s;
  transition: background 0.15s;
  cursor: pointer;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #f8f9fd;
  }
`;

export const Td = styled.td`
  padding: 16px 16px;
  font-size: ${fontSize.general};
  color: ${colors.textGrayColor};
  vertical-align: middle;
`;

export const ProjectId = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textLightGrayColor};
  letter-spacing: 0.3px;
`;

export const ProjectName = styled.div`
  font-size: ${fontSize.highlight};
  font-weight: 700;
  color: ${colors.textGrayColor};
  line-height: 1.35;
  max-width: 180px;
`;

export const ClientName = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textLightGrayColor};
  font-style: italic;
`;

export const Budget = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 700;
  color: ${colors.textGrayColor};
`;

export const Deadline = styled.span`
  font-size: ${fontSize.general};
  font-weight: ${({ late }) => (late ? 700 : 500)};
  color: ${({ late }) => (late ? colors.dangerColor : colors.textGrayColor)};
`;

export const TasksCell = styled.div``;

export const TaskCount = styled.div`
  font-size: ${fontSize.highlight};
  font-weight: 700;
  color: ${colors.textGrayColor};
  line-height: 1;
`;

export const TaskOpen = styled.div`
  font-size: ${fontSize.subtitle};
  color: ${colors.textLightGrayColor};
  margin-top: 2px;
`;

/* ── Hrs/wk ─────────────────────────────────────────────────────────── */
export const HrsWk = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 700;
  color: ${colors.textGrayColor};
`;

/* ── PM Avatar ──────────────────────────────────────────────────────── */
export const PMCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ bg }) => bg || colors.primaryLight};
  border: 2px solid ${({ border }) => border || colors.primaryMid};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 800;
  color: ${({ textColor }) => textColor || colors.primaryColor};
  flex-shrink: 0;
  letter-spacing: 0.3px;
`;

export const PMName = styled.span`
  font-size: ${fontSize.general};
  color: ${colors.textGrayColor};
`;

/* ── Empty state ────────────────────────────────────────────────────── */
export const EmptyCell = styled.td`
  text-align: center;
  padding: 48px 16px;
  color: ${colors.textLightGrayColor};
  font-size: ${fontSize.subtitle};
`;

export const FooterInfo = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textLightGrayColor};
`;

export const PaginationGroup = styled.div`
  display: flex;
  gap: 4px;
`;
