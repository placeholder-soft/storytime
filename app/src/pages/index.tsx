import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  User,
} from "firebase/auth";
import { auth } from "../firebase.ts";

export default function App() {
  const [user, setUser] = useState<User | null>();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);
  if (user === undefined) {
    return <div>Loading...</div>;
  }
  if (user != null) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <div>
      <button
        onClick={async () => {
          const provider = new GoogleAuthProvider();
          await signInWithPopup(auth, provider);
        }}
      >
        Continue with Google
      </button>
    </div>
  );
}
