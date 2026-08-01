/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { refreshToken } from "../config/authAxios";
import { authAction } from "../store/authSlice";
import { loginAction } from "../store/LoginSlice";
import { secureStorage } from "../utils/encryptedStorage";

const PUBLIC_ROUTES = [
  "/login",
  "/forgot-password",
  "/auth-reset-password",
  "/reset-password",
  "/set-password",
  "/forbidden",
];

const useAuthBootstrap = () => {
  const dispatch = useDispatch();

  // Skip the silent-refresh attempt on a public route unless there's local
  // evidence a session might still exist (set on login/refresh, cleared on
  // logout or a failed refresh) — otherwise every reload of the login page
  // fires a refresh call that's guaranteed to fail with "Refresh token is
  // required", since projex_rt is httpOnly and can't be checked directly.
  const isPublicRoute = PUBLIC_ROUTES.includes(window.location.pathname.toLowerCase());
  const hasSessionHint = !!secureStorage().getItem("hasSession");
  const shouldAttemptRefresh = !isPublicRoute || hasSessionHint;

  const [isBootstrapping, setIsBootstrapping] = useState(shouldAttemptRefresh);

  useEffect(() => {
    if (!shouldAttemptRefresh) return;
    refreshToken()
      .catch(() => {
        secureStorage().removeItem("hasSession");
        dispatch(authAction.clearTokens());
        dispatch(loginAction.loginReset());
      })
      .finally(() => setIsBootstrapping(false));
  }, []);

  return isBootstrapping;
};

const useInitialNavigation = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogInSuccess = useSelector((state) => state.login.isLogInSuccess);

  const navHandler = () => {
    const path = location.pathname.toLowerCase();
    const isPublic = PUBLIC_ROUTES.includes(path);

    if (!isLogInSuccess && !isPublic) {
      navigate("/login", { replace: true });
      return;
    }
  };

  useEffect(() => {
    navHandler();
  }, [location.pathname]);
};

const routePermissionMap = [
  { path: "/projects", key: "canProjectReadAll" },
];

const PermissionGuard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { permissions } = useSelector((state) => state.login);

  useEffect(() => {
    if (permissions) {
      const path = location.pathname;

      for (const route of routePermissionMap) {
        const isMatch = matchPath(route.path, path);
        if (isMatch && !permissions[route.key]) {
          navigate("/forbidden", { replace: true });
          break;
        }
      }
    }
  }, [location.pathname, permissions, navigate]);

  return null;
};

export { useAuthBootstrap, useInitialNavigation, PermissionGuard };
