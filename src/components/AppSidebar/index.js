import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BsSpeedometer2,
  BsCurrencyExchange,
  BsKanbanFill,
  BsPeopleFill,
  BsBoxArrowLeft,
  BsList,
  BsX,
} from "react-icons/bs";
import { useDispatch } from "react-redux";
import { authAction } from "../../store/authSlice";
import { loginAction } from "../../store/LoginSlice";
import { usePermission } from "../../hooks/usePermission";
import {
  SidebarContainer,
  NavList,
  NavItem,
  NavAnchor,
  LogoutBtn,
  SidebarFooter,
  HamburgerBtn,
  Backdrop,
} from "./component.styles";

function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const canProjectReadAll = usePermission("canProjectReadAll");
  const canEmployeeRead = usePermission("canEmployeeRead");

  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => {
    // loginReset must land before navigate() — Login's "already logged in"
    // redirect effect checks isLogInSuccess on mount, and RESET_STATE (fired
    // by the logoutStart saga after the network call resolves) is too late
    // to prevent it from bouncing back to /dashboard.
    dispatch(loginAction.loginReset());
    dispatch(authAction.logoutStart());
    navigate("/login");
  };

  const closeMobileMenu = () => setMobileOpen(false);

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  const isActive = (...paths) =>
    paths.some((p) => location.pathname.startsWith(`/${p}`));

  return (
    <>
      <HamburgerBtn
        onClick={() => setMobileOpen((o) => !o)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        {mobileOpen ? <BsX size={22} /> : <BsList size={22} />}
      </HamburgerBtn>

      {mobileOpen && <Backdrop onClick={closeMobileMenu} />}

      <SidebarContainer $mobileOpen={mobileOpen}>
        <NavList>
          <NavItem>
            <NavAnchor as={Link} to="/dashboard" $active={isActive("dashboard")} onClick={closeMobileMenu}>
              <BsSpeedometer2 size={18} />
              <span>Dashboard</span>
            </NavAnchor>
          </NavItem>

          {canProjectReadAll && (
            <NavItem>
              <NavAnchor
                as={Link}
                to="/projects"
                $active={isActive("project")}
                onClick={closeMobileMenu}
              >
                <BsKanbanFill size={18} />
                <span>Projects</span>
              </NavAnchor>
            </NavItem>
          )}

          {canEmployeeRead && (
            <NavItem>
              <NavAnchor
                as={Link}
                to="/employees"
                $active={isActive("employees", "employee")}
                onClick={closeMobileMenu}
              >
                <BsPeopleFill size={18} />
                <span>Employees</span>
              </NavAnchor>
            </NavItem>
          )}

          <NavItem>
            <LogoutBtn onClick={handleLogout}>
              <BsBoxArrowLeft size={18} />
              <span>Logout</span>
            </LogoutBtn>
          </NavItem>
        </NavList>

        <SidebarFooter className="text-center">
          © {new Date().getFullYear()} demo-dash. All rights reserved. · Version{" "}
          {process.env.REACT_APP_RELEASE_VERSION}
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
}

export default AppSidebar;
