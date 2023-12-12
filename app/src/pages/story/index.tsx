import { useDispatch, useSelector } from "react-redux";
import { Container } from "@radix-ui/themes";
import { characterNameSelector } from "../../modules/character/selectors";
import { initStory } from "../../modules/story/actions";
import { getStoryTemplate } from "../../utils";
import { useEffect } from "react";
import { StoryProgressPromptRole } from "../../types/story";
import { storyProgressSelector } from "../../modules/story/selectors";

const Story: React.FC = () => {
  const characterName = useSelector(characterNameSelector);
  const template = getStoryTemplate(characterName);
  const dispatch = useDispatch();
  const storyProgress = useSelector(storyProgressSelector);
  console.log(storyProgress);

  useEffect(() => {
    dispatch(
      initStory({
        initMessage: {
          role: StoryProgressPromptRole.System,
          content: template,
        },
      })
    );
  }, []);

  return <Container>OYOYO</Container>;
};

export default Story;
