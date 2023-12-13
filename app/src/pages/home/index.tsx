import { FC, useEffect, useState } from "react";
import {
  ContentContainer,
  PageContainer,
} from "../../components/Layout/Layout";
import styled from "styled-components";
import posterImage from "./_/poster.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import { insertSalt, ZKLoginStore } from "../../components/zklogin.store.tsx";
import queryString from "query-string";
import { auth } from "../../firebase.ts";
import { Button } from "@radix-ui/themes";

export const StyledContentContainer = styled(ContentContainer)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledTitle = styled.div`
  color: #000;
  font-size: 50px;
  font-weight: 600;
  line-height: 60px;
  width: 604px;
  letter-spacing: -1px;
`;

const StyledStartButton = styled(Button)`
  color: #fff;
  padding-inline: 26px;
  height: 48px;
  border-radius: 10px;
  background: #000;
  text-align: center;
  position: absolute;
  bottom: 40px;
  cursor: pointer;
  &:hover {
    background: #363636;
  }
`;

const StyledStartButtonContainer = styled.div`
  height: 416px;
  display: flex;
  justify-content: center;
  background-image: url(${posterImage});
  background-repeat: no-repeat;
  position: relative;
  background-size: cover;
  border-radius: 25px;
`;

const StyledBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 40px;
`;

const LoginButton: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const store = new ZKLoginStore();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const oauthParams = queryString.parse(location.hash);
      if (oauthParams && oauthParams.id_token) {
        setLoading(true);
        await insertSalt(oauthParams.id_token as string);
        const listener = auth.onAuthStateChanged((x) => {
          if (x != null) {
            listener();
            navigate("/dashboard");
          }
        });
      }
    })();
  }, [location.hash, navigate]);

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
      {loading ? "Loading..." : "Create account with Google"}
    </StyledStartButton>
  );
};

const HomePage: FC = () => {
  return (
    <PageContainer>
      <StyledContentContainer>
        <StyledBox>
          <StyledTitle>
            Mint Your Story <br />
            Create Your Own Adventure
          </StyledTitle>
          <StyledStartButtonContainer>
            <LoginButton />
          </StyledStartButtonContainer>
        </StyledBox>
      </StyledContentContainer>
    </PageContainer>
  );
};

export default HomePage;
