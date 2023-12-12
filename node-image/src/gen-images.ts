import { OpenAI } from "openai";
async function generateImage() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: `
"
Style descriptions:
Pan out wider and make the scene a bit larger, plump character, cute style, character sheet, illustration for book, children's book, watercolor clipart, full Illustration, 4k, sharp focus, watercolor, smooth soft skin, symmetrical, soft lighting, detailed face, concept art, watercolor style, strybk, children's style fairy tales, chibi kawaii, . Octane rendering, 3d, perfect face, detailed face, delicate face, perfect sharp lips, detailed eyes. Craig Davison, Aubrey Beardsley, Conrad Roset, Aikut Aidogdu, Agnes Cecil, watercolor style

Character Design descriptions:
A brave and inquisitive bear named Remy with a patchwork satchel, adorned with twinkling stars

Setting Design descriptions:
A mystical realm where the sky ripples with auroras, and a hidden celestial event known as the Starfall brings magical gems to the world below

Introduction: 
Remy is a bear known throughout the Whispering Glens for his compassionate heart and adventurous spirit. His lush, dense fur is as dark as the night sky, with a patch of white on his chest resembling a shooting star. With his trusty satchel that seems to twinkle with the light of constellations, Remy stumbles upon an ancient scroll that speaks of a rare phenomenon—the Starfall—which is about to happen tonight. The gem that falls from above is said to grant the heart's deepest wish to the one who finds it. As the edges of the horizon blush with the colors of dusk, Remy wonders where he should begin.

past:
"sceneNumber": 2,
"sceneTitle": "The Great Plains Watch",
"sceneDescription": "With the fading sunlight casting golden hues over the expansive Great Plains, Remy feels the thrum of anticipation in the air. Here, the sky is a grand canvas, and the coming night promises to splash it with the vibrant colors of stars. Tall grasses sway gently, as if bowing to the majesty of the night sky. Fireflies begin their nightly dance, their soft glow a prelude to the Starfall.\n\nAs Remy waits, he notices three distinct glimmers on the horizon:\n\n1. A pulsating light near a circle of stones, emanating an otherworldly hum.\n\n2. A quiet glade that seems to cradle a gentle silver glow, warm and inviting.\n\n3. A sequence of rhythmic flashes atop a distant hill, like a coded message waiting to be deciphered.",
"optionsPrompt": "Which glimmer should Remy investigate as a potential sign of the Starfall gem?",
"options": ["Circle of Stones", "Silver Glade", "Flashing Hill"]

current:
"sceneNumber": 3,
"sceneTitle": "Circle of Stones Mystery",
"sceneDescription": "Remy approaches the ancient Circle of Stones with reverence. The stones are arranged in a precise formation, and each monolith is inscribed with runes that shimmer under the moonlight like dewdrops. The pulsating light grows stronger, and the hum turns into a harmonic melody that resonates with Remy's heart.\n\nIn the center of the circle lies a peculiar pedestal with three indentations. Around the pedestal, the ground is scattered with unusual objects:\n\n1. A feather that glows with a soft blue light, delicate and otherworldly.\n\n2. A crystal emitting a pulsating red aura, warm and powerful to the touch.\n\n3. A small, perfectly round orb that seems to absorb the surrounding light, cloaked in shadow.",
"optionsPrompt": "Which object should Remy place on the pedestal to possibly reveal the Starfall gem?",
"options": ["Glowing Feather", "Pulsating Crystal", "Shadow Orb"]

Generate image base on current scene while ensuring the options are in the scene. Ensure the character is accurate to the description and use the descriptions defined in the style, and setting section
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
