import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Canvas from "../components/Canvas";
import Preview from "../components/Preview";
import {
  characterImageSelector,
  characterTypeSelector,
} from "../modules/character/selectors";
import { createCharacterImage } from "../modules/character/actions";

const Container = styled.div`
  display: flex;
  align-items: stretch;
`;

const CanvasPage = () => {
  const [sketchBlob, setSketchBlob] = useState<Blob>(new Blob());
  const [prompt, setPrompt] = useState("");
  const dispatch = useDispatch();
  const characterImage = useSelector(characterImageSelector);
  const navigate = useNavigate();
  const characterType = useSelector(characterTypeSelector);

  useEffect(() => {
    if (characterType && !prompt) {
      setPrompt(characterType);
    }
  }, [characterType]);

  const convert = () => {
    dispatch(createCharacterImage({ sketchBlob, prompt }));

    // TODO: refactor later
    setTimeout(() => {
      navigate("/story");
    }, 2000);
  };

  return (
    <>
      <Container>
        <div>
          <Canvas onUpdate={(val) => setSketchBlob(val)} />
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <Preview data={characterImage} />
      </Container>
      <div>
        <button onClick={convert}>Convert</button>
      </div>
    </>
  );
};

export default CanvasPage;
