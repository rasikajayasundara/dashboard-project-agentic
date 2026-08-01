import React, { useState, useMemo } from "react";
import Card from "../Card";
import { AVATAR_PALETTES } from "../../constants/common";
import ProgressBar from "../Progressbar";
import StatusBadge from "../StatusBadge";
import Tooltip from "../Tooltip";
import TableFooter from "./tableFooter";
import {
  TableScrollWrapper, Table, THead, Th, ThInner, SortIcon,
  TBody, Tr, Td, ActionBtn, EmptyRow,
  AvatarCell, AvatarCircle, AvatarMeta, AvatarName, AvatarSub,
  ProjectNameCell, StackedCell, StackedPrimary, StackedSub,
  WorkloadCell, WorkloadTrack, WorkloadFill, WorkloadPct,
  BillableText, OutstandingText,
  HoursCell, HoursLabel, HoursAllocatedText, CompleteBtn, CompletedBadge,
  OngoingBadge, OngoingChip, CompleteStatusCell,
} from "./component.styles";

const PAGE_SIZE = 50;


const getPalette = (name = "") =>
  AVATAR_PALETTES[name.charCodeAt(0) % AVATAR_PALETTES.length];

const getInitials = (name = "") =>
  name.trim().split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

// ── Cell renderer ─────────────────────────────────────────────────────────────
function renderCell(cell) {
  const { value, type, subLabel, meta } = cell;

  switch (type) {
    case "text":
    case "number":
      return subLabel ? (
        <StackedCell>
          <StackedPrimary>{value}</StackedPrimary>
          <StackedSub>{subLabel}</StackedSub>
        </StackedCell>
      ) : value;

    case "stacked":
      return (
        <StackedCell>
          <StackedPrimary>{value}</StackedPrimary>
          {subLabel && <StackedSub>{subLabel}</StackedSub>}
        </StackedCell>
      );

    case "projectNo":
      return (
        <StackedCell>
          <StackedPrimary>{value}</StackedPrimary>
          {meta?.statusChip === "Completed" ? (
            <CompletedBadge><i className="bi bi-check-circle-fill" />Completed</CompletedBadge>
          ) : meta?.statusChip === "Ongoing" ? (
            <OngoingChip><i className="bi bi-hourglass-split" />Ongoing</OngoingChip>
          ) : null}
        </StackedCell>
      );

    case "avatar":
    case "pm": {
      const palette = getPalette(value);
      const initials = meta?.initials || getInitials(value);
      return (
        <AvatarCell>
          <AvatarCircle
            $bg={palette.bg}
            $color={palette.textColor}
            $border={palette.border}
            $size={type === "pm" ? 28 : undefined}
          >
            {initials}
          </AvatarCircle>
          <AvatarMeta>
            <AvatarName $weight={type === "pm" ? 400 : undefined}>{value}</AvatarName>
            {subLabel && <AvatarSub>{subLabel}</AvatarSub>}
          </AvatarMeta>
        </AvatarCell>
      );
    }

    case "projectName":
      return (
        <ProjectNameCell>
          <StackedPrimary>{value}</StackedPrimary>
          <ProgressBar value={meta?.progress ?? 0} height={meta?.progressHeight} />
        </ProjectNameCell>
      );

    case "progress":
      return <ProgressBar value={value} />;

    case "workload":
      return (
        <WorkloadCell>
          <WorkloadTrack>
            <WorkloadFill $pct={value} />
          </WorkloadTrack>
          <WorkloadPct $pct={value}>{value}%</WorkloadPct>
        </WorkloadCell>
      );

    case "tasks":
      return (
        <StackedCell>
          <StackedPrimary>{value}</StackedPrimary>
          {subLabel && <StackedSub>{subLabel}</StackedSub>}
        </StackedCell>
      );

    case "status":
    case "badge": {
      const badge = meta?.tooltip ? (
        <Tooltip portal title={meta.tooltip.title} description={meta.tooltip.description}>
          <StatusBadge status={value} />
        </Tooltip>
      ) : (
        <StatusBadge status={value} />
      );
      return subLabel ? (
        <StackedCell>
          {badge}
          <StackedSub>{subLabel}</StackedSub>
        </StackedCell>
      ) : (
        badge
      );
    }

    case "hours": {
      const worked    = meta?.worked    ?? 0;
      const allocated = meta?.allocated ?? 0;
      const remaining = Math.max(0, allocated - worked);
      const pct       = allocated > 0 ? Math.round((worked / allocated) * 100) : 0;
      const over      = Number(worked) > Number(allocated);
      const label     = meta?.showRemaining
        ? `${worked}h worked · ${remaining}h remaining`
        : `${worked}h / ${allocated}h`;
      return (
        <HoursCell>
          <HoursLabel $over={over}>{label}</HoursLabel>
          <ProgressBar value={Math.min(pct, 100)} late={over} height={meta?.progressHeight} />
          {meta?.showAllocated && (
            <HoursAllocatedText>{allocated}h allocated</HoursAllocatedText>
          )}
        </HoursCell>
      );
    }

    case "billable":
      return <BillableText $pct={value}>{value}%</BillableText>;

    case "outstanding":
      return (
        <OutstandingText $hasValue={!!value}>
          {value || "—"}
        </OutstandingText>
      );

    case "completeStatus":
      return meta?.showComplete ? (
        <CompleteStatusCell>
          <OngoingBadge>
            <i className="bi bi-hourglass-split" />
            Ongoing
          </OngoingBadge>
          <CompleteBtn
            onClick={(e) => { e.stopPropagation(); meta?.onClick?.(); }}
          >
            <i className="bi bi-check2" style={{ marginRight: 5 }} />
            Mark Complete
          </CompleteBtn>
        </CompleteStatusCell>
      ) : (
        <CompletedBadge>
          <i className="bi bi-check-circle-fill" />
          Completed
        </CompletedBadge>
      );

    default:
      return value ?? null;
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
const DataTable = ({
  columns = [],        // [{ key, label, sortable, index, align? }]
  data = [],           // [{ rowId, row: [{ value, type, subLabel?, meta? }] }]
  onClickRow,
  title,
  subtitle,
  headerEndSlot,       // buttons rendered in the Card header (Export, Add, etc.)
  tabBarSlot,          // tab bar rendered above the filter bar inside Card content
  filterBarSlot,       // filter bar rendered between tab bar and table
  footerSlot,          // optional middle element in the pagination footer
  hideActionCol,       // set true when the caller provides its own actions column
  defaultSortKey = null, // column key to sort by on initial render
  defaultSortDir = "asc",
  emptyState,          // optional ReactNode shown instead of the default "No records found." text
}) => {
  const [sortKey, setSortKey] = useState(defaultSortKey);
  const [sortDir, setSortDir] = useState(defaultSortDir);
  const [page, setPage]       = useState(1);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  // Sort uses the passed columns prop — no external import needed (bug fix)
  const sorted = useMemo(() => {
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return data;
    return [...data].sort((a, b) => {
      const aCell = a.row[col.index];
      const bCell = b.row[col.index];
      const av = aCell?.sortValue ?? aCell?.value;
      const bv = bCell?.sortValue ?? bCell?.value;
      const aComp = typeof av === "string" ? av.toLowerCase() : av ?? "";
      const bComp = typeof bv === "string" ? bv.toLowerCase() : bv ?? "";
      if (aComp < bComp) return sortDir === "asc" ? -1 : 1;
      if (aComp > bComp) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Card
      title={title}
      subtitle={subtitle}
      headerEndSlot={headerEndSlot}
      content={
        <>
          {tabBarSlot}
          {filterBarSlot}
          <TableScrollWrapper>
          <Table>
            <THead>
              <tr>
                {columns.map((col, idx) => (
                  <Th
                    key={col.key}
                    $sortable={col.sortable}
                    $align={idx === columns.length - 1 ? "right" : col.align}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <ThInner>
                      {col.label}
                      {col.sortable && (
                        <SortIcon>
                          {sortKey === col.key
                            ? sortDir === "asc" ? "↑" : "↓"
                            : "↕"}
                        </SortIcon>
                      )}
                    </ThInner>
                  </Th>
                ))}
                {!hideActionCol && <Th style={{ width: 48 }} />}
              </tr>
            </THead>
            <TBody>
              {paginated.length === 0 ? (
                <EmptyRow>
                  <td colSpan={columns.length + (hideActionCol ? 0 : 1)}>
                    {emptyState || "No records found."}
                  </td>
                </EmptyRow>
              ) : (
                paginated.map(({ rowId, row, atRisk }) => (
                  <Tr key={rowId} $atRisk={atRisk} $clickable={!!onClickRow} onClick={() => onClickRow?.(rowId)}>
                    {row.map((cell, i) => (
                      <Td key={i} $align={i === row.length - 1 ? "right" : columns[i]?.align}>
                        {renderCell(cell)}
                      </Td>
                    ))}

                    {!hideActionCol && (
                      <Td onClick={(e) => e.stopPropagation()} style={{ width: 48 }}>
                        <ActionBtn
                          onClick={(e) => {
                            e.stopPropagation();
                            onClickRow?.(rowId);
                          }}
                        >
                          <i className="bi bi-three-dots-vertical" />
                        </ActionBtn>
                      </Td>
                    )}
                  </Tr>
                ))
              )}
            </TBody>
          </Table>
          </TableScrollWrapper>
        </>
      }
      footer={
        sorted.length > 0
          ? <TableFooter page={page} totalPages={totalPages} onClick={setPage} pageSize={PAGE_SIZE} total={sorted.length} middleSlot={footerSlot} />
          : null
      }
    />
  );
};

export default DataTable;
