import { useDispatch, useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";
import { toScene } from "../modules/story/actions";
import { storySelector } from "../modules/story/selectors";

const BackgroundImageContainer = styled.div<{ backgroundImageUrl: string }>`
  background-image: url(${(props) => props.backgroundImageUrl});
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
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

const Loader = styled.div`
  font-size: 2rem;
  color: white; /* White text color */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Text shadow for better readability */
`;

const Dot1Animation = keyframes`
  0%{
    opacity: 0;
  }
  15%{
    opacity: 0;
  }
  25%{
    opacity: 1;
  }
  100%{
    opacity: 1;
  }
`;
const Dot1 = styled.span`
  opacity: 0;
  animation: ${Dot1Animation} 2s infinite linear;
`;

const Dot2Animation = keyframes`
  0%{
    opacity: 0;
  }
  25%{
    opacity: 0;
  }
  50%{
    opacity: 1;
  }
  100%{
    opacity: 1;
  }
`;
const Dot2 = styled.span`
  opacity: 0;
  animation: ${Dot2Animation} 2s infinite linear;
`;

const Dot3Animation = keyframes`
  0%{
    opacity: 0;
  }
  50%{
    opacity: 0;
  }
  75%{
    opacity: 1;
  }
  100%{
    opacity: 1;
  }
`;
const Dot3 = styled.span`
  opacity: 0;
  animation: ${Dot3Animation} 2s infinite linear;
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
      {title && <Heading>{title}</Heading>}
      {!title && (
        <Loader>
          Generating a Good book
          <Dot1>.</Dot1>
          <Dot2>.</Dot2>
          <Dot3>.</Dot3>
        </Loader>
      )}
    </BackgroundImageContainer>
  );
};

export default Cover;
