import React from "react";
import { Track, Fill, Label, Wrapper } from "./component.styles";
const ProgressBar = ({
  value = 0,
  late = false,
  height = 8,
  labelSize = 12,
  showLabel = true,
  color,
  width,
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <Wrapper $width={width}>
      <Track $color={color} $height={height}>
        <Fill $pct={clamped} $late={late} $color={color} />
      </Track>
      {showLabel && (
        <Label $late={late} $labelSize={labelSize}>
          {clamped}%
        </Label>
      )}
    </Wrapper>
  );
};

export default ProgressBar;
