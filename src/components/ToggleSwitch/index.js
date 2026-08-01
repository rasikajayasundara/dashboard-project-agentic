import React from "react";
import {
  ToggleWrapper,
  ToggleTrack,
  ToggleInput,
  ToggleSlider,
  ToggleText,
  ToggleLabel,
  ToggleDescription,
} from "./component.styles";

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  color,
}) {
  const handleChange = (e) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  return (
    <ToggleWrapper $disabled={disabled}>
      <ToggleTrack>
        <ToggleInput
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
        />
        <ToggleSlider $checked={checked} $color={color} />
      </ToggleTrack>
      <ToggleText>
        <ToggleLabel>{label}</ToggleLabel>
        {description && <ToggleDescription>{description}</ToggleDescription>}
      </ToggleText>
    </ToggleWrapper>
  );
}
