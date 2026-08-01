import { useState } from "react";
import Layout from "../../components/Layout";
import PermissionGate from "../../components/PermissionGate";
import { TabBarContainer, TabButton } from "../../components/TabBar";
import ChangePassword from "./security/ChangePassword";
import MfaPanel from "./security/MfaPanel";
import LastLoginPanel from "./security/LastLoginPanel";
import ActivityLogPanel from "./security/ActivityLogPanel";
import NotificationsPanel from "./notifications/NotificationsPanel";
import SystemUserRoles from "./roles/SystemUserRoles";
import OrganisationJobRoles from "./roles/OrganisationJobRoles";
import {
  PageWrapper, PageHeader, Title, Subtitle, TabContent,
  SecurityPanel, SecuritySidebar, SecurityNavItem,
  SecurityNavIcon, SecurityNavLabel, SecurityPanelContent,
} from "./component.styles";

// mfa/lastLogin/activity still run on mock data (see their TODOs) — disabled
// until wired to a real endpoint, rather than letting users interact with
// fake toggles/history.
const SECURITY_ITEMS = [
  { key: "password",  label: "Change Password", icon: "bi-key"           },
  { key: "mfa",       label: "MFA",             icon: "bi-shield-lock",   disabled: true },
  { key: "lastLogin", label: "Last Login",       icon: "bi-clock-history", disabled: true },
  { key: "activity",  label: "Activity Log",     icon: "bi-list-ul",       disabled: true },
];

const SECURITY_PANELS = {
  password:  <ChangePassword />,
  mfa:       <MfaPanel />,
  lastLogin: <LastLoginPanel />,
  activity:  <ActivityLogPanel />,
};

const ROLES_ITEMS = [
  { key: "systemUsers", label: "System User Roles",     icon: "bi-person-badge" },
  { key: "jobRoles",    label: "Org Job Titles",         icon: "bi-diagram-3"    },
];

const ROLES_PANELS = {
  systemUsers: <SystemUserRoles />,
  jobRoles:    <OrganisationJobRoles />,
};

export default function Settings() {
  const [activeTab,    setActiveTab]    = useState("security");
  const [securityView, setSecurityView] = useState("password");
  const [rolesView,    setRolesView]    = useState("systemUsers");

  return (
    <Layout>
      <PageWrapper>
        <PageHeader>
          <Title>Settings</Title>
          <Subtitle>Manage your account security and notification preferences</Subtitle>
        </PageHeader>

        <TabBarContainer>
          <TabButton $active={activeTab === "security"} onClick={() => setActiveTab("security")}>
            <i className="bi bi-shield-lock" /> Security
          </TabButton>
          <TabButton
            $active={activeTab === "notifications"}
            disabled
            title="Coming soon"
          >
            <i className="bi bi-bell" /> Notifications
          </TabButton>
          <PermissionGate can="canConfigManage">
            <TabButton $active={activeTab === "roles"} onClick={() => setActiveTab("roles")}>
              <i className="bi bi-person-gear" /> Roles & Permissions
            </TabButton>
          </PermissionGate>
        </TabBarContainer>

        <TabContent>
          {activeTab === "security" && (
            <SecurityPanel>
              <SecuritySidebar>
                {SECURITY_ITEMS.map((item) => (
                  <SecurityNavItem
                    key={item.key}
                    $active={securityView === item.key}
                    $disabled={item.disabled}
                    title={item.disabled ? "Coming soon" : undefined}
                    onClick={item.disabled ? undefined : () => setSecurityView(item.key)}
                  >
                    <SecurityNavIcon className={`bi ${item.icon}`} $active={securityView === item.key} />
                    <SecurityNavLabel $active={securityView === item.key}>{item.label}</SecurityNavLabel>
                  </SecurityNavItem>
                ))}
              </SecuritySidebar>

              <SecurityPanelContent>
                {SECURITY_PANELS[securityView]}
              </SecurityPanelContent>
            </SecurityPanel>
          )}

          {activeTab === "notifications" && <NotificationsPanel />}

          {activeTab === "roles" && (
            <SecurityPanel>
              <SecuritySidebar>
                {ROLES_ITEMS.map((item) => (
                  <SecurityNavItem
                    key={item.key}
                    $active={rolesView === item.key}
                    onClick={() => setRolesView(item.key)}
                  >
                    <SecurityNavIcon className={`bi ${item.icon}`} $active={rolesView === item.key} />
                    <SecurityNavLabel $active={rolesView === item.key}>{item.label}</SecurityNavLabel>
                  </SecurityNavItem>
                ))}
              </SecuritySidebar>

              <SecurityPanelContent>
                {ROLES_PANELS[rolesView]}
              </SecurityPanelContent>
            </SecurityPanel>
          )}
        </TabContent>
      </PageWrapper>
    </Layout>
  );
}
