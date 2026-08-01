import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../constants/common";
import Layout from "../../components/Layout";
import ButtonStyled from "../../components/ButtonStyled";
import StatCard from "../../components/Statcard";
import { StatsGrid } from "../../components/Statcard/component.styles";
import DataTable from "../../components/DataTable";
import FilterBar from "../../components/FilterBar";
import ConfirmDialog from "../../components/ConfirmDialog";
import PermissionGate from "../../components/PermissionGate";
import AddEmployee from "./modals/AddEmployee";
import { employeesAction } from "../../store/employeesSlice";
import { exportToCsv } from "../../utils/exportCsv";
import {
  PageWrapper, PageHeader, TitleRow, Title, TitleBadge, Subtitle, HeaderActions,
} from "./component.styles";

// ── Column definitions ────────────────────────────────────────────────────────

const EMPLOYEE_COLUMNS = [
  { key: "employee", label: "Employee",    sortable: true,  index: 0 },
  { key: "role",     label: "Role · Dept", sortable: true,  index: 1 },
  { key: "manager",  label: "Manager",     sortable: true,  index: 2 },
  { key: "projects", label: "Projects",    sortable: true,  index: 3, align: "center" },
  { key: "tasks",    label: "Tasks Open",  sortable: true,  index: 4, align: "center" },
  { key: "status",   label: "Status",      sortable: false, index: 5 },
];

const EMPLOYEE_EXPORT_COLUMNS = [
  { label: "Employee ID", accessor: (e) => e.employeeId },
  { label: "First Name",  accessor: (e) => e.firstName },
  { label: "Last Name",   accessor: (e) => e.lastName },
  { label: "Job Title",   accessor: (e) => e.jobTitle },
  { label: "Department",  accessor: (e) => e.department },
  { label: "Manager",     accessor: (e) => e.manager },
  { label: "Projects",    accessor: (e) => e.projectsCount },
  { label: "Tasks Open",  accessor: (e) => e.openTasksCount },
  { label: "Billable %",  accessor: (e) => e.billableUtilization },
  { label: "Status",      accessor: (e) => e.status },
];

const STATUS_OPTIONS = [
  { value: "Active",   label: "Active"   },
  { value: "Pending",  label: "Pending"  },
  { value: "Resigned", label: "Resigned" },
  { value: "Blocked",  label: "Blocked"  },
];

// ── Data converter ────────────────────────────────────────────────────────────

function toTableData(employees) {
  return employees.map((e) => ({
    rowId: e.employeeId,
    row: [
      { value: `${e.firstName} ${e.lastName}`, type: "avatar",  subLabel: `EMP-${e.employeeId}` },
      { value: e.jobTitle,                      type: "stacked", subLabel: e.department          },
      { value: e.manager,                       type: "text"                                     },
      { value: e.projectsCount,                 type: "number"                                   },
      { value: e.openTasksCount,                type: "number"                                   },
      { value: e.status,                        type: "badge"                                    },
    ],
  }));
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Employees() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { employeeList, employeeStats } = useSelector((state) => state.employees);
  const { departments, officeLocations } = useSelector((state) => state.metadata);

  const [search,            setSearch]            = useState("");
  const [activeFilters,     setActiveFilters]     = useState({});
  const [showAddModal,      setShowAddModal]      = useState(false);
  const [showExportConfirm, setShowExportConfirm] = useState(false);

  useEffect(() => {
    dispatch(employeesAction.getEmployeeListStart());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (key, value) =>
    setActiveFilters((prev) => ({ ...prev, [key]: value }));

  const departmentOptions = useMemo(() =>
    departments.map((d) => ({ value: d.departmentName, label: d.departmentName })),
  [departments]);

  const managerOptions = useMemo(() =>
    [...new Set(employeeList.map((e) => e.manager).filter(Boolean))]
      .map((m) => ({ value: m, label: m })),
  [employeeList]);

  const officeOptions = useMemo(() =>
    officeLocations.map((l) => ({ value: l.officeLocation, label: l.officeLocation })),
  [officeLocations]);

  const employeeFilters = useMemo(() => [
    { key: "department", label: "Department", icon: "bi-diagram-3", options: departmentOptions },
    { key: "manager",    label: "Manager",     icon: "bi-person",    options: managerOptions },
    { key: "status",     label: "Status",      options: STATUS_OPTIONS },
    { key: "location",   label: "Location",    icon: "bi-geo-alt",   options: officeOptions },
  ], [departmentOptions, managerOptions, officeOptions]);

  const statCards = useMemo(() => [
    { label: "Active",          value: employeeStats.activeEmployeesToday ?? "—", icon: "bi-person-check", color: colors.accentBlue, footer: "0 on leave today" },
    { label: "Upcoming Leave",  value: employeeStats.upcomingLeaves ?? "—", icon: "bi-calendar", color: colors.accentAmber },
    {
      // label: "Avg Utilisation", value: employeeStats.avgUtilization != null ? `${employeeStats.avgUtilization}%` : "—", icon: "bi-house", color: colors.accentGreen,
    },
    {
      // label: "—", value: "—", icon: "bi-dash", color: colors.textMuted,
    },
  ], [employeeStats]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return employeeList.filter((emp) => {
      if (activeFilters.department && emp.department !== activeFilters.department) return false;
      if (activeFilters.manager    && emp.manager     !== activeFilters.manager)    return false;
      if (activeFilters.status     && emp.status      !== activeFilters.status)     return false;
      if (activeFilters.location   && emp.office      !== activeFilters.location)   return false;
      if (!term) return true;
      return (
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(term) ||
        String(emp.employeeId).includes(term)                           ||
        (emp.jobTitle  || "").toLowerCase().includes(term)               ||
        (emp.department || "").toLowerCase().includes(term)              ||
        (emp.manager   || "").toLowerCase().includes(term)
      );
    });
  }, [employeeList, search, activeFilters]);

  const tableData = useMemo(() => toTableData(filtered), [filtered]);

  return (
    <Layout>
      <PageWrapper>
        <PageHeader>
          <div>
            <TitleRow>
              <Title>Employees</Title>
              <TitleBadge>{employeeList.length} employees</TitleBadge>
            </TitleRow>
            <Subtitle>Team directory, workload &amp; performance overview</Subtitle>
          </div>
          <HeaderActions>
            <ButtonStyled variant="secondary" startSlot={<i className="bi bi-box-arrow-up" />} onClick={() => setShowExportConfirm(true)}>
              Export
            </ButtonStyled>
            <PermissionGate can="canEmployeeAdd">
              <ButtonStyled startSlot={<i className="bi bi-plus-lg" />} onClick={() => setShowAddModal(true)}>
                Add Employee
              </ButtonStyled>
            </PermissionGate>
          </HeaderActions>
        </PageHeader>

        <StatsGrid>
          {statCards.map((card, i) => (
            <StatCard
              key={i}
              label={card.label}
              value={card.value}
              icon={<i className={`bi ${card.icon}`} />}
              iconColor={card.color}
              index={i}
              footer={card.footer}
            />
          ))}
        </StatsGrid>

        <DataTable
          columns={EMPLOYEE_COLUMNS}
          data={tableData}
          hideActionCol
          onClickRow={(id) => navigate(`/employee/${id}`)}
          filterBarSlot={
            <FilterBar
              filters={employeeFilters}
              searchPlaceholder="Search name, role, email..."
              searchValue={search}
              onSearchChange={setSearch}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
            />
          }
        />
        {showAddModal && (
          <PermissionGate can="canEmployeeAdd">
            <AddEmployee onClose={() => setShowAddModal(false)} />
          </PermissionGate>
        )}

        {showExportConfirm && (
          <ConfirmDialog
            title="Export Employee List"
            message={`Export all ${filtered.length} employee records to CSV?`}
            confirmLabel="Export"
            variant="info"
            onConfirm={() => {
              exportToCsv("employees.csv", EMPLOYEE_EXPORT_COLUMNS, filtered);
              setShowExportConfirm(false);
            }}
            onCancel={() => setShowExportConfirm(false)}
          />
        )}
      </PageWrapper>
    </Layout>
  );
}
