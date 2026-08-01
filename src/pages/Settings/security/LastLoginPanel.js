import {
  CardTitle, CardSubtitle,
  MetaList, MetaRow, MetaIcon, MetaText, SessionBadge,
} from "../component.styles";

// TODO: replace with Redux selector (state.auth.lastSession)
const LAST_LOGIN = {
  time:     "Today at 9:42 AM",
  device:   "MacBook Pro",
  browser:  "Chrome 124",
  ip:       "202.46.18.xx",
  location: "Wellington, NZ",
};

export default function LastLoginPanel() {
  return (
    <>
      <CardTitle>Last Login</CardTitle>
      <CardSubtitle>Your most recent account session</CardSubtitle>
      <MetaList>
        <MetaRow>
          <MetaIcon className="bi bi-clock" />
          <MetaText>
            {LAST_LOGIN.time} <SessionBadge>Current</SessionBadge>
          </MetaText>
        </MetaRow>
        <MetaRow>
          <MetaIcon className="bi bi-laptop" />
          <MetaText>
            {LAST_LOGIN.device} <span>{LAST_LOGIN.browser}</span>
          </MetaText>
        </MetaRow>
        <MetaRow>
          <MetaIcon className="bi bi-geo-alt" />
          <MetaText>
            {LAST_LOGIN.location} <span>{LAST_LOGIN.ip}</span>
          </MetaText>
        </MetaRow>
      </MetaList>
    </>
  );
}
