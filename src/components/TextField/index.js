import { useState } from "react";
import {
  Wrapper,
  Label,
  Input,
  HelperText,
  InputWrapper,
  Slot,
} from "./component.styles";

const TextField = ({
  label,
  value,
  onChange,
  placeholder,
  error = false,
  helperText,
  type = "text",
  startSlot,
  endSlot,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <Wrapper>
      {label && <Label>{label}</Label>}
      <InputWrapper>
        {startSlot && <Slot position="start">{startSlot}</Slot>}

        <Input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          $error={error}
          $hasStart={!!startSlot}
          $hasEnd={!!endSlot || type === "password"}
          {...props}
        />

        {type === "password" ? (
          <Slot
            position="end"
            clickable
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <i className="bi bi-eye" />
            ) : (
              <i className="bi bi-eye-slash" />
            )}
          </Slot>
        ) : (
          endSlot && <Slot position="end">{endSlot}</Slot>
        )}
      </InputWrapper>
      {helperText && <HelperText $error={error}>{helperText}</HelperText>}
    </Wrapper>
  );
};

export default TextField;
