import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Container, Heading, TextField, Button } from "@radix-ui/themes";
import { createCharacterName } from "../modules/character/actions";

const Name = () => {
  const [characterName, setCharacterName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <Container>
      <Heading>Enter Character Name</Heading>
      <TextField.Root>
        <TextField.Input
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          placeholder="ENTER CHARACTER NAME"
        />
      </TextField.Root>
      <Button
        onClick={() => {
          dispatch(createCharacterName({ characterName }));
          navigate("/characterBase");
        }}
      >
        Select Character
      </Button>
    </Container>
  );
};

export default Name;
