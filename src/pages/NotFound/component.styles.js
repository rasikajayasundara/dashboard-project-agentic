import styled from "styled-components";
import { fontSize } from "../../constants/common";

export const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

export const Inner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 48px;
  max-width: 900px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    text-align: center;
  }
`;

export const TextSide = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ImageSide = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;

  img {
    max-height: 420px;
    width: 100%;
    object-fit: contain;
  }
`;

export const Heading = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f1724;
  margin: 0 0 12px;
`;

export const SubText = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 28px;
  line-height: 1.6;
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const FooterNote = styled.div`
  margin-top: 24px;
  font-size: ${fontSize.subtitle};
  color: #9ca3af;

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const Copyright = styled.div`
  text-align: center;
  font-size: ${fontSize.subtitle};
  color: #9ca3af;
  margin-top: 40px;
`;
