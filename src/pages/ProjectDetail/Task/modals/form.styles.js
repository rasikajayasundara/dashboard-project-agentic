import styled from "styled-components";
import { colors, fontSize } from "../../../../constants/common";

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 20px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const GridFullSpan = styled.div`
  grid-column: 1 / -1;
`;

export const ReadOnlyInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${colors.borderLight};
  border-radius: 6px;
  font-size: ${fontSize.general};
  color: ${colors.textSecondary};
  background: ${colors.backgroundGray};
  cursor: default;
  outline: none;
`;
