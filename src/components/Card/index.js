import React from "react";
import {
  CardWrapper,
  TableTitle,
  TableSubtitle,
  EndSlotCol,
  ContentWrapper,
  FooterWrapper,
  HeaderBar,
} from "./component.styles";

const Card = ({
  title = "",
  subtitle = "",
  headerEndSlot = null,
  content,
  footer = null,
  hideBg = false,
  hideBorder,
 
}) => {
  return (
    <CardWrapper $hideBg={hideBg}>
      <HeaderBar $hideBorder={!title && !headerEndSlot}>
        <div>
          {title && <TableTitle>{title}</TableTitle>}
          {subtitle && <TableSubtitle>{subtitle}</TableSubtitle>}
        </div>
        {headerEndSlot && <EndSlotCol>{headerEndSlot}</EndSlotCol>}
      </HeaderBar>
      <ContentWrapper>{content}</ContentWrapper>
      {footer && <FooterWrapper>{footer}</FooterWrapper>}
    </CardWrapper>
  );
};

export default Card;
