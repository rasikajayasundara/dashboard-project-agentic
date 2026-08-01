import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { snackbarAction } from "../../store/snackbarSlice";
import {
  TYPE,
  Wrapper, SnackbarBox, AccentBar,
  IconWrap, Body, Label, Message,
  CloseBtn,
} from "./component.styles";

const DURATION = 4000;

const IconSuccess = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5.5 9l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconError = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 6l6 6M12 6l-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

const IconWarning = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 2L16.5 15H1.5L9 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M9 7.5v3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="9" cy="13" r="0.75" fill="currentColor" />
  </svg>
);

const IconInfo = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 8v5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="9" cy="5.5" r="0.85" fill="currentColor" />
  </svg>
);

const IconClose = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

const ICONS = {
  success: <IconSuccess />,
  error:   <IconError />,
  warning: <IconWarning />,
  info:    <IconInfo />,
};

const AppSnackbar = () => {
  const dispatch = useDispatch();
  const { open, message, type } = useSelector((state) => state.snackbar);
  const t = (type && TYPE[type]) ? type : "success";

  const close = () => dispatch(snackbarAction.hideSnackbar());

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(close, DURATION);
    return () => clearTimeout(timer);
  }, [open]);

  if (!open) return null;

  return (
    <Wrapper>
      <SnackbarBox $type={t}>
        <AccentBar $type={t} />
        <IconWrap $type={t}>{ICONS[t]}</IconWrap>
        <Body>
          <Label $type={t}>{TYPE[t].label}</Label>
          <Message>{message}</Message>
        </Body>
        <CloseBtn onClick={close} aria-label="Dismiss">
          <IconClose />
        </CloseBtn>
      </SnackbarBox>
    </Wrapper>
  );
};

export default AppSnackbar;
