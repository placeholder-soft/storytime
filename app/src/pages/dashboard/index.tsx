import { useEffect, useState } from "react";
import { Project } from "model";
import { format } from "date-fns";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { User } from "firebase/auth";
import { protectedRoute } from "../../components/protectedRoute";
import { db } from "../../firebase";
import {
  ContentContainer,
  PageContainer,
} from "../../components/Layout/Layout";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Button } from "@radix-ui/themes";

export const StyledContentContainer = styled(ContentContainer)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 32px;
`;

const StyledEmptyCard = styled.div`
  width: 774px;
  height: 420px;
  flex-shrink: 0;
  border-radius: 15px;
  background: #fff;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

const StyledEmptyText = styled.div`
  color: #000;
  text-align: center;
  font-size: 50px;
  font-weight: 600;
  line-height: 60px;
  letter-spacing: -1px;
`;

export const StyledCreateButton = styled(Button)`
  color: #fff;
  width: 149px;
  height: 48px;
  border-radius: 10px;
  background: #000;
  text-align: center;
  cursor: pointer;
  &:hover {
    background: #363636;
  }
`;

export const StyledSubButton = styled(Button)`
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
`;

export const StyledTitleContainer = styled.div`
  width: 774px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledStoryTitle = styled.p`
  text-align: left;
  font-size: 28px;
  font-weight: 500;
  line-height: 29px;
`;

export const StyledStoryContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 48px;
  flex-direction: column;
`;
export const StyledStoryItem = styled.div`
  padding: 26px;
  display: flex;
  gap: 34px;
  border-radius: 15px;
  background: #fff;
  width: 774px;
  position: relative;
`;

export const StyledStoryImage = styled.img`
  width: 365.5px;
  height: 365.5px;
`;

const StyledInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 42px;
`;

const StyledMintTag = styled.div`
  font-size: 12px;
  font-weight: 500;
  border-radius: 7.11px;
  background: #a9f868;
  padding: 7px 11px;
`;

const DateText = styled.span`
  color: #000;
  font-size: 12.012px;
  font-weight: 600;
  line-height: 16.18px;
`;

export const StyledStoryItemTitle = styled.p`
  color: #000;
  font-size: 28px;
  font-weight: 500;
  line-height: 29px;
  width: 186px;
`;

export const StyledDescription = styled.p`
  margin-top: 25px;
  color: #000;
  font-size: 12.012px;
  font-weight: 500;
  line-height: 16.18px;
`;
//TODO: check margin-top
const StyledLink = styled(Link)`
  color: #000;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 14.93px;
  text-decoration-line: underline;
  margin-top: 80px;
`;

const StyledIndexTag = styled.div`
  position: absolute;
  padding: 14px 16px;
  border-radius: 10px;
  background: #fff;
  left: -78px;
  top: 0;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  line-height: 16.18px;
`;

const DashboardPage = protectedRoute(({ user }: { user: User }) => {
  const [projects, setProjects] = useState<Project[]>();
  useEffect(() => {
    const myProjects = query(
      collection(db, "projects"),
      where("owner", "==", user.uid),
    );
    return onSnapshot(myProjects, (snapshot) => {
      setProjects(snapshot.docs.map((x) => x.data()) as Project[]);
    });
  }, [user.uid]);
  if (projects == null) {
    return null;
  }
  if (projects.length === 0) {
    return (
      <PageContainer>
        <StyledContentContainer>
          <StyledTitleContainer>
            <StyledStoryTitle>Your Stories</StyledStoryTitle>
          </StyledTitleContainer>
          <StyledEmptyCard>
            <StyledEmptyText>Create your first story</StyledEmptyText>
            <Link to="/name">
              <StyledCreateButton>Create</StyledCreateButton>
            </Link>
          </StyledEmptyCard>
        </StyledContentContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <StyledContentContainer>
        <StyledTitleContainer>
          <StyledStoryTitle>Your Stories</StyledStoryTitle>
          <Link to="/name">
            <StyledSubButton>Create New Story</StyledSubButton>
          </Link>
        </StyledTitleContainer>
        <StyledStoryContainer>
          {projects.map((story, idx) => (
            <StyledStoryItem>
              <StyledStoryImage src={story.coverImage} alt="" />
              <div>
                <StyledInfo>
                  {story.minted && <StyledMintTag>Minted</StyledMintTag>}
                  <DateText>{format(story.createdAt, "yyy/MM/dd")}</DateText>
                </StyledInfo>
                <StyledStoryItemTitle>{story.name}</StyledStoryItemTitle>
                <StyledDescription>{story.introduction}</StyledDescription>
                <StyledLink>Read Story</StyledLink>
              </div>
              <StyledIndexTag>#{idx + 1}</StyledIndexTag>
            </StyledStoryItem>
          ))}
        </StyledStoryContainer>
      </StyledContentContainer>
    </PageContainer>
  );
});

export default DashboardPage;
