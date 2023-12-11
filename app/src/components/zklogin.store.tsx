import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { SerializedSignature } from "@mysten/sui.js/cryptography";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { fromB64 } from "@mysten/sui.js/utils";
import {
  genAddressSeed,
  generateNonce,
  generateRandomness,
  getExtendedEphemeralPublicKey,
  getZkLoginSignature,
  jwtToAddress,
} from "@mysten/zklogin";
import { jwtDecode, JwtPayload } from "jwt-decode";

const CLIENT_ID =
  "78105453039-rc9sdmkol2dej5u365dfgq6bjeopmu0f.apps.googleusercontent.com";
const REDIRECT_URI = "http://localhost:5173/debug";

export const SUI_DEVNET_FAUCET = "https://faucet.devnet.sui.io/gas";

export const PROVER_URL = "https://prover-dev.mystenlabs.com/v1";

export const client = new SuiClient({ url: getFullnodeUrl("devnet") });

export type PartialZkLoginSignature = Omit<
  Parameters<typeof getZkLoginSignature>["0"]["inputs"],
  "addressSeed"
>;

export class ZKLoginClient {
  public initialized = false;
  private readonly jwtPayload: JwtPayload | undefined;

  ephemeralKeyPair!: Ed25519Keypair;
  private epoch!: {
    currentEpoch: number;
    maxEpoch: number;
  };
  private nonce!: {
    randomness: string;
    currentNonce: string;
  };

  private partialZkLoginSignature: PartialZkLoginSignature | undefined;

  constructor(readonly id_token?: string) {
    if (id_token) {
      this.jwtPayload = jwtDecode(id_token);
    }

    this.initailize();
  }

  resetStorage() {
    // window.localStorage.removeItem("salt");
    window.sessionStorage.removeItem("ephemeralKeyPair");
    window.sessionStorage.removeItem("randomness");
  }

  private async initailize() {
    this.genEphemeralKeyPair();
    await this.getEpoch();
    await this.genNone();
    if (this.id_token) {
      await this.genPartialZkLoginSignature();
    }
    this.initialized = true;
  }

  private get salt() {
    const salt = window.localStorage.getItem("salt");
    if (salt === null) {
      const salt = generateRandomness();
      window.localStorage.setItem("salt", salt);
      return salt;
    }
    return salt;
  }

  get userAddress() {
    if (!this.id_token) {
      throw new Error("jwtString is not defined");
    }
    const zkLoginUserAddress = jwtToAddress(this.id_token, this.salt);
    return zkLoginUserAddress;
  }

  private get publicKey() {
    return this.ephemeralKeyPair.getPublicKey();
  }

  private get extendedEphemeralPublicKey() {
    return getExtendedEphemeralPublicKey(this.ephemeralKeyPair.getPublicKey());
  }

  private genEphemeralKeyPair() {
    const ephemeralKeyPair = window.sessionStorage.getItem("ephemeralKeyPair");

    if (ephemeralKeyPair) {
      this.ephemeralKeyPair = Ed25519Keypair.fromSecretKey(
        fromB64(ephemeralKeyPair)
      );
    } else {
      this.ephemeralKeyPair = Ed25519Keypair.generate();
      window.sessionStorage.setItem(
        "ephemeralKeyPair",
        this.ephemeralKeyPair.export().privateKey
      );
    }
  }

  private async getEpoch() {
    const { epoch } = await client.getLatestSuiSystemState();
    this.epoch = {
      currentEpoch: Number(epoch),
      maxEpoch: Number(epoch) + 10,
    };
  }

  private async genNone() {
    let randomness = window.sessionStorage.getItem("randomness");
    if (randomness === null) {
      randomness = generateRandomness();
      window.sessionStorage.setItem("randomness", randomness);
    }

    const nonce = generateNonce(
      this.publicKey,
      this.epoch.maxEpoch,
      randomness
    );

    this.nonce = {
      randomness,
      currentNonce: nonce,
    };
  }

  async signInWithGoogle() {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: "id_token",
      scope: "openid",
      nonce: this.nonce.currentNonce,
    });
    const loginURL = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    // window.location.replace(loginURL);
    window.location.href = loginURL;
  }

  async requestTestSUIToken() {
    await fetch(SUI_DEVNET_FAUCET, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        mode: "no-cors",
      },
      body: JSON.stringify({
        FixedAmountRequest: {
          recipient: this.userAddress,
        },
      }),
    });
  }

  private async genPartialZkLoginSignature() {
    if (!this.id_token) {
      throw new Error("jwtString is not defined");
    }

    const zkProofResult = await fetch(PROVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jwt: this.id_token,
        extendedEphemeralPublicKey: this.extendedEphemeralPublicKey,
        maxEpoch: this.epoch.maxEpoch,
        jwtRandomness: this.nonce.randomness,
        salt: this.salt,
        keyClaimName: "sub",
      }),
    }).then((res) => res.json());

    this.partialZkLoginSignature = zkProofResult as PartialZkLoginSignature;
  }

  private get addressSeed() {
    if (this.jwtPayload == null) {
      throw new Error("jwtPayload is not defined");
    }

    return genAddressSeed(
      BigInt(this.salt),
      "sub",
      this.jwtPayload.sub!,
      this.jwtPayload.aud as string
    ).toString();
  }

  genZkLoginSignature(signature: string) {
    if (!this.initialized) {
      throw new Error("not initialized");
    }

    if (!this.partialZkLoginSignature) {
      throw new Error("partialZkLoginSignature is not defined");
    }

    return getZkLoginSignature({
      inputs: {
        ...this.partialZkLoginSignature,
        addressSeed: this.addressSeed,
      },
      maxEpoch: this.epoch.maxEpoch,
      userSignature: signature,
    }) as SerializedSignature;
  }
}
