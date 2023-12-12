/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { HttpsError, onCall, onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { generateImage } from "./generateImage";
import admin from "firebase-admin";

import adminKey from "./credentials/admin-key.json";
import { CloudFunctionsTypeWithUid } from "./handlersType";
import { getStory } from "./getStory";
import { gaslessMint } from "./gaslessMint";

export * from "./serve";

admin.initializeApp({
  credential: admin.credential.cert(adminKey as any),
});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript
const handlers: CloudFunctionsTypeWithUid = {
  generateImage,
  getStory,
  gaslessMint,
};

export const execute = onCall(
  {
    region: "asia-east1",
    memory: "8GiB",
    invoker: "public",
    timeoutSeconds: 3600,
  },
  async ({ data, auth }) => {
    const uid = auth?.uid;
    logger.info(data, { context: uid });
    if (!(data.type in handlers)) {
      throw new HttpsError(
        "invalid-argument",
        `Function ${data.type} does not exist`
      );
    }
    return await (handlers as any)[data.type](...data.args, uid);
  }
);
