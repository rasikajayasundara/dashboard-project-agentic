import { useLayoutEffect, useRef } from "react";
import { StyledTabBarContainer, StyledTabButton, TabIndicator } from "./component.styles";

export { TabBadge } from "./component.styles";

export function TabBarContainer({ children, className, style }) {
  const containerRef = useRef(null);
  const indicatorRef = useRef(null);

  useLayoutEffect(() => {
    const reposition = () => {
      const container = containerRef.current;
      const indicatorEl = indicatorRef.current;
      if (!container || !indicatorEl) return;
      const active = container.querySelector('[aria-selected="true"]');
      if (!active) {
        indicatorEl.style.opacity = "0";
        return;
      }
      indicatorEl.style.opacity = "1";
      indicatorEl.style.width = `${active.offsetWidth}px`;
      indicatorEl.style.transform = `translateX(${active.offsetLeft}px)`;
    };

    reposition();
    window.addEventListener("resize", reposition);
    return () => window.removeEventListener("resize", reposition);
  });

  return (
    <StyledTabBarContainer ref={containerRef} className={className} style={style}>
      {children}
      <TabIndicator ref={indicatorRef} />
    </StyledTabBarContainer>
  );
}

export function TabButton({ $active, children, ...rest }) {
  return (
    <StyledTabButton $active={$active} role="tab" aria-selected={$active ? "true" : "false"} {...rest}>
      {children}
    </StyledTabButton>
  );
}
