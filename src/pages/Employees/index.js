import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../constants/common";
import { exportToCsv } from "../../utils/exportCsv";
import Layout from "../../components/Layout";
import ButtonStyled from "../../components/ButtonStyled";
import StatCard from "../../components/Statcard";
import { StatsGrid } from "../../components/Statcard/component.styles";
import DataTable from "../../components/DataTable";
import FilterBar from "../../components/FilterBar";
import { TabBarContainer, TabButton, TabBadge } from "../../components/TabBar";
import AddEmployee from "./modals/AddEmployee";
import { employeesAction } from "../../store/employeesSlice";
import { SNACKBAR_TYPES, snackbarAction } from "../../store/snackbarSlice";
import {
  PageWrapper,
  PageHeader,
  TitleRow,
  Title,
  TitleBadge,
  Subtitle,
  HeaderActions,
} from "./component.styles";

// ── Column definitions ───────────────────────────────────────────────────────
const EMPLOYEE_COLUMNS = [
  { key: "employee", label: "Employee", sortable: true, index: 0 },
  { key: "role", label: "Role / Department", sortable: true, index: 1 },
  { key: "manager", label: "Manager", sortable: true, index: 2 },
  { key: "status", label: "Status", sortable: true, index: 3 },
  { key: "billableRate", label: "Billable Rate", sortable: true, index: 4 },
];

// ── API → table-row mapper ───────────────────────────────────────────────────
function toTableData(employees) {
  return (employees || []).map((e) => ({
    rowId: e.employeeId,
    row: [
      { value: `${e.firstName} ${e.lastName}`, type: "avatar", subLabel: `EMP-${e.employeeId}` },
      { value: e.jobTitle, type: "stacked", subLabel: e.department },
      { value: e.manager ?? "—", type: "text" },
      { value: e.status, type: "badge" },
      { value: e.billableUtilization, type: "billable" },
    ],
  }));
}

// ── Cell accessors (rows are pre-shaped as { rowId, row: [...] }) ───────────
const getName   = (r) => r.row[0].value;
const getEmpId  = (r) => r.row[0].subLabel || "";
const getDept   = (r) => r.row[1].subLabel || "";
const getStatus = (r) => r.row[3].value;

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "resigned", label: "Resigned" },
  { key: "blocked", label: "Blocked" },
];

const matchesTab = (record, tab) => {
  const status = getStatus(record);
  switch (tab) {
    case "active":
      return status === "Active";
    case "pending":
      return status === "Pending";
    case "resigned":
      return status === "Resigned";
    case "blocked":
      return status === "Blocked";
    case "all":
    default:
      return true;
  }
};

const getTabCount = (records, tab) => records.filter((r) => matchesTab(r, tab)).length;

// ── Filter config ─────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "Pending", label: "Pending" },
  { value: "Resigned", label: "Resigned" },
  { value: "Blocked", label: "Blocked" },
];

// ── CSV export column spec ───────────────────────────────────────────────────
const EXPORT_COLUMNS = [
  { label: "Employee", accessor: (r) => getName(r) },
  { label: "Employee ID", accessor: (r) => getEmpId(r) },
  { label: "Job Title", accessor: (r) => r.row[1].value },
  { label: "Department", accessor: (r) => getDept(r) },
  { label: "Manager", accessor: (r) => r.row[2].value },
  { label: "Status", accessor: (r) => getStatus(r) },
  { label: "Billable Rate %", accessor: (r) => r.row[4].value },
];

// ── Stat cards ────────────────────────────────────────────────────────────────
function buildStatCards(employeeList, employeeStats) {
  return [
    { label: "Total Employees", value: String(employeeList.length), icon: "bi-people-fill", color: colors.accentBlue },
    { label: "Active", value: String(employeeStats.activeEmployeesToday ?? "—"), icon: "bi-check-circle", color: colors.accentGreen },
    { label: "Upcoming Leaves", value: String(employeeStats.upcomingLeaves ?? "—"), icon: "bi-calendar", color: colors.accentAmber },
    { label: "Avg. Utilization", value: `${employeeStats.avgUtilization ?? "—"}%`, icon: "bi-graph-up", color: colors.accentRed },
  ];
}

export default function Employees() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { employeeList, employeeStats, isLoadingEmployeeList, error } = useSelector(
    (state) => state.employees
  );

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    dispatch(employeesAction.getEmployeeListStart());
  }, [dispatch]);

  useEffect(() => {
    error && dispatch(snackbarAction.showSnackbar({ message: error, type: SNACKBAR_TYPES.ERROR }));
  }, [error, dispatch]);

  const handleFilterChange = (key, value) =>
    setActiveFilters((prev) => ({ ...prev, [key]: value }));

  const tableData = useMemo(() => toTableData(employeeList), [employeeList]);

  const departmentOptions = useMemo(
    () =>
      [...new Set((employeeList || []).map((e) => e.department).filter(Boolean))]
        .sort()
        .map((d) => ({ value: d, label: d })),
    [employeeList]
  );

  const EMPLOYEE_FILTERS = useMemo(
    () => [
      { key: "department", label: "Department", icon: "bi-building", options: departmentOptions },
      { key: "status", label: "Status", icon: "bi-activity", options: STATUS_OPTIONS },
    ],
    [departmentOptions]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return tableData.filter((r) => {
      if (!matchesTab(r, activeTab)) return false;

      if (activeFilters.department && getDept(r) !== activeFilters.department) return false;

      if (activeFilters.status && getStatus(r) !== activeFilters.status) return false;

      if (!term) return true;
      return (
        getName(r).toLowerCase().includes(term) ||
        getEmpId(r).toLowerCase().includes(term)
      );
    });
  }, [tableData, activeTab, search, activeFilters]);

  const statCards = useMemo(
    () => buildStatCards(employeeList, employeeStats),
    [employeeList, employeeStats]
  );

  const handleExport = () => {
    exportToCsv("employees.csv", EXPORT_COLUMNS, filtered);
  };

  return (
    <Layout>
      <PageWrapper>
        <PageHeader>
          <div>
            <TitleRow>
              <Title>Employees</Title>
              <TitleBadge>{employeeList.length} employees</TitleBadge>
            </TitleRow>
            <Subtitle>Team roster, workload and billable utilization</Subtitle>
          </div>
          <HeaderActions>
            <ButtonStyled variant="secondary" onClick={handleExport}>
              <i className="bi bi-box-arrow-up" /> Export
            </ButtonStyled>
            <ButtonStyled variant="primary" onClick={() => setShowAddModal(true)}>
              <i className="bi bi-plus-lg" /> Add Employee
            </ButtonStyled>
          </HeaderActions>
        </PageHeader>

        <StatsGrid>
          {statCards.map((c, i) => (
            <StatCard
              key={c.label}
              label={c.label}
              value={c.value}
              icon={<i className={`bi ${c.icon}`} />}
              iconColor={c.color}
              index={i}
            />
          ))}
        </StatsGrid>

        {isLoadingEmployeeList && employeeList.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
            <div className="spinner-border text-secondary" role="status" />
          </div>
        ) : (
          <DataTable
            columns={EMPLOYEE_COLUMNS}
            data={filtered}
            onClickRow={(rowId) => navigate(`/employee/${rowId}`)}
            tabBarSlot={
              <TabBarContainer>
                {TABS.map((t) => (
                  <TabButton
                    key={t.key}
                    $active={activeTab === t.key}
                    onClick={() => setActiveTab(t.key)}
                  >
                    {t.label}
                    <TabBadge $active={activeTab === t.key}>
                      {getTabCount(tableData, t.key)}
                    </TabBadge>
                  </TabButton>
                ))}
              </TabBarContainer>
            }
            filterBarSlot={
              <FilterBar
                filters={EMPLOYEE_FILTERS}
                searchPlaceholder="Search by name or employee ID..."
                searchValue={search}
                onSearchChange={setSearch}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
              />
            }
          />
        )}
      </PageWrapper>

      <AddEmployee show={showAddModal} onClose={() => setShowAddModal(false)} />
    </Layout>
  );
}
