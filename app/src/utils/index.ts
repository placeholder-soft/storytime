export const getStoryTemplate = (customPrompt: string) =>
  encodeURI(
    `Respond with markdown format and highlight list out each section.

Create a choose your own adventure game with 6 scenes with each scene having 3 choices for the user that are both fun and engaging. 

Here is the structure for the storybook and an example:

Structure
Title
Character
Setting
Introduction
Scenes description followed by user choices. (Scene should be 4-5 sentences max). 
Conclusion

Example:
Title: "The Enchanted Forest Adventure"

Character: A clever and resourceful rabbit named Remy.

Setting: A whimsical world where nature and magic intertwine, filled with talking animals, mystical plants, and hidden paths.

Introduction: "In a world where every leaf and stone tells a story, Remy, a clever and resourceful rabbit, is about to embark on an unexpected journey. Known for his wit and curiosity, Remy lives in a cozy burrow near the Enchanted Glade. One morning, he finds a mysterious map leading to an unknown destination. His adventure begins with a choice of where to go first."

Scene 1: The Mysterious Map
Remy examines the map and notices three landmarks:

1. The Silver Lake: A shimmering lake known for its reflective waters that show visions.
2. The Whispering Woods: A dense forest where the trees are said to hold ancient wisdom.
3. The Moonlit Meadow: A tranquil meadow that glows under the moon, rumored to be a place of magic.
Where should Remy start his adventure? [Type 'Lake', 'Woods', or 'Meadow']

Let me know your choice, and we'll continue the story from there!

Stop after each scene for user to type their input. As an user, I can play the game here by responding with a choice. 

The Character is a ${customPrompt} named Gary for this new story
`.trim()
  );
