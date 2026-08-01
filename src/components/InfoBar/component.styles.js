import styled from "styled-components";
import { colors, fontSize } from "../../constants/common";
import PanelBase from "../Panel";

export const InfoBarWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
`;

export const InfoChip = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${colors.white};
  border: 1px solid ${colors.borderLight};
  border-radius: 6px;
  padding: 4px 10px;
  font-size: ${fontSize.general};
  color: ${colors.textSecondary};
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s, border-color 0.15s;
  cursor: ${({ href }) => (href ? "pointer" : "default")};

  i {
    font-size: 12px;
    color: ${colors.textMuted};
    flex-shrink: 0;
  }

  &:hover {
    background: ${({ href }) => (href ? colors.bgHover : colors.white)};
    border-color: ${({ href }) => (href ? colors.accentBlue : colors.borderLight)};
    color: ${({ href }) => (href ? colors.accentBlue : colors.textSecondary)};
    text-decoration: none;

    i {
      color: ${({ href }) => (href ? colors.accentBlue : colors.textMuted)};
    }
  }
`;

export const InfoBarEnd = styled.div`
  margin-left: auto;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const InfoBarBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: ${colors.white};
  border: 1px solid ${colors.borderLight};
  border-radius: 6px;
  padding: 4px 10px;
  font-size: ${fontSize.general};
  color: ${colors.textSecondary};
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, border-color 0.15s;

  i { font-size: 12px; color: ${colors.textMuted}; }

  &:hover {
    background: ${colors.bgHover};
    border-color: #d1d5db;
  }

  &::after { display: none; }
`;

/* ── Profile variant (employee / client detail header) ───────────────────── */

export const ProfileHeader = styled(PanelBase)`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 24px;
  margin-bottom: 20px;
`;

export const ProfileAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 9999px;
  background: ${colors.bgHover};
  border: 2px solid ${colors.borderLight};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 22px;
  font-weight: 700;
  color: ${colors.textMuted};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ProfileMain = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ProfileNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 2px;
`;

export const ProfileName = styled.span`
  font-size: 17px;
  font-weight: 700;
  color: ${colors.textPrimary};
  line-height: 24px;
`;

export const ProfileStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: ${fontSize.badge};
  font-weight: 600;
  border-radius: 9999px;
  padding: 2px 8px;
  background: ${({ $active }) => ($active ? "#DCFCE7" : colors.borderLight)};
  color: ${({ $active }) => ($active ? "#166534" : colors.textSecondary)};

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 9999px;
    background: ${({ $active }) => ($active ? colors.accentGreen : colors.textMuted)};
  }
`;

export const ProfileSubtitle = styled.div`
  font-size: ${fontSize.subtitle};
  color: ${colors.textSecondary};
  margin-bottom: 6px;
`;

export const ProfileDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;
`;

export const ProfileDetailItem = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  display: inline-flex;
  align-items: center;
  gap: 5px;

  i { font-size: 11px; }

  a {
    color: ${colors.accentBlue};
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`;

export const ProfileRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
`;

export const ProfileRightItem = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textSecondary};
  display: inline-flex;
  align-items: center;
  gap: 6px;

  i { font-size: 11px; color: ${colors.textMuted}; }
`;

export const ProfileActions = styled.div`
  margin-left: 8px;
  flex-shrink: 0;
  align-self: flex-start;
`;
