/// <reference types="vite-plugin-svgr/client" />
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Canvas from "../../components/Canvas";
import {
  characterImageSelector,
  characterTypeSelector,
} from "../../modules/character/selectors";
import { createCharacterImage } from "../../modules/character/actions";
import demoImg from "../characterBase/_/1.png";
import { Header } from "../../components/Layout/Layout";
import { Button, DropdownMenu, TextField } from "@radix-ui/themes";
import EditIcon from "./_/edit.svg?react";
import EraserIcon from "./_/eraser.svg?react";
import { CaretDownIcon } from "@radix-ui/react-icons";

const PreviewContainer = styled.div`
  position: relative;
  width: 50vw;
  height: 100vh;
`;

const PreviewImage = styled.img`
  width: 100%;
`;

const Preview: React.FC<{ data: Blob }> = ({ data }) => {
  return <PreviewImage src={demoImg} alt="" />;
};

export const StyledSelectButton = styled(Button)`
  color: #fff;
  font-weight: 600;
  text-align: center;
  border-radius: 10px;
  background: #000;
  cursor: pointer;
  padding: 4px 25px;

  &:hover {
    background: #363636;
  }

  position: absolute;
  bottom: 40px;
  right: 48px;
`;

const ContentContainer = styled.div`
  display: flex;
`;

const StyledCanvasContainer = styled.div`
  position: relative;
`;

const ToolContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  position: absolute;
  left: 24px;
  z-index: 10;
  top: 50%;
  transform: translateY(-50%);
`;

const StyledEditButton = styled(Button)`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: #000;
  cursor: pointer;
`;
const StyledEraserButton = styled(Button)`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: #828282;
  cursor: pointer;
`;

const StyledInputRoot = styled(TextField.Root)`
  display: flex;
  width: 323px;
  padding: 2px 24px;
  border-radius: 5px;
  background: #dadada;
`;

const StyledInput = styled(TextField.Input)`
  color: #898989;
  text-align: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 10px; /* 83.333% */
  text-transform: uppercase;
`;

const StyledTriggerButton = styled(Button)`
  width: 205px;
  border-radius: 10px;
  border: 1px solid rgba(158, 158, 158, 0.1);
  background: #212021;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  display: flex;
  justify-content: space-between;
`;

const StyledDropdownMenuItem = styled(DropdownMenu.Item)`
  width: 205px;
`

const StyledFooterToolContainer = styled.div`
  display: flex;
  gap: 60px;
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
`;

const types = [
  {
    name: "Human",
  },
  {
    name: "Dog",
  },
  {
    name: "Bear",
  },
  {
    name: "Custom",
  },
];

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
      <Header />
      <ContentContainer>
        <StyledCanvasContainer>
          <Canvas onUpdate={(val) => setSketchBlob(val)} />
          <ToolContainer>
            <StyledEditButton>
              <EditIcon />
            </StyledEditButton>
            <StyledEraserButton>
              <EraserIcon />
            </StyledEraserButton>
          </ToolContainer>
          <StyledFooterToolContainer>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <StyledTriggerButton variant="soft">
                  Options
                  <CaretDownIcon width={24} height={24} />
                </StyledTriggerButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                {types.map((type) => (
                  <StyledDropdownMenuItem>{type.name}</StyledDropdownMenuItem>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
            <StyledInputRoot>
              <StyledInput
                placeholder="ENTER Custom CHARACTER"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </StyledInputRoot>
          </StyledFooterToolContainer>
        </StyledCanvasContainer>
        <PreviewContainer>
          <Preview data={characterImage} />
          <Link to="/characterBase">
            <StyledSelectButton>Select Character</StyledSelectButton>
          </Link>
        </PreviewContainer>
      </ContentContainer>
      {/*<div>*/}
      {/*  <button onClick={convert}>Convert</button>*/}
      {/*</div>*/}
    </>
  );
};

export default CanvasPage;
