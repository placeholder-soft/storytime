import { CloudFunctionsTypeWithUid } from "./handlersType";
import { getStorage } from "firebase-admin/storage";
import { nanoid } from "nanoid";
import got from "got-cjs";
import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateImage: CloudFunctionsTypeWithUid["generateImage"] = async (
  prompt,
  uid
) => {
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
    throw new Error("No image URL provided.");
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

    return new Promise((resolve, reject) => {
      got
        .stream(imageUrl)
        .on("error", (error) => {
          throw new Error(`Error downloading image: ${error.message}`);
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
              console.log(`[${uid}]generated image using prompt: 
${prompt}  
image_url: 
${signedUrls[0]}
revised_prompt:
${revised_prompt ?? ""}
  `);
              resolve({
                image_url: signedUrls[0],
                revised_prompt: revised_prompt ?? "",
              });
            })
            .catch((error) => {
              reject(new Error(`Error getting signed URL: ${error.message}`));
            });
        })
        .on("error", (error) => {
          reject(
            new Error(
              `Error uploading image to Firebase Storage: ${error.message}`
            )
          );
        });
    });
  } catch (error) {
    throw new Error(`Error downloading image: ${error}`);
  }
};
