import PageBanner from "../PageBanner";
import { APP_ENV } from "../../config/environment";
import { NoticeWrap } from "./component.styles";

const ENV_NOTICE = {
  development: {
    type: "info",
    title: "Development:",
    message:
      "This is a development environment — data here is for internal testing only and may change or be reset at any time.",
  },
  uat: {
    type: "warning",
    title: "UAT:",
    message:
      "This is a UAT (testing) environment — data here is for testing purposes only and may be reset at any time.",
  },
  sandbox: {
    type: "sandbox",
    title: "Sandbox:",
    message:
      "Please note that this is a sandbox environment and all data here is for demonstration purposes only.",
  },
};

export default function EnvironmentNotice() {
  const notice = ENV_NOTICE[APP_ENV];
  if (!notice) return null;

  return (
    <NoticeWrap>
      <PageBanner type={notice.type} title={notice.title} message={notice.message} />
    </NoticeWrap>
  );
}
