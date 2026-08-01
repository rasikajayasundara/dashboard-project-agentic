import styled from "styled-components";
import { colors, fontSize } from "../../../../constants/common";

export const Dropzone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 28px 16px;
  border-radius: 10px;
  border: 1.5px dashed ${colors.accentBlue};
  background: ${colors.accentBlueLight};
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  ${({ $hasFile }) =>
    $hasFile &&
    `
      flex-direction: row;
      justify-content: flex-start;
      padding: 12px 14px;
      border-style: solid;
      border-color: ${colors.borderLight};
      background: ${colors.bgHover};
      cursor: default;
    `}

  ${({ $dragActive }) => $dragActive && `background: ${colors.accentBlueLight}; filter: brightness(0.97);`}
`;

export const DropzoneIcon = styled.i`
  font-size: 24px;
  color: ${colors.accentBlue};
  flex-shrink: 0;
`;

export const DropzoneText = styled.span`
  font-size: ${fontSize.general};
  font-weight: 600;
  color: ${colors.textPrimary};
`;

export const DropzoneSubtext = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
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

export const BodyStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
