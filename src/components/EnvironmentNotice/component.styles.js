import styled from "styled-components";
import { colors } from "../../constants/common";

// Matches AppNav's own 24px horizontal padding so the banner's left edge
// lines up with the nav content above it. Backed with the page's own gray
// (not white) so it doesn't inherit HeaderWrapper's white nav background.
// overflow: hidden contains PageBanner's own margin-bottom inside this box
// instead of letting it collapse through onto HeaderWrapper's white below.
export const NoticeWrap = styled.div`
  padding: 10px 24px 0;
  background: ${colors.backgroundGray};
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 10px 12px 0;
  }
`;
