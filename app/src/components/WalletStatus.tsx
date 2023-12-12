import { useCurrentAccount } from "@mysten/dapp-kit";
import { Container, Flex, Heading, Text } from "@radix-ui/themes";
import { OwnedObjects } from "./OwnedObjects";
import { Mint } from "./Mint";
import { Query } from "./Query";
import { ZKLogin } from "./ZKLogin";
import { EVM } from "./evm";

export function WalletStatus() {
  const account = useCurrentAccount();

  return (
    <Container my="2">
      <Heading mb="2">Wallet Status</Heading>

      {account ? (
        <Flex direction="column">
          <Text>Wallet connected</Text>
          <Text>Address: {account.address}</Text>
        </Flex>
      ) : (
        <Text>Wallet not connected</Text>
      )}
      <h1>Owned Objects</h1>
      <OwnedObjects />
      <h1>Mint</h1>
      <Mint />
      <h1>zklogin</h1>
      <ZKLogin />
      <h1>EVM</h1>
      <EVM projectId="debug">
        <button>mint</button>
      </EVM>
      <h1>Query</h1>
      <Query />
    </Container>
  );
}
