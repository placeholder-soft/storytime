import { WagmiConfig, createConfig } from "wagmi";
import { createPublicClient, http } from "viem";
import { avalancheFuji } from "viem/chains";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: avalancheFuji,
    transport: http(),
  }),
});

export default function App() {
  return (
    <WagmiConfig config={config}>
      <Profile />
    </WagmiConfig>
  );
}

function Profile() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  if (isConnected)
    return (
      <div>
        Connected to {address}
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    );
  return <button onClick={() => connect()}>Connect Wallet</button>;
}
