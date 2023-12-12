import { OpenAI } from "openai";
async function generateImage() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: `
    do not generate paragraph text in the image.
    "Style descriptions": "Pan out wider and make the scene a bit larger, plump character, cute style, character sheet, illustration for book, children's book, watercolor clipart, full Illustration, 4k, sharp focus, watercolor, smooth soft skin, symmetrical, soft lighting, detailed face, concept art, watercolor style, strybk, children's style fairy tales, chibi kawaii, . Octane rendering, 3d, perfect face, detailed face, delicate face, perfect sharp lips, detailed eyes. Craig Davison, Aubrey Beardsley, Conrad Roset, Aikut Aidogdu, Agnes Cecil, watercolor style"
    "character": "A friendly and adventurous bear named Jesse with a blue scarf and a love for honey",
    "setting": "A vibrant forest filled with sweet birdsong, gentle brooks, and flowers that dance in the sunlight, creating an inviting and playful world for all inhabitants",
    "sceneDescription": "Jesse arrives at the Berry Bushes and the air is sweet. He spots three unusual bushes:\n\n1. Blue Sparkleberries that twinkle in the light.\n\n2. Sunshine Berriesthat glow with warmth.\n\n3. Laughing Berries that wiggle when giggled at.",
    "Image prompt": "A curious bear named Jesse is now amidst lush Berry Bushes, each type of berry offering a unique marvel. The Sparkleberries shimmer like little stars amidst the greenery, the Sunshine Berries radiate a cozy warmth that can be felt even from little paws' reach, and the playful Laughing Berries jiggle to the forest's gentle laughter. Jesse can't help but be enticed by the colors and the promises of each bush’s special treat."
    `,
    n: 1,
    size: "1792x1024",
  });

  console.log(`response: ${JSON.stringify(response, null, 2)}`);
}

async function main() {
  await Promise.all([0, 1, 2, 3].map(() => generateImage()));
}

main();
