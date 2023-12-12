import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { toScene } from "../modules/story/actions";
import { storySelector } from "../modules/story/selectors";

const BackgroundImageContainer = styled.div<{ backgroundImageUrl: string }>`
  background-image: url(${(props) => props.backgroundImageUrl});
  background-size: cover;
  background-position: center;
  height: 100vh; // Full height of the viewport
  width: 100%; // Full width of the viewport
  display: flex;
  justify-content: center;
  align-items: center; // Center the content vertically and horizontally
  text-align: center;
`;

const Heading = styled.h1`
  font-size: 4rem; /* Large font size */
  color: white; /* White text color */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Text shadow for better readability */
`;

const Cover = () => {
  const { title, coverImage, currentSceneIndex } = useSelector(storySelector);
  const dispatch = useDispatch();

  const next = () => {
    dispatch(toScene({ index: currentSceneIndex + 1 }));
    // move to next scene
  };

  return (
    <BackgroundImageContainer backgroundImageUrl={coverImage} onClick={next}>
      <Heading>{title}</Heading>
    </BackgroundImageContainer>
    // <Container onClick={next}>
    //   <Heading>{title}</Heading>
    //   <img src={coverImage} />
    // </Container>
  );
};

export default Cover;
