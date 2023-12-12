import { useDispatch, useSelector } from "react-redux";
import { Container, Heading } from "@radix-ui/themes";
import { toScene } from "../modules/story/actions";
import { storySelector } from "../modules/story/selectors";

const Cover = () => {
  const { title, currentSceneIndex } = useSelector(storySelector);
  const dispatch = useDispatch();

  const next = () => {
    dispatch(toScene({ index: currentSceneIndex + 1 }));
    // move to next scene
  };

  return (
    <Container onClick={next}>
      <Heading>{title}</Heading>
      <Heading as="h4">image here</Heading>
    </Container>
  );
};

export default Cover;
