import { useMemo, useState } from "react";
import { ZKLoginClient } from "./zklogin.store";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { BigNumber } from "bignumber.js";
import { MIST_PER_SUI } from "@mysten/sui.js/utils";

export function ZKLogin() {
  const location = useLocation();
  const navigate = useNavigate();

  const [address, setAddress] = useState<string>(
    "0xedecedb35529bcbfb7edd620634b748d15e3af0c9734dd520b3d275017213b96"
  );

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
      enabled: store.id_token ? Boolean(store.userAddress) : false,
      refetchInterval: 1500,
    }
  );

  return (
    <div style={{ padding: 20 }}>
      <div>
        <button
          onClick={() => {
            store.resetStorage();
            navigate("/");
          }}
        >
          reset config
        </button>
      </div>
      <div>userAddress: {store.id_token ? store.userAddress : ""}</div>
      <div>
        Balance:{" "}
        {addressBalance?.totalBalance
          ? BigNumber(addressBalance?.totalBalance)
              .div(MIST_PER_SUI.toString())
              .toFixed(6)
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
        <div>
          <div>
            transaction address
            <input
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
          </div>
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
            onClick={() => {
              store.executeTransactionBlock(address, suiToken * 1000000000n);
            }}
          >
            execute transaction block
          </button>
        </div>
      )}
    </div>
  );
}
