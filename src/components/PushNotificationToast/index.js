import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { pushNotificationAction } from "../../store/pushNotificationSlice";
import { notificationAction } from "../../store/notificationSlice";
import { Stack, ToastCard, IconCircle, Body, Title, Subtitle, CloseBtn } from "./component.styles";

const DURATION = 7000;

const IconSuccess = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3.5 8.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconError = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

const IconWarning = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2L15 14H1L8 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8 6.5v3.25" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="8" cy="11.75" r="0.75" fill="currentColor" />
  </svg>
);

const IconInfo = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 7v4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="8" cy="4.75" r="0.85" fill="currentColor" />
  </svg>
);

const IconClose = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

const ICONS = {
  success: <IconSuccess />,
  error: <IconError />,
  warning: <IconWarning />,
  info: <IconInfo />,
};

const ToastItem = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const remove = () =>
    dispatch(pushNotificationAction.removePushNotification({ id: item.id }));

  useEffect(() => {
    const timer = setTimeout(remove, DURATION);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  const type = ICONS[item.type] ? item.type : "success";

  const handleClick = () => {
    if (!item.deepLink) return;
    if (item.notificationId) {
      dispatch(notificationAction.markNotificationReadStart({ id: item.notificationId }));
    }
    navigate(item.deepLink);
    remove();
  };

  const handleClose = (e) => {
    e.stopPropagation();
    remove();
  };

  return (
    <ToastCard $clickable={!!item.deepLink} onClick={handleClick}>
      <IconCircle $type={type}>{ICONS[type]}</IconCircle>
      <Body>
        {item.title && <Title>{item.title}</Title>}
        <Subtitle>{item.message}</Subtitle>
      </Body>
      <CloseBtn onClick={handleClose} aria-label="Dismiss">
        <IconClose />
      </CloseBtn>
    </ToastCard>
  );
};

const PushNotificationToast = () => {
  const queue = useSelector((state) => state.pushNotifications.queue);

  if (!queue.length) return null;

  // Newest pushed item renders at the top of the visual stack.
  const stacked = [...queue].reverse();

  return (
    <Stack>
      {stacked.map((item) => (
        <ToastItem key={item.id} item={item} />
      ))}
    </Stack>
  );
};

export default PushNotificationToast;
