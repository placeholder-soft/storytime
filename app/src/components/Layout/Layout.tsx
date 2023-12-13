import styled from "styled-components";
import { FC, ReactNode } from "react";

const StyledHeaderName = styled.a`
  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 30px;
  letter-spacing: 3px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  text-decoration: none;
`;

export const Header: FC<{
  className?: string;
}> = (props) => {
  return (
    <StyledHeaderName className={props.className} href={"/"}>
      STORYTIME
    </StyledHeaderName>
  );
};

export const PageContainer = styled.div`
  background: #a9f868;
  display: flex;
  width: 100vw;
  min-height: 100vh;
  padding: 39px 66px;
  overflow: hidden;
  box-sizing: border-box;
`;

const StyledContentContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 1280px;
  margin: 0 auto;
`;

export const ContentContainer: FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <StyledContentContainer className={className}>
      <Header />
      {children}
    </StyledContentContainer>
  );
};
