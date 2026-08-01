import { useNavigate } from "react-router-dom";
import { Page, Card, IconCircle, Title, Description, Actions, PrimaryBtn, FooterNote } from "./component.styles";

export default function AccessRestricted() {
  const navigate = useNavigate();

  return (
    <Page>
      <Card>
        <IconCircle>
          <i className="bi bi-shield-lock" />
        </IconCircle>

        <Title>Access Restricted</Title>

        <Description>
          You don't have permission to view this page.<br />
          Contact your administrator if you think this is a mistake.
        </Description>

        <Actions>
          <PrimaryBtn onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </PrimaryBtn>
        </Actions>

        <FooterNote>
          Need help? <a href="/support">Contact support</a>
        </FooterNote>
      </Card>
    </Page>
  );
}
