import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Heading, TextField, Button } from "@radix-ui/themes";
import { createCharacterName } from "../modules/character/actions";
import { Header, PageContainer } from "../components/Layout/Layout";

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

const StyledEnterNameText = styled.h1`
  color: #000;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-family: Inter Tight;
  font-size: 50px;
  font-style: normal;
  font-weight: 600;
  line-height: 60px; /* 120% */
  letter-spacing: -1px;
  margin-bottom: 24px;
`;

const StyledInputRoot = styled(TextField.Root)`
  display: flex;
  width: 323px;
  padding: 16px 24px;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 30px;
`;

const StyledInput = styled(TextField.Input)`
  color: #898989;
  text-align: center;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 10px; /* 83.333% */
  text-transform: uppercase;
`;

const StyledButton = styled(Button)`
  display: inline-flex;
  padding: 4px 25px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  border-radius: 10px;
  background: #000;
`;

const Name = () => {
  const [characterName, setCharacterName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <PageContainer>
      <Header />
      <ContentContainer>
        <StyledEnterNameText>Enter Character Name</StyledEnterNameText>
        <StyledInputRoot>
          <StyledInput
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="ENTER CHARACTER NAME"
          />
        </StyledInputRoot>
        <StyledButton
          onClick={() => {
            dispatch(createCharacterName({ characterName }));
            navigate("/characterBase");
          }}
        >
          Create Character
        </StyledButton>
      </ContentContainer>
    </PageContainer>
  );
};

export default Name;
