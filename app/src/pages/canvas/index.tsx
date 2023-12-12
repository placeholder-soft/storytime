/// <reference types="vite-plugin-svgr/client" />
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Canvas from "../../components/Canvas";
import {
  characterImageSelector,
  characterTypeSelector,
} from "../../modules/character/selectors";
import { createCharacterImage } from "../../modules/character/actions";
import { Header } from "../../components/Layout/Layout";
import { Button, DropdownMenu, TextField } from "@radix-ui/themes";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { CHARACTER_BASE } from "../../shared/characterTypes";

const PreviewContainer = styled.div`
  position: relative;
  width: 50vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewImage = styled.img`
  width: 100%;
`;

const Preview: FC<{ data: Blob; defaultImage?: string }> = ({
  data,
  defaultImage,
}) => {
  const imageSrc = data ? URL.createObjectURL(data) : defaultImage;
  return imageSrc ? <PreviewImage src={imageSrc} alt="" /> : null;
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
`;

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
  const defaultImageUrl = CHARACTER_BASE.find((c) => c.title === characterType)
    ?.image;

  useEffect(() => {
    if (characterType && !prompt) {
      setPrompt(characterType);
    }
  }, [characterType]);

  const renderPreview = (val) => {
    setSketchBlob(val);
    dispatch(createCharacterImage({ sketchBlob: val, prompt }));
  };

  return (
    <>
      <Header />
      <ContentContainer>
        <StyledCanvasContainer>
          <Canvas onUpdate={(val) => renderPreview(val)} />
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
          <Preview data={characterImage} defaultImage={defaultImageUrl} />
          <StyledSelectButton
            onClick={() => {
              navigate("/story");
            }}
          >
            Select Character
          </StyledSelectButton>
        </PreviewContainer>
      </ContentContainer>
    </>
  );
};

export default CanvasPage;
