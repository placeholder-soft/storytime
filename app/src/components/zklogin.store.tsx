/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { TransactionBlock } from "@mysten/sui.js/transactions";

const network = "devnet";

const CLIENT_ID =
  "78105453039-rc9sdmkol2dej5u365dfgq6bjeopmu0f.apps.googleusercontent.com";

export const SUI_DEVNET_FAUCET = `https://faucet.${network}.sui.io/gas`;

export const PROVER_URL = "https://prover-dev.mystenlabs.com/v1";

export const client = new SuiClient({ url: getFullnodeUrl(network) });

export type PartialZkLoginSignature = Omit<
  Parameters<typeof getZkLoginSignature>["0"]["inputs"],
  "addressSeed"
>;

export class ZKLoginStore {
  public initialized = false;

  ephemeralKeyPair!: Ed25519Keypair;
  epoch?: number;
  nonce?: string;
  randomness?: string;

  client?: ZKLoginClient;

  constructor() {
    void this.initialize();
  }

  resetStorage() {
    window.localStorage.removeItem("ephemeralKeyPair");
    window.localStorage.removeItem("randomness");
    window.localStorage.removeItem("epoch");
  }

  private async initialize() {
    this.genEphemeralKeyPair();
    await this.getEpoch();
    this.genNonce();

    this.initialized = true;
  }

  initializeClient(info: { salt: string; id_token: string }) {
    if (info == null) {
      throw new Error("info is not defined");
    }

    this.client = new ZKLoginClient(this, info.salt, info.id_token);
  }

  private get publicKey() {
    return this.ephemeralKeyPair.getPublicKey();
  }

  get extendedEphemeralPublicKey() {
    return getExtendedEphemeralPublicKey(this.ephemeralKeyPair.getPublicKey());
  }

  private genEphemeralKeyPair() {
    const ephemeralKeyPair = window.localStorage.getItem("ephemeralKeyPair");

    if (ephemeralKeyPair) {
      this.ephemeralKeyPair = Ed25519Keypair.fromSecretKey(
        fromB64(ephemeralKeyPair),
      );
    } else {
      const ephemeralKeyPair = Ed25519Keypair.generate();
      window.localStorage.setItem(
        "ephemeralKeyPair",
        ephemeralKeyPair.export().privateKey,
      );
      this.ephemeralKeyPair = ephemeralKeyPair;
    }
    console.log("privateKey: ", this.ephemeralKeyPair.export().privateKey);
  }

  get maxEpoch() {
    if (this.epoch == null) {
      throw new Error("epoch is not defined");
    }

    return this.epoch + 1000;
  }

  private async getEpoch() {
    const epoch = window.localStorage.getItem("epoch");

    if (epoch) {
      this.epoch = parseInt(epoch);
      return;
    }

    const res = await client.getLatestSuiSystemState();

    window.localStorage.setItem("epoch", res.epoch);
    this.epoch = parseInt(res.epoch);
  }

  private genNonce() {
    if (this.epoch == null) {
      throw new Error("epoch is not defined");
    }

    let randomness = window.localStorage.getItem("randomness");
    if (randomness === null) {
      randomness = generateRandomness();
      window.localStorage.setItem("randomness", randomness);
    }

    const nonce = generateNonce(this.publicKey, this.maxEpoch, randomness);

    console.log({ randomness, nonce, maxEpoch: this.maxEpoch });

    this.randomness = randomness;
    this.nonce = nonce;
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
      nonce: this.nonce,
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

    console.log("jwtPayload: ", (this.jwtPayload as any).nonce);

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
        maxEpoch: this.store.maxEpoch,
        jwtRandomness: this.store.randomness,
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
      maxEpoch: this.store.maxEpoch,
      userSignature: signature,
    }) as SerializedSignature;
  }
}

export const getSalt = async () => {
  if (auth.currentUser?.uid == null) {
    throw new Error("auth.currentUser?.uid is not defined");
  }

  const docRef = doc(db, "users", auth.currentUser.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();

    if (data?.salt) {
      return data.salt as string;
    }
  }
};

export const insertSalt = async (id_token: string) => {
  const credential = GoogleAuthProvider.credential(id_token);
  await signInWithCredential(auth, credential);

  if (auth.currentUser?.uid == null) {
    throw new Error("auth.currentUser?.uid is not defined");
  }

  window.localStorage.setItem("id_token", id_token);

  const docRef = doc(db, "users", auth.currentUser.uid);
  const salt = await getSalt();

  if (salt) {
    return salt;
  }

  const saltValue = generateRandomness();

  await setDoc(
    docRef,
    {
      salt: saltValue,
    },
    { merge: true },
  );

  return saltValue;
};

function getSuiMintTransactionBlock(
  sender: string,
  title: string,
  imageUrl: string,
): TransactionBlock {
  const txb = new TransactionBlock();
  txb.setSender(sender);
  // txb.setGasPrice(5);
  // txb.setGasBudget(5_000_000);

  txb.moveCall({
    target: `0xe080263e8e3f6169574a24f15cec05d904dbeee9d5d5103b9c8d035efe8eb0d3::story_nft::mint`,
    arguments: [txb.pure(title), txb.pure(imageUrl)],
  });

  return txb;
}

export const suiMint = async (
  sender: string,
  store: ZKLoginStore,
  {
    title,
    imageUrl,
  }: {
    title: string;
    imageUrl: string;
  },
) => {
  const txb = getSuiMintTransactionBlock(sender, title, imageUrl);

  const result = await txb.sign({
    client,
    signer: store.ephemeralKeyPair,
  });

  const res = await client.executeTransactionBlock({
    transactionBlock: result.bytes,
    signature: store.client!.genZkLoginSignature(result.signature),
  });

  const transactionBlock = await client.waitForTransactionBlock({
    digest: res.digest,
    options: {
      showEvents: true,
      showEffects: true,
    },
  });

  const object_id = (transactionBlock.events?.[0]?.parsedJson as any)
    ?.object_id as string;

  await addDoc(collection(db, "mints"), {
    chain: "sui",
    network,
    digest: res.digest,
    object_id: object_id,
    sender,
    owner: sender,
    uid: auth.currentUser?.uid,
  });

  return `https://suiexplorer.com/object/${object_id}?network=${network}`;
};
