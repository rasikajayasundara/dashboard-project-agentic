import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { colors } from "../../constants/common";
import AddProject from "./modals/AddProject";
import styled from "styled-components";
import FullPageLoader from "../../components/FullPageLoader";
import PermissionGate from "../../components/PermissionGate";
import { projectAction } from "../../store/projectSlice";
import ButtonStyled from "../../components/ButtonStyled";
import Layout from "../../components/Layout";
import StatCard from "../../components/Statcard";
import { StatsGrid } from "../../components/Statcard/component.styles";
import DataTable from "../../components/DataTable";
import FilterBar from "../../components/FilterBar";
import { toDisplayDate, toISODateOnly } from "../../utils/dateMaker";
import { exportToCsv } from "../../utils/exportCsv";
import {
  PageWrapper, PageHeader, TitleRow, Title, TitleBadge,
  Subtitle, HeaderActions, EmptyStatCard,
  FooterBudget, FooterBudgetLabel, FooterBudgetValue,
} from "./component.styles";

const LoadingWrapper = styled.div`
  display: flex; justify-content: center; align-items: center; height: 60vh;
`;

// Case-insensitive, trimmed, either-contains-the-other match
// (handles "Hamilton" vs "Hamilton (Head Office)" and exact matches like
// "Wellington Office" vs "Wellington Office")
const locationMatches = (projectLocation, officeLocationName) => {
  const a = String(projectLocation || "").trim().toLowerCase();
  const b = String(officeLocationName || "").trim().toLowerCase();
  if (!a || !b) return false;
  return a.includes(b) || b.includes(a);
};

// True when the project's startDate falls within the selected [from, to]
// range — either side of the range may be open-ended.
const projectInDateRange = (project, range) => {
  if (!range || (!range.from && !range.to)) return true;
  const start = toISODateOnly(project.startDate);
  if (!start) return false;
  if (range.from && start < range.from) return false;
  if (range.to   && start > range.to)   return false;
  return true;
};

const formatCurrency = (amount) => {
  const n = Number(amount) || 0;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${n.toLocaleString()}`;
};

const formatCurrencyFull = (amount) =>
  `$${(Number(amount) || 0).toLocaleString()}`;

const COLUMNS = [
  { key: "id",         label: "Project ID",       sortable: true,  index: 0 },
  { key: "name",       label: "Project Name",      sortable: true,  index: 1 },
  { key: "client",     label: "Client",            sortable: true,  index: 2 },
  { key: "pm",         label: "Project Manager",   sortable: true,  index: 3 },
  { key: "budget",     label: "Budget",            sortable: true,  index: 4 },
  { key: "duration",   label: "Duration",          sortable: false, index: 5 },
  { key: "riskStatus", label: "Risk Status",       sortable: true,  index: 6 },
];

const getProjectStatusText = (p) => {
  const raw =
    p?.status_text ??
    p?.status_label ??
    p?.project_status_text ??
    p?.project_status ??
    p?.status ??
    "";
  if (typeof raw === "number") {
    switch (raw) {
      case 1: return "Active";
      case 2: return "Completed";
      case 3: return "Archived";
      case 4: return "On Hold";
      default: return String(raw);
    }
  }
  return String(raw || "").trim();
};

// riskStatus comes straight from the API ("At Risk" | "Overdue" | null),
// but the API doesn't account for completed projects, so override to "No Risk" here.
const getRiskLabel = (project) =>
  getProjectStatusText(project) === "Completed" ? "No Risk" : (project.riskStatus || "On Track");

const RISK_TOOLTIPS = {
  "On Track": {
    title: "On Track",
    description: "Project is progressing normally — more than 10% of the budget remains and the end date hasn't passed.",
  },
  "At Risk": {
    title: "At Risk",
    description: "10% or less of the allocated budget remains, but the project is still within its end date.",
  },
  "Overdue": {
    title: "Overdue",
    description: "The project's end date has passed while it's still Ongoing or On Hold.",
  },
  "No Risk": {
    title: "No Risk",
    description: "Project is completed — risk tracking no longer applies.",
  },
};

// Converts one live API project object into the { rowId, atRisk, location, row: [...] }
// shape DataTable expects.
const mapProjectToRow = (project) => {
  const totalBudget = Number(project.totalBudget) || 0;
  const totalBurnt  = Number(project.totalBurnt) || 0;
  const budgetPct   = totalBudget > 0 ? Math.round((totalBurnt / totalBudget) * 100) : 0;

  return {
    rowId: project.projectId,
    atRisk: !!project.riskStatus && getProjectStatusText(project) !== "Completed",
    location: project.location,
    row: [
      { value: project.projectNo, type: "projectNo", meta: { statusChip: getProjectStatusText(project) === "Completed" ? "Completed" : "Ongoing" } },
      { value: project.projectName, type: "projectName", meta: { progress: budgetPct, progressHeight: 5 } },
      { value: project.clientName, type: "text" },
      { value: project.projectManagerName, type: "pm" },
      { value: formatCurrencyFull(totalBudget), type: "text" },
      { value: project.startDate ? toDisplayDate(project.startDate) : null, type: "stacked", subLabel: project.endDate ? toDisplayDate(project.endDate) : null },
      { value: getRiskLabel(project), type: "status", meta: { tooltip: RISK_TOOLTIPS[getRiskLabel(project)] } },
    ],
  };
};

const PROJECT_EXPORT_COLUMNS = [
  { label: "Project ID",      accessor: (p) => p.projectNo },
  { label: "Project Name",    accessor: (p) => p.projectName },
  { label: "Client",          accessor: (p) => p.clientName },
  { label: "Project Manager", accessor: (p) => p.projectManagerName },
  { label: "Budget",          accessor: (p) => formatCurrencyFull(Number(p.totalBudget) || 0) },
  { label: "Start Date",      accessor: (p) => (p.startDate ? toDisplayDate(p.startDate) : "") },
  { label: "End Date",        accessor: (p) => (p.endDate ? toDisplayDate(p.endDate) : "") },
  { label: "Status",          accessor: (p) => getProjectStatusText(p) },
  { label: "Risk Status",     accessor: (p) => getRiskLabel(p) },
];

const ProjectList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticating } = useSelector((state) => state.login);
  const { projects, isLoading, stats } = useSelector((state) => state?.project) || {};
  const { officeLocations } = useSelector((state) => state?.metadata) || {};

  const [showModal, setShowModal]         = useState(false);
  const [search, setSearch]               = useState("");
  const [activeFilters, setActiveFilters] = useState({});

  const todayLabel = useMemo(() => toDisplayDate(new Date()), []);

  const handleFilterChange = (key, value) =>
    setActiveFilters((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    dispatch(projectAction.projectListStart());
  }, [dispatch]);

  const locationOptions = useMemo(
    () => (officeLocations || []).map((loc) => loc.officeLocation),
    [officeLocations]
  );

  const { managerOptions, clientOptions, riskStatusOptions } = useMemo(() => {
    const managersSet    = new Set();
    const clientsSet     = new Set();
    const riskStatusSet  = new Set();

    projects.forEach((p) => {
      if (p.projectManagerName) managersSet.add(p.projectManagerName);
      const clientName = (p?.clientName || "").trim();
      if (clientName) clientsSet.add(clientName);
      riskStatusSet.add(getRiskLabel(p));
    });

    const toSortedArray = (set) => Array.from(set).sort((a, b) => a.localeCompare(b));
    return {
      managerOptions:    toSortedArray(managersSet),
      clientOptions:     toSortedArray(clientsSet),
      riskStatusOptions: toSortedArray(riskStatusSet),
    };
  }, [projects]);

  const PROJECT_FILTERS = useMemo(() => [
    {
      key: "location",
      label: "Location",
      icon: "bi-geo-alt",
      options: locationOptions.map((l) => ({ value: l, label: l })),
    },
    {
      key: "pm",
      label: "Project Manager",
      icon: "bi-person",
      options: managerOptions.map((m) => ({ value: m, label: m })),
    },
    {
      key: "client",
      label: "Client",
      icon: "bi-building",
      options: clientOptions.map((c) => ({ value: c, label: c })),
    },
    {
      key: "riskStatus",
      label: "Risk Status",
      options: riskStatusOptions.map((s) => ({ value: s, label: s })),
    },
    {
      key: "dateRange",
      label: "Date Range",
      icon: "bi-calendar-range",
      type: "dateRange",
    },
  ], [locationOptions, managerOptions, clientOptions, riskStatusOptions]);

  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      if (activeFilters.location && !locationMatches(p.location, activeFilters.location)) return false;
      if (activeFilters.pm     && p.projectManagerName !== activeFilters.pm)     return false;
      if (activeFilters.client && p.clientName !== activeFilters.client)         return false;
      if (activeFilters.riskStatus && getRiskLabel(p) !== activeFilters.riskStatus) return false;
      if (!projectInDateRange(p, activeFilters.dateRange)) return false;
      if (!q) return true;
      return mapProjectToRow(p).row.some((cell) => String(cell.value).toLowerCase().includes(q));
    });
  }, [projects, search, activeFilters]);

  const filteredTableData = useMemo(
    () => filteredProjects.map(mapProjectToRow),
    [filteredProjects]
  );

  const totalBudget = useMemo(() => {
    const sum = filteredProjects.reduce((acc, p) => acc + (Number(p.totalBudget) || 0), 0);
    return formatCurrency(sum);
  }, [filteredProjects]);

  const projectDetail = (projectId) => navigate(`/project/${projectId}`);

  if (isAuthenticating) return <FullPageLoader />;

  return (
    <Layout>
      <PageWrapper>
        <PageHeader>
          <TitleRow>
            <Title>
              Projects
              <TitleBadge>{projects.length}</TitleBadge>
            </Title>
            <Subtitle>Track progress, deadlines and team allocation across your portfolio</Subtitle>
          </TitleRow>
          <HeaderActions>
            <ButtonStyled
              variant="secondary"
              onClick={() => exportToCsv("projects.csv", PROJECT_EXPORT_COLUMNS, filteredProjects)}
            >
              <i className="bi bi-download me-1" />
              Export CSV
            </ButtonStyled>
            <PermissionGate can="canProjectAdd">
              <ButtonStyled onClick={() => setShowModal(true)}>
                <i className="bi bi-plus-circle me-1" />
                Add Project
              </ButtonStyled>
            </PermissionGate>
          </HeaderActions>
        </PageHeader>

        <StatsGrid>
          <StatCard
            index={0}
            label="Active"
            value={String(stats?.active ?? 0)}
            icon={<i className="bi bi-folder-check" />}
            iconColor={colors.accentBlue}
            footer={`As at ${todayLabel}`}
          />
          <StatCard
            index={1}
            label="Overdue"
            value={String(stats?.overdue ?? 0)}
            icon={<i className="bi bi-clock-history" />}
            iconColor={colors.accentRed}
            footer={`As at ${todayLabel}`}
          />
          <StatCard
            index={2}
            label="At Risk"
            value={String(stats?.atRisk ?? 0)}
            icon={<i className="bi bi-exclamation-triangle" />}
            iconColor={colors.accentAmber}
            footer={`As at ${todayLabel}`}
          />
          <EmptyStatCard />
        </StatsGrid>

        {isLoading ? (
          <LoadingWrapper>
            <div className="spinner-border text-secondary" role="status" />
          </LoadingWrapper>
        ) : (
          <DataTable
            columns={COLUMNS}
            data={filteredTableData}
            onClickRow={(rowId) => projectDetail(rowId)}
            hideActionCol
            footerSlot={
              <FooterBudget>
                <FooterBudgetLabel>Total Budget</FooterBudgetLabel>
                <FooterBudgetValue>{totalBudget}</FooterBudgetValue>
              </FooterBudget>
            }
            filterBarSlot={
              <FilterBar
                filters={PROJECT_FILTERS}
                searchPlaceholder="Search projects..."
                searchValue={search}
                onSearchChange={setSearch}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
              />
            }
          />
        )}

        {showModal && (
          <PermissionGate can="canProjectAdd">
            <AddProject onClose={() => setShowModal(false)} />
          </PermissionGate>
        )}
      </PageWrapper>
    </Layout>
  );
};

export default ProjectList;
