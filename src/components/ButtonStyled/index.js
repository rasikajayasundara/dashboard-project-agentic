import {
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
} from "./component.styles";

const ButtonStyled = ({
  children,
  variant = "primary", // primary | secondary
  appearance = "filled", // filled | outline
  disabled = false,
  fullWidth = false,
  startSlot = null,
  endSlot = null,
  ...props
}) => {
  if (variant === "secondary") {
    return (
      <SecondaryButton $fullWidth={fullWidth} disabled={disabled} {...props}>
        {startSlot} {children} {endSlot}
      </SecondaryButton>
    );
  }

  if (appearance === "outline") {
    return (
      <OutlineButton $fullWidth={fullWidth} disabled={disabled} {...props}>
        {startSlot} {children} {endSlot}
      </OutlineButton>
    );
  }

  return (
    <PrimaryButton $fullWidth={fullWidth} disabled={disabled} {...props}>
      {startSlot} {children} {endSlot}
    </PrimaryButton>
  );
};

export default ButtonStyled;
