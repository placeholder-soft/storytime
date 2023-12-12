import { OpenAI } from "openai";
async function generateImage() {
  const openai = new OpenAI({
    apiKey: "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",
  });

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: `
"
Style descriptions:
plump, cute style, character sheet, illustration for book, children's book, watercolor clipart, full Illustration, 4k, sharp focus, watercolor, smooth soft skin, symmetrical, soft lighting, detailed face, concept art, watercolor style, strybk, children's style fairy tales, chibi kawaii, . Octane rendering, 3d, perfect face, detailed face, delicate face, perfect sharp lips, detailed eyes. Craig Davison, Aubrey Beardsley, Conrad Roset, Aikut Aidogdu, Agnes Cecil, watercolor style

Title:
Remy's Great Honey Quest

Setting Design descriptions:
A mystical realm where the sky ripples with auroras, and a hidden celestial event known as the Starfall brings magical gems to the world below

Character Design descriptions:
A brave and inquisitive bear named Remy with a patchwork satchel, adorned with twinkling stars

Introduction descriptions: 
Remy is a bear known throughout the Whispering Glens for his compassionate heart and adventurous spirit. His lush, dense fur is as dark as the night sky, with a patch of white on his chest resembling a shooting star. With his trusty satchel that seems to twinkle with the light of constellations, Remy stumbles upon an ancient scroll that speaks of a rare phenomenon—the Starfall—which is about to happen tonight. The gem that falls from above is said to grant the heart's deepest wish to the one who finds it. As the edges of the horizon blush with the colors of dusk, Remy wonders where he should begin.


Generate a children game intro with the title.
Ensure the title is on the image.
The intro should match the descriptions. 
The intro's main focus should be the character. 
Make sure the title is legible on the intro without mispelling. 
Make sure the title has a small shadow outline to ensure it can be read. 
Make sure the title is the only text on the intro.
    `,
    n: 1,
    size: "1024x1792",
  });

  console.log(`response: ${JSON.stringify(response, null, 2)}`);
}

async function main() {
  await Promise.all([0, 1, 2, 3, 4, 5].map(() => generateImage()));
}

main();
