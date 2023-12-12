/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { PageContainer } from "../../components/Layout/Layout";
import storyImg from "./_/story.png";
import styled from "styled-components";
import {
  StyledContentContainer,
  StyledDescription,
  StyledStoryContainer,
  StyledStoryImage,
  StyledStoryItem,
  StyledStoryItemTitle,
  StyledStoryTitle,
  StyledTitleContainer,
} from "../dashboard";
import { Button } from "@radix-ui/themes";
import {
  ZKLoginStore,
  suiMint,
  insertSalt,
} from "../../components/zklogin.store";
import { EVM } from "../../components/evm";

const StyledInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  justify-content: center;
`;

const StyledCreateButton = styled(Button)`
  color: #fff;
  width: 149px;
  height: 32px;
  border-radius: 10px;
  background: ${(props) => (props.disabled ? "#D3D3D3" : "#000")};
  text-align: center;
  cursor: pointer;
  &:hover {
    background: ${(props) => (props.disabled ? "#D3D3D3" : "#363636")};
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  }

  ${(props) =>
    props.disabled &&
    `
    cursor: default;
    opacity: 0.5;
  `}
`;

const StyledCreateButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  item-align: center;
`;

const MinStoryPage: FC = () => {
  return (
    <PageContainer>
      <StyledContentContainer>
        <StyledTitleContainer>
          <StyledStoryTitle>Mint your story</StyledStoryTitle>
        </StyledTitleContainer>
        <StyledStoryContainer>
          <StyledStoryItem>
            <StyledStoryImage src={storyImg} alt="" />
            <StyledInfoContainer>
              <StyledStoryItemTitle>
                The Journey to Dragon’s Keep
              </StyledStoryItemTitle>
              <StyledDescription>
                A playful and bold collage of colors and shapes, blending a
                retro feel with modern design principles to evoke creativity and
                the joy of building something unique and impactful.
              </StyledDescription>
              <StyledCreateButtonContainer>
                <SuiMintButton />
                <EVM>
                  <StyledCreateButton>Mint Story (Avax)</StyledCreateButton>
                </EVM>
              </StyledCreateButtonContainer>
            </StyledInfoContainer>
          </StyledStoryItem>
        </StyledStoryContainer>
      </StyledContentContainer>
    </PageContainer>
  );
};

const SuiMintButton = () => {
  const store = useMemo(() => new ZKLoginStore(), []);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    void (async () => {
      const id_token = window.localStorage.getItem("id_token");
      if (id_token == null) {
        throw new Error("id_token is not defined");
      }

      const salt = await insertSalt(id_token);
      if (salt == null) {
        throw new Error("salt is not defined");
      }

      store.initializeClient({
        salt,
        id_token,
      });
    })();
  }, [store]);

  const onClick = useCallback(async () => {
    if (url) {
      window.open(url);
      return;
    }
    if (store.client == null) {
      throw new Error("client is not defined");
    }
    setLoading(true);
    try {
      const url = await suiMint(store.client.userAddress, store, {
        title: "The Mysterious Map",
        imageUrl: "bb8018b7-4b6a-4841-a0ea-8e642b56a0ca",
      });
      setUrl(url);
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [url, store]);

  return (
    <StyledCreateButton
      disabled={loading}
      style={
        url
          ? {
              color: "white",
              backgroundColor: "green",
            }
          : {}
      }
      onClick={onClick}
    >
      {loading ? "Loading..." : url ? "Minted! (Sui)" : "Mint Story (Sui)"}
    </StyledCreateButton>
  );
};

export default MinStoryPage;
