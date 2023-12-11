import { createElement, FC, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { auth } from "../firebase.ts";
import { Navigate } from "react-router";

export function protectedRoute<T extends { user: User }>(component: FC<T>) {
  function ProtectedRoute(props: T) {
    const [user, setUser] = useState<User | null | undefined>(auth.currentUser);
    useEffect(() => {
      return auth.onAuthStateChanged((user) => setUser(user));
    }, []);
    if (user === undefined) {
      return <div>Loading...</div>;
    }
    if (user == null) {
      return <Navigate to="/" />;
    }
    return createElement(component, {
      ...props,
      user,
    });
  }
  return ProtectedRoute;
}
