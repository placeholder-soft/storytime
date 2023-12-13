import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import {
  currentSceneSelector,
  storyBaseSelector,
} from "../modules/story/selectors";
import { updateStory, toScene } from "../modules/story/actions";
import { StoryProgressPromptRole } from "../types/story";
import Loader from "../components/Loader";
import { Project } from "model";
import { auth, db } from "../firebase.ts";
import { addDoc, collection } from "firebase/firestore";
import { splitDesc } from "../modules/story/utils";
import { characterBaseSelector } from "../modules/character/selectors";

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
`;

const QuoteContainer = styled.div`
  background: linear-gradient(
      0deg,
      rgba(24, 24, 24, 0.8),
      rgba(24, 24, 24, 0.8)
    ),
    linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1));
  width: 90%; /* Adjust as needed */
  position: absolute;
  bottom: 100px; /* Adjust as needed */
  left: 50%;
  transform: translateX(-50%);
  padding: 20px;
`;

const StyledLoader = styled(Loader)`
  position: absolute;
  bottom: 20px;
  right: 20px;
`;

const QuoteText = styled.p`
  color: #fff;
  font-family: Inter Tight;
  font-size: 30px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-transform: capitalize;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 24px;
  justify-content: flex-end;
  align-items: center;
`;

const Button = styled.button`
  color: #ffffff;
  padding: 4px 25px; /* Adjust as needed */
  cursor: pointer;
  border: none;
  border-radius: 10px;
  background: rgba(90, 90, 90, 1);
  color: #fff;
  font-family: Inter Tight;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 171.429% */
  text-transform: uppercase;
`;

const OptionButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 33px; /* Space between options */
`;

const OptionButton = styled.button`
  background-color: rgba(0, 0, 0, 0.7); /* Semi-transparent black */
  color: white;
  border: none;
  border-radius: 20px; /* Rounded corners */
  padding: 15px 100px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Box shadow for a 3D effect */
  text-transform: uppercase; /* Uppercase text */
  border-radius: 10px;
  background: rgba(24, 24, 24, 0.6);

  &:hover {
    background-color: rgba(0, 0, 0, 0.8); /* Darken button on hover */
  }
`;

const Para = styled.p`
  margin: 4px;
`;

function convertUndefinedToNull(obj: any, parentKeyPath: string = ""): any {
  Object.keys(obj).forEach((key) => {
    const keyPath = `${parentKeyPath}${parentKeyPath ? "." : ""}${key}`;
    if (obj[key] === undefined) {
      console.log(`Converting undefined to null at path: ${keyPath}`);
      obj[key] = null;
    } else if (obj[key] !== null && typeof obj[key] === "object") {
      convertUndefinedToNull(obj[key], keyPath);
    }
  });
  return obj;
}

const Scene = () => {
  const [step, setStep] = useState(0); // note: 0 is description, 1 is options
  const [descriptions, setDescriptions] = useState<string[]>([]); // html description
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState("");
  const wholeStory = useSelector(storyBaseSelector);
  const character = useSelector(characterBaseSelector);
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
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (sceneNumber) {
      setStep(0);
      setLoading(false);
    }
  }, [sceneNumber]);

  useEffect(() => {
    let timer;
    if (loading && !timer) {
      timer = setInterval(() => {
        if (dots.length < 3) {
          setDots((prev) => (prev += "."));
        } else {
          setDots("");
        }
      }, 500);
    }
    if (!loading && timer) {
      clearInterval(timer);
      timer = undefined;
    }
    return () => {
      clearInterval(timer);
    };
  }, [dots, loading]);

  useEffect(() => {
    if (sceneDescription && !descriptions.length) {
      setDescriptions(splitDesc(sceneDescription));
    }
  }, [descriptions, sceneDescription]);

  const onOptionClick = (val: string) => {
    if (searchParams.get("read") === "true") {
      dispatch(toScene({ index: sceneNumber + 1 }));
    } else {
      dispatch(
        updateStory({
          message: { role: StoryProgressPromptRole.User, content: val },
        }),
      );
      setLoading(true);
    }
  };

  const onStoryEnd = async () => {
    // TODO: upload book to firebase
    const project: Project = {
      owner: auth.currentUser!.uid,
      character: {
        type: character.characterType,
        name: character.characterName,
        customType: character.customCharacterType,
      },
      name: wholeStory.title,
      createdAt: new Date().getTime(),
      minted: false,
      title: wholeStory.title,
      introduction: wholeStory.introduction,
      coverImage: wholeStory.coverImage,
      rawPrompts: wholeStory.storyProgressPrompts,
      scenes: wholeStory.scenes,
    };
    console.log(project);
    if (searchParams.get("read") !== "true") {
      const newProject = await addDoc(
        collection(db, "projects"),
        convertUndefinedToNull(project),
      );
      navigate("/mint/" + newProject.id);
    } else {
      navigate("/mint/" + searchParams.get("id") + "?read=true");
    }
  };

  if (loading) {
    return (
      <BackgroundImageContainer
        backgroundImageUrl={sceneImage}
        onClick={onStoryEnd}
      >
        <QuoteContainer>
          <QuoteText>Loading Storyline{dots}</QuoteText>
          <StyledLoader />
        </QuoteContainer>
      </BackgroundImageContainer>
    );
  }

  if (type !== "story-ending") {
    return (
      <BackgroundImageContainer backgroundImageUrl={sceneImage}>
        {step === 0 && (
          <QuoteContainer>
            <QuoteText>
              {descriptions.map((des) => (
                <Para>{des}</Para>
              ))}
            </QuoteText>
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
