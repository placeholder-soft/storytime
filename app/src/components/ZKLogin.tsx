import { useEffect, useMemo, useState } from "react";
import {
  ZKLoginStore,
  client,
  getSalt,
  insertSalt,
  suiMint,
} from "./zklogin.store";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { MIST_PER_SUI } from "@mysten/sui.js/utils";
import * as dn from "dnum-cjs";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { auth } from "../firebase";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ZKLogin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userAddress, setUserAddress] = useState<string>();

  const [address, setAddress] = useState<string>(
    "0xedecedb35529bcbfb7edd620634b748d15e3af0c9734dd520b3d275017213b96",
  );

  const [digest, setDigest] = useState<string>("");

  const [suiToken, setSuiToken] = useState<bigint>(1n);

  const store = useMemo(() => new ZKLoginStore(), []);

  useEffect(() => {
    (async () => {
      const oauthParams = queryString.parse(location.hash);
      if (
        oauthParams &&
        oauthParams.id_token &&
        store.client?.id_token !== oauthParams.id_token
      ) {
        const salt = await insertSalt(oauthParams.id_token as string);
        store.initializeClient({
          salt,
          id_token: oauthParams.id_token as string,
        });
        return;
      }
    })();
  }, [location.hash, store, store.client?.id_token]);

  useEffect(() => {
    void (async () => {
      await sleep(2000);
      const salt = await getSalt();
      if (store.initialized && salt && store.client?.salt !== salt) {
        store.initializeClient({
          salt: salt,
          id_token: window.localStorage.getItem("id_token") ?? "",
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.initialized, auth.currentUser]);

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

  return (
    <div style={{ padding: 20 }}>
      <div>
        <button
          style={{ marginRight: 20 }}
          onClick={() => {
            setUserAddress(store.client?.userAddress);
          }}
        >
          rerender
        </button>
        <button
          onClick={() => {
            auth.signOut();
            store.client = undefined;
            window.localStorage.removeItem("id_token");
            store.resetStorage();
            setUserAddress(undefined);
            navigate(`/debug`);
          }}
        >
          reset config
        </button>
      </div>
      <div>userAddress: {userAddress}</div>
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
      {store.client != null && (
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
      {store.client != null && (
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
                if (store.client == null) {
                  throw new Error("client is not defined");
                }
                const url = await suiMint(store.client.userAddress, store, {
                  title: "The Mysterious Map",
                  imageUrl: "",
                });
                setDigest(url);
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
