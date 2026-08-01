import styled from "styled-components";
import { colors, fontSize } from "../../constants/common";
import { colorOpacity } from "../../utils/common";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Button = styled.button`
  width: 100%;
  padding: 10px 12px;
  border-radius: 5px;
  border: 1px solid ${colors.textLightGrayColor};
  background: transparent;
  color: ${colors.textGrayColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: ${colorOpacity(colors.secondaryColor, 0.1)};
  }
`;

export const Caret = styled.div`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid ${colors.textGrayColor};
  transform: ${({ open }) => (open ? "rotate(180deg)" : "rotate(0)")};
  transition: transform 0.2s;
`;

export const Dropdown = styled.div`
  position: absolute;
  min-width: 200px;
  margin-top: 6px;
  border-radius: 10px;
  background: ${colors.white};
  z-index: 1000;
  padding: 8px;
  max-height: 280px;
  box-shadow: 0 1px 5px ${colors.textLightGrayColor};
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid ${colors.secondaryColor};
  background: transparent;
  color: ${colors.textGrayColor};
  margin-bottom: 6px;

  &::placeholder {
    color: ${colors.textLightGrayColor};
  }
`;

export const OptionList = styled.div`
  max-height: 160px;
  overflow-y: auto;
`;

export const Option = styled.div`
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  color: ${({ active }) =>
    active ? colors.primaryColor : colors.textGrayColor};
  background-color: ${({ active }) =>
    active && colorOpacity(colors.primaryColor, 0.1)};
  transition: 0.15s;

  &:hover {
    background: ${colorOpacity(colors.textLightGrayColor, 0.1)};
    color: ${colors.textGrayColor};
  }
`;

export const NoData = styled.div`
  padding: 8px;
  color: ${colors.textLightGrayColor};
  font-size: ${fontSize.subtitle};
`;
