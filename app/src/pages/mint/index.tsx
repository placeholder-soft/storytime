import { FC } from "react";
import { Header, PageContainer } from "../../components/Layout/Layout";
import storyImg from "./_/story.png";
import styled from "styled-components";

export const StyledPageContainer = styled(PageContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
`;

const StyledMintTitle = styled.div`
  color: #000;
  text-align: center;
  font-family: Inter;
  font-size: 60px;
  font-weight: 600;
  line-height: 60px;
  letter-spacing: -1px;
`;

const StyledMintSubTitle = styled.div`
  color: #000;
  font-family: Inter;
  font-size: 25px;
  font-weight: 600;
  line-height: 24px;
 `

const StyledMintImg = styled.img`
  margin-top: 47px;
  margin-bottom: 29px;
`
const StyledMintButton = styled.div`
  padding: 4px 25px;
  border-radius: 10px;
  background: #000;
  cursor: pointer;
  color: #fff;
  margin-top: 29px;
`


const MinStoryPage: FC = () => {
  return (
    <div>
      <Header />
      <StyledPageContainer>
        <StyledMintTitle>Mint your story</StyledMintTitle>
        <StyledMintImg src={storyImg} alt="" />
        <StyledMintSubTitle>The Journey to Dragon’s Keep</StyledMintSubTitle>
        <StyledMintButton>MINT STORY</StyledMintButton>
      </StyledPageContainer>
    </div>
  );
};

export default MinStoryPage;
