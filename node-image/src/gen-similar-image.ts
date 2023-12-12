import { OpenAI } from "openai";
import fs from "fs";
import https from "https";
import path from "path";
import axios from "axios";

async function generateImage() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const imageUrl =
    "https://oaidalleapiprodscus.blob.core.windows.net/private/org-sMVCvXvcT7PAXAmQ5TCWuLxU/user-WAixhGdYFu8QBBDaL4Jg69ou/img-fMgEaas9pdZzbokaEIRtlYWX.png?st=2023-12-11T15%3A10%3A43Z&se=2023-12-11T17%3A10%3A43Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-12-10T23%3A27%3A31Z&ske=2023-12-11T23%3A27%3A31Z&sks=b&skv=2021-08-06&sig=l/DPpIVJCkc2TCchVAkMyqbo9GoarAZ4OaOjNckZF8M%3D";

  try {
    const response = await openai.images.createVariation({
      image: await fetch(imageUrl),
      n: 4,
      size: "1024x1024",
    });

    console.log(`response: ${JSON.stringify(response, null, 2)}`);
  } catch (error) {
    console.error(`Failed to generate image variation: ${error}`);
  }
}

generateImage();
