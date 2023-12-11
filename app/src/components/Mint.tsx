import {
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
  useSignTransactionBlock,
} from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useState } from "react";

function getTransactionBlock(): TransactionBlock {
  const txb = new TransactionBlock();
  // txb.setSender(sender);
  // txb.setGasPrice(5);
  // txb.setGasBudget(5_000_000);

  txb.moveCall({
    target: `0xebc67aa17051eaea7c373e5b72c267dcd7267ce060e79479559eee3eaee3f49b::story_nft_display::mint`,
    arguments: [
      txb.pure("image 2"),
      txb.pure(
        "premium_photo-1669324357471-e33e71e3f3d8?q=80&w=4140&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      ),
    ],
  });

  return txb;
}

export function Mint() {
  const { mutate: signTransactionBlock } = useSignTransactionBlock();
  const { mutate: signAndExecuteTransactionBlock } =
    useSignAndExecuteTransactionBlock();
  const [digest, setDigest] = useState("");

  const [signature, setSignature] = useState("");
  const currentAccount = useCurrentAccount();

  return (
    <div style={{ padding: 20 }}>
      {currentAccount && (
        <>
          <div>
            <button
              onClick={() => {
                signTransactionBlock(
                  {
                    transactionBlock: new TransactionBlock(),
                    chain: "sui:devnet",
                  },
                  {
                    onSuccess: (result) => {
                      console.log("signed transaction block", result);
                      setSignature(result.signature);
                    },
                  }
                );
              }}
            >
              Sign empty transaction block
            </button>
            <div>Signature: {signature}</div>
          </div>

          <div>
            <button
              onClick={() => {
                signAndExecuteTransactionBlock(
                  {
                    transactionBlock: getTransactionBlock(),
                    chain: "sui:devnet",
                  },
                  {
                    onSuccess: (result) => {
                      console.log("executed transaction block", result);
                      setDigest(result.digest);
                    },
                  }
                );
              }}
            >
              Sign and execute transaction block
            </button>
            <div>Digest: {digest}</div>
          </div>
        </>
      )}
    </div>
  );
}
