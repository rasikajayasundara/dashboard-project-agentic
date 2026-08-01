import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../../components/DataTable";
import FilterBar from "../../../components/FilterBar";
import { employeesAction } from "../../../store/employeesSlice";

const PROJECT_COLUMNS = [
  { key: "project",    label: "Project",         sortable: true,  index: 0 },
  { key: "client",     label: "Client",          sortable: true,  index: 1 },
  { key: "hours",      label: "Hours",           sortable: false, index: 2 },
  { key: "completion", label: "Completion Date", sortable: true,  index: 3 },
  { key: "status",     label: "Status",          sortable: false, index: 4 },
];

const PROJECT_FILTERS = [
  {
    key: "status",
    label: "Status",
    icon: "bi-circle-half",
    options: [
      { value: "Active",    label: "Active"    },
      { value: "On Hold",   label: "On Hold"   },
      { value: "Completed", label: "Completed" },
    ],
  },
];

function toTableData(projects) {
  return projects.map((p) => ({
    rowId: p.projectId,
    row: [
      { value: p.projectNo,  type: "stacked", subLabel: p.projectName                                          },
      { value: p.clientName, type: "text"                                                                       },
      { value: null,         type: "hours", meta: { worked: p.workedHours, allocated: p.allocatedHours }       },
      { value: p.completionDate, type: "text"                                                                   },
      { value: p.status,     type: "badge"                                                                      },
    ],
  }));
}

export default function AssignedProjects({ myProfile = false }) {
  const { id: urlId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { employeeProjects, employeeDetail } = useSelector((state) => state.employees);
  const employeeId = urlId || employeeDetail.empInfo.employeeId;
  const [search,        setSearch]        = useState("");
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    if (employeeId) dispatch(employeesAction.getEmployeeProjectsStart({ employeeId, myProfile }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, myProfile]);

  const handleFilterChange = (key, value) =>
    setActiveFilters((prev) => ({ ...prev, [key]: value }));

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return employeeProjects.filter((p) => {
      if (activeFilters.status && p.status !== activeFilters.status) return false;
      if (!term) return true;
      return (
        (p.projectNo   || "").toLowerCase().includes(term) ||
        (p.projectName || "").toLowerCase().includes(term) ||
        (p.clientName  || "").toLowerCase().includes(term)
      );
    });
  }, [employeeProjects, search, activeFilters]);

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
          searchPlaceholder="Search project, client..."
          searchValue={search}
          onSearchChange={setSearch}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
        />
      }
    />
  );
}
