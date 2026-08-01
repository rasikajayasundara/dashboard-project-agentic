import styled, { keyframes } from "styled-components";
import { colors, fontSize } from "../../constants/common";

export const fadeSlideDown = keyframes`
  from { opacity: 0; transform: translateY(-8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
`;

export const popIn = keyframes`
  0%   { transform: scale(0.8); opacity: 0; }
  70%  { transform: scale(1.06); }
  100% { transform: scale(1);   opacity: 1; }
`;

export const accordionIn = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const DropdownContainer = styled.div`
  position: relative;
  display: inline-flex;
`;

export const TriggerBadge = styled.span`
  background: ${colors.primaryColor};
  color: ${colors.white};
  font-size: ${fontSize.badge};
  font-weight: 700;
  border-radius: 20px;
  padding: 1px 7px;
  min-width: 18px;
  text-align: center;
  animation: ${popIn} 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

export const PanelWrapper = styled.div`
  position: absolute;
  max-height: 300px;
  overflow-y: auto;
  z-index: 999;
  width: 300px;
  top: calc(100% + 8px);
  right: 0;
  left: auto;
  > div {
    background: ${colors.white};
    border: 1.5px solid ${colors.borderColor};
    border-radius: 14px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    animation: ${fadeSlideDown} 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    transform-origin: top right;
  }
`;

export const AccordionItem = styled.div`
  border: 1.5px solid
    ${({ $open }) => ($open ? colors.primaryMid : colors.borderColor)};
  border-radius: 8px;
  background: ${({ $open }) => ($open ? colors.primaryLight : colors.white)};
  overflow: hidden;
  transition: border-color 0.2s, background 0.2s;
  &:hover {
    border-color: ${colors.primaryMid};
  }
`;

export const AccordionHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 13px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ $open }) => ($open ? colors.primaryColor : colors.textGrayColor)};
  font-size: ${fontSize.general};
  font-weight: 500;
  transition: color 0.2s;
  gap: 8px;
  &:hover {
    color: ${colors.primaryColor};
  }
`;

export const LabelGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FilterIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${({ $open }) =>
    $open ? colors.primaryColor : colors.textLightGrayColor};
  transition: color 0.2s;
`;

export const FilterLabel = styled.span`
  color: ${({ $open }) => ($open ? colors.primaryColor : colors.textGrayColor)};
  transition: color 0.2s;
`;

export const ChevronIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${({ $open }) =>
    $open ? colors.primaryColor : colors.textLightGrayColor};
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s;
`;

export const CountBadge = styled.span`
  font-size: ${fontSize.badge};
  font-weight: 600;
  background: ${colors.primaryMid};
  color: ${colors.primaryColor};
  border-radius: 20px;
  padding: 1px 7px;
  animation: ${popIn} 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

export const AccordionBody = styled.div`
  padding: 4px 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 400px;
  overflow-y: auto;
  animation: ${accordionIn} 0.2s cubic-bezier(0.22, 1, 0.36, 1);
`;

export const OptionRow = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 10px;
  background: ${({ $selected }) =>
    $selected ? colors.secondaryLight : "transparent"};
  border: 1.5px solid
    ${({ $selected }) => ($selected ? colors.secondaryColor : "transparent")};
  border-radius: 7px;
  cursor: pointer;
  color: ${({ $selected }) =>
    $selected ? colors.textGrayColor : colors.textGrayColor};
  font-size: ${fontSize.general};
  font-weight: ${({ $selected }) => ($selected ? 500 : 400)};
  transition: all 0.15s;
  text-align: left;
  gap: 8px;

  &:hover {
    background: ${colors.primaryLight};
    border-color: ${colors.primaryMid};
    transform: translateX(2px);
  }
  &:active {
    transform: scale(0.98);
  }
`;

export const OptionLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
`;

export const Avatar = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${({ $color }) => $color || colors.primaryColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: ${colors.white};
  flex-shrink: 0;
`;

export const Dot = styled.div`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${({ $color }) => $color || colors.textLightGrayColor};
  flex-shrink: 0;
`;

export const CheckIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${colors.secondaryColor};
  animation: ${popIn} 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 2px 2px;
  border-top: 1.5px solid ${colors.borderColor};
  margin-top: 2px;
`;

export const ClearBtn = styled.button`
  background: none;
  border: none;
  color: ${colors.textLightGrayColor};

  font-size: ${fontSize.general};
  cursor: pointer;
  padding: 5px 8px;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;

  &:hover {
    color: ${colors.dangerColor};
    background: #fcebeb;
  }
`;
