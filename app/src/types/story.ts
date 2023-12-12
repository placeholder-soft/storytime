export enum StoryProgressPromptRole {
  System = "system",
  User = "user",
  Assistant = "assistant",
}
export type StoryProgress = {
  role: StoryProgressPromptRole;
  content: string;
};

type SceneOption = {
  content: string;
  value: string;
};

export type Scene = {
  index: number;
  content: string;
  options: SceneOption[];
  imageUrl: string;
};
