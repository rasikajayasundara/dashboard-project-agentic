import styled from "styled-components";
import { Link } from "react-router-dom";
import { colors, fontSize } from "../../../constants/common";
import { colorOpacity } from "../../../utils/common";
export {
  Overlay, ModalBox, ModalHeader, ModalTitle, CloseBtn,
  ModalFooter, FooterButtons, CancelBtn, SaveBtn,
} from "../../../components/ModalShell";

export const TopBar = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 14px 22px;
  border-bottom: 1px solid ${colors.borderLight};
  flex-shrink: 0;
`;

export const ModalPanels = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;
`;

export const LeftPanel = styled.div`
  width: 300px;
  flex-shrink: 0;
  padding: 18px 18px 18px 22px;
  border-right: 1px solid ${colors.borderLight};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const RightPanel = styled.div`
  flex: 1;
  padding: 18px 22px 18px 18px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const MiniGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

export const SectionDivider = styled.div`
  font-size: ${fontSize.subtitle};
  font-weight: 700;
  color: ${colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.6px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${colors.borderLight};
`;

export const BillingNote = styled.div`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  margin-top: -4px;
  min-height: 16px;
`;

export const BillingWarning = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: ${fontSize.subtitle};
  color: ${colors.warningColor};
  background: ${colorOpacity(colors.accentAmber, 0.1)};
  border: 1px solid ${colorOpacity(colors.accentAmber, 0.35)};
  border-radius: 6px;
  padding: 6px 9px;
  margin-top: 2px;

  i {
    margin-top: 1px;
  }
`;

export const BillingLink = styled(Link)`
  color: ${colors.accentBlue};
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.15s;

  &:hover {
    border-bottom-color: ${colors.accentBlue};
  }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  border: 1px solid ${colors.borderLight};
  border-radius: 8px;
  padding: 8px 11px;
  font-size: ${fontSize.general};
  color: ${colors.textPrimary};
  background: #ffffff;
  outline: none;
  resize: vertical;
  min-height: 72px;
  transition: border-color 0.15s;

  &::placeholder {
    color: ${colors.textMuted};
  }

  &:focus {
    border-color: #3796BF;
    box-shadow: 0 0 0 3px rgba(55, 150, 191, 0.1);
  }
`;

// ── Line items table ──────────────────────────────────────────────────────────

export const LineItemsTable = styled.div`
  border: 1px solid ${colors.borderColor};
  border-radius: 10px;
  overflow: hidden;
`;

export const LineItemsHead = styled.div`
  display: grid;
  grid-template-columns: 28px 120px 1fr 110px;
  gap: 10px;
  padding: 9px 12px;
  background: ${colors.backgroundGray};
  border-bottom: 1px solid ${colors.borderColor};
`;

export const LineItemHeadCell = styled.span`
  font-size: ${fontSize.subtitle};
  font-weight: 700;
  color: ${colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const LineItemRow = styled.div`
  display: grid;
  grid-template-columns: 28px 120px 1fr 110px;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid ${colors.borderLight};
  align-items: center;
  opacity: ${({ $disabled }) => ($disabled ? 0.55 : 1)};
  transition: opacity 0.15s;

  &:last-child {
    border-bottom: none;
  }
`;

export const LineItemCheckbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #3796BF;
`;

export const LineItemStatic = styled.span`
  font-size: ${fontSize.general};
  color: ${colors.textSecondary};
`;

export const LineItemNum = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  font-weight: 600;
`;

export const LineItemInput = styled.input`
  width: 100%;
  border: 1px solid ${colors.borderLight};
  border-radius: 6px;
  padding: 6px 9px;
  font-size: ${fontSize.general};
  color: ${colors.textPrimary};
  background: #ffffff;
  outline: none;
  transition: border-color 0.15s;

  &::placeholder {
    color: ${colors.textMuted};
  }

  &:focus {
    border-color: #3796BF;
    box-shadow: 0 0 0 3px rgba(55, 150, 191, 0.1);
  }

  &:disabled {
    background: ${colors.backgroundGray};
    color: ${colors.textMuted};
    cursor: not-allowed;
  }
`;

export const RemoveBtn = styled.button`
  width: 26px;
  height: 26px;
  border: none;
  background: none;
  color: ${colors.textMuted};
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: #ef4444;
    background: #fee2e2;
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;

export const AddItemBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: none;
  border: 1.5px dashed ${colors.borderColor};
  border-radius: 8px;
  padding: 9px 14px;
  font-size: ${fontSize.general};
  font-weight: 600;
  color: ${colors.textMuted};
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  width: 100%;

  &:hover {
    border-color: #3796BF;
    color: #3796BF;
  }
`;

export const DraftBtn = styled.button`
  padding: 8px 18px;
  border: 1.5px solid ${colors.borderColor};
  border-radius: 8px;
  background: #fff;
  font-size: ${fontSize.general};
  font-weight: 500;
  color: ${colors.textSecondary};
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: ${colors.backgroundGray};
    border-color: ${colors.textMuted};
  }
`;

export const SubmitBtn = styled.button`
  padding: 8px 18px;
  border: none;
  border-radius: 8px;
  background: #3796BF;
  color: #fff;
  font-size: ${fontSize.general};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #2d7aad;
  }
`;

// ── Summary preview ───────────────────────────────────────────────────────────

export const SummaryBlock = styled.div`
  align-self: flex-end;
  width: 240px;
  margin-top: auto;
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export const SummaryLine = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${fontSize.general};
  color: ${colors.textSecondary};
`;

export const SummaryDivider = styled.hr`
  border: none;
  border-top: 1.5px solid ${colors.borderColor};
  margin: 2px 0;
`;

export const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${fontSize.highlight};
  font-weight: 700;
  color: ${colors.textPrimary};
`;
