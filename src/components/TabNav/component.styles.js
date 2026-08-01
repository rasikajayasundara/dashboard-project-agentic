import styled from "styled-components";
import { fontSize } from "../../constants/common";

export const TabNavContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    gap: 6px;
  }
`;

export const TabButton = styled.button`
  border-radius: 6px 6px 0 0;
  padding: 8px 18px;
  background: transparent;
  border: 0;
  color: #666;
  position: relative;
  top: 8px;
  font-size: ${fontSize.general};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #333;
  }

  &.active {
    background: #fff;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.06);
    border: 1px solid #e0e0e0;
    border-bottom: 0;
    border-radius: 6px 6px 0 0;
    color: #333;
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
  }
`;
