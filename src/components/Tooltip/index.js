import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  TooltipWrapper,
  RichWrapper,
  RichBox,
  CompactBox,
  FloatingBox,
  PortalTrigger,
  PortalBox,
  RichTitle,
  RichDescription,
} from "./component.styles";

export default function Tooltip({ text, title, description, children, x, y, portal }) {
  const triggerRef = useRef(null);
  const [coords, setCoords] = useState(null);

  // Escapes ancestor clipping (e.g. a horizontally-scrolling table forcing overflow-y:
  // hidden) by rendering the popup into document.body instead of positioning it
  // relative to a potentially-clipped local ancestor.
  if (portal && title && description) {
    const handleEnter = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const boxWidth = 220;
      const edgeMargin = 12;
      const centerX = rect.left + rect.width / 2;
      const clampedX = Math.min(
        Math.max(centerX, boxWidth / 2 + edgeMargin),
        window.innerWidth - boxWidth / 2 - edgeMargin
      );
      setCoords({ x: clampedX, y: rect.top });
    };
    const handleLeave = () => setCoords(null);

    return (
      <PortalTrigger ref={triggerRef} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        {children}
        {coords && createPortal(
          <PortalBox $x={coords.x} $y={coords.y}>
            <RichTitle>{title}</RichTitle>
            <RichDescription>{description}</RichDescription>
          </PortalBox>,
          document.body
        )}
      </PortalTrigger>
    );
  }

  if (x != null && y != null) {
    return (
      <FloatingBox $x={x} $y={y}>
        <RichTitle>{title}</RichTitle>
        {description && <RichDescription>{description}</RichDescription>}
      </FloatingBox>
    );
  }

  if (title && description) {
    return (
      <RichWrapper>
        {children}
        <RichBox>
          <RichTitle>{title}</RichTitle>
          <RichDescription>{description}</RichDescription>
        </RichBox>
      </RichWrapper>
    );
  }

  if (title) {
    return (
      <RichWrapper>
        {children}
        <CompactBox>{title}</CompactBox>
      </RichWrapper>
    );
  }

  return (
    <TooltipWrapper data-tip={text}>
      {children}
    </TooltipWrapper>
  );
}
