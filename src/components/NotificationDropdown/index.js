import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiBell, FiCheck, FiFolder, FiUser, FiAlertCircle } from "react-icons/fi";
import { notificationAction } from "../../store/notificationSlice";
import { timeAgo } from "../../utils/dateMaker";
import {
  Wrapper, BellBtn, CountBadge, Panel, PanelHeader, HeaderLeft,
  PanelTitle, UnreadBadge, MarkAllBtn, NotifList, NotifItem,
  IconCircle, NotifBody, NotifTitle, NotifDesc, NotifTime,
  UnreadDot, EmptyState, EmptyText, EmptySubText, PanelFooter, ViewAllBtn,
} from "./component.styles";

const TYPE_STYLES = {
  task:    { icon: <FiCheck size={14} />,       bg: "#dcfce7", color: "#16a34a" },
  project: { icon: <FiFolder size={14} />,      bg: "#eff6ff", color: "#2563eb" },
  user:    { icon: <FiUser size={14} />,        bg: "#faf5ff", color: "#7c3aed" },
  alert:   { icon: <FiAlertCircle size={14} />, bg: "#fef2f2", color: "#dc2626" },
  default: { icon: <FiBell size={14} />,        bg: "#f3f4f6", color: "#6b7280" },
};

function NotificationDropdown() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef();

  const recentItems = useSelector((state) => state.notifications.recentItems);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      dispatch(notificationAction.getRecentNotificationsStart());
    }
  };

  const handleClickNotif = (notif) => {
    dispatch(notificationAction.markNotificationReadStart({ id: notif.id }));
    const deepLink = notif.dataJson?.deepLink;
    if (deepLink) {
      setOpen(false);
      navigate(deepLink);
    }
  };

  const markAllRead = () => {
    recentItems
      .filter((n) => n.status === 0)
      .forEach((n) => {
        dispatch(notificationAction.markNotificationReadStart({ id: n.id }));
      });
  };

  const handleSeeAll = () => {
    setOpen(false);
    navigate("/my-notifications");
  };

  return (
    <Wrapper ref={wrapperRef}>
      <BellBtn onClick={handleToggleOpen}>
        <FiBell size={18} />
        {unreadCount > 0 && (
          <CountBadge>{unreadCount > 9 ? "9+" : unreadCount}</CountBadge>
        )}
      </BellBtn>

      {open && (
        <Panel>
          <PanelHeader>
            <HeaderLeft>
              <PanelTitle>Notifications</PanelTitle>
              {unreadCount > 0 && <UnreadBadge>{unreadCount}</UnreadBadge>}
            </HeaderLeft>
            {unreadCount > 0 && (
              <MarkAllBtn onClick={markAllRead}>Mark all as read</MarkAllBtn>
            )}
          </PanelHeader>

          {recentItems.length === 0 ? (
            <EmptyState>
              <FiBell size={28} />
              <EmptyText>You're all caught up</EmptyText>
              <EmptySubText>No new notifications</EmptySubText>
            </EmptyState>
          ) : (
            <NotifList>
              {recentItems.map((notif) => {
                const typeKey = (notif.type || "").split("_")[0].toLowerCase();
                const s = TYPE_STYLES[typeKey] || TYPE_STYLES.default;
                const unread = notif.status === 0;
                return (
                  <NotifItem
                    key={notif.id}
                    $unread={unread}
                    onClick={() => handleClickNotif(notif)}
                  >
                    <IconCircle $bg={s.bg} $color={s.color}>{s.icon}</IconCircle>
                    <NotifBody>
                      <NotifTitle $unread={unread}>{notif.title}</NotifTitle>
                      {notif.message && (
                        <NotifDesc>{notif.message}</NotifDesc>
                      )}
                      {notif.createdAt && <NotifTime>{timeAgo(notif.createdAt)}</NotifTime>}
                    </NotifBody>
                    {unread && <UnreadDot />}
                  </NotifItem>
                );
              })}
            </NotifList>
          )}

          <PanelFooter>
            <ViewAllBtn onClick={handleSeeAll}>
              See all notifications
            </ViewAllBtn>
          </PanelFooter>
        </Panel>
      )}
    </Wrapper>
  );
}

export default NotificationDropdown;
