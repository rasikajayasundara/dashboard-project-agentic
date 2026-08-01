import styled, { css } from "styled-components";

export const panelShadow = css`0 1px 2px rgba(31, 41, 66, 0.04), 0 10px 24px -10px rgba(31, 41, 66, 0.16)`;

export const PanelSurface = styled.div`
  background: #ffffff;
  border: 1px solid rgba(31, 41, 66, 0.03);
  border-radius: 14px;
  box-shadow: ${panelShadow};
`;
