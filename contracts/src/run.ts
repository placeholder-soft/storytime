import { fromHEX } from '@mysten/bcs';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { env } from './env';

async function main() {
  const keypair = Ed25519Keypair.fromSecretKey(fromHEX(env.SUI_PRIVATE_KEY), {
    skipValidation: false,
  });

  const pk = keypair.getPublicKey();
  const sender = pk.toSuiAddress();

  // create an example transaction block.
  const txb = new TransactionBlock();
  // txb.setSender(sender);
  // txb.setGasPrice(5);
  txb.setGasBudget(5_000_000);

  txb.moveCall({
    target: `0xe5e4d08eeb10d9262024aabf2ad37bca427b766c32c7e79c7a18f856a209405e::story_nft::mint`,
    arguments: [
      txb.pure('image 2'),
      txb.pure(
        'premium_photo-1669324357471-e33e71e3f3d8?q=80&w=4140&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ),
    ],
  });

  // const [coin] = txb.splitCoins(txb.gas, [100]);

  // transfer the split coin to a specific address
  // txb.transferObjects([coin], '0x380254779600ed29cb70c917255b084d12b5a760c4dadeceb8f7673d0fc99d1d');

  // const bytes = await txb.build();
  // const serializedSignature = (await keypair.signTransactionBlock(bytes))
  //   .signature;

  // // verify the signature locally
  // const verified = await keypair
  //   .getPublicKey()
  //   .verifyTransactionBlock(bytes, serializedSignature)

  // if (!verified) {
  //   throw new Error('Signature verification failed');
  // }

  // define sui client for the desired network.
  const client = new SuiClient({ url: getFullnodeUrl('devnet') });
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
}

main().catch(err => console.log(err));
