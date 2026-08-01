import ButtonStyled from "../ButtonStyled";
import { EmptyBlock, EmptyIconCircle, EmptyTitle, EmptySub } from "./component.styles";

/**
 * EmptyState — icon-circle + title + subtitle empty-state block, with an
 * optional outlined CTA button.
 *
 * Props:
 *   icon     — Bootstrap icon class, e.g. "bi-wallet2"
 *   title    — bold headline
 *   subtitle — muted supporting text
 *   action   — optional { label, icon?, onClick }
 */
export default function EmptyState({ icon, title, subtitle, action }) {
  return (
    <EmptyBlock>
      <EmptyIconCircle><i className={`bi ${icon}`} /></EmptyIconCircle>
      <EmptyTitle>{title}</EmptyTitle>
      <EmptySub>{subtitle}</EmptySub>
      {action && (
        <ButtonStyled
          appearance="outline"
          startSlot={action.icon ? <i className={`bi ${action.icon}`} /> : undefined}
          onClick={action.onClick}
          style={{ marginTop: 8 }}
        >
          {action.label}
        </ButtonStyled>
      )}
    </EmptyBlock>
  );
}
