import styled, { keyframes } from "styled-components";
import PanelBase from "../Panel";
import { fontSize } from "../../constants/common";

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  width: 100%;
  margin-bottom: 24px;
`;


export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Card = styled(PanelBase)`
  padding: 20px 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $index }) => $index * 80}ms;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 2px 4px rgba(31, 41, 66, 0.05), 0 16px 32px -10px rgba(31, 41, 66, 0.2);
    transform: translateY(-2px);
  }
`;

export const IconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 20px;
  color: ${({ $color }) => $color};
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
`;

export const CardLabel = styled.span`
  font-size: ${fontSize.subtitle};
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9ca3af;
`;

export const CardValue = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: #686868;
  letter-spacing: -0.5px;
  line-height: 1.1;
`;

export const ValueRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 6px;
`;

export const CardFooter = styled.span`
  font-size: ${fontSize.subtitle};
  color: #9ca3af;
  line-height: 16px;
`;