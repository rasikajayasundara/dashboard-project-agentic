import styled from "styled-components";
import { colors, fontSize } from "../../constants/common";
import PanelBase from "../../components/Panel";

/* ── Page shell ─────────────────────────────────────────────────────────── */

export const PageWrapper = styled.div`
  background: ${colors.backgroundGray};
  min-height: 100%;
  padding: 24px 32px 32px;
`;

export const PageHeader = styled.div`
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin: 0 0 4px;
  line-height: 28px;
`;

export const Subtitle = styled.p`
  font-size: ${fontSize.general};
  color: ${colors.textSecondary};
  margin: 0;
`;

export const TabContent = styled.div`
  padding-top: 24px;
`;

/* ── Security panel (side-nav layout) ────────────────────────────────────── */

export const SecurityPanel = styled(PanelBase)`
  display: flex;
  overflow: hidden;
  min-height: 480px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SecuritySidebar = styled.nav`
  width: 220px;
  flex-shrink: 0;
  border-right: 1px solid ${colors.borderLight};
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid ${colors.borderLight};
  }
`;

export const SecurityNavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? colors.accentBlueLight : "transparent")};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  text-align: left;
  transition: background 0.15s;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  &:hover {
    background: ${({ $active, $disabled }) =>
      $disabled ? "transparent" : $active ? colors.accentBlueLight : colors.bgHover};
  }
`;

export const SecurityNavIcon = styled.i`
  font-size: 15px;
  color: ${({ $active }) => ($active ? colors.accentBlue : colors.textMuted)};
  flex-shrink: 0;
`;

export const SecurityNavLabel = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  color: ${({ $active }) => ($active ? colors.accentBlue : colors.textPrimary)};
  line-height: 20px;
`;

export const SecurityPanelContent = styled.div`
  flex: 1;
  padding: 28px 32px;
  overflow-y: auto;
`;

export const CardTitle = styled.h3`
  font-size: ${fontSize.highlight};
  font-weight: 600;
  color: ${colors.textPrimary};
  margin: 0 0 4px;
  line-height: 22px;
`;

export const CardSubtitle = styled.p`
  font-size: ${fontSize.general};
  color: ${colors.textSecondary};
  margin: 0 0 20px;
`;

export const CardDivider = styled.hr`
  border: none;
  border-top: 1px solid ${colors.borderLight};
  margin: 16px 0;
`;

/* ── MFA ─────────────────────────────────────────────────────────────────── */

export const MfaStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: ${fontSize.badge};
  font-weight: 600;
  border-radius: 9999px;
  padding: 3px 10px;
  background: ${({ $enabled }) => ($enabled ? "#DCFCE7" : colors.borderLight)};
  color: ${({ $enabled }) => ($enabled ? "#166534" : colors.textSecondary)};
`;

/* ── Last Login ──────────────────────────────────────────────────────────── */

export const MetaList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const MetaRow = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const MetaIcon = styled.i`
  font-size: 15px;
  color: ${colors.accentBlue};
  width: 20px;
  flex-shrink: 0;
`;

export const MetaText = styled.span`
  font-size: ${fontSize.general};
  color: ${colors.textPrimary};

  span {
    color: ${colors.textSecondary};
    font-size: ${fontSize.subtitle};
    margin-left: 6px;
  }
`;

export const SessionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: ${colors.accentBlueLight};
  color: ${colors.accentBlue};
  font-size: ${fontSize.badge};
  font-weight: 600;
  border-radius: 9999px;
  padding: 2px 8px;
  margin-left: 8px;
`;

/* ── Activity Log ────────────────────────────────────────────────────────── */

export const ActivityList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

export const ActivityItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid ${colors.borderLight};

  &:last-child {
    border-bottom: none;
  }
`;

export const ActivityDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
  margin-top: 6px;
`;

export const ActivityContent = styled.div`
  flex: 1;
`;

export const ActivityAction = styled.p`
  font-size: ${fontSize.general};
  font-weight: 500;
  color: ${colors.textPrimary};
  margin: 0 0 2px;
  line-height: 18px;
`;

export const ActivityMeta = styled.p`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  margin: 0;
  line-height: 16px;
`;

/* ── Notifications ───────────────────────────────────────────────────────── */

export const NotifPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const NotifGroup = styled(PanelBase)`
  overflow: hidden;
`;

export const NotifGroupTitle = styled.div`
  padding: 14px 20px;
  background: ${colors.bgTableHead};
  border-bottom: 1px solid ${colors.borderLight};
  font-size: ${fontSize.subtitle};
  font-weight: 600;
  color: ${colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

export const NotifRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${colors.borderLight};
  transition: background 0.15s;

  &:hover {
    background: ${colors.bgHover};
  }

  &:last-child {
    border-bottom: none;
  }
`;
