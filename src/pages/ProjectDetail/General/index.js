import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { colors, AVATAR_PALETTES, fontSize } from "../../../constants/common";
import { projectTeamAction } from "../../../store/projectTeamSlice";
import { projectDetailAction } from "../../../store/projectDetailSlice";
import EmptyState from "../../../components/EmptyState";
import Tooltip from "../../../components/Tooltip";
import {
  DonutChartWrapper,
  GeneralGrid, TwoCol, SectionCard, SectionHeader, SectionTitle, SectionAmount,
  BudgetSummaryRow, BudgetVertDivider,
  TotalLabel, TotalAmount, LegendRow, LegendItem, LegendDotRow, Dot, LegendName, LegendAmount,
  StackedBarWrapper, StackedBarTrack, StackedBarSegment, BreakdownLegend, BreakdownLegendItem,
  LegendDot, LegendLabel, LegendValue, BreakdownStatus,
  TimelineWrapper, TimelineHeaderRow, TimelineHeaderCell, TimelineRow,
  TimelineLabel, TimelineBarWrapper, TimelineBarTrack, TimelineBarFill, TimelineProgressFill, TodayMarker, TimelinePct,
  TimelineGroupHeader, TimelineGroupDot, TimelineGroupName,
  TeamList, TeamMemberRow, MemberAvatar, MemberMeta, MemberName, MemberRole,
  MemberHoursCol, HoursLabel, TeamCapacity,
  BudgetSplitLegend, BudgetSplitRow, BudgetSplitLabelText, BudgetSplitPct,
  BurndownWrap, BurndownLegend, BurndownLegendItem, BurndownLineSwatch, BurndownNote,
  CommentFeed, CommentItem, CommentAvatar, CommentBody, CommentMeta,
  CommentName, CommentRole, CommentTime, CommentBubble,
  CommentInputRow, CommentInput, PostButton,
} from "./component.styles";

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmt = (v) => `$${Number(v || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const getPalette = (name = "") => AVATAR_PALETTES[name.charCodeAt(0) % AVATAR_PALETTES.length];
const getInitials = (name = "") => name.trim().split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const TEAM_CAPACITY = 40;

// Fixed palette cycled by budgetSplit/phase position, keyed by budgetId for stability
const BUDGET_COLOR_PALETTE = [
  colors.pastelRed,
  colors.pastelBlue,
  colors.pastelAmber,
  colors.pastelGreen,
  colors.accentBlue,
];

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const parseYMD = (s) => {
  if (!s) return null;
  const [y, m, d] = s.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

const fmtShort = (date) => (date ? `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}` : "");

const MOCK_COMMENTS = [
  {
    id: 1,
    name: "Lisa Schuster", role: "Client", initials: "LS", time: "2h ago",
    text: "Confirmed: prefers concrete pile foundations over screw piles. Please update FD scope.",
    bg: "#EFF6FF",
  },
  {
    id: 2,
    name: "John Kim", role: "PM", initials: "JK", time: "yesterday",
    text: "Decision logged → swapping pile type. +$400 to Foundation Design budget.",
    bg: "#F0FDF4",
  },
  {
    id: 3,
    name: "Aroha Smith", role: "Geotech", initials: "AS", time: "2 days ago",
    text: "Boreholes 1 & 2 complete. BH3 blocked on permit — see \"Today's Focus\".",
    bg: null,
  },
];

// ── Burndown SVG data ──────────────────────────────────────────────────────────
const W = 600; const H = 160; const PAD = { t: 10, r: 10, b: 30, l: 40 };
const cw = W - PAD.l - PAD.r;
const ch = H - PAD.t - PAD.b;
const xPts = [0, 0.15, 0.3, 0.45, 0.55, 0.7, 0.85, 1];
const ideal   = [1, 0.87, 0.73, 0.58, 0.5, 0.35, 0.18, 0];
const actual  = [1, 0.89, 0.76, 0.62, 0.57];
const forecast = [0.57, 0.45, 0.32, 0.25];
const forecastX = [0.55, 0.7, 0.85, 1];
const toSvgX = (t) => PAD.l + t * cw;
const toSvgY = (v) => PAD.t + (1 - v) * ch;
const pathD = (xs, ys) => xs.map((x, i) => `${i === 0 ? "M" : "L"} ${toSvgX(x).toFixed(1)} ${toSvgY(ys[i]).toFixed(1)}`).join(" ");

// ── Component ──────────────────────────────────────────────────────────────────
function General({ data }) {
  const [comment, setComment] = useState("");
  const [chartHover, setChartHover] = useState(null);
  const donutRef = useRef(null);
  const wipBarRef = useRef(null);
  const invoiceBarRef = useRef(null);

  // Generic hover-tooltip helper shared by every chart on this page — `key` scopes which
  // container renders the resulting <Tooltip>, `rectEl` is the positioned ancestor to
  // measure against (defaults to the element the listener is on, e.g. a timeline row track).
  const handleChartHover = (e, key, title, description, rectEl) => {
    const rect = (rectEl || e.currentTarget).getBoundingClientRect();
    setChartHover({ key, x: e.clientX - rect.left, y: e.clientY - rect.top, title, description });
  };
  const clearChartHover = () => setChartHover(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: pid } = useParams();
  const { members, isLoading: teamLoading } = useSelector((s) => s?.projectTeam) || {};
  const { generalStats, generalStatsLoading } = useSelector((s) => s?.projectDetails) || {};

  useEffect(() => {
    if (pid) dispatch(projectTeamAction.fetchTeamStart(pid));
  }, [dispatch, pid]);

  useEffect(() => {
    if (pid) dispatch(projectDetailAction.fetchGeneralStatsStart(pid));
  }, [dispatch, pid]);

  const budgetSummary = generalStats?.budgetSummary || {};
  const totalBudget = Number(budgetSummary.totalBudget) || 0;
  const spent = Number(budgetSummary.spent) || 0;
  const remaining = Number(budgetSummary.remaining) || 0;
  const spentPct = Math.round(Number(budgetSummary.spentPercentage) || 0);
  const spentPctClamped = Math.min(100, Math.max(0, spentPct));

  const budgetSplit = generalStats?.budgetSplit || [];
  const timeline = generalStats?.timeline || {};
  const phases = timeline.phases || [];

  // Shared budgetId -> color map, stable across split legend, donut, and timeline dots
  const budgetColorMap = useMemo(() => {
    const map = {};
    budgetSplit.forEach((item, idx) => {
      map[item.budgetId] = BUDGET_COLOR_PALETTE[idx % BUDGET_COLOR_PALETTE.length];
    });
    return map;
  }, [generalStats?.budgetSplit]); // eslint-disable-line react-hooks/exhaustive-deps

  // Nested donut geometry
  const OR = 70, OSW = 14, IR = 48, ISW = 12;
  const OC = 2 * Math.PI * OR;
  const IC = 2 * Math.PI * IR;
  let _cum = 0;
  const outerSegs = budgetSplit.map((seg) => {
    const pct = Number(seg.percentage) || 0;
    const arc = OC * (pct / 100);
    const offset = -(OC / 4) - (OC * _cum / 100);
    _cum += pct;
    return {
      id: seg.budgetId,
      label: seg.budgetName,
      pct,
      color: budgetColorMap[seg.budgetId],
      arc,
      offset,
    };
  });

  // Timeline date range — uses the project's own start/end date (not timeline.startDate/endDate,
  // which the API derives from min/max task dates and can be narrower than the project span)
  const timelineStartDate = parseYMD(data?.startDate) || parseYMD(timeline.startDate);
  const timelineEndDate = parseYMD(data?.endDate) || parseYMD(timeline.endDate);
  const todayMarkerDate = parseYMD(timeline.todayMarker) || new Date();

  const TIMELINE_DATES = useMemo(() => {
    if (!timelineStartDate || !timelineEndDate) return [];
    const startMs = timelineStartDate.getTime();
    const endMs = timelineEndDate.getTime();
    return [0, 0.25, 0.5, 0.75, 1].map((t) => fmtShort(new Date(startMs + t * (endMs - startMs))));
  }, [data?.startDate, data?.endDate, timeline.startDate, timeline.endDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const timelineRangeMs = timelineStartDate && timelineEndDate
    ? timelineEndDate.getTime() - timelineStartDate.getTime()
    : 0;

  const TODAY_PCT = (timelineRangeMs > 0 && todayMarkerDate)
    ? Math.max(0, Math.min(100, ((todayMarkerDate.getTime() - timelineStartDate.getTime()) / timelineRangeMs) * 100))
    : 0;

  const hasTasks = phases.some((p) => (p.tasks || []).length > 0);

  const financialSummary = generalStats?.financialSummary || {};
  const wip = financialSummary.workInProgress || {};
  const invoiceSummary = financialSummary.invoiceSummary || {};

  const wipWorkedPct = Math.round(Number(wip.workedPercentage) || 0);
  const wipExpPct    = Math.round(Number(wip.expensesPercentage) || 0);
  const invInvPct    = Math.round(Number(invoiceSummary.invoicedPercentage) || 0);
  const invRemPct    = Math.round(Number(invoiceSummary.remainingPercentage) || 0);

  return (
    <GeneralGrid>
      {/* ── Row 1: Budget overview + Decisions & Comments ───────────── */}
      <TwoCol $split="3fr 2fr" $stretch>
      <SectionCard>
        {generalStatsLoading && !generalStats ? (
          <div className="text-center py-3" style={{ color: colors.textMuted }}>Loading budget overview…</div>
        ) : !generalStatsLoading && budgetSplit.length === 0 ? (
          <EmptyState
            icon="bi-wallet2"
            title="No budget lines yet"
            subtitle="Break the project into budgets to start tracking spend against the total."
            action={{ label: "Add Budget Line", icon: "bi-plus-lg", onClick: () => navigate("?tab=budget") }}
          />
        ) : (
          <BudgetSummaryRow>
            {/* Nested donut: outer ring = budget split by category, inner ring = spent vs remaining */}
            <DonutChartWrapper ref={donutRef}>
            <svg width={180} height={180}>
              {/* Outer track */}
              <circle cx={90} cy={90} r={OR} fill="none" stroke={colors.borderLight} strokeWidth={OSW} />
              {/* Outer segments — budget split */}
              {outerSegs.map((seg) => (
                <circle key={seg.id} cx={90} cy={90} r={OR}
                  fill="none" stroke={seg.color} strokeWidth={OSW}
                  strokeDasharray={`${seg.arc} ${OC - seg.arc}`}
                  strokeDashoffset={seg.offset}
                  strokeLinecap="butt"
                  onMouseMove={(e) => handleChartHover(e, "donut", seg.label, `${seg.pct}% · ${fmt((totalBudget * seg.pct) / 100)}`, donutRef.current)}
                  onMouseLeave={clearChartHover}
                />
              ))}
              {/* Inner track — shows through as "remaining" wherever the spent arc doesn't cover it */}
              <circle cx={90} cy={90} r={IR} fill="none" stroke={colors.borderLight} strokeWidth={ISW}
                onMouseMove={(e) => handleChartHover(e, "donut", "Remaining", `${fmt(remaining)} · ${100 - spentPctClamped}%`, donutRef.current)}
                onMouseLeave={clearChartHover}
              />
              {/* Inner arc — spent */}
              <circle cx={90} cy={90} r={IR}
                fill="none" stroke="#378ADD" strokeWidth={ISW}
                strokeDasharray={`${IC * spentPctClamped / 100} ${IC * (100 - spentPctClamped) / 100}`}
                strokeDashoffset={-(IC / 4)}
                strokeLinecap="round"
                onMouseMove={(e) => handleChartHover(e, "donut", "Spent", `${fmt(spent)} · ${spentPctClamped}%`, donutRef.current)}
                onMouseLeave={clearChartHover}
              />
              {/* Center label */}
              <text x={90} y={85} textAnchor="middle" fontSize={17} fontWeight="700" fill="#378ADD" fontFamily="Inter,sans-serif">{spentPct}%</text>
              <text x={90} y={103} textAnchor="middle" fontSize={11} fill={colors.textMuted} fontFamily="Inter,sans-serif">Spent</text>
            </svg>
            {chartHover?.key === "donut" && (
              <Tooltip x={chartHover.x} y={chartHover.y} title={chartHover.title} description={chartHover.description} />
            )}
            </DonutChartWrapper>

            {/* Budget numbers */}
            <div>
              <TotalLabel>Total Budget</TotalLabel>
              <TotalAmount>{fmt(totalBudget)}</TotalAmount>
              <LegendRow>
                <LegendItem>
                  <LegendDotRow><Dot color="#378ADD" /><LegendName>Spent</LegendName></LegendDotRow>
                  <LegendAmount>{fmt(spent)}</LegendAmount>
                </LegendItem>
                <LegendItem>
                  <LegendDotRow><Dot color="#B5D4F4" /><LegendName>Remaining</LegendName></LegendDotRow>
                  <LegendAmount>{fmt(remaining)}</LegendAmount>
                </LegendItem>
              </LegendRow>
            </div>

            <BudgetVertDivider />

            {/* Budget split legend — categories now shown on outer donut ring */}
            <div style={{ flex: 1 }}>
              <SectionTitle style={{ marginBottom: 14 }}>Budget Split</SectionTitle>
              <BudgetSplitLegend>
                {budgetSplit.map((item) => (
                  <BudgetSplitRow key={item.budgetId}>
                    <BudgetSplitLabelText>
                      <LegendDot $color={budgetColorMap[item.budgetId]} />
                      {item.budgetName}
                    </BudgetSplitLabelText>
                    <BudgetSplitPct>{item.percentage}%</BudgetSplitPct>
                  </BudgetSplitRow>
                ))}
              </BudgetSplitLegend>
            </div>
          </BudgetSummaryRow>
        )}

        {/* Timeline — below donut section */}
        <div style={{ borderTop: `1px solid ${colors.borderLight}`, marginTop: 20, paddingTop: 20 }}>
          <SectionHeader style={{ marginBottom: 12 }}>
            <SectionTitle>Timeline · Phases</SectionTitle>
            <span style={{ fontSize: fontSize.subtitle, color: colors.textMuted }}>today marker in red</span>
          </SectionHeader>
          {generalStatsLoading && !generalStats ? (
            <div className="text-center py-3" style={{ color: colors.textMuted }}>Loading timeline…</div>
          ) : !generalStatsLoading && !hasTasks ? (
            <EmptyState
              icon="bi-list-check"
              title="No tasks scheduled"
              subtitle="Tasks show up here on a timeline once they have start and due dates."
            />
          ) : (
            <TimelineWrapper>
              <TimelineHeaderRow>
                {TIMELINE_DATES.map((d, i) => (
                  <TimelineHeaderCell key={`${d}-${i}`}>{d}</TimelineHeaderCell>
                ))}
              </TimelineHeaderRow>
              {phases.map((phase) => {
                const groupColor = budgetColorMap[phase.budgetId] || colors.textMuted;
                return (
                  <div key={phase.budgetId}>
                    <TimelineGroupHeader>
                      <TimelineGroupDot $color={groupColor} />
                      <TimelineGroupName>{phase.budgetName}</TimelineGroupName>
                    </TimelineGroupHeader>
                    {(phase.tasks || []).map((task) => {
                      const taskStart = parseYMD(task.taskStartDate);
                      const taskEnd = parseYMD(task.taskEndDate);
                      let start = 0;
                      let width = 0;
                      if (timelineRangeMs > 0 && taskStart && taskEnd) {
                        start = ((taskStart.getTime() - timelineStartDate.getTime()) / timelineRangeMs) * 100;
                        width = ((taskEnd.getTime() - taskStart.getTime()) / timelineRangeMs) * 100;
                      }
                      start = Math.max(0, start);
                      width = Math.max(0, Math.min(width, 100 - start));
                      const complete = task.completionPercentage;
                      return (
                        <TimelineRow key={task.taskId}>
                          <TimelineLabel>{task.taskName}</TimelineLabel>
                          <TimelineBarWrapper
                            onMouseMove={(e) => handleChartHover(
                              e,
                              `timeline-${task.taskId}`,
                              task.taskName,
                              `${taskStart ? fmtShort(taskStart) : "–"} – ${taskEnd ? fmtShort(taskEnd) : "–"} · ${complete}% complete`,
                            )}
                            onMouseLeave={clearChartHover}
                          >
                            <TimelineBarTrack>
                              <TodayMarker $pct={TODAY_PCT} />
                              <TimelineBarFill $start={start} $width={width}>
                                <TimelineProgressFill $pct={complete} $color={groupColor} />
                              </TimelineBarFill>
                            </TimelineBarTrack>
                            {chartHover?.key === `timeline-${task.taskId}` && (
                              <Tooltip x={chartHover.x} y={chartHover.y} title={chartHover.title} description={chartHover.description} />
                            )}
                          </TimelineBarWrapper>
                          <TimelinePct>{complete}%</TimelinePct>
                        </TimelineRow>
                      );
                    })}
                  </div>
                );
              })}
            </TimelineWrapper>
          )}
        </div>
      </SectionCard>

      {/* Team Progress — right of budget card */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>Team Progress</SectionTitle>
        </SectionHeader>
        {teamLoading && (!members || members.length === 0) ? (
          <div className="text-center py-3" style={{ color: colors.textMuted }}>Loading team…</div>
        ) : !teamLoading && (!members || members.length === 0) ? (
          <EmptyState
            icon="bi-people"
            title="No team members assigned"
            subtitle="Assign people so you can track hours worked against their capacity."
          />
        ) : (
          <TeamList>
            {(members || []).map((member) => {
              const tasks = member.tasks || [];
              const allocatedHrs = tasks.reduce((sum, t) => sum + (Number(t.allocatedHours) || 0), 0);
              const workedHrs = tasks.reduce((sum, t) => sum + (Number(t.workedHours) || 0), 0);
              const tasksAssigned = tasks.length;
              const tasksCompleted = tasks.filter((t) => t.status === "done").length;
              const tasksDue = tasks.filter((t) => t.status === "due").length;

              const palette = getPalette(member.name);
              const workedPct = allocatedHrs > 0 ? Math.min(Math.round((workedHrs / allocatedHrs) * 100), 100) : 0;
              return (
                <TeamMemberRow key={member.employeeId}>
                  <MemberAvatar $bg={palette.bg} $color={palette.textColor} $border={palette.border}>
                    {getInitials(member.name)}
                  </MemberAvatar>
                  <MemberMeta>
                    <MemberName>{member.name}</MemberName>
                    <MemberRole>{member.jobTitle}</MemberRole>
                  </MemberMeta>

                  {/* Task counts */}
                  <div style={{ display: "flex", gap: 14, flexShrink: 0 }}>
                    {[
                      { value: tasksAssigned,  label: "assigned", color: colors.textPrimary },
                      { value: tasksCompleted, label: "done",     color: colors.accentGreen },
                      { value: tasksDue,       label: "due",      color: tasksDue > 0 ? colors.accentRed : colors.textMuted },
                    ].map(({ value, label, color }) => (
                      <div key={label} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: fontSize.highlight, fontWeight: 700, color }}>{value}</div>
                        <div style={{ fontSize: fontSize.subtitle, color: colors.textMuted }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Allocated vs worked bar */}
                  <MemberHoursCol>
                    <HoursLabel>{workedHrs}h / {allocatedHrs}h</HoursLabel>
                    <div style={{ position: "relative", width: 100, height: 7, borderRadius: 4, background: colors.borderLight, overflow: "hidden" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${workedPct}%`, background: colors.accentBlue, borderRadius: 4 }} />
                    </div>
                  </MemberHoursCol>
                </TeamMemberRow>
              );
            })}
          </TeamList>
        )}
        <TeamCapacity>capacity = {TEAM_CAPACITY}h per member</TeamCapacity>
      </SectionCard>
      </TwoCol>

      {/* ── Row 5: Decisions & Comments + WIP/Invoice breakdowns ──────── */}
      {/* Decisions & Comments — hidden for now (mock data), see MOCK_COMMENTS above
      <SectionCard>
        <SectionHeader>
          <SectionTitle>Decisions &amp; Comments</SectionTitle>
        </SectionHeader>
        <CommentFeed>
          {MOCK_COMMENTS.map((c) => {
            const palette = getPalette(c.name);
            return (
              <CommentItem key={c.id}>
                <CommentAvatar $bg={palette.bg} $color={palette.textColor} $border={palette.border}>
                  {c.initials}
                </CommentAvatar>
                <CommentBody>
                  <CommentMeta>
                    <CommentName>{c.name}</CommentName>
                    <CommentRole>· {c.role}</CommentRole>
                    <CommentTime>{c.time}</CommentTime>
                  </CommentMeta>
                  <CommentBubble $bg={c.bg}>{c.text}</CommentBubble>
                </CommentBody>
              </CommentItem>
            );
          })}
        </CommentFeed>
        <CommentInputRow>
          <CommentInput
            rows={1}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="write a comment, @ to mention..."
          />
          <PostButton>Post</PostButton>
        </CommentInputRow>
      </SectionCard>
      */}

      {/* WIP + Invoice side by side */}
      <TwoCol $stretch>
        <SectionCard>
          <SectionHeader>
            <SectionTitle>Work in Progress Breakdown</SectionTitle>
            <SectionAmount>{fmt(wip.total)}</SectionAmount>
          </SectionHeader>
          {generalStatsLoading && !generalStats ? (
            <div className="text-center py-3" style={{ color: colors.textMuted }}>Loading work in progress…</div>
          ) : (
            <>
              <StackedBarWrapper ref={wipBarRef}>
                <StackedBarTrack>
                  <StackedBarSegment $color={colors.pastelAmber} $pct={wipWorkedPct}
                    onMouseMove={(e) => handleChartHover(e, "wip-worked", "Worked", `${fmt(wip.worked)} · ${wipWorkedPct}%`, wipBarRef.current)}
                    onMouseLeave={clearChartHover}
                  />
                  <StackedBarSegment $color={colors.pastelBlue}  $pct={wipExpPct}
                    onMouseMove={(e) => handleChartHover(e, "wip-expenses", "Expenses", `${fmt(wip.expenses)} · ${wipExpPct}%`, wipBarRef.current)}
                    onMouseLeave={clearChartHover}
                  />
                </StackedBarTrack>
                {(chartHover?.key === "wip-worked" || chartHover?.key === "wip-expenses") && (
                  <Tooltip x={chartHover.x} y={chartHover.y} title={chartHover.title} description={chartHover.description} />
                )}
              </StackedBarWrapper>
              <BreakdownLegend>
                <BreakdownLegendItem>
                  <LegendDot $color={colors.pastelAmber} />
                  <LegendLabel>Worked</LegendLabel>
                  <LegendValue>{fmt(wip.worked)}</LegendValue>
                </BreakdownLegendItem>
                <BreakdownLegendItem>
                  <LegendDot $color={colors.pastelBlue} />
                  <LegendLabel>Expenses</LegendLabel>
                  <LegendValue>{fmt(wip.expenses)}</LegendValue>
                </BreakdownLegendItem>
              </BreakdownLegend>
              {wip.budgetStatus && (
                <BreakdownStatus $good={!wip.budgetStatus.isOverBudget}>
                  <i className={`bi ${wip.budgetStatus.isOverBudget ? "bi-exclamation-circle" : "bi-check-circle"}`} />
                  {wip.budgetStatus.label} {fmt(wip.budgetStatus.amount)}
                </BreakdownStatus>
              )}
            </>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHeader>
            <SectionTitle>Invoice Summary Breakdown</SectionTitle>
            <SectionAmount>{fmt(invoiceSummary.total)}</SectionAmount>
          </SectionHeader>
          {generalStatsLoading && !generalStats ? (
            <div className="text-center py-3" style={{ color: colors.textMuted }}>Loading invoice summary…</div>
          ) : (
            <>
              <StackedBarWrapper ref={invoiceBarRef}>
                <StackedBarTrack>
                  <StackedBarSegment $color={colors.pastelGreen} $pct={invInvPct}
                    onMouseMove={(e) => handleChartHover(e, "invoice-invoiced", "Invoiced", `${fmt(invoiceSummary.invoiced)} · ${invInvPct}%`, invoiceBarRef.current)}
                    onMouseLeave={clearChartHover}
                  />
                  <StackedBarSegment $color={colors.pastelBlue}  $pct={invRemPct}
                    onMouseMove={(e) => handleChartHover(e, "invoice-remaining", "Remaining Forecast", `${fmt(invoiceSummary.remainingForecast)} · ${invRemPct}%`, invoiceBarRef.current)}
                    onMouseLeave={clearChartHover}
                  />
                </StackedBarTrack>
                {(chartHover?.key === "invoice-invoiced" || chartHover?.key === "invoice-remaining") && (
                  <Tooltip x={chartHover.x} y={chartHover.y} title={chartHover.title} description={chartHover.description} />
                )}
              </StackedBarWrapper>
              <BreakdownLegend>
                <BreakdownLegendItem>
                  <LegendDot $color={colors.pastelGreen} />
                  <LegendLabel>Invoiced</LegendLabel>
                  <LegendValue>{fmt(invoiceSummary.invoiced)}</LegendValue>
                </BreakdownLegendItem>
                <BreakdownLegendItem>
                  <LegendDot $color={colors.pastelBlue} />
                  <LegendLabel>Remaining Forecast</LegendLabel>
                  <LegendValue>{fmt(invoiceSummary.remainingForecast)}</LegendValue>
                </BreakdownLegendItem>
              </BreakdownLegend>
              {invoiceSummary.earningBurningStatus && (
                <BreakdownStatus $good={!invoiceSummary.earningBurningStatus.isBurningMore}>
                  <i className="bi bi-graph-up" />
                  {invoiceSummary.earningBurningStatus.label} {fmt(invoiceSummary.earningBurningStatus.amount)}
                </BreakdownStatus>
              )}
            </>
          )}
        </SectionCard>
      </TwoCol>

      {/* ── Row 6: Burndown — half width, left ──────────────────────── */}
      {/* Burndown · Scope vs Effort — hidden for now (mock data), see MOCK burndown data above
      <TwoCol>
        <SectionCard>
          <SectionHeader>
            <SectionTitle>Burndown · Scope vs Effort</SectionTitle>
          </SectionHeader>
          <BurndownLegend>
            {[
              { label: "Ideal",    color: colors.textMuted,   dashed: true  },
              { label: "Actual",   color: colors.accentBlue,  dashed: false },
              { label: "Forecast", color: colors.accentRed,   dashed: true  },
            ].map((l) => (
              <BurndownLegendItem key={l.label}>
                <BurndownLineSwatch $color={l.color} $dashed={l.dashed} />
                {l.label}
              </BurndownLegendItem>
            ))}
          </BurndownLegend>
          <BurndownWrap>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
              {[0, 25, 50, 75, 100].map((v) => (
                <text key={v} x={PAD.l - 6} y={toSvgY(v / 100) + 4} textAnchor="end" fontSize={10} fill={colors.textMuted}>{v}%</text>
              ))}
              {[0, 25, 50, 75, 100].map((v) => (
                <line key={v} x1={PAD.l} x2={PAD.l + cw} y1={toSvgY(v / 100)} y2={toSvgY(v / 100)} stroke={colors.borderLight} strokeWidth={1} />
              ))}
              <line x1={toSvgX(0.55)} x2={toSvgX(0.55)} y1={PAD.t} y2={PAD.t + ch} stroke={colors.accentBlue} strokeWidth={1} strokeDasharray="4 3" opacity={0.5} />
              <text x={toSvgX(0.55) + 4} y={PAD.t + 12} fontSize={10} fill={colors.accentBlue}>today</text>
              <path d={pathD(xPts, ideal)} fill="none" stroke={colors.textMuted} strokeWidth={1.5} strokeDasharray="5 4" />
              <path d={pathD(xPts.slice(0, actual.length), actual)} fill="none" stroke={colors.accentBlue} strokeWidth={2} />
              <path d={pathD(forecastX, forecast)} fill="none" stroke={colors.accentRed} strokeWidth={1.5} strokeDasharray="5 4" />
            </svg>
          </BurndownWrap>
          <BurndownNote>At current pace project ends ~2 days late. Consider reallocating Mele to Stormwater drafting.</BurndownNote>
        </SectionCard>
      </TwoCol>
      */}
    </GeneralGrid>
  );
}

export default General;
