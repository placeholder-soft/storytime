import { useDispatch, useSelector } from "react-redux";
import { characterNameSelector } from "../../modules/character/selectors";
import { characterTypeSelector } from "../../modules/character/selectors";
import { initStory } from "../../modules/story/actions";
import { getStoryTemplate } from "../../utils";
import { useEffect } from "react";
import { StoryProgressPromptRole } from "../../types/story";
import { storySelector } from "../../modules/story/selectors";
import Scene from "../../components/Scene";
import Cover from "../../components/Cover";
import { PageContainer, Header } from "../../components/Layout/Layout";

const Story: React.FC = () => {
  const characterName = useSelector(characterNameSelector);
  const characterType = useSelector(characterTypeSelector);
  const template = getStoryTemplate({ characterName, characterType });
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
      <Header />
      {currentSceneIndex > 0 ? <Scene /> : <Cover />}
    </PageContainer>
  );
};

export default Story;
