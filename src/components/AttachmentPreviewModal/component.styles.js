import styled from "styled-components";
import { colors, fontSize } from "../../constants/common";

export const PreviewStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const PreviewImageWrap = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid ${colors.borderLight};
  background: ${colors.bgHover};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const PreviewPdfFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

export const PreviewIconTile = styled.div`
  font-size: 44px;
  color: ${colors.textMuted};
`;

export const PreviewMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const PreviewMetaName = styled.span`
  font-size: ${fontSize.general};
  font-weight: 600;
  color: ${colors.textPrimary};
`;

export const PreviewMetaSub = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
`;

export const PreviewActions = styled.div`
  display: flex;
  gap: 10px;
`;

export const GhostBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: 7px;
  border: 1px solid ${colors.borderColor};
  background: ${colors.white};
  font-size: ${fontSize.general};
  font-weight: 600;
  color: ${colors.textPrimary};
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s;

  i { font-size: 14px; }

  &:hover {
    background: ${colors.bgHover};
    text-decoration: none;
  }
`;
