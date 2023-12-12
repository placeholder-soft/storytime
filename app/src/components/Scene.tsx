import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { currentSceneSelector } from "../modules/story/selectors";
import { updateStory, toScene } from "../modules/story/actions";
import { StoryProgressPromptRole } from "../types/story";

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

const QuoteContainer = styled.div`
  background: linear-gradient(
      0deg,
      rgba(24, 24, 24, 0.8),
      rgba(24, 24, 24, 0.8)
    ),
    linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1));
  font-size: 24px; /* Adjust as needed */
  width: 90%; /* Adjust as needed */
  position: absolute;
  bottom: 100px; /* Adjust as needed */
  left: 50%;
  transform: translateX(-50%);
  padding: 28px;
`;

const QuoteText = styled.p`
  color: #ffffff;
  font-size: 24px; /* Adjust as needed */
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 24px;
  justify-content: flex-end;
  align-items: center;
`;

const Button = styled.button`
  background-color: #000000; /* Adjust as needed */
  color: #ffffff;
  border: none;
  padding: 10px 20px; /* Adjust as needed */
  cursor: pointer;
`;

const OptionButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 10px; /* Space between options */
`;

const OptionButton = styled.button`
  background-color: rgba(0, 0, 0, 0.7); /* Semi-transparent black */
  color: white;
  border: none;
  border-radius: 20px; /* Rounded corners */
  padding: 10px 30px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Box shadow for a 3D effect */
  text-transform: uppercase; /* Uppercase text */
  width: 200px; /* Fixed width, adjust as needed */

  &:hover {
    background-color: rgba(0, 0, 0, 0.8); /* Darken button on hover */
  }
`;

const Scene = () => {
  const [step, setStep] = useState(0); // note: 0 is description, 1 is options
  const {
    type,
    sceneNumber,
    sceneDescription,
    sceneImage,
    optionsPrompt,
    options,
  } = useSelector(currentSceneSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onOptionClick = (val: string) => {
    dispatch(
      updateStory({
        message: { role: StoryProgressPromptRole.User, content: val },
      }),
    );
  };

  const onStoryEnd = () => {
    // TODO: upload book to firebase
    // go to mint page
    navigate("/mint");
  };

  if (type !== "story-ending") {
    return (
      <BackgroundImageContainer backgroundImageUrl={sceneImage}>
        {step === 0 && (
          <QuoteContainer>
            <QuoteText>{sceneDescription}</QuoteText>
            <ButtonContainer>
              <Button
                onClick={() => {
                  dispatch(toScene({ index: sceneNumber - 1 }));
                }}
              >
                Back
              </Button>
              {options && options.length && (
                <Button
                  onClick={() => {
                    setStep(1);
                  }}
                >
                  Next
                </Button>
              )}
            </ButtonContainer>
          </QuoteContainer>
        )}
        {step === 1 && (
          <>
            {options && options.length && (
              <OptionButtonContainer>
                {options.map((opt) => (
                  <OptionButton key={opt} onClick={() => onOptionClick(opt)}>
                    {opt}
                  </OptionButton>
                ))}
              </OptionButtonContainer>
            )}
            {optionsPrompt && (
              <QuoteContainer>
                <QuoteText>{optionsPrompt}</QuoteText>
              </QuoteContainer>
            )}
          </>
        )}
      </BackgroundImageContainer>
    );
  }

  return (
    <BackgroundImageContainer
      backgroundImageUrl={sceneImage}
      onClick={onStoryEnd}
    >
      <QuoteContainer>
        <QuoteText>{sceneDescription}</QuoteText>
      </QuoteContainer>
    </BackgroundImageContainer>
  );
};

export default Scene;
