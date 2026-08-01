import DonutChart from "../../../components/DonutChart";
import OptionsMenu from "../../../components/OptionsMenu";
import StatusBadge from "../../../components/StatusBadge";
import {
  HeaderCard, Left, ProjectNoBox, ProjectNoLabel, ProjectNoValue, InfoBlock, NameRow, Name,
  ContactRow, ContactChip, Divider,
  MetricsSection, MetricItem, MetricLabel, HeaderActions,
} from "./component.styles";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso = "") {
  if (!iso) return null;
  const d = new Date(iso);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProjectHeader({ project = {}, onEdit, onDelete, onComplete, canEdit = true, canDelete = true }) {
  const {
    projectNo          = "",
    projectName        = "—",
    status,
    clientName         = "",
    projectManagerName = "",
    location: officeLocation = "",
    startDate          = "",
    endDate            = "",
    marketSegment      = "",
    projectType,
    billingType,
    budgetUsedPercentage,
    taskCompletionPercentage,
  } = project;

  const budgetUsed     = Number(budgetUsedPercentage) || 0;
  const taskCompletion = Number(taskCompletionPercentage) || 0;

  const STATUS_LABELS = { 1: "Active", 2: "Completed", 3: "Archived", 4: "On Hold" };
  const statusLabel = STATUS_LABELS[status] || "On Hold";

  const startFmt = fmtDate(startDate);
  const endFmt   = fmtDate(endDate);
  const dateRange = startFmt ? `${startFmt} – ${endFmt || "TBD"}` : null;

  const billableLabel = projectType || null;

  const budgetCount  = Number(project.budgetCount)  || 0;
  const invoiceCount = Number(project.invoiceCount) || 0;
  const willArchive  = budgetCount > 0 || invoiceCount > 0;

  const menuItems = [
    { icon: "bi-pencil", label: "Edit Project", onClick: onEdit, show: Boolean(onEdit) && canEdit },
    { icon: "bi-check2-circle", label: "Mark as Completed", onClick: onComplete, show: Boolean(onComplete) && canEdit && status !== 2 },
    willArchive
      ? { icon: "bi-archive", label: "Archive Project", onClick: onDelete, show: Boolean(onDelete) && canDelete, danger: true, dividerBefore: true }
      : { icon: "bi-trash",   label: "Delete Project",  onClick: onDelete, show: Boolean(onDelete) && canDelete, danger: true, dividerBefore: true },
  ];

  return (
    <HeaderCard>
      <Left>
        {/* Project number */}
        {projectNo && (
          <ProjectNoBox>
            <ProjectNoLabel>Project No.</ProjectNoLabel>
            <ProjectNoValue>{projectNo}</ProjectNoValue>
          </ProjectNoBox>
        )}

        {/* Name + badges + contact chips */}
        <InfoBlock>
          <NameRow>
            <Name>{projectName}</Name>
            <StatusBadge status={statusLabel} />
          </NameRow>

          <ContactRow>
            {clientName          && <ContactChip><i className="bi bi-person-badge" />{clientName}</ContactChip>}
            {projectManagerName  && <ContactChip><i className="bi bi-person-lines-fill" />PM: {projectManagerName}</ContactChip>}
            {officeLocation      && <ContactChip><i className="bi bi-building" />{officeLocation}</ContactChip>}
            {dateRange           && <ContactChip><i className="bi bi-clock" />{dateRange}</ContactChip>}
            {marketSegment       && <ContactChip><i className="bi bi-tag" />{marketSegment}</ContactChip>}
            {billableLabel       && <ContactChip><i className="bi bi-calculator" />{billableLabel}</ContactChip>}
            {billingType         && <ContactChip><i className="bi bi-cash-coin" />{billingType}</ContactChip>}
          </ContactRow>
        </InfoBlock>
      </Left>

      <Divider />

      {/* Metrics — budget used + task completion */}
      <MetricsSection>
        <MetricItem>
          <DonutChart
            percent={budgetUsed}
            size={72}
            strokeWidth={7}
            spentColor="#f97316"
            remainingColor="#ffedd5"
            label="used"
          />
          <MetricLabel>Budget used</MetricLabel>
        </MetricItem>

        <MetricItem>
          <DonutChart
            percent={taskCompletion}
            size={72}
            strokeWidth={7}
            spentColor="#22c55e"
            remainingColor="#dcfce7"
            label="done"
          />
          <MetricLabel>Task completion</MetricLabel>
        </MetricItem>
      </MetricsSection>

      {/* Action menu */}
      <HeaderActions>
        <OptionsMenu items={menuItems} align="end" />
      </HeaderActions>
    </HeaderCard>
  );
}
