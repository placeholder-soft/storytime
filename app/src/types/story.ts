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
  sceneNumber: number;
  sceneTitle: string;
  sceneDescription: string;
  optionsPrompt: string;
  options: string[];
};

export type Scene = {
  type: "story-introduction" | "story-followup" | "story-ending";
  sceneNumber: number;
  sceneTitle: string;
  sceneImage: string;
  sceneDescription: string;
  optionsPrompt: string;
  options: string[];
};
