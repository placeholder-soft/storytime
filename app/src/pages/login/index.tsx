import { FC, useEffect, useState } from "react";
import { Header, PageContainer } from "../../components/Layout/Layout";
import styled from "styled-components";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  User,
} from "firebase/auth";
import { auth } from "../../firebase.ts";
import { Navigate } from "react-router";

export const StyledPageContainer = styled(PageContainer)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
`;

const StyledCard = styled.div`
  width: 353px;
  height: 433px;
  border-radius: 10px;
  background: #ddffc2;
  display: flex;
  flex-direction: column;
  padding: 59px 35px;
  align-items: center;
`;

const StyledCardTitle = styled.div`
  color: #000;
  font-family: N27;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
`;

const StyledDescritionTitle = styled.p`
  color: #000;
  text-align: center;
  font-family: Inter Tight;
  font-size: 30px;
  font-weight: 500;
  line-height: 60px;
  margin-top: 74px;
`;

const StyledDescription = styled.p`
  color: #000;
  text-align: center;
  font-family: Inter Tight;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  width: 237px;
`;

const StyleSubButton = styled.button`
  color: #fff;
  font-weight: 600;
  text-align: center;
  width: 283px;
  padding: 10px 25px;
  gap: 10px;
  border-radius: 10px;
  background: #000;
  margin-top: 80px;
  cursor: pointer;
`;

const LoginPage: FC = () => {
  const [user, setUser] = useState<User | null>();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);
  if (user === undefined) {
    return <div>Loading...</div>;
  }
  if (user != null) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <>
      <Header />
      <StyledPageContainer>
        <StyledCard>
          <StyledCardTitle>STORYTIME</StyledCardTitle>
          <StyledDescritionTitle>Start Creating!</StyledDescritionTitle>
          <StyledDescription>
            You’ve got two images, you need two words. Start working out that
            big brain
          </StyledDescription>
          <StyleSubButton
            onClick={async () => {
              const provider = new GoogleAuthProvider();
              await signInWithPopup(auth, provider);
            }}
          >
            Continue with google
          </StyleSubButton>
        </StyledCard>
      </StyledPageContainer>
    </>
  );
};

export default LoginPage;
