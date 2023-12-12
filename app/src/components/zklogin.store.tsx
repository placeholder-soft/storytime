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
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

const CLIENT_ID =
  "78105453039-rc9sdmkol2dej5u365dfgq6bjeopmu0f.apps.googleusercontent.com";

export const SUI_DEVNET_FAUCET = "https://faucet.devnet.sui.io/gas";

export const PROVER_URL = "https://prover-dev.mystenlabs.com/v1";

export const client = new SuiClient({ url: getFullnodeUrl("devnet") });

export type PartialZkLoginSignature = Omit<
  Parameters<typeof getZkLoginSignature>["0"]["inputs"],
  "addressSeed"
>;

export class ZKLoginStore {
  public initialized = false;

  ephemeralKeyPair!: Ed25519Keypair;
  epoch?: {
    currentEpoch: number;
    maxEpoch: number;
  };
  nonce?: {
    randomness: string;
    currentNonce: string;
  };

  client?: ZKLoginClient;

  constructor(readonly info?: { salt: string; id_token: string }) {
    void this.initialize();
  }

  resetStorage() {
    window.sessionStorage.removeItem("ephemeralKeyPair");
    window.sessionStorage.removeItem("randomness");
  }

  private async initialize() {
    this.genEphemeralKeyPair();
    await this.getEpoch();
    this.genNone();

    if (this.info != null) {
      this.client = new ZKLoginClient(this, this.info.salt, this.info.id_token);
    }

    this.initialized = true;
  }

  private get publicKey() {
    return this.ephemeralKeyPair.getPublicKey();
  }

  get extendedEphemeralPublicKey() {
    return getExtendedEphemeralPublicKey(this.ephemeralKeyPair.getPublicKey());
  }

  private genEphemeralKeyPair() {
    const ephemeralKeyPair = window.sessionStorage.getItem("ephemeralKeyPair");

    if (ephemeralKeyPair) {
      this.ephemeralKeyPair = Ed25519Keypair.fromSecretKey(
        fromB64(ephemeralKeyPair),
      );
    } else {
      this.ephemeralKeyPair = Ed25519Keypair.generate();
      window.sessionStorage.setItem(
        "ephemeralKeyPair",
        this.ephemeralKeyPair.export().privateKey,
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

  private genNone() {
    if (this.epoch == null) {
      throw new Error("epoch is not defined");
    }

    let randomness = window.sessionStorage.getItem("randomness");
    if (randomness === null) {
      randomness = generateRandomness();
      window.sessionStorage.setItem("randomness", randomness);
    }

    const nonce = generateNonce(
      this.publicKey,
      this.epoch.maxEpoch,
      randomness,
    );

    this.nonce = {
      randomness,
      currentNonce: nonce,
    };
  }

  async signInWithGoogle(from: string) {
    if (this.nonce == null) {
      throw new Error("nonce is not defined");
    }

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: from,
      response_type: "id_token",
      scope: "openid email",
      nonce: this.nonce.currentNonce,
    });
    const loginURL = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    // window.location.replace(loginURL);
    window.location.href = loginURL;
  }
}

class ZKLoginClient {
  private readonly jwtPayload: JwtPayload;

  private partialZkLoginSignature: PartialZkLoginSignature | undefined;

  constructor(
    readonly store: ZKLoginStore,
    readonly salt: string,
    readonly id_token: string,
  ) {
    this.jwtPayload = jwtDecode(id_token);

    console.log(this.jwtPayload);

    this.initailize();
  }

  private async initailize() {
    await this.genPartialZkLoginSignature();
  }

  get userAddress() {
    const zkLoginUserAddress = jwtToAddress(this.id_token, this.salt);
    return zkLoginUserAddress;
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

    if (!this.store.nonce || !this.store.epoch) {
      throw new Error("nonce or epoch is not defined");
    }

    const zkProofResult = await fetch(PROVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jwt: this.id_token,
        extendedEphemeralPublicKey: this.store.extendedEphemeralPublicKey,
        maxEpoch: this.store.epoch.maxEpoch,
        jwtRandomness: this.store.nonce.randomness,
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
      this.jwtPayload.aud as string,
    ).toString();
  }

  genZkLoginSignature(signature: string) {
    if (!this.store.epoch) {
      throw new Error("epoch is not defined");
    }

    if (!this.partialZkLoginSignature) {
      throw new Error("partialZkLoginSignature is not defined");
    }

    return getZkLoginSignature({
      inputs: {
        ...this.partialZkLoginSignature,
        addressSeed: this.addressSeed,
      },
      maxEpoch: this.store.epoch.maxEpoch,
      userSignature: signature,
    }) as SerializedSignature;
  }
}

export const upsertSalt = async (id_token: string) => {
  const credential = GoogleAuthProvider.credential(id_token);
  await signInWithCredential(auth, credential);

  if (auth.currentUser?.uid == null) {
    throw new Error("auth.currentUser?.uid is not defined");
  }
  const docRef = doc(db, "users", auth.currentUser.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();

    if (data?.salt) {
      return data.salt;
    }
  }

  const salt = generateRandomness();

  setDoc(
    docRef,
    {
      salt,
    },
    { merge: true },
  );

  return salt;
};
