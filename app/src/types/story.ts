export enum StoryProgressPromptRole {
  System = "system",
  User = "user",
  Assistant = "assistant",
}
export type StoryProgress = {
  role: StoryProgressPromptRole;
  content: string;
};

export type RawScene = {
  title: string; // project
  introduction: string; // project
  type: "story-introduction" | "story-followup" | "story-ending";
  character: string;
  setting: string;
  sceneNumber: number;
  sceneTitle: string;
  sceneDescription: string;
  optionPrompt: string;
  options: string[];
};

export type Scene = {
  //   title: string; // project
  //   introduction: string; // project
  type: "story-introduction" | "story-followup" | "story-ending";
  character: string;
  setting: string;
  sceneNumber: number;
  sceneTitle: string;
  sceneImage: string;
  sceneDescription: string;
  optionPrompt: string;
  options: string[];
};
