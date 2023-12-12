import admin from "firebase-admin";

import adminKey from "./credentials/admin-key.json";

admin.initializeApp({
  credential: admin.credential.cert(adminKey as any),
});

export const firestore = admin.firestore();
