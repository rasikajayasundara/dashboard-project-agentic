import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const SpinnerWrap = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Spinner = styled.div`
  width: 36px;
  height: 36px;
  border: 3px solid #dee2e6;
  border-top-color: #6c757d;
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;
`;
