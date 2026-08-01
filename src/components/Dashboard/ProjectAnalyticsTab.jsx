import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { format } from "date-fns";
import { 
  FiActivity, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiLayers, 
  FiPieChart, 
  FiClock,
  FiMoreHorizontal
} from "react-icons/fi";

import { getRequest } from "../../config/authAxios";
import {
  ANALYTICS_PROJECTS_SUMMARY,
  ANALYTICS_PROJECTS_LIST,
  ANALYTICS_PROJECTS_LEADERBOARD,
  ANALYTICS_PROJECTS_TIMELINE,
  ANALYTICS_PROJECTS_RISKS,
} from "../../config/apiPath";
import { formatCurrency } from "../../utils/format";
import { getApiErrorMessage } from "../../config/errorCodes";

const ANALYTICS_URL = process.env.REACT_APP_ANALYTICS_BASE_URL;

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const STATUS_FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "overdue", label: "Overdue" },
  { id: "completed", label: "Completed" },
  { id: "archived", label: "Archived" },
];

const SummaryCard = ({ label, value, description, tone, icon: Icon, isLarge }) => (
  <div className={`analytics-card ${tone ? `tone-${tone}` : ""}`}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
      <p className="card-label">{label}</p>
      {Icon && (
        <div style={{ 
          padding: '8px', 
          borderRadius: '8px', 
          background: 'var(--px-color-surface-subtle)',
          color: 'var(--px-color-text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={20} />
        </div>
      )}
    </div>
    <p className={`card-value ${isLarge ? "large-text" : ""}`}>{value}</p>
    <p className="card-note">{description}</p>
  </div>
);

const EmptyState = ({ message, compact }) => (
  <div className={`empty-state ${compact ? "empty-state--compact" : ""}`}>
    <span role="img" aria-label="info">
      
    </span>
    <p>{message}</p>
  </div>
);



export default function ProjectAnalyticsTab({ setToast }) {
  const [summary, setSummary] = useState(null);
  const [projects, setProjects] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [risks, setRisks] = useState([]);

  const [activeStatus, setActiveStatus] = useState("active");
  const [isLoading, setIsLoading] = useState(false);
  const [showAllBudgetProjects, setShowAllBudgetProjects] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const [riskPage, setRiskPage] = useState(1);
  const pageSize = 10;
  const isMountedRef = useRef(true);

  const loadProjectAnalytics = useCallback(async (page = 1) => {
    setIsLoading(true);
    setRiskPage(1);

    const requests = [
      getRequest(`${ANALYTICS_URL}${ANALYTICS_PROJECTS_SUMMARY}`),
      getRequest(`${ANALYTICS_URL}${ANALYTICS_PROJECTS_LIST}?page=${page}&page_size=${pageSize}`),
      getRequest(`${ANALYTICS_URL}${ANALYTICS_PROJECTS_LEADERBOARD}`),
      getRequest(`${ANALYTICS_URL}${ANALYTICS_PROJECTS_TIMELINE}`),
      getRequest(`${ANALYTICS_URL}${ANALYTICS_PROJECTS_RISKS}`),
    ];

    try {
      const [
        summaryResult,
        projectsResult,
        leaderboardResult,
        timelineResult,
        risksResult,
      ] = await Promise.allSettled(requests);

      if (!isMountedRef.current) {
        return;
      }

      const failedBuckets = [];

      if (summaryResult.status === "fulfilled") {
        setSummary(summaryResult.value ?? {});
      } else {
        failedBuckets.push("summary");
      }

      if (projectsResult.status === "fulfilled") {
        const payload = projectsResult.value;
        let items = [];

        if (Array.isArray(payload)) {
          items = payload;
        } else if (Array.isArray(payload?.items)) {
          items = payload.items;
        }

        setProjects(items);

        const total = typeof payload?.total === "number" ? payload.total : items.length;
        const resolvedPage =
          typeof payload?.page === "number" && payload.page > 0 ? payload.page : page;
        const pages = Math.max(1, Math.ceil(total / pageSize));

        setTotalProjects(total);
        setCurrentPage(resolvedPage);
        setTotalPages(pages);
      } else {
        failedBuckets.push("projects");
      }

      if (leaderboardResult.status === "fulfilled") {
        setLeaderboard(
          Array.isArray(leaderboardResult.value)
            ? leaderboardResult.value
            : []
        );
      } else {
        failedBuckets.push("leaderboard");
      }

      if (timelineResult.status === "fulfilled") {
        setTimeline(
          Array.isArray(timelineResult.value)
            ? timelineResult.value
            : []
        );
      } else {
        failedBuckets.push("timeline");
      }

      if (risksResult.status === "fulfilled") {
        setRisks(
          Array.isArray(risksResult.value)
            ? risksResult.value
            : []
        );
      } else {
        failedBuckets.push("risks");
      }

      if (failedBuckets.length === requests.length) {
        const primaryError =
          summaryResult.status === "rejected"
            ? getApiErrorMessage(summaryResult.reason)
            : "Failed to load dashboard data.";
        if (setToast) setToast({ message: primaryError, type: "failed" });
      } else if (failedBuckets.length > 0) {
        const msg = `Some sections are unavailable (${failedBuckets
          .map(capitalize)
          .join(", ")})`;
        if (setToast) setToast({ message: msg, type: "failed" });
      }
    } catch (err) {
      const msg = getApiErrorMessage(err);
      if (setToast) setToast({ message: msg, type: "failed" });
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [setToast]);

  useEffect(() => {
    isMountedRef.current = true;
    loadProjectAnalytics(1);
    return () => {
      isMountedRef.current = false;
    };
  }, [loadProjectAnalytics]);

  const filteredProjects = useMemo(() => {
    if (activeStatus === "all") {
      return projects;
    }

    return projects.filter((project) => {
      const status = (project?.status_category || "").toLowerCase();
      if (activeStatus === "active") {
        // Active view includes both active and overdue projects
        return status === "active" || status === "overdue";
      }
      return status === activeStatus;
    });
  }, [projects, activeStatus]);

  const budgetProjects = useMemo(() => {
    // Consider active-like projects (active + overdue) with allocated budget
    const activeLike = projects.filter((p) => {
      const status = (p?.status_category || "").toLowerCase();
      return status === "active" || status === "overdue";
    });

    const withBudget = activeLike.filter(
      (p) => Number(p?.total_allocated) > 0
    );

    if (!withBudget.length) return [];

    return [...withBudget].sort(
      (a, b) => Number(b?.total_allocated) - Number(a?.total_allocated)
    );
  }, [projects]);

  const budgetChartData = useMemo(() => {
    if (!budgetProjects.length) return null;

    const limit = 15;
    const projectsForChart = showAllBudgetProjects
      ? budgetProjects
      : budgetProjects.slice(0, limit);

    const allocated = projectsForChart.map(
      (p) => Number(p?.total_allocated) || 0
    );
    const burnt = projectsForChart.map(
      (p) => Number(p?.total_burnt) || 0
    );
    const remaining = allocated.map((alloc, index) => {
      const used = burnt[index] || 0;
      return Math.max(alloc - used, 0);
    });

    return {
      labels: projectsForChart.map((p) =>
        formatProjectLabel(p?.project_name || "Project")
      ),
      datasets: [
        {
          label: "  Remaining",
          data: remaining,
          backgroundColor: "rgba(69, 118, 209, 0.3)",
          borderColor: "rgba(69, 118, 209, 0.8)",
          borderWidth: 2,
          stack: "budget",
          borderRadius: 8,
        },
        {
          label: "  Burnt",
          data: burnt,
          backgroundColor: "rgba(245, 158, 11, 0.85)",
          borderColor: "rgba(245, 158, 11, 1)",
          borderWidth: 2,
          minBarLength: 2,
          stack: "budget",
          borderRadius: 8,
        },
      ],
    };
  }, [budgetProjects, showAllBudgetProjects]);

  const leaderboardChartData = useMemo(() => {
    if (!leaderboard.length) return null;
    const topManagers = leaderboard.slice(0, 6);

    return {
      labels: topManagers.map((m) => m?.manager_name || "Manager"),
      datasets: [
        {
          label: "  Completed",
          backgroundColor: "rgba(16, 185, 129, 0.85)",
          borderColor: "rgba(16, 185, 129, 1)",
          borderWidth: 2,
          data: topManagers.map((m) => Number(m?.completed_projects) || 0),
          borderRadius: 8,
        },
        {
          label: "  Active",
          backgroundColor: "rgba(69, 118, 209, 0.85)",
          borderColor: "rgba(69, 118, 209, 1)",
          borderWidth: 2,
          data: topManagers.map((m) => Number(m?.active_projects) || 0),
          borderRadius: 8,
        },
        {
          label: "  Overdue",
          backgroundColor: "rgba(239, 68, 68, 0.85)",
          borderColor: "rgba(239, 68, 68, 1)",
          borderWidth: 2,
          data: topManagers.map((m) => Number(m?.overdue_projects) || 0),
          borderRadius: 8,
        },
      ],
    };
  }, [leaderboard]);

  const timelineChartData = useMemo(() => {
    if (!timeline.length) return null;

    const items = timeline
      .filter((item) => item?.start && item?.end)
      .slice(0, 10);

    if (!items.length) return null;

    return {
      labels: items.map((item) => item?.name || "Project"),
      datasets: [
        {
          label: "Duration (days)",
          data: items.map((item) => {
            const start = new Date(item.start);
            const end = new Date(item.end);
            const diff = (end - start) / (1000 * 60 * 60 * 24);
            return diff > 0 ? Math.ceil(diff) : 0;
          }),
          backgroundColor: items.map((item) =>
            item?.status === "completed"
              ? "rgba(16, 185, 129, 0.85)"
              : "rgba(69, 118, 209, 0.85)"
          ),
          borderColor: items.map((item) =>
            item?.status === "completed"
              ? "rgba(16, 185, 129, 1)"
              : "rgba(69, 118, 209, 1)"
          ),
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    };
  }, [timeline]);

  const summaryCards = [
    {
      id: "active",
      label: "Active Projects",
      value: summary?.active_projects ?? 0,
      description: "Currently in progress",
      tone: "info",
      icon: FiActivity,
      isLarge: true,
    },
    {
      id: "overdue",
      label: "Overdue Projects",
      value: summary?.overdue_projects ?? 0,
      description: "Past the planned end date",
      tone: "warning",
      icon: FiClock,
      isLarge: true,
    },
    {
      id: "completed",
      label: "Completed Projects",
      value: summary?.completed_projects ?? 0,
      description: "Delivered successfully",
      tone: "positive", // Changed from 'info' to 'positive' for green color
      icon: FiCheckCircle,
      isLarge: true,
    },
    {
      id: "budget",
      label: "Total Budget",
      value: formatCurrency(summary?.total_budget_allocated || 0),
      description: "Allocated across all live projects",
      tone: "neutral",
      icon: FiLayers,
    },
    {
      id: "burnt",
      label: "Budget Burnt",
      value: formatCurrency(summary?.total_budget_burnt || 0),
      description: "Actual spend to date",
      tone: "danger",
      icon: FiPieChart,
    },
  ];

  const renderProjectsTable = () => {
    if (!filteredProjects.length) {
      return <EmptyState message="No projects found for this filter." />;
    }

    return (
      <div className="analytics-table-container">
        <div className="table-responsive">
          <table className="table table-borderless analytics-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Manager</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Budget</th>
                <th>Burnt</th>
                <th>Variance</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => {
                const varianceColor =
                  Number(project?.budget_variance) > 0 ? "text-danger" : "text-success";
                const rawStatus = (project?.status_category || "unknown").toLowerCase();
                const isOverdue = rawStatus === "overdue";
                const displayStatus = isOverdue ? "active" : rawStatus;
                const statusClass = `status-pill status-${rawStatus}`;

                return (
                  <tr key={project?.project_id ?? project?.project_name}>
                    <td>
                      <div style={{ fontWeight: 600 }}>
                        {(project?.project_name ?? "Untitled").replace('_', ' ')}
                      </div>
                    </td>
                    <td>{project?.client_name || "N/A"}</td>
                    <td>{project?.manager_name || "N/A"}</td>
                    <td>{formatDate(project?.start_date)}</td>
                    <td>{formatDate(project?.end_date)}</td>
                    <td>
                      <span className={statusClass}>{displayStatus}</span>
                    </td>
                    <td>{formatCurrency(project?.total_allocated || 0)}</td>
                    <td>{formatCurrency(project?.total_burnt || 0)}</td>
                    <td className={varianceColor}>
                      {Number(project?.budget_variance) > 0 ? "+" : ""}
                      {Number(project?.budget_variance || 0).toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="analytics-table-footer">
          <span>
            Page {currentPage} of {totalPages} ·{" "}
            {totalProjects} project{totalProjects === 1 ? "" : "s"}
          </span>
          <div className="pagination-controls">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => loadProjectAnalytics(currentPage - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => loadProjectAnalytics(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderRisks = () => {
    if (!risks.length) {
      return (
        <EmptyState
          message="No active risk alerts at this time."
          compact
        />
      );
    }

    const totalRiskPages = Math.max(1, Math.ceil(risks.length / pageSize));
    const paginatedRisks = risks.slice((riskPage - 1) * pageSize, riskPage * pageSize);

    return (
      <div className="analytics-table-container">
        <div className="table-responsive">
          <table className="table table-borderless analytics-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Manager</th>
                <th>Risk level</th>
                <th>Days overdue</th>
                <th>Budget overrun</th>
                <th>Alerts</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRisks.map((risk) => {
                const level = String(risk?.risk_level || "medium").toLowerCase();
                const pillClass = `risk-pill risk-${level}`;

                return (
                  <tr
                    key={`${risk?.project_id}-${risk?.risk_level}-${risk?.manager_name}`}
                  >
                    <td>
                      <div style={{ fontWeight: 600 }}>
                        {(risk?.project_name || "Untitled project").replace('_', ' ')}
                      </div>
                    </td>
                    <td>{risk?.manager_name || "N/A"}</td>
                    <td>
                      <span className={pillClass}>
                        {level.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {risk?.days_overdue
                        ? `${risk.days_overdue} day${
                            risk.days_overdue === 1 ? "" : "s"
                          }`
                        : "-"}
                    </td>
                    <td>
                      {risk?.budget_variance_pct
                        ? `${Number(risk.budget_variance_pct).toFixed(1)}%`
                        : "-"}
                    </td>
                    <td>
                      {Array.isArray(risk?.alerts) && risk.alerts.length
                        ? risk.alerts.join(" | ")
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="analytics-table-footer">
          <span>
            Page {riskPage} of {totalRiskPages} · {risks.length} risk{risks.length === 1 ? "" : "s"}
          </span>
          <div className="pagination-controls">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              disabled={riskPage <= 1}
              onClick={() => setRiskPage(prev => prev - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              disabled={riskPage >= totalRiskPages}
              onClick={() => setRiskPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="project-analytics-tab">
      {isLoading ? (
        <div className="loading-state">
          <div className="spinner-border text-primary" role="status" />
          <p>Loading project analytics…</p>
        </div>
      ) : (
        <>
          <section className="analytics-section">
            <header>
              <div>
                <h3 className="section-title">Project Analytics</h3>
              </div>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm refresh-btn"
                title="Refresh snapshot"
                aria-label="Refresh snapshot"
                onClick={() => {
                  loadProjectAnalytics(currentPage);
                }}
                disabled={isLoading}
              >
                <i className={`bi bi-arrow-clockwise ${isLoading ? "spinning" : ""}`} />
              </button>
            </header>

            <div className="analytics-card-grid">
              {summaryCards.map((card) => (
                <SummaryCard key={card.id} {...card} />
              ))}
            </div>
          </section>

          <section className="analytics-section">
            <header>
              <h3 className="section-title">Projects Overview</h3>
              <div
                className="status-filter"
                style={{ alignItems: "center", flexWrap: "wrap", gap: 8 }}
              >
                {STATUS_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    className={`filter-chip ${
                      activeStatus === filter.id ? "active" : ""
                    }`}
                    onClick={() => setActiveStatus(filter.id)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </header>
            {renderProjectsTable()}
          </section>

          <section className="analytics-grid">
            <div className="analytics-section">
              <header>
                <h3 className="section-title">Budget vs Actual Spend</h3>
              </header>
              {budgetChartData ? (
                <>
                  <div className="chart-fixed chart-fixed--tall">
                    <Bar
                      data={budgetChartData}
                        options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: "y",
                        scales: {
                          x: {
                            beginAtZero: true,
                            stacked: true,
                            grid: { display: false }, // Cleaner look
                            ticks: {
                              font: { family: 'Inter', size: 11 },
                              callback: (value) =>
                                `$${Number(value) >= 1000 ? value / 1000 + "k" : value}`,
                            },
                          },
                          y: {
                            stacked: true,
                            grid: { display: false },
                            ticks: { font: { family: 'Inter', size: 12, weight: '500' } },
                          },
                        },
                        plugins: {
                          legend: {
                            labels: {
                              font: { family: 'Inter', size: 12 },
                              usePointStyle: true,
                              boxWidth: 8,
                              padding: 20
                            }
                          }
                        }
                      }}
                    />
                  </div>
                  {budgetProjects.length > 15 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: 8,
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          setShowAllBudgetProjects((prev) => !prev)
                        }
                      >
                        {showAllBudgetProjects
                          ? "Show top projects only"
                          : "Show all projects"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <EmptyState
                  message="No budget data available for active projects."
                  compact
                />
              )}
            </div>

            <div className="analytics-section">
              <header>
                <h3 className="section-title">PM Leaderboard</h3>
              </header>
              {leaderboardChartData ? (
                <div className="chart-fixed chart-fixed--tall">
                  <Bar
                    data={leaderboardChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          stacked: false,
                          grid: { borderDash: [4, 4], color: '#f0f0f0' },
                          ticks: { font: { family: 'Inter', size: 11 } }
                        },
                        x: {
                          stacked: false,
                          grid: { display: false },
                          ticks: { font: { family: 'Inter', size: 11 } }
                        },
                      },
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            font: { family: 'Inter', size: 12 },
                            usePointStyle: true,
                            boxWidth: 8,
                            padding: 20
                          }
                        }
                      }
                    }}
                  />
                </div>
              ) : (
                <EmptyState message="No leaderboard data yet." compact />
              )}
            </div>
          </section>

          {/* <section className="analytics-section">
            <header>
              <h3 className="section-title">Project Timeline</h3>
            </header>
            {timelineChartData ? (
              <div className="chart-fixed chart-fixed--tall">
                <Bar
                  data={timelineChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: "y",
                    scales: {
                      x: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <EmptyState message="No timeline data yet." />
            )}
          </section> */}

          <section className="analytics-section">
            <header>
              <h3 className="section-title">Risk Alerts</h3>
            </header>
            {renderRisks()}
          </section>
        </>
      )}
    </div>
  );
}

function formatDate(value) {
  if (!value) return "N/A";
  try {
    return format(new Date(value), "MMM d, yyyy");
  } catch {
    return value;
  }
}


function capitalize(text) {
  if (typeof text !== "string" || !text.length) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatProjectLabel(name) {
  if (!name) return "Project";

  const MAX_LENGTH = 10;
  if (name.length <= MAX_LENGTH) return name;

  const [code, ...restParts] = name.split("_");
  const codeLabel = code || "";
  const rest = restParts.join(" ").trim();

  // If we don't have a clear code prefix, just hard‑truncate
  if (!codeLabel || !rest) {
    return `${name.slice(0, MAX_LENGTH - 1)}…`;
  }

  const remaining = MAX_LENGTH - codeLabel.length - 2; // space + ellipsis room
  if (remaining <= 0) {
    return `${codeLabel.slice(0, MAX_LENGTH - 1)}…`;
  }

  const truncatedRest =
    rest.length > remaining ? `${rest.slice(0, remaining - 1)}…` : rest;

  return `${codeLabel} ${truncatedRest}`;
}
