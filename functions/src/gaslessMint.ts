import { fromHEX } from "@mysten/bcs";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import dotenv from "dotenv";
import { CloudFunctionsTypeWithUid } from "./handlersType";
dotenv.config();

export const gaslessMint: CloudFunctionsTypeWithUid["gaslessMint"] = async (
  to: string,
  title: string,
  imageUrl: string
): Promise<{ objectId: string }> => {
  const key = process.env.SUI_PRIVATE_KEY;
  const keypair = Ed25519Keypair.fromSecretKey(fromHEX(key!), {
    skipValidation: false,
  });

  const pk = keypair.getPublicKey();
  const sender = pk.toSuiAddress();

  // create an example transaction block.
  const txb = new TransactionBlock();
  txb.setSender(sender);
  txb.setGasBudget(5_000_000);

  txb.moveCall({
    target: `0x84abd49cedd1ddf02ab8e48c167df180b047cdd1e4c07d97434e382658dfffe5::story_nft::mint_to`,
    arguments: [txb.pure.address(to), txb.pure(title), txb.pure(imageUrl)],
  });

  // define sui client for the desired network.
  const client = new SuiClient({ url: getFullnodeUrl("devnet") });
  const result = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: txb,
  });

  console.log(result);
  const transactionBlock = await client.waitForTransactionBlock({
    digest: result.digest,
    options: {
      showEvents: true,
      showEffects: true,
    },
  });

  console.log(transactionBlock);

  console.log(`event: ${JSON.stringify(transactionBlock.events, null, 2)}`);

  const objectId = (transactionBlock.events?.[0]?.parsedJson as any)
    .object_id as string;

  return {
    objectId,
  };
};
