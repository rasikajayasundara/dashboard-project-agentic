import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DataTable from "../../../components/DataTable";
import FilterBar from "../../../components/FilterBar";
import { formatCurrency, formatDateOnly } from "../../../utils/format";

// ── Column definitions ────────────────────────────────────────────────────────

const PROJECT_COLUMNS = [
  { key: "project",  label: "Project",  sortable: true,  index: 0 },
  { key: "location", label: "Location", sortable: true,  index: 1 },
  { key: "status",   label: "Status",   sortable: false, index: 2 },
  { key: "budget",   label: "Budget",   sortable: true,  index: 3 },
  { key: "deadline", label: "Deadline", sortable: true,  index: 4 },
];

// ── Filter config ─────────────────────────────────────────────────────────────

const PROJECT_FILTERS = [
  {
    key: "status",
    label: "Status",
    icon: "bi-circle-half",
    options: [
      { value: "Active",    label: "Active"    },
      { value: "On hold",   label: "On hold"   },
      { value: "Completed", label: "Completed" },
    ],
  },
];

// status: 1=Ongoing, 2=Completed, 3=Archived, 4=On Hold (confirmed by backend)
const STATUS_LABELS = { 1: "Ongoing", 2: "Completed", 3: "Archived", 4: "On Hold" };
const mapStatus = (status) => STATUS_LABELS[status] ?? "";

// ── Data converter ────────────────────────────────────────────────────────────

function toTableData(projects) {
  return projects.map((p) => ({
    rowId: p.projectId,
    row: [
      { value: p.projectNo, type: "stacked", subLabel: p.projectName },
      { value: p.location,  type: "text"                              },
      { value: mapStatus(p.status), type: "badge"                     },
      { value: p.totalBudget ? formatCurrency(p.totalBudget) : "",   type: "text" },
      { value: formatDateOnly(p.endDate), type: "text"                },
    ],
  }));
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ClientProjects() {
  // Fetched once by the parent ClientDetail page and shared across all three
  // tabs — this tab only reads the already-loaded state.
  const navigate = useNavigate();
  const { clientProjects: projects } = useSelector((state) => state.clients);

  const [search,        setSearch]        = useState("");
  const [activeFilters, setActiveFilters] = useState({});

  const handleFilterChange = (key, value) =>
    setActiveFilters((prev) => ({ ...prev, [key]: value }));

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return projects.filter((p) => {
      if (activeFilters.status && mapStatus(p.status) !== activeFilters.status) return false;
      if (!term) return true;
      return (
        (p.projectNo || "").toLowerCase().includes(term) ||
        (p.projectName || "").toLowerCase().includes(term)
      );
    });
  }, [projects, search, activeFilters]);

  const tableData = useMemo(() => toTableData(filtered), [filtered]);

  return (
    <DataTable
      columns={PROJECT_COLUMNS}
      data={tableData}
      onClickRow={(id) => navigate(`/project/${id}`)}
      hideActionCol
      filterBarSlot={
        <FilterBar
          filters={PROJECT_FILTERS}
          searchPlaceholder="Search projects…"
          searchValue={search}
          onSearchChange={setSearch}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
        />
      }
    />
  );
}
