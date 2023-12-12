/* eslint-disable @typescript-eslint/no-explicit-any */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { CloudFunctionsType } from "model/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5u-ixCc7dVVBTRWLzan0fyYZ_WchqhUA",
  authDomain: "storytime-web3.firebaseapp.com",
  projectId: "storytime-web3",
  storageBucket: "storytime-web3.appspot.com",
  messagingSenderId: "78105453039",
  appId: "1:78105453039:web:6a26d0837ad1285241561a",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, 'asia-east1');

export async function callFunction<Name extends keyof CloudFunctionsType>(
  name: Name,
  ...args: Parameters<CloudFunctionsType[Name]>
): Promise<ReturnType<CloudFunctionsType[Name]>> {
  return await httpsCallable(
    functions,
    "execute",
  )({
    type: name,
    args,
  }).then((a) => a.data as any);
}

const useEmulator = import.meta.env.VITE_USE_EMULATOR === "true";

if (useEmulator) {
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "localhost", 8080);
  connectFunctionsEmulator(functions, "localhost", 5001);
}
