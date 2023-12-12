import { useDispatch, useSelector } from "react-redux";
import { Container, Heading } from "@radix-ui/themes";
import {
  storySelector,
  currentSceneSelector,
} from "../modules/story/selectors";
import { updateStory } from "../modules/story/actions";
import { StoryProgressPromptRole } from "../types/story";

const Cover = () => {
  //   const { currentSceneIndex } = useSelector(storySelector);
  const { sceneTitle, sceneDescription, optionPrompt, options } =
    useSelector(currentSceneSelector);
  const dispatch = useDispatch();

  const onOptionClick = (val: string) => {
    dispatch(
      updateStory({
        message: { role: StoryProgressPromptRole.User, content: val },
      }),
    );
  };

  return (
    <Container>
      <Heading>{sceneTitle}</Heading>
      <Heading as="h4">{sceneDescription}</Heading>
      <Heading as="h4">{optionPrompt}</Heading>
      {options && options.length && (
        <ul>
          {options.map((option, oidx) => (
            <li key={oidx} onClick={() => onOptionClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
};

export default Cover;
