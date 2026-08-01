import styled from "styled-components";
import { colors, fontSize } from "../../../constants/common";

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

// ── Attachments section ──────────────────────────────────────────────────────

export const AttachmentsSection = styled.div`
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid ${colors.borderLight};
`;

export const AttachmentsHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 10px;
`;

export const AttachmentsTitle = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textPrimary};
`;

export const AttachmentsHint = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
`;

export const AttachmentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const AttachmentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid ${colors.borderLight};
  border-radius: 8px;
  background: #fafbfc;
`;

export const FileIcon = styled.i`
  font-size: 16px;
  color: ${({ $error }) => ($error ? "#EF4444" : "#3796BF")};
  flex-shrink: 0;
`;

export const FileMeta = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const FileNameText = styled.span`
  font-size: ${fontSize.general};
  color: ${colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const FileSize = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  flex-shrink: 0;
`;

export const UploadTrack = styled.div`
  width: 100%;
  height: 5px;
  background: ${colors.borderLight};
  border-radius: 9999px;
  overflow: hidden;
`;

export const UploadFill = styled.div`
  height: 100%;
  border-radius: 9999px;
  width: ${({ $pct }) => $pct}%;
  background: #3796BF;
  transition: width 0.2s ease;
`;

export const UploadPct = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: #3796BF;
  min-width: 34px;
  text-align: right;
  flex-shrink: 0;
`;

export const UploadedCheck = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: ${fontSize.highlight};
  font-weight: 500;
  color: #16a34a;
  flex-shrink: 0;
  white-space: nowrap;
`;

export const UploadError = styled.span`
  font-size: ${fontSize.subtitle};
  color: #EF4444;
`;

export const RowIconBtn = styled.button`
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: ${({ $danger }) => ($danger ? "#EF4444" : colors.textSecondary)};
  font-size: 14px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: background 0.15s;

  &:hover {
    background: ${colors.borderLight};
  }
`;

export const NewAttachmentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

export const AttachBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1.5px dashed #3796BF;
  border-radius: 8px;
  background: transparent;
  color: #3796BF;
  font-size: ${fontSize.general};
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.15s;

  &:hover {
    background: rgba(55, 150, 191, 0.06);
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  padding: 9px 0;
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${fontSize.general};
  color: #374151;
  cursor: pointer;
`;
