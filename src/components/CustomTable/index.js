import React, { useState, useMemo } from "react";
import {
  StyledTable,
  THead,
  Th,
  ThInner,
  SortIcon,
  TBody,
  Tr,
  Td,
  ProjectId,
  ProjectName,
  ClientName,
  Budget,
  Deadline,
  TasksCell,
  TaskCount,
  TaskOpen,
  HrsWk,
  PMCell,
  Avatar,
  PMName,
  EmptyCell,
} from "./component.styles";
import ButtonStyled from "../ButtonStyled";
import { AVATAR_PALETTES } from "../../constants/common";
import ProgressBar from "../Progressbar";
import StatusBadge from "../StatusBadge";
import { FormInput, InputWrapper, InputSlot } from "../FormField";
import TableFooter from "./tableFooter";
import Card from "../Card";
import FilterDropdown from "../FilterDropdown";
import { COLUMNS } from "../../pages/Projects";

const getPalette = (name) =>
  AVATAR_PALETTES[name.charCodeAt(0) % AVATAR_PALETTES.length];

const getInitials = (name) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const FILTERS = [
  {
    id: "manager",
    label: "Project Manager",
    type: "manager",
    options: [
      { value: "alice", label: "Alice Johnson", color: "#6c63ff" },
      { value: "bob", label: "Bob Martinez", color: "#ff6584" },
      { value: "carol", label: "Carol White", color: "#43d9ad" },
      { value: "dan", label: "Dan Kim", color: "#f7c948" },
    ],
  },
  {
    id: "status",
    label: "Status",
    type: "status",
    options: [
      { value: "active", label: "Active", color: "#43d9ad" },
      { value: "pending", label: "Pending", color: "#f7c948" },
      { value: "review", label: "In Review", color: "#6c63ff" },
      { value: "archived", label: "Archived", color: "#6b7394" },
    ],
  },
  {
    id: "client",
    label: "Client",
    type: "client",
    options: [
      { value: "acme", label: "Acme Corp" },
      { value: "globex", label: "Globex Inc" },
      { value: "initech", label: "Initech" },
      { value: "umbrella", label: "Umbrella Ltd" },
    ],
  },
];

const PAGE_SIZE = 7;
const CustomTable = ({
  data = [],
  title = "Projects",
  subtitle,
  tableColumns = [],
  onClickItem,
}) => {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return data.filter((r) =>
      r.row.some((cell) => String(cell.value).toLowerCase().includes(q))
    );
  }, [data, search]);

  const sorted = useMemo(() => {
    const column = COLUMNS.find((c) => c.key === sortKey);
    if (!column) return filtered;

    return [...filtered].sort((a, b) => {
      let av = a.row[column.index]?.value;
      let bv = b.row[column.index]?.value;

      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();

      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;

      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const sortArrow = (key) => {
    if (sortKey !== key) return "↕";
    return sortDir === "asc" ? "↑" : "↓";
  };

  return (
    <Card
      title={title}
      subtitle={subtitle}
      headerEndSlot={
        <>
          <InputWrapper>
            <InputSlot><i className="bi bi-search" /></InputSlot>
            <FormInput
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              $hasStart
            />
          </InputWrapper>

          <FilterDropdown
            filters={FILTERS}
            triggerLabel="Filters"
            onApply={({ selections, search }) =>
              console.log(selections, search)
            }
          />

          <ButtonStyled variant="primary">Search</ButtonStyled>
        </>
      }
      content={
        <StyledTable>
          <THead>
            <tr>
              {tableColumns.map((col) => (
                <Th
                  key={col.key}
                  sortable={col.sortable}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <ThInner>
                    {col.label}
                    {col.sortable && <SortIcon>{sortArrow(col.key)}</SortIcon>}
                  </ThInner>
                </Th>
              ))}
            </tr>
          </THead>
          <TBody>
            {paginated.length === 0 ? (
              <tr>
                <EmptyCell colSpan={tableColumns.length}>
                  No projects match your search.
                </EmptyCell>
              </tr>
            ) : (
              paginated.map((tbRow) => (
                <Tr onClick={() => onClickItem?.(tbRow.projectId)}>
                  {tbRow.row.map((cell, index) => {
                    switch (cell.type) {
                      case "text":
                      case "number":
                        return (
                          <Td key={index}>
                            <TasksCell>
                              <TaskCount>{cell.value}</TaskCount>
                              <TaskOpen>{cell.subLabel}</TaskOpen>
                            </TasksCell>
                          </Td>
                        );

                      case "progress":
                        return (
                          <Td key={index}>
                            <ProgressBar value={cell.value} late={true} />
                          </Td>
                        );

                      case "pm":
                        const palette = getPalette(cell.value);

                        return (
                          <Td key={index}>
                            <PMCell>
                              <Avatar
                                bg={palette.bg}
                                border={palette.border}
                                textColor={palette.textColor}
                              >
                                {getInitials(cell.value)}
                              </Avatar>
                              <div>
                                <PMName>{cell.value}</PMName>
                                <TaskOpen>{cell.subLabel}</TaskOpen>
                              </div>
                            </PMCell>
                          </Td>
                        );

                      case "tasks":
                        return (
                          <Td key={index}>
                            <TasksCell>
                              <TaskCount>{cell.value}</TaskCount>
                              <TaskOpen>{cell.subLabel}</TaskOpen>
                            </TasksCell>
                          </Td>
                        );

                      case "status":
                        return (
                          <Td key={index}>
                            <StatusBadge status={cell.value} />
                          </Td>
                        );

                      default:
                        return <Td key={index}>{cell.value}</Td>;
                    }
                  })}
                </Tr>
              ))
            )}
          </TBody>

          {/* <TBody>
            {paginated.length === 0 ? (
              <tr>
                <EmptyCell colSpan={tableColumns.length}>
                  No projects match your search.
                </EmptyCell>
              </tr>
            ) : (
              paginated.map((row, i) => {
                const palette = getPalette(row.pm);
                const isLate = row.status === "Late";

                return (
                  <Tr key={row.id} index={i}>
                    <Td>
                      <ProjectId>{row.id}</ProjectId>
                    </Td>

                    <Td>
                      <ProjectName>{row.name}</ProjectName>
                    </Td>

                    <Td>
                      <ClientName>{row.client}</ClientName>
                    </Td>

                    <Td>
                      <Budget>${row.budget}</Budget>
                    </Td>

                    <Td>
                      <ProgressBar
                        value={row.progress}
                        late={isLate}
                        delay={i * 0.06}
                      />
                    </Td>

                    <Td>
                      <Deadline late={isLate}>{row.deadline}</Deadline>
                    </Td>

                    <Td>
                      <TasksCell>
                        <TaskCount>
                          {row.tasksCompleted} / {row.tasksTotal}
                        </TaskCount>
                        <TaskOpen>{row.tasksOpen} open</TaskOpen>
                      </TasksCell>
                    </Td>

                    <Td>
                      <HrsWk>{row.hrsWk}</HrsWk>
                    </Td>

                    <Td>
                      <PMCell>
                        <Avatar
                          bg={palette.bg}
                          border={palette.border}
                          textColor={palette.textColor}
                        >
                          {getInitials(row.pm)}
                        </Avatar>
                        <PMName>{row.pm}</PMName>
                      </PMCell>
                    </Td>

                    <Td>
                      <StatusBadge status={row.status} />
                    </Td>
                  </Tr>
                );
              })
            )}
          </TBody> */}
        </StyledTable>
      }
      footer={
        <TableFooter
          page={page}
          totalPages={totalPages}
          onClick={setPage}
          pageSize={PAGE_SIZE}
          sorted={sorted}
        />
      }
    />
  );
};

export default CustomTable;
