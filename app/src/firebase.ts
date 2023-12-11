// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5u-ixCc7dVVBTRWLzan0fyYZ_WchqhUA",
  authDomain: "storytime-web3.firebaseapp.com",
  projectId: "storytime-web3",
  storageBucket: "storytime-web3.appspot.com",
  messagingSenderId: "78105453039",
  appId: "1:78105453039:web:6a26d0837ad1285241561a"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
