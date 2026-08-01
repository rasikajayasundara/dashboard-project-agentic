import { BannerBox, IconWrap, BannerText, BannerTitle, CloseBtn } from "./component.styles";

const IconInfo = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="7.25" stroke="currentColor" strokeWidth="1.6" />
    <path d="M9 8.2v4.3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="9" cy="5.6" r="0.9" fill="currentColor" />
  </svg>
);

const IconWarning = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 2L16.5 15H1.5L9 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M9 7.5v3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="9" cy="13" r="0.75" fill="currentColor" />
  </svg>
);

const IconError = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="7.25" stroke="currentColor" strokeWidth="1.6" />
    <path d="M6 6l6 6M12 6l-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

const IconClose = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

const ICONS = {
  info: <IconInfo />,
  warning: <IconWarning />,
  error: <IconError />,
  sandbox: <IconWarning />,
};

const PageBanner = ({ type = "info", title, message, dismissible = false, onDismiss }) => {
  const t = ICONS[type] ? type : "info";

  return (
    <BannerBox $type={t}>
      <IconWrap $type={t}>{ICONS[t]}</IconWrap>
      <BannerText>
        {title && <BannerTitle>{title}</BannerTitle>}
        {message}
      </BannerText>
      {dismissible && (
        <CloseBtn onClick={onDismiss} aria-label="Dismiss">
          <IconClose />
        </CloseBtn>
      )}
    </BannerBox>
  );
};

export default PageBanner;
