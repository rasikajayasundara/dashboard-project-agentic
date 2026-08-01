import styled from "styled-components";
import { fontSize } from "../../constants/common";

export const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: ${fontSize.badge};
  font-weight: 500;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  white-space: nowrap;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ $color }) => $color};
    flex-shrink: 0;
  }
`;
