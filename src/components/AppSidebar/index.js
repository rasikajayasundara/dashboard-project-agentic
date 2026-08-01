import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BsSpeedometer2,
  BsCurrencyExchange,
  BsKanbanFill,
  BsBuildingFill,
  BsPeopleFill,
  BsReceiptCutoff,
  BsGearFill,
  BsBoxArrowLeft,
  BsBriefcaseFill,
  BsCheckSquare,
  BsFolderFill,
  BsClockHistory,
  BsClipboardCheck,
  BsGraphUp,
  BsChevronDown,
  BsList,
  BsX,
} from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { authAction } from "../../store/authSlice";
import { loginAction } from "../../store/LoginSlice";
import { usePermission } from "../../hooks/usePermission";
import {
  SidebarContainer,
  SidebarHeader,
  Logo,
  NavList,
  NavItem,
  NavAnchor,
  LogoutBtn,
  SidebarFooter,
  ParentNavBtn,
  ChevronIcon,
  SubMenuList,
  SubMenuAnchor,
  HamburgerBtn,
  Backdrop,
} from "./component.styles";

const MY_JOBS_PATHS = ["my-tasks", "my-projects", "my-timesheet", "my-performance"];

function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { permissions } = useSelector((s) => s?.login);

  const canProjectReadAll = usePermission("canProjectReadAll");
  const canClientRead = usePermission("canClientRead");
  const canEmployeeRead = usePermission("canEmployeeRead");
  const canTimesheetReview = usePermission("canTimesheetReview");
  const canInvoiceRead = permissions?.canInvoiceRead;

  const isMyJobsSection = MY_JOBS_PATHS.some((p) =>
    location.pathname.startsWith(`/${p}`)
  );

  const [myJobsOpen, setMyJobsOpen] = useState(isMyJobsSection);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isMyJobsSection) setMyJobsOpen(true);
  }, [isMyJobsSection]);

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
        <SidebarHeader>
          <Link to="/">
            <Logo src="/assets/images/logo-wt.png" alt="Logo" />
          </Link>
        </SidebarHeader>

        <NavList>
          <NavItem>
            <NavAnchor as={Link} to="/dashboard" $active={isActive("dashboard")} onClick={closeMobileMenu}>
              <BsSpeedometer2 size={18} />
              <span>Dashboard</span>
            </NavAnchor>
          </NavItem>

          {canTimesheetReview && (
            <NavItem>
              <NavAnchor
                as={Link}
                to="/timesheet-approvals"
                $active={isActive("timesheet-approvals")}
                onClick={closeMobileMenu}
              >
                <BsClipboardCheck size={18} />
                <span>Timesheets Review</span>
              </NavAnchor>
            </NavItem>
          )}

          {/* My Jobs — collapsible */}
          <NavItem>
            <ParentNavBtn
              $active={isMyJobsSection}
              onClick={() => setMyJobsOpen((o) => !o)}
            >
              <BsBriefcaseFill size={18} />
              <span>My Jobs</span>
              <ChevronIcon $open={myJobsOpen}>
                <BsChevronDown size={12} />
              </ChevronIcon>
            </ParentNavBtn>

            <SubMenuList $open={myJobsOpen}>
              <NavItem>
                <SubMenuAnchor as={Link} to="/my-tasks" $active={isActive("my-tasks")} onClick={closeMobileMenu}>
                  <BsCheckSquare size={15} />
                  <span>My Tasks</span>
                </SubMenuAnchor>
              </NavItem>
              <NavItem>
                <SubMenuAnchor as={Link} to="/my-projects" $active={isActive("my-projects")} onClick={closeMobileMenu}>
                  <BsFolderFill size={15} />
                  <span>My Projects</span>
                </SubMenuAnchor>
              </NavItem>
              <NavItem>
                <SubMenuAnchor as={Link} to="/my-timesheet" $active={isActive("my-timesheet")} onClick={closeMobileMenu}>
                  <BsClockHistory size={15} />
                  <span>My Timesheets</span>
                </SubMenuAnchor>
              </NavItem>
              <NavItem>
                <SubMenuAnchor as={Link} to="/my-performance" $active={isActive("my-performance")} onClick={closeMobileMenu}>
                  <BsGraphUp size={15} />
                  <span>My Performance</span>
                </SubMenuAnchor>
              </NavItem>
            </SubMenuList>
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

          {canClientRead && (
            <NavItem>
              <NavAnchor
                as={Link}
                to="/clients"
                $active={isActive("clients", "client")}
                onClick={closeMobileMenu}
              >
                <BsBuildingFill size={18} />
                <span>Clients</span>
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

          {canInvoiceRead && (
            <NavItem>
              <NavAnchor
                as={Link}
                to="/invoices"
                $active={isActive("invoices")}
                onClick={closeMobileMenu}
              >
                <BsReceiptCutoff size={18} />
                <span>Invoices</span>
              </NavAnchor>
            </NavItem>
          )}

          <NavItem>
            <NavAnchor as={Link} to="/settings" $active={isActive("settings")} onClick={closeMobileMenu}>
              <BsGearFill size={18} />
              <span>Settings</span>
            </NavAnchor>
          </NavItem>

          <NavItem>
            <LogoutBtn onClick={handleLogout}>
              <BsBoxArrowLeft size={18} />
              <span>Logout</span>
            </LogoutBtn>
          </NavItem>
        </NavList>

        <SidebarFooter className="text-center">
          © {new Date().getFullYear()} ProjeX. All rights reserved. · Version{" "}
          {process.env.REACT_APP_RELEASE_VERSION}
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
}

export default AppSidebar;
