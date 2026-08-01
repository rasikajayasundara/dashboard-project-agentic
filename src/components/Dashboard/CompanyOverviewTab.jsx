import React, { useEffect, useMemo, useState } from "react";
import { Bar, Doughnut, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { format } from "date-fns";
import { 
  FiGrid, 
  FiBriefcase, 
  FiUsers, 
  FiDollarSign, 
  FiFileText 
} from "react-icons/fi";

import { getRequest } from "../../config/authAxios";
import {
  ANALYTICS_COMPANY_OVERVIEW,
  ANALYTICS_COMPANY_LOCATIONS,
  ANALYTICS_COMPANY_REVENUE,
  ANALYTICS_COMPANY_FINANCIAL_TRENDS,
  ANALYTICS_COMPANY_INVOICES_OUTSTANDING,
} from "../../config/apiPath";
import { formatCurrency } from "../../utils/format";
import { getApiErrorMessage } from "../../config/errorCodes";

const ANALYTICS_URL = process.env.REACT_APP_ANALYTICS_BASE_URL;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const PERIOD_FILTERS = [
  { id: null, label: "All Time" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "quarter", label: "This Quarter" },
  { id: "year", label: "This Year" },
];

const GRANULARITY_FILTERS = [
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
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



export default function CompanyOverviewTab({ setToast }) {
  const [overview, setOverview] = useState({});
  const [locations, setLocations] = useState([]);
  const [revenue, setRevenue] = useState({});
  const [revenuePage, setRevenuePage] = useState(1);
  const [outstandingProjectsPage, setOutstandingProjectsPage] = useState(1);
  const [outstandingClientsPage, setOutstandingClientsPage] = useState(1);
  const [outstandingLocationsPage, setOutstandingLocationsPage] = useState(1);
  const pageSize = 10;
  const [financialTrends, setFinancialTrends] = useState([]);
  const [outstandingInvoices, setOutstandingInvoices] = useState({});

  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [currentGranularity, setCurrentGranularity] = useState("weekly");
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Build query string for period filters - only include custom dates if both are set
  const buildQueryString = useMemo(() => {
    const params = new URLSearchParams();
    if (currentPeriod) params.append("period", currentPeriod);
    // Only add custom dates if both are set
    if (customStartDate && customEndDate) {
      params.append("start_date", customStartDate);
      params.append("end_date", customEndDate);
    }
    return params.toString() ? `?${params.toString()}` : "";
  }, [currentPeriod, customStartDate, customEndDate]);

  useEffect(() => {
    let isMounted = true;

    // Only load if we have a valid filter (period OR both custom dates)
    const hasValidFilter = currentPeriod !== null || (customStartDate && customEndDate);
    
    // If we're setting custom dates but don't have both yet, don't load
    if (!hasValidFilter && (customStartDate || customEndDate)) {
      return;
    }

    const loadCompanyOverview = async () => {
      setIsLoading(true);

      const query = buildQueryString;

      const requests = [
        getRequest(`${ANALYTICS_URL}${ANALYTICS_COMPANY_OVERVIEW}${query}`),
        getRequest(`${ANALYTICS_URL}${ANALYTICS_COMPANY_LOCATIONS}${query}`),
        getRequest(`${ANALYTICS_URL}${ANALYTICS_COMPANY_REVENUE}${query}`),
        getRequest(
          `${ANALYTICS_URL}${ANALYTICS_COMPANY_FINANCIAL_TRENDS}${query ? query + "&" : "?"}granularity=${currentGranularity}`
        ),
        getRequest(`${ANALYTICS_URL}${ANALYTICS_COMPANY_INVOICES_OUTSTANDING}${query}`),
      ];

      try {
        const [
          overviewResult,
          locationsResult,
          revenueResult,
          trendsResult,
          outstandingResult,
        ] = await Promise.allSettled(requests);

        if (!isMounted) {
          return;
        }

        const failedBuckets = [];

        if (overviewResult.status === "fulfilled") {
          setOverview(overviewResult.value ?? {});
        } else {
          failedBuckets.push("overview");
        }

        if (locationsResult.status === "fulfilled") {
          const data = Array.isArray(locationsResult.value?.locations)
            ? locationsResult.value.locations
            : [];
          setLocations(data);
        } else {
          failedBuckets.push("locations");
        }

        if (revenueResult.status === "fulfilled") {
          setRevenue(revenueResult.value ?? {});
        } else {
          failedBuckets.push("revenue");
        }

        if (trendsResult.status === "fulfilled") {
          const data = Array.isArray(trendsResult.value?.trends)
            ? trendsResult.value.trends
            : [];
          setFinancialTrends(data);
        } else {
          failedBuckets.push("trends");
        }

        if (outstandingResult.status === "fulfilled") {
          setOutstandingInvoices(outstandingResult.value ?? {});
        } else {
          failedBuckets.push("outstanding");
        }

        if (failedBuckets.length === requests.length) {
          const primaryError =
            overviewResult.status === "rejected"
              ? getApiErrorMessage(overviewResult.reason)
              : "Failed to load company overview data.";
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
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCompanyOverview();

    return () => {
      isMounted = false;
    };
  }, [buildQueryString, currentGranularity, currentPeriod, customStartDate, customEndDate]);

  const budgetChartData = useMemo(() => {
    if (!overview?.budget) return null;

    return {
      labels: ["  Budget Burnt", "  Budget Remaining"],
      datasets: [
        {
          data: [
            overview.budget.total_burnt || 0,
            overview.budget.total_remaining || 0,
          ],
          backgroundColor: [
            "rgba(245, 158, 11, 0.75)",
            "rgba(16, 185, 129, 0.75)",
          ],
          borderColor: ["rgba(245, 158, 11, 1)", "rgba(16, 185, 129, 1)"],
          borderWidth: 2,
        },
      ],
    };
  }, [overview]);

  const sortedLocations = useMemo(() => {
    return [...locations].sort((a, b) => (b.revenue || 0) - (a.revenue || 0));
  }, [locations]);

  const revenueByLocationChartData = useMemo(() => {
    if (!revenue?.by_location?.length) return null;

    return {
      labels: revenue.by_location.map((l) => l.location),
      datasets: [
        {
          data: revenue.by_location.map((l) => l.revenue || 0),
          backgroundColor: [
            "rgba(69, 118, 209, 0.85)",
            "rgba(59, 130, 246, 0.85)",
            "rgba(96, 165, 250, 0.85)",
            "rgba(0, 196, 179, 0.85)",
            "rgba(139, 92, 246, 0.85)",
            "rgba(236, 72, 153, 0.85)",
          ],
          borderColor: [
            "rgba(69, 118, 209, 1)",
            "rgba(59, 130, 246, 1)",
            "rgba(96, 165, 250, 1)",
            "rgba(0, 196, 179, 1)",
            "rgba(139, 92, 246, 1)",
            "rgba(236, 72, 153, 1)",
          ],
          borderWidth: 2,
        },
      ],
    };
  }, [revenue]);

  const { paginatedRevenueByClient, totalRevenuePages } = useMemo(() => {
    const clients = revenue?.by_client || [];
    const totalPages = Math.max(1, Math.ceil(clients.length / pageSize));
    const paginated = clients.slice(
      (revenuePage - 1) * pageSize,
      revenuePage * pageSize
    );
    return { paginatedRevenueByClient: paginated, totalRevenuePages: totalPages };
  }, [revenue, revenuePage]);

  const { paginatedOutstandingProjects, totalOutstandingProjectPages } = useMemo(() => {
    const items = outstandingInvoices?.by_project || [];
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const paginated = items.slice(
      (outstandingProjectsPage - 1) * pageSize,
      outstandingProjectsPage * pageSize
    );
    return { paginatedOutstandingProjects: paginated, totalOutstandingProjectPages: totalPages };
  }, [outstandingInvoices, outstandingProjectsPage]);

  const { paginatedOutstandingClients, totalOutstandingClientPages } = useMemo(() => {
    const items = outstandingInvoices?.by_client || [];
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const paginated = items.slice(
      (outstandingClientsPage - 1) * pageSize,
      outstandingClientsPage * pageSize
    );
    return { paginatedOutstandingClients: paginated, totalOutstandingClientPages: totalPages };
  }, [outstandingInvoices, outstandingClientsPage]);

  const { paginatedOutstandingLocations, totalOutstandingLocationPages } = useMemo(() => {
    const items = outstandingInvoices?.by_location || [];
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const paginated = items.slice(
      (outstandingLocationsPage - 1) * pageSize,
      outstandingLocationsPage * pageSize
    );
    return { paginatedOutstandingLocations: paginated, totalOutstandingLocationPages: totalPages };
  }, [outstandingInvoices, outstandingLocationsPage]);

  const revenueByClientChartData = useMemo(() => {
    if (!revenue?.by_client?.length) return null;
    const topClients = revenue.by_client.slice(0, 10);

    return {
      labels: topClients.map((c) =>
        c.client_name.length > 20
          ? c.client_name.substring(0, 20) + "..."
          : c.client_name
      ),
      datasets: [
        {
          label: "Revenue",
          data: topClients.map((c) => c.revenue || 0),
          backgroundColor: "rgba(69, 118, 209, 0.85)",
          borderColor: "rgba(69, 118, 209, 1)",
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    };
  }, [revenue]);

  const revenueTrendsChartData = useMemo(() => {
    if (!revenue?.trends?.length) return null;

    return {
      labels: revenue.trends.map((t) =>
        t.week_start ? formatDate(t.week_start) : `Week ${t.week_no || ""}`
      ),
      datasets: [
        {
          label: "  Revenue",
          data: revenue.trends.map((t) => t.revenue || 0),
          borderColor: "rgba(69, 118, 209, 1)",
          backgroundColor: "rgba(69, 118, 209, 0.15)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "rgba(69, 118, 209, 1)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [revenue]);

  const financialTrendsChartData = useMemo(() => {
    if (!financialTrends.length) return null;

    const labels = financialTrends.map((t) => {
      if (currentGranularity === "weekly") {
        return t.week_start ? formatDate(t.week_start) : `Week ${t.week_no || ""}`;
      } else {
        return t.month || "N/A";
      }
    });

    return {
      labels,
      datasets: [
        {
          label: "  Revenue",
          data: financialTrends.map((t) => t.revenue || 0),
          borderColor: "rgba(69, 118, 209, 1)",
          backgroundColor: "rgba(69, 118, 209, 0.15)",
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: "rgba(69, 118, 209, 1)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "  Budget",
          data: financialTrends.map((t) => t.budget || 0),
          borderColor: "rgba(139, 92, 246, 1)",
          backgroundColor: "rgba(139, 92, 246, 0.15)",
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: "rgba(139, 92, 246, 1)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "  Spent",
          data: financialTrends.map((t) => t.spent || 0),
          borderColor: "rgba(245, 158, 11, 1)",
          backgroundColor: "rgba(245, 158, 11, 0.15)",
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: "rgba(245, 158, 11, 1)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [financialTrends, currentGranularity]);

  const summaryCards = useMemo(() => {
    if (!overview) return [];

    return [
      {
        id: "projects",
        label: "Total Projects",
        value: overview.total_projects ?? 0,
        description: "Active projects",
        tone: "info",
        icon: FiGrid,
        isLarge: true,
      },
      {
        id: "clients",
        label: "Total Clients",
        value: overview.total_clients ?? 0,
        description: "Active clients",
        tone: "positive",
        icon: FiBriefcase,
        isLarge: true,
      },
      {
        id: "employees",
        label: "Total Employees",
        value: overview.total_employees ?? 0,
        description: "Active employees",
        tone: "warning",
        icon: FiUsers,
        isLarge: true,
      },
      {
        id: "revenue",
        label: "Total Revenue",
        value: formatCurrency(overview.revenue?.total_revenue || 0),
        description: "Company revenue",
        tone: "info",
        icon: FiDollarSign,
      },
      {
        id: "outstanding",
        label: "Outstanding Invoices",
        value: formatCurrency(
          overview.outstanding_invoices?.total_outstanding || 0
        ),
        description: "Amount owing",
        tone: "danger",
        icon: FiFileText,
      },
    ];
  }, [overview]);



  const clearCustomDateRange = () => {
    const startInput = document.getElementById("startDate");
    const endInput = document.getElementById("endDate");
    
    if (startInput) startInput.value = "";
    if (endInput) endInput.value = "";
    setCustomStartDate(null);
    setCustomEndDate(null);
    if (!currentPeriod) {
      setCurrentPeriod(null);
    }
  };

  const handlePeriodChange = (period) => {
    setCurrentPeriod(period);
    setCustomStartDate(null);
    setCustomEndDate(null);
    const startInput = document.getElementById("startDate");
    const endInput = document.getElementById("endDate");
    if (startInput) startInput.value = "";
    if (endInput) endInput.value = "";
  };

  return (
    <div className="project-analytics-tab">
      {isLoading ? (
        <div className="loading-state">
          <div className="spinner-border text-primary" role="status" />
          <p>Loading company overview…</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <section className="analytics-section">
            <header>
              <h3 className="section-title">Company Overview</h3>
              <div className="period-filter-container">
                <span className="period-filter-label">
                  Period:
                </span>
                <div className="period-filter-buttons">
                  {PERIOD_FILTERS.map((filter) => (
                    <button
                      key={filter.id || "all"}
                      type="button"
                      className={`filter-chip ${
                        currentPeriod === filter.id ? "active" : ""
                      }`}
                      onClick={() => handlePeriodChange(filter.id)}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                <div className="custom-date-section">
                  <input
                    type="date"
                    id="startDate"
                    className="date-input"
                    value={customStartDate || ""}
                    onChange={(e) => {
                      setCustomStartDate(e.target.value || null);
                      // Only clear period if we have both dates
                      if (e.target.value && customEndDate) {
                        setCurrentPeriod(null);
                      }
                    }}
                  />
                  <span className="date-separator">to</span>
                  <input
                    type="date"
                    id="endDate"
                    className="date-input"
                    value={customEndDate || ""}
                    onChange={(e) => {
                      setCustomEndDate(e.target.value || null);
                      // Only clear period if we have both dates
                      if (customStartDate && e.target.value) {
                        setCurrentPeriod(null);
                      }
                    }}
                  />
                  {(customStartDate || customEndDate) && (
                    <button
                      type="button"
                      className="clear-date-btn"
                      onClick={clearCustomDateRange}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </header>
            <div className="analytics-card-grid">
              {summaryCards.map((card) => (
                <SummaryCard key={card.id} {...card} />
              ))}
            </div>
          </section>

          {/* Budget Overview and Location Metrics Side by Side */}
          <div className="analytics-row">
            {/* Budget Overview */}
            <section className="analytics-section analytics-section--half">
              <header>
                <h3 className="section-title">Budget Overview</h3>
              </header>
              <div className="analytics-grid analytics-grid--compact">
                <div>
                  <h4
                    style={{
                      color: "#666",
                      fontSize: 14,
                      marginBottom: 10,
                      fontWeight: 600,
                    }}
                  >
                    Budget Breakdown
                  </h4>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#666",
                      marginBottom: 5,
                    }}
                  >
                    {formatCurrency(overview?.budget?.total_allocated || 0)}
                  </div>
                  <div style={{ color: "#999", fontSize: 12, marginBottom: 15 }}>
                    Budget Allocated
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#666",
                      marginBottom: 5,
                    }}
                  >
                    {formatCurrency(overview?.budget?.total_burnt || 0)}
                  </div>
                  <div style={{ color: "#999", fontSize: 12, marginBottom: 15 }}>
                    Budget Burnt
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#666",
                      marginBottom: 5,
                    }}
                  >
                    {formatCurrency(overview?.budget?.total_remaining || 0)}
                  </div>
                  <div style={{ color: "#999", fontSize: 12, marginBottom: 15 }}>
                    Budget Remaining
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginTop: 15,
                      color: "#f44336",
                    }}
                  >
                    {overview?.budget?.variance_percentage !== undefined
                      ? `${overview.budget.variance_percentage > 0 ? "+" : ""}${overview.budget.variance_percentage.toFixed(1)}%`
                      : "-"}
                  </div>
                  <div style={{ color: "#999", fontSize: 12 }}>Variance</div>
                </div>
                <div className="chart-fixed">
                  {budgetChartData ? (
                    <Doughnut
                      data={budgetChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                              display: true,
                              position: "bottom",
                              labels: {
                                padding: 20,
                                usePointStyle: true,
                                boxWidth: 10
                              }
                            },
                          tooltip: {
                            callbacks: {
                              label: function (context) {
                                let label = context.label || "";
                                if (label) {
                                  label += ": ";
                                }
                                label += formatCurrency(context.parsed);
                                return label;
                              },
                            },
                          },
                        },
                      }}
                    />
                  ) : (
                    <EmptyState message="Insufficient budget data." compact />
                  )}
                </div>
              </div>
            </section>

            {/* Location Metrics */}
            <section className="analytics-section analytics-section--half">
              <header>
                <h3 className="section-title">Location Metrics</h3>
              </header>
              {sortedLocations.length > 0 ? (
                <div className="table-responsive" style={{ padding: '0' }}>
                  <table
                    className="table table-borderless analytics-table analytics-table--compact"
                    style={{
                      marginBottom: 0,
                      width: "100%",
                      tableLayout: "fixed"
                    }}
                  >
                    <thead>
                      <tr>
                        <th style={{ width: "40px", paddingLeft: "10px" }}></th>
                        <th style={{ width: "35%" }}>Location</th>
                        <th style={{ textAlign: "center", width: "15%" }}>Projects</th>
                        <th style={{ textAlign: "center", width: "15%" }}>Employees</th>
                        <th style={{ textAlign: "right", paddingRight: "10px" }}>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedLocations.map((location, idx) => (
                        <tr
                          key={idx}
                          style={{
                            borderBottom:
                              idx < sortedLocations.length - 1
                                ? "1px solid #e5e7eb"
                                : "none",
                          }}
                        >
                          <td style={{ paddingLeft: "10px" }}>
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                background:
                                  "linear-gradient(135deg, #4576d1 0%, #3a5fc7 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#ffffff",
                                fontWeight: 700,
                                fontSize: 12,
                                flexShrink: 0,
                              }}
                            >
                              {location.location.charAt(0).toUpperCase()}
                            </div>
                          </td>
                          <td>
                            <div
                              style={{
                                fontWeight: 600,
                                color: "#666",
                                fontSize: 13,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                              }}
                              title={location.location}
                            >
                              {location.location}
                            </div>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <div
                              style={{
                                fontSize: 15,
                                fontWeight: 700,
                                color: "#2196F3",
                              }}
                            >
                              {location.project_count || 0}
                            </div>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <div
                              style={{
                                fontSize: 15,
                                fontWeight: 700,
                                color: "#FF9800",
                              }}
                            >
                              {location.employee_count || 0}
                            </div>
                          </td>
                          <td style={{ textAlign: "right", paddingRight: "10px" }}>
                            <div
                              style={{
                                fontSize: 15,
                                fontWeight: 700,
                                color: "#4CAF50",
                              }}
                            >
                              {formatCurrency(location.revenue || 0).replace(
                                /\.\d{2}/,
                                ""
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState message="No location data available." />
              )}
            </section>
          </div>

          {/* Revenue Analysis */}
          <section className="analytics-section">
            <header>
              <h3 className="section-title">Revenue Analysis</h3>
            </header>
            <div className="analytics-grid">
              <div className="chart-fixed">
                {revenueByLocationChartData ? (
                  <Pie
                    data={revenueByLocationChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: "bottom",
                          labels: {
                            padding: 20,
                            usePointStyle: true,
                            boxWidth: 10
                          }
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              let label = context.label || "";
                              if (label) {
                                label += ": ";
                              }
                              label += formatCurrency(context.parsed);
                              return label;
                            },
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <EmptyState message="Insufficient revenue data." compact />
                )}
              </div>
              <div className="chart-fixed chart-fixed--tall">
                {revenueByClientChartData ? (
                  <Bar
                    data={revenueByClientChartData}
                    options={{
                      indexAxis: "y",
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          beginAtZero: true,
                          ticks: {
                            callback: function (value) {
                              return "$" + (value / 1000).toFixed(0) + "k";
                            },
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              return formatCurrency(context.parsed.x);
                            },
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <EmptyState message="Insufficient revenue data." compact />
                )}
              </div>
            </div>
            {revenue?.by_client?.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div className="analytics-table-container">
                  <div className="table-responsive">
                    <table className="table table-borderless analytics-table">
                      <thead>
                        <tr>
                          <th>Client Name</th>
                          <th>Revenue</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedRevenueByClient.map((client, idx) => (
                          <tr key={idx}>
                            <td>{client.client_name}</td>
                            <td>{formatCurrency(client.revenue)}</td>
                            <td>
                              {(
                                (client.revenue / (revenue?.total_revenue || 1)) *
                                100
                              ).toFixed(1)}
                              %
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="analytics-table-footer">
                    <span>
                      Page {revenuePage} of {totalRevenuePages} ·{" "}
                      {revenue?.by_client?.length || 0} client
                      {(revenue?.by_client?.length || 0) === 1 ? "" : "s"}
                    </span>
                    <div className="pagination-controls">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        disabled={revenuePage <= 1}
                        onClick={() => setRevenuePage((prev) => prev - 1)}
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        disabled={revenuePage >= totalRevenuePages}
                        onClick={() => setRevenuePage((prev) => prev + 1)}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Revenue Trends */}
          <section className="analytics-section">
            <header>
              <h3 className="section-title">Revenue Trends</h3>
            </header>
            <div className="status-filter" style={{ marginBottom: 16 }}>
              <span style={{ fontWeight: 600, color: "#333", marginRight: 8 }}>
                Granularity:
              </span>
              {GRANULARITY_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={`filter-chip ${
                    currentGranularity === filter.id ? "active" : ""
                  }`}
                  onClick={() => setCurrentGranularity(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="chart-fixed chart-fixed--tall">
              {revenueTrendsChartData ? (
                <Line
                  data={revenueTrendsChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function (value) {
                            return "$" + (value / 1000).toFixed(0) + "k";
                          },
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: true,
                        position: "top",
                        labels: {
                          padding: 20,
                          usePointStyle: true,
                          boxWidth: 10
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            return "Revenue: " + formatCurrency(context.parsed.y);
                          },
                        },
                      },
                    },
                  }}
                />
              ) : (
                <EmptyState message="No revenue trends data available." />
              )}
            </div>
          </section>

          {/* Financial Trends */}
          <section className="analytics-section">
            <header>
              <h3 className="section-title">Financial Trends</h3>
            </header>
            <div className="chart-fixed chart-fixed--tall">
              {financialTrendsChartData ? (
                <Line
                  data={financialTrendsChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function (value) {
                            return "$" + (value / 1000).toFixed(0) + "k";
                          },
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: true,
                        position: "top",
                        labels: {
                          padding: 20,
                          usePointStyle: true,
                          boxWidth: 10
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            return (
                              context.dataset.label +
                              ": " +
                              formatCurrency(context.parsed.y)
                            );
                          },
                        },
                      },
                    },
                  }}
                />
              ) : (
                <EmptyState message="No financial trends data available." />
              )}
            </div>
          </section>

          <section className="analytics-section">
            <header>
              <h3 className="section-title">Outstanding Invoices</h3>
            </header>
            {outstandingInvoices?.note ? (
              <div className="empty-state">
                <p>{outstandingInvoices.note}</p>
              </div>
            ) : (
              <>
                <div className="summary-grid" style={{ marginBottom: 24 }}>
                  <div className="summary-card">
                    <div className="summary-card__icon" style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}>
                      <FiDollarSign size={20} />
                    </div>
                    <div className="summary-card__content">
                      <span className="summary-card__label">Total Outstanding</span>
                      <h2 className="summary-card__value">
                        {formatCurrency(outstandingInvoices?.total_outstanding || 0)}
                      </h2>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-card__icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
                      <FiBriefcase size={20} />
                    </div>
                    <div className="summary-card__content">
                      <span className="summary-card__label">Projects</span>
                      <h2 className="summary-card__value">
                        {outstandingInvoices?.by_project?.length || 0}
                      </h2>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-card__icon" style={{ backgroundColor: '#fff7ed', color: '#f59e0b' }}>
                      <FiUsers size={20} />
                    </div>
                    <div className="summary-card__content">
                      <span className="summary-card__label">Clients</span>
                      <h2 className="summary-card__value">
                        {outstandingInvoices?.by_client?.length || 0}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="analytics-row" style={{ marginTop: 24 }}>
                  <div className="analytics-section--half">
                    <header>
                      <h4 className="section-title">By Project</h4>
                    </header>
                    <div className="analytics-table-container">
                      <div className="table-responsive">
                        <table className="table table-borderless analytics-table analytics-table--compact" style={{ tableLayout: 'fixed' }}>
                          <thead>
                            <tr>
                              <th style={{ width: '70%', paddingLeft: '10px' }}>Project Name</th>
                              <th style={{ width: '30%', textAlign: 'right', paddingRight: '10px' }}>Outstanding</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedOutstandingProjects.map((project, idx) => (
                              <tr key={idx} style={{ borderBottom: idx < paginatedOutstandingProjects.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                <td style={{ paddingLeft: '10px', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={project.project_name}>
                                  {(project.project_name || "").replace('_', ' ')}
                                </td>
                                <td style={{ textAlign: 'right', paddingRight: '10px', fontWeight: 600 }}>
                                  {formatCurrency(project.outstanding || 0)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="analytics-table-footer">
                        <span>Page {outstandingProjectsPage} of {totalOutstandingProjectPages}</span>
                        <div className="pagination-controls">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            disabled={outstandingProjectsPage <= 1}
                            onClick={() => setOutstandingProjectsPage(p => p - 1)}
                          >
                            Previous
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            disabled={outstandingProjectsPage >= totalOutstandingProjectPages}
                            onClick={() => setOutstandingProjectsPage(p => p + 1)}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="analytics-section--half">
                    <header>
                      <h4 className="section-title">By Client</h4>
                    </header>
                    <div className="analytics-table-container">
                      <div className="table-responsive">
                        <table className="table table-borderless analytics-table analytics-table--compact" style={{ tableLayout: 'fixed' }}>
                          <thead>
                            <tr>
                              <th style={{ width: '70%', paddingLeft: '10px' }}>Client Name</th>
                              <th style={{ width: '30%', textAlign: 'right', paddingRight: '10px' }}>Outstanding</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedOutstandingClients.map((client, idx) => (
                              <tr key={idx} style={{ borderBottom: idx < paginatedOutstandingClients.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                <td style={{ paddingLeft: '10px', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={client.client_name}>
                                  {client.client_name || "Unassigned"}
                                </td>
                                <td style={{ textAlign: 'right', paddingRight: '10px', fontWeight: 600 }}>
                                  {formatCurrency(client.outstanding || 0)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="analytics-table-footer">
                        <span>Page {outstandingClientsPage} of {totalOutstandingClientPages}</span>
                        <div className="pagination-controls">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            disabled={outstandingClientsPage <= 1}
                            onClick={() => setOutstandingClientsPage(p => p - 1)}
                          >
                            Previous
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            disabled={outstandingClientsPage >= totalOutstandingClientPages}
                            onClick={() => setOutstandingClientsPage(p => p + 1)}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {outstandingInvoices?.by_location?.length > 0 && (
                  <div style={{ marginTop: 24 }}>
                    <header>
                      <h4 className="section-title">By Location</h4>
                    </header>
                    <div className="analytics-table-container">
                      <div className="table-responsive">
                        <table className="table table-borderless analytics-table analytics-table--compact" style={{ tableLayout: 'fixed' }}>
                          <thead>
                            <tr>
                              <th style={{ width: '70%', paddingLeft: '10px' }}>Location</th>
                              <th style={{ width: '30%', textAlign: 'right', paddingRight: '10px' }}>Outstanding</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedOutstandingLocations.map((location, idx) => (
                              <tr key={idx} style={{ borderBottom: idx < paginatedOutstandingLocations.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                <td style={{ paddingLeft: '10px', fontSize: '13px' }}>
                                  {location.location || "Unassigned"}
                                </td>
                                <td style={{ textAlign: 'right', paddingRight: '10px', fontWeight: 600 }}>
                                  {formatCurrency(location.outstanding || 0)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="analytics-table-footer">
                        <span>Page {outstandingLocationsPage} of {totalOutstandingLocationPages}</span>
                        <div className="pagination-controls">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            disabled={outstandingLocationsPage <= 1}
                            onClick={() => setOutstandingLocationsPage(p => p - 1)}
                          >
                            Previous
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            disabled={outstandingLocationsPage >= totalOutstandingLocationPages}
                            onClick={() => setOutstandingLocationsPage(p => p + 1)}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
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
