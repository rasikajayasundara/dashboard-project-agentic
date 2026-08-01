import styled from "styled-components";
import { colors, fontSize } from "../../../constants/common";

/* ── System User Roles — split layout ──────────────────────────────────────── */

export const RolesSplit = styled.div`
  display: flex;
  height: calc(100vh - 260px);
  min-height: 480px;
  margin: -28px -32px;

  @media (max-width: 768px) {
    flex-direction: column;
    /* At this breakpoint RolesSplit's ancestor SecurityPanel (component.styles.js,
       out of scope here) also switches to flex-direction: column, so
       SecuritySidebar (the "System User Roles" / "Org Job Titles" nav, ~112px)
       stacks above RolesSplit instead of sitting beside it. The offset below
       accounts for that stacked sidebar height on top of the header/page-title/
       tab-bar chrome, so RolesSplit + the sidebar together still fit the
       viewport without forcing the outer page to scroll. It must stay a
       *definite* height (not height:auto + max-height) or the flex children's
       default min-height:auto keeps them from shrinking, and their own
       overflow-y:auto never engages. */
    height: calc(100vh - 380px);
  }
`;

export const UserListPane = styled.nav`
  width: 280px;
  flex-shrink: 0;
  border-right: 1px solid ${colors.borderLight};
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    max-height: 260px;
    border-right: none;
    border-bottom: 1px solid ${colors.borderLight};
  }
`;

export const UserListSearch = styled.div`
  padding: 12px;
  border-bottom: 1px solid ${colors.borderLight};
`;

export const UserListScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const UserRow = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? colors.accentBlueLight : "transparent")};
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;

  &:hover {
    background: ${({ $active }) => ($active ? colors.accentBlueLight : colors.bgHover)};
  }

  /* Rows with 2 children (avatar + text, e.g. SystemUserRoles) always fit on one
     line since UserRowText has min-width:0 and shrinks via its own ellipsis —
     flex-wrap only engages when content genuinely can't fit (e.g. the 3-child
     avatar + text + role-select row in OrganisationJobRoles), so this is safe
     to apply here for both consumers. */
  @media (max-width: 480px) {
    flex-wrap: wrap;
  }
`;

export const UserAvatar = styled.span`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  background: ${({ $bg }) => $bg};
  border: 1px solid ${({ $border }) => $border};
  color: ${({ $textColor }) => $textColor};
`;

export const UserRowText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;

  @media (max-width: 480px) {
    flex: 1 1 140px;
  }
`;

export const UserRowName = styled.span`
  font-size: ${fontSize.highlight};
  font-weight: ${({ $active }) => ($active ? "600" : "500")};
  color: ${({ $active }) => ($active ? colors.accentBlue : colors.textPrimary)};
  line-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UserRowSubtext = styled.span`
  font-size: ${fontSize.subtitle};
  color: ${colors.textMuted};
  line-height: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const PermissionPane = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
`;

export const PermissionPaneHeader = styled.div`
  padding: 20px 28px;
  border-bottom: 1px solid ${colors.borderLight};
`;

export const PermissionPaneName = styled.h3`
  font-size: ${fontSize.header};
  font-weight: 600;
  color: ${colors.textPrimary};
  margin: 0 0 2px;
  line-height: 22px;
`;

export const PermissionPaneRole = styled.p`
  font-size: ${fontSize.subtitle};
  color: ${colors.textSecondary};
  margin: 0;
`;

export const PermissionPaneScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 20px 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

/* ── Permission groups ────────────────────────────────────────────────────── */

export const PermissionGroup = styled.div``;

export const PermissionGroupTitle = styled.div`
  font-size: ${fontSize.subtitle};
  font-weight: 600;
  color: ${colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 12px;
`;

export const PermissionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const PermissionChip = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ $checked }) => ($checked ? colors.accentBlue : colors.borderLight)};
  background: ${({ $checked }) => ($checked ? colors.accentBlueLight : colors.white)};
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    border-color: ${colors.accentBlue};
  }
`;

export const PermissionCheckbox = styled.input.attrs({ type: "checkbox" })`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  accent-color: ${colors.accentBlue};
  cursor: pointer;
`;

export const PermissionLabel = styled.span`
  font-size: ${fontSize.general};
  font-weight: ${({ $checked }) => ($checked ? "600" : "400")};
  color: ${({ $checked }) => ($checked ? colors.accentBlue : colors.textPrimary)};
  line-height: 18px;
`;

/* ── Save bar ─────────────────────────────────────────────────────────────── */

export const SaveBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding: 16px 28px;
  border-top: 1px solid ${colors.borderLight};
  flex-shrink: 0;
`;

/* ── Org Job Titles ───────────────────────────────────────────────────────── */

export const JobTitleRoleSelectWrap = styled.div`
  margin-left: auto;
  flex-shrink: 0;
  width: 160px;
  max-width: 160px;

  /* At ≤480px the row wraps (see UserRow), so this drops to its own full-width
     second line — plenty of room for the trigger's selected-option text
     (e.g. "Project Manager") instead of being squeezed beside the title. */
  @media (max-width: 480px) {
    margin-left: 42px; /* aligns under the title, past the 32px avatar + 10px gap */
    width: calc(100% - 42px);
    max-width: none;
  }
`;
