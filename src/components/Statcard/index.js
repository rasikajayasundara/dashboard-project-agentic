import { colors } from "../../constants/common";
import { colorOpacity } from "../../utils/common";
import { Card, CardLabel, CardValue, CardFooter, IconBox, Info, ValueRow } from "./component.styles";

const StatCard = ({ label, value, icon, iconColor = colors.textMuted, index = 0, footer }) => (
  <Card $index={index}>
    <IconBox $bg={colorOpacity(iconColor, 0.2)} $color={iconColor}>
      {icon}
    </IconBox>
    <Info>
      <CardLabel>{label}</CardLabel>
      <ValueRow>
        <CardValue>{value}</CardValue>
        {footer && <CardFooter>{footer}</CardFooter>}
      </ValueRow>
    </Info>
  </Card>
);

export default StatCard;
