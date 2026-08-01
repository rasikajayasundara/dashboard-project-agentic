import styled from "styled-components";
import { colors, fontSize } from "../../constants/common";

export const EmptyBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 6px;
  padding: 32px 20px;
  border: 1.5px dashed ${colors.borderLight};
  border-radius: 10px;
`;

export const EmptyIconCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background: ${colors.accentBlueLight};
  color: ${colors.accentBlue};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  margin-bottom: 4px;
`;

export const EmptyTitle = styled.p`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textPrimary};
  margin: 0;
`;

export const EmptySub = styled.p`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  margin: 0;
  max-width: 30ch;
  line-height: 1.5;
`;
