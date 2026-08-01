import styled from "styled-components";
import { colors } from "../../constants/common";


export const DropdownContainer = styled.div`
  position: relative;
  width: 300px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${colors.primaryColor};
  outline: none;
  background: transparent;
  color: ${colors.textGrayColor};

  &::placeholder {
    color: ${colors.textLightGrayColor};
  }

  &:focus {
    border-color: ${colors.secondaryColor};
  }
`;

export const DropdownList = styled.ul`
  position: absolute;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 6px;
  padding: 4px 0;
  list-style: none;

  background: ${colors.primaryColor};
  border-radius: 10px;
  z-index: 1000;
`;

export const DropdownItem = styled.li`
  padding: 10px 12px;
  cursor: pointer;
  color: ${colors.textGrayColor};
  background: transparent;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.secondaryColor};
    color: ${colors.textGrayColor};
  }
`;