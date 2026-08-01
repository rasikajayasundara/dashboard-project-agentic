import { Link } from "react-router-dom";
import {
  Page, Inner, TextSide, ImageSide,
  Heading, SubText, Actions, FooterNote, Copyright,
} from "./component.styles";
import ButtonStyled from "../../components/ButtonStyled";

export default function NotFoundPage() {
  return (
    <Page>
      <div>
        <Inner>
          <TextSide>
            <Heading>Oops! Looks like you took a wrong turn.</Heading>
            <SubText>
              This page doesn't exist — but don't worry, you can get back on track.
            </SubText>
            <Actions>
              <ButtonStyled as={Link} to="/dashboard">Go to Home</ButtonStyled>
            </Actions>
            <FooterNote>
              Need help? <a href="/support">Contact support</a>.
            </FooterNote>
          </TextSide>

          <ImageSide>
            <img src="/assets/images/404.png" alt="Page not found" />
          </ImageSide>
        </Inner>

        <Copyright>© {new Date().getFullYear()} ProjeX. All rights reserved.</Copyright>
      </div>
    </Page>
  );
}
