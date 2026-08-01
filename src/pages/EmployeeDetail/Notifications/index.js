import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../../components/DataTable";
import FilterBar from "../../../components/FilterBar";
import { notificationAction } from "../../../store/notificationSlice";
import { timeAgo } from "../../../utils/dateMaker";

const NOTIFICATION_COLUMNS = [
  { key: "type", label: "Type", sortable: true, index: 0 },
  { key: "notification", label: "Notification", sortable: true, index: 1 },
  { key: "time", label: "Time", sortable: false, index: 2 },
  { key: "status", label: "Status", sortable: false, index: 3 },
];

const STATUS_FILTER_OPTIONS = [
  { value: "Unread", label: "Unread" },
  { value: "Read", label: "Read" },
];

// "TASK_ASSIGNMENT" -> "Task Assignment"
const humanizeType = (type) =>
  (type || "")
    .split("_")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

const toTableData = (records) =>
  records.map((r) => ({
    rowId: r.id,
    row: [
      { value: humanizeType(r.type), type: "text" },
      { value: r.title, type: "stacked", subLabel: r.message },
      { value: timeAgo(r.createdAt), type: "text" },
      { value: r.status === 0 ? "Unread" : "Read", type: "badge" },
    ],
  }));

const EmployeeNotifications = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.notifications);

  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    dispatch(notificationAction.getNotificationsStart());
  }, [dispatch]);

  const handleFilterChange = (key, value) =>
    setActiveFilters((prev) => ({ ...prev, [key]: value }));

  const handleClickRow = (id) => {
    dispatch(notificationAction.markNotificationReadStart({ id }));
  };

  const typeOptions = useMemo(
    () =>
      [...new Set(items.map((n) => humanizeType(n.type)).filter(Boolean))].map(
        (t) => ({ value: t, label: t })
      ),
    [items]
  );

  const notificationFilters = useMemo(
    () => [
      { key: "type", label: "Type", icon: "bi-tag", options: typeOptions },
      { key: "status", label: "Status", options: STATUS_FILTER_OPTIONS },
    ],
    [typeOptions]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((n) => {
      const statusLabel = n.status === 0 ? "Unread" : "Read";
      if (activeFilters.type && humanizeType(n.type) !== activeFilters.type) return false;
      if (activeFilters.status && statusLabel !== activeFilters.status) return false;
      if (!term) return true;
      return (
        (n.title || "").toLowerCase().includes(term) ||
        (n.message || "").toLowerCase().includes(term)
      );
    });
  }, [items, search, activeFilters]);

  const tableData = useMemo(() => toTableData(filtered), [filtered]);

  return (
    <DataTable
      columns={NOTIFICATION_COLUMNS}
      data={tableData}
      onClickRow={handleClickRow}
      hideActionCol
      filterBarSlot={
        <FilterBar
          filters={notificationFilters}
          searchPlaceholder="Search notifications..."
          searchValue={search}
          onSearchChange={setSearch}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
        />
      }
    />
  );
};

export default EmployeeNotifications;
