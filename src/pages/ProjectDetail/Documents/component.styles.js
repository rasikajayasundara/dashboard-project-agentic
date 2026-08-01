import styled from "styled-components";
import { colors, fontSize } from "../../../constants/common";
import { colorOpacity } from "../../../utils/common";
import PanelBase from "../../../components/Panel";

export const Wrapper = styled(PanelBase)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

/* ── Tab header ───────────────────────────────────────────────────────────── */

export const TabHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${colors.borderLight};
`;

export const TabTitle = styled.span`
  display: block;
  font-size: ${fontSize.header};
  font-weight: 600;
  color: ${colors.textPrimary};
`;

export const TabHint = styled.span`
  display: block;
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  margin-top: 2px;
`;

export const UploadDocBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border: none;
  border-radius: 8px;
  background: ${colors.sidebarBg};
  color: ${colors.white};
  font-size: ${fontSize.general};
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: filter 0.15s;

  &:hover {
    filter: brightness(1.15);
  }
`;

/* ── Categorized grid ─────────────────────────────────────────────────────── */

export const GridSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SectionLabel = styled.h3`
  margin: 0;
  font-size: ${fontSize.header};
  font-weight: 600;
  color: ${colors.textSecondary};
`;

export const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const FileCard = styled.div`
  position: relative;
  width: 248px;
  height: 84px;
  display: flex;
  align-items: stretch;
  border: 1px solid ${colors.borderLight};
  border-radius: 12px;
  background: ${colors.white};
  overflow: hidden;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  transition: box-shadow 0.15s, border-color 0.15s;

  &:hover {
    border-color: ${colors.accentBlue};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
`;

export const RemoveBtn = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: ${colorOpacity(colors.accentRed, 0.12)};
  color: ${colors.accentRed};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${colors.accentRed};
    color: ${colors.white};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Thumbnail = styled.img`
  width: 76px;
  height: 100%;
  border-radius: 12px 0 0 12px;
  object-fit: cover;
  flex-shrink: 0;
`;

export const IconTile = styled.div`
  width: 76px;
  height: 100%;
  border-radius: 12px 0 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 26px;
  background: ${({ $type }) =>
    $type === "pdf"
      ? colorOpacity(colors.accentRed, 0.1)
      : $type === "word"
      ? colors.accentBlueLight
      : colors.backgroundGray};
  color: ${({ $type }) =>
    $type === "pdf" ? colors.accentRed : $type === "word" ? colors.accentBlue : colors.textMuted};
`;

export const CardDetails = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  padding: 8px 12px;
`;

export const CardName = styled.span`
  width: 100%;
  line-height: 1.3;
  font-size: ${fontSize.general};
  font-weight: 500;
  color: ${colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardMeta = styled.span`
  width: 100%;
  line-height: 1.3;
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardDownload = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  line-height: 1.3;
  font-size: ${fontSize.general};
  font-weight: 500;
  color: ${colors.accentBlue};
  text-decoration: none;

  i { font-size: 11px; }

  &:hover {
    text-decoration: underline;
  }
`;

export const CardDownloadDisabled = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  line-height: 1.3;
  font-size: ${fontSize.general};
  color: ${colors.textMuted};
  opacity: 0.6;

  i { font-size: 11px; }
`;
