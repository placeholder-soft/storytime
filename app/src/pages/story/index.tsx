import { useDispatch, useSelector } from "react-redux";
import { characterNameSelector } from "../../modules/character/selectors";
import { characterTypeSelector } from "../../modules/character/selectors";
import { initStory } from "../../modules/story/actions";
import { getStoryTemplate } from "../../utils";
import { useEffect } from "react";
import { StoryProgressPromptRole } from "../../types/story";
import {
  storySelector,
  storyProgressSelector,
} from "../../modules/story/selectors";
import Scene from "../../components/Scene";
import Cover from "../../components/Cover";

const Story: React.FC = () => {
  const characterName = useSelector(characterNameSelector);
  const characterType = useSelector(characterTypeSelector);
  const template = getStoryTemplate({ characterName, characterType });
  const dispatch = useDispatch();
  const { title, currentSceneIndex } = useSelector(storySelector);
  const storyProgress = useSelector(storyProgressSelector);
  console.log(storyProgress);

  useEffect(() => {
    if (!title) {
      dispatch(
        initStory({
          initMessage: {
            role: StoryProgressPromptRole.System,
            content: template,
          },
        })
      );
    }
  }, [title]);

  return currentSceneIndex > 0 ? <Scene /> : <Cover />;
};

export default Story;
