import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../constants/common";
import { formatCurrency, getInitials, formatDateOnly } from "../../utils/format";
import Layout from "../../components/Layout";
import ButtonStyled from "../../components/ButtonStyled";
import StatCard from "../../components/Statcard";
import { StatsGrid } from "../../components/Statcard/component.styles";
import DataTable from "../../components/DataTable";
import FilterBar from "../../components/FilterBar";
import ConfirmDialog from "../../components/ConfirmDialog";
import PermissionGate from "../../components/PermissionGate";
import { clientAction } from "../../store/clientSlice";
import { exportToCsv } from "../../utils/exportCsv";
import {
  PageWrapper, PageHeader, TitleRow, Title, TitleBadge, Subtitle, HeaderActions,
  LoadingWrapper,
} from "./component.styles";
import AddClient from "./modals/AddClient";

// ── Column definitions ────────────────────────────────────────────────────────

const CLIENT_COLUMNS = [
  { key: "client",      label: "Client",      sortable: true,  index: 0 },
  { key: "contact",     label: "Contact",     sortable: false, index: 1 },
  { key: "location",    label: "Location",    sortable: true,  index: 2 },
  { key: "projects",    label: "Projects",    sortable: true,  index: 3, align: "center" },
  { key: "outstanding", label: "Outstanding", sortable: true,  index: 4 },
  { key: "since",       label: "Since",       sortable: true,  index: 5 },
];

const CLIENT_EXPORT_COLUMNS = [
  { label: "Client ID",      accessor: (c) => c.id },
  { label: "Client Name",    accessor: (c) => c.name },
  { label: "Contact Name",   accessor: (c) => c.contactName },
  { label: "Email",          accessor: (c) => c.email },
  { label: "Location",       accessor: (c) => c.location },
  { label: "Active Projects", accessor: (c) => c.projectsActive },
  { label: "Total Projects", accessor: (c) => c.projectsTotal },
  { label: "Outstanding",    accessor: (c) => (c.outstanding ? formatCurrency(c.outstanding) : "") },
  { label: "Since",          accessor: (c) => formatDateOnly(c.since) },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function toTableData(clients) {
  return clients.map((c) => ({
    rowId: c.id,
    row: [
      { value: c.name,        type: "avatar",   subLabel: c.id, meta: { initials: getInitials(c.name) } },
      { value: c.contactName, type: "stacked",  subLabel: c.email                          },
      { value: c.location,    type: "text"                                                  },
      { value: `${c.projectsActive} / ${c.projectsTotal}`, type: "text"                   },
      { value: c.outstanding ? formatCurrency(c.outstanding) : "",   type: "outstanding"    },
      { value: formatDateOnly(c.since), type: "text"                                        },
    ],
  }));
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ClientList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { clients, stats, isLoading } = useSelector((state) => state.clients);
  const { officeLocations } = useSelector((state) => state.metadata);

  const [showAddModal,    setShowAddModal]    = useState(false);
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [search,        setSearch]        = useState("");
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    dispatch(clientAction.clientListStart());
  }, [dispatch]);

  const handleFilterChange = (key, value) =>
    setActiveFilters((prev) => ({ ...prev, [key]: value }));

  const locationOptions = useMemo(() =>
    officeLocations.map((l) => ({ value: l.officeLocation, label: l.officeLocation })),
  [officeLocations]);

  const clientFilters = useMemo(() => [
    { key: "location", label: "Location", icon: "bi-geo-alt", options: locationOptions },
  ], [locationOptions]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return clients.filter((c) => {
      if (activeFilters.location && c.location !== activeFilters.location) return false;
      if (!term) return true;
      return (
        (c.name        || "").toLowerCase().includes(term) ||
        String(c.id).includes(term) ||
        (c.location    || "").toLowerCase().includes(term) ||
        (c.contactName || "").toLowerCase().includes(term) ||
        (c.email       || "").toLowerCase().includes(term)
      );
    });
  }, [clients, search, activeFilters]);

  const tableData = useMemo(() => toTableData(filtered), [filtered]);

  return (
    <Layout>
      <PageWrapper>
        {/* Page header */}
        <PageHeader>
          <div>
            <TitleRow>
              <Title>Clients</Title>
              <TitleBadge>{clients.length} clients</TitleBadge>
            </TitleRow>
            <Subtitle>Directory, revenue &amp; account health</Subtitle>
          </div>
          <HeaderActions>
            <ButtonStyled variant="secondary" startSlot={<i className="bi bi-box-arrow-up" />} onClick={() => setShowExportConfirm(true)}>
              Export
            </ButtonStyled>
            <PermissionGate can="canClientAdd">
              <ButtonStyled startSlot={<i className="bi bi-plus-lg" />} onClick={() => setShowAddModal(true)}>
                Add Client
              </ButtonStyled>
            </PermissionGate>
          </HeaderActions>
        </PageHeader>

        {/* Stat cards */}
        <StatsGrid style={{ marginBottom: 24 }}>
          <StatCard index={0} label="Active Clients"       value={`${stats.activeClients ?? 0} / ${stats.totalClients ?? 0}`} icon={<i className="bi bi-people" />}               iconColor={colors.accentBlue}  />
          <StatCard index={1} label="Total Revenue (YTD)"  value={formatCurrency(stats.totalRevenueYtd ?? 0)} icon={<i className="bi bi-graph-up" />}             iconColor={colors.accentGreen} />
          <StatCard index={2} label="Outstanding"          value={formatCurrency(stats.totalOutstanding ?? 0)} icon={<i className="bi bi-receipt" />}              iconColor={colors.accentAmber} />
          <StatCard index={3} label="At-Risk Accounts"     value={`${stats.atRiskAccounts ?? 0}`}       icon={<i className="bi bi-exclamation-triangle" />} iconColor={colors.accentRed}   />
        </StatsGrid>

        {isLoading ? (
          <LoadingWrapper>
            <div className="spinner-border text-secondary" role="status" />
          </LoadingWrapper>
        ) : (
          <DataTable
            columns={CLIENT_COLUMNS}
            data={tableData}
            hideActionCol
            onClickRow={(id) => navigate(`/client/${id}`)}
            filterBarSlot={
              <FilterBar
                filters={clientFilters}
                searchPlaceholder="Search clients..."
                searchValue={search}
                onSearchChange={setSearch}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
              />
            }
          />
        )}
        {showAddModal && (
          <PermissionGate can="canClientAdd">
            <AddClient onClose={() => setShowAddModal(false)} />
          </PermissionGate>
        )}

        {showExportConfirm && (
          <ConfirmDialog
            title="Export Client List"
            message={`Export all ${filtered.length} client records to CSV?`}
            confirmLabel="Export"
            variant="info"
            onConfirm={() => {
              exportToCsv("clients.csv", CLIENT_EXPORT_COLUMNS, filtered);
              setShowExportConfirm(false);
            }}
            onCancel={() => setShowExportConfirm(false)}
          />
        )}
      </PageWrapper>
    </Layout>
  );
}
