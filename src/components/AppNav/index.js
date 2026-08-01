import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiBell, FiSettings, FiLogOut, FiChevronDown } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { authAction } from "../../store/authSlice";
import { loginAction } from "../../store/LoginSlice";
import NotificationDropdown from "../NotificationDropdown";
import {
  NavBar,
  Greeting,
  NavRight,
  UserPillBtn,
  AvatarCircle,
  PillLabel,
  UserNameText,
  ChevronWrap,
  AnimatedBellWrap,
  DropdownCard,
  DropdownHeader,
  DropdownUserName,
  DropdownUserRole,
  DropdownItem,
  DropdownDivider,
} from "./component.styles";

function timeOfDayGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function AppNav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const profileRef = useRef();

  const { user } = useSelector((s) => s.login);
  const unreadCount = useSelector((s) => s.notifications.unreadCount);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const showTimer = setTimeout(() => setShowGreeting(true), 4000);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!showGreeting) return;
    const hideTimer = setTimeout(() => setShowGreeting(false), 60000);
    return () => clearTimeout(hideTimer);
  }, [showGreeting]);

  const handleLogout = () => {
    // loginReset must land before navigate() — Login's "already logged in"
    // redirect effect checks isLogInSuccess on mount, and RESET_STATE (fired
    // by the logoutStart saga after the network call resolves) is too late
    // to prevent it from bouncing back to /dashboard.
    dispatch(loginAction.loginReset());
    dispatch(authAction.logoutStart());
    navigate("/login");
  };

  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const initials =
    [firstName[0], lastName[0]].filter(Boolean).join("").toUpperCase() || "U";

  const greetingText = unreadCount > 0
    ? `${timeOfDayGreeting()}, ${firstName || "there"}! You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}.`
    : `${timeOfDayGreeting()}, ${firstName || "there"}! You're all caught up.`;

  return (
    <NavBar>
      <Greeting $visible={showGreeting}>{greetingText}</Greeting>

      <NavRight>
        <AnimatedBellWrap>
          <NotificationDropdown />
        </AnimatedBellWrap>

        <div style={{ position: "relative" }} ref={profileRef}>
          <UserPillBtn
            onClick={() => setShowProfileDropdown((prev) => !prev)}
          >
            <AvatarCircle>{initials}</AvatarCircle>
            <PillLabel>
              <UserNameText>{fullName || "User"}</UserNameText>
              <ChevronWrap $open={showProfileDropdown}>
                <FiChevronDown size={14} />
              </ChevronWrap>
            </PillLabel>
          </UserPillBtn>

          {showProfileDropdown && (
            <DropdownCard>
              <DropdownHeader>
                <DropdownUserName>{fullName || "User"}</DropdownUserName>
                {user?.role && (
                  <DropdownUserRole>{user.role}</DropdownUserRole>
                )}
              </DropdownHeader>

              <DropdownItem
                as={Link}
                to="/profile"
                onClick={() => setShowProfileDropdown(false)}
              >
                <FiUser size={15} />
                My Profile
              </DropdownItem>
              <DropdownItem
                as={Link}
                to="/my-notifications"
                onClick={() => setShowProfileDropdown(false)}
              >
                <FiBell size={15} />
                Notifications
              </DropdownItem>
              <DropdownItem
                as={Link}
                to="/settings"
                onClick={() => setShowProfileDropdown(false)}
              >
                <FiSettings size={15} />
                Settings
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem $danger onClick={handleLogout}>
                <FiLogOut size={15} />
                Logout
              </DropdownItem>
            </DropdownCard>
          )}
        </div>
      </NavRight>
    </NavBar>
  );
}

export default AppNav;
