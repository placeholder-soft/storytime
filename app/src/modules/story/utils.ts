import { RawScene, Scene } from "../../types/story";

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
    const markdownStripped = stripMarkdown(content);
    cont = JSON.parse(markdownStripped) as RawScene;
  } catch (e) {
    console.log(e);
  }
  return {
    type: cont.type,
    character: cont.character,
    setting: cont.setting,
    sceneNumber: cont.sceneNumber,
    sceneImage: "", // generate in next step
    sceneTitle: cont.sceneTitle,
    sceneDescription: cont.sceneDescription,
    optionPrompt: cont.optionPrompt,
    options: cont.options,
  };
};

export const parseStoryGuideline = (
  content: string,
): { title: string; introduction: string; scene: Scene } => {
  // TODO: parse the story title, coverImage, intro and first `Scene` type out of AI generated content
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cont: any = {};
  try {
    cont = JSON.parse(content) as RawScene;
  } catch (e) {
    console.log(e);
  }
  return {
    title: cont.title,
    introduction: cont.introduction,
    // coverImageUrl: "",  // TODO: get from other service
    scene: {
      type: cont.type,
      character: cont.character,
      setting: cont.setting,
      sceneNumber: cont.sceneNumber,
      sceneTitle: cont.sceneTitle,
      sceneImage: "", // generate in next step
      sceneDescription: cont.sceneDescription,
      optionPrompt: cont.optionPrompt,
      options: cont.options,
    },
  };
};
