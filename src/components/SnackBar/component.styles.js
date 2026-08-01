
import styled, { keyframes } from "styled-components";
const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const getStyles = (type) => {
  switch (type) {
    case "success":
      return {
        bg: "rgba(25, 135, 84, 0.2)",
        color: "rgb(25, 135, 84)",
      };
    case "error":
      return {
        bg: "rgba(220, 53, 69, 0.2)",
        color: "rgb(220, 53, 69)",
      };
    case "warning":
      return {
        bg: "rgba(255, 193, 7, 0.2)",
        color: "rgb(255, 193, 7)",
      };
    default:
      return {
        bg: "rgba(108, 117, 125, 0.2)",
        color: "rgb(108, 117, 125)",
      };
  }
};

export const Wrapper = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
`;

export const SnackbarBox = styled.div`
  min-width: 400px;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 8px 25px #AFAFAF;
  animation: ${slideUp} 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform, opacity;
  background: ${({ type }) => getStyles(type).bg};
  border: 1px solid ${({ type }) => getStyles(type).border};
  color: ${({ type }) => getStyles(type).color};

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CloseBtn = styled.div`
  background: transparent;
  border: none;
  color: inherit;
  font-size: 18px;
  margin-left: 12px;
  cursor: pointer;
`;
