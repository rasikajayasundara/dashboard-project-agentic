import { PanelSurface } from "./component.styles";

// Shared "soft elevated" surface — the base look for every card/panel box
// across the app. Extend it with `styled(Panel)` to add layout without
// duplicating background/border/radius/shadow.
export default function Panel({ children, ...rest }) {
  return <PanelSurface {...rest}>{children}</PanelSurface>;
}
