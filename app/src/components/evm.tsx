import { useContractWrite, WagmiConfig, createConfig } from "wagmi";
import { createPublicClient, http } from "viem";
import { avalancheFuji } from "viem/chains";

import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import {
  Children,
  cloneElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { story_nft_contract } from "./data/story_nft";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase";

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: avalancheFuji,
    transport: http(),
  }),
});

export const EVM = ({
  children,
  projectId,
}: {
  projectId: string;
  children: React.ReactNode;
}) => {
  return (
    <WagmiConfig config={config}>
      <MintButton projectId={projectId}>{children}</MintButton>
    </WagmiConfig>
  );
};

function MintButton({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: string;
}) {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const [isClicked, setIsClicked] = useState(false);

  const { data, isLoading, isSuccess, write, isError, error } =
    useContractWrite({
      address: story_nft_contract.address,
      abi: story_nft_contract.abi,
      functionName: "mint",
    });

  const onClick = useCallback(async () => {
    if (data?.hash) {
      window.open(`https://cchain.explorer.avax-test.network/tx/${data?.hash}`);
      return;
    }

    if (!isConnected) {
      connect();
      return;
    }
    write({
      args: [address],
    });
    setIsClicked(true);
  }, [data?.hash, isConnected, write, address, connect]);

  useEffect(() => {
    if (isConnected && !isClicked) {
      onClick();
    }
  }, [isClicked, isConnected, onClick]);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    void (async () => {
      await addDoc(collection(db, "mints"), {
        chain: "avalanche",
        network: "fuji",
        hash: data?.hash,
        sender: address,
        owner: address,
        project_id: projectId,
        uid: auth.currentUser?.uid,
        created_at: new Date(),
      });
    })();
  }, [data, isLoading, isSuccess, isError, error, address, projectId]);

  const newChildren = Children.map(children, (child) => {
    const c = child as React.ReactElement;
    return cloneElement(c, {
      disabled: isLoading,
      onClick: async () => {
        onClick();
      },
      style: {
        ...(isSuccess
          ? {
              color: "white",
              backgroundColor: "green",
            }
          : {}),
      },
      children: isLoading
        ? "Loading..."
        : isSuccess
          ? "Minted! (Avax)"
          : c.props.children,
    });
  });

  return <>{newChildren}</>;
}
