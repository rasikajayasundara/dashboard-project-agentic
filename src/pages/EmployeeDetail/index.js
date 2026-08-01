import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../constants/common";
import Layout from "../../components/Layout";
import StatCard from "../../components/Statcard";
import { StatsGrid } from "../../components/Statcard/component.styles";
import { TabBarContainer, TabButton } from "../../components/TabBar";
import EmployeeHeader from "./EmployeeHeader";
import AssignedProjects from "./Projects";
import EmployeeTasks from "./Tasks";
import EmployeeTimesheets from "./Timesheets";
import EmployeePerformance from "./Performance";
import EmployeeNotifications from "./Notifications";
import { employeesAction } from "../../store/employeesSlice";
import { toDisplayDate } from "../../utils/dateMaker";
import { PageWrapper, TabContent } from "./component.styles";

const BASE_TABS = ["projects", "tasks", "timesheets", "performance"];

const TAB_ICONS = {
  projects: "bi-folder",
  tasks: "bi-check2-square",
  timesheets: "bi-clock-history",
  performance: "bi-bar-chart-line",
  notifications: "bi-bell",
};

export default function EmployeeDetail({ defaultTab, myProfile = false }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { employeeDetail } = useSelector((s) => s.employees);
  const [selectedTab, setSelectedTab] = useState(defaultTab ?? "projects");

  useEffect(() => {
    if (defaultTab) setSelectedTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    if (myProfile) dispatch(employeesAction.getMyProfileStart());
    else if (id) dispatch(employeesAction.getEmployeeDetailStart(id));
  }, [myProfile, id, dispatch]);

  const TABS = myProfile ? [...BASE_TABS, "notifications"] : BASE_TABS;

  const { empInfo, stat } = employeeDetail;

  const emp = {
    id:             empInfo.employeeId,
    firstName:      empInfo.firstName,
    lastName:       empInfo.lastName,
    status:         empInfo.status,
    role:           empInfo.jobTitle,
    manager:        empInfo.manager,
    location:       empInfo.office,
    locationId:     empInfo.locationId,
    startDate:      toDisplayDate(empInfo.createdAt),
    email:          empInfo.email,
    phone:          empInfo.phone,
    billable:       empInfo.billable,
    billableRate:   empInfo.billableRate,
    deliveryRate:   stat.deliveryRate,
    billableRatio:  stat.billableUtilization,
  };

  const statCards = useMemo(() => [
    { label: "Active Projects", value: String(stat.activeProjectsCount ?? "—"),  icon: "bi-folder",        color: colors.accentBlue  },
    { label: "Open Tasks",      value: String(stat.activeTasksCount ?? "—"),     icon: "bi-check2-square", color: colors.accentAmber },
    { label: "Hours This Week", value: stat.hoursRecordedThisWeek != null ? `${stat.hoursRecordedThisWeek}h` : "—", icon: "bi-clock", color: colors.accentGreen },
    { label: "Billable Rate",   value: stat.billableUtilization != null ? `${stat.billableUtilization}%` : "—", icon: "bi-graph-up", color: colors.accentRed },
  ], [stat]);

  const renderTabContent = () => {
    switch (selectedTab) {
      case "projects":    return <AssignedProjects myProfile={myProfile} />;
      case "tasks":       return <EmployeeTasks myProfile={myProfile} />;
      case "timesheets":  return <EmployeeTimesheets myProfile={myProfile} />;
      case "performance": return <EmployeePerformance />;
      case "notifications": return <EmployeeNotifications />;
      default:            return null;
    }
  };

  return (
    <Layout>
      <PageWrapper>
        {/* Employee profile card */}
        <EmployeeHeader employee={emp} isOwnProfile={myProfile} />

        {/* Stat cards */}
        <StatsGrid>
          {statCards.map((card, i) => (
            <StatCard
              key={card.label}
              label={card.label}
              value={card.value}
              icon={<i className={`bi ${card.icon}`} />}
              iconColor={card.color}
              index={i}
            />
          ))}
        </StatsGrid>

        {/* Tab nav */}
        <TabBarContainer style={{ marginTop: 24 }}>
          {TABS.map((tab) => (
            <TabButton key={tab} $active={selectedTab === tab} onClick={() => setSelectedTab(tab)}>
              <i className={`bi ${TAB_ICONS[tab]}`} />
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabButton>
          ))}
        </TabBarContainer>

        {/* Tab content */}
        <TabContent>{renderTabContent()}</TabContent>

      </PageWrapper>
    </Layout>
  );
}
