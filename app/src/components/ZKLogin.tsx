import { useMemo, useState } from "react";
import { ZKLoginClient, client } from "./zklogin.store";
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

export function ZKLogin() {
  const location = useLocation();
  const navigate = useNavigate();

  const [address, setAddress] = useState<string>(
    "0xedecedb35529bcbfb7edd620634b748d15e3af0c9734dd520b3d275017213b96"
  );

  const [digest, setDigest] = useState<string>("");

  const [suiToken, setSuiToken] = useState<bigint>(1n);

  const store = useMemo(() => {
    const oauthParams = queryString.parse(location.hash);
    if (oauthParams && oauthParams.id_token) {
      const store = new ZKLoginClient(oauthParams.id_token as string);
      return store;
    }

    return new ZKLoginClient();
  }, [location]);

  const { data: addressBalance } = useSuiClientQuery(
    "getBalance",
    {
      owner: store.id_token ? store.userAddress : "",
    },
    {
      // enabled: store.id_token ? Boolean(store.userAddress) : false,
      // refetchInterval: 1500,
    }
  );

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
      <div>userAddress: {store.id_token ? store.userAddress : ""}</div>
      <div>
        Balance:{" "}
        {addressBalance?.totalBalance
          ? dn.format(
              [
                BigInt(addressBalance.totalBalance),
                MIST_PER_SUI.toString().length - 1,
              ],
              6
            )
          : "0.000000"}{" "}
        SUI
      </div>
      <div>
        <div>
          Google Auth Status: {store.id_token ? "logged in" : "not logged in"}
        </div>
        {store.id_token == null && (
          <button
            onClick={() => {
              store.signInWithGoogle();
            }}
          >
            Login with ZKLogin
          </button>
        )}
      </div>
      {store.id_token && (
        <div>
          <button
            onClick={() => {
              store.requestTestSUIToken();
            }}
          >
            request test SUI token
          </button>
        </div>
      )}
      {store.id_token && (
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
                txb.setSender(store.userAddress);

                const { bytes, signature } = await txb.sign({
                  client,
                  signer: store.ephemeralKeyPair,
                });

                const res = await client.executeTransactionBlock({
                  transactionBlock: bytes,
                  signature: store.genZkLoginSignature(signature),
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
                const tx = getTransactionBlock(store.userAddress);

                const { bytes, signature } = await tx.sign({
                  client,
                  signer: store.ephemeralKeyPair,
                });

                const res = await client.executeTransactionBlock({
                  transactionBlock: bytes,
                  signature: store.genZkLoginSignature(signature),
                });

                setDigest(res.digest);
              }}
            >
              execute mint
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
