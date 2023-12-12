import dedent from "dedent";
import { RawScene, Scene } from "../../types/story";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

function escapeJsonBug(content: string) {
  // next line break the json parser
  return content.replace(/(?:\r\n|\r|\n)/g, "");
}

function stripMarkdown(content: string) {
  // Regular expression to match Markdown JSON code block
  const regex = /^```json\n([\s\S]*?)\n```$/;

  const match = content.match(regex);
  if (match) {
    // Return the content inside the code block
    return match[1];
  } else {
    // Return the original content if no code block is found
    return content;
  }
}

export const parseScene = (content: string): Scene => {
  // TODO: parse `Scene` type out of AI generated content
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cont: any = {};
  try {
    const markdownStripped = escapeJsonBug(stripMarkdown(content));
    cont = JSON.parse(markdownStripped) as RawScene;
  } catch (e) {
    console.log(e);
  }
  return {
    type: cont.type,
    sceneNumber: cont.sceneNumber,
    sceneImage: "", // generate in next step
    sceneTitle: cont.sceneTitle,
    sceneDescription: cont.sceneDescription,
    optionsPrompt: cont.optionsPrompt,
    options: cont.options,
  };
};

export const parseStoryGuideline = (
  content: string,
): {
  title: string;
  introduction: string;
  character: string;
  setting: string;
  scene: Scene;
} => {
  // TODO: parse the story title, coverImage, intro and first `Scene` type out of AI generated content
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cont: any = {};
  try {
    const markdownStripped = escapeJsonBug(stripMarkdown(content));
    cont = JSON.parse(markdownStripped) as RawScene;
  } catch (e) {
    console.log(e);
  }
  return {
    title: cont.title,
    introduction: cont.introduction,
    character: cont.character,
    setting: cont.setting,
    scene: {
      type: cont.type,
      sceneNumber: cont.sceneNumber,
      sceneTitle: cont.sceneTitle,
      sceneImage: "", // generate in next step
      sceneDescription: cont.sceneDescription,
      optionsPrompt: cont.optionsPrompt,
      options: cont.options,
    },
  };
};

const stripScene = (scene: Scene) => {
  return {
    sceneNumber: scene.sceneNumber,
    sceneTitle: scene.sceneTitle,
    sceneDescription: scene.sceneDescription,
    optionsPrompt: scene.optionsPrompt,
    options: scene.options,
  };
};

type MakePromptInput = {
  character: string;
  setting: string;
  introduction: string;
  pastScene?: Scene;
  currentScene: Scene;
};
export const makeImagePrompt = ({
  character,
  setting,
  introduction,
  pastScene,
  currentScene,
}: MakePromptInput) => {
  const pastSceneStr = pastScene
    ? `
  past:
  ${JSON.stringify(stripScene(pastScene))}`
    : "";

  const currentSceneStr = currentScene
    ? `
  current:
  ${JSON.stringify(stripScene(currentScene))}`
    : "";

  return dedent`
  Style descriptions:
Pan out wider and make the scene a bit larger, plump character, cute style, character sheet, illustration for book, children's book, watercolor clipart, full Illustration, 4k, sharp focus, watercolor, smooth soft skin, symmetrical, soft lighting, detailed face, concept art, watercolor style, strybk, children's style fairy tales, chibi kawaii, . Octane rendering, 3d, perfect face, detailed face, delicate face, perfect sharp lips, detailed eyes. Craig Davison, Aubrey Beardsley, Conrad Roset, Aikut Aidogdu, Agnes Cecil, watercolor style

Character Design descriptions:
${character}

Setting Design descriptions:
${setting}

Introduction: 
${introduction}

${pastSceneStr}

${currentSceneStr}

Generate image base on current scene while ensuring the options are in the scene. Ensure the character is accurate to the description and use the descriptions defined in the style, and setting section
  `;
};

export const splitDesc = (content: string) => {
  const [desc, options] = content.split("1.");
  const [option1, otherOptions] = options.split("2. ");
  const [option2, option3] = otherOptions.split("3. ");
  return [`${desc}`, `1.${option1}`, `2. ${option2}`, `3. ${option3}`];
};
