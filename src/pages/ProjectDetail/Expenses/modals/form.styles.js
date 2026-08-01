import styled from "styled-components";
import { colors, fontSize } from "../../../../constants/common";
import { colorOpacity } from "../../../../utils/common";

export const BodyStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  min-height: 72px;
  padding: 9px 12px;
  border: 1.5px solid ${colors.borderColor};
  border-radius: 8px;
  font-size: ${fontSize.general};
  font-family: inherit;
  color: ${colors.textPrimary};
  outline: none;
  box-sizing: border-box;
  resize: vertical;
  transition: border-color 0.15s, box-shadow 0.15s;
  background: ${colors.white};

  &:focus {
    border-color: ${colors.accentBlue};
    box-shadow: 0 0 0 3px ${colorOpacity(colors.accentBlue, 0.12)};
  }

  &::placeholder {
    color: #d1d5db;
  }
`;

/* ── Mileage / Cost segmented toggle ─────────────────────────────────────── */

export const SegToggle = styled.div`
  display: flex;
  gap: 8px;
`;

export const SegOption = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1.5px solid ${({ $selected }) => ($selected ? colors.accentBlue : colors.borderColor)};
  background: ${({ $selected }) => ($selected ? colors.accentBlueLight : colors.white)};
  color: ${({ $selected }) => ($selected ? colors.accentBlue : colors.textSecondary)};
  font-size: ${fontSize.general};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;

  i { font-size: 15px; }
`;

/* ── Mileage distance + live cost readout ────────────────────────────────── */

export const MileageRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 16px 20px;
  align-items: end;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const CalcDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 9px 12px;
  border: 1px dashed ${colors.borderColor};
  border-radius: 8px;
  background: ${colors.bgHover};
`;

export const CalcFormula = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
`;

export const CalcTotal = styled.span`
  font-size: ${fontSize.general};
  font-weight: 700;
  color: ${colors.accentBlue};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

/* ── Attachment dropzone ──────────────────────────────────────────────────── */

export const Dropzone = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  border-radius: 10px;
  border: 1.5px dashed ${colors.accentBlue};
  background: ${colors.accentBlueLight};
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  ${({ $hasFile }) =>
    $hasFile &&
    `
      border-style: solid;
      border-color: ${colors.borderColor};
      background: ${colors.bgHover};
    `}

  ${({ $dragActive }) => $dragActive && `filter: brightness(0.97);`}
`;

export const DropzoneIcon = styled.i`
  font-size: 20px;
  color: ${colors.accentBlue};
  flex-shrink: 0;
`;

export const DropzoneText = styled.span`
  font-size: ${fontSize.general};
  font-weight: 600;
  color: ${colors.textPrimary};
  display: block;
`;

export const DropzoneSubtext = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  display: block;
`;

export const PickedFileMeta = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const PickedFileName = styled.span`
  font-size: ${fontSize.general};
  font-weight: 600;
  color: ${colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const PickedFileSize = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const DropzoneRemoveBtn = styled.button`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: ${colorOpacity(colors.accentRed, 0.12)};
  color: ${colors.accentRed};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${colors.accentRed};
    color: ${colors.white};
  }
`;

export const OptionalTag = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  font-weight: 500;
`;

/* ── Budget + Date two-column row ────────────────────────────────────────── */

export const TwoColRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 20px;
  align-items: end;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

/* ── Submitting overlay / progress bar (ported from Documents/modals/uploadDocument.styles.js) ── */

export const SubmittingOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.85);
`;

export const SubmittingText = styled.span`
  font-size: ${fontSize.general};
  font-weight: 500;
  color: ${colors.textSecondary};
`;

export const ProgressBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ProgressTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ProgressStatus = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: ${fontSize.subtitle};
  font-weight: 500;
  color: ${({ $status }) =>
    $status === "done" ? colors.accentGreen : $status === "error" ? colors.accentRed : colors.textSecondary};
`;

export const ProgressPct = styled.span`
  font-size: ${fontSize.subtitle};
  font-weight: 700;
  color: ${({ $done }) => ($done ? colors.accentGreen : colors.accentBlue)};
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 6px;
  background: ${colors.borderLight};
  border-radius: 9999px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  border-radius: 9999px;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $status }) =>
    $status === "error" ? colors.accentRed : $status === "done" ? colors.accentGreen : colors.accentBlue};
  transition: width 0.2s ease;
`;

export const ErrorText = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.accentRed};
`;
