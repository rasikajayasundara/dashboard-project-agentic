import styled from "styled-components";
import { colors, fontSize } from "../../../constants/common";
import { colorOpacity } from "../../../utils/common";

export const DueTag = styled.span`
  margin-left: 6px;
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.accentRed};
`;

export const TaskIdChip = styled.span`
  display: inline-block;
  font-size: ${fontSize.badge};
  font-weight: 600;
  color: ${colors.accentBlue};
  background: ${colorOpacity(colors.accentBlue, 0.08)};
  border-radius: 4px;
  padding: 1px 6px;
  margin-right: 6px;
  white-space: nowrap;
`;
