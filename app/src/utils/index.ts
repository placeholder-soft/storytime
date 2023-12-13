import dedent from "dedent";

const sceneAmount = Number(localStorage.getItem("sceneAmount") || "6");

export const getStoryTemplate = ({
  characterType,
  characterName,
}: {
  characterType: string;
  characterName: string;
}) =>
  dedent`Respond with JSON format, don't output any other content except the JSON, don't wrap the JSON with markdown syntax

  Create a choose-your-own adventure game that lasts ${sceneAmount} scenes where each scene's choice will lead to the next scene. Each scene having 3 choices for the user to choose from that is both fun and engaging. 
  
  Story Requirements:
  - Ensure the the character aesthetic is well defined with tons of description and the setting has the scenery very detailed.
  - The story should be tailored for kids under 12 years old so the language can not be too complicated with difficult words.
  - Make sure the story has some conflict, character development and progression.
  - Reduce the complexity of the words so a child can understand.
  - Each scene should should be no more than 4 sentences
  
  Here is the structure for the storybook (in typescript interface format) and an example:
  
  \`\`\`
  type MarkdownText = string
  type Option = string
  interface StorybookIntro extends StorybookFollowup {
    type: "story-introduction"
    title: string
    character: string
    setting: string
    introduction: string
  }
  interface StorybookFollowup {
    type: "story-followup"
    sceneNumber: number
    sceneTitle: string
    sceneDescription: MarkdownText
    optionsPrompt: string
    options: [
      Option,
      Option,
      Option,
    ]
  }
  interface StorybookEnding {
    type: "story-ending"
    sceneNumber: number
    sceneTitle: string
    sceneDescription: MarkdownText
  }
  \`\`\`
  
  Example 1:
  
  {
    "type": "story-introduction",
    "title": "The Enchanted Forest Adventure",
    "character": "A clever and resourceful rabbit named Remy with a top hat and a red bowtie",
    "setting": "A whimsical world where nature and magic intertwine, filled with talking animals, mystical plants, and hidden paths that brings about a pleasant and warm atmosphere",
    "introduction": "In a world where every leaf and stone tells a story, Remy, a clever and resourceful rabbit, is about to embark on an unexpected journey. Known for his wit and curiosity, Remy lives in a cozy burrow near the Enchanted Glade. One morning, he finds a mysterious map leading to an unknown destination. His adventure begins with a choice of where to go first.",
    "sceneNumber": 1,
    "sceneTitle": "The Mysterious Map",
    "sceneDescription": "Remy examines the map and notices three landmarks:\n\n1. The Silver Lake: A shimmering lake known for its reflective waters that show visions.\n\n2. The Whispering Woods: A dense forest where the trees are said to hold ancient wisdom.\n\n3. The Moonlit Meadow: A tranquil meadow that glows under the moon, rumored to be a place of magic.",
    "optionsPrompt": "Where should Remy start his adventure?",
    "options": ["Lake", "Woods", "Meadow"]
  }
  
  ---------- Example 1 end ---------
  
  Example 2:
  
  {
    "type": "story-followup",
    "sceneNumber": 2,
    "sceneTitle": "The Mysterious Map",
    "sceneDescription": "Remy examines the map and notices three landmarks:\n\n1. The Silver Lake: A shimmering lake known for its reflective waters that show visions.\n\n2. The Whispering Woods: A dense forest where the trees are said to hold ancient wisdom.\n\n3. The Moonlit Meadow: A tranquil meadow that glows under the moon, rumored to be a place of magic.",
    "optionsPrompt": "Where should Remy start his adventure?",
    "options": ["Lake", "Woods", "Meadow"]
  }
  
  ---------- Example 2 end ---------
  
  Example 3:
  
  {
    "type": "story-ending",
    "sceneNumber": 5,
    "sceneTitle": "The Mysterious Map",
    "sceneDescription": "Gary, reflecting on his experiences throughout the quest, realizes that true treasure lies not in solitary glory, but in sharing triumphs with others. With care, he transports the Golden Lettuce back to his community. His return is celebrated, and the lettuce's seeds bring prosperity to the garden.\n\nGary's act of kindness becomes a tale told from one generation to the next, inspiring countless other snails to live a life of bravery, adventure, and most importantly, generosity."
  }
  
  ---------- Example 3 end ---------
  
  Ensure that after each scene the user has to type their input. As a user, I can play the game here by responding with a choice. Make sure to stop after scene 1. 
  
  The Character is a ${characterType} named ${characterName} for this new story`;
