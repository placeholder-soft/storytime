import { useContractWrite, WagmiConfig, createConfig } from "wagmi";
import { createPublicClient, http } from "viem";
import { avalancheFuji } from "viem/chains";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useState } from "react";
import { story_nft_contract } from "./data/story_nft";

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: avalancheFuji,
    transport: http(),
  }),
});

export const EVM = () => {
  return (
    <WagmiConfig config={config}>
      <Profile />
    </WagmiConfig>
  );
};

function Profile() {
  const [toAddress, setToAddress] = useState<string>(
    "0x14dd571A2E2a6df87135C70f1B7Ac4d18af53191",
  );

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  const { data, isLoading, isSuccess, write, isError, error } =
    useContractWrite({
      address: story_nft_contract.address,
      abi: story_nft_contract.abi,
      functionName: "mint",
    });

  console.log(data, isLoading, isSuccess, isError, error);

  if (!isConnected) {
    return <button onClick={() => connect()}>Connect Wallet</button>;
  }

  return (
    <div>
      Connected to {address}
      <button onClick={() => disconnect()}>Disconnect</button>
      <div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            padding: 20,
          }}
        >
          <hr />
          <div
            style={{
              padding: 20,
              border: "1px solid black",
            }}
          >
            <div>
              transaction address:
              <input
                style={{
                  width: "100%",
                }}
                value={toAddress}
                onChange={(e) => {
                  setToAddress(e.target.value);
                }}
              />
            </div>

            <div>transaction hash: {data?.hash}</div>

            <div>
              transaction status:{" "}
              {isLoading
                ? "loading"
                : isSuccess
                  ? "success"
                  : isError
                    ? "error"
                    : "idle"}
            </div>

            <div>transaction error: {isError ? error?.message : "none"}</div>
          </div>
          <div>
            <button
              onClick={async () => {
                console.log(toAddress);
                write({
                  args: [toAddress],
                });
              }}
            >
              execute mint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
