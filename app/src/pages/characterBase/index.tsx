import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { createCharacterType } from "../../modules/character/actions";
import { PageContainer } from "../../components/Layout/Layout";
import Button from "../../components/Button";
import { StyledContentContainer } from "../dashboard";
import { CHARACTER_BASE } from "../../shared/characterTypes";

const StyledTitle = styled.h1`
  color: #000;
  font-size: 50px;
  font-style: normal;
  font-weight: 600;
  line-height: 60px; /* 120% */
  letter-spacing: -1px;
  margin-bottom: 76px;
`;

const StyledBaseContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 64px;
  padding: 0 20px;
  margin-bottom: 64px;
`;

const StyledBaseItem = styled.div<{ $selected: boolean }>`
  display: flex;
  padding: 6px;
  align-items: flex-start;
  align-content: flex-start;
  gap: 10px;
  flex-wrap: wrap;
  ${(props) =>
    props.$selected &&
    `
    border-radius: 5px;
    background: #C9E7B0;
    box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.50);
  `}
`;

const StyledBaseItemTitle = styled.div`
  color: #000;
  font-size: 30px;
  font-weight: 500;
`;

const StyledBaseItemImage = styled.img`
  max-width: 300px;
  border-radius: 5px;
`;

const StyledBaseItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 35px;
`;

const BaseItem: React.FC<{
  selected: boolean;
  title: string;
  image: string;
  onClick: () => void;
}> = (props) => {
  return (
    <StyledBaseItemContainer>
      <StyledBaseItem $selected={props.selected} onClick={props.onClick}>
        <StyledBaseItemImage src={props.image} alt="" />
      </StyledBaseItem>
      <StyledBaseItemTitle>{props.title}</StyledBaseItemTitle>
    </StyledBaseItemContainer>
  );
};

const CharacterBase = () => {
  const [characterBase, setCharacterBase] = useState("Human");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <PageContainer>
      <StyledContentContainer>
        <StyledTitle>Select Character Base</StyledTitle>
        <StyledBaseContainer>
          {CHARACTER_BASE.map((c) => (
            <BaseItem
              selected={characterBase === c.title}
              key={c.title}
              title={c.title}
              image={c.image}
              onClick={() => setCharacterBase(c.title)}
            />
          ))}
        </StyledBaseContainer>
        <Button
          onClick={() => {
            // update default character type
            dispatch(createCharacterType({ characterType: characterBase }));
            navigate("/canvas");
          }}
        >
          Select Character
        </Button>
      </StyledContentContainer>
    </PageContainer>
  );
};

export default CharacterBase;
