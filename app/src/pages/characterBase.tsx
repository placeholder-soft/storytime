import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Heading, Button } from "@radix-ui/themes";
import { createCharacterType } from "../modules/character/actions";

const CHARACTER_BASE = ["cat", "human", "bear"];

const CharacterBase = () => {
  const [characterBase, setCharacterBase] = useState("human");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <Container>
      <Heading>Select Character Base</Heading>
      <ul>
        {CHARACTER_BASE.map((c) => (
          <li key={c} onClick={() => setCharacterBase(c)}>
            <img src="" alt={c} />
            <Heading as="h4">{c}</Heading>
          </li>
        ))}
      </ul>
      <Button
        onClick={() => {
          // update default character type
          dispatch(createCharacterType({ characterType: characterBase }));
          navigate("/canvas");
        }}
      >
        Select Character
      </Button>
    </Container>
  );
};

export default CharacterBase;
