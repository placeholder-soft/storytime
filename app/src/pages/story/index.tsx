import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  characterNameSelector,
  characterTypeSelector,
  customCharacterTypeSelector,
} from "../../modules/character/selectors";
import { initStory } from "../../modules/story/actions";
import { getStoryTemplate } from "../../utils";
import { useEffect } from "react";
import { StoryProgressPromptRole } from "../../types/story";
import { storySelector } from "../../modules/story/selectors";
import Scene from "../../components/Scene";
import Cover from "../../components/Cover";
import { Header, PageContainer } from "../../components/Layout/Layout";

const StyledHeader = styled(Header)`
  top: 39px;
  left: 66px;
`;

const Story: React.FC = () => {
  const characterName = useSelector(characterNameSelector);
  const characterType = useSelector(characterTypeSelector);
  const customCharacterType = useSelector(customCharacterTypeSelector);
  const template = getStoryTemplate({
    characterName,
    characterType:
      characterType === "Custom" ? customCharacterType : characterType,
  });
  const dispatch = useDispatch();
  const { title, currentSceneIndex } = useSelector(storySelector);

  useEffect(() => {
    if (!title) {
      dispatch(
        initStory({
          initMessage: {
            role: StoryProgressPromptRole.System,
            content: template,
          },
        }),
      );
    }
  }, [title]);

  return (
    <PageContainer>
      <StyledHeader />
      {currentSceneIndex > 0 ? <Scene /> : <Cover />}
    </PageContainer>
  );
};

export default Story;
