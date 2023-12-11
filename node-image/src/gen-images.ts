import { OpenAI } from "openai";
async function generateImage() {
  const openai = new OpenAI({
    apiKey: "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",
  });

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: `
"
History: 
Here is the image of Remy, the small bear dressed in a spacesuit, inside a spaceship. The scene shows Remy gazing at a holographic display, which presents three adventurous options: the Asteroid Belt of Wonders, the Nebula of Forgotten Tales, and the Comet Tail Arena. The image captures Remy's excitement and thoughtfulness as he ponders his next adventure in space, with the spaceship's futuristic interior and the holographic display casting a gentle light on his face. This scene encapsulates the magic and excitement of space exploration, making it suitable for a children's storybook.

Current:
Scene 2: The Comet Tail Arena
Remy, feeling the thrill of speed and excitement, chooses to steer his spaceship towards the Comet Tail Arena. Known throughout the galaxy as a place where cosmic races are held by the most daring thrill-seekers, the Comet Tail Arena promises an adrenaline-filled adventure.

As Remy approaches, he sees a dazzling array of comets streaking across the starry backdrop, each trailing a brilliant tail of colors. The Arena is buzzing with activity, with various spacecraft preparing for the next high-speed race.

Remy now faces a few choices:

Join the Race: He could enter his spaceship in the upcoming cosmic race, testing his skills against other galactic racers.
Watch and Learn: Observe the race from a safe distance to learn the tricks and tactics of experienced racers.
Meet Other Racers: Interact with other participants, gaining friends and insights into the life of a cosmic racer.
What should Remy do at the Comet Tail Arena? [Type 'Race', 'Watch', or 'Meet']

Generate image base on current scene:
    `,
    n: 1,
    size: "1024x1024",
  });

  console.log(`response: ${JSON.stringify(response, null, 2)}`);
}

generateImage();
