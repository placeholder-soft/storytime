import { FC, useEffect, useState } from "react";
import { Header, PageContainer } from "../../components/Layout/Layout";
import styled from "styled-components";
import step1 from "./_/step1.png";
import step2 from "./_/step2.png";
import step3 from "./_/step3.png";
import { useLocation } from "react-router";
import { upsertSalt, ZKLoginStore } from "../../components/zklogin.store.tsx";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase.ts";

const StyledTitle = styled.h1`
  color: #000;
  font-size: 50px;
  font-weight: 600;
  line-height: 60px;
  letter-spacing: -1px;
  margin-left: 34px;
  margin-top: 72px;
`;

const StyledStepContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 0 20px;
`;

const StyledStepItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StyledStepItemTitle = styled.div`
  color: #000;
  font-size: 30px;
  font-weight: 500;
  line-height: 60px;
`;

const StyledStepItemImage = styled.img`
  width: 100%;
  border-radius: 5px;
`;

const StyledStepItemDescription = styled.div`
  color: #000;
  font-size: 18px;
  font-weight: 500;
  line-height: 20px;
`;

const StepItem: FC<{
  title: string;
  description: string;
  image: string;
}> = (props) => {
  return (
    <StyledStepItem>
      <StyledStepItemTitle>{props.title}</StyledStepItemTitle>
      <StyledStepItemImage src={props.image} alt="" />
      <StyledStepItemDescription>{props.description}</StyledStepItemDescription>
    </StyledStepItem>
  );
};

const StyledStartButton = styled.button`
  padding: 4px 25px;
  border-radius: 10px;
  background: #000;
  color: #fff;
  text-align: center;
  width: fit-content;
  cursor: pointer;
`;

const StyledStartButtonContainer = styled.div`
  display: flex;
  margin-top: 140px;
  justify-content: center;
`;

const LoginButton: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [store, setStore] = useState<ZKLoginStore>(new ZKLoginStore());

  useEffect(() => {
    (async () => {
      const oauthParams = queryString.parse(location.hash);
      if (
        oauthParams &&
        oauthParams.id_token &&
        store.info?.id_token !== oauthParams.id_token
      ) {
        const salt = await upsertSalt(oauthParams.id_token as string);
        setStore(
          new ZKLoginStore({
            salt,
            id_token: oauthParams.id_token as string,
          }),
        );
        const listener = auth.onAuthStateChanged((x) => {
          if (x != null) {
            listener();
            navigate("/dashboard");
          }
        });
      }
    })();
  }, [location.hash, navigate, store.info?.id_token]);

  return (
    <StyledStartButton
      onClick={() => {
        if (auth.currentUser != null) {
          navigate("/dashboard");
        } else {
          void store.signInWithGoogle(window.location.href);
        }
      }}
    >
      Get started
    </StyledStartButton>
  );
};

const HomePage: FC = () => {
  return (
    <PageContainer>
      <Header />
      <StyledTitle>Create your own Adventure</StyledTitle>
      <StyledStepContainer>
        <StepItem
          title={"1.Create Character"}
          image={step1}
          description="You’ve got two images, you need two words.Start working out that big brain"
        />
        <StepItem
          title={"2.Generate Story"}
          image={step2}
          description="You’ve got two images, you need two words.Start working out that big brain"
        />
        <StepItem
          title={"3.Mint Your Story"}
          image={step3}
          description="You’ve got two images, you need two words.Start working out that big brain"
        />
      </StyledStepContainer>
      <StyledStartButtonContainer>
        <LoginButton />
      </StyledStartButtonContainer>
    </PageContainer>
  );
};

export default HomePage;
