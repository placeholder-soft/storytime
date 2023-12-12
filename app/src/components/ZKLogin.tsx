import { useEffect, useState } from "react";
import { ZKLoginStore, client, upsertSalt } from "./zklogin.store";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { MIST_PER_SUI } from "@mysten/sui.js/utils";
import * as dn from "dnum-cjs";
import { TransactionBlock } from "@mysten/sui.js/transactions";

function getTransactionBlock(sender: string): TransactionBlock {
  const txb = new TransactionBlock();
  txb.setSender(sender);
  // txb.setGasPrice(5);
  // txb.setGasBudget(5_000_000);

  txb.moveCall({
    target: `0xe080263e8e3f6169574a24f15cec05d904dbeee9d5d5103b9c8d035efe8eb0d3::story_nft::mint`,
    arguments: [
      txb.pure("image 2"),
      txb.pure(
        "premium_photo-1669324357471-e33e71e3f3d8?q=80&w=4140&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ),
    ],
  });

  return txb;
}

export const ZKLogin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [address, setAddress] = useState<string>(
    "0xedecedb35529bcbfb7edd620634b748d15e3af0c9734dd520b3d275017213b96",
  );

  const [digest, setDigest] = useState<string>("");

  const [suiToken, setSuiToken] = useState<bigint>(1n);

  const [store, setStore] = useState<ZKLoginStore>(new ZKLoginStore());

  useEffect(() => {
    (async () => {
      const oauthParams = queryString.parse(location.hash);
      if (
        oauthParams &&
        oauthParams.id_token &&
        store.info?.id_token !== oauthParams.id_token
      ) {
        const salt = await upsertSalt(oauthParams.id_token as string);
        const store = new ZKLoginStore({
          salt,
          id_token: oauthParams.id_token as string,
        });
        setStore(store);
      }
    })();
  }, [location.hash, store.info?.id_token]);

  const { data: addressBalance } = useSuiClientQuery(
    "getBalance",
    {
      owner: store.client ? store.client.userAddress : "",
    },
    {
      enabled: store.client ? Boolean(store.client.userAddress) : false,
      refetchInterval: 1500,
    },
  );

  if (store == null) {
    return <div>loading...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <div>
        <button
          onClick={() => {
            store.resetStorage();
            navigate("/debug");
          }}
        >
          reset config
        </button>
      </div>
      <div>userAddress: {store.client ? store.client.userAddress : ""}</div>
      <div>
        Balance:{" "}
        {addressBalance?.totalBalance
          ? dn.format(
              [
                BigInt(addressBalance.totalBalance),
                MIST_PER_SUI.toString().length - 1,
              ],
              6,
            )
          : "0.000000"}{" "}
        SUI
      </div>
      <div>
        <div>
          Google Auth Status: {store.client ? "logged in" : "not logged in"}
        </div>
        {store.client == null && (
          <button
            onClick={() => {
              void store.signInWithGoogle(window.location.href);
            }}
          >
            Login with ZKLogin
          </button>
        )}
      </div>
      {store.client && (
        <div>
          <button
            onClick={() => {
              store.client?.requestTestSUIToken();
            }}
          >
            request test SUI token
          </button>
        </div>
      )}
      {store.client && (
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
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </div>

            <div>transaction digest: {digest}</div>
          </div>

          <div>
            <div>
              sui token
              <input
                value={suiToken.toString()}
                onChange={(e) => {
                  const parseInt = Number.parseInt(e.target.value);
                  if (Number.isNaN(parseInt)) {
                    setSuiToken(0n);
                    return;
                  }
                  setSuiToken(BigInt(parseInt));
                }}
              />
            </div>
            <button
              onClick={async () => {
                const txb = new TransactionBlock();

                const [coin] = txb.splitCoins(txb.gas, [
                  suiToken * 1000000000n,
                ]);
                txb.transferObjects([coin], address);
                txb.setSender(store.client!.userAddress);

                const { bytes, signature } = await txb.sign({
                  client,
                  signer: store.ephemeralKeyPair,
                });

                const res = await client.executeTransactionBlock({
                  transactionBlock: bytes,
                  signature: store.client!.genZkLoginSignature(signature),
                });
                setDigest(res.digest);
              }}
            >
              execute transaction token
            </button>
          </div>
          <div>
            <button
              onClick={async () => {
                const txb = getTransactionBlock(store.client!.userAddress);

                const result = await txb.sign({
                  client,
                  signer: store.ephemeralKeyPair,
                });

                const res = await client.executeTransactionBlock({
                  transactionBlock: result.bytes,
                  signature: store.client!.genZkLoginSignature(
                    result.signature,
                  ),
                });
                setDigest(res.digest);

                // const result = await client.signAndExecuteTransactionBlock({
                //   transactionBlock: txb,
                //   signer: store.ephemeralKeyPair,
                // });

                // console.log(result);

                // const transactionBlock = await client.waitForTransactionBlock({
                //   digest: result.digest,
                //   options: {
                //     showEvents: true,
                //     showEffects: true,
                //   },
                // });

                // console.log(transactionBlock);

                // setDigest(transactionBlock.digest);
              }}
            >
              execute mint
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
