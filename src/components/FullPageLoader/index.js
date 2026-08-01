import Layout from "../Layout";
import { SpinnerWrap, Spinner } from "./component.styles";

export default function FullPageLoader() {
  return (
    <Layout>
      <SpinnerWrap>
        <Spinner />
      </SpinnerWrap>
    </Layout>
  );
}
