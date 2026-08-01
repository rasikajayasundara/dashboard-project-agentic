import { useCallback, useRef, useState, cloneElement, Children } from "react";
import {
  Overlay as StyledOverlay, ModalBox,
  ModalBody, ModalHeader, ModalTitle, CloseBtn,
  ModalFooter, FooterButtons, CancelBtn, SaveBtn,
} from "./component.styles";

export {
  ModalBox, ModalBody,
  ModalHeader, ModalTitle, CloseBtn,
  ModalFooter, FooterButtons, CancelBtn, SaveBtn,
};

// Clicking outside the modal no longer closes it — it just shakes the
// modal box to signal it's still open. Use the header close button or
// Cancel/Save actions to dismiss instead.
export function Overlay({ children, onClick, ...props }) {
  const [shake, setShake] = useState(false);
  const [hasShaken, setHasShaken] = useState(false);
  const timeoutRef = useRef(null);

  const handleBackdropClick = useCallback((e) => {
    if (e.target !== e.currentTarget) return;
    setShake(true);
    setHasShaken(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShake(false), 300);
  }, []);

  // Some callers render extra siblings inside Overlay (e.g. a conditional
  // <ConfirmDialog> next to the main <ModalBox>) — only the first (actual
  // modal box) child gets the shake treatment; the rest pass through as-is.
  const childArray = Children.toArray(children);

  return (
    <StyledOverlay onClick={handleBackdropClick} {...props}>
      {childArray.map((child, i) =>
        i === 0 ? cloneElement(child, { $shake: shake, $hasShaken: hasShaken }) : child
      )}
    </StyledOverlay>
  );
}
