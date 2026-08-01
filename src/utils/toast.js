import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 0.9; transform: translateY(0); }
`;

const ToastWrap = styled.div`
  position: fixed;
  bottom: 33px;
  right: 10px;
  padding: 12px 18px;
  border-radius: 4px;
  color: white;
  z-index: 9999;
  font-weight: 500;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.3s ease;
  opacity: 0.9;
  background-color: ${({ $type }) =>
    $type === "success" ? "#28a745" : "#dc3545"};
`;

function Toast({ message, type, triggerId }) {
  const [visibleMessage, setVisibleMessage] = useState(message);

  useEffect(() => {
    setVisibleMessage(message);
    if (message) {
      const timer = setTimeout(() => setVisibleMessage(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [triggerId, message]);

  if (!visibleMessage) return null;

  return (
    <ToastWrap $type={type}>
      <span>{visibleMessage}</span>
      <button
        type="button"
        className="btn-close ms-3"
        aria-label="Close"
        onClick={() => setVisibleMessage(null)}
      />
    </ToastWrap>
  );
}

export default Toast;
