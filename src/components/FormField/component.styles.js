import styled, { createGlobalStyle } from "styled-components";
import { colors, fontSize } from "../../constants/common";

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  grid-column: ${({ $full }) => ($full ? "1 / -1" : "auto")};
`;

export const FieldLabel = styled.label`
  font-size: ${fontSize.subtitle};
  font-weight: 600;
  color: ${colors.textSecondary};
`;

export const FieldError = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.accentAmber};
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const InputSlot = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $end }) => ($end ? "right: 10px;" : "left: 10px;")}
  display: flex;
  align-items: center;
  color: ${colors.textMuted};
  pointer-events: ${({ $clickable }) => ($clickable ? "auto" : "none")};
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  font-size: 14px;
  z-index: 1;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 9px 12px;
  padding-left: ${({ $hasStart }) => ($hasStart ? "36px" : "12px")};
  padding-right: ${({ $hasEnd }) => ($hasEnd ? "36px" : "12px")};
  border: 1.5px solid ${({ $error }) => ($error ? colors.accentAmber : colors.borderColor)};
  border-radius: 8px;
  font-size: ${fontSize.general};
  color: ${colors.textPrimary};
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s, box-shadow 0.15s;
  background: #fff;

  &:focus {
    border-color: #3796BF;
    box-shadow: 0 0 0 3px rgba(55, 150, 191, 0.12);
  }

  &::placeholder {
    color: #d1d5db;
  }
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: 9px 12px;
  border: 1.5px solid ${({ $error }) => ($error ? colors.accentAmber : colors.borderColor)};
  border-radius: 8px;
  font-size: ${fontSize.general};
  color: ${colors.textPrimary};
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s, box-shadow 0.15s;
  appearance: none;
  background: #fff;

  &:focus {
    border-color: #3796BF;
    box-shadow: 0 0 0 3px rgba(55, 150, 191, 0.12);
  }
`;

export const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const DropdownTrigger = styled.button`
  width: 100%;
  padding: 9px 12px;
  border: 1.5px solid ${({ $error }) => ($error ? colors.accentAmber : colors.borderColor)};
  border-radius: 8px;
  font-size: ${fontSize.general};
  outline: none;
  box-sizing: border-box;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, box-shadow 0.15s;
  color: ${({ $hasValue }) => ($hasValue ? colors.textPrimary : "#d1d5db")};

  ${({ $open }) => $open && `
    border-color: #3796BF;
    box-shadow: 0 0 0 3px rgba(55, 150, 191, 0.12);
  `}

  &:disabled {
    background: #f9fafb;
    color: ${colors.textMuted};
    cursor: not-allowed;
  }

  i.chevron {
    color: ${colors.textMuted};
    font-size: 12px;
    flex-shrink: 0;
    transition: transform 0.2s;
    transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};
  }
`;

export const DropdownPanel = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1.5px solid ${colors.borderColor};
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  z-index: 2000;
  overflow: hidden;
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid ${colors.borderLight};

  i {
    color: ${colors.textMuted};
    font-size: 13px;
    flex-shrink: 0;
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    font-size: ${fontSize.general};
    color: ${colors.textPrimary};
    background: transparent;

    &::placeholder { color: #d1d5db; }
  }
`;

export const OptionList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 4px 0;
  max-height: 200px;
  overflow-y: auto;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: ${colors.borderColor}; border-radius: 4px; }
`;

export const OptionItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  font-size: ${fontSize.general};
  cursor: pointer;
  transition: background 0.1s;
  color: ${({ $selected }) => ($selected ? colors.accentBlue : colors.textPrimary)};
  background: ${({ $selected }) => ($selected ? "#EBF5FF" : "transparent")};
  font-weight: ${({ $selected }) => ($selected ? "500" : "400")};

  &:hover { background: ${colors.backgroundGray}; }

  i { font-size: 13px; color: ${colors.accentBlue}; }
`;

export const EmptyMsg = styled.li`
  padding: 14px 12px;
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  text-align: center;
`;

export const DateInputWrap = styled.div`
  position: relative;
  width: 100%;

  input {
    padding-right: 36px;
  }

  .date-icon {
    position: absolute;
    right: 11px;
    top: 50%;
    transform: translateY(-50%);
    color: ${colors.textMuted};
    font-size: 14px;
    pointer-events: none;
    line-height: 1;
  }
`;

export const DatePickerWrapper = styled.div`
  width: 100%;

  .react-datepicker-wrapper,
  .react-datepicker__input-container {
    width: 100%;
  }
`;

// The popup calendar is portaled to document.body (see FormDatePicker's
// popperContainer) so it can escape ModalBox's overflow:hidden and always
// render on top — these styles must be global rather than scoped under
// DatePickerWrapper, since the popup is no longer its descendant in the DOM.
export const DatePickerGlobalStyle = createGlobalStyle`
  .react-datepicker-popper {
    z-index: 3000;
  }

  .react-datepicker {
    border: 1px solid ${colors.borderColor};
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    overflow: hidden;
  }

  .react-datepicker__triangle {
    display: none;
  }

  .react-datepicker__header {
    background: ${colors.backgroundGray};
    border-bottom: 1px solid ${colors.borderLight};
    padding: 12px 0 8px;
    border-radius: 0;
  }

  .react-datepicker__current-month {
    font-size: ${fontSize.header};
    font-weight: 600;
    color: ${colors.textPrimary};
    margin-bottom: 6px;
  }

  .react-datepicker__day-names {
    margin-top: 4px;
  }

  .react-datepicker__day-name {
    font-size: ${fontSize.subtitle};
    font-weight: 600;
    color: ${colors.textMuted};
    text-transform: uppercase;
    width: 32px;
    line-height: 28px;
  }

  .react-datepicker__day {
    font-size: ${fontSize.general};
    color: ${colors.textPrimary};
    width: 32px;
    line-height: 30px;
    border-radius: 7px;
    margin: 1px;
    transition: background 0.15s, color 0.15s;

    &:hover {
      background: ${colors.accentBlueLight};
      color: ${colors.accentBlue};
    }
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--selected:hover {
    background: ${colors.accentBlue};
    color: #fff;
    font-weight: 600;
  }

  .react-datepicker__day--today {
    font-weight: 700;
    color: ${colors.accentBlue};
  }

  .react-datepicker__day--today.react-datepicker__day--selected {
    color: #fff;
  }

  .react-datepicker__day--outside-month {
    color: ${colors.textMuted};
    opacity: 0.5;
  }

  .react-datepicker__day--disabled {
    color: ${colors.borderColor};
    cursor: not-allowed;
    &:hover { background: none; }
  }

  .react-datepicker__navigation {
    top: 14px;
  }

  .react-datepicker__navigation-icon::before {
    border-color: ${colors.textMuted};
    border-width: 2px 2px 0 0;
    width: 7px;
    height: 7px;
  }

  .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
    border-color: ${colors.textPrimary};
  }

  .react-datepicker__month {
    margin: 6px 10px 10px;
  }
`;
