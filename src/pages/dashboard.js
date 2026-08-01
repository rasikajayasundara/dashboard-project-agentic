import React, { useMemo, useState } from "react";
import Sidebar from "../components/AppSidebar";
import Nav from "../components/AppNav";
import ProjectAnalyticsTab from "../components/Dashboard/ProjectAnalyticsTab";
import CompanyOverviewTab from "../components/Dashboard/CompanyOverviewTab";
import { useDispatch } from "react-redux";
import { snackbarAction } from "../store/snackbarSlice";

import { createGlobalStyle } from "styled-components";

/* eslint-disable no-unused-vars */
const DashboardStyles = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");
  .dashboard-layout{--px-color-primary:#2563EB;--px-color-primary-hover:#1D4ED8;--px-color-primary-light:#EFF6FF;--px-color-primary-dark:#1E40AF;--px-color-secondary:#4F46E5;--px-color-accent:#0EA5E9;--px-color-surface:#FFFFFF;--px-color-surface-subtle:#F3F4F6;--px-color-surface-hover:#F9FAFB;--px-color-border:#E5E7EB;--px-color-border-light:#F3F4F6;--px-color-text-primary:#666;--px-color-text-secondary:#6B7280;--px-color-text-muted:#9CA3AF;--px-color-success:#10B981;--px-color-success-light:#D1FAE5;--px-color-warning:#F59E0B;--px-color-warning-light:#FEF3C7;--px-color-danger:#EF4444;--px-color-danger-light:#FEE2E2;--px-color-info:#3B82F6;--px-color-info-light:#DBEAFE;--px-chart-primary:#2563EB;--px-chart-secondary:#4F46E5;--px-chart-tertiary:#0EA5E9;--px-chart-accent-1:#10B981;--px-chart-accent-2:#F59E0B;--px-chart-accent-3:#EF4444;--px-spacing-xs:4px;--px-spacing-sm:8px;--px-spacing-md:16px;--px-spacing-lg:24px;--px-spacing-xl:32px;--px-spacing-2xl:48px;--px-radius-sm:6px;--px-radius-md:12px;--px-radius-lg:16px;--px-radius-xl:24px;--px-radius-full:9999px;--px-shadow-xs:0 1px 2px rgba(0,0,0,0.05);--px-shadow-sm:0 1px 3px rgba(0,0,0,0.1),0 1px 2px rgba(0,0,0,0.06);--px-shadow-md:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06);--px-shadow-lg:0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05);--px-shadow-xl:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04);--px-shadow-focus:0 0 0 3px rgba(37,99,235,0.3);--px-transition-fast:150ms cubic-bezier(0.4,0,0.2,1);--px-transition-base:200ms cubic-bezier(0.4,0,0.2,1);--px-transition-slow:300ms cubic-bezier(0.4,0,0.2,1);display:flex;min-height:100vh;background-color:#fff}
  @media(max-width:768px){.dashboard-layout .dashboard-shell{margin-left:0;width:100%}}
  .dashboard-layout .dashboard-shell h1,.dashboard-layout .dashboard-shell h2,.dashboard-layout .dashboard-shell h3,.dashboard-layout .dashboard-shell h4,.dashboard-layout .dashboard-shell h5,.dashboard-layout .dashboard-shell h6{font-weight:600;line-height:1.3;color:var(--px-color-text-primary);margin:0}
  .dashboard-layout .dashboard-shell h1{font-size:2rem}.dashboard-layout .dashboard-shell h2{font-size:1.5rem}.dashboard-layout .dashboard-shell h3{font-size:1.25rem}.dashboard-layout .dashboard-shell h4{font-size:1.125rem}.dashboard-layout .dashboard-shell h5{font-size:1rem}.dashboard-layout .dashboard-shell h6{font-size:.875rem}
  .dashboard-layout .dashboard-shell p{margin:0;line-height:1.6}
  .dashboard-layout .dashboard-content{flex:1;overflow-y:auto;padding:var(--px-spacing-xl) var(--px-spacing-2xl);max-width:1600px;margin:0 auto;width:100%}
  .dashboard-layout .dashboard-tabs{display:flex;background:transparent;padding:0;margin-bottom:var(--px-spacing-xl);border-bottom:1px solid var(--px-color-border);width:100%;gap:8px;align-items:flex-end}
  .dashboard-layout .dashboard-tab-btn{border:none;border-bottom:2px solid transparent;background:transparent;padding:10px 20px;font-weight:600;font-size:14px;color:var(--px-color-text-secondary);border-radius:0;cursor:pointer;white-space:nowrap;position:relative;bottom:-1px}
  .dashboard-layout .dashboard-tab-btn:hover{background:#2055a4;color:#fff !important;border-bottom-color:transparent;border-radius:4px}
  .dashboard-layout .dashboard-tab-btn.active{background:transparent;color:#333;border-bottom:2px solid #2055a4;font-weight:600;border-radius:0}
  .dashboard-layout .dashboard-tab-btn.active:hover{background:#2055a4;color:#fff;border-bottom-color:transparent;border-radius:4px}
  .dashboard-layout .analytics-section{background:var(--px-color-surface);border:1px solid var(--px-color-border);border-radius:var(--px-radius-lg);padding:var(--px-spacing-xl);margin-bottom:var(--px-spacing-xl);display:flex;flex-direction:column;animation:slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards;opacity:0;transform:translateY(20px)}
  .dashboard-layout .analytics-row{display:flex;gap:var(--px-spacing-xl);margin-bottom:var(--px-spacing-xl);align-items:stretch}
  .dashboard-layout .analytics-section--half{flex:1;margin-bottom:0 !important;min-width:0}
  .dashboard-layout .analytics-section:nth-child(1){animation-delay:.1s}.dashboard-layout .analytics-section:nth-child(2){animation-delay:.2s}.dashboard-layout .analytics-section:nth-child(3){animation-delay:.3s}.dashboard-layout .analytics-section:nth-child(4){animation-delay:.4s}
  @keyframes slideUp{to{opacity:1;transform:translateY(0)}}
  .dashboard-layout .analytics-section header{display:flex;justify-content:space-between;align-items:center;gap:var(--px-spacing-lg);margin-bottom:var(--px-spacing-lg)}
  .dashboard-layout .section-title{font-size:18px;font-weight:700;color:var(--px-color-text-primary);margin:0;white-space:nowrap}
  .dashboard-layout .analytics-card-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:var(--px-spacing-lg);overflow-x:auto}
  @media(max-width:1400px){.dashboard-layout .analytics-card-grid{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}}
  .dashboard-layout .analytics-card{background:var(--px-color-surface);border-radius:var(--px-radius-lg);padding:16px;border:1px solid var(--px-color-border);display:flex;flex-direction:column;gap:8px;position:relative;overflow:hidden;min-height:140px;justify-content:space-between}
  .dashboard-layout .analytics-card .card-label{font-size:12px;font-weight:600;color:var(--px-color-text-secondary);text-transform:uppercase;letter-spacing:.05em}
  .dashboard-layout .analytics-card .card-value{font-size:20px;font-weight:800;color:var(--px-color-text-primary);line-height:1.1;letter-spacing:-.03em;white-space:nowrap}
  .dashboard-layout .analytics-card .card-value.large-text{font-size:32px}
  .dashboard-layout .analytics-card .card-note{font-size:11px;color:var(--px-color-text-muted);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .dashboard-layout .analytics-card.tone-positive .card-value{color:var(--px-color-success)}.dashboard-layout .analytics-card.tone-warning .card-value{color:var(--px-color-warning)}.dashboard-layout .analytics-card.tone-danger .card-value{color:var(--px-color-danger)}.dashboard-layout .analytics-card.tone-info .card-value{color:var(--px-color-info)}
  .dashboard-layout .summary-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--px-spacing-lg)}
  .dashboard-layout .summary-card{background:var(--px-color-surface);border:1px solid var(--px-color-border);border-radius:var(--px-radius-lg);padding:var(--px-spacing-lg);display:flex;align-items:center;gap:var(--px-spacing-lg)}
  .dashboard-layout .summary-card__icon{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .dashboard-layout .summary-card__label{font-size:13px;color:var(--px-color-text-secondary);font-weight:600;margin-bottom:4px}
  .dashboard-layout .summary-card__value{font-size:24px;font-weight:800;color:var(--px-color-text-primary);margin:0;letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .dashboard-layout .status-filter{display:flex;gap:12px;flex-wrap:wrap;align-items:center;background:var(--px-color-surface-subtle);padding:6px 12px;border-radius:var(--px-radius-full);position:relative}
  .dashboard-layout .filter-chip{border:none;background:transparent;color:var(--px-color-text-secondary);padding:6px 14px;border-radius:var(--px-radius-full);font-weight:600;font-size:12px;cursor:pointer}
  .dashboard-layout .filter-chip.active{background:var(--px-color-surface);color:var(--px-color-primary);box-shadow:var(--px-shadow-xs)}
  .dashboard-layout .analytics-table{width:100%;border-collapse:separate;border-spacing:0;margin-bottom:0;font-size:13px}
  .dashboard-layout .analytics-table thead th{background-color:#f5f5f5;color:#828181;font-weight:600;font-size:13px;padding:12px 20px;text-align:left;border-top:none;border-bottom:.5px solid #eeeeef;border-left:none;border-right:none;white-space:nowrap}
  .dashboard-layout .analytics-table tbody tr{background:var(--px-color-surface)}
  .dashboard-layout .analytics-table tbody tr:hover{background-color:#B1B1B1}
  .dashboard-layout .analytics-table tbody td{padding:12px 20px;color:#666;font-size:13px;vertical-align:middle;white-space:nowrap;border-top:.5px solid #eeeeef;border-bottom:.5px solid #eeeeef;border-left:none;border-right:none}
  .dashboard-layout .analytics-table tbody tr:last-child td{border-bottom:none}
  .dashboard-layout .analytics-table td:last-child,.dashboard-layout .analytics-table th:last-child{text-align:right}
  .dashboard-layout .status-pill{display:inline-flex;align-items:center;padding:4px 10px;border-radius:var(--px-radius-full);font-size:12px;font-weight:600;text-transform:capitalize}
  .dashboard-layout .status-pill.status-active{background:var(--px-color-info-light);color:var(--px-color-info)}.dashboard-layout .status-pill.status-completed{background:var(--px-color-success-light);color:var(--px-color-success)}.dashboard-layout .status-pill.status-overdue{background:var(--px-color-danger-light);color:var(--px-color-danger)}
  .dashboard-layout .analytics-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(400px,1fr));gap:var(--px-spacing-xl)}
  .dashboard-layout .chart-fixed{height:300px;width:100%;position:relative}
  .dashboard-layout .chart-fixed--tall{height:400px}
  .dashboard-layout .period-filter-container{display:flex;align-items:center;gap:8px;background:var(--px-color-surface-subtle);padding:4px 8px;border-radius:12px;border:1px solid var(--px-color-border);flex-wrap:nowrap;width:fit-content}
  .dashboard-layout .period-filter-buttons{display:flex;gap:6px}
  .dashboard-layout .date-input{border:1px solid var(--px-color-border);border-radius:8px;padding:6px 10px;font-size:12px;font-weight:500;color:var(--px-color-text-primary);background:var(--px-color-surface);max-width:135px;cursor:pointer}
  .dashboard-layout .empty-state{text-align:center;padding:48px;color:var(--px-color-text-secondary)}
  .dashboard-layout .loading-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px;gap:16px;color:var(--px-color-text-secondary)}
  .dashboard-layout .analytics-table-footer{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:var(--px-color-surface-subtle);border-top:1px solid var(--px-color-border);font-size:13px;color:var(--px-color-text-secondary);gap:12px;flex-wrap:wrap}
  .dashboard-layout .pagination-controls{display:flex;gap:8px}
  .dashboard-layout .pagination-controls .btn{border:1px solid #4576d1;color:#4576d1;background:white;border-radius:4px;padding:6px 12px;font-weight:500;min-width:32px}
  .dashboard-layout .pagination-controls .btn.active{background:#2563EB;color:white;border-color:#2563EB}
  .dashboard-layout .btn-primary{background:var(--px-color-primary);color:white;border-color:var(--px-color-primary)}
  .dashboard-layout .btn-outline-secondary{background:transparent;color:var(--px-color-text-secondary);border-color:var(--px-color-border)}
  .dashboard-layout .btn-sm{padding:6px 12px;font-size:13px}
  .dashboard-layout button:disabled,.dashboard-layout .btn:disabled{opacity:.5;cursor:not-allowed}
  .dashboard-layout .custom-toggle{display:inline-flex;align-items:center;cursor:pointer;gap:8px;user-select:none}
  .dashboard-layout .toggle-slider{width:36px;height:20px;background-color:var(--px-color-border);border-radius:999px;position:relative}
  .dashboard-layout .toggle-slider::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;background-color:white;border-radius:50%;box-shadow:0 1px 2px rgba(0,0,0,0.2)}
  .dashboard-layout .custom-toggle input{display:none}
  .dashboard-layout .custom-toggle input:checked+.toggle-slider{background-color:var(--px-color-primary)}
  .dashboard-layout .custom-toggle input:checked+.toggle-slider::after{transform:translateX(16px)}
  .dashboard-layout .toggle-label{font-size:13px;color:var(--px-color-text-secondary);font-weight:500;white-space:nowrap}
  .dashboard-layout .advanced-filters-panel{position:absolute;top:calc(100% + 8px);right:0;background:var(--px-color-surface);border:1px solid var(--px-color-border);box-shadow:var(--px-shadow-lg);border-radius:var(--px-radius-md);padding:16px;opacity:0;transform:translateY(-4px);pointer-events:none;z-index:50;min-width:200px}
  .dashboard-layout .advanced-filters-panel.visible{opacity:1;transform:translateY(0);pointer-events:auto}
  .dashboard-layout .filter-more-btn{width:32px;height:32px;border-radius:50%;border:1px solid transparent;background:transparent;color:var(--px-color-text-secondary);cursor:pointer;display:flex;align-items:center;justify-content:center}
`;

const TABS = [
  {
    id: "project",
    label: "Project Analytics",
    component: ProjectAnalyticsTab,
  },
  {
    id: "company",
    label: "Company Overview",
    component: CompanyOverviewTab,
  },
  // {
  //   id: "employee",
  //   label: "Employee Analytics",
  //   component: ComingSoon,
  // },
  // {
  //   id: "client",
  //   label: "Client Analytics",
  //   component: ComingSoon,
  // },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("project");
  const dispatch = useDispatch();
  const setToast = ({ message, type }) => dispatch(snackbarAction.showSnackbar({ message, type }));

  const ActiveTabComponent = useMemo(() => {
    const tab = TABS.find((item) => item.id === activeTab);
    return tab?.component || ComingSoon;
  }, [activeTab]);

  const activeLabel =
    TABS.find((item) => item.id === activeTab)?.label || "Dashboard";

  return (
    <>
    <DashboardStyles />
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-shell">
        <Nav />
        <main className="dashboard-content">

          <div className="dashboard-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`dashboard-tab-btn ${
                  tab.id === activeTab ? "active" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div aria-live="polite">
            <ActiveTabComponent title={activeLabel} setToast={setToast} />
          </div>
        </main>
      </div>
    </div>
    </>
  );
}

function ComingSoon({ title = "This tab" }) {
  return (
    <div className="analytics-section">
      <h3 style={{ marginTop: 0, color: "#111827" }}>{title}</h3>
      <p className="text-muted mb-0">This tab will unlock soon.</p>
    </div>
  );
}
