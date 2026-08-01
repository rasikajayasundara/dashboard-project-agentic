import Login from "./pages/Login";
import EmployeeList from "./pages/Employees";
import EmployeeDetail from "./pages/EmployeeDetail";
import ClientList from "./pages/Clients";
import InvoiceList from "./pages/Invoices";
import ForgotPassword from "./pages/Login/ForgotPassword";
import ResetAuth from "./pages/Login/ResetAuth";
import ResetPassword from "./pages/Login/ResetPassword";
import Settings from "./pages/Settings";
import ChangePassword from "./pages/Settings/security/ChangePassword";
import NotFoundPage from "./pages/NotFound";
import Dashboard from "./pages/DashboardHome";
import { Navigate, Route, Routes } from "react-router-dom";

import ProjectList from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import TimesheetApprovals from "./pages/TimesheetApprovals";
import { useInitialNavigation } from "./hooks/useLoginSync";
import AccessRestrictedPage from "./components/AccessRestricted";
import ClientDetail from "./pages/ClientDetail";
import SetPassword from "./pages/Login/SetPassword";

const RouteNavigation = () => {
  useInitialNavigation();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/projects" element={<ProjectList />} />
      <Route path="/project/:id" element={<ProjectDetail />} />
      <Route path="/timesheet-approvals" element={<TimesheetApprovals />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/employees" element={<EmployeeList />} />
      <Route path="/employee/:id" element={<EmployeeDetail />} />

      <Route path="/clients" element={<ClientList />} />
      <Route path="/client/:id" element={<ClientDetail />} />

      <Route path="/invoices" element={<InvoiceList />} />
      <Route path="/settings" element={<Settings />} />

      <Route path="/set-password" element={<SetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth-reset-password" element={<ResetAuth />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />

      <Route path="/my-tasks"       element={<EmployeeDetail myProfile defaultTab="tasks" />} />
      <Route path="/my-projects"    element={<EmployeeDetail myProfile defaultTab="projects" />} />
      <Route path="/my-timesheet"   element={<EmployeeDetail myProfile defaultTab="timesheets" />} />
      <Route path="/my-performance" element={<EmployeeDetail myProfile defaultTab="performance" />} />
      <Route path="/my-notifications" element={<EmployeeDetail myProfile defaultTab="notifications" />} />
      <Route path="/profile" element={<EmployeeDetail myProfile />} />

      <Route path="*" element={<NotFoundPage />} />
      <Route path="/forbidden" element={<AccessRestrictedPage />} />
    </Routes>
  );
};

export default RouteNavigation;
