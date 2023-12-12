/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCall, onRequest, Request } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { OpenAI } from "openai";
import * as express from "express";

import admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";
import got from "got-cjs";
import { nanoid } from "nanoid";

import adminKey from "./credentials/admin-key.json";
admin.initializeApp({
  credential: admin.credential.cert(adminKey as any),
});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const execute = onCall({ region: "asia-east1" }, (request) => {
  logger.info("Hello logs!", { structuredData: true });
  return {
    data: "Hello from Firebase!",
  };
});
const openai = new OpenAI({
  apiKey: "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",
});
const generateImage = async (req: Request, resp: express.Response) => {
  const prompt = req.body.prompt;
  if (prompt == null || prompt.length === 0) {
    throw new Error("prompt is required");
  }

  const generateImageResponse = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1792x1024",
  });

  const imageUrl = generateImageResponse.data[0].url;
  const revised_prompt = generateImageResponse.data[0].revised_prompt;

  const bucket = getStorage().bucket("storytime-ai-images");
  // response.send(generateImageResponse);

  // Validate imageUrl
  if (!imageUrl) {
    resp.status(400).send("No image URL provided.");
    return;
  }

  try {
    const response = await fetch(imageUrl);

    // Check if image fetch was successful
    if (!response.ok)
      throw new Error(`Unable to fetch image: ${response.statusText}`);
    // Create a reference in Firebase Storage
    const fileName = `images/${Date.now()}-${nanoid()}.png`;
    const file = bucket.file(fileName);

    const writeStream = file.createWriteStream();

    got
      .stream(imageUrl)
      .on("error", (error) => {
        resp.status(500).send(`Error downloading image: ${error.message}`);
      })
      .pipe(writeStream)
      .on("finish", () => {
        file
          .getSignedUrl({
            action: "read",
            expires: "03-09-2491", // You can provide an expiry date for the URL
          })
          .then((signedUrls) => {
            // signedUrls[0] contains the file's public URL
            resp.status(200).send({ image_url: signedUrls[0], revised_prompt });
          })
          .catch((error) => {
            resp.status(500).send(`Error getting signed URL: ${error.message}`);
          });
      })
      .on("error", (error) => {
        resp
          .status(500)
          .send(`Error uploading image to Firebase Storage: ${error.message}`);
      });
  } catch (error) {
    resp.status(500).send(`Error downloading image: ${error}`);
  }
};

export const request = onRequest(
  {
    memory: "4GiB",
    region: "asia-east1",
    invoker: "public",
    minInstances: 1,
    timeoutSeconds: 3600,
  },
  (request, response) => {
    if (request.path === "/generate-image") {
      generateImage(request, response);
    } else {
      response.status(200).send({
        routes: ["/generate-image"],
      });
    }
  }
);
