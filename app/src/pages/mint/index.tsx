import { FC } from "react";
import { PageContainer } from "../../components/Layout/Layout";
import storyImg from "./_/story.png";
import styled from "styled-components";
import {
  StyledContentContainer,
  StyledDescription,
  StyledStoryContainer,
  StyledStoryImage,
  StyledStoryItem,
  StyledStoryItemTitle,
  StyledStoryTitle,
  StyledTitleContainer,
} from "../dashboard";
import { Button } from "@radix-ui/themes";

const StyledInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  justify-content: center;
`;

const StyledCreateButton = styled(Button)`
  color: #fff;
  width: 149px;
  height: 32px;
  border-radius: 10px;
  background: #000;
  text-align: center;
  cursor: pointer;

  &:hover {
    background: #363636;
  }
`;

const MinStoryPage: FC = () => {
  return (
    <PageContainer>
      <StyledContentContainer>
        <StyledTitleContainer>
          <StyledStoryTitle>Mint your story</StyledStoryTitle>
        </StyledTitleContainer>
        <StyledStoryContainer>
          <StyledStoryItem>
            <StyledStoryImage src={storyImg} alt="" />
            <StyledInfoContainer>
              <StyledStoryItemTitle>
                The Journey to Dragon’s Keep
              </StyledStoryItemTitle>
              <StyledDescription>
                A playful and bold collage of colors and shapes, blending a
                retro feel with modern design principles to evoke creativity and
                the joy of building something unique and impactful.
              </StyledDescription>
              <StyledCreateButton>Mint Story</StyledCreateButton>
            </StyledInfoContainer>
          </StyledStoryItem>
        </StyledStoryContainer>
      </StyledContentContainer>
    </PageContainer>
  );
};

export default MinStoryPage;
