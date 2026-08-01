import Login from "./pages/Login";
import EmployeeList from "./pages/Employees";
import EmployeeDetail from "./pages/EmployeeDetail";
import ForgotPassword from "./pages/Login/ForgotPassword";
import ResetAuth from "./pages/Login/ResetAuth";
import ResetPassword from "./pages/Login/ResetPassword";
import Settings from "./pages/Settings";
import ChangePassword from "./pages/Settings/security/ChangePassword";
import NotFoundPage from "./pages/NotFound";
import Dashboard from "./pages/DashboardHome";
import { Navigate, Route, Routes } from "react-router-dom";

import ProjectList from "./pages/Projects";
import { useInitialNavigation } from "./hooks/useLoginSync";
import AccessRestrictedPage from "./components/AccessRestricted";
import SetPassword from "./pages/Login/SetPassword";

const RouteNavigation = () => {
  useInitialNavigation();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/projects" element={<ProjectList />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/employees" element={<EmployeeList />} />

      <Route path="/settings" element={<Settings />} />

      <Route path="/set-password" element={<SetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth-reset-password" element={<ResetAuth />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />

      <Route path="/my-notifications" element={<EmployeeDetail myProfile defaultTab="notifications" />} />
      <Route path="/profile" element={<EmployeeDetail myProfile />} />

      <Route path="*" element={<NotFoundPage />} />
      <Route path="/forbidden" element={<AccessRestrictedPage />} />
    </Routes>
  );
};

export default RouteNavigation;
